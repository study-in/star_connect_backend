import mongoose, { Schema, Document } from 'mongoose';

export interface IExpertProfile extends Document {
  user_id: mongoose.Types.ObjectId;
  bio?: string;
  expertise?: string;
  qualifications?: string;
  pricing?: number;
  availability?: any;
  bank_details?: any;
  verified: boolean;
  created_at: Date;
  updated_at: Date;
}

const ExpertProfileSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bio: { type: String },
  expertise: { type: String },
  qualifications: { type: String },
  pricing: { type: Number },
  availability: { type: Schema.Types.Mixed },
  bank_details: { type: Schema.Types.Mixed },
  verified: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model<IExpertProfile>('ExpertProfile', ExpertProfileSchema);
