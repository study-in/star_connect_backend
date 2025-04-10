// src/shared/sendResponse.ts
import { Response } from 'express';

// Interface for a standard API success response
export interface IApiResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string | null;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    // Add other meta fields if needed (e.g., totalPages)
  } | null;
  data?: T | null;
}

/**
 * Sends a standardized JSON success response.
 * @param res Express Response object.
 * @param data Object containing response details (statusCode, success, message, meta, data).
 */
const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
  const responseData: IApiResponse<T> = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message || null, // Default to null if message is not provided
    meta: data.meta || null,     // Default to null if meta is not provided
    data: data.data || null,       // Default to null if data is not provided
  };

  res.status(data.statusCode).json(responseData);
};

export default sendResponse;
