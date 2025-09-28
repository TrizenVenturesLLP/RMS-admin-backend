import express from 'express';
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderItems
} from '../controllers/orderController.js';
import { authenticateToken, requireStaff, requireOwnershipOrAdmin } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Public routes (authenticated users)
router.get('/', getOrders);
router.get('/:id', getOrder);
router.get('/:id/items', getOrderItems);
router.post('/', validate(schemas.createOrder), createOrder);
router.put('/:id/cancel', cancelOrder);

// Staff/Admin only routes
router.put('/:id/status', requireStaff, validate(schemas.updateOrderStatus), updateOrderStatus);

export default router;
