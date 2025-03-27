import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentTransaction extends Document {
  user_id: mongoose.Types.ObjectId;
  expert_id?: mongoose.Types.ObjectId;
  amount: number;
  payment_method: string;
  transaction_type: string;
  status?: string;
  sslcommerz_transaction_id?: string;
  sslcommerz_response?: any;
  payment_verified_at?: Date;
  created_at: Date;
  updated_at: Date;
}

const PaymentTransactionSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expert_id: { type: Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  payment_method: { type: String, required: true },
  transaction_type: { type: String, required: true },
  status: { type: String },
  sslcommerz_transaction_id: { type: String },
  sslcommerz_response: { type: Schema.Types.Mixed },
  payment_verified_at: { type: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model<IPaymentTransaction>('PaymentTransaction', PaymentTransactionSchema);
