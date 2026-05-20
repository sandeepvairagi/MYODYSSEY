import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
  getPriceEstimate,
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';
import { createBookingValidation } from '../validators/bookingValidator.js';

const router = express.Router();

router.get('/estimate', getPriceEstimate);
router.use(protect);
router.post('/', createBookingValidation, createBooking);
router.get('/my', getMyBookings);
router.get('/:id', getBooking);
router.put('/:id/cancel', cancelBooking);

export default router;
