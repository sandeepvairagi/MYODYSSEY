import express from 'express';
import { createOrder, verifyPayment, confirmDemoPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.post('/demo-confirm', confirmDemoPayment);

export default router;
