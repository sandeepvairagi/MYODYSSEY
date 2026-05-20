import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    travelers: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true },
    pricePerPerson: Number,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    contactInfo: {
      name: String,
      email: String,
      phone: String,
    },
    specialRequests: String,
    bookingReference: { type: String, unique: true },
    itinerary: [
      {
        day: Number,
        title: String,
        description: String,
        activities: [String],
      },
    ],
  },
  { timestamps: true }
);

bookingSchema.pre('save', function (next) {
  if (!this.bookingReference) {
    this.bookingReference = `MO-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }
  next();
});

export default mongoose.model('Booking', bookingSchema);
