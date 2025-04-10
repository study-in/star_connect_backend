// src/errors/handleValidationError.ts
import mongoose from 'mongoose';
import { IGenericErrorMessage } from '../interfaces/error.js'; // Use .js
import { IGenericErrorResponse } from '../interfaces/common.js'; // Use .js
import httpStatus from 'http-status';

const handleValidationError = (
  err: mongoose.Error.ValidationError
): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = Object.values(err.errors).map(
    (el: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: el?.path || '', // Ensure path is a string
        message: el?.message || 'Validation failed',
      };
    }
  );

  const statusCode = httpStatus.BAD_REQUEST; // 400
  return {
    statusCode,
    message: 'Validation Error',
    errorMessages: errors,
  };
};

export default handleValidationError;
