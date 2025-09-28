import multer from 'multer';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { minioClient, getFileUrl } from '../config/minio.js';
import { Media } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const {
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES
} = process.env;

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed`), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 10 // Maximum 10 files
  }
});

// Simplified image processing middleware
export const processImage = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  try {
    const processedFiles = [];

    for (const file of req.files) {
      // Generate unique filename
      const fileExtension = file.originalname.split('.').pop();
      const filename = `${uuidv4()}.${fileExtension}`;

      // Simple file processing - no Sharp for now
      let metadata = { width: null, height: null };
      let processedBuffer = file.buffer;

      // Upload to MinIO
      const bucketName = process.env.MINIO_BUCKET_NAME || 'riders-moto-media';
      await minioClient.putObject(bucketName, filename, processedBuffer, {
        'Content-Type': file.mimetype,
        'Content-Length': processedBuffer.length
      });

      // Get file URL
      const fileUrl = getFileUrl(filename);

      // Create media record with simplified data
      const media = await Media.create({
        filename,
        originalName: file.originalname,
        url: fileUrl,
        mimeType: file.mimetype,
        size: processedBuffer.length,
        width: metadata.width,
        height: metadata.height,
        uploadedBy: req.user?.id
      });

      processedFiles.push(media);
    }

    req.processedFiles = processedFiles;
    next();
  } catch (error) {
    console.error('Image processing error:', error);
    next(error);
  }
};

// Upload middleware with image processing
export const uploadWithProcessing = [
  upload.array('images', 10),
  processImage
];

export default upload;
