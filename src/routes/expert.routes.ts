// src/routes/expert.routes.ts
import { Router } from 'express';
import * as expertController from '../controllers/expert.controller';
import * as userController from '../controllers/user.controller'; // For public profile controller
import * as authMiddleware from '../middlewares/auth.middleware';
const router = Router();

// Public route to get expert profile - uses user controller
router.get('/:expertUserId/profile', userController.getPublicExpertProfile);

// Protected routes for experts to manage their own stuff
router.use(authMiddleware.protect, authMiddleware.restrictTo('expert'));

router.patch('/profile/me', expertController.updateMyExpertProfile); // Update my expert profile
router.post('/services', expertController.addMyService); // Add a new service
// router.patch('/services/:serviceId', expertController.updateMyService);
// router.delete('/services/:serviceId', expertController.deleteMyService);
router.get('/schedule/me', expertController.getMySchedule);
router.patch('/schedule/me', expertController.updateMySchedule);

export default router;
