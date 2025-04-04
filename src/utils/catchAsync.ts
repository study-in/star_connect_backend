// src/utils/catchAsync.ts
import { Request, Response, NextFunction } from 'express';

// Define a type for async middleware functions
type AsyncMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<any>;

/**
 * Wraps an async middleware function to catch any errors and pass them
 * to the Express error handling middleware (via next(err)).
 * @param fn The async middleware function to wrap.
 * @returns A standard Express middleware function.
 */
const catchAsync = (fn: AsyncMiddleware) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next); // Catches promise rejections and passes error to next()
    };
};

export default catchAsync;
