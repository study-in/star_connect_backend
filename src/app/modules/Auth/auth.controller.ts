// src/app/modules/Auth/auth.controller.ts
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync.js'; // Use .js
import sendResponse, { IApiResponse } from '../../shared/sendResponse.js'; // Use .js
import pick from '../../shared/pick.js'; // Use .js
import * as authService from './auth.service.js'; // Use .js
import { IAuth } from './auth.interface.js'; // Use .js
import { paginationFields } from '../../constants/pagination.js'; // Use .js - Create this constant file

// Example Controller: Create document
export const createAuth = catchAsync(async (req: Request, res: Response) => {
  // Assuming validation middleware has run
  const result = await authService.createAuthService(req.body);
  sendResponse<IAuth>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Auth created successfully!',
    data: result,
  });
});

// Example Controller: Get all documents
export const getAllAuths = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields); // Use pagination constant
  // Add filtering options here if needed
  // const filters = pick(req.query, ['searchTerm', 'fieldToFilter']);

  const result = await authService.getAllAuthsService(
     paginationOptions
     // filters // Pass filters to service if implemented
  );

  sendResponse<IAuth[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Auths retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

// Example Controller: Get single document by ID
export const getAuthById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await authService.getAuthByIdService(id);
  sendResponse<IAuth>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Auth retrieved successfully!',
    data: result, // Service layer handles the 'not found' error
  });
});

// Example Controller: Update document by ID
export const updateAuth = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await authService.updateAuthService(id, payload);
  sendResponse<IAuth>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Auth updated successfully!',
    data: result, // Service layer handles the 'not found' error
  });
});

// Example Controller: Delete document by ID
export const deleteAuth = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await authService.deleteAuthService(id);
  sendResponse<IAuth>(res, {
    statusCode: httpStatus.OK, // Or httpStatus.NO_CONTENT (204) if not returning data
    success: true,
    message: 'Auth deleted successfully!',
    data: result, // Return the deleted document (optional)
  });
});
