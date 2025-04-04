// src/services/review.service.ts
// Placeholder for review logic
import Review, { IReview } from '../models/Review.model';
import Booking from '../models/Booking.model';
import AppError from '../utils/AppError';
import { IUser } from '../models/User.model'; // Import IUser for populate type hint
import mongoose from 'mongoose'; // Import mongoose

// Example: Create a review
export const createReviewService = async (userId: string | mongoose.Types.ObjectId, expertId: string | mongoose.Types.ObjectId, bookingId: string | mongoose.Types.ObjectId, rating: number, comment?: string): Promise<IReview> => {
    // 1. Verify the booking exists, belongs to the user, and is completed
    const booking = await Booking.findOne({ _id: bookingId, user: userId, status: 'completed' });
    if (!booking) {
        throw new AppError('Valid completed booking not found for review', 404);
    }
    // Ensure the booking expert matches the expert being reviewed
    if (booking.expert.toString() !== expertId.toString()) {
         throw new AppError('Booking does not match the expert being reviewed', 400);
    }

    // 2. Check if review already exists for this user/expert/booking combination (using index)
    // Mongoose unique index handles this, but explicit check can give better error message
    const existingReview = await Review.findOne({ user: userId, expert: expertId, booking: bookingId });
    if (existingReview) {
        throw new AppError('You have already reviewed this booking/expert', 400);
    }

    // 3. Create the review
    const newReview = await Review.create({
        user: userId,
        expert: expertId,
        booking: bookingId,
        rating: rating,
        comment: comment
    });

    // 4. Average rating calculation is handled by post-save hook in the model

    return newReview;
};

// Example: Get reviews for an expert
// CORRECTED RETURN TYPE
export const getExpertReviewsService = async (expertId: string | mongoose.Types.ObjectId): Promise<any[]> => {
    return await Review.find({ expert: expertId })
        .populate<{ user: Pick<IUser, 'name' | 'profilePicture'> }>('user', 'name profilePicture') // Populate reviewer info
        .sort({ createdAt: -1 });
};
