// src/routes/review.routes.ts
import { Router } from 'express';
import * as reviewController from '../controllers/review.controller';
import * as authMiddleware from '../middlewares/auth.middleware';
const router = Router();

// Get reviews for a specific expert (public)
router.get('/expert/:expertId', reviewController.getExpertReviews);

// Create a review (requires user login)
router.post('/', authMiddleware.protect, reviewController.createReview);

// Maybe add routes for updating/deleting own review?

export default router;
