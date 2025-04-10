// src/app/modules/LiveKit/liveKit.service.ts
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../utils/AppError.js'; // Use .js
import LiveKit from './liveKit.model.js'; // Use .js
import { ILiveKit } from './liveKit.interface.js'; // Use .js
import { IPaginationOptions, ICalculatedPagination } from '../../interfaces/pagination.js'; // Use .js
import calculatePagination from '../../helpers/paginationHelper.js'; // Use .js
import { IGenericDataResponse } from '../../interfaces/common.js'; // Use .js
// import { User } from '../User/user.model.js' // Example import for population

// Example Service: Create a new document
export const createLiveKitService = async (payload: Partial<ILiveKit>): Promise<ILiveKit> => {
  try {
    const result = await LiveKit.create(payload);
    return result;
  } catch (error: any) {
    // Handle potential database errors (like duplicate keys)
    if (error.code === 11000) {
       throw new AppError(`Duplicate key error: ${Object.keys(error.keyValue).join(', ')} must be unique.`, httpStatus.BAD_REQUEST);
    }
    throw new AppError(`Failed to create liveKit: ${error.message}`, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

// Example Service: Get all documents with pagination
export const getAllLiveKitsService = async (
  paginationOptions: IPaginationOptions
): Promise<IGenericDataResponse<ILiveKit[]>> => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);

  // Example sort object
  const sortCondition: { [key: string]: mongoose.SortOrder } = {};
  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }

  // Example query (adjust as needed)
  const whereCondition = {
      // Add filters here if needed, e.g., isActive: true
  };

  const [result, total] = await Promise.all([
    LiveKit.find(whereCondition)
      .sort(sortCondition)
      .skip(skip)
      .limit(limit)
      // Example population: .populate('createdBy', 'name email')
      .lean(), // Use lean for performance if not modifying docs
    LiveKit.countDocuments(whereCondition),
  ]);

  return {
    meta: { page, limit, total },
    data: result,
  };
};

// Example Service: Get single document by ID
export const getLiveKitByIdService = async (id: string): Promise<ILiveKit | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError('Invalid ID format', httpStatus.BAD_REQUEST);
  }
  const result = await LiveKit.findById(id); //.populate('...');
  if (!result) {
        throw new AppError('LiveKit not found', httpStatus.NOT_FOUND);
  }
  return result;
};

// Example Service: Update document by ID
export const updateLiveKitService = async (
  id: string,
  payload: Partial<ILiveKit>
): Promise<ILiveKit | null> => {
   if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError('Invalid ID format', httpStatus.BAD_REQUEST);
   }
  // Add filtering for non-updatable fields if necessary
  // e.g., delete payload.createdAt; delete payload.updatedAt;

  const result = await LiveKit.findByIdAndUpdate(id, payload, {
    new: true, // Return the updated document
    runValidators: true, // Run schema validators on update
  });
   if (!result) {
        throw new AppError('LiveKit not found or update failed', httpStatus.NOT_FOUND);
  }
  return result;
};

// Example Service: Delete document by ID
export const deleteLiveKitService = async (id: string): Promise<ILiveKit | null> => {
   if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError('Invalid ID format', httpStatus.BAD_REQUEST);
   }
  const result = await LiveKit.findByIdAndDelete(id);
   if (!result) {
        throw new AppError('LiveKit not found', httpStatus.NOT_FOUND);
  }
  // Optional: Add logic here to delete related data if necessary
  return result;
};
