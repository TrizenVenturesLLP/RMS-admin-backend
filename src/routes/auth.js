import express from 'express';
import {
  register,
  login,
  refreshToken,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  logout
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validate(schemas.register), register);
router.post('/login', validate(schemas.login), login);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyEmail);

// Protected routes
router.use(authenticateToken); // All routes below require authentication

router.get('/me', getMe);
router.put('/profile', validate(schemas.updateProfile), updateProfile);
router.put('/change-password', validate(schemas.changePassword), changePassword);
router.post('/logout', logout);

export default router;
