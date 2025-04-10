// src/app/modules/Schedule/schedule.controller.ts
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync.js'; // Use .js
import sendResponse, { IApiResponse } from '../../shared/sendResponse.js'; // Use .js
import pick from '../../shared/pick.js'; // Use .js
import * as scheduleService from './schedule.service.js'; // Use .js
import { ISchedule } from './schedule.interface.js'; // Use .js
import { paginationFields } from '../../constants/pagination.js'; // Use .js - Create this constant file

// Example Controller: Create document
export const createSchedule = catchAsync(async (req: Request, res: Response) => {
  // Assuming validation middleware has run
  const result = await scheduleService.createScheduleService(req.body);
  sendResponse<ISchedule>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Schedule created successfully!',
    data: result,
  });
});

// Example Controller: Get all documents
export const getAllSchedules = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields); // Use pagination constant
  // Add filtering options here if needed
  // const filters = pick(req.query, ['searchTerm', 'fieldToFilter']);

  const result = await scheduleService.getAllSchedulesService(
     paginationOptions
     // filters // Pass filters to service if implemented
  );

  sendResponse<ISchedule[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Schedules retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

// Example Controller: Get single document by ID
export const getScheduleById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await scheduleService.getScheduleByIdService(id);
  sendResponse<ISchedule>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Schedule retrieved successfully!',
    data: result, // Service layer handles the 'not found' error
  });
});

// Example Controller: Update document by ID
export const updateSchedule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await scheduleService.updateScheduleService(id, payload);
  sendResponse<ISchedule>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Schedule updated successfully!',
    data: result, // Service layer handles the 'not found' error
  });
});

// Example Controller: Delete document by ID
export const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await scheduleService.deleteScheduleService(id);
  sendResponse<ISchedule>(res, {
    statusCode: httpStatus.OK, // Or httpStatus.NO_CONTENT (204) if not returning data
    success: true,
    message: 'Schedule deleted successfully!',
    data: result, // Return the deleted document (optional)
  });
});
