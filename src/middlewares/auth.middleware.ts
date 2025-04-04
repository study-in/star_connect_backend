// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User, { IUser } from '../models/User.model'; // Import User model
import catchAsync from '../utils/catchAsync'; // Assuming catchAsync utility exists
import AppError from '../utils/AppError'; // Assuming AppError utility exists

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Extend Express Request interface
declare global {
    namespace Express {
        interface Request {
            user?: IUser; // Attach the full user document
        }
    }
}

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // else if (req.cookies.jwt) { // Optional: Check for token in cookies
    //   token = req.cookies.jwt;
    // }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    if (!JWT_SECRET) {
         // Log detailed error only on server
         console.error("FATAL: JWT_SECRET not configured in auth.middleware.");
         return next(new AppError('Internal server configuration error.', 500));
    }

    // 2) Verification token
    let decoded: any; // Use 'any' or define a specific DecodedPayload interface { id: string, iat: number, exp: number }
    try {
        decoded = jwt.verify(token, JWT_SECRET);
        // Check if decoded payload has user ID (adjust 'id' if your payload uses a different key like 'userId' or 'sub')
        if (!decoded || typeof decoded !== 'object' || !decoded.id) {
             throw new Error('Invalid token payload');
        }
    } catch (err: any) { // Explicitly type err as any or Error
         // Handle specific errors like TokenExpiredError or JsonWebTokenError
         if (err.name === 'TokenExpiredError') {
            return next(new AppError('Your token has expired! Please log in again.', 401));
         }
         return next(new AppError('Invalid token. Please log in again.', 401));
    }


    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    // 4) Check if user changed password after the token was issued (Optional but recommended)
    // Requires adding a 'passwordChangedAt' field to the User model
    // if (currentUser.passwordChangedAt && decoded.iat) {
    //    const changedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
    //    if (changedTimestamp > decoded.iat) {
    //        return next(new AppError('User recently changed password! Please log in again.', 401));
    //    }
    // }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser; // Attach user document to the request object
    res.locals.user = currentUser; // Also make available in templates if needed
    next();
});

// Middleware to restrict routes to specific roles
export const restrictTo = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // protect middleware should run first and attach req.user
        if (!req.user || !req.user.roles || !req.user.roles.some(role => roles.includes(role))) {
            // Log details for debugging if needed
            // console.log('Permission denied. User roles:', req.user?.roles, 'Required roles:', roles);
            return next(new AppError('You do not have permission to perform this action', 403)); // 403 Forbidden
        }
        next();
    };
};
