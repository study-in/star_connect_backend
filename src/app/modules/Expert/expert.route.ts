// src/app/modules/Expert/expert.route.ts
import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest.js'; // Use .js
import { protect, restrictTo } from '../../middlewares/auth.middleware.js'; // Use .js
import * as expertController from './expert.controller.js'; // Use .js
import { ExpertValidation } from './expert.validation.js'; // Use .js
// import { ENUM_USER_ROLE } from '../../../enums/user'; // Define/import roles if needed

const router = Router();

/**
 * @swagger
 * tags:
 * name: Expert
 * description: Expert management endpoints
 */

/**
 * @swagger
 * /expert:
 * post:
 * summary: Create a new expert
 * tags: [Expert]
 * security:
 * - bearerAuth: [] # Requires authentication
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ExpertCreate' # Define this schema if using detailed swagger
 * responses:
 * 201:
 * description: Expert created successfully
 * 400:
 * description: Validation error
 * 401:
 * description: Unauthorized
 */
router.post(
  '/',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  validateRequest(ExpertValidation.createExpertValidationSchema),
  expertController.createExpert
);

/**
 * @swagger
 * /expert:
 * get:
 * summary: Retrieve a list of experts
 * tags: [Expert]
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
 * description: A list of experts
 */
router.get(
    '/',
    protect, // Example: Requires login
    expertController.getAllExperts
);

/**
 * @swagger
 * /expert/{id}:
 * get:
 * summary: Get a expert by ID
 * tags: [Expert]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The expert ID
 * responses:
 * 200:
 * description: Expert details
 * 404:
 * description: Expert not found
 */
router.get(
    '/:id',
    protect, // Example: Requires login
    expertController.getExpertById
);

/**
 * @swagger
 * /expert/{id}:
 * patch:
 * summary: Update a expert by ID
 * tags: [Expert]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The expert ID
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ExpertUpdate' # Define this schema if using detailed swagger
 * responses:
 * 200:
 * description: Expert updated successfully
 * 400:
 * description: Validation error
 * 404:
 * description: Expert not found
 */
router.patch(
  '/:id',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  validateRequest(ExpertValidation.updateExpertValidationSchema),
  expertController.updateExpert
);

/**
 * @swagger
 * /expert/{id}:
 * delete:
 * summary: Delete a expert by ID
 * tags: [Expert]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The expert ID
 * responses:
 * 200:
 * description: Expert deleted successfully
 * 404:
 * description: Expert not found
 */
router.delete(
  '/:id',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  expertController.deleteExpert
);

export default router;
