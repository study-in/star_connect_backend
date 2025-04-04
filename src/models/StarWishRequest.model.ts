// src/models/StarWishRequest.model.ts
import mongoose, { Schema, Document } from 'mongoose';
// import { IUser } from './User.model';
// import { IService } from './Service.model';
// import { IPayment } from './Payment.model';

export interface IStarWishRequest extends Document {
    user: mongoose.Types.ObjectId; // IUser['_id'];
    expert: mongoose.Types.ObjectId; // IUser['_id'];
    service: mongoose.Types.ObjectId; // IService['_id'];
    requestDetails: string;
    status: 'pending_payment' | 'pending_acceptance' | 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
    priceAtBooking: number;
    payment?: mongoose.Types.ObjectId; // IPayment['_id'];
    videoUrl?: string;
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const starWishRequestSchema: Schema<IStarWishRequest> = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    expert: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    service: { type: Schema.Types.ObjectId, ref: 'Service', required: true }, // Should reference a 'star_wish' type service
    requestDetails: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending_payment', 'pending_acceptance', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'],
        required: true,
        index: true
    },
    priceAtBooking: { type: Number, required: true },
    payment: { type: Schema.Types.ObjectId, ref: 'Payment' },
    videoUrl: { type: String }, // URL to the completed video
    dueDate: { type: Date }, // Optional due date
}, { timestamps: true });

const StarWishRequest = mongoose.model<IStarWishRequest>('StarWishRequest', starWishRequestSchema);
export default StarWishRequest;
