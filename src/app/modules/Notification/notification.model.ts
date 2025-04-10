// src/app/modules/Notification/notification.model.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { INotification } from './notification.interface.js'; // Use .js

const notificationSchema: Schema<INotification> = new Schema<INotification>({
  // Add default fields or specific fields based on moduleName
  name: { type: String, required: true, trim: true },
  // Example relation (adjust as needed)
  // createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Notification = mongoose.model<INotification, Model<INotification>>('Notification', notificationSchema);

export default Notification;
