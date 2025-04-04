// src/controllers/notification.controller.ts
// Placeholder for Notification controller logic
import { Request, Response, NextFunction } from 'express';
import * as notificationService from '../services/notification.service';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import { IUser } from '../models/User.model';

interface AuthRequest extends Request { user?: IUser; }

// Get My Unread Notifications
export const getMyUnreadNotifications = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('Authentication required', 401));
    const notifications = await notificationService.getUnreadNotificationsService(req.user.id);
    res.status(200).json({ status: 'success', results: notifications.length, data: { notifications } });
});

// Mark a Notification as Read
export const markAsRead = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { notificationId } = req.params;
    if (!req.user) return next(new AppError('Authentication required', 401));
    const notification = await notificationService.markNotificationReadService(notificationId, req.user.id);
    if (!notification) return next(new AppError('Notification not found or permission denied', 404));
    res.status(200).json({ status: 'success', data: { notification } });
});
