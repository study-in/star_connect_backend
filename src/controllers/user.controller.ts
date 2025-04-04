// src/controllers/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import catchAsync from '../utils/catchAsync'; // Assuming catchAsync utility exists
import AppError from '../utils/AppError'; // Assuming AppError utility exists
import { IUser } from '../models/User.model'; // Import IUser

// Extend Request interface to include user from auth middleware
interface AuthRequest extends Request {
    user?: IUser; // Attach the full user document from protect middleware
}

// Get current logged-in user's details
export const getMe = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    // The 'protect' middleware should have already attached the user
    if (!req.user) {
        // This case should ideally be caught by 'protect' middleware itself
        return next(new AppError('User not found in request. Authentication issue?', 401));
    }
    // No need to fetch again if protect middleware attaches full user doc
    res.status(200).json({ status: 'success', data: { user: req.user } });
});

// Update current logged-in user's details
export const updateMe = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
     if (!req.user) {
        return next(new AppError('Authentication required', 401));
    }
    const updatedUser = await userService.updateUserService(req.user.id, req.body);
     if (!updatedUser) {
         // This might happen if the user was deleted between protect middleware and here
        return next(new AppError('User not found or update failed', 404));
    }
    res.status(200).json({ status: 'success', data: { user: updatedUser } });
});

// Apply to become an expert
export const applyExpert = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
     if (!req.user) {
        return next(new AppError('Authentication required', 401));
    }
    // TODO: Add validation for expertData in req.body
    const expertProfile = await userService.applyForExpertRoleService(req.user.id, req.body);
    res.status(200).json({
        status: 'success',
        message: 'Expert application submitted successfully. Awaiting admin approval.',
        data: { expertProfile } // Send back the created/updated profile
    });
});

// --- Admin Only Routes (Accessed via specific routes with admin middleware) ---

// Get specific user details (Admin)
export const getUser = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = await userService.getUserDetailsService(req.params.id);
     if (!user) {
        return next(new AppError('User not found with that ID', 404));
    }
    res.status(200).json({ status: 'success', data: { user } });
});

// Update expert application status (Admin)
export const updateExpertApplication = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { status, rejectionReason } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
        return next(new AppError('Invalid status provided. Must be "approved" or "rejected".', 400));
    }
    if (status === 'rejected' && !rejectionReason) {
        // Optional: require rejection reason
        // return next(new AppError('Rejection reason is required when rejecting application.', 400));
    }

    const updatedUser = await userService.updateExpertStatusService(req.params.userId, status, rejectionReason);
     // Service throws error if user not found or status not pending
    res.status(200).json({
        status: 'success',
        message: `Expert application status updated to ${status}`,
        data: { user: updatedUser } // Return updated user doc
    });
});

// Placeholder for Get All Users (Admin) - Add pagination, filtering
// export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//      const users = await User.find(); // Add features
//      res.status(200).json({ status: 'success', results: users.length, data: { users } });
// });

// Placeholder for Delete User (Admin)
// export const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//      const user = await User.findByIdAndDelete(req.params.id);
//      if (!user) return next(new AppError('No user found with that ID', 404));
//      // Consider deleting related data (ExpertProfile etc.) or handle via hooks/cascade
//      res.status(204).json({ status: 'success', data: null });
// });

// Public Controller: Get Expert Profile
export const getPublicExpertProfile = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const profile = await userService.getExpertProfileService(req.params.expertUserId);
    if (!profile) {
        return next(new AppError('Expert profile not found or not approved', 404));
    }
     res.status(200).json({ status: 'success', data: { profile } });
});
