// src/models/Referral.model.ts
import mongoose, { Schema, Document } from 'mongoose';
// import { IUser } from './User.model';

export interface IReferral extends Document {
    referrer: mongoose.Types.ObjectId; // IUser['_id']; // User who referred
    referee: mongoose.Types.ObjectId; // IUser['_id']; // User who was referred
    status: 'pending' | 'completed'; // e.g., completed after referee's first booking/payment
    rewardAppliedToReferrer: boolean;
    rewardAppliedToReferee: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const referralSchema: Schema<IReferral> = new Schema({
    referrer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    referee: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    rewardAppliedToReferrer: { type: Boolean, default: false },
    rewardAppliedToReferee: { type: Boolean, default: false },
}, { timestamps: true });

const Referral = mongoose.model<IReferral>('Referral', referralSchema);
export default Referral;
