import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: String,
    comment: { type: String, required: true, maxlength: 1000 },
    images: [{ public_id: String, url: String }],
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ destination: 1, user: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
