// src/services/user.service.ts
import User, { IUser } from '../models/User.model';
import ExpertProfile, { IExpertProfile } from '../models/ExpertProfile.model';
import AppError from '../utils/AppError'; // Assuming AppError utility exists

// Get user details (example)
export const getUserDetailsService = async (userId: string): Promise<IUser | null> => {
    // Exclude password by default
    return await User.findById(userId);
};

// Update basic user details (example)
export const updateUserService = async (userId: string, updateData: Partial<IUser>): Promise<IUser | null> => {
    // Prevent password updates through this route
    if (updateData.password) {
        throw new AppError('Cannot update password via this route', 400);
    }
    // Add filtering for allowed fields to update
    const allowedUpdates = { name: updateData.name, profilePicture: updateData.profilePicture, phoneNumber: updateData.phoneNumber, location: updateData.location, timeZone: updateData.timeZone };

    return await User.findByIdAndUpdate(userId, allowedUpdates, { new: true, runValidators: true });
};

// Apply to become an expert
export const applyForExpertRoleService = async (userId: string, expertData: Partial<IExpertProfile>): Promise<IExpertProfile | null> => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError('User not found', 404);
    }
    if (user.roles.includes('expert') || user.expertApplicationStatus === 'approved') {
         throw new AppError('User is already an expert', 400);
    }
     if (user.expertApplicationStatus === 'pending') {
         throw new AppError('Expert application is already pending', 400);
    }

    // Create or update ExpertProfile (associate with user)
    const profileData = { ...expertData, user: userId, applicationTimestamp: new Date() };
    // Use findOneAndUpdate with upsert:true to handle both creation and update if needed
    const expertProfile = await ExpertProfile.findOneAndUpdate(
        { user: userId },
        profileData,
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );

    // Update user status to pending
    user.expertApplicationStatus = 'pending';
    await user.save({ validateBeforeSave: false }); // Save status change

    return expertProfile;
};

// Admin: Update expert application status
export const updateExpertStatusService = async (targetUserId: string, status: 'approved' | 'rejected', rejectionReason?: string): Promise<IUser | null> => {
    const user = await User.findById(targetUserId);
    if (!user) {
        throw new AppError('User not found', 404);
    }
    // Allow update only if status is pending? Or allow re-review? Assuming only from pending.
    if (user.expertApplicationStatus !== 'pending') {
         throw new AppError('No pending expert application found for this user', 400);
    }

    const updateData: Partial<IUser> = { expertApplicationStatus: status };
    const profileUpdateData: Partial<IExpertProfile> = {};

    if (status === 'approved') {
        // Add 'expert' role if not already present
        if (!user.roles.includes('expert')) {
            updateData.roles = [...user.roles, 'expert'];
        }
        profileUpdateData.approvalTimestamp = new Date();
        profileUpdateData.rejectionReason = undefined; // Clear rejection reason
    } else if (status === 'rejected') {
        // Remove 'expert' role if present (shouldn't be, but safety check)
        updateData.roles = user.roles.filter(role => role !== 'expert');
        profileUpdateData.rejectionReason = rejectionReason || 'Application rejected.';
        profileUpdateData.approvalTimestamp = undefined; // Clear approval timestamp
    }

    // Update user status and roles
    const updatedUser = await User.findByIdAndUpdate(targetUserId, updateData, { new: true, runValidators: true });

    // Update expert profile timestamps/reason
    await ExpertProfile.findOneAndUpdate({ user: targetUserId }, profileUpdateData);

    // TODO: Send notification to user about status change

    return updatedUser;
};

// Get expert profile details (publicly accessible potentially)
export const getExpertProfileService = async (expertUserId: string): Promise<IExpertProfile | null> => {
    // Ensure only approved experts' profiles are fetched if needed
    // const user = await User.findById(expertUserId);
    // if (!user || !user.roles.includes('expert') || user.expertApplicationStatus !== 'approved') {
    //    return null; // Or throw AppError
    // }
    return await ExpertProfile.findOne({ user: expertUserId })
           .populate<{ user: Pick<IUser, 'name' | 'email' | 'profilePicture'> }>('user', 'name email profilePicture'); // Populate specific user fields
};

// Update expert profile details (only by the expert themselves or admin)
export const updateExpertProfileService = async (expertUserId: string, updateData: Partial<IExpertProfile>): Promise<IExpertProfile | null> => {
     // IMPORTANT: Add authorization check here in the controller/route calling this service
     // Ensure req.user.id === expertUserId or req.user.roles.includes('admin')

     // Filter allowed fields to update by expert
     const allowedUpdates: Partial<IExpertProfile> = { // Explicitly type allowedUpdates
         bio: updateData.bio,
         categories: updateData.categories,
         specialties: updateData.specialties,
         experience: updateData.experience,
         qualifications: updateData.qualifications,
         payoutInfo: updateData.payoutInfo, // Be careful with updating payout info
         isAvailableForStarWish: updateData.isAvailableForStarWish
         // Add schedule/service updates via their respective services/controllers
        };

     // Remove undefined fields to avoid overwriting with null
     // CORRECTED LOOP
     Object.keys(allowedUpdates).forEach((key) => {
        const k = key as keyof typeof allowedUpdates; // Assert key type
        if (allowedUpdates[k] === undefined) {
            delete allowedUpdates[k];
        }
     });


     return await ExpertProfile.findOneAndUpdate({ user: expertUserId }, allowedUpdates, { new: true, runValidators: true });
};
