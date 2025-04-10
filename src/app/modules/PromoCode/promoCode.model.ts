// src/app/modules/PromoCode/promoCode.model.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IPromoCode } from './promoCode.interface.js'; // Use .js

const promoCodeSchema: Schema<IPromoCode> = new Schema<IPromoCode>({
  // Add default fields or specific fields based on moduleName
  name: { type: String, required: true, trim: true },
  // Example relation (adjust as needed)
  // createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const PromoCode = mongoose.model<IPromoCode, Model<IPromoCode>>('PromoCode', promoCodeSchema);

export default PromoCode;
