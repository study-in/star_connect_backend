// src/controllers/livekit.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as livekitService from '../services/livekit.service';
import AppError from '../utils/AppError'; // Assuming AppError utility exists
import catchAsync from '../utils/catchAsync'; // Assuming catchAsync utility exists
import { IUser } from '../models/User.model'; // Import IUser

// Extend Request interface if user info is needed from auth middleware
interface AuthRequest extends Request {
    user?: IUser; // Attach the full user document
}

export const getToken = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const room = req.query.room as string;
    // Use authenticated user's ID as identity
    const identity = req.user?.id;
    // Use authenticated user's name as display name
    const name = req.user?.name;

    if (!room) {
        return next(new AppError('Room name is required in query parameters', 400));
    }
    if (!identity) {
         // This should be caught by 'protect' middleware, but double-check
        return next(new AppError('User identity not found. Authentication required.', 401));
    }

    const token = livekitService.generateTokenService(room, identity, name);
    res.status(200).json({ token });
});
