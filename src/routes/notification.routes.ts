// src/routes/notification.routes.ts
import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller';
import * as authMiddleware from '../middlewares/auth.middleware';
const router = Router();

router.use(authMiddleware.protect); // All notification routes require login

router.get('/unread', notificationController.getMyUnreadNotifications);
router.patch('/:notificationId/read', notificationController.markAsRead);

export default router;
