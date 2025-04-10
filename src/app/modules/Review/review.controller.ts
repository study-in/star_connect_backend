// src/app/modules/Review/review.controller.ts
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync.js'; // Use .js
import sendResponse, { IApiResponse } from '../../shared/sendResponse.js'; // Use .js
import pick from '../../shared/pick.js'; // Use .js
import * as reviewService from './review.service.js'; // Use .js
import { IReview } from './review.interface.js'; // Use .js
import { paginationFields } from '../../constants/pagination.js'; // Use .js - Create this constant file

// Example Controller: Create document
export const createReview = catchAsync(async (req: Request, res: Response) => {
  // Assuming validation middleware has run
  const result = await reviewService.createReviewService(req.body);
  sendResponse<IReview>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review created successfully!',
    data: result,
  });
});

// Example Controller: Get all documents
export const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields); // Use pagination constant
  // Add filtering options here if needed
  // const filters = pick(req.query, ['searchTerm', 'fieldToFilter']);

  const result = await reviewService.getAllReviewsService(
     paginationOptions
     // filters // Pass filters to service if implemented
  );

  sendResponse<IReview[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reviews retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

// Example Controller: Get single document by ID
export const getReviewById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await reviewService.getReviewByIdService(id);
  sendResponse<IReview>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review retrieved successfully!',
    data: result, // Service layer handles the 'not found' error
  });
});

// Example Controller: Update document by ID
export const updateReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await reviewService.updateReviewService(id, payload);
  sendResponse<IReview>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review updated successfully!',
    data: result, // Service layer handles the 'not found' error
  });
});

// Example Controller: Delete document by ID
export const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await reviewService.deleteReviewService(id);
  sendResponse<IReview>(res, {
    statusCode: httpStatus.OK, // Or httpStatus.NO_CONTENT (204) if not returning data
    success: true,
    message: 'Review deleted successfully!',
    data: result, // Return the deleted document (optional)
  });
});
