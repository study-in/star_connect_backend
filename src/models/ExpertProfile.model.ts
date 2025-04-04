// src/models/ExpertProfile.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User.model'; // Import IUser for ref type hint
// Import other interfaces if needed for refs, e.g., import { ISchedule } from './Schedule.model';
// import { IService } from './Service.model';

export interface IExpertProfile extends Document {
    user: IUser['_id']; // Reference to User
    bio?: string;
    categories?: string[]; // Or: mongoose.Types.ObjectId[] if using Category model
    specialties?: string[];
    experience?: string;
    qualifications?: string[];
    ratingsAverage: number;
    ratingsQuantity: number;
    isAvailableForStarWish: boolean;
    schedule?: mongoose.Types.ObjectId; // Reference to Schedule (use ObjectId directly if interface not imported)
    services?: mongoose.Types.ObjectId[]; // Array of references to Service
    payoutInfo?: any; // Use a specific interface for payoutInfo structure
    applicationTimestamp?: Date;
    approvalTimestamp?: Date;
    rejectionReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

const expertProfileSchema: Schema<IExpertProfile> = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    bio: { type: String },
    categories: [{ type: String }], // Or: [{ type: Schema.Types.ObjectId, ref: 'Category' }]
    specialties: [{ type: String }],
    experience: { type: String },
    qualifications: [{ type: String }],
    ratingsAverage: { type: Number, default: 0, min: 0, max: 5, set: (val: number) => Math.round(val * 10) / 10 },
    ratingsQuantity: { type: Number, default: 0, min: 0 },
    isAvailableForStarWish: { type: Boolean, default: false },
    schedule: { type: Schema.Types.ObjectId, ref: 'Schedule' },
    services: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    payoutInfo: { type: Schema.Types.Mixed }, // Define a stricter type/interface
    applicationTimestamp: { type: Date },
    approvalTimestamp: { type: Date },
    rejectionReason: { type: String },
}, { timestamps: true });

const ExpertProfile = mongoose.model<IExpertProfile>('ExpertProfile', expertProfileSchema);
export default ExpertProfile;
