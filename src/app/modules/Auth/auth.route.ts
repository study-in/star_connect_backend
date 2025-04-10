// src/app/modules/Auth/auth.route.ts
import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest.js'; // Use .js
import { protect, restrictTo } from '../../middlewares/auth.middleware.js'; // Use .js
import * as authController from './auth.controller.js'; // Use .js
import { AuthValidation } from './auth.validation.js'; // Use .js
// import { ENUM_USER_ROLE } from '../../../enums/user'; // Define/import roles if needed

const router = Router();

/**
 * @swagger
 * tags:
 * name: Auth
 * description: Auth management endpoints
 */

/**
 * @swagger
 * /auth:
 * post:
 * summary: Create a new auth
 * tags: [Auth]
 * security:
 * - bearerAuth: [] # Requires authentication
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/AuthCreate' # Define this schema if using detailed swagger
 * responses:
 * 201:
 * description: Auth created successfully
 * 400:
 * description: Validation error
 * 401:
 * description: Unauthorized
 */
router.post(
  '/',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  validateRequest(AuthValidation.createAuthValidationSchema),
  authController.createAuth
);

/**
 * @swagger
 * /auth:
 * get:
 * summary: Retrieve a list of auths
 * tags: [Auth]
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
 * description: A list of auths
 */
router.get(
    '/',
    protect, // Example: Requires login
    authController.getAllAuths
);

/**
 * @swagger
 * /auth/{id}:
 * get:
 * summary: Get a auth by ID
 * tags: [Auth]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The auth ID
 * responses:
 * 200:
 * description: Auth details
 * 404:
 * description: Auth not found
 */
router.get(
    '/:id',
    protect, // Example: Requires login
    authController.getAuthById
);

/**
 * @swagger
 * /auth/{id}:
 * patch:
 * summary: Update a auth by ID
 * tags: [Auth]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The auth ID
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/AuthUpdate' # Define this schema if using detailed swagger
 * responses:
 * 200:
 * description: Auth updated successfully
 * 400:
 * description: Validation error
 * 404:
 * description: Auth not found
 */
router.patch(
  '/:id',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  validateRequest(AuthValidation.updateAuthValidationSchema),
  authController.updateAuth
);

/**
 * @swagger
 * /auth/{id}:
 * delete:
 * summary: Delete a auth by ID
 * tags: [Auth]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The auth ID
 * responses:
 * 200:
 * description: Auth deleted successfully
 * 404:
 * description: Auth not found
 */
router.delete(
  '/:id',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  authController.deleteAuth
);

export default router;
