import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import Wishlist from '../models/Wishlist.js';
import { ErrorResponse } from '../utils/errorResponse.js';
import { generateToken, sendTokenCookie } from '../utils/generateToken.js';

const sendUserResponse = (res, user, statusCode = 200) => {
  const token = generateToken(user._id);
  sendTokenCookie(res, token);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      bio: user.bio,
      preferences: user.preferences,
    },
  });
};

export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ErrorResponse(errors.array()[0].msg, 400);

  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) throw new ErrorResponse('Email already registered', 400);

  const user = await User.create({ name, email, password });
  await Wishlist.create({ user: user._id, destinations: [] });
  sendUserResponse(res, user, 201);
});

export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ErrorResponse(errors.array()[0].msg, 400);

  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ErrorResponse('Invalid email or password', 401);
  }
  sendUserResponse(res, user);
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', { expires: new Date(0), httpOnly: true });
  res.json({ success: true, message: 'Logged out' });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'title images pricePerPerson rating location slug');
  res.json({ success: true, user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const fields = ['name', 'phone', 'bio', 'preferences'];
  const updates = {};
  fields.forEach((f) => {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  res.json({ success: true, user });
});

export const updatePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(req.body.currentPassword))) {
    throw new ErrorResponse('Current password is incorrect', 401);
  }
  user.password = req.body.newPassword;
  await user.save();
  sendUserResponse(res, user);
});
