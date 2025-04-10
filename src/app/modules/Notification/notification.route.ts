// src/app/modules/Notification/notification.route.ts
import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest.js'; // Use .js
import { protect, restrictTo } from '../../middlewares/auth.middleware.js'; // Use .js
import * as notificationController from './notification.controller.js'; // Use .js
import { NotificationValidation } from './notification.validation.js'; // Use .js
// import { ENUM_USER_ROLE } from '../../../enums/user'; // Define/import roles if needed

const router = Router();

/**
 * @swagger
 * tags:
 * name: Notification
 * description: Notification management endpoints
 */

/**
 * @swagger
 * /notification:
 * post:
 * summary: Create a new notification
 * tags: [Notification]
 * security:
 * - bearerAuth: [] # Requires authentication
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/NotificationCreate' # Define this schema if using detailed swagger
 * responses:
 * 201:
 * description: Notification created successfully
 * 400:
 * description: Validation error
 * 401:
 * description: Unauthorized
 */
router.post(
  '/',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  validateRequest(NotificationValidation.createNotificationValidationSchema),
  notificationController.createNotification
);

/**
 * @swagger
 * /notification:
 * get:
 * summary: Retrieve a list of notifications
 * tags: [Notification]
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
 * description: A list of notifications
 */
router.get(
    '/',
    protect, // Example: Requires login
    notificationController.getAllNotifications
);

/**
 * @swagger
 * /notification/{id}:
 * get:
 * summary: Get a notification by ID
 * tags: [Notification]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The notification ID
 * responses:
 * 200:
 * description: Notification details
 * 404:
 * description: Notification not found
 */
router.get(
    '/:id',
    protect, // Example: Requires login
    notificationController.getNotificationById
);

/**
 * @swagger
 * /notification/{id}:
 * patch:
 * summary: Update a notification by ID
 * tags: [Notification]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The notification ID
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/NotificationUpdate' # Define this schema if using detailed swagger
 * responses:
 * 200:
 * description: Notification updated successfully
 * 400:
 * description: Validation error
 * 404:
 * description: Notification not found
 */
router.patch(
  '/:id',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  validateRequest(NotificationValidation.updateNotificationValidationSchema),
  notificationController.updateNotification
);

/**
 * @swagger
 * /notification/{id}:
 * delete:
 * summary: Delete a notification by ID
 * tags: [Notification]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The notification ID
 * responses:
 * 200:
 * description: Notification deleted successfully
 * 404:
 * description: Notification not found
 */
router.delete(
  '/:id',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  notificationController.deleteNotification
);

export default router;
