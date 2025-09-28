import express from 'express';
import {
  getMedia,
  getMediaItem,
  uploadMedia,
  deleteMedia,
  updateMedia
} from '../controllers/mediaController.js';
import { authenticateToken, requireStaff } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Public routes (authenticated users)
router.get('/', getMedia);
router.get('/:id', getMediaItem);

// Staff/Admin only routes
router.post('/upload', requireStaff, upload.array('files', 10), uploadMedia);
router.put('/:id', requireStaff, updateMedia);
router.delete('/:id', requireStaff, deleteMedia);

export default router;
