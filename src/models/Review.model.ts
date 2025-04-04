// src/models/Review.model.ts
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
