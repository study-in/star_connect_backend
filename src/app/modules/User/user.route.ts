// src/app/modules/User/user.route.ts
import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest.js'; // Use .js
import { protect, restrictTo } from '../../middlewares/auth.middleware.js'; // Use .js
import * as userController from './user.controller.js'; // Use .js
import { UserValidation } from './user.validation.js'; // Use .js
// import { ENUM_USER_ROLE } from '../../../enums/user'; // Define/import roles if needed

const router = Router();

/**
 * @swagger
 * tags:
 * name: User
 * description: User management endpoints
 */

/**
 * @swagger
 * /user:
 * post:
 * summary: Create a new user
 * tags: [User]
 * security:
 * - bearerAuth: [] # Requires authentication
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UserCreate' # Define this schema if using detailed swagger
 * responses:
 * 201:
 * description: User created successfully
 * 400:
 * description: Validation error
 * 401:
 * description: Unauthorized
 */
router.post(
  '/',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  validateRequest(UserValidation.createUserValidationSchema),
  userController.createUser
);

/**
 * @swagger
 * /user:
 * get:
 * summary: Retrieve a list of users
 * tags: [User]
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
 * description: A list of users
 */
router.get(
    '/',
    protect, // Example: Requires login
    userController.getAllUsers
);

/**
 * @swagger
 * /user/{id}:
 * get:
 * summary: Get a user by ID
 * tags: [User]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The user ID
 * responses:
 * 200:
 * description: User details
 * 404:
 * description: User not found
 */
router.get(
    '/:id',
    protect, // Example: Requires login
    userController.getUserById
);

/**
 * @swagger
 * /user/{id}:
 * patch:
 * summary: Update a user by ID
 * tags: [User]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The user ID
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UserUpdate' # Define this schema if using detailed swagger
 * responses:
 * 200:
 * description: User updated successfully
 * 400:
 * description: Validation error
 * 404:
 * description: User not found
 */
router.patch(
  '/:id',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  validateRequest(UserValidation.updateUserValidationSchema),
  userController.updateUser
);

/**
 * @swagger
 * /user/{id}:
 * delete:
 * summary: Delete a user by ID
 * tags: [User]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The user ID
 * responses:
 * 200:
 * description: User deleted successfully
 * 404:
 * description: User not found
 */
router.delete(
  '/:id',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  userController.deleteUser
);

export default router;
