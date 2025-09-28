import { Brand, Product } from '../models/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { Op } from 'sequelize';

// @desc    Get all brands
// @route   GET /api/v1/brands
// @access  Public
export const getBrands = asyncHandler(async (req, res) => {
  const { includeProducts = false } = req.query;

  const brands = await Brand.findAll({
    where: { isActive: true },
    order: [['sortOrder', 'ASC'], ['name', 'ASC']],
    include: includeProducts === 'true' ? [
      {
        model: Product,
        as: 'products',
        where: { isActive: true },
        attributes: ['id', 'name', 'slug', 'price', 'stockQuantity'],
        required: false
      }
    ] : []
  });

  res.json({
    success: true,
    data: { brands }
  });
});

// @desc    Get single brand
// @route   GET /api/v1/brands/:id
// @access  Public
export const getBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const brand = await Brand.findOne({
    where: { id, isActive: true }
  });

  if (!brand) {
    return res.status(404).json({
      success: false,
      message: 'Brand not found'
    });
  }

  res.json({
    success: true,
    data: { brand }
  });
});

// @desc    Create new brand
// @route   POST /api/v1/brands
// @access  Private (Staff/Admin)
export const createBrand = asyncHandler(async (req, res) => {
  const brandData = req.body;

  // Check if brand name already exists
  const existingBrand = await Brand.findOne({
    where: { name: brandData.name }
  });

  if (existingBrand) {
    return res.status(400).json({
      success: false,
      message: 'Brand with this name already exists'
    });
  }

  const brand = await Brand.create(brandData);

  res.status(201).json({
    success: true,
    message: 'Brand created successfully',
    data: { brand }
  });
});

// @desc    Update brand
// @route   PUT /api/v1/brands/:id
// @access  Private (Staff/Admin)
export const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const brand = await Brand.findByPk(id);

  if (!brand) {
    return res.status(404).json({
      success: false,
      message: 'Brand not found'
    });
  }

  // Check if brand name is being changed and if it already exists
  if (updateData.name && updateData.name !== brand.name) {
    const existingBrand = await Brand.findOne({
      where: { name: updateData.name }
    });

    if (existingBrand) {
      return res.status(400).json({
        success: false,
        message: 'Brand with this name already exists'
      });
    }
  }

  await brand.update(updateData);

  res.json({
    success: true,
    message: 'Brand updated successfully',
    data: { brand }
  });
});

// @desc    Delete brand
// @route   DELETE /api/v1/brands/:id
// @access  Private (Staff/Admin)
export const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const brand = await Brand.findByPk(id);

  if (!brand) {
    return res.status(404).json({
      success: false,
      message: 'Brand not found'
    });
  }

  // Check if brand has products
  const productCount = await Product.count({
    where: { brandId: id }
  });

  if (productCount > 0) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete brand with products. Please move or delete products first.'
    });
  }

  // Soft delete by setting isActive to false
  await brand.update({ isActive: false });

  res.json({
    success: true,
    message: 'Brand deleted successfully'
  });
});

// @desc    Get brand products
// @route   GET /api/v1/brands/:id/products
// @access  Public
export const getBrandProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    page = 1,
    limit = 20,
    sort = 'createdAt',
    order = 'DESC',
    category,
    minPrice,
    maxPrice,
    inStock,
    search
  } = req.query;

  const brand = await Brand.findByPk(id);

  if (!brand) {
    return res.status(404).json({
      success: false,
      message: 'Brand not found'
    });
  }

  // Build where clause
  const whereClause = { 
    brandId: id, 
    isActive: true 
  };

  if (category) {
    whereClause.categoryId = category;
  }

  if (minPrice || maxPrice) {
    whereClause.price = {};
    if (minPrice) whereClause.price[Op.gte] = parseFloat(minPrice);
    if (maxPrice) whereClause.price[Op.lte] = parseFloat(maxPrice);
  }

  if (inStock === 'true') {
    whereClause.stockQuantity = { [Op.gt]: 0 };
  }

  if (search) {
    whereClause[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } }
    ];
  }

  // Calculate pagination
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const { count, rows: products } = await Product.findAndCountAll({
    where: whereClause,
    order: [[sort, order.toUpperCase()]],
    limit: parseInt(limit),
    offset,
    distinct: true
  });

  res.json({
    success: true,
    data: {
      brand: {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        description: brand.description,
        logo: brand.logo
      },
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

export default {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  getBrandProducts
};
