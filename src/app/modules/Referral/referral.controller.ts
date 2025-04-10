// src/app/modules/Referral/referral.controller.ts
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync.js'; // Use .js
import sendResponse, { IApiResponse } from '../../shared/sendResponse.js'; // Use .js
import pick from '../../shared/pick.js'; // Use .js
import * as referralService from './referral.service.js'; // Use .js
import { IReferral } from './referral.interface.js'; // Use .js
import { paginationFields } from '../../constants/pagination.js'; // Use .js - Create this constant file

// Example Controller: Create document
export const createReferral = catchAsync(async (req: Request, res: Response) => {
  // Assuming validation middleware has run
  const result = await referralService.createReferralService(req.body);
  sendResponse<IReferral>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Referral created successfully!',
    data: result,
  });
});

// Example Controller: Get all documents
export const getAllReferrals = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields); // Use pagination constant
  // Add filtering options here if needed
  // const filters = pick(req.query, ['searchTerm', 'fieldToFilter']);

  const result = await referralService.getAllReferralsService(
     paginationOptions
     // filters // Pass filters to service if implemented
  );

  sendResponse<IReferral[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Referrals retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

// Example Controller: Get single document by ID
export const getReferralById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await referralService.getReferralByIdService(id);
  sendResponse<IReferral>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Referral retrieved successfully!',
    data: result, // Service layer handles the 'not found' error
  });
});

// Example Controller: Update document by ID
export const updateReferral = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await referralService.updateReferralService(id, payload);
  sendResponse<IReferral>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Referral updated successfully!',
    data: result, // Service layer handles the 'not found' error
  });
});

// Example Controller: Delete document by ID
export const deleteReferral = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await referralService.deleteReferralService(id);
  sendResponse<IReferral>(res, {
    statusCode: httpStatus.OK, // Or httpStatus.NO_CONTENT (204) if not returning data
    success: true,
    message: 'Referral deleted successfully!',
    data: result, // Return the deleted document (optional)
  });
});
