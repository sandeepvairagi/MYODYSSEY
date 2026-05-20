import asyncHandler from 'express-async-handler';
import Wishlist from '../models/Wishlist.js';
import User from '../models/User.js';
import Destination from '../models/Destination.js';
import { ErrorResponse } from '../utils/errorResponse.js';

export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
    path: 'destinations',
    match: { isActive: true },
    select: 'title images pricePerPerson rating location country slug category duration',
  });
  res.json({ success: true, data: wishlist?.destinations || [] });
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const { destinationId } = req.params;
  const destination = await Destination.findById(destinationId);
  if (!destination) throw new ErrorResponse('Destination not found', 404);

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, destinations: [] });

  const index = wishlist.destinations.findIndex((d) => d.toString() === destinationId);
  let added = false;

  if (index > -1) {
    wishlist.destinations.splice(index, 1);
  } else {
    wishlist.destinations.push(destinationId);
    added = true;
  }

  await wishlist.save();
  await User.findByIdAndUpdate(req.user._id, { wishlist: wishlist.destinations });

  res.json({ success: true, added, message: added ? 'Added to wishlist' : 'Removed from wishlist' });
});
