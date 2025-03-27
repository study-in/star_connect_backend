import mongoose, { Schema, Document } from 'mongoose';

export interface IReferral extends Document {
  referrer_id: mongoose.Types.ObjectId;
  referred_id: mongoose.Types.ObjectId;
  credit_awarded: number;
  status?: string;
  created_at: Date;
}

const ReferralSchema: Schema = new Schema({
  referrer_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  referred_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  credit_awarded: { type: Number, required: true },
  status: { type: String },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model<IReferral>('Referral', ReferralSchema);
