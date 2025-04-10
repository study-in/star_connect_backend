// src/app/modules/User/user.controller.ts
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync.js'; // Use .js
import sendResponse, { IApiResponse } from '../../shared/sendResponse.js'; // Use .js
import pick from '../../shared/pick.js'; // Use .js
import * as userService from './user.service.js'; // Use .js
import { IUser } from './user.interface.js'; // Use .js
import { paginationFields } from '../../constants/pagination.js'; // Use .js - Create this constant file

// Example Controller: Create document
export const createUser = catchAsync(async (req: Request, res: Response) => {
  // Assuming validation middleware has run
  const result = await userService.createUserService(req.body);
  sendResponse<IUser>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User created successfully!',
    data: result,
  });
});

// Example Controller: Get all documents
export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields); // Use pagination constant
  // Add filtering options here if needed
  // const filters = pick(req.query, ['searchTerm', 'fieldToFilter']);

  const result = await userService.getAllUsersService(
     paginationOptions
     // filters // Pass filters to service if implemented
  );

  sendResponse<IUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

// Example Controller: Get single document by ID
export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userService.getUserByIdService(id);
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully!',
    data: result, // Service layer handles the 'not found' error
  });
});

// Example Controller: Update document by ID
export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await userService.updateUserService(id, payload);
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully!',
    data: result, // Service layer handles the 'not found' error
  });
});

// Example Controller: Delete document by ID
export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userService.deleteUserService(id);
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK, // Or httpStatus.NO_CONTENT (204) if not returning data
    success: true,
    message: 'User deleted successfully!',
    data: result, // Return the deleted document (optional)
  });
});
