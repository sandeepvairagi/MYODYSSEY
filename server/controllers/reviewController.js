import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';
import Destination from '../models/Destination.js';
import { ErrorResponse } from '../utils/errorResponse.js';

const updateDestinationRatings = async (destinationId) => {
  const stats = await Review.aggregate([
    { $match: { destination: destinationId } },
    { $group: { _id: '$destination', avgRating: { $avg: '$rating' }, numReviews: { $sum: 1 } } },
  ]);

  if (stats.length) {
    await Destination.findByIdAndUpdate(destinationId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      numReviews: stats[0].numReviews,
    });
  }
};

export const createReview = asyncHandler(async (req, res) => {
  const { destination, rating, title, comment } = req.body;
  const existing = await Review.findOne({ user: req.user._id, destination });
  if (existing) throw new ErrorResponse('You already reviewed this destination', 400);

  const review = await Review.create({
    user: req.user._id,
    destination,
    rating,
    title,
    comment,
    booking: req.body.booking,
    isVerified: !!req.body.booking,
  });

  await updateDestinationRatings(destination);
  await review.populate('user', 'name avatar');
  res.status(201).json({ success: true, review });
});

export const getDestinationReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const reviews = await Review.find({ destination: req.params.destinationId })
    .populate('user', 'name avatar')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const total = await Review.countDocuments({ destination: req.params.destinationId });
  res.json({ success: true, count: reviews.length, total, totalPages: Math.ceil(total / limit), data: reviews });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ErrorResponse('Review not found', 404);
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ErrorResponse('Not authorized', 403);
  }

  const destId = review.destination;
  await review.deleteOne();
  await updateDestinationRatings(destId);
  res.json({ success: true, message: 'Review deleted' });
});
