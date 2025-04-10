// createStructure.js - Modified
// Import necessary Node.js modules
const fs = require('fs'); // Using synchronous fs for simplicity in this script
const path = require('path');

// --- Configuration ---

// Define directories to create (all backend code will be in TypeScript)
const directories = [
    'src/controllers',
    'src/routes',
    'src/helpers',
    'src/models',
    'src/middlewares',
    'src/services',
    'src/utils', // Added for potential utilities like catchAsync, AppError
    path.join('public', 'images'),
    path.join('public', 'javascripts'),
    path.join('public', 'stylesheets'),
    'views',
    'cert' // For storing SSL certificate files
];

// --- Create Directories ---
console.log('Creating directories...');
directories.forEach((dir) => {
    const fullPath = path.join(process.cwd(), dir); // Ensure full path
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`  Created directory: ${fullPath}`);
    } else {
        console.log(`  Directory already exists: ${fullPath}`);
    }
});
console.log('Directories creation complete.\n');

// --- Define Sample Files ---
// NOTE: Model content is now based on starconnect_nodejs_models
//       Services, Controllers, Routes are updated or added as placeholders.
const sampleFiles = [
    // --- Config Files ---
    {
        filePath: 'tsconfig.json',
        content: `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
`
    },
    {
        filePath: 'package.json',
        // REMOVED COMMENTS from this content block
        content: `{
  "name": "star-connect-backend-ts",
  "version": "1.0.0",
  "description": "A Node.js backend with JWT authentication for Star Connect (TypeScript)",
  "main": "dist/app.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/app.js",
    "dev": "ts-node-dev --respawn --transpile-only src/app.ts"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.0.0",
    "ejs": "^3.1.9",
    "livekit-server-sdk": "^1.2.7",
    "ms": "^2.1.3"
  },
  "devDependencies": {
    "ts-node": "^10.9.1",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.0.0",
    "@types/express": "^4.17.17",
    "@types/node": "^20.2.5",
    "@types/cors": "^2.8.12",
    "@types/jsonwebtoken": "^9.0.1",
    "@types/bcryptjs": "^2.4.2",
    "@types/ms": "^0.7.31"
  }
}
`
    },
    {
        filePath: '.env',
        content: `PORT=3000
JWT_SECRET=your_strong_jwt_secret_here_at_least_32_chars
TOKEN_EXPIRATION=1h # Example: 1h, 1d, 30m
MONGODB_URI=mongodb://localhost:27017/starconnect # Replace with your MongoDB connection string
LIVEKIT_API_KEY= # Your LiveKit API Key
LIVEKIT_API_SECRET= # Your LiveKit API Secret
# LIVEKIT_URL= # Optional: Your LiveKit server URL (ws:// or wss://) if using RoomServiceClient
SSLCOMMERZ_STORE_ID= # Your SSLCommerz Store ID
SSLCOMMERZ_STORE_PASSWORD= # Your SSLCommerz Store Password
# SSLCOMMERZ_API_URL=https://sandbox.sslcommerz.com/gwprocess/v4/api.php # Sandbox URL
# SSLCOMMERZ_API_URL=https://securepay.sslcommerz.com/gwprocess/v4/api.php # Live URL
BACKEND_URL=http://localhost:3000 # Your backend base URL for callbacks
FRONTEND_URL=http://localhost:3001 # Your frontend base URL for redirects
NODE_ENV=development # Set to 'production' in production
` // Added SSLCommerz and URL placeholders
    },
    {
        filePath: 'src/db.ts', // Database connection file (using Mongoose)
        content: `import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error("FATAL ERROR: MONGODB_URI is not defined in .env file.");
  process.exit(1); // Exit if DB connection string is missing
}

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit on connection error
  }
};

export default connectDB;
`
    },

    // --- Models (Based on starconnect_nodejs_models) ---
    // Includes User, ExpertProfile, Service, Schedule, Booking, Message,
    // StarWishRequest, Payment, Review, Notification, PromoCode, Referral
    // (Content for models remains the same as the previous version)
    {
        filePath: 'src/models/User.model.ts',
        content: `// src/models/User.model.ts
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
`
    },
    {
        filePath: 'src/models/ExpertProfile.model.ts',
        content: `// src/models/ExpertProfile.model.ts
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
`
    },
        {
        filePath: 'src/models/Service.model.ts',
        content: `// src/models/Service.model.ts
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
`
    },
    {
        filePath: 'src/models/Schedule.model.ts',
        content: `// src/models/Schedule.model.ts
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
`
    },
    {
        filePath: 'src/models/Booking.model.ts',
        content: `// src/models/Booking.model.ts
import mongoose, { Schema, Document } from 'mongoose';
// import { IUser } from './User.model';
// import { IService } from './Service.model';
// import { IPayment } from './Payment.model';

// Interface for communication details subdocument
interface ICommunicationDetails {
    liveKitRoom?: string;
    messageThreadId?: mongoose.Types.ObjectId; // Consider ref if MessageThread model exists
}

export interface IBooking extends Document {
    user: mongoose.Types.ObjectId; // IUser['_id'];
    expert: mongoose.Types.ObjectId; // IUser['_id'];
    service: mongoose.Types.ObjectId; // IService['_id'];
    type: 'text_message' | 'video_response' | 'individual_call' | 'group_call';
    scheduledStartTime?: Date;
    scheduledEndTime?: Date;
    actualStartTime?: Date;
    actualEndTime?: Date;
    status: 'pending_payment' | 'pending_confirmation' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled_user' | 'cancelled_expert' | 'rejected';
    priceAtBooking: number;
    payment?: mongoose.Types.ObjectId; // IPayment['_id'];
    communicationDetails?: ICommunicationDetails;
    groupParticipants?: mongoose.Types.ObjectId[]; // IUser['_id'][];
    cancellationReason?: string;
    createdAt: Date;
    updatedAt: Date;
    // Virtuals
    durationMinutes?: number;
}

const bookingSchema: Schema<IBooking> = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    expert: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    type: { // Denormalized from service for easier querying
        type: String,
        enum: ['text_message', 'video_response', 'individual_call', 'group_call'],
        required: true
    },
    scheduledStartTime: { type: Date }, // Required for calls
    scheduledEndTime: { type: Date },   // Required for calls
    actualStartTime: { type: Date },
    actualEndTime: { type: Date },
    status: {
        type: String,
        enum: ['pending_payment', 'pending_confirmation', 'confirmed', 'in_progress', 'completed', 'cancelled_user', 'cancelled_expert', 'rejected'],
        required: true,
        index: true
    },
    priceAtBooking: { type: Number, required: true },
    payment: { type: Schema.Types.ObjectId, ref: 'Payment' },
    communicationDetails: {
        liveKitRoom: { type: String },
        messageThreadId: { type: Schema.Types.ObjectId } // Add ref if needed
    },
    groupParticipants: [{ type: Schema.Types.ObjectId, ref: 'User' }], // For group calls
    cancellationReason: { type: String },
}, {
    timestamps: true,
    toJSON: { virtuals: true }, // Ensure virtuals are included in JSON output
    toObject: { virtuals: true } // Ensure virtuals are included in object output
});

// Example virtual: Calculate duration after completion
bookingSchema.virtual('durationMinutes').get(function(this: IBooking): number | null {
  if (this.actualStartTime && this.actualEndTime) {
    // Use getTime() for reliable date difference calculation
    return Math.round((this.actualEndTime.getTime() - this.actualStartTime.getTime()) / 60000);
  }
  return null;
});

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
export default Booking;
`
    },
    {
        filePath: 'src/models/Message.model.ts',
        content: `// src/models/Message.model.ts
import mongoose, { Schema, Document } from 'mongoose';
// import { IUser } from './User.model';
// import { IBooking } from './Booking.model';

export interface IMessage extends Document {
    sender: mongoose.Types.ObjectId; // IUser['_id'];
    receiver: mongoose.Types.ObjectId; // IUser['_id'];
    booking?: mongoose.Types.ObjectId; // IBooking['_id']; // Optional link
    content: string;
    isRead: boolean;
    createdAt: Date;
    // No updatedAt needed usually
}

const messageSchema: Schema<IMessage> = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking' },
    content: { type: String, required: true, trim: true },
    isRead: { type: Boolean, default: false },
}, { timestamps: { createdAt: true, updatedAt: false } });

// Index for querying messages between users efficiently
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
messageSchema.index({ booking: 1, createdAt: -1 }); // Index if querying by booking

const Message = mongoose.model<IMessage>('Message', messageSchema);
export default Message;
`
    },
    {
        filePath: 'src/models/StarWishRequest.model.ts',
        content: `// src/models/StarWishRequest.model.ts
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
`
    },
    {
        filePath: 'src/models/Payment.model.ts',
        content: `// src/models/Payment.model.ts
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
`
    },
    {
        filePath: 'src/models/Review.model.ts',
        content: `// src/models/Review.model.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
// import { IUser } from './User.model';
// import { IBooking } from './Booking.model';
import ExpertProfile from './ExpertProfile.model'; // Import model for static method

export interface IReview extends Document {
    user: mongoose.Types.ObjectId; // IUser['_id'];
    expert: mongoose.Types.ObjectId; // IUser['_id']; // The expert user being reviewed
    booking?: mongoose.Types.ObjectId; // IBooking['_id']; // Link to the specific booking
    rating: number;
    comment?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface IReviewModel extends Model<IReview> {
    calcAverageRatings(expertUserId: mongoose.Types.ObjectId): Promise<void>;
}

const reviewSchema: Schema<IReview, IReviewModel> = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expert: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking' }, // Optional but recommended
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
}, { timestamps: true });

// Ensure a user reviews an expert only once per booking (if booking is required)
// reviewSchema.index({ expert: 1, user: 1, booking: 1 }, { unique: true });
// Or ensure a user reviews an expert only once (simpler)
reviewSchema.index({ expert: 1, user: 1 }, { unique: true });

// Calculate average rating on save/delete
reviewSchema.statics.calcAverageRatings = async function(expertUserId: mongoose.Types.ObjectId) {
    const stats = await this.aggregate([
        { $match: { expert: expertUserId } },
        {
            $group: {
                _id: '$expert',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    try {
        if (stats.length > 0) {
            await ExpertProfile.findOneAndUpdate(
                { user: expertUserId }, // Find ExpertProfile by the user ID
                {
                    ratingsQuantity: stats[0].nRating,
                    ratingsAverage: stats[0].avgRating
                }
            );
        } else {
             await ExpertProfile.findOneAndUpdate(
                { user: expertUserId },
                {
                    ratingsQuantity: 0,
                    ratingsAverage: 0 // Reset if no reviews
                }
            );
        }
    } catch (err) {
        console.error("Error updating average rating:", err);
    }
};

// Post-save hook
reviewSchema.post('save', function() {
    // 'this.constructor' refers to the Review model (with statics)
    (this.constructor as IReviewModel).calcAverageRatings(this.expert);
});

// Refined post hooks for Mongoose 6+
reviewSchema.post('findOneAndDelete', async function(doc: IReview | null) {
    // 'doc' here is the document that was deleted
    if (doc) {
        await (doc.constructor as IReviewModel).calcAverageRatings(doc.expert);
    }
});
reviewSchema.post('findOneAndUpdate', async function(doc: IReview | null) {
    // 'doc' here is the document *before* the update by default
    // If you need the updated doc, use { new: true } in the query
    // We need the expertId, which shouldn't change, so using the pre-update doc is fine
    if (doc) {
         await (doc.constructor as IReviewModel).calcAverageRatings(doc.expert);
    }
});


const Review = mongoose.model<IReview, IReviewModel>('Review', reviewSchema);
export default Review;
`
    },
    {
        filePath: 'src/models/Notification.model.ts',
        content: `// src/models/Notification.model.ts
import mongoose, { Schema, Document } from 'mongoose';
// import { IUser } from './User.model';

export type NotificationType =
    | 'booking_request' | 'booking_confirmed' | 'booking_reminder' | 'booking_cancelled'
    | 'new_message' | 'review_received' | 'payment_success' | 'payout_sent'
    | 'star_wish_request' | 'star_wish_completed' | 'admin_message'
    | 'expert_app_pending' | 'expert_app_approved' | 'expert_app_rejected'; // Added types

export interface INotification extends Document {
    recipient: mongoose.Types.ObjectId; // IUser['_id'];
    sender?: mongoose.Types.ObjectId; // IUser['_id']; // Optional: User who triggered it
    type: NotificationType;
    message: string;
    link?: string; // Optional: Link to relevant page (e.g., /bookings/:id)
    isRead: boolean;
    createdAt: Date;
    // No updatedAt needed
}

const notificationSchema: Schema<INotification> = new Schema({
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    type: {
        type: String,
        enum: [ // Ensure enum values match the NotificationType type
            'booking_request', 'booking_confirmed', 'booking_reminder', 'booking_cancelled',
            'new_message', 'review_received', 'payment_success', 'payout_sent',
            'star_wish_request', 'star_wish_completed', 'admin_message',
            'expert_app_pending', 'expert_app_approved', 'expert_app_rejected'
        ],
        required: true
    },
    message: { type: String, required: true },
    link: { type: String },
    isRead: { type: Boolean, default: false, index: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

const Notification = mongoose.model<INotification>('Notification', notificationSchema);
export default Notification;
`
    },
    {
        filePath: 'src/models/PromoCode.model.ts',
        content: `// src/models/PromoCode.model.ts
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
`
    },
    {
        filePath: 'src/models/Referral.model.ts',
        content: `// src/models/Referral.model.ts
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
`
    },

    // --- Services (Updated / Placeholders) ---
    {
        filePath: 'src/services/auth.service.ts', // Renamed for consistency
        content: `// src/services/auth.service.ts
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import ms from 'ms';
import User, { IUser } from '../models/User.model'; // Import the User model
import AppError from '../utils/AppError'; // Assuming AppError utility exists

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || "1h";

if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined.");
    process.exit(1);
}

export const registerUserService = async (userData: Partial<IUser>): Promise<IUser> => {
    // Add validation here (e.g., check if email exists)
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new AppError('Email already in use', 400);
    }
    if (!userData.password || userData.password.length < 6) {
         throw new AppError('Password must be at least 6 characters long', 400);
    }

    // Create user (password will be hashed by pre-save hook)
    const newUser = await User.create({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        // Set default roles or allow specific roles on registration if needed
        roles: ['user'],
    });
    // Don't send password back, even hashed
    newUser.password = undefined;
    return newUser;
};

export const loginUserService = async (email: string, password: string): Promise<{ user: IUser, token: string }> => {
    if (!email || !password) {
        throw new AppError('Please provide email and password', 400);
    }

    // Find user and explicitly select password
    const user = await User.findOne({ email }).select('+password');

    // Use optional chaining for safety, although findOne should return null or doc
    if (!user || !(await user.correctPassword(password))) {
        throw new AppError('Incorrect email or password', 401); // Use 401 for authentication failure
    }

    // Generate token
    const token = signToken(user.id);

    // Remove password from output
    user.password = undefined;

    return { user, token };
};

// Helper function to sign JWT
const signToken = (id: string): string => {
    const payload = { id }; // Use user ID in payload

    // Calculate expiration
    const msFn = ms as unknown as (value: string) => number;
    const expiresInSeconds = Math.floor(msFn(TOKEN_EXPIRATION) / 1000);

    const signOptions: SignOptions = { expiresIn: expiresInSeconds };

    return jwt.sign(payload, JWT_SECRET!, signOptions);
};
`
    },
    {
        filePath: 'src/services/user.service.ts',
        // CORRECTED: Cast key in Object.keys loop
        content: `// src/services/user.service.ts
import User, { IUser } from '../models/User.model';
import ExpertProfile, { IExpertProfile } from '../models/ExpertProfile.model';
import AppError from '../utils/AppError'; // Assuming AppError utility exists

// Get user details (example)
export const getUserDetailsService = async (userId: string): Promise<IUser | null> => {
    // Exclude password by default
    return await User.findById(userId);
};

// Update basic user details (example)
export const updateUserService = async (userId: string, updateData: Partial<IUser>): Promise<IUser | null> => {
    // Prevent password updates through this route
    if (updateData.password) {
        throw new AppError('Cannot update password via this route', 400);
    }
    // Add filtering for allowed fields to update
    const allowedUpdates = { name: updateData.name, profilePicture: updateData.profilePicture, phoneNumber: updateData.phoneNumber, location: updateData.location, timeZone: updateData.timeZone };

    return await User.findByIdAndUpdate(userId, allowedUpdates, { new: true, runValidators: true });
};

// Apply to become an expert
export const applyForExpertRoleService = async (userId: string, expertData: Partial<IExpertProfile>): Promise<IExpertProfile | null> => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError('User not found', 404);
    }
    if (user.roles.includes('expert') || user.expertApplicationStatus === 'approved') {
         throw new AppError('User is already an expert', 400);
    }
     if (user.expertApplicationStatus === 'pending') {
         throw new AppError('Expert application is already pending', 400);
    }

    // Create or update ExpertProfile (associate with user)
    const profileData = { ...expertData, user: userId, applicationTimestamp: new Date() };
    // Use findOneAndUpdate with upsert:true to handle both creation and update if needed
    const expertProfile = await ExpertProfile.findOneAndUpdate(
        { user: userId },
        profileData,
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );

    // Update user status to pending
    user.expertApplicationStatus = 'pending';
    await user.save({ validateBeforeSave: false }); // Save status change

    return expertProfile;
};

// Admin: Update expert application status
export const updateExpertStatusService = async (targetUserId: string, status: 'approved' | 'rejected', rejectionReason?: string): Promise<IUser | null> => {
    const user = await User.findById(targetUserId);
    if (!user) {
        throw new AppError('User not found', 404);
    }
    // Allow update only if status is pending? Or allow re-review? Assuming only from pending.
    if (user.expertApplicationStatus !== 'pending') {
         throw new AppError('No pending expert application found for this user', 400);
    }

    const updateData: Partial<IUser> = { expertApplicationStatus: status };
    const profileUpdateData: Partial<IExpertProfile> = {};

    if (status === 'approved') {
        // Add 'expert' role if not already present
        if (!user.roles.includes('expert')) {
            updateData.roles = [...user.roles, 'expert'];
        }
        profileUpdateData.approvalTimestamp = new Date();
        profileUpdateData.rejectionReason = undefined; // Clear rejection reason
    } else if (status === 'rejected') {
        // Remove 'expert' role if present (shouldn't be, but safety check)
        updateData.roles = user.roles.filter(role => role !== 'expert');
        profileUpdateData.rejectionReason = rejectionReason || 'Application rejected.';
        profileUpdateData.approvalTimestamp = undefined; // Clear approval timestamp
    }

    // Update user status and roles
    const updatedUser = await User.findByIdAndUpdate(targetUserId, updateData, { new: true, runValidators: true });

    // Update expert profile timestamps/reason
    await ExpertProfile.findOneAndUpdate({ user: targetUserId }, profileUpdateData);

    // TODO: Send notification to user about status change

    return updatedUser;
};

// Get expert profile details (publicly accessible potentially)
export const getExpertProfileService = async (expertUserId: string): Promise<IExpertProfile | null> => {
    // Ensure only approved experts' profiles are fetched if needed
    // const user = await User.findById(expertUserId);
    // if (!user || !user.roles.includes('expert') || user.expertApplicationStatus !== 'approved') {
    //    return null; // Or throw AppError
    // }
    return await ExpertProfile.findOne({ user: expertUserId })
           .populate<{ user: Pick<IUser, 'name' | 'email' | 'profilePicture'> }>('user', 'name email profilePicture'); // Populate specific user fields
};

// Update expert profile details (only by the expert themselves or admin)
export const updateExpertProfileService = async (expertUserId: string, updateData: Partial<IExpertProfile>): Promise<IExpertProfile | null> => {
     // IMPORTANT: Add authorization check here in the controller/route calling this service
     // Ensure req.user.id === expertUserId or req.user.roles.includes('admin')

     // Filter allowed fields to update by expert
     const allowedUpdates: Partial<IExpertProfile> = { // Explicitly type allowedUpdates
         bio: updateData.bio,
         categories: updateData.categories,
         specialties: updateData.specialties,
         experience: updateData.experience,
         qualifications: updateData.qualifications,
         payoutInfo: updateData.payoutInfo, // Be careful with updating payout info
         isAvailableForStarWish: updateData.isAvailableForStarWish
         // Add schedule/service updates via their respective services/controllers
        };

     // Remove undefined fields to avoid overwriting with null
     // CORRECTED LOOP
     Object.keys(allowedUpdates).forEach((key) => {
        const k = key as keyof typeof allowedUpdates; // Assert key type
        if (allowedUpdates[k] === undefined) {
            delete allowedUpdates[k];
        }
     });


     return await ExpertProfile.findOneAndUpdate({ user: expertUserId }, allowedUpdates, { new: true, runValidators: true });
};
`
    },
    {
        filePath: 'src/services/livekit.service.ts', // Renamed
        // Content remains largely the same, just updated imports/exports
        content: `// src/services/livekit.service.ts
import { AccessToken, RoomServiceClient, Room } from 'livekit-server-sdk';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL; // Add LiveKit URL to .env if using RoomServiceClient

if (!API_KEY || !API_SECRET) {
    console.warn("LiveKit API Key or Secret not found in .env. LiveKit features may not work.");
}

// Optional: Initialize RoomServiceClient if you need server-side room management
const roomService = (LIVEKIT_URL && API_KEY && API_SECRET) ? new RoomServiceClient(LIVEKIT_URL, API_KEY, API_SECRET) : null;

/**
 * Generates a LiveKit access token for a client.
 * @param room - The name of the room the user wants to join.
 * @param identity - The unique identity of the user (e.g., User._id).
 * @param name - Optional display name for the user.
 * @param metadata - Optional metadata string.
 * @returns The generated JWT token.
 */
export const generateTokenService = (room: string, identity: string, name?: string, metadata?: string): string => {
    if (!API_KEY || !API_SECRET) {
        throw new Error("LiveKit API Key or Secret not configured.");
    }
    try {
        const at = new AccessToken(API_KEY, API_SECRET, {
            identity: identity,
            name: name, // Pass name if provided
            ttl: '1h' // Token Time-to-Live (e.g., 1 hour)
        });

        // Define permissions
        at.addGrant({
            roomJoin: true,
            room: room,
            canPublish: true, // Allow publishing audio/video
            canSubscribe: true, // Allow subscribing to others
            canPublishData: true, // Allow sending data messages
            canUpdateOwnMetadata: true, // Allow updating own metadata
            // Add other permissions as needed (e.g., roomAdmin)
        });

        if (metadata) {
            at.metadata = metadata; // Add metadata if provided
        }

        return at.toJwt();
    } catch (error: any) {
        console.error("Error generating LiveKit token:", error);
        throw new Error("Error generating LiveKit token: " + error.message);
    }
};

// --- Optional: Server-side room management functions ---
export const listRoomsService = async (): Promise<Room[]> => {
    if (!roomService) throw new Error("LiveKit URL not configured for RoomServiceClient.");
    return await roomService.listRooms();
};

export const createRoomService = async (roomName: string): Promise<Room> => {
    if (!roomService) throw new Error("LiveKit URL not configured for RoomServiceClient.");
    // Add room options if needed (e.g., max participants)
    return await roomService.createRoom({ name: roomName });
};

export const deleteRoomService = async (roomName: string): Promise<void> => {
     if (!roomService) throw new Error("LiveKit URL not configured for RoomServiceClient.");
     await roomService.deleteRoom(roomName);
};
`
    },
    // Add Placeholder Services for other models
    { filePath: 'src/services/booking.service.ts', content: `// src/services/booking.service.ts\n// Placeholder for Booking related logic (create, update status, find, etc.)\nimport Booking from '../models/Booking.model';\nimport Service from '../models/Service.model';\nimport User from '../models/User.model';\nimport AppError from '../utils/AppError';\n\n// Example: Create a booking (initial step, assumes payment handled separately)\nexport const createBookingService = async (userId: string, expertId: string, serviceId: string, scheduledTime?: Date) => {\n    const service = await Service.findById(serviceId);\n    if (!service) throw new AppError('Service not found', 404);\n    // TODO: Check expert availability using Schedule model/service\n    // TODO: Check if user/expert exist\n\n    const bookingData = {\n        user: userId,\n        expert: expertId,\n        service: serviceId,\n        type: service.type,\n        priceAtBooking: service.price,\n        status: 'pending_payment', // Or 'pending_confirmation' if no upfront payment\n        scheduledStartTime: scheduledTime, // Validate based on service type\n        // Calculate scheduledEndTime based on durationMinutes if applicable\n    };\n\n    const newBooking = await Booking.create(bookingData);\n    // TODO: Initiate payment process if status is 'pending_payment'\n    // TODO: Send notification to user/expert\n    return newBooking;\n};\n` },
    { filePath: 'src/services/payment.service.ts', content: `// src/services/payment.service.ts\n// Placeholder for Payment related logic (initiate payment, handle IPN, record transaction, etc.)\nimport Payment from '../models/Payment.model';\nimport Booking from '../models/Booking.model'; // To update booking status\nimport StarWishRequest from '../models/StarWishRequest.model'; // To update star wish status\nimport AppError from '../utils/AppError';\n\n// Example: Initiate SSLCommerz Payment (simplified)\nexport const initiateSslCommerzPaymentService = async (userId: string, amount: number, currency: string, relatedBookingId?: string, relatedStarWishId?: string) => {\n    // 1. Create a 'pending' payment record in your DB\n    const transactionId = \`TXN_\${Date.now()}\${Math.random().toString(36).substring(2, 8)}\`.toUpperCase(); // Generate unique ID\n    const payment = await Payment.create({\n        user: userId,\n        amount: amount,\n        currency: currency,\n        status: 'pending',\n        paymentGateway: 'SSLCommerz',\n        transactionId: transactionId,\n        relatedBooking: relatedBookingId,\n        relatedStarWish: relatedStarWishId\n    });\n\n    // 2. Prepare data for SSLCommerz API call\n    const paymentData = {\n        store_id: process.env.SSLCOMMERZ_STORE_ID, // Add to .env\n        store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD, // Add to .env\n        total_amount: amount,\n        currency: currency,\n        tran_id: transactionId, // Your unique transaction ID\n        success_url: \`\${process.env.BACKEND_URL}/api/v1/payments/success/\${transactionId}\`, // Your success callback URL\n        fail_url: \`\${process.env.BACKEND_URL}/api/v1/payments/fail/\${transactionId}\`,\n        cancel_url: \`\${process.env.BACKEND_URL}/api/v1/payments/cancel/\${transactionId}\`,\n        ipn_url: \`\${process.env.BACKEND_URL}/api/v1/payments/notify/sslcommerz\`, // Your IPN listener URL\n        // Customer info\n        cus_name: 'Customer Name', // Get from user profile\n        cus_email: 'customer@example.com',\n        cus_add1: 'Address',\n        cus_city: 'City',\n        cus_postcode: '1000',\n        cus_country: 'Bangladesh',\n        cus_phone: '01xxxxxxxxx',\n        // Product info\n        product_name: relatedBookingId ? 'Booking Payment' : 'StarWish Payment',\n        product_category: 'Service',\n        product_profile: 'general',\n        // Optional fields\n        // value_a, value_b, value_c, value_d for passing custom data\n    };\n\n    // 3. Make POST request to SSLCommerz API endpoint (use axios or fetch)\n    // const sslcz = new SSLCommerz(process.env.SSLCOMMERZ_STORE_ID, process.env.SSLCOMMERZ_STORE_PASSWORD, is_live) // Or use their SDK/direct API call\n    // const apiResponse = await sslcz.init(paymentData);\n    // Example using fetch:\n    /*\n    const apiUrl = process.env.NODE_ENV === 'production' ? process.env.SSLCOMMERZ_API_URL_LIVE : process.env.SSLCOMMERZ_API_URL_SANDBOX;\n    if (!apiUrl) throw new AppError('SSLCommerz API URL not configured', 500);\n    const response = await fetch(apiUrl, {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },\n        body: new URLSearchParams(paymentData).toString()\n    });\n    const apiResponse = await response.json();\n    if (apiResponse.status === 'SUCCESS') {\n        return { gatewayUrl: apiResponse.GatewayPageURL, paymentId: payment._id };\n    } else {\n        // Update payment status to failed\n        payment.status = 'failed';\n        payment.gatewayResponse = apiResponse;\n        await payment.save();\n        throw new AppError(\`SSLCommerz initiation failed: \${apiResponse.failedreason || 'Unknown reason'}\`, 500);\n    }\n    */\n    console.warn("SSLCommerz API call simulation. Implement actual API call.");\n    // Simulate success for scaffolding\n    return { gatewayUrl: \`https://sandbox.sslcommerz.com/gwprocess/v4/dummy?tran_id=\${transactionId}\`, paymentId: payment._id };\n\n};\n\n// Example: Handle SSLCommerz IPN\nexport const handleSslCommerzIpnService = async (ipnData: any): Promise<void> => {\n    console.log('Received IPN:', ipnData);\n    // TODO: 1. Validate the IPN data (using SSLCommerz validation endpoint is crucial!)\n    // const isValid = await validateIpn(ipnData); // Implement validation\n    // if (!isValid) { console.error("Invalid IPN received."); return; }\n\n    // 2. Find the corresponding payment record using transactionId (tran_id)\n    const payment = await Payment.findOne({ transactionId: ipnData.tran_id });\n    if (!payment) {\n        console.error(\`Payment not found for transaction ID: \${ipnData.tran_id}\`);\n        return; // Important to avoid processing unknown transactions\n    }\n    // 3. Check if payment status is already 'succeeded' to prevent reprocessing\n    if (payment.status === 'succeeded') {\n        console.log(\`Payment \${payment._id} already marked as succeeded.\`);\n        return;\n    }\n    // 4. Update payment status based on ipnData.status ('VALID', 'FAILED', etc.)\n    const oldStatus = payment.status;\n    if (ipnData.status === 'VALID') {\n        payment.status = 'succeeded';\n        payment.validationId = ipnData.val_id; // Store validation ID\n    } else if (['FAILED', 'CANCELLED', 'UNAUTHENTICATED'].includes(ipnData.status)) {\n        payment.status = 'failed';\n    } else {\n        // Keep pending or handle other statuses if necessary\n        console.log(\`IPN received with status: \${ipnData.status}. Payment status remains \${payment.status}.\`);\n    }\n    payment.gatewayResponse = ipnData; // Store latest IPN response\n    await payment.save();\n    console.log(\`Payment \${payment._id} status updated from \${oldStatus} to \${payment.status}\`);\n\n    // 5. If payment succeeded, update related Booking/StarWish status\n    if (payment.status === 'succeeded') {\n        if (payment.relatedBooking) {\n            await Booking.findByIdAndUpdate(payment.relatedBooking, { status: 'pending_confirmation' }); // Or 'confirmed'\n            console.log(\`Updated booking \${payment.relatedBooking} status.\`);\n        }\n        if (payment.relatedStarWish) {\n            await StarWishRequest.findByIdAndUpdate(payment.relatedStarWish, { status: 'pending_acceptance' });\n            console.log(\`Updated StarWish \${payment.relatedStarWish} status.\`);\n        }\n        // TODO: Send success notification to user\n    } else {\n        // TODO: Send failure notification to user\n    }\n};\n` },
    {
        filePath: 'src/services/expert.service.ts',
        // CORRECTED: Cast key in Object.keys loop
        content: `// src/services/expert.service.ts
// Placeholder for Expert specific logic (fetching profiles, managing services, schedule etc.)
import User, { IUser } from '../models/User.model';
import ExpertProfile, { IExpertProfile } from '../models/ExpertProfile.model';
import Service, { IService } from '../models/Service.model'; // Import IService
import Schedule, { ISchedule } from '../models/Schedule.model'; // Import ISchedule
import AppError from '../utils/AppError';

// Example: Get services offered by an expert
export const getExpertServicesService = async (expertUserId: string): Promise<IService[]> => {
    return await Service.find({ expert: expertUserId, isActive: true });
};

// Example: Add a new service for an expert
export const addExpertServiceService = async (expertUserId: string, serviceData: Partial<IService>): Promise<IService> => {
    // Add validation: ensure expert exists and has 'expert' role
    // Add validation for serviceData fields
    const newService = await Service.create({ ...serviceData, expert: expertUserId });
    // Add service ref to ExpertProfile (optional, depends on query needs)
    // await ExpertProfile.findOneAndUpdate({ user: expertUserId }, { $addToSet: { services: newService._id } });
    return newService;
};

// Example: Get expert's schedule
export const getExpertScheduleService = async (expertUserId: string): Promise<ISchedule | null> => {
    return await Schedule.findOne({ expert: expertUserId });
};

// Example: Update expert's schedule
export const updateExpertScheduleService = async (expertUserId: string, scheduleData: Partial<ISchedule>): Promise<ISchedule | null> => {
    // Filter allowed fields for update
    const allowedUpdates: Partial<ISchedule> = { // Explicitly type allowedUpdates
         timeZone: scheduleData.timeZone,
         generalAvailability: scheduleData.generalAvailability,
         specificAvailableSlots: scheduleData.specificAvailableSlots,
         blockedSlots: scheduleData.blockedSlots
    };
    // Remove undefined fields
    // CORRECTED LOOP
     Object.keys(allowedUpdates).forEach((key) => {
        const k = key as keyof typeof allowedUpdates; // Assert key type
        if (allowedUpdates[k] === undefined) {
            delete allowedUpdates[k];
        }
     });
    return await Schedule.findOneAndUpdate(
        { expert: expertUserId },
        { $set: allowedUpdates }, // Use $set to update only specified fields
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
};
` },
    {
        filePath: 'src/services/notification.service.ts',
        content: `// src/services/notification.service.ts
// Placeholder for creating and managing notifications
import Notification, { INotification, NotificationType } from '../models/Notification.model';
import mongoose from 'mongoose';

interface CreateNotificationData {\n    recipient: mongoose.Types.ObjectId | string;\n    type: NotificationType;\n    message: string;\n    sender?: mongoose.Types.ObjectId | string;\n    link?: string;\n}\n\nexport const createNotificationService = async (data: CreateNotificationData): Promise<INotification> => {\n    if (!data.recipient || !data.type || !data.message) {\n        throw new Error('Recipient, type, and message are required for notification');\n    }\n    // TODO: Implement actual notification sending logic (e.g., WebSockets, Push Notifications)\n    console.log(\`Simulating notification to \${data.recipient}: \${data.message}\`);\n    return await Notification.create(data);\n};\n\n// Example: Get unread notifications for a user\nexport const getUnreadNotificationsService = async (userId: string): Promise<INotification[]> => {\n    return await Notification.find({ recipient: userId, isRead: false }).sort({ createdAt: -1 });\n};\n\n// Example: Mark notification as read\nexport const markNotificationReadService = async (notificationId: string, userId: string): Promise<INotification | null> => {\n    // Ensure user owns the notification before marking as read\n    return await Notification.findOneAndUpdate({ _id: notificationId, recipient: userId }, { isRead: true }, { new: true });\n};\n`
    },
    {
        filePath: 'src/services/review.service.ts',
        // CORRECTED: Changed return type of getExpertReviewsService to any[]
        content: `// src/services/review.service.ts
// Placeholder for review logic
import Review, { IReview } from '../models/Review.model';
import Booking from '../models/Booking.model';
import AppError from '../utils/AppError';
import { IUser } from '../models/User.model'; // Import IUser for populate type hint
import mongoose from 'mongoose'; // Import mongoose

// Example: Create a review
export const createReviewService = async (userId: string | mongoose.Types.ObjectId, expertId: string | mongoose.Types.ObjectId, bookingId: string | mongoose.Types.ObjectId, rating: number, comment?: string): Promise<IReview> => {
    // 1. Verify the booking exists, belongs to the user, and is completed
    const booking = await Booking.findOne({ _id: bookingId, user: userId, status: 'completed' });
    if (!booking) {
        throw new AppError('Valid completed booking not found for review', 404);
    }
    // Ensure the booking expert matches the expert being reviewed
    if (booking.expert.toString() !== expertId.toString()) {
         throw new AppError('Booking does not match the expert being reviewed', 400);
    }

    // 2. Check if review already exists for this user/expert/booking combination (using index)
    // Mongoose unique index handles this, but explicit check can give better error message
    const existingReview = await Review.findOne({ user: userId, expert: expertId, booking: bookingId });
    if (existingReview) {
        throw new AppError('You have already reviewed this booking/expert', 400);
    }

    // 3. Create the review
    const newReview = await Review.create({
        user: userId,
        expert: expertId,
        booking: bookingId,
        rating: rating,
        comment: comment
    });

    // 4. Average rating calculation is handled by post-save hook in the model

    return newReview;
};

// Example: Get reviews for an expert
// CORRECTED RETURN TYPE
export const getExpertReviewsService = async (expertId: string | mongoose.Types.ObjectId): Promise<any[]> => {
    return await Review.find({ expert: expertId })
        .populate<{ user: Pick<IUser, 'name' | 'profilePicture'> }>('user', 'name profilePicture') // Populate reviewer info
        .sort({ createdAt: -1 });
};
`
    },
    // ... add other placeholder services as needed ...

    // --- Controllers (Updated / Placeholders) ---
    // (Controller content remains the same as previous version)
    {
        filePath: 'src/controllers/auth.controller.ts', // Renamed
        content: `// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import catchAsync from '../utils/catchAsync'; // Assuming catchAsync utility exists
import ms from 'ms'; // Import ms

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Add input validation here if needed (e.g., using Joi, express-validator)
    const newUser = await authService.registerUserService(req.body);
    // Exclude sensitive data before sending response if necessary
    res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        // Avoid sending password back, even if undefined
        // data: { user: newUser }
    });
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUserService(email, password);

    // Set cookie (optional, consider security implications - HttpOnly, Secure, SameSite)
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
        sameSite: 'strict' as const, // Or 'lax' - Use 'as const' for literal type
        expires: new Date(Date.now() + ms(process.env.TOKEN_EXPIRATION || '1h')) // Cookie expiry based on token expiry
    };
    res.cookie('jwt', token, cookieOptions);


    res.status(200).json({
        status: 'success',
        token,
        data: { user } // User object (without password) is returned
    });
});

// Placeholder for logout if using cookies/server-side sessions
export const logout = (req: Request, res: Response) => {
   res.cookie('jwt', 'loggedout', {
       expires: new Date(Date.now() + 10 * 1000), // Expire quickly
       httpOnly: true
    });
   res.status(200).json({ status: 'success' });
};
`
    },
    {
        filePath: 'src/controllers/user.controller.ts',
        content: `// src/controllers/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import catchAsync from '../utils/catchAsync'; // Assuming catchAsync utility exists
import AppError from '../utils/AppError'; // Assuming AppError utility exists
import { IUser } from '../models/User.model'; // Import IUser

// Extend Request interface to include user from auth middleware
interface AuthRequest extends Request {
    user?: IUser; // Attach the full user document from protect middleware
}

// Get current logged-in user's details
export const getMe = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    // The 'protect' middleware should have already attached the user
    if (!req.user) {
        // This case should ideally be caught by 'protect' middleware itself
        return next(new AppError('User not found in request. Authentication issue?', 401));
    }
    // No need to fetch again if protect middleware attaches full user doc
    res.status(200).json({ status: 'success', data: { user: req.user } });
});

// Update current logged-in user's details
export const updateMe = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
     if (!req.user) {
        return next(new AppError('Authentication required', 401));
    }
    const updatedUser = await userService.updateUserService(req.user.id, req.body);
     if (!updatedUser) {
         // This might happen if the user was deleted between protect middleware and here
        return next(new AppError('User not found or update failed', 404));
    }
    res.status(200).json({ status: 'success', data: { user: updatedUser } });
});

// Apply to become an expert
export const applyExpert = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
     if (!req.user) {
        return next(new AppError('Authentication required', 401));
    }
    // TODO: Add validation for expertData in req.body
    const expertProfile = await userService.applyForExpertRoleService(req.user.id, req.body);
    res.status(200).json({
        status: 'success',
        message: 'Expert application submitted successfully. Awaiting admin approval.',
        data: { expertProfile } // Send back the created/updated profile
    });
});

// --- Admin Only Routes (Accessed via specific routes with admin middleware) ---

// Get specific user details (Admin)
export const getUser = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = await userService.getUserDetailsService(req.params.id);
     if (!user) {
        return next(new AppError('User not found with that ID', 404));
    }
    res.status(200).json({ status: 'success', data: { user } });
});

// Update expert application status (Admin)
export const updateExpertApplication = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { status, rejectionReason } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
        return next(new AppError('Invalid status provided. Must be "approved" or "rejected".', 400));
    }
    if (status === 'rejected' && !rejectionReason) {
        // Optional: require rejection reason
        // return next(new AppError('Rejection reason is required when rejecting application.', 400));
    }

    const updatedUser = await userService.updateExpertStatusService(req.params.userId, status, rejectionReason);
     // Service throws error if user not found or status not pending
    res.status(200).json({
        status: 'success',
        message: \`Expert application status updated to \${status}\`,
        data: { user: updatedUser } // Return updated user doc
    });
});

// Placeholder for Get All Users (Admin) - Add pagination, filtering
// export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//      const users = await User.find(); // Add features
//      res.status(200).json({ status: 'success', results: users.length, data: { users } });
// });

// Placeholder for Delete User (Admin)
// export const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//      const user = await User.findByIdAndDelete(req.params.id);
//      if (!user) return next(new AppError('No user found with that ID', 404));
//      // Consider deleting related data (ExpertProfile etc.) or handle via hooks/cascade
//      res.status(204).json({ status: 'success', data: null });
// });

// Public Controller: Get Expert Profile
export const getPublicExpertProfile = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const profile = await userService.getExpertProfileService(req.params.expertUserId);
    if (!profile) {
        return next(new AppError('Expert profile not found or not approved', 404));
    }
     res.status(200).json({ status: 'success', data: { profile } });
});
`
    },
    {
        filePath: 'src/controllers/livekit.controller.ts', // Renamed
        // Content remains largely the same, just updated imports/exports
        content: `// src/controllers/livekit.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as livekitService from '../services/livekit.service';
import AppError from '../utils/AppError'; // Assuming AppError utility exists
import catchAsync from '../utils/catchAsync'; // Assuming catchAsync utility exists
import { IUser } from '../models/User.model'; // Import IUser

// Extend Request interface if user info is needed from auth middleware
interface AuthRequest extends Request {
    user?: IUser; // Attach the full user document
}

export const getToken = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const room = req.query.room as string;
    // Use authenticated user's ID as identity
    const identity = req.user?.id;
    // Use authenticated user's name as display name
    const name = req.user?.name;

    if (!room) {
        return next(new AppError('Room name is required in query parameters', 400));
    }
    if (!identity) {
         // This should be caught by 'protect' middleware, but double-check
        return next(new AppError('User identity not found. Authentication required.', 401));
    }

    const token = livekitService.generateTokenService(room, identity, name);
    res.status(200).json({ token });
});
`
    },
    // Add Placeholder Controllers
    { filePath: 'src/controllers/booking.controller.ts', content: `// src/controllers/booking.controller.ts\n// Placeholder for Booking controller logic\nimport { Request, Response, NextFunction } from 'express';\nimport * as bookingService from '../services/booking.service';\nimport catchAsync from '../utils/catchAsync';\nimport AppError from '../utils/AppError';\nimport { IUser } from '../models/User.model'; \n\ninterface AuthRequest extends Request { user?: IUser; }\n\n// Example: Create Booking\nexport const createBooking = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {\n    const { expertId, serviceId, scheduledTime } = req.body;\n    if (!req.user) return next(new AppError('Authentication required', 401));\n    if (!expertId || !serviceId) return next(new AppError('Expert ID and Service ID are required', 400));\n\n    const booking = await bookingService.createBookingService(req.user.id, expertId, serviceId, scheduledTime ? new Date(scheduledTime) : undefined);\n    res.status(201).json({ status: 'success', data: { booking } });\n});\n\n// Example: Get User's Bookings\nexport const getMyBookings = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {\n    if (!req.user) return next(new AppError('Authentication required', 401));\n    // const bookings = await Booking.find({ user: req.user.id }).populate('expert service'); // Add service/expert details\n    res.status(501).json({ status: 'error', message: 'getMyBookings not implemented' });\n});\n\n// Example: Get Expert's Bookings\nexport const getMyExpertBookings = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {\n    if (!req.user || !req.user.roles.includes('expert')) return next(new AppError('Expert role required', 403));\n    // const bookings = await Booking.find({ expert: req.user.id }).populate('user service'); // Add service/user details\n    res.status(501).json({ status: 'error', message: 'getMyExpertBookings not implemented' });\n});\n` },
    { filePath: 'src/controllers/payment.controller.ts', content: `// src/controllers/payment.controller.ts\n// Placeholder for Payment controller logic\nimport { Request, Response, NextFunction } from 'express';\nimport * as paymentService from '../services/payment.service';\nimport catchAsync from '../utils/catchAsync';\nimport AppError from '../utils/AppError';\nimport { IUser } from '../models/User.model';\n\ninterface AuthRequest extends Request { user?: IUser; }\n\n// Example: Initiate Payment\nexport const initiatePayment = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {\n    const { amount, currency = 'BDT', bookingId, starWishId } = req.body;\n    if (!req.user) return next(new AppError('Authentication required', 401));\n    if (!amount || amount <= 0) return next(new AppError('Valid amount is required', 400));\n    if (!bookingId && !starWishId) return next(new AppError('Either bookingId or starWishId is required', 400));\n\n    // TODO: Verify amount matches the booking/starWish price\n\n    const result = await paymentService.initiateSslCommerzPaymentService(req.user.id, amount, currency, bookingId, starWishId);\n    res.status(200).json({ status: 'success', data: result });\n});\n\n// Example IPN Handler Route (POST) - No Auth needed\nexport const handleSslCommerzNotify = catchAsync(async (req: Request, res: Response, next: NextFunction) => {\n    // IMPORTANT: Add validation logic here to verify the IPN source if possible\n    console.log("SSLCommerz IPN Received:", req.body);\n    await paymentService.handleSslCommerzIpnService(req.body);\n    // Send a 200 OK response to SSLCommerz to acknowledge receipt\n    res.status(200).send('IPN Received and processing initiated.');\n});\n\n// Example Success/Fail/Cancel Handlers (GET) - User redirected here\nexport const handlePaymentSuccess = catchAsync(async (req: Request, res: Response, next: NextFunction) => {\n    const transactionId = req.params.transactionId;\n    // Optional: Verify payment status again based on transactionId if needed\n    // Redirect user to a success page on the frontend\n    res.redirect(\`\${process.env.FRONTEND_URL}/payment/success?transaction=\${transactionId}\`); // Add FRONTEND_URL to .env\n});\n\nexport const handlePaymentFail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {\n    const transactionId = req.params.transactionId;\n    // Optional: Log failure, notify user\n    res.redirect(\`\${process.env.FRONTEND_URL}/payment/fail?transaction=\${transactionId}\`);\n});\n\nexport const handlePaymentCancel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {\n    const transactionId = req.params.transactionId;\n     // Optional: Log cancellation\n    res.redirect(\`\${process.env.FRONTEND_URL}/payment/cancel?transaction=\${transactionId}\`);\n});\n` },
    { filePath: 'src/controllers/expert.controller.ts', content: `// src/controllers/expert.controller.ts\n// Placeholder for Expert controller logic\nimport { Request, Response, NextFunction } from 'express';\nimport * as expertService from '../services/expert.service';\nimport * as userService from '../services/user.service'; // For profile updates\nimport catchAsync from '../utils/catchAsync';\nimport AppError from '../utils/AppError';\nimport { IUser } from '../models/User.model';\n\ninterface AuthRequest extends Request { user?: IUser; }\n\n// Controller for expert to update their own profile\nexport const updateMyExpertProfile = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {\n    if (!req.user) return next(new AppError('Authentication required', 401));\n    // Service function should handle filtering allowed fields\n    const updatedProfile = await userService.updateExpertProfileService(req.user.id, req.body);\n    if (!updatedProfile) return next(new AppError('Expert profile not found or update failed', 404));\n    res.status(200).json({ status: 'success', data: { profile: updatedProfile } });\n});\n\n// Controller for expert to add a service\nexport const addMyService = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {\n    if (!req.user) return next(new AppError('Authentication required', 401));\n    // TODO: Validate service data in req.body\n    const newService = await expertService.addExpertServiceService(req.user.id, req.body);\n    res.status(201).json({ status: 'success', data: { service: newService } });\n});\n\n// Controller for expert to get their schedule\nexport const getMySchedule = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {\n    if (!req.user) return next(new AppError('Authentication required', 401));\n    const schedule = await expertService.getExpertScheduleService(req.user.id);\n    res.status(200).json({ status: 'success', data: { schedule } });\n});\n\n// Controller for expert to update their schedule\nexport const updateMySchedule = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {\n    if (!req.user) return next(new AppError('Authentication required', 401));\n    // TODO: Validate schedule data in req.body\n    const updatedSchedule = await expertService.updateExpertScheduleService(req.user.id, req.body);\n    res.status(200).json({ status: 'success', data: { schedule: updatedSchedule } });\n});\n` },
    { filePath: 'src/controllers/review.controller.ts', content: `// src/controllers/review.controller.ts\n// Placeholder for Review controller logic\nimport { Request, Response, NextFunction } from 'express';\nimport * as reviewService from '../services/review.service';\nimport catchAsync from '../utils/catchAsync';\nimport AppError from '../utils/AppError';\nimport { IUser } from '../models/User.model';\n\ninterface AuthRequest extends Request { user?: IUser; }\n\n// Create Review\nexport const createReview = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {\n    const { expertId, bookingId, rating, comment } = req.body;\n    if (!req.user) return next(new AppError('Authentication required', 401));\n    if (!expertId || !bookingId || !rating) {\n        return next(new AppError('Expert ID, Booking ID, and Rating are required', 400));\n    }\n    const review = await reviewService.createReviewService(req.user.id, expertId, bookingId, rating, comment);\n    res.status(201).json({ status: 'success', data: { review } });\n});\n\n// Get Reviews for an Expert\nexport const getExpertReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {\n    const { expertId } = req.params;\n    const reviews = await reviewService.getExpertReviewsService(expertId);\n    res.status(200).json({ status: 'success', results: reviews.length, data: { reviews } });\n});\n` },
    { filePath: 'src/controllers/notification.controller.ts', content: `// src/controllers/notification.controller.ts\n// Placeholder for Notification controller logic\nimport { Request, Response, NextFunction } from 'express';\nimport * as notificationService from '../services/notification.service';\nimport catchAsync from '../utils/catchAsync';\nimport AppError from '../utils/AppError';\nimport { IUser } from '../models/User.model';\n\ninterface AuthRequest extends Request { user?: IUser; }\n\n// Get My Unread Notifications\nexport const getMyUnreadNotifications = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {\n    if (!req.user) return next(new AppError('Authentication required', 401));\n    const notifications = await notificationService.getUnreadNotificationsService(req.user.id);\n    res.status(200).json({ status: 'success', results: notifications.length, data: { notifications } });\n});\n\n// Mark a Notification as Read\nexport const markAsRead = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {\n    const { notificationId } = req.params;\n    if (!req.user) return next(new AppError('Authentication required', 401));\n    const notification = await notificationService.markNotificationReadService(notificationId, req.user.id);\n    if (!notification) return next(new AppError('Notification not found or permission denied', 404));\n    res.status(200).json({ status: 'success', data: { notification } });\n});\n` },
    // ... add other placeholder controllers ...

    // --- Routes (Updated / Placeholders) ---
    {
        filePath: 'src/routes/auth.routes.ts', // Renamed
        content: `// src/routes/auth.routes.ts
import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout); // If using cookie-based logout
// Add routes for password reset, email verification etc. if needed

export default router;
`
    },
    {
        filePath: 'src/routes/user.routes.ts',
        content: `// src/routes/user.routes.ts
import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import * as authMiddleware from '../middlewares/auth.middleware'; // Assuming middleware exists

const router = Router();

// --- Public Routes (if any related to users/experts) ---
// Example: Publicly view expert profile
router.get('/expert-profile/:expertUserId', userController.getPublicExpertProfile);


// --- Protected Routes (Require Login) ---
router.use(authMiddleware.protect);

router.get('/me', userController.getMe); // Get logged-in user's details
router.patch('/updateMe', userController.updateMe); // Update logged-in user's details
router.post('/apply-expert', userController.applyExpert); // Apply to become expert

// --- Admin Only Routes ---
// Mount admin routes separately or use restrictTo middleware
const adminRouter = Router(); // Create a sub-router for admin routes
adminRouter.use(authMiddleware.restrictTo('admin')); // Restrict ALL following routes to admin

adminRouter.get('/', /* userController.getAllUsers */ (req, res) => res.status(501).send('Not Implemented')); // Placeholder for get all users
adminRouter.get('/:id', userController.getUser); // Get specific user by ID
adminRouter.patch('/update-expert-status/:userId', userController.updateExpertApplication); // Approve/reject expert app
// adminRouter.delete('/:id', userController.deleteUser); // Delete a user

// Mount the admin sub-router under the main user router with a prefix (optional)
router.use('/admin', adminRouter);


export default router;
`
    },
    {
        filePath: 'src/routes/livekit.routes.ts', // Renamed
        content: `// src/routes/livekit.routes.ts
import { Router } from 'express';
import * as livekitController from '../controllers/livekit.controller';
import * as authMiddleware from '../middlewares/auth.middleware'; // Assuming middleware exists

const router = Router();

// Endpoint to generate a LiveKit token - requires authentication
// GET /api/v1/livekit/token?room=roomName
router.get('/token', authMiddleware.protect, livekitController.getToken);

export default router;
`
    },
    // Add Placeholder Routes
    { filePath: 'src/routes/booking.routes.ts', content: `// src/routes/booking.routes.ts\nimport { Router } from 'express';\nimport * as bookingController from '../controllers/booking.controller';\nimport * as authMiddleware from '../middlewares/auth.middleware';\nconst router = Router();\n\nrouter.use(authMiddleware.protect); // All booking routes require login\n\nrouter.post('/', bookingController.createBooking);\nrouter.get('/my-bookings', bookingController.getMyBookings);\nrouter.get('/my-expert-bookings', authMiddleware.restrictTo('expert'), bookingController.getMyExpertBookings);\n// Add routes for GET /:id, PATCH /:id (update status), DELETE /:id (cancel)\n\nexport default router;\n` },
    { filePath: 'src/routes/payment.routes.ts', content: `// src/routes/payment.routes.ts\nimport { Router } from 'express';\nimport * as paymentController from '../controllers/payment.controller';\nimport * as authMiddleware from '../middlewares/auth.middleware';\nconst router = Router();\n\n// Initiate payment - requires auth\nrouter.post('/initiate', authMiddleware.protect, paymentController.initiatePayment);\n\n// SSLCommerz callbacks - NO auth middleware, handled by SSLCommerz\nrouter.post('/notify/sslcommerz', paymentController.handleSslCommerzNotify); // IPN Listener\n// Use POST for redirect URLs as recommended by SSLCommerz\nrouter.post('/success/:transactionId', paymentController.handlePaymentSuccess); // Success Redirect\nrouter.post('/fail/:transactionId', paymentController.handlePaymentFail);       // Fail Redirect\nrouter.post('/cancel/:transactionId', paymentController.handlePaymentCancel);   // Cancel Redirect\n\n// Optional: Route to check payment status by transaction ID (requires auth)\n// router.get('/status/:transactionId', authMiddleware.protect, paymentController.getPaymentStatus);\n\nexport default router;\n` },
    { filePath: 'src/routes/expert.routes.ts', content: `// src/routes/expert.routes.ts\nimport { Router } from 'express';\nimport * as expertController from '../controllers/expert.controller';\nimport * as userController from '../controllers/user.controller'; // For public profile controller\nimport * as authMiddleware from '../middlewares/auth.middleware';\nconst router = Router();\n\n// Public route to get expert profile - uses user controller\nrouter.get('/:expertUserId/profile', userController.getPublicExpertProfile);\n\n// Protected routes for experts to manage their own stuff\nrouter.use(authMiddleware.protect, authMiddleware.restrictTo('expert'));\n\nrouter.patch('/profile/me', expertController.updateMyExpertProfile); // Update my expert profile\nrouter.post('/services', expertController.addMyService); // Add a new service\n// router.patch('/services/:serviceId', expertController.updateMyService);\n// router.delete('/services/:serviceId', expertController.deleteMyService);\nrouter.get('/schedule/me', expertController.getMySchedule);\nrouter.patch('/schedule/me', expertController.updateMySchedule);\n\nexport default router;\n` },
    { filePath: 'src/routes/review.routes.ts', content: `// src/routes/review.routes.ts\nimport { Router } from 'express';\nimport * as reviewController from '../controllers/review.controller';\nimport * as authMiddleware from '../middlewares/auth.middleware';\nconst router = Router();\n\n// Get reviews for a specific expert (public)\nrouter.get('/expert/:expertId', reviewController.getExpertReviews);\n\n// Create a review (requires user login)\nrouter.post('/', authMiddleware.protect, reviewController.createReview);\n\n// Maybe add routes for updating/deleting own review?\n\nexport default router;\n` },
    { filePath: 'src/routes/notification.routes.ts', content: `// src/routes/notification.routes.ts\nimport { Router } from 'express';\nimport * as notificationController from '../controllers/notification.controller';\nimport * as authMiddleware from '../middlewares/auth.middleware';\nconst router = Router();\n\nrouter.use(authMiddleware.protect); // All notification routes require login\n\nrouter.get('/unread', notificationController.getMyUnreadNotifications);\nrouter.patch('/:notificationId/read', notificationController.markAsRead);\n\nexport default router;\n` },
    // ... add other placeholder routes ...

    // --- Middlewares ---
    // (Middleware content remains the same as previous version)
    {
        filePath: 'src/middlewares/auth.middleware.ts', // Renamed
        content: `// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User, { IUser } from '../models/User.model'; // Import User model
import catchAsync from '../utils/catchAsync'; // Assuming catchAsync utility exists
import AppError from '../utils/AppError'; // Assuming AppError utility exists

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Extend Express Request interface
declare global {
    namespace Express {
        interface Request {
            user?: IUser; // Attach the full user document
        }
    }
}

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // else if (req.cookies.jwt) { // Optional: Check for token in cookies
    //   token = req.cookies.jwt;
    // }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    if (!JWT_SECRET) {
         // Log detailed error only on server
         console.error("FATAL: JWT_SECRET not configured in auth.middleware.");
         return next(new AppError('Internal server configuration error.', 500));
    }

    // 2) Verification token
    let decoded: any; // Use 'any' or define a specific DecodedPayload interface { id: string, iat: number, exp: number }
    try {
        decoded = jwt.verify(token, JWT_SECRET);
        // Check if decoded payload has user ID (adjust 'id' if your payload uses a different key like 'userId' or 'sub')
        if (!decoded || typeof decoded !== 'object' || !decoded.id) {
             throw new Error('Invalid token payload');
        }
    } catch (err: any) { // Explicitly type err as any or Error
         // Handle specific errors like TokenExpiredError or JsonWebTokenError
         if (err.name === 'TokenExpiredError') {
            return next(new AppError('Your token has expired! Please log in again.', 401));
         }
         return next(new AppError('Invalid token. Please log in again.', 401));
    }


    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    // 4) Check if user changed password after the token was issued (Optional but recommended)
    // Requires adding a 'passwordChangedAt' field to the User model
    // if (currentUser.passwordChangedAt && decoded.iat) {
    //    const changedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
    //    if (changedTimestamp > decoded.iat) {
    //        return next(new AppError('User recently changed password! Please log in again.', 401));
    //    }
    // }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser; // Attach user document to the request object
    res.locals.user = currentUser; // Also make available in templates if needed
    next();
});

// Middleware to restrict routes to specific roles
export const restrictTo = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // protect middleware should run first and attach req.user
        if (!req.user || !req.user.roles || !req.user.roles.some(role => roles.includes(role))) {
            // Log details for debugging if needed
            // console.log('Permission denied. User roles:', req.user?.roles, 'Required roles:', roles);
            return next(new AppError('You do not have permission to perform this action', 403)); // 403 Forbidden
        }
        next();
    };
};
`
    },
    {
        filePath: 'src/middlewares/logger.middleware.ts', // Renamed
        content: `// src/middlewares/logger.middleware.ts
import { Request, Response, NextFunction } from 'express';

const logger = (req: Request, res: Response, next: NextFunction): void => {
  const timestamp = new Date().toISOString();
  console.log(\`[\${timestamp}] \${req.method} \${req.originalUrl} IP: \${req.ip}\`); // Added IP
  next();
};

export default logger;
`
    },
     {
        filePath: 'src/middlewares/error.middleware.ts',
        // CORRECTED: Escaped backslash in regex
        content: `// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError'; // Assuming AppError utility exists
import mongoose from 'mongoose';

// Define a more specific Error type if needed
interface CustomError extends Error {
    statusCode?: number;
    status?: string;
    isOperational?: boolean;
    // Mongoose specific error properties
    path?: string; // For CastError, ValidationError
    value?: any; // For CastError
    code?: number; // For duplicate key error (11000)
    keyValue?: any; // For duplicate key error
    errors?: { [key: string]: mongoose.Error.ValidatorError | mongoose.Error.CastError }; // For ValidationError
}

const handleCastErrorDB = (err: CustomError): AppError => {
    const message = \`Invalid \${err.path}: \${JSON.stringify(err.value)}.\`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: CustomError): AppError => {
    // Extract field name and value more reliably
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'field';
    const value = err.keyValue ? err.keyValue[field] : 'value';
    const message = \`Duplicate \${field} value: "\${value}". Please use another value!\`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err: CustomError): AppError => {
    // Extract specific error messages from Mongoose ValidationError
    const errors = err.errors ? Object.values(err.errors).map(el => el.message) : ['Validation error'];
    const message = \`Invalid input data. \${errors.join('. ')}\`;
    return new AppError(message, 400);
};

const handleJWTError = (): AppError => new AppError('Invalid token. Please log in again!', 401);
const handleJWTExpiredError = (): AppError => new AppError('Your token has expired! Please log in again.', 401);


const sendErrorDev = (err: CustomError, req: Request, res: Response) => {
    // API errors
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode || 500).json({
            status: err.status || 'error',
            error: err,
            message: err.message,
            stack: err.stack
        });
    }
    // Rendered website errors (using EJS template)
    console.error('ERROR 💥', err);
    return res.status(err.statusCode || 500).render('error', {
        title: 'Something went wrong!',
        message: err.message,
        error: err // Pass full error only in dev
    });
};

const sendErrorProd = (err: CustomError, req: Request, res: Response) => {
    // A) API errors
    if (req.originalUrl.startsWith('/api')) {
        // Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode || 500).json({
                status: err.status || 'error',
                message: err.message
            });
        }
        // Programming or other unknown error: don't leak error details
        // 1) Log error
        console.error('ERROR 💥', err);
        // 2) Send generic message
        return res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }

    // B) Rendered website errors
     if (err.isOperational) {
         // Operational, trusted error: send message to client
        return res.status(err.statusCode || 500).render('error', {
            title: 'Something went wrong!',
            message: err.message,
            error: null // Don't leak details in prod
        });
    }
    // Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(500).render('error', {
        title: 'Something went wrong!',
        message: 'Please try again later.',
        error: null
    });
};


const globalErrorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    let error = { ...err, message: err.message, name: err.name }; // Create a copy, include name

    // Handle specific Mongoose errors in production
    if (process.env.NODE_ENV === 'production') {
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error); // Mongoose duplicate key error
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    }

    // Send response based on environment
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(error, req, res);
    } else { // NODE_ENV === 'production' or other
        sendErrorProd(error, req, res);
    }
};

export default globalErrorHandler;
`
    },


    // --- Utils (Placeholders) ---
    {
        filePath: 'src/utils/AppError.ts',
        content: `// src/utils/AppError.ts
// Custom error class for operational errors (errors we expect and handle)
class AppError extends Error {
    public statusCode: number;
    public status: string;
    public isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);

        this.statusCode = statusCode;
        // Status depends on statusCode (4xx = fail, 5xx = error)
        this.status = \`\${statusCode}\`.startsWith('4') ? 'fail' : 'error';
        // All instances of AppError are operational errors
        this.isOperational = true;

        // Capture stack trace, excluding constructor call from it
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
`
    },
     {
        filePath: 'src/utils/catchAsync.ts',
        content: `// src/utils/catchAsync.ts
import { Request, Response, NextFunction } from 'express';

// Define a type for async middleware functions
type AsyncMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<any>;

/**
 * Wraps an async middleware function to catch any errors and pass them
 * to the Express error handling middleware (via next(err)).
 * @param fn The async middleware function to wrap.
 * @returns A standard Express middleware function.
 */
const catchAsync = (fn: AsyncMiddleware) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next); // Catches promise rejections and passes error to next()
    };
};

export default catchAsync;
`
    },

    // --- Helpers ---
    {
        filePath: 'src/helpers/formatDate.ts', // Kept from original
        content: `// src/helpers/formatDate.ts
/**
 * Formats a Date object into a simple string (e.g., "Thu Apr 03 2025").
 * @param date The Date object to format.
 * @returns The formatted date string.
 */
export const formatDate = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
      return "Invalid Date";
  }
  return date.toDateString(); // Simple formatting, adjust using libraries like date-fns or moment if needed
};
`
    },

    // --- Public/Views ---
    // (Public/Views content remains the same as previous version)
    {
        filePath: 'public/index.html', // Kept from original
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Star Connect Static Page</title>
  <link rel="stylesheet" href="/static/stylesheets/style.css"> </head>
<body>
  <h1>This is the static index page served at /static</h1>
  <p>Add your static frontend assets here or use a dedicated frontend framework.</p>
</body>
</html>
`
    },
     {
        filePath: 'public/stylesheets/style.css', // Added basic CSS example
        content: `/* public/stylesheets/style.css */
body {
  font-family: sans-serif;
  padding: 20px;
  background-color: #f4f4f4;
}

h1 {
  color: #333;
}
`
    },
    {
        filePath: 'views/index.ejs', // Kept from original
        content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome</title>
     <link rel="stylesheet" href="/static/stylesheets/style.css"> </head>
  <body>
    <h1>Welcome to the Star Connect Backend!</h1>
    <p>This is a dynamic page rendered using EJS on the server.</p>
    <p>Current Time (Server): <%= new Date().toLocaleTimeString() %></p> <%# Example EJS usage %>
  </body>
</html>
`
    },
    {
        filePath: 'views/error.ejs',
        content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error</title>
     <link rel="stylesheet" href="/static/stylesheets/style.css">
     <style>
        .error-stack {
            background-color: #eee;
            padding: 10px;
            border-radius: 5px;
            white-space: pre-wrap; /* Preserve formatting */
            word-wrap: break-word; /* Wrap long lines */
            font-family: monospace;
            font-size: 0.9em;
            margin-top: 20px;
        }
     </style>
  </head>
  <body>
    <h1>Oops! Something went wrong.</h1>
    <% if (message) { %>
        <p><strong>Message:</strong> <%= message %></p>
    <% } else { %>
        <p>An unexpected error occurred. Please try again later.</p>
    <% } %>

    <%# Show stack trace only in development environment %>
    <% if (process.env.NODE_ENV === 'development' && error && error.stack) { %>
      <h2>Developer Info (Stack Trace):</h2>
      <pre class="error-stack"><%= error.stack %></pre>
    <% } %>
  </body>
</html>
`
    },


    // --- Main App File ---
    {
        filePath: 'src/app.ts',
        // CORRECTED: Added mongoose import and typed 'err' in catch block
        content: `// src/app.ts
import dotenv from 'dotenv';
dotenv.config(); // Load .env variables MUST BE FIRST
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import http from 'http';
import https from 'https'; // Import https
import mongoose from 'mongoose'; // <-- ADDED IMPORT
import connectDB from './db'; // Import DB connection function
import logger from './middlewares/logger.middleware'; // Import logger
import globalErrorHandler from './middlewares/error.middleware'; // Import global error handler
import AppError from './utils/AppError'; // Import AppError

// --- Connect to Database ---
connectDB();

const app = express();

// --- View Engine Setup ---
app.set('view engine', 'ejs');
// Use path.resolve to ensure correct path regardless of where script is run
app.set('views', path.resolve(process.cwd(), 'views')); // Points to views folder in project root

// --- Middlewares ---
// Enable CORS - Configure origins properly for production
app.use(cors());
// Or configure specific origins:
// app.use(cors({ origin: process.env.FRONTEND_URL }));

// Body parsers
app.use(express.json({ limit: '10kb' })); // Parse JSON bodies (limit size)
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // Parse URL-encoded bodies

// Request Logger
app.use(logger);

// --- Static Files ---
// Serve static files from 'public' directory
app.use('/static', express.static(path.resolve(process.cwd(), 'public')));

// --- Routes ---
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import livekitRoutes from './routes/livekit.routes';
import bookingRoutes from './routes/booking.routes';
import paymentRoutes from './routes/payment.routes';
import expertRoutes from './routes/expert.routes';
import reviewRoutes from './routes/review.routes';
import notificationRoutes from './routes/notification.routes';
// ... import other routes ...

// Root/Test routes
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'Welcome to Star Connect API!'});
});
app.get('/home', (req: Request, res: Response) => {
  res.render('index'); // Renders views/index.ejs
});

