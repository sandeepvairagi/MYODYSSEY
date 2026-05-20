import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Destination from '../models/Destination.js';
import Payment from '../models/Payment.js';
import Review from '../models/Review.js';
import { ErrorResponse } from '../utils/errorResponse.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [users, destinations, bookings, revenue, recentBookings] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Destination.countDocuments({ isActive: true }),
    Booking.countDocuments(),
    Payment.aggregate([
      { $match: { status: 'captured' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Booking.find()
      .populate('user', 'name email')
      .populate('destination', 'title')
      .sort('-createdAt')
      .limit(10),
  ]);

  const bookingsByStatus = await Booking.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const monthlyRevenue = await Payment.aggregate([
    { $match: { status: 'captured' } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        revenue: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 },
  ]);

  res.json({
    success: true,
    stats: {
      users,
      destinations,
      bookings,
      revenue: revenue[0]?.total || 0,
      reviews: await Review.countDocuments(),
      bookingsByStatus,
      monthlyRevenue,
    },
    recentBookings,
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const users = await User.find()
    .select('-password')
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit);
  const total = await User.countDocuments();
  res.json({ success: true, count: users.length, total, data: users });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role, isActive: req.body.isActive },
    { new: true }
  ).select('-password');
  if (!user) throw new ErrorResponse('User not found', 404);
  res.json({ success: true, user });
});

export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate('user', 'name email')
    .populate('destination', 'title location')
    .sort('-createdAt');
  res.json({ success: true, count: bookings.length, data: bookings });
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status, paymentStatus: req.body.paymentStatus },
    { new: true }
  );
  if (!booking) throw new ErrorResponse('Booking not found', 404);
  res.json({ success: true, booking });
});
