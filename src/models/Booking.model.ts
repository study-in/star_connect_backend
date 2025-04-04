// src/models/Booking.model.ts
import mongoose, { Schema, Document } from 'mongoose';
// import { IUser } from './User.model';
// import { IService } from './Service.model';
// import { IPayment } from './Payment.model';

// Interface for communication details subdocument
interface ICommunicationDetails {
    liveKitRoom?: string;
    messageThreadId?: mongoose.Types.ObjectId; // Consider ref if MessageThread model exists
}

export interface IBooking extends Document {
    user: mongoose.Types.ObjectId; // IUser['_id'];
    expert: mongoose.Types.ObjectId; // IUser['_id'];
    service: mongoose.Types.ObjectId; // IService['_id'];
    type: 'text_message' | 'video_response' | 'individual_call' | 'group_call';
    scheduledStartTime?: Date;
    scheduledEndTime?: Date;
    actualStartTime?: Date;
    actualEndTime?: Date;
    status: 'pending_payment' | 'pending_confirmation' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled_user' | 'cancelled_expert' | 'rejected';
    priceAtBooking: number;
    payment?: mongoose.Types.ObjectId; // IPayment['_id'];
    communicationDetails?: ICommunicationDetails;
    groupParticipants?: mongoose.Types.ObjectId[]; // IUser['_id'][];
    cancellationReason?: string;
    createdAt: Date;
    updatedAt: Date;
    // Virtuals
    durationMinutes?: number;
}

const bookingSchema: Schema<IBooking> = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    expert: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    type: { // Denormalized from service for easier querying
        type: String,
        enum: ['text_message', 'video_response', 'individual_call', 'group_call'],
        required: true
    },
    scheduledStartTime: { type: Date }, // Required for calls
    scheduledEndTime: { type: Date },   // Required for calls
    actualStartTime: { type: Date },
    actualEndTime: { type: Date },
    status: {
        type: String,
        enum: ['pending_payment', 'pending_confirmation', 'confirmed', 'in_progress', 'completed', 'cancelled_user', 'cancelled_expert', 'rejected'],
        required: true,
        index: true
    },
    priceAtBooking: { type: Number, required: true },
    payment: { type: Schema.Types.ObjectId, ref: 'Payment' },
    communicationDetails: {
        liveKitRoom: { type: String },
        messageThreadId: { type: Schema.Types.ObjectId } // Add ref if needed
    },
    groupParticipants: [{ type: Schema.Types.ObjectId, ref: 'User' }], // For group calls
    cancellationReason: { type: String },
}, {
    timestamps: true,
    toJSON: { virtuals: true }, // Ensure virtuals are included in JSON output
    toObject: { virtuals: true } // Ensure virtuals are included in object output
});

// Example virtual: Calculate duration after completion
bookingSchema.virtual('durationMinutes').get(function(this: IBooking): number | null {
  if (this.actualStartTime && this.actualEndTime) {
    // Use getTime() for reliable date difference calculation
    return Math.round((this.actualEndTime.getTime() - this.actualStartTime.getTime()) / 60000);
  }
  return null;
});

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
export default Booking;
