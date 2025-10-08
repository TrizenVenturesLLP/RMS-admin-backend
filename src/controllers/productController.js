import { Product, Category, Brand, ProductImage, ProductVariant } from '../models/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { Op } from 'sequelize';
import slugify from 'slugify';

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    sort = 'createdAt',
    order = 'DESC',
    category,
    brand,
    model,
    minPrice,
    maxPrice,
    inStock,
    featured,
    search
  } = req.query;

  // Build where clause
  const whereClause = { isActive: true };

  if (category) {
    // Find category by name or slug
    const categoryRecord = await Category.findOne({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${category}%` } },
          { slug: category }
        ]
      }
    });
    
    if (categoryRecord) {
      whereClause.categoryId = categoryRecord.id;
    } else {
      // If category not found, return empty results
      return res.status(200).json({
        success: true,
        data: {
          products: [],
          pagination: {
            currentPage: parseInt(page),
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: parseInt(limit)
          }
        }
      });
    }
  }

  if (brand) {
    // Find brand by name or slug
    const brandRecord = await Brand.findOne({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${brand}%` } },
          { slug: brand }
        ]
      }
    });
    
    if (brandRecord) {
      whereClause.brandId = brandRecord.id;
    } else {
      // If brand not found, return empty results
      return res.status(200).json({
        success: true,
        data: {
          products: [],
          pagination: {
            currentPage: parseInt(page),
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: parseInt(limit)
          }
        }
      });
    }
  }

  if (model) {
    // Filter by compatible models using JSONB contains operator
    whereClause.compatibleModels = {
      [Op.contains]: [model]
    };
  }

  if (minPrice || maxPrice) {
    whereClause.price = {};
    if (minPrice) whereClause.price[Op.gte] = parseFloat(minPrice);
    if (maxPrice) whereClause.price[Op.lte] = parseFloat(maxPrice);
  }

  if (inStock === 'true') {
    whereClause.stockQuantity = { [Op.gt]: 0 };
  }

  if (featured === 'true') {
    whereClause.isFeatured = true;
  }

  if (search) {
    whereClause[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
      { sku: { [Op.iLike]: `%${search}%` } }
    ];
  }

  // Calculate pagination
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const { count, rows: products } = await Product.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug']
      },
      {
        model: Brand,
        as: 'brand',
        attributes: ['id', 'name', 'slug', 'logo']
      },
      {
        model: ProductImage,
        as: 'images',
        attributes: ['id', 'url', 'altText', 'isPrimary', 'sortOrder'],
        order: [['sortOrder', 'ASC']]
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
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    }
  });
});

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findOne({
    where: { id, isActive: true },
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug', 'description']
      },
      {
        model: Brand,
        as: 'brand',
        attributes: ['id', 'name', 'slug', 'logo', 'description']
      },
      {
        model: ProductImage,
        as: 'images',
        attributes: ['id', 'url', 'altText', 'isPrimary', 'sortOrder'],
        order: [['sortOrder', 'ASC']]
      },
      {
        model: ProductVariant,
        as: 'variants',
        attributes: ['id', 'name', 'sku', 'price', 'stockQuantity', 'attributes'],
        where: { isActive: true }
      }
    ]
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  res.json({
    success: true,
    data: { product }
  });
});

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private (Staff/Admin)
export const createProduct = asyncHandler(async (req, res) => {
  const productData = req.body;

  // Check if SKU already exists
  const existingProduct = await Product.findOne({
    where: { sku: productData.sku }
  });

  if (existingProduct) {
    return res.status(400).json({
      success: false,
      message: 'Product with this SKU already exists'
    });
  }

  // Auto-generate slug if not provided
  if (!productData.slug && productData.name) {
    productData.slug = slugify(productData.name, { lower: true, strict: true });
    
    // Ensure slug is unique
    let baseSlug = productData.slug;
    let counter = 1;
    while (await Product.findOne({ where: { slug: productData.slug } })) {
      productData.slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  // Set default values for optional fields
  if (!productData.categoryId) {
    // Get the first available category as default
    const defaultCategory = await Category.findOne({ 
      where: { isActive: true },
      order: [['sortOrder', 'ASC']]
    });
    productData.categoryId = defaultCategory?.id || null;
  }
  if (!productData.brandId) {
    // Get the first available brand as default
    const defaultBrand = await Brand.findOne({ 
      where: { isActive: true },
      order: [['sortOrder', 'ASC']]
    });
    productData.brandId = defaultBrand?.id || null;
  }

  let product;
  try {
    product = await Product.create(productData);
  } catch (error) {
    // Handle specific database constraint errors
    if (error.name === 'SequelizeValidationError') {
      const fieldErrors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: fieldErrors
      });
    }
    
    // Handle other database errors
    if (error.name === 'SequelizeDatabaseError') {
      // Check for varchar length constraint errors
      if (error.message.includes('value too long for type character varying')) {
        return res.status(400).json({
          success: false,
          message: 'Field length exceeded',
          errors: [{
            field: 'unknown',
            message: 'One or more fields exceed the maximum allowed length. Please check your input.'
          }]
        });
      }
    }
    
    throw error; // Re-throw if not handled
  }

  // Fetch the created product with associations
  const createdProduct = await Product.findByPk(product.id, {
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug']
      },
      {
        model: Brand,
        as: 'brand',
        attributes: ['id', 'name', 'slug', 'logo']
      }
    ]
  });

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: { product: createdProduct }
  });
});

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private (Staff/Admin)
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Check if SKU is being changed and if it already exists
  if (updateData.sku && updateData.sku !== product.sku) {
    const existingProduct = await Product.findOne({
      where: { sku: updateData.sku }
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Product with this SKU already exists'
      });
    }
  }

  await product.update(updateData);

  // Fetch updated product with associations
  const updatedProduct = await Product.findByPk(id, {
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug']
      },
      {
        model: Brand,
        as: 'brand',
        attributes: ['id', 'name', 'slug', 'logo']
      }
    ]
  });

  res.json({
    success: true,
    message: 'Product updated successfully',
    data: { product: updatedProduct }
  });
});

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private (Staff/Admin)
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Soft delete by setting isActive to false
  await product.update({ isActive: false });

  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// @desc    Get product images
