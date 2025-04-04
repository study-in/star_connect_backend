// src/models/Notification.model.ts
import mongoose, { Schema, Document } from 'mongoose';
// import { IUser } from './User.model';

export type NotificationType =
    | 'booking_request' | 'booking_confirmed' | 'booking_reminder' | 'booking_cancelled'
    | 'new_message' | 'review_received' | 'payment_success' | 'payout_sent'
    | 'star_wish_request' | 'star_wish_completed' | 'admin_message'
    | 'expert_app_pending' | 'expert_app_approved' | 'expert_app_rejected'; // Added types

export interface INotification extends Document {
    recipient: mongoose.Types.ObjectId; // IUser['_id'];
    sender?: mongoose.Types.ObjectId; // IUser['_id']; // Optional: User who triggered it
    type: NotificationType;
    message: string;
    link?: string; // Optional: Link to relevant page (e.g., /bookings/:id)
    isRead: boolean;
    createdAt: Date;
    // No updatedAt needed
}

const notificationSchema: Schema<INotification> = new Schema({
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    type: {
        type: String,
        enum: [ // Ensure enum values match the NotificationType type
            'booking_request', 'booking_confirmed', 'booking_reminder', 'booking_cancelled',
            'new_message', 'review_received', 'payment_success', 'payout_sent',
            'star_wish_request', 'star_wish_completed', 'admin_message',
            'expert_app_pending', 'expert_app_approved', 'expert_app_rejected'
        ],
        required: true
    },
    message: { type: String, required: true },
    link: { type: String },
    isRead: { type: Boolean, default: false, index: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

const Notification = mongoose.model<INotification>('Notification', notificationSchema);
export default Notification;
