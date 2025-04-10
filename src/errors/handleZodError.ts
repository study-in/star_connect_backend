// src/errors/handleZodError.ts
import { ZodError, ZodIssue } from 'zod';
import { IGenericErrorMessage } from '../interfaces/error.js'; // Use .js
import { IGenericErrorResponse } from '../interfaces/common.js'; // Use .js
import httpStatus from 'http-status';

const handleZodError = (error: ZodError): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = error.issues.map((issue: ZodIssue) => {
    return {
      // Use the last element of the path array for a cleaner field name
      path: issue.path[issue.path.length - 1] || '',
      message: issue.message,
    };
  });

  const statusCode = httpStatus.BAD_REQUEST; // 400
  return {
    statusCode,
    message: 'Validation Error',
    errorMessages: errors,
  };
};

export default handleZodError;
