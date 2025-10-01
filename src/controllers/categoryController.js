import { Category, Product, sequelize } from '../models/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { Op } from 'sequelize';

// @desc    Get category tree (hierarchical structure for navigation)
// @route   GET /api/v1/categories/tree
// @access  Public
export const getCategoryTree = asyncHandler(async (req, res) => {
  const { includeInactive = false } = req.query;
  
  // Fetch all categories
  const whereClause = {};
  if (includeInactive !== 'true') {
    whereClause.isActive = true;
    whereClause.isVisibleInMenu = true;
  }
  
  const allCategories = await Category.findAll({
    where: whereClause,
    attributes: ['id', 'name', 'slug', 'parentId', 'level', 'categoryType', 'icon', 'image', 'sortOrder', 'isActive'],
    order: [['level', 'ASC'], ['sortOrder', 'ASC'], ['name', 'ASC']]
  });
  
  // Build tree structure
  const buildTree = (categories, parentId = null) => {
    return categories
      .filter(cat => cat.parentId === parentId)
      .map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        level: cat.level,
        categoryType: cat.categoryType,
        icon: cat.icon,
        image: cat.image,
        sortOrder: cat.sortOrder,
        isActive: cat.isActive,
        children: buildTree(categories, cat.id)
      }));
  };
  
  const tree = buildTree(allCategories);
  
  res.json({
    success: true,
    data: { tree, totalCategories: allCategories.length }
  });
});

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

// @desc    Get categories with product counts
// @route   GET /api/v1/categories/with-counts
// @access  Public
export const getCategoriesWithCounts = asyncHandler(async (req, res) => {
  const { level, categoryType, parentId } = req.query;
  
  // Build where clause
  const whereClause = {};
  if (level) whereClause.level = parseInt(level);
  if (categoryType) whereClause.categoryType = categoryType;
  if (parentId) whereClause.parentId = parentId;
  
  // Get categories with product counts
  const categories = await Category.findAll({
    where: whereClause,
    attributes: [
      'id',
      'name', 
      'slug',
      'description',
      'level',
      'categoryType',
      'parentId',
      'sortOrder',
      'isActive',
      'isVisibleInMenu',
      'icon',
      'bannerImage',
      'featuredOrder'
    ],
    include: [
      {
        model: Product,
        as: 'productsList',
        attributes: ['id'],
        through: { attributes: [] } // Don't include join table attributes
      },
      {
        model: Category,
        as: 'children',
        attributes: ['id', 'name', 'slug', 'level'],
        required: false
      },
      {
        model: Category,
        as: 'parent',
        attributes: ['id', 'name', 'slug', 'level'],
        required: false
      }
    ],
    order: [
      ['level', 'ASC'],
      ['sortOrder', 'ASC'],
      ['name', 'ASC']
    ]
  });

  // Transform the data to include product counts
  const categoriesWithCounts = categories.map(category => {
    const categoryData = category.toJSON();
    
    return {
      id: categoryData.id,
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description,
      level: categoryData.level,
      categoryType: categoryData.categoryType,
      parentId: categoryData.parentId,
      sortOrder: categoryData.sortOrder,
      isActive: categoryData.isActive,
      isVisibleInMenu: categoryData.isVisibleInMenu,
      icon: categoryData.icon,
      bannerImage: categoryData.bannerImage,
      featuredOrder: categoryData.featuredOrder,
      productCount: categoryData.productsList ? categoryData.productsList.length : 0,
      children: categoryData.children || [],
      parent: categoryData.parent || null,
      createdAt: categoryData.createdAt,
      updatedAt: categoryData.updatedAt
    };
  });

  res.json({
    success: true,
    data: {
      categories: categoriesWithCounts,
      total: categoriesWithCounts.length,
      summary: {
        totalCategories: categoriesWithCounts.length,
        categoriesWithProducts: categoriesWithCounts.filter(cat => cat.productCount > 0).length,
        totalProducts: categoriesWithCounts.reduce((sum, cat) => sum + cat.productCount, 0)
      }
    }
  });
});

export default {
  getCategoryTree,
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryProducts,
  getCategoriesWithCounts
};
