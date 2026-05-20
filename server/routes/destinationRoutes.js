import express from 'express';
import {
  getDestinations,
  getDestination,
  getTrending,
  getFeatured,
  getRecommendations,
  createDestination,
  updateDestination,
  deleteDestination,
  generateAIItinerary,
} from '../controllers/destinationController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getDestinations);
router.get('/trending', getTrending);
router.get('/featured', getFeatured);
router.get('/recommendations', protect, getRecommendations);
router.post('/:id/itinerary', protect, generateAIItinerary);
router.get('/:id', getDestination);

router.post('/', protect, authorize('admin'), upload.array('images', 10), createDestination);
router.put('/:id', protect, authorize('admin'), upload.array('images', 10), updateDestination);
router.delete('/:id', protect, authorize('admin'), deleteDestination);

export default router;