// @route   GET /api/v1/products/:id/images
// @access  Public
export const getProductImages = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  const images = await ProductImage.findAll({
    where: { productId: id },
    order: [['sortOrder', 'ASC']]
  });

  res.json({
    success: true,
    data: { images }
  });
});

// @desc    Upload product image
// @route   POST /api/v1/products/:id/images
// @access  Private (Staff/Admin)
export const uploadProductImage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Make image upload optional - don't fail if no files
  if (!req.processedFiles || req.processedFiles.length === 0) {
    return res.json({
      success: true,
      message: 'No images uploaded',
      data: { images: [] }
    });
  }

  const uploadedImages = [];

  for (const media of req.processedFiles) {
    const productImage = await ProductImage.create({
      productId: id,
      filename: media.filename,
      originalName: media.originalName,
      url: media.url,
      altText: media.altText,
      mimeType: media.mimeType,
      size: media.size,
      width: media.width,
      height: media.height,
      isPrimary: false,
      sortOrder: 0
    });

    uploadedImages.push(productImage);
  }

  res.status(201).json({
    success: true,
    message: 'Images uploaded successfully',
    data: { images: uploadedImages }
  });
});

// @desc    Delete product image
// @route   DELETE /api/v1/products/:id/images/:imageId
// @access  Private (Staff/Admin)
// @desc    Get all media files (for debugging)
// @route   GET /api/v1/media
// @access  Private (Staff/Admin)
export const getAllMedia = asyncHandler(async (req, res) => {
  const { Media } = await import('../models/index.js');
  
  const media = await Media.findAll({
    order: [['createdAt', 'DESC']],
    limit: 50
  });

  res.json({
    success: true,
    data: { media },
    count: media.length
  });
});

export const deleteProductImage = asyncHandler(async (req, res) => {
  const { id, imageId } = req.params;

  const productImage = await ProductImage.findOne({
    where: { id: imageId, productId: id }
  });

  if (!productImage) {
    return res.status(404).json({
      success: false,
      message: 'Product image not found'
    });
  }

  await productImage.destroy();

  res.json({
    success: true,
    message: 'Product image deleted successfully'
  });
});

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductImages,
  uploadProductImage,
  deleteProductImage
};
