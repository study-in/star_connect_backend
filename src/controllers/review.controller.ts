// src/controllers/review.controller.ts
// Placeholder for Review controller logic
import { Request, Response, NextFunction } from 'express';
import * as reviewService from '../services/review.service';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import { IUser } from '../models/User.model';

interface AuthRequest extends Request { user?: IUser; }

// Create Review
export const createReview = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { expertId, bookingId, rating, comment } = req.body;
    if (!req.user) return next(new AppError('Authentication required', 401));
    if (!expertId || !bookingId || !rating) {
        return next(new AppError('Expert ID, Booking ID, and Rating are required', 400));
    }
    const review = await reviewService.createReviewService(req.user.id, expertId, bookingId, rating, comment);
    res.status(201).json({ status: 'success', data: { review } });
});

// Get Reviews for an Expert
export const getExpertReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { expertId } = req.params;
    const reviews = await reviewService.getExpertReviewsService(expertId);
    res.status(200).json({ status: 'success', results: reviews.length, data: { reviews } });
});
