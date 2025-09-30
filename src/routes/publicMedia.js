import express from 'express';
import { serveMedia } from '../controllers/mediaController.js';

const router = express.Router();

// Handle CORS preflight requests
router.options('/:filename', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  res.status(200).end();
});

// Public route for serving media files (no authentication required)
router.get('/:filename', serveMedia);

export default router;
