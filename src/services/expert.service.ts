// src/services/expert.service.ts
// Placeholder for Expert specific logic (fetching profiles, managing services, schedule etc.)
import User, { IUser } from '../models/User.model';
import ExpertProfile, { IExpertProfile } from '../models/ExpertProfile.model';
import Service, { IService } from '../models/Service.model'; // Import IService
import Schedule, { ISchedule } from '../models/Schedule.model'; // Import ISchedule
import AppError from '../utils/AppError';

// Example: Get services offered by an expert
export const getExpertServicesService = async (expertUserId: string): Promise<IService[]> => {
    return await Service.find({ expert: expertUserId, isActive: true });
};

// Example: Add a new service for an expert
export const addExpertServiceService = async (expertUserId: string, serviceData: Partial<IService>): Promise<IService> => {
    // Add validation: ensure expert exists and has 'expert' role
    // Add validation for serviceData fields
    const newService = await Service.create({ ...serviceData, expert: expertUserId });
    // Add service ref to ExpertProfile (optional, depends on query needs)
    // await ExpertProfile.findOneAndUpdate({ user: expertUserId }, { $addToSet: { services: newService._id } });
    return newService;
};

// Example: Get expert's schedule
export const getExpertScheduleService = async (expertUserId: string): Promise<ISchedule | null> => {
    return await Schedule.findOne({ expert: expertUserId });
};

// Example: Update expert's schedule
export const updateExpertScheduleService = async (expertUserId: string, scheduleData: Partial<ISchedule>): Promise<ISchedule | null> => {
    // Filter allowed fields for update
    const allowedUpdates: Partial<ISchedule> = { // Explicitly type allowedUpdates
         timeZone: scheduleData.timeZone,
         generalAvailability: scheduleData.generalAvailability,
         specificAvailableSlots: scheduleData.specificAvailableSlots,
         blockedSlots: scheduleData.blockedSlots
    };
    // Remove undefined fields
    // CORRECTED LOOP
     Object.keys(allowedUpdates).forEach((key) => {
        const k = key as keyof typeof allowedUpdates; // Assert key type
        if (allowedUpdates[k] === undefined) {
            delete allowedUpdates[k];
        }
     });
    return await Schedule.findOneAndUpdate(
        { expert: expertUserId },
        { $set: allowedUpdates }, // Use $set to update only specified fields
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
};
