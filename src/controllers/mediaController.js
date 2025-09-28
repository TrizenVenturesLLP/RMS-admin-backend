import { Media, User } from '../models/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { Op } from 'sequelize';

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

export default {
  getMedia,
  getMediaItem,
  uploadMedia,
  updateMedia,
  deleteMedia
};
