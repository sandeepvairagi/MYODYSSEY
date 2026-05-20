import asyncHandler from 'express-async-handler';
import Destination from '../models/Destination.js';
import Review from '../models/Review.js';
import { ErrorResponse } from '../utils/errorResponse.js';
import { APIFeatures } from '../utils/apiFeatures.js';
import { uploadToCloudinary } from '../services/cloudinaryService.js';
import { getPersonalizedRecommendations } from '../services/recommendationService.js';
import { generateItinerary } from '../services/itineraryService.js';

export const getDestinations = asyncHandler(async (req, res) => {
  const features = new APIFeatures(Destination.find({ isActive: true }), req.query)
    .search()
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const destinations = await features.query.populate('createdBy', 'name');

  let countQuery = { isActive: true };
  if (req.query.keyword) {
    const regex = { $regex: req.query.keyword, $options: 'i' };
    countQuery = { isActive: true, $or: [{ title: regex }, { location: regex }, { country: regex }] };
  }
  if (req.query.category) countQuery.category = req.query.category;

  const count = await Destination.countDocuments(countQuery);
  const limit = parseInt(req.query.limit, 10) || 12;
  const page = parseInt(req.query.page, 10) || 1;

  res.json({
    success: true,
    count: destinations.length,
    total: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    data: destinations,
  });
});

export const getDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findOne({
    $or: [{ _id: req.params.id }, { slug: req.params.id }],
    isActive: true,
  }).populate('createdBy', 'name avatar');

  if (!destination) throw new ErrorResponse('Destination not found', 404);

  if (req.user) {
    const User = (await import('../models/User.js')).default;
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { recentlyViewed: { destination: destination._id } },
    });
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        recentlyViewed: {
          $each: [{ destination: destination._id, viewedAt: new Date() }],
          $position: 0,
          $slice: 10,
        },
      },
    });
  }

  const reviews = await Review.find({ destination: destination._id })
    .populate('user', 'name avatar')
    .sort('-createdAt')
    .limit(10);

  res.json({ success: true, destination, reviews });
});

export const getTrending = asyncHandler(async (req, res) => {
  const destinations = await Destination.find({ isActive: true, isTrending: true })
    .sort({ rating: -1 })
    .limit(8);
  res.json({ success: true, data: destinations });
});

export const getFeatured = asyncHandler(async (req, res) => {
  const destinations = await Destination.find({ isActive: true, isFeatured: true })
    .sort({ rating: -1 })
    .limit(6);
  res.json({ success: true, data: destinations });
});

export const getRecommendations = asyncHandler(async (req, res) => {
  const data = await getPersonalizedRecommendations(req.user, 6);
  res.json({ success: true, data });
});

export const createDestination = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  if (typeof body.highlights === 'string') body.highlights = JSON.parse(body.highlights);
  if (typeof body.included === 'string') body.included = JSON.parse(body.included);
  if (typeof body.itinerary === 'string') body.itinerary = JSON.parse(body.itinerary);
  if (typeof body.coordinates === 'string') body.coordinates = JSON.parse(body.coordinates);

  const images = [];
  if (req.files?.length) {
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer);
      images.push({ public_id: result.public_id, url: result.secure_url });
    }
  }

  const destination = await Destination.create({
    ...body,
    images: images.length ? images : body.images,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, destination });
});

export const updateDestination = asyncHandler(async (req, res) => {
  let destination = await Destination.findById(req.params.id);
  if (!destination) throw new ErrorResponse('Destination not found', 404);

  const body = { ...req.body };
  if (req.files?.length) {
    const images = [];
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer);
      images.push({ public_id: result.public_id, url: result.secure_url });
    }
    body.images = [...(destination.images || []), ...images];
  }

  destination = await Destination.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
  res.json({ success: true, destination });
});

export const deleteDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!destination) throw new ErrorResponse('Destination not found', 404);
  res.json({ success: true, message: 'Destination removed' });
});

export const generateAIItinerary = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  if (!destination) throw new ErrorResponse('Destination not found', 404);

  const days = parseInt(req.body.days, 10) || destination.duration;
  const itinerary = await generateItinerary({
    destination,
    days,
    interests: req.body.interests || [],
  });

  res.json({ success: true, itinerary });
});
