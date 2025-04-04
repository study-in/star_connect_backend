// src/models/PromoCode.model.ts
import mongoose, { Schema, Document } from 'mongoose';
// import { IService } from './Service.model';

export interface IPromoCode extends Document {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    description?: string;
    startDate?: Date;
    expiryDate?: Date;
    usageLimitPerUser?: number;
    totalUsageLimit?: number;
    timesUsed: number;
    applicableServices?: mongoose.Types.ObjectId[]; // IService['_id'][]; // Optional: Limit to specific services
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const promoCodeSchema: Schema<IPromoCode> = new Schema({
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    description: { type: String },
    startDate: { type: Date },
    expiryDate: { type: Date },
    usageLimitPerUser: { type: Number, default: 1, min: 1 },
    totalUsageLimit: { type: Number, min: 0 },
    timesUsed: { type: Number, default: 0, min: 0 },
    applicableServices: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Index for active codes within date range
promoCodeSchema.index({ isActive: 1, expiryDate: 1, startDate: 1 });

const PromoCode = mongoose.model<IPromoCode>('PromoCode', promoCodeSchema);
export default PromoCode;
