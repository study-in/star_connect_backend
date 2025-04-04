// src/controllers/expert.controller.ts
// Placeholder for Expert controller logic
import { Request, Response, NextFunction } from 'express';
import * as expertService from '../services/expert.service';
import * as userService from '../services/user.service'; // For profile updates
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import { IUser } from '../models/User.model';

interface AuthRequest extends Request { user?: IUser; }

// Controller for expert to update their own profile
export const updateMyExpertProfile = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('Authentication required', 401));
    // Service function should handle filtering allowed fields
    const updatedProfile = await userService.updateExpertProfileService(req.user.id, req.body);
    if (!updatedProfile) return next(new AppError('Expert profile not found or update failed', 404));
    res.status(200).json({ status: 'success', data: { profile: updatedProfile } });
});

// Controller for expert to add a service
export const addMyService = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('Authentication required', 401));
    // TODO: Validate service data in req.body
    const newService = await expertService.addExpertServiceService(req.user.id, req.body);
    res.status(201).json({ status: 'success', data: { service: newService } });
});

// Controller for expert to get their schedule
export const getMySchedule = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('Authentication required', 401));
    const schedule = await expertService.getExpertScheduleService(req.user.id);
    res.status(200).json({ status: 'success', data: { schedule } });
});

// Controller for expert to update their schedule
export const updateMySchedule = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('Authentication required', 401));
    // TODO: Validate schedule data in req.body
    const updatedSchedule = await expertService.updateExpertScheduleService(req.user.id, req.body);
    res.status(200).json({ status: 'success', data: { schedule: updatedSchedule } });
});
