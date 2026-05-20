import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String, maxlength: 200 },
    location: { type: String, required: true },
    country: { type: String, required: true },
    region: String,
    category: {
      type: String,
      enum: ['beach', 'mountain', 'city', 'adventure', 'cultural', 'wildlife', 'luxury', 'budget'],
      required: true,
    },
    images: [
      {
        public_id: String,
        url: { type: String, required: true },
      },
    ],
    pricePerPerson: { type: Number, required: true, min: 0 },
    duration: { type: Number, required: true, min: 1 },
    maxGroupSize: { type: Number, default: 20 },
    highlights: [String],
    included: [String],
    excluded: [String],
    itinerary: [
      {
        day: Number,
        title: String,
        description: String,
        activities: [String],
      },
    ],
    coordinates: {
      lat: Number,
      lng: Number,
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    tags: [String],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

destinationSchema.index({ title: 'text', location: 'text', country: 'text', description: 'text' });
destinationSchema.index({ category: 1, pricePerPerson: 1, rating: -1 });

destinationSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.model('Destination', destinationSchema);
