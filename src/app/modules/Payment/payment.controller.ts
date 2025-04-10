// src/app/modules/Payment/payment.controller.ts
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync.js'; // Use .js
import sendResponse, { IApiResponse } from '../../shared/sendResponse.js'; // Use .js
import pick from '../../shared/pick.js'; // Use .js
import * as paymentService from './payment.service.js'; // Use .js
import { IPayment } from './payment.interface.js'; // Use .js
import { paginationFields } from '../../constants/pagination.js'; // Use .js - Create this constant file

// Example Controller: Create document
export const createPayment = catchAsync(async (req: Request, res: Response) => {
  // Assuming validation middleware has run
  const result = await paymentService.createPaymentService(req.body);
  sendResponse<IPayment>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Payment created successfully!',
    data: result,
  });
});

// Example Controller: Get all documents
export const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields); // Use pagination constant
  // Add filtering options here if needed
  // const filters = pick(req.query, ['searchTerm', 'fieldToFilter']);

  const result = await paymentService.getAllPaymentsService(
     paginationOptions
     // filters // Pass filters to service if implemented
  );

  sendResponse<IPayment[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payments retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

// Example Controller: Get single document by ID
export const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await paymentService.getPaymentByIdService(id);
  sendResponse<IPayment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment retrieved successfully!',
    data: result, // Service layer handles the 'not found' error
  });
});

// Example Controller: Update document by ID
export const updatePayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await paymentService.updatePaymentService(id, payload);
  sendResponse<IPayment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment updated successfully!',
    data: result, // Service layer handles the 'not found' error
  });
});

// Example Controller: Delete document by ID
export const deletePayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await paymentService.deletePaymentService(id);
  sendResponse<IPayment>(res, {
    statusCode: httpStatus.OK, // Or httpStatus.NO_CONTENT (204) if not returning data
    success: true,
    message: 'Payment deleted successfully!',
    data: result, // Return the deleted document (optional)
  });
});
