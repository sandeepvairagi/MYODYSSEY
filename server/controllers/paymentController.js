import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import { getRazorpay } from '../config/razorpay.js';
import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';
import { ErrorResponse } from '../utils/errorResponse.js';

export const createOrder = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.body.bookingId).populate('destination', 'title');
  if (!booking) throw new ErrorResponse('Booking not found', 404);
  if (booking.user.toString() !== req.user._id.toString()) {
    throw new ErrorResponse('Not authorized', 403);
  }
  if (booking.paymentStatus === 'paid') {
    throw new ErrorResponse('Booking already paid', 400);
  }

  const options = {
    amount: booking.totalPrice * 100,
    currency: 'INR',
    receipt: booking.bookingReference,
    notes: { bookingId: booking._id.toString(), userId: req.user._id.toString() },
  };

  const order = await getRazorpay().orders.create(options);

  const payment = await Payment.create({
    user: req.user._id,
    booking: booking._id,
    razorpayOrderId: order.id,
    amount: booking.totalPrice,
    receipt: order.receipt,
    status: 'created',
  });

  booking.payment = payment._id;
  await booking.save();

  res.json({
    success: true,
    order: {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    },
    key: process.env.RAZORPAY_KEY_ID,
    booking: { _id: booking._id, title: booking.destination?.title, totalPrice: booking.totalPrice },
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expected !== razorpay_signature) {
    throw new ErrorResponse('Payment verification failed', 400);
  }

  const payment = await Payment.findOneAndUpdate(
    { razorpayOrderId: razorpay_order_id },
    {
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: 'captured',
    },
    { new: true }
  );

  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    { paymentStatus: 'paid', status: 'confirmed', payment: payment._id },
    { new: true }
  ).populate('destination', 'title images');

  await Notification.create({
    user: req.user._id,
    type: 'payment',
    title: 'Payment Successful',
    message: `Your trip to ${booking.destination.title} is confirmed!`,
    link: '/my-trips',
    metadata: { bookingId: booking._id },
  });

  res.json({ success: true, message: 'Payment verified', booking });
});
