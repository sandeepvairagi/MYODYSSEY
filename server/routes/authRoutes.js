import express from 'express';
import { register, login, logout, getMe, updateProfile, updatePassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { registerValidation, loginValidation } from '../validators/authValidator.js';

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);

export default router;
