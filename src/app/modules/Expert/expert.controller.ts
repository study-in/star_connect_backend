// src/app/modules/Expert/expert.controller.ts
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync.js'; // Use .js
import sendResponse, { IApiResponse } from '../../shared/sendResponse.js'; // Use .js
import pick from '../../shared/pick.js'; // Use .js
import * as expertService from './expert.service.js'; // Use .js
import { IExpert } from './expert.interface.js'; // Use .js
import { paginationFields } from '../../constants/pagination.js'; // Use .js - Create this constant file

// Example Controller: Create document
export const createExpert = catchAsync(async (req: Request, res: Response) => {
  // Assuming validation middleware has run
  const result = await expertService.createExpertService(req.body);
  sendResponse<IExpert>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Expert created successfully!',
    data: result,
  });
});

// Example Controller: Get all documents
export const getAllExperts = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields); // Use pagination constant
  // Add filtering options here if needed
  // const filters = pick(req.query, ['searchTerm', 'fieldToFilter']);

  const result = await expertService.getAllExpertsService(
     paginationOptions
     // filters // Pass filters to service if implemented
  );

  sendResponse<IExpert[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Experts retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

// Example Controller: Get single document by ID
export const getExpertById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await expertService.getExpertByIdService(id);
  sendResponse<IExpert>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expert retrieved successfully!',
    data: result, // Service layer handles the 'not found' error
  });
});

// Example Controller: Update document by ID
export const updateExpert = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await expertService.updateExpertService(id, payload);
  sendResponse<IExpert>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expert updated successfully!',
    data: result, // Service layer handles the 'not found' error
  });
});

// Example Controller: Delete document by ID
export const deleteExpert = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await expertService.deleteExpertService(id);
  sendResponse<IExpert>(res, {
    statusCode: httpStatus.OK, // Or httpStatus.NO_CONTENT (204) if not returning data
    success: true,
    message: 'Expert deleted successfully!',
    data: result, // Return the deleted document (optional)
  });
});
