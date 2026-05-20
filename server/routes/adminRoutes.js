import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateUser,
  getAllBookings,
  updateBookingStatus,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('admin'));
router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.get('/bookings', getAllBookings);
router.put('/bookings/:id', updateBookingStatus);

export default router;
