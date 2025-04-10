// src/app/modules/Referral/referral.route.ts
import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest.js'; // Use .js
import { protect, restrictTo } from '../../middlewares/auth.middleware.js'; // Use .js
import * as referralController from './referral.controller.js'; // Use .js
import { ReferralValidation } from './referral.validation.js'; // Use .js
// import { ENUM_USER_ROLE } from '../../../enums/user'; // Define/import roles if needed

const router = Router();

/**
 * @swagger
 * tags:
 * name: Referral
 * description: Referral management endpoints
 */

/**
 * @swagger
 * /referral:
 * post:
 * summary: Create a new referral
 * tags: [Referral]
 * security:
 * - bearerAuth: [] # Requires authentication
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ReferralCreate' # Define this schema if using detailed swagger
 * responses:
 * 201:
 * description: Referral created successfully
 * 400:
 * description: Validation error
 * 401:
 * description: Unauthorized
 */
router.post(
  '/',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  validateRequest(ReferralValidation.createReferralValidationSchema),
  referralController.createReferral
);

/**
 * @swagger
 * /referral:
 * get:
 * summary: Retrieve a list of referrals
 * tags: [Referral]
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
 * description: A list of referrals
 */
router.get(
    '/',
    protect, // Example: Requires login
    referralController.getAllReferrals
);

/**
 * @swagger
 * /referral/{id}:
 * get:
 * summary: Get a referral by ID
 * tags: [Referral]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The referral ID
 * responses:
 * 200:
 * description: Referral details
 * 404:
 * description: Referral not found
 */
router.get(
    '/:id',
    protect, // Example: Requires login
    referralController.getReferralById
);

/**
 * @swagger
 * /referral/{id}:
 * patch:
 * summary: Update a referral by ID
 * tags: [Referral]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The referral ID
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ReferralUpdate' # Define this schema if using detailed swagger
 * responses:
 * 200:
 * description: Referral updated successfully
 * 400:
 * description: Validation error
 * 404:
 * description: Referral not found
 */
router.patch(
  '/:id',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  validateRequest(ReferralValidation.updateReferralValidationSchema),
  referralController.updateReferral
);

/**
 * @swagger
 * /referral/{id}:
 * delete:
 * summary: Delete a referral by ID
 * tags: [Referral]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The referral ID
 * responses:
 * 200:
 * description: Referral deleted successfully
 * 404:
 * description: Referral not found
 */
router.delete(
  '/:id',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  referralController.deleteReferral
);

export default router;
