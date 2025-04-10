// src/app/modules/Booking/booking.controller.ts
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync.js'; // Use .js
import sendResponse, { IApiResponse } from '../../shared/sendResponse.js'; // Use .js
import pick from '../../shared/pick.js'; // Use .js
import * as bookingService from './booking.service.js'; // Use .js
import { IBooking } from './booking.interface.js'; // Use .js
import { paginationFields } from '../../constants/pagination.js'; // Use .js - Create this constant file

// Example Controller: Create document
export const createBooking = catchAsync(async (req: Request, res: Response) => {
  // Assuming validation middleware has run
  const result = await bookingService.createBookingService(req.body);
  sendResponse<IBooking>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Booking created successfully!',
    data: result,
  });
});

// Example Controller: Get all documents
export const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields); // Use pagination constant
  // Add filtering options here if needed
  // const filters = pick(req.query, ['searchTerm', 'fieldToFilter']);

  const result = await bookingService.getAllBookingsService(
     paginationOptions
     // filters // Pass filters to service if implemented
  );

  sendResponse<IBooking[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bookings retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

// Example Controller: Get single document by ID
export const getBookingById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await bookingService.getBookingByIdService(id);
  sendResponse<IBooking>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking retrieved successfully!',
    data: result, // Service layer handles the 'not found' error
  });
});

// Example Controller: Update document by ID
export const updateBooking = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await bookingService.updateBookingService(id, payload);
  sendResponse<IBooking>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking updated successfully!',
    data: result, // Service layer handles the 'not found' error
  });
});

// Example Controller: Delete document by ID
export const deleteBooking = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await bookingService.deleteBookingService(id);
  sendResponse<IBooking>(res, {
    statusCode: httpStatus.OK, // Or httpStatus.NO_CONTENT (204) if not returning data
    success: true,
    message: 'Booking deleted successfully!',
    data: result, // Return the deleted document (optional)
  });
});
