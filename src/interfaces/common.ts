// src/interfaces/common.ts
import { IGenericErrorMessage } from './error.js'; // Use .js

// Standard structure for error responses handled by globalErrorHandler
export interface IGenericErrorResponse {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
  stack?: string | undefined; // Included only in development
}

// Standard structure for responses containing paginated data
export interface IGenericDataResponse<T> {
  meta: {
    page: number;
    limit: number;
    total: number;
    // totalPages?: number; // Optional: Calculate if needed
  };
  data: T;
}

// Generic type for request handlers using catchAsync
// (Already defined in catchAsync.ts, kept here for reference if needed)
// export type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;
