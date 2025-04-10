// src/app/modules/Payment/payment.route.ts
import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest.js'; // Use .js
import { protect, restrictTo } from '../../middlewares/auth.middleware.js'; // Use .js
import * as paymentController from './payment.controller.js'; // Use .js
import { PaymentValidation } from './payment.validation.js'; // Use .js
// import { ENUM_USER_ROLE } from '../../../enums/user'; // Define/import roles if needed

const router = Router();

/**
 * @swagger
 * tags:
 * name: Payment
 * description: Payment management endpoints
 */

/**
 * @swagger
 * /payment:
 * post:
 * summary: Create a new payment
 * tags: [Payment]
 * security:
 * - bearerAuth: [] # Requires authentication
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/PaymentCreate' # Define this schema if using detailed swagger
 * responses:
 * 201:
 * description: Payment created successfully
 * 400:
 * description: Validation error
 * 401:
 * description: Unauthorized
 */
router.post(
  '/',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  validateRequest(PaymentValidation.createPaymentValidationSchema),
  paymentController.createPayment
);

/**
 * @swagger
 * /payment:
 * get:
 * summary: Retrieve a list of payments
 * tags: [Payment]
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
 * description: A list of payments
 */
router.get(
    '/',
    protect, // Example: Requires login
    paymentController.getAllPayments
);

/**
 * @swagger
 * /payment/{id}:
 * get:
 * summary: Get a payment by ID
 * tags: [Payment]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The payment ID
 * responses:
 * 200:
 * description: Payment details
 * 404:
 * description: Payment not found
 */
router.get(
    '/:id',
    protect, // Example: Requires login
    paymentController.getPaymentById
);

/**
 * @swagger
 * /payment/{id}:
 * patch:
 * summary: Update a payment by ID
 * tags: [Payment]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The payment ID
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/PaymentUpdate' # Define this schema if using detailed swagger
 * responses:
 * 200:
 * description: Payment updated successfully
 * 400:
 * description: Validation error
 * 404:
 * description: Payment not found
 */
router.patch(
  '/:id',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  validateRequest(PaymentValidation.updatePaymentValidationSchema),
  paymentController.updatePayment
);

/**
 * @swagger
 * /payment/{id}:
 * delete:
 * summary: Delete a payment by ID
 * tags: [Payment]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The payment ID
 * responses:
 * 200:
 * description: Payment deleted successfully
 * 404:
 * description: Payment not found
 */
router.delete(
  '/:id',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  paymentController.deletePayment
);

export default router;
