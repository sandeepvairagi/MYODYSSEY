import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import Booking from '../models/Booking.js';
import Destination from '../models/Destination.js';
import Notification from '../models/Notification.js';
import { ErrorResponse } from '../utils/errorResponse.js';

const calculatePrice = (destination, travelers, startDate, endDate) => {
  const days = Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)));
  const base = destination.pricePerPerson * travelers;
  const durationMultiplier = days / destination.duration;
  return Math.round(base * Math.max(durationMultiplier, 0.5));
};

export const createBooking = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ErrorResponse(errors.array()[0].msg, 400);

  const destination = await Destination.findById(req.body.destination);
  if (!destination || !destination.isActive) throw new ErrorResponse('Destination not found', 404);

  const totalPrice = calculatePrice(
    destination,
    req.body.travelers,
    req.body.startDate,
    req.body.endDate
  );

  const booking = await Booking.create({
    user: req.user._id,
    destination: destination._id,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    travelers: req.body.travelers,
    totalPrice,
    pricePerPerson: destination.pricePerPerson,
    contactInfo: req.body.contactInfo,
    specialRequests: req.body.specialRequests,
    itinerary: req.body.itinerary || destination.itinerary,
  });

  await Notification.create({
    user: req.user._id,
    type: 'booking',
    title: 'Booking Created',
    message: `Your booking for ${destination.title} has been created. Complete payment to confirm.`,
    link: `/my-trips`,
    metadata: { bookingId: booking._id },
  });

  const populated = await Booking.findById(booking._id).populate('destination', 'title images location slug');
  res.status(201).json({ success: true, booking: populated, totalPrice });
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('destination', 'title images location country slug pricePerPerson duration')
    .sort('-createdAt');
  res.json({ success: true, count: bookings.length, data: bookings });
});

export const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('destination')
    .populate('user', 'name email');

  if (!booking) throw new ErrorResponse('Booking not found', 404);
  if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ErrorResponse('Not authorized', 403);
  }
  res.json({ success: true, booking });
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ErrorResponse('Booking not found', 404);
  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ErrorResponse('Not authorized', 403);
  }

  booking.status = 'cancelled';
  await booking.save();
  res.json({ success: true, booking });
});

export const getPriceEstimate = asyncHandler(async (req, res) => {
  const { destinationId, travelers, startDate, endDate } = req.query;
  const destination = await Destination.findById(destinationId);
  if (!destination) throw new ErrorResponse('Destination not found', 404);

  const totalPrice = calculatePrice(destination, parseInt(travelers, 10), startDate, endDate);
  res.json({
    success: true,
    pricePerPerson: destination.pricePerPerson,
    travelers: parseInt(travelers, 10),
    totalPrice,
    currency: 'INR',
  });
});
