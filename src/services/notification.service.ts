// src/services/notification.service.ts
// Placeholder for creating and managing notifications
import Notification, { INotification, NotificationType } from '../models/Notification.model';
import mongoose from 'mongoose';

interface CreateNotificationData {
    recipient: mongoose.Types.ObjectId | string;
    type: NotificationType;
    message: string;
    sender?: mongoose.Types.ObjectId | string;
    link?: string;
}

export const createNotificationService = async (data: CreateNotificationData): Promise<INotification> => {
    if (!data.recipient || !data.type || !data.message) {
        throw new Error('Recipient, type, and message are required for notification');
    }
    // TODO: Implement actual notification sending logic (e.g., WebSockets, Push Notifications)
    console.log(`Simulating notification to ${data.recipient}: ${data.message}`);
    return await Notification.create(data);
};

// Example: Get unread notifications for a user
export const getUnreadNotificationsService = async (userId: string): Promise<INotification[]> => {
    return await Notification.find({ recipient: userId, isRead: false }).sort({ createdAt: -1 });
};

// Example: Mark notification as read
export const markNotificationReadService = async (notificationId: string, userId: string): Promise<INotification | null> => {
    // Ensure user owns the notification before marking as read
    return await Notification.findOneAndUpdate({ _id: notificationId, recipient: userId }, { isRead: true }, { new: true });
};
