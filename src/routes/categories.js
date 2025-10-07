import express from 'express';
import {
  getCategoryTree,
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryProducts,
  getCategoriesWithCounts,
  getCategoriesForAdmin,
  reorderCategories,
  bulkUpdateCategories
} from '../controllers/categoryController.js';
import { authenticateToken, requireStaff } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/tree', getCategoryTree); // MUST come before /:id route
router.get('/with-counts', getCategoriesWithCounts); // MUST come before /:id route
router.get('/', getCategories);

// Protected routes (require authentication)
router.use(authenticateToken);

// Staff/Admin only routes - MUST come before /:id route
router.get('/admin', requireStaff, getCategoriesForAdmin);
router.get('/:id', getCategory);
router.get('/:id/products', getCategoryProducts);
router.post('/', requireStaff, validate(schemas.createCategory), createCategory);
router.put('/:id', requireStaff, validate(schemas.updateCategory), updateCategory);
router.delete('/:id', requireStaff, deleteCategory);
router.put('/reorder', requireStaff, reorderCategories);
router.put('/bulk-update', requireStaff, bulkUpdateCategories);

export default router;
