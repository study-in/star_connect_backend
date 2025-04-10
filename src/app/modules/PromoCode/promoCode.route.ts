// src/app/modules/PromoCode/promoCode.route.ts
import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest.js'; // Use .js
import { protect, restrictTo } from '../../middlewares/auth.middleware.js'; // Use .js
import * as promoCodeController from './promoCode.controller.js'; // Use .js
import { PromoCodeValidation } from './promoCode.validation.js'; // Use .js
// import { ENUM_USER_ROLE } from '../../../enums/user'; // Define/import roles if needed

const router = Router();

/**
 * @swagger
 * tags:
 * name: PromoCode
 * description: PromoCode management endpoints
 */

/**
 * @swagger
 * /promoCode:
 * post:
 * summary: Create a new promoCode
 * tags: [PromoCode]
 * security:
 * - bearerAuth: [] # Requires authentication
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/PromoCodeCreate' # Define this schema if using detailed swagger
 * responses:
 * 201:
 * description: PromoCode created successfully
 * 400:
 * description: Validation error
 * 401:
 * description: Unauthorized
 */
router.post(
  '/',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  validateRequest(PromoCodeValidation.createPromoCodeValidationSchema),
  promoCodeController.createPromoCode
);

/**
 * @swagger
 * /promoCode:
 * get:
 * summary: Retrieve a list of promoCodes
 * tags: [PromoCode]
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
 * description: A list of promoCodes
 */
router.get(
    '/',
    protect, // Example: Requires login
    promoCodeController.getAllPromoCodes
);

/**
 * @swagger
 * /promoCode/{id}:
 * get:
 * summary: Get a promoCode by ID
 * tags: [PromoCode]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The promoCode ID
 * responses:
 * 200:
 * description: PromoCode details
 * 404:
 * description: PromoCode not found
 */
router.get(
    '/:id',
    protect, // Example: Requires login
    promoCodeController.getPromoCodeById
);

/**
 * @swagger
 * /promoCode/{id}:
 * patch:
 * summary: Update a promoCode by ID
 * tags: [PromoCode]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The promoCode ID
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/PromoCodeUpdate' # Define this schema if using detailed swagger
 * responses:
 * 200:
 * description: PromoCode updated successfully
 * 400:
 * description: Validation error
 * 404:
 * description: PromoCode not found
 */
router.patch(
  '/:id',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  validateRequest(PromoCodeValidation.updatePromoCodeValidationSchema),
  promoCodeController.updatePromoCode
);

/**
 * @swagger
 * /promoCode/{id}:
 * delete:
 * summary: Delete a promoCode by ID
 * tags: [PromoCode]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The promoCode ID
 * responses:
 * 200:
 * description: PromoCode deleted successfully
 * 404:
 * description: PromoCode not found
 */
router.delete(
  '/:id',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  promoCodeController.deletePromoCode
);

export default router;
