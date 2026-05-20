import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { ErrorResponse } from '../utils/errorResponse.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new ErrorResponse('Not authorized to access this route', 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select('-password');
  if (!req.user || !req.user.isActive) {
    throw new ErrorResponse('User not found or deactivated', 401);
  }
  next();
});

export const authorize = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ErrorResponse(`Role ${req.user.role} is not authorized`, 403);
    }
    next();
  });
