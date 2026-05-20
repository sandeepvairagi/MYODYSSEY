import express from 'express';
import { createReview, getDestinationReviews, deleteReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/destination/:destinationId', getDestinationReviews);
router.post('/', protect, createReview);
router.delete('/:id', protect, deleteReview);

export default router;
