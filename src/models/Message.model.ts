// src/models/Message.model.ts
import mongoose, { Schema, Document } from 'mongoose';
// import { IUser } from './User.model';
// import { IBooking } from './Booking.model';

export interface IMessage extends Document {
    sender: mongoose.Types.ObjectId; // IUser['_id'];
    receiver: mongoose.Types.ObjectId; // IUser['_id'];
    booking?: mongoose.Types.ObjectId; // IBooking['_id']; // Optional link
    content: string;
    isRead: boolean;
    createdAt: Date;
    // No updatedAt needed usually
}

const messageSchema: Schema<IMessage> = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking' },
    content: { type: String, required: true, trim: true },
    isRead: { type: Boolean, default: false },
}, { timestamps: { createdAt: true, updatedAt: false } });

// Index for querying messages between users efficiently
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
messageSchema.index({ booking: 1, createdAt: -1 }); // Index if querying by booking

const Message = mongoose.model<IMessage>('Message', messageSchema);
export default Message;
