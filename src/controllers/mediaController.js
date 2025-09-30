import { Media, User } from '../models/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { Op } from 'sequelize';
import { minioClient } from '../config/minio.js';

// @desc    Get all media
// @route   GET /api/v1/media
// @access  Private
export const getMedia = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    mimeType,
    isPublic,
    search,
    sort = 'createdAt',
    order = 'DESC'
  } = req.query;

  // Build where clause
  const whereClause = {};

  if (mimeType) {
    whereClause.mimeType = { [Op.iLike]: `%${mimeType}%` };
  }

  if (isPublic !== undefined) {
    whereClause.isPublic = isPublic === 'true';
  }

  if (search) {
    whereClause[Op.or] = [
      { filename: { [Op.iLike]: `%${search}%` } },
      { originalName: { [Op.iLike]: `%${search}%` } },
      { title: { [Op.iLike]: `%${search}%` } }
    ];
  }

  // Calculate pagination
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const { count, rows: media } = await Media.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: User,
        as: 'uploader',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }
    ],
    order: [[sort, order.toUpperCase()]],
    limit: parseInt(limit),
    offset,
    distinct: true
  });

  res.json({
    success: true,
    data: {
      media,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    }
  });
});

// @desc    Get single media item
// @route   GET /api/v1/media/:id
// @access  Private
export const getMediaItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const media = await Media.findByPk(id, {
    include: [
      {
        model: User,
        as: 'uploader',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }
    ]
  });

  if (!media) {
    return res.status(404).json({
      success: false,
      message: 'Media item not found'
    });
  }

  res.json({
    success: true,
    data: { media }
  });
});

// @desc    Upload media
// @route   POST /api/v1/media/upload
// @access  Private (Staff/Admin)
export const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.processedFiles || req.processedFiles.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No files uploaded'
    });
  }

  const uploadedMedia = [];

  for (const media of req.processedFiles) {
    const mediaItem = await Media.create({
      filename: media.filename,
      originalName: media.originalName,
      url: media.url,
      mimeType: media.mimeType,
      size: media.size,
      width: media.width,
      height: media.height,
      uploadedBy: req.user.id,
      isPublic: true
    });

    uploadedMedia.push(mediaItem);
  }

  res.status(201).json({
    success: true,
    message: 'Media uploaded successfully',
    data: { media: uploadedMedia }
  });
});

// @desc    Update media
// @route   PUT /api/v1/media/:id
// @access  Private (Staff/Admin)
export const updateMedia = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const media = await Media.findByPk(id);

  if (!media) {
    return res.status(404).json({
      success: false,
      message: 'Media item not found'
    });
  }

  await media.update(updateData);

  res.json({
    success: true,
    message: 'Media updated successfully',
    data: { media }
  });
});

// @desc    Delete media
// @route   DELETE /api/v1/media/:id
// @access  Private (Staff/Admin)
export const deleteMedia = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const media = await Media.findByPk(id);

  if (!media) {
    return res.status(404).json({
      success: false,
      message: 'Media item not found'
    });
  }

  // TODO: Delete file from MinIO storage
  // This would require implementing file deletion logic

  await media.destroy();

  res.json({
    success: true,
    message: 'Media deleted successfully'
  });
});

// @desc    Serve media file publicly
// @route   GET /api/v1/media/:filename
// @access  Public
export const serveMedia = asyncHandler(async (req, res) => {
  const { filename } = req.params;
  
  if (!filename) {
    return res.status(400).json({
      success: false,
      message: 'Filename is required'
    });
  }

  try {
    const bucketName = process.env.MINIO_BUCKET_NAME || 'riders-moto-media';
    
    console.log('🔍 Attempting to serve media file:', filename);
    console.log('📦 MinIO Bucket:', bucketName);
    console.log('🌐 MinIO Endpoint:', process.env.MINIO_ENDPOINT);
    console.log('🔑 MinIO Access Key:', process.env.MINIO_ACCESS_KEY ? 'Set' : 'Not set');
    
    // Check if file exists in MinIO
    try {
      console.log('🔍 Checking if file exists in MinIO...');
      await minioClient.statObject(bucketName, filename);
      console.log('✅ File exists in MinIO');
    } catch (error) {
      console.error('❌ MinIO statObject error:', error);
      if (error.code === 'NotFound') {
        console.log('📄 File not found in MinIO');
        return res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }
      console.error('❌ MinIO connection error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'MinIO connection error: ' + error.message
      });
    }

    // Get file stream from MinIO
    console.log('📥 Getting file stream from MinIO...');
    const stream = await minioClient.getObject(bucketName, filename);
    
    // Set appropriate headers
    const contentType = getContentType(filename);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    
    console.log('✅ Streaming file to client');
    // Pipe the stream to response
    stream.pipe(res);
    
  } catch (error) {
    console.error('❌ Error serving media file:', error);
    res.status(500).json({
      success: false,
      message: 'Error serving file: ' + error.message
    });
  }
});

// Helper function to determine content type based on file extension
const getContentType = (filename) => {
  const ext = filename.toLowerCase().split('.').pop();
  const contentTypes = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'pdf': 'application/pdf',
    'mp4': 'video/mp4',
    'avi': 'video/x-msvideo',
    'mov': 'video/quicktime'
  };
  
  return contentTypes[ext] || 'application/octet-stream';
};

export default {
  getMedia,
  getMediaItem,
  uploadMedia,
  updateMedia,
  deleteMedia,
  serveMedia
};
