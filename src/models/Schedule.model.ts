// src/models/Schedule.model.ts
import mongoose, { Schema, Document } from 'mongoose';
// import { IUser } from './User.model';

// Interface for subdocuments if needed
interface ITimeSlot {
    startTime: Date;
    endTime: Date;
}
interface IBlockedSlot extends ITimeSlot {
    reason?: string;
}
interface IGeneralAvailability {
    dayOfWeek: number; // 0-6
    startTime: string; // HH:mm
    endTime: string; // HH:mm
}

export interface ISchedule extends Document {
    expert: mongoose.Types.ObjectId; // IUser['_id'];
    timeZone: string;
    generalAvailability?: IGeneralAvailability[];
    specificAvailableSlots?: ITimeSlot[];
    blockedSlots?: IBlockedSlot[];
    createdAt: Date;
    updatedAt: Date;
}

const scheduleSchema: Schema<ISchedule> = new Schema({
    expert: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    timeZone: { type: String, required: true }, // e.g., 'Asia/Dhaka'
    generalAvailability: [{
        dayOfWeek: { type: Number, min: 0, max: 6 },
        startTime: { type: String }, // e.g., '09:00'
        endTime: { type: String }, // e.g., '17:00'
        _id: false // Don't create IDs for subdocuments unless needed
    }],
    specificAvailableSlots: [{
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        _id: false
    }],
    blockedSlots: [{
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        reason: { type: String }, // e.g., 'Prayer Time', 'Holiday', 'Personal'
        _id: false
    }],
}, { timestamps: true });

const Schedule = mongoose.model<ISchedule>('Schedule', scheduleSchema);
export default Schedule;
