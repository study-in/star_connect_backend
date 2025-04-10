// src/app/modules/LiveKit/liveKit.route.ts
import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest.js'; // Use .js
import { protect, restrictTo } from '../../middlewares/auth.middleware.js'; // Use .js
import * as liveKitController from './liveKit.controller.js'; // Use .js
import { LiveKitValidation } from './liveKit.validation.js'; // Use .js
// import { ENUM_USER_ROLE } from '../../../enums/user'; // Define/import roles if needed

const router = Router();

/**
 * @swagger
 * tags:
 * name: LiveKit
 * description: LiveKit management endpoints
 */

/**
 * @swagger
 * /liveKit:
 * post:
 * summary: Create a new liveKit
 * tags: [LiveKit]
 * security:
 * - bearerAuth: [] # Requires authentication
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/LiveKitCreate' # Define this schema if using detailed swagger
 * responses:
 * 201:
 * description: LiveKit created successfully
 * 400:
 * description: Validation error
 * 401:
 * description: Unauthorized
 */
router.post(
  '/',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  validateRequest(LiveKitValidation.createLiveKitValidationSchema),
  liveKitController.createLiveKit
);

/**
 * @swagger
 * /liveKit:
 * get:
 * summary: Retrieve a list of liveKits
 * tags: [LiveKit]
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
 * description: A list of liveKits
 */
router.get(
    '/',
    protect, // Example: Requires login
    liveKitController.getAllLiveKits
);

/**
 * @swagger
 * /liveKit/{id}:
 * get:
 * summary: Get a liveKit by ID
 * tags: [LiveKit]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The liveKit ID
 * responses:
 * 200:
 * description: LiveKit details
 * 404:
 * description: LiveKit not found
 */
router.get(
    '/:id',
    protect, // Example: Requires login
    liveKitController.getLiveKitById
);

/**
 * @swagger
 * /liveKit/{id}:
 * patch:
 * summary: Update a liveKit by ID
 * tags: [LiveKit]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The liveKit ID
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/LiveKitUpdate' # Define this schema if using detailed swagger
 * responses:
 * 200:
 * description: LiveKit updated successfully
 * 400:
 * description: Validation error
 * 404:
 * description: LiveKit not found
 */
router.patch(
  '/:id',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  validateRequest(LiveKitValidation.updateLiveKitValidationSchema),
  liveKitController.updateLiveKit
);

/**
 * @swagger
 * /liveKit/{id}:
 * delete:
 * summary: Delete a liveKit by ID
 * tags: [LiveKit]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The liveKit ID
 * responses:
 * 200:
 * description: LiveKit deleted successfully
 * 404:
 * description: LiveKit not found
 */
router.delete(
  '/:id',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  liveKitController.deleteLiveKit
);

export default router;
