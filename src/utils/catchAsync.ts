// src/utils/catchAsync.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an async route handler or middleware function to catch any promise rejections
 * and pass them to the Express global error handler (via next(err)).
 *
 * @param fn The async RequestHandler function to wrap.
 * @returns A standard Express RequestHandler function.
 */
const catchAsync = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Ensure the function call is awaited and errors are caught
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

export default catchAsync;
