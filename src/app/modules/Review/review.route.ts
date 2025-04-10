// src/app/modules/Review/review.route.ts
import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest.js'; // Use .js
import { protect, restrictTo } from '../../middlewares/auth.middleware.js'; // Use .js
import * as reviewController from './review.controller.js'; // Use .js
import { ReviewValidation } from './review.validation.js'; // Use .js
// import { ENUM_USER_ROLE } from '../../../enums/user'; // Define/import roles if needed

const router = Router();

/**
 * @swagger
 * tags:
 * name: Review
 * description: Review management endpoints
 */

/**
 * @swagger
 * /review:
 * post:
 * summary: Create a new review
 * tags: [Review]
 * security:
 * - bearerAuth: [] # Requires authentication
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ReviewCreate' # Define this schema if using detailed swagger
 * responses:
 * 201:
 * description: Review created successfully
 * 400:
 * description: Validation error
 * 401:
 * description: Unauthorized
 */
router.post(
  '/',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  validateRequest(ReviewValidation.createReviewValidationSchema),
  reviewController.createReview
);

/**
 * @swagger
 * /review:
 * get:
 * summary: Retrieve a list of reviews
 * tags: [Review]
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
 * description: A list of reviews
 */
router.get(
    '/',
    protect, // Example: Requires login
    reviewController.getAllReviews
);

/**
 * @swagger
 * /review/{id}:
 * get:
 * summary: Get a review by ID
 * tags: [Review]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The review ID
 * responses:
 * 200:
 * description: Review details
 * 404:
 * description: Review not found
 */
router.get(
    '/:id',
    protect, // Example: Requires login
    reviewController.getReviewById
);

/**
 * @swagger
 * /review/{id}:
 * patch:
 * summary: Update a review by ID
 * tags: [Review]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The review ID
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ReviewUpdate' # Define this schema if using detailed swagger
 * responses:
 * 200:
 * description: Review updated successfully
 * 400:
 * description: Validation error
 * 404:
 * description: Review not found
 */
router.patch(
  '/:id',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  validateRequest(ReviewValidation.updateReviewValidationSchema),
  reviewController.updateReview
);

/**
 * @swagger
 * /review/{id}:
 * delete:
 * summary: Delete a review by ID
 * tags: [Review]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The review ID
 * responses:
 * 200:
 * description: Review deleted successfully
 * 404:
 * description: Review not found
 */
router.delete(
  '/:id',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  reviewController.deleteReview
);

export default router;
