import express from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryProducts
} from '../controllers/categoryController.js';
import { authenticateToken, requireStaff } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);
router.get('/:id/products', getCategoryProducts);

// Protected routes (require authentication)
router.use(authenticateToken);

// Staff/Admin only routes
router.post('/', requireStaff, validate(schemas.createCategory), createCategory);
router.put('/:id', requireStaff, validate(schemas.updateCategory), updateCategory);
router.delete('/:id', requireStaff, deleteCategory);

export default router;
