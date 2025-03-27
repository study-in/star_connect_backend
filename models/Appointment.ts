import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  user_id: mongoose.Types.ObjectId;
  expert_id: mongoose.Types.ObjectId;
  call_type: string;
  subject?: string;
  duration?: number;
  scheduled_at?: Date;
  status?: string;
  livekit_room_id?: string;
  livekit_token?: string;
  call_status?: string;
  group_details?: any;
  created_at: Date;
  updated_at: Date;
}

const AppointmentSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expert_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  call_type: { type: String, required: true },
  subject: { type: String },
  duration: { type: Number },
  scheduled_at: { type: Date },
  status: { type: String },
  livekit_room_id: { type: String },
  livekit_token: { type: String },
  call_status: { type: String },
  group_details: { type: Schema.Types.Mixed },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);
