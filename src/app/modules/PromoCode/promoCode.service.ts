// src/app/modules/PromoCode/promoCode.service.ts
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../utils/AppError.js'; // Use .js
import PromoCode from './promoCode.model.js'; // Use .js
import { IPromoCode } from './promoCode.interface.js'; // Use .js
import { IPaginationOptions, ICalculatedPagination } from '../../interfaces/pagination.js'; // Use .js
import calculatePagination from '../../helpers/paginationHelper.js'; // Use .js
import { IGenericDataResponse } from '../../interfaces/common.js'; // Use .js
// import { User } from '../User/user.model.js' // Example import for population

// Example Service: Create a new document
export const createPromoCodeService = async (payload: Partial<IPromoCode>): Promise<IPromoCode> => {
  try {
    const result = await PromoCode.create(payload);
    return result;
  } catch (error: any) {
    // Handle potential database errors (like duplicate keys)
    if (error.code === 11000) {
       throw new AppError(`Duplicate key error: ${Object.keys(error.keyValue).join(', ')} must be unique.`, httpStatus.BAD_REQUEST);
    }
    throw new AppError(`Failed to create promoCode: ${error.message}`, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

// Example Service: Get all documents with pagination
export const getAllPromoCodesService = async (
  paginationOptions: IPaginationOptions
): Promise<IGenericDataResponse<IPromoCode[]>> => {
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
    PromoCode.find(whereCondition)
      .sort(sortCondition)
      .skip(skip)
      .limit(limit)
      // Example population: .populate('createdBy', 'name email')
      .lean(), // Use lean for performance if not modifying docs
    PromoCode.countDocuments(whereCondition),
  ]);

  return {
    meta: { page, limit, total },
    data: result,
  };
};

// Example Service: Get single document by ID
export const getPromoCodeByIdService = async (id: string): Promise<IPromoCode | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError('Invalid ID format', httpStatus.BAD_REQUEST);
  }
  const result = await PromoCode.findById(id); //.populate('...');
  if (!result) {
        throw new AppError('PromoCode not found', httpStatus.NOT_FOUND);
  }
  return result;
};

// Example Service: Update document by ID
export const updatePromoCodeService = async (
  id: string,
  payload: Partial<IPromoCode>
): Promise<IPromoCode | null> => {
   if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError('Invalid ID format', httpStatus.BAD_REQUEST);
   }
  // Add filtering for non-updatable fields if necessary
  // e.g., delete payload.createdAt; delete payload.updatedAt;

  const result = await PromoCode.findByIdAndUpdate(id, payload, {
    new: true, // Return the updated document
    runValidators: true, // Run schema validators on update
  });
   if (!result) {
        throw new AppError('PromoCode not found or update failed', httpStatus.NOT_FOUND);
  }
  return result;
};

// Example Service: Delete document by ID
export const deletePromoCodeService = async (id: string): Promise<IPromoCode | null> => {
   if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError('Invalid ID format', httpStatus.BAD_REQUEST);
   }
  const result = await PromoCode.findByIdAndDelete(id);
   if (!result) {
        throw new AppError('PromoCode not found', httpStatus.NOT_FOUND);
  }
  // Optional: Add logic here to delete related data if necessary
  return result;
};
