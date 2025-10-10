import express from 'express';
import {
  createPayment,
  confirmPayment,
  getPaymentStatus,
  getAllPayments,
  getPaymentConfig
} from '../controllers/paymentController.js';

const router = express.Router();

// Public routes
router.post('/create', createPayment);
router.post('/confirm', confirmPayment);
router.get('/status/:paymentId', getPaymentStatus);
router.get('/config', getPaymentConfig);

// Admin routes (in production, add authentication middleware)
router.get('/', getAllPayments);

export default router;
