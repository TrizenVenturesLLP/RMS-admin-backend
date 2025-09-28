import { Category, Product } from '../models/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { Op } from 'sequelize';

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const { includeProducts = false } = req.query;

  const categories = await Category.findAll({
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
    data: { categories }
  });
});

// @desc    Get single category
// @route   GET /api/v1/categories/:id
// @access  Public
export const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findOne({
    where: { id, isActive: true },
    include: [
      {
        model: Category,
        as: 'parent',
        attributes: ['id', 'name', 'slug']
      },
      {
        model: Category,
        as: 'children',
        where: { isActive: true },
        required: false,
        attributes: ['id', 'name', 'slug', 'description', 'image']
      }
    ]
  });

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  res.json({
    success: true,
    data: { category }
  });
});

// @desc    Create new category
// @route   POST /api/v1/categories
// @access  Private (Staff/Admin)
export const createCategory = asyncHandler(async (req, res) => {
  const categoryData = req.body;

  // Check if parent category exists (if provided)
  if (categoryData.parentId) {
    const parentCategory = await Category.findByPk(categoryData.parentId);
    if (!parentCategory) {
      return res.status(400).json({
        success: false,
        message: 'Parent category not found'
      });
    }
  }

  const category = await Category.create(categoryData);

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: { category }
  });
});

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Private (Staff/Admin)
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const category = await Category.findByPk(id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  // Check if parent category exists (if being changed)
  if (updateData.parentId && updateData.parentId !== category.parentId) {
    const parentCategory = await Category.findByPk(updateData.parentId);
    if (!parentCategory) {
      return res.status(400).json({
        success: false,
        message: 'Parent category not found'
      });
    }

    // Prevent circular reference
    if (updateData.parentId === id) {
      return res.status(400).json({
        success: false,
        message: 'Category cannot be its own parent'
      });
    }
  }

  await category.update(updateData);

  res.json({
    success: true,
    message: 'Category updated successfully',
    data: { category }
  });
});

// @desc    Delete category
// @route   DELETE /api/v1/categories/:id
// @access  Private (Staff/Admin)
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByPk(id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  // Check if category has products
  const productCount = await Product.count({
    where: { categoryId: id }
  });

  if (productCount > 0) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete category with products. Please move or delete products first.'
    });
  }

  // Check if category has children
  const childrenCount = await Category.count({
    where: { parentId: id }
  });

  if (childrenCount > 0) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete category with subcategories. Please delete subcategories first.'
    });
  }

  // Soft delete by setting isActive to false
  await category.update({ isActive: false });

  res.json({
    success: true,
    message: 'Category deleted successfully'
  });
});

// @desc    Get category products
// @route   GET /api/v1/categories/:id/products
// @access  Public
export const getCategoryProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    page = 1,
    limit = 20,
    sort = 'createdAt',
    order = 'DESC',
    minPrice,
    maxPrice,
    inStock,
    search
  } = req.query;

  const category = await Category.findByPk(id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  // Build where clause
  const whereClause = { 
    categoryId: id, 
    isActive: true 
  };

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
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description
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
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryProducts
};
