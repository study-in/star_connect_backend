// src/app/modules/LiveKit/liveKit.controller.ts
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync.js'; // Use .js
import sendResponse, { IApiResponse } from '../../shared/sendResponse.js'; // Use .js
import pick from '../../shared/pick.js'; // Use .js
import * as liveKitService from './liveKit.service.js'; // Use .js
import { ILiveKit } from './liveKit.interface.js'; // Use .js
import { paginationFields } from '../../constants/pagination.js'; // Use .js - Create this constant file

// Example Controller: Create document
export const createLiveKit = catchAsync(async (req: Request, res: Response) => {
  // Assuming validation middleware has run
  const result = await liveKitService.createLiveKitService(req.body);
  sendResponse<ILiveKit>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'LiveKit created successfully!',
    data: result,
  });
});

// Example Controller: Get all documents
export const getAllLiveKits = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields); // Use pagination constant
  // Add filtering options here if needed
  // const filters = pick(req.query, ['searchTerm', 'fieldToFilter']);

  const result = await liveKitService.getAllLiveKitsService(
     paginationOptions
     // filters // Pass filters to service if implemented
  );

  sendResponse<ILiveKit[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'LiveKits retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

// Example Controller: Get single document by ID
export const getLiveKitById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await liveKitService.getLiveKitByIdService(id);
  sendResponse<ILiveKit>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'LiveKit retrieved successfully!',
    data: result, // Service layer handles the 'not found' error
  });
});

// Example Controller: Update document by ID
export const updateLiveKit = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await liveKitService.updateLiveKitService(id, payload);
  sendResponse<ILiveKit>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'LiveKit updated successfully!',
    data: result, // Service layer handles the 'not found' error
  });
});

// Example Controller: Delete document by ID
export const deleteLiveKit = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await liveKitService.deleteLiveKitService(id);
  sendResponse<ILiveKit>(res, {
    statusCode: httpStatus.OK, // Or httpStatus.NO_CONTENT (204) if not returning data
    success: true,
    message: 'LiveKit deleted successfully!',
    data: result, // Return the deleted document (optional)
  });
});
