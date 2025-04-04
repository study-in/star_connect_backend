// src/models/User.model.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface for User document
export interface IUser extends Document {
    name: string;
    email: string;
    password?: string; // Optional on interface because it won't always be selected
    roles: ('user' | 'expert' | 'admin')[];
    expertApplicationStatus: 'not_applied' | 'pending' | 'approved' | 'rejected';
    profilePicture?: string;
    phoneNumber?: string;
    location?: string;
    timeZone?: string;
    isActive: boolean;
    emailVerified: boolean;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
    // Methods
    correctPassword(candidatePassword: string): Promise<boolean>;
}

// Interface for User model statics (if any needed later)
// interface IUserModel extends Model<IUser> { }

const userSchema: Schema<IUser> = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, minlength: 6, select: false }, // select: false by default
    roles: {
        type: [String],
        enum: ['user', 'expert', 'admin'],
        required: true,
        default: ['user']
    },
    expertApplicationStatus: {
        type: String,
        enum: ['not_applied', 'pending', 'approved', 'rejected'],
        default: 'not_applied',
        index: true
    },
    profilePicture: { type: String }, // URL
    phoneNumber: { type: String },
    location: { type: String }, // Consider GeoJSON if needed later
    timeZone: { type: String },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

// Password hashing middleware
userSchema.pre<IUser>('save', async function(next) {
    if (!this.isModified('password') || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Method to check password
userSchema.methods.correctPassword = async function(candidatePassword: string): Promise<boolean> {
    // 'this.password' is accessible here because we need it for comparison
    // If select: false, you need to explicitly select it in the query: .select('+password')
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;
