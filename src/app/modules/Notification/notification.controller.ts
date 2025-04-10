// src/app/modules/Notification/notification.controller.ts
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync.js'; // Use .js
import sendResponse, { IApiResponse } from '../../shared/sendResponse.js'; // Use .js
import pick from '../../shared/pick.js'; // Use .js
import * as notificationService from './notification.service.js'; // Use .js
import { INotification } from './notification.interface.js'; // Use .js
import { paginationFields } from '../../constants/pagination.js'; // Use .js - Create this constant file

// Example Controller: Create document
export const createNotification = catchAsync(async (req: Request, res: Response) => {
  // Assuming validation middleware has run
  const result = await notificationService.createNotificationService(req.body);
  sendResponse<INotification>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Notification created successfully!',
    data: result,
  });
});

// Example Controller: Get all documents
export const getAllNotifications = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields); // Use pagination constant
  // Add filtering options here if needed
  // const filters = pick(req.query, ['searchTerm', 'fieldToFilter']);

  const result = await notificationService.getAllNotificationsService(
     paginationOptions
     // filters // Pass filters to service if implemented
  );

  sendResponse<INotification[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notifications retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

// Example Controller: Get single document by ID
export const getNotificationById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await notificationService.getNotificationByIdService(id);
  sendResponse<INotification>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification retrieved successfully!',
    data: result, // Service layer handles the 'not found' error
  });
});

// Example Controller: Update document by ID
export const updateNotification = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await notificationService.updateNotificationService(id, payload);
  sendResponse<INotification>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification updated successfully!',
    data: result, // Service layer handles the 'not found' error
  });
});

// Example Controller: Delete document by ID
export const deleteNotification = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await notificationService.deleteNotificationService(id);
  sendResponse<INotification>(res, {
    statusCode: httpStatus.OK, // Or httpStatus.NO_CONTENT (204) if not returning data
    success: true,
    message: 'Notification deleted successfully!',
    data: result, // Return the deleted document (optional)
  });
});
