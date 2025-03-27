import mongoose, { Schema, Document } from 'mongoose';

export interface IPromoCode extends Document {
  code: string;
  discount_type: string;
  discount_value: number;
  applicable_to: string;
  expiry_date?: Date;
  created_at: Date;
}

const PromoCodeSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true },
  discount_type: { type: String, required: true },
  discount_value: { type: Number, required: true },
  applicable_to: { type: String },
  expiry_date: { type: Date },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model<IPromoCode>('PromoCode', PromoCodeSchema);
