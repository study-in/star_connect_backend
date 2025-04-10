// src/app/modules/User/user.service.ts
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../utils/AppError.js'; // Use .js
import User from './user.model.js'; // Use .js
import { IUser } from './user.interface.js'; // Use .js
import { IPaginationOptions, ICalculatedPagination } from '../../interfaces/pagination.js'; // Use .js
import calculatePagination from '../../helpers/paginationHelper.js'; // Use .js
import { IGenericDataResponse } from '../../interfaces/common.js'; // Use .js
// import { User } from '../User/user.model.js' // Example import for population

// Example Service: Create a new document
export const createUserService = async (payload: Partial<IUser>): Promise<IUser> => {
  try {
    const result = await User.create(payload);
    return result;
  } catch (error: any) {
    // Handle potential database errors (like duplicate keys)
    if (error.code === 11000) {
       throw new AppError(`Duplicate key error: ${Object.keys(error.keyValue).join(', ')} must be unique.`, httpStatus.BAD_REQUEST);
    }
    throw new AppError(`Failed to create user: ${error.message}`, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

// Example Service: Get all documents with pagination
export const getAllUsersService = async (
  paginationOptions: IPaginationOptions
): Promise<IGenericDataResponse<IUser[]>> => {
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
    User.find(whereCondition)
      .sort(sortCondition)
      .skip(skip)
      .limit(limit)
      // Example population: .populate('createdBy', 'name email')
      .lean(), // Use lean for performance if not modifying docs
    User.countDocuments(whereCondition),
  ]);

  return {
    meta: { page, limit, total },
    data: result,
  };
};

// Example Service: Get single document by ID
export const getUserByIdService = async (id: string): Promise<IUser | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError('Invalid ID format', httpStatus.BAD_REQUEST);
  }
  const result = await User.findById(id); //.populate('...');
  if (!result) {
        throw new AppError('User not found', httpStatus.NOT_FOUND);
  }
  return result;
};

// Example Service: Update document by ID
export const updateUserService = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
   if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError('Invalid ID format', httpStatus.BAD_REQUEST);
   }
  // Add filtering for non-updatable fields if necessary
  // e.g., delete payload.createdAt; delete payload.updatedAt;

  const result = await User.findByIdAndUpdate(id, payload, {
    new: true, // Return the updated document
    runValidators: true, // Run schema validators on update
  });
   if (!result) {
        throw new AppError('User not found or update failed', httpStatus.NOT_FOUND);
  }
  return result;
};

// Example Service: Delete document by ID
export const deleteUserService = async (id: string): Promise<IUser | null> => {
   if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError('Invalid ID format', httpStatus.BAD_REQUEST);
   }
  const result = await User.findByIdAndDelete(id);
   if (!result) {
        throw new AppError('User not found', httpStatus.NOT_FOUND);
  }
  // Optional: Add logic here to delete related data if necessary
  return result;
};
