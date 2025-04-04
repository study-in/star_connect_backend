// src/routes/booking.routes.ts
import { Router } from 'express';
import * as bookingController from '../controllers/booking.controller';
import * as authMiddleware from '../middlewares/auth.middleware';
const router = Router();

router.use(authMiddleware.protect); // All booking routes require login

router.post('/', bookingController.createBooking);
router.get('/my-bookings', bookingController.getMyBookings);
router.get('/my-expert-bookings', authMiddleware.restrictTo('expert'), bookingController.getMyExpertBookings);
// Add routes for GET /:id, PATCH /:id (update status), DELETE /:id (cancel)

export default router;
