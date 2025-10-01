import express from 'express';
import {
  getCategoryTree,
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryProducts,
  getCategoriesWithCounts
} from '../controllers/categoryController.js';
import { authenticateToken, requireStaff } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/tree', getCategoryTree); // MUST come before /:id route
router.get('/with-counts', getCategoriesWithCounts); // MUST come before /:id route
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
