// src/app/modules/Booking/booking.model.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IBooking } from './booking.interface.js'; // Use .js

const bookingSchema: Schema<IBooking> = new Schema<IBooking>({
  // Add default fields or specific fields based on moduleName
  name: { type: String, required: true, trim: true },
  // Example relation (adjust as needed)
  // createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Booking = mongoose.model<IBooking, Model<IBooking>>('Booking', bookingSchema);

export default Booking;
