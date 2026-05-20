import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    avatar: {
      public_id: String,
      url: { type: String, default: 'https://ui-avatars.com/api/?name=User&background=0ea5e9&color=fff' },
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    phone: String,
    bio: { type: String, maxlength: 500 },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Destination' }],
    recentlyViewed: [
      {
        destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' },
        viewedAt: { type: Date, default: Date.now },
      },
    ],
    preferences: {
      categories: [String],
      budgetRange: { min: Number, max: Number },
    },
    isActive: { type: Boolean, default: true },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
