import express from 'express';
import { serveMedia } from '../controllers/mediaController.js';

const router = express.Router();

// Public route for serving media files (no authentication required)
router.get('/:filename', serveMedia);

export default router;
