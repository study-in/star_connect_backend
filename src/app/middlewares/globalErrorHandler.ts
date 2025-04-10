// src/app/middlewares/globalErrorHandler.ts
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import config from '../../config/index.js'; // Use .js extension
import AppError from '../../utils/AppError.js'; // Use .js extension
import { IGenericErrorMessage } from '../../interfaces/error.js'; // Use .js extension
import handleValidationError from '../../errors/handleValidationError.js'; // Use .js extension
import handleZodError from '../../errors/handleZodError.js'; // Use .js extension
import handleCastError from '../../errors/handleCastError.js'; // Use .js extension
import { errorLogger } from '../../shared/logger.js'; // Use .js extension

const globalErrorHandler = (
  err: any, // Use 'any' for broader compatibility with different error types initially
  req: Request,
  res: Response,
  next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
): void => {
  // Log the error
  if (config.env === 'development') {
    console.error('Error 💥:', err);
  } else {
     errorLogger.error('Unhandled Error:', err); // Use Winston for production logging
  }

  let statusCode = 500;
  let message = 'Something went very wrong!';
  let errorMessages: IGenericErrorMessage[] = [];
  let stack = config.env === 'development' ? err?.stack : undefined;

  // Determine error type and format response
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (err instanceof mongoose.Error.ValidationError) {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (err instanceof mongoose.Error.CastError) {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorMessages = err.message ? [{ path: '', message: err.message }] : [];
     // Keep original stack in dev for AppError if needed, controlled by stack assignment above
  } else if (err?.code === 11000) { // Mongoose duplicate key error
      // Extract field name and value more reliably
      const fieldMatch = err.message.match(/index: (.+?)_1/);
      const valueMatch = err.message.match(/dup key: { (.+?): "(.+?)" }/);
      const field = fieldMatch ? fieldMatch[1] : 'field';
      const value = valueMatch ? valueMatch[2] : 'value';
      message = `Duplicate ${field} value: "${value}". Please use another value!`;
      errorMessages = [{ path: field, message }];
      statusCode = 400; // Bad Request
  } else if (err instanceof Error) {
      message = err.message || message; // Use Error's message
      errorMessages = [{ path: '', message: message }];
       // Stack is already set based on environment
  }
   // Handle JWT errors separately if needed (could also be done in auth middleware)
   else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token. Please log in again.';
        errorMessages = [{ path: 'token', message }];
   } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Your token has expired. Please log in again.';
        errorMessages = [{ path: 'token', message }];
   }


  // Send the response
  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: stack, // Conditionally include stack trace
  });
};

export default globalErrorHandler;
