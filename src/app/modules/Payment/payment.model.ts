// src/app/modules/Payment/payment.model.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IPayment } from './payment.interface.js'; // Use .js

const paymentSchema: Schema<IPayment> = new Schema<IPayment>({
  // Add default fields or specific fields based on moduleName
  name: { type: String, required: true, trim: true },
  // Example relation (adjust as needed)
  // createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Payment = mongoose.model<IPayment, Model<IPayment>>('Payment', paymentSchema);

export default Payment;
