// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError'; // Assuming AppError utility exists
import mongoose from 'mongoose';

// Define a more specific Error type if needed
interface CustomError extends Error {
    statusCode?: number;
    status?: string;
    isOperational?: boolean;
    // Mongoose specific error properties
    path?: string; // For CastError, ValidationError
    value?: any; // For CastError
    code?: number; // For duplicate key error (11000)
    keyValue?: any; // For duplicate key error
    errors?: { [key: string]: mongoose.Error.ValidatorError | mongoose.Error.CastError }; // For ValidationError
}

const handleCastErrorDB = (err: CustomError): AppError => {
    const message = `Invalid ${err.path}: ${JSON.stringify(err.value)}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: CustomError): AppError => {
    // Extract field name and value more reliably
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'field';
    const value = err.keyValue ? err.keyValue[field] : 'value';
    const message = `Duplicate ${field} value: "${value}". Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err: CustomError): AppError => {
    // Extract specific error messages from Mongoose ValidationError
    const errors = err.errors ? Object.values(err.errors).map(el => el.message) : ['Validation error'];
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = (): AppError => new AppError('Invalid token. Please log in again!', 401);
const handleJWTExpiredError = (): AppError => new AppError('Your token has expired! Please log in again.', 401);


const sendErrorDev = (err: CustomError, req: Request, res: Response) => {
    // API errors
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode || 500).json({
            status: err.status || 'error',
            error: err,
            message: err.message,
            stack: err.stack
        });
    }
    // Rendered website errors (using EJS template)
    console.error('ERROR 💥', err);
    return res.status(err.statusCode || 500).render('error', {
        title: 'Something went wrong!',
        message: err.message,
        error: err // Pass full error only in dev
    });
};

const sendErrorProd = (err: CustomError, req: Request, res: Response) => {
    // A) API errors
    if (req.originalUrl.startsWith('/api')) {
        // Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode || 500).json({
                status: err.status || 'error',
                message: err.message
            });
        }
        // Programming or other unknown error: don't leak error details
        // 1) Log error
        console.error('ERROR 💥', err);
        // 2) Send generic message
        return res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }

    // B) Rendered website errors
     if (err.isOperational) {
         // Operational, trusted error: send message to client
        return res.status(err.statusCode || 500).render('error', {
            title: 'Something went wrong!',
            message: err.message,
            error: null // Don't leak details in prod
        });
    }
    // Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(500).render('error', {
        title: 'Something went wrong!',
        message: 'Please try again later.',
        error: null
    });
};


const globalErrorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    let error = { ...err, message: err.message, name: err.name }; // Create a copy, include name

    // Handle specific Mongoose errors in production
    if (process.env.NODE_ENV === 'production') {
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error); // Mongoose duplicate key error
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    }

    // Send response based on environment
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(error, req, res);
    } else { // NODE_ENV === 'production' or other
        sendErrorProd(error, req, res);
    }
};

export default globalErrorHandler;
