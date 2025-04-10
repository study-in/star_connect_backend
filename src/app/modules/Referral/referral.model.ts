// src/app/modules/Referral/referral.model.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IReferral } from './referral.interface.js'; // Use .js

const referralSchema: Schema<IReferral> = new Schema<IReferral>({
  // Add default fields or specific fields based on moduleName
  name: { type: String, required: true, trim: true },
  // Example relation (adjust as needed)
  // createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Referral = mongoose.model<IReferral, Model<IReferral>>('Referral', referralSchema);

export default Referral;
