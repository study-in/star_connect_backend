// src/app/modules/Booking/booking.route.ts
import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest.js'; // Use .js
import { protect, restrictTo } from '../../middlewares/auth.middleware.js'; // Use .js
import * as bookingController from './booking.controller.js'; // Use .js
import { BookingValidation } from './booking.validation.js'; // Use .js
// import { ENUM_USER_ROLE } from '../../../enums/user'; // Define/import roles if needed

const router = Router();

/**
 * @swagger
 * tags:
 * name: Booking
 * description: Booking management endpoints
 */

/**
 * @swagger
 * /booking:
 * post:
 * summary: Create a new booking
 * tags: [Booking]
 * security:
 * - bearerAuth: [] # Requires authentication
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/BookingCreate' # Define this schema if using detailed swagger
 * responses:
 * 201:
 * description: Booking created successfully
 * 400:
 * description: Validation error
 * 401:
 * description: Unauthorized
 */
router.post(
  '/',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  validateRequest(BookingValidation.createBookingValidationSchema),
  bookingController.createBooking
);

/**
 * @swagger
 * /booking:
 * get:
 * summary: Retrieve a list of bookings
 * tags: [Booking]
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
 * description: A list of bookings
 */
router.get(
    '/',
    protect, // Example: Requires login
    bookingController.getAllBookings
);

/**
 * @swagger
 * /booking/{id}:
 * get:
 * summary: Get a booking by ID
 * tags: [Booking]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The booking ID
 * responses:
 * 200:
 * description: Booking details
 * 404:
 * description: Booking not found
 */
router.get(
    '/:id',
    protect, // Example: Requires login
    bookingController.getBookingById
);

/**
 * @swagger
 * /booking/{id}:
 * patch:
 * summary: Update a booking by ID
 * tags: [Booking]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The booking ID
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/BookingUpdate' # Define this schema if using detailed swagger
 * responses:
 * 200:
 * description: Booking updated successfully
 * 400:
 * description: Validation error
 * 404:
 * description: Booking not found
 */
router.patch(
  '/:id',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  validateRequest(BookingValidation.updateBookingValidationSchema),
  bookingController.updateBooking
);

/**
 * @swagger
 * /booking/{id}:
 * delete:
 * summary: Delete a booking by ID
 * tags: [Booking]
 * security:
 * - bearerAuth: [] # Requires authentication
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * description: The booking ID
 * responses:
 * 200:
 * description: Booking deleted successfully
 * 404:
 * description: Booking not found
 */
router.delete(
  '/:id',
  protect, // Example: Requires login
  // restrictTo(ENUM_USER_ROLE.ADMIN), // Example: Restrict to Admin role
  bookingController.deleteBooking
);

export default router;
