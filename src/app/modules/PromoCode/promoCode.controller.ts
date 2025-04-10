// src/app/modules/PromoCode/promoCode.controller.ts
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync.js'; // Use .js
import sendResponse, { IApiResponse } from '../../shared/sendResponse.js'; // Use .js
import pick from '../../shared/pick.js'; // Use .js
import * as promoCodeService from './promoCode.service.js'; // Use .js
import { IPromoCode } from './promoCode.interface.js'; // Use .js
import { paginationFields } from '../../constants/pagination.js'; // Use .js - Create this constant file

// Example Controller: Create document
export const createPromoCode = catchAsync(async (req: Request, res: Response) => {
  // Assuming validation middleware has run
  const result = await promoCodeService.createPromoCodeService(req.body);
  sendResponse<IPromoCode>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'PromoCode created successfully!',
    data: result,
  });
});

// Example Controller: Get all documents
export const getAllPromoCodes = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields); // Use pagination constant
  // Add filtering options here if needed
  // const filters = pick(req.query, ['searchTerm', 'fieldToFilter']);

  const result = await promoCodeService.getAllPromoCodesService(
     paginationOptions
     // filters // Pass filters to service if implemented
  );

  sendResponse<IPromoCode[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'PromoCodes retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

// Example Controller: Get single document by ID
export const getPromoCodeById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await promoCodeService.getPromoCodeByIdService(id);
  sendResponse<IPromoCode>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'PromoCode retrieved successfully!',
    data: result, // Service layer handles the 'not found' error
  });
});

// Example Controller: Update document by ID
export const updatePromoCode = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await promoCodeService.updatePromoCodeService(id, payload);
  sendResponse<IPromoCode>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'PromoCode updated successfully!',
    data: result, // Service layer handles the 'not found' error
  });
});

// Example Controller: Delete document by ID
export const deletePromoCode = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await promoCodeService.deletePromoCodeService(id);
  sendResponse<IPromoCode>(res, {
    statusCode: httpStatus.OK, // Or httpStatus.NO_CONTENT (204) if not returning data
    success: true,
    message: 'PromoCode deleted successfully!',
    data: result, // Return the deleted document (optional)
  });
});
