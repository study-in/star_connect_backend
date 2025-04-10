// src/errors/handleCastError.ts
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { IGenericErrorMessage } from '../interfaces/error.js'; // Use .js
import { IGenericErrorResponse } from '../interfaces/common.js'; // Use .js

const handleCastError = (
  error: mongoose.Error.CastError
): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = [
    {
      path: error.path || '', // Ensure path is a string
      message: `Invalid ${error.path || 'ID'}: ${error.value}`, // More specific message
    },
  ];

  const statusCode = httpStatus.BAD_REQUEST; // 400
  return {
    statusCode,
    message: 'Invalid ID / Cast Error', // Clearer message
    errorMessages: errors,
  };
};

export default handleCastError;
