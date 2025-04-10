// src/app/modules/Schedule/schedule.route.ts
import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest.js'; // Use .js
import { protect, restrictTo } from '../../middlewares/auth.middleware.js'; // Use .js
import * as scheduleController from './schedule.controller.js'; // Use .js
import { ScheduleValidation } from './schedule.validation.js'; // Use .js
// import { ENUM_USER_ROLE } from '../../../enums/user'; // Define/import roles if needed

const router = Router();

/**
 * @swagger
 * tags:
 * name: Schedule
 * description: Schedule management endpoints
 */

/**
 * @swagger
 * /schedule:
 * post:
 * summary: Create a new schedule
 * tags: [Schedule]
 * security:
 * - bearerAuth: [] # Requires authentication
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ScheduleCreate' # Define this schema if using detailed swagger
 * responses:
 * 201:
 * description: Schedule created successfully
 * 400:
 * description: Validation error
 * 401:
 * description: Unauthorized
 */
router.post(
  '/',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  validateRequest(ScheduleValidation.createScheduleValidationSchema),
  scheduleController.createSchedule
);

/**
 * @swagger
 * /schedule:
 * get:
 * summary: Retrieve a list of schedules
 * tags: [Schedule]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: query
 * name: page
 * schema: { type: integer, default: 1 }
 * description: Page number
 * - in: query
 * name: limit
 * schema: { type: integer, default: 10 }
 * description: Results per page
 * - in: query
 * name: sortBy
 * schema: { type: string, default: createdAt }
 * description: Field to sort by
 * - in: query
 * name: sortOrder
 * schema: { type: string, enum: [asc, desc], default: desc }
 * description: Sort order
 * # Add other filter parameters here
 * responses:
 * 200:
 * description: A list of schedules
 */
router.get(
    '/',
    protect, // Example: Requires login
    scheduleController.getAllSchedules
);

/**
 * @swagger
 * /schedule/{id}:
 * get:
 * summary: Get a schedule by ID
 * tags: [Schedule]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The schedule ID
 * responses:
 * 200:
 * description: Schedule details
 * 404:
 * description: Schedule not found
 */
router.get(
    '/:id',
    protect, // Example: Requires login
    scheduleController.getScheduleById
);

/**
 * @swagger
 * /schedule/{id}:
 * patch:
 * summary: Update a schedule by ID
 * tags: [Schedule]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The schedule ID
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ScheduleUpdate' # Define this schema if using detailed swagger
 * responses:
 * 200:
 * description: Schedule updated successfully
 * 400:
 * description: Validation error
 * 404:
 * description: Schedule not found
 */
router.patch(
  '/:id',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  validateRequest(ScheduleValidation.updateScheduleValidationSchema),
  scheduleController.updateSchedule
);

/**
 * @swagger
 * /schedule/{id}:
 * delete:
 * summary: Delete a schedule by ID
 * tags: [Schedule]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The schedule ID
 * responses:
 * 200:
 * description: Schedule deleted successfully
 * 404:
 * description: Schedule not found
 */
router.delete(
  '/:id',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  scheduleController.deleteSchedule
);

export default router;
