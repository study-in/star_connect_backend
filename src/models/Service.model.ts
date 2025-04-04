// src/models/Service.model.ts
import mongoose, { Schema, Document } from 'mongoose';
// import { IUser } from './User.model'; // Use ObjectId directly if interface not imported

export interface IService extends Document {
    expert: mongoose.Types.ObjectId; // IUser['_id'];
    type: 'text_message' | 'video_response' | 'individual_call' | 'group_call' | 'star_wish';
    title?: string;
    description?: string;
    price: number;
    currency: string;
    durationMinutes?: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const serviceSchema: Schema<IService> = new Schema({
    expert: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
        type: String,
        enum: ['text_message', 'video_response', 'individual_call', 'group_call', 'star_wish'],
        required: true
    },
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'BDT' },
    durationMinutes: { type: Number, min: 0 }, // Primarily for calls
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Service = mongoose.model<IService>('Service', serviceSchema);
export default Service;
