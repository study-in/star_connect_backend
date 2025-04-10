// src/app/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import httpStatus from 'http-status';

import config from '../../config/index.js'; // Use .js
import AppError from '../../utils/AppError.js'; // Use .js
import catchAsync from '../../shared/catchAsync.js'; // Use .js
import User from '../modules/User/User.model.js'; // Use .js - Adjust path based on actual User model location

// Assuming IUser is defined in User.interface.ts and imported in User.model.ts
import { IUser } from '../modules/User/User.interface.js'; // Use .js

// Extend Express Request interface to attach user
declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Attach the full user document
    }
  }
}

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // 1) Getting token and check if it's there
  let token: string | undefined;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) { // Check for token in cookies as fallback
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', httpStatus.UNAUTHORIZED));
  }

  // 2) Verification token
  let decoded: JwtPayload;
  try {
    // Use the correct secret from config
    decoded = jwt.verify(token, config.jwt.secret as Secret) as JwtPayload;

    // Check if decoded payload has user ID (adjust 'id' if your payload uses a different key)
    if (!decoded || typeof decoded !== 'object' || !decoded.id) {
        throw new Error('Invalid token payload');
    }
  } catch (err: any) {
    const message = err.name === 'TokenExpiredError'
        ? 'Your token has expired! Please log in again.'
        : 'Invalid token. Please log in again.';
    return next(new AppError(message, httpStatus.UNAUTHORIZED));
  }


  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', httpStatus.UNAUTHORIZED));
  }

  // 4) Check if user is active (optional)
   if (!currentUser.isActive) {
        return next(new AppError('User account is inactive.', httpStatus.UNAUTHORIZED));
   }

  // 5) Check if user changed password after the token was issued (Optional but recommended)
  // Requires adding a 'passwordChangedAt' field to the User model
  // if (currentUser.passwordChangedAt && decoded.iat) {
  //    const changedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
  //    if (changedTimestamp > decoded.iat) {
  //        return next(new AppError('User recently changed password! Please log in again.', httpStatus.UNAUTHORIZED));
  //    }
  // }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser; // Attach user document to the request object
  res.locals.user = currentUser; // Also make available in templates if needed (for EJS)
  next();
});

// Middleware to restrict routes to specific roles
// Ensure 'roles' property exists on your IUser interface and User model
export const restrictTo = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // protect middleware should run first and attach req.user
    if (!req.user || !req.user.roles || !req.user.roles.some(role => allowedRoles.includes(role))) {
        return next(new AppError('You do not have permission to perform this action.', httpStatus.FORBIDDEN)); // 403 Forbidden
    }
    next(); // User has one of the allowed roles
  };
};
