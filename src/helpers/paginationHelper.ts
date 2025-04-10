// src/helpers/paginationHelper.ts
import { SortOrder } from 'mongoose';

// Interface for pagination options received in request query
export interface IPaginationOptions {
  page?: number | string; // Allow string from query params
  limit?: number | string;
  sortBy?: string;
  sortOrder?: SortOrder | 'asc' | 'desc'; // Allow string 'asc'/'desc'
}

// Interface for calculated pagination values used in services/database queries
export interface ICalculatedPagination {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: SortOrder;
}

/**
 * Calculates pagination parameters from request query options.
 * Provides defaults for page, limit, sortBy, and sortOrder.
 * @param options - Options object typically from req.query.
 * @returns Calculated pagination parameters including skip value.
 */
const calculatePagination = (
  options: IPaginationOptions
): ICalculatedPagination => {
  // Parse page and limit, providing defaults and ensuring they are positive integers
  const page = Math.max(1, Number(options.page || 1));
  const limit = Math.max(1, Number(options.limit || 10)); // Default limit: 10
  const skip = (page - 1) * limit;

  // Determine sort parameters
  const sortBy = options.sortBy || 'createdAt'; // Default sort by creation time
  // Default sort order: descending ('desc', -1)
  const sortOrder: SortOrder = options.sortOrder === 'asc' ? 1 : -1;

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export default calculatePagination;