// API Routes Versioning
const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/livekit', livekitRoutes);
apiRouter.use('/bookings', bookingRoutes);
apiRouter.use('/payments', paymentRoutes);
apiRouter.use('/experts', expertRoutes); // Routes for expert-specific actions/data
apiRouter.use('/reviews', reviewRoutes);
apiRouter.use('/notifications', notificationRoutes);
// ... use other routes ...

app.use('/api/v1', apiRouter); // Mount all API routes under /api/v1


// --- Handle Undefined Routes ---
// This middleware should be AFTER all your defined routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(\`Can't find \${req.originalUrl} on this server!\`, 404));
});

// --- Global Error Handling Middleware ---
// Must be the LAST middleware defined
app.use(globalErrorHandler);


// --- Server Setup ---
const PORT = process.env.PORT || 3001; // Use 3001 as default if PORT not in .env

let server: http.Server | https.Server;

// Conditional server creation: HTTPS if cert files exist, otherwise HTTP
const certDir = path.resolve(process.cwd(), 'cert');
const certPath = path.join(certDir, 'server.cert');
const keyPath = path.join(certDir, 'server.key');

try {
    if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
        const httpsOptions = {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath)
        };
        server = https.createServer(httpsOptions, app);
        console.log("Attempting to start HTTPS server...");
    } else {
        console.log("Certificate files ('server.cert', 'server.key') not found in 'cert' directory.");
        console.log("Starting HTTP server...");
        server = http.createServer(app);
    }

    server.listen(PORT, () => {
        console.log(\`\nServer type: \${server instanceof https.Server ? 'HTTPS' : 'HTTP'}\`);
        console.log(\`App running on port \${PORT}...\`);
        console.log(\`Environment: \${process.env.NODE_ENV || 'development'}\`);
    });

} catch (err: any) { // Type err in catch
     console.error("FATAL: Server startup error:", err);
     process.exit(1);
}

// --- Graceful Shutdown Handling ---
const shutdown = (signal: string) => {
    console.log(\`\n👋 \${signal} RECEIVED. Shutting down gracefully...\`);
    server?.close(() => {
        console.log('💥 HTTP server closed.');
        // Now mongoose is defined
        mongoose.connection.close(false).then(() => { // Mongoose >= 6.9 returns promise
             console.log(' Mongoose connection closed.');
             process.exit(0);
        }).catch((err: Error) => { // <-- TYPED err
             console.error('Error closing Mongoose connection:', err);
             process.exit(1);
        });
    });
     // Force close server after a timeout if graceful shutdown fails
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000); // 10 seconds timeout
};

// Handle Unhandled Rejections (e.g., DB connection errors after startup)
process.on('unhandledRejection', (reason: Error | any, promise: Promise<any>) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(reason?.name || 'Error', reason?.message || reason);
    // Optionally log the stack: console.error(reason.stack);
    // Graceful shutdown
    shutdown('unhandledRejection');

});

// Handle Uncaught Exceptions
process.on('uncaughtException', (err: Error) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    console.error(err.stack);
    // Graceful shutdown (optional for uncaught exceptions, as state might be corrupt)
    // Consider just exiting: process.exit(1);
     shutdown('uncaughtException');
});


// Handle SIGTERM (e.g., from Heroku, Docker) and SIGINT (Ctrl+C)
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));


export default app; // Export app for testing or other purposes
`
    },

];

// --- Create Sample Files ---
console.log('Creating sample files...');
sampleFiles.forEach((item) => {
    const filePath = path.join(process.cwd(), item.filePath);
    // Ensure parent directory exists before writing file
    const dirName = path.dirname(filePath);
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
        // console.log(`  Created parent directory for: ${item.filePath}`);
    }

    // Write file only if it doesn't exist (prevents overwriting existing user changes)
    if (!fs.existsSync(filePath)) {
        try {
            fs.writeFileSync(filePath, item.content.trim() + '\n', 'utf8'); // Ensure newline at end
            console.log(`  Created file: ${item.filePath}`);
        } catch (err) {
             console.error(`  Error creating file ${item.filePath}:`, err);
        }
    } else {
        console.log(`  File already exists: ${item.filePath} (Skipped)`); // Indicate skipped files
    }
});

console.log("\nProject structure and sample files creation complete.");
console.log("----------------------------------------------------");
console.log("Next Steps:");
console.log("1. Run 'npm install' to install dependencies.");
console.log("2. Update the '.env' file with your actual credentials (DB URI, JWT Secret, LiveKit keys/URL, SSLCommerz keys/URLs, Frontend URL).");
console.log("3. Review and implement the logic in placeholder services (*.service.ts), controllers (*.controller.ts), and routes (*.routes.ts).");
console.log("4. For HTTPS, place 'server.cert' and 'server.key' in the 'cert' directory.");
console.log("5. Run 'npm run build' to compile TypeScript to JavaScript (output in 'dist').");
console.log("6. Run 'npm start' to run the compiled app, or 'npm run dev' for development (uses ts-node-dev).");
console.log("----------------------------------------------------");

