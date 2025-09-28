import express from 'express';
import {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  getBrandProducts
} from '../controllers/brandController.js';
import { authenticateToken, requireStaff } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getBrands);
router.get('/:id', getBrand);
router.get('/:id/products', getBrandProducts);

// Protected routes (require authentication)
router.use(authenticateToken);

// Staff/Admin only routes
router.post('/', requireStaff, validate(schemas.createBrand), createBrand);
router.put('/:id', requireStaff, validate(schemas.updateBrand), updateBrand);
router.delete('/:id', requireStaff, deleteBrand);

export default router;
