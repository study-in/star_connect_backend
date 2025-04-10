// src/app/modules/Service/service.controller.ts
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync.js'; // Use .js
import sendResponse, { IApiResponse } from '../../shared/sendResponse.js'; // Use .js
import pick from '../../shared/pick.js'; // Use .js
import * as serviceService from './service.service.js'; // Use .js
import { IService } from './service.interface.js'; // Use .js
import { paginationFields } from '../../constants/pagination.js'; // Use .js - Create this constant file

// Example Controller: Create document
export const createService = catchAsync(async (req: Request, res: Response) => {
  // Assuming validation middleware has run
  const result = await serviceService.createServiceService(req.body);
  sendResponse<IService>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Service created successfully!',
    data: result,
  });
});

// Example Controller: Get all documents
export const getAllServices = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields); // Use pagination constant
  // Add filtering options here if needed
  // const filters = pick(req.query, ['searchTerm', 'fieldToFilter']);

  const result = await serviceService.getAllServicesService(
     paginationOptions
     // filters // Pass filters to service if implemented
  );

  sendResponse<IService[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Services retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

// Example Controller: Get single document by ID
export const getServiceById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await serviceService.getServiceByIdService(id);
  sendResponse<IService>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service retrieved successfully!',
    data: result, // Service layer handles the 'not found' error
  });
});

// Example Controller: Update document by ID
export const updateService = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await serviceService.updateServiceService(id, payload);
  sendResponse<IService>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service updated successfully!',
    data: result, // Service layer handles the 'not found' error
  });
});

// Example Controller: Delete document by ID
export const deleteService = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await serviceService.deleteServiceService(id);
  sendResponse<IService>(res, {
    statusCode: httpStatus.OK, // Or httpStatus.NO_CONTENT (204) if not returning data
    success: true,
    message: 'Service deleted successfully!',
    data: result, // Return the deleted document (optional)
  });
});
