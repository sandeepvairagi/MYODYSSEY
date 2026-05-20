import asyncHandler from 'express-async-handler';
import Notification from '../models/Notification.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort('-createdAt').limit(50);
  const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });
  res.json({ success: true, unreadCount, data: notifications });
});

export const markAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, _id: req.params.id },
    { isRead: true }
  );
  res.json({ success: true });
});

export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id }, { isRead: true });
  res.json({ success: true });
});
