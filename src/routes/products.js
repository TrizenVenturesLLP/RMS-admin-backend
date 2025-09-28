import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductImages,
  uploadProductImage,
  deleteProductImage,
  getAllMedia
} from '../controllers/productController.js';
import { authenticateToken, requireStaff } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';
import upload, { uploadWithProcessing } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes (require authentication)
router.use(authenticateToken);

// Staff/Admin only routes
router.post('/', requireStaff, validate(schemas.createProduct), createProduct);
router.put('/:id', requireStaff, validate(schemas.updateProduct), updateProduct);
router.delete('/:id', requireStaff, deleteProduct);

// Product images
router.get('/:id/images', getProductImages);
router.post('/:id/images', requireStaff, uploadWithProcessing, uploadProductImage);
router.delete('/:id/images/:imageId', requireStaff, deleteProductImage);

// Debug endpoint to check all media
router.get('/debug/media', requireStaff, getAllMedia);

export default router;
