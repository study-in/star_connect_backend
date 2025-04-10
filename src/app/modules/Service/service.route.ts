// src/app/modules/Service/service.route.ts
import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest.js'; // Use .js
import { protect, restrictTo } from '../../middlewares/auth.middleware.js'; // Use .js
import * as serviceController from './service.controller.js'; // Use .js
import { ServiceValidation } from './service.validation.js'; // Use .js
// import { ENUM_USER_ROLE } from '../../../enums/user'; // Define/import roles if needed

const router = Router();

/**
 * @swagger
 * tags:
 * name: Service
 * description: Service management endpoints
 */

/**
 * @swagger
 * /service:
 * post:
 * summary: Create a new service
 * tags: [Service]
 * security:
 * - bearerAuth: [] # Requires authentication
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ServiceCreate' # Define this schema if using detailed swagger
 * responses:
 * 201:
 * description: Service created successfully
 * 400:
 * description: Validation error
 * 401:
 * description: Unauthorized
 */
router.post(
  '/',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  validateRequest(ServiceValidation.createServiceValidationSchema),
  serviceController.createService
);

/**
 * @swagger
 * /service:
 * get:
 * summary: Retrieve a list of services
 * tags: [Service]
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
 * description: A list of services
 */
router.get(
    '/',
    protect, // Example: Requires login
    serviceController.getAllServices
);

/**
 * @swagger
 * /service/{id}:
 * get:
 * summary: Get a service by ID
 * tags: [Service]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The service ID
 * responses:
 * 200:
 * description: Service details
 * 404:
 * description: Service not found
 */
router.get(
    '/:id',
    protect, // Example: Requires login
    serviceController.getServiceById
);

/**
 * @swagger
 * /service/{id}:
 * patch:
 * summary: Update a service by ID
 * tags: [Service]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The service ID
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ServiceUpdate' # Define this schema if using detailed swagger
 * responses:
 * 200:
 * description: Service updated successfully
 * 400:
 * description: Validation error
 * 404:
 * description: Service not found
 */
router.patch(
  '/:id',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  validateRequest(ServiceValidation.updateServiceValidationSchema),
  serviceController.updateService
);

/**
 * @swagger
 * /service/{id}:
 * delete:
 * summary: Delete a service by ID
 * tags: [Service]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The service ID
 * responses:
 * 200:
 * description: Service deleted successfully
 * 404:
 * description: Service not found
 */
router.delete(
  '/:id',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  serviceController.deleteService
);

export default router;
