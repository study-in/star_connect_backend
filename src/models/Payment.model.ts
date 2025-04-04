// src/models/Payment.model.ts
import mongoose, { Schema, Document } from 'mongoose';
// import { IUser } from './User.model';
// import { IBooking } from './Booking.model';
// import { IStarWishRequest } from './StarWishRequest.model';
// import { IPromoCode } from './PromoCode.model';

export interface IPayment extends Document {
    user: mongoose.Types.ObjectId; // IUser['_id'];
    expert?: mongoose.Types.ObjectId; // IUser['_id']; // Recipient expert
    amount: number;
    currency: string;
    status: 'pending' | 'succeeded' | 'failed' | 'refunded';
    paymentGateway: string; // e.g., 'SSLCommerz', 'Stripe'
    transactionId?: string; // Gateway's transaction ID (tran_id)
    validationId?: string; // Optional: Gateway's validation ID (val_id)
    relatedBooking?: mongoose.Types.ObjectId; // IBooking['_id'];
    relatedStarWish?: mongoose.Types.ObjectId; // IStarWishRequest['_id'];
    contributionToFoundation?: number;
    promoCode?: mongoose.Types.ObjectId; // IPromoCode['_id'];
    gatewayResponse?: any; // Store raw response for debugging if needed
    createdAt: Date;
    updatedAt: Date;
}

const paymentSchema: Schema<IPayment> = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    expert: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'BDT' },
    status: {
        type: String,
        enum: ['pending', 'succeeded', 'failed', 'refunded'],
        required: true,
        index: true
    },
    paymentGateway: { type: String, required: true },
    transactionId: { type: String, index: true },
    validationId: { type: String, index: true },
    relatedBooking: { type: Schema.Types.ObjectId, ref: 'Booking' },
    relatedStarWish: { type: Schema.Types.ObjectId, ref: 'StarWishRequest' },
    contributionToFoundation: { type: Number, default: 0 },
    promoCode: { type: Schema.Types.ObjectId, ref: 'PromoCode' },
    gatewayResponse: { type: Schema.Types.Mixed },
}, { timestamps: true });

const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
export default Payment;
