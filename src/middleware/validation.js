import Joi from 'joi';

// Generic validation middleware
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    next();
  };
};

// Validation schemas
export const schemas = {
  // User schemas
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().min(1).max(50).required(),
    lastName: Joi.string().min(1).max(50).required(),
    phone: Joi.string().min(10).max(15).optional()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  updateProfile: Joi.object({
    firstName: Joi.string().min(1).max(50).optional(),
    lastName: Joi.string().min(1).max(50).optional(),
    phone: Joi.string().min(10).max(15).optional(),
    profileImage: Joi.string().uri().optional()
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
  }),

  // Product schemas
  createProduct: Joi.object({
    name: Joi.string().min(1).max(200).required(),
    description: Joi.string().optional(),
    shortDescription: Joi.string().max(500).optional(),
    sku: Joi.string().min(1).max(50).required(),
    price: Joi.number().min(0).required(),
    comparePrice: Joi.number().min(0).optional(),
    costPrice: Joi.number().min(0).optional(),
    stockQuantity: Joi.number().integer().min(0).required(),
    lowStockThreshold: Joi.number().integer().min(0).optional(),
    weight: Joi.number().min(0).optional(),
    dimensions: Joi.object().optional(),
    categoryId: Joi.string().uuid().optional().allow(''),
    brandId: Joi.string().uuid().optional().allow(''),
    compatibleModels: Joi.array().items(Joi.string()).optional(),
    isActive: Joi.boolean().optional(),
    isDigital: Joi.boolean().optional(),
    isFeatured: Joi.boolean().optional(),
    metaTitle: Joi.string().max(60).optional(),
    metaDescription: Joi.string().max(160).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    attributes: Joi.object().optional()
  }),

  updateProduct: Joi.object({
    name: Joi.string().min(1).max(200).optional(),
    description: Joi.string().optional(),
    shortDescription: Joi.string().max(500).optional(),
    sku: Joi.string().min(1).max(50).optional(),
    price: Joi.number().min(0).optional(),
    comparePrice: Joi.number().min(0).optional(),
    costPrice: Joi.number().min(0).optional(),
    stockQuantity: Joi.number().integer().min(0).optional(),
    lowStockThreshold: Joi.number().integer().min(0).optional(),
    weight: Joi.number().min(0).optional(),
    dimensions: Joi.object().optional(),
    categoryId: Joi.string().uuid().optional(),
    brandId: Joi.string().uuid().optional(),
    compatibleModels: Joi.array().items(Joi.string()).optional(),
    isActive: Joi.boolean().optional(),
    isDigital: Joi.boolean().optional(),
    isFeatured: Joi.boolean().optional(),
    metaTitle: Joi.string().max(60).optional(),
    metaDescription: Joi.string().max(160).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    attributes: Joi.object().optional()
  }),

  // Category schemas
  createCategory: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    description: Joi.string().optional(),
    image: Joi.string().uri().optional(),
    parentId: Joi.string().uuid().optional(),
    sortOrder: Joi.number().integer().optional(),
    isActive: Joi.boolean().optional(),
    metaTitle: Joi.string().max(60).optional(),
    metaDescription: Joi.string().max(160).optional()
  }),

  updateCategory: Joi.object({
    name: Joi.string().min(1).max(100).optional(),
    description: Joi.string().optional(),
    image: Joi.string().uri().optional(),
    parentId: Joi.string().uuid().optional(),
    sortOrder: Joi.number().integer().optional(),
    isActive: Joi.boolean().optional(),
    metaTitle: Joi.string().max(60).optional(),
    metaDescription: Joi.string().max(160).optional()
  }),

  // Brand schemas
  createBrand: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    description: Joi.string().optional(),
    logo: Joi.string().uri().optional(),
    website: Joi.string().uri().optional(),
    country: Joi.string().min(1).max(50).optional(),
    foundedYear: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
    isActive: Joi.boolean().optional(),
    sortOrder: Joi.number().integer().optional(),
    metaTitle: Joi.string().max(60).optional(),
    metaDescription: Joi.string().max(160).optional()
  }),

  updateBrand: Joi.object({
    name: Joi.string().min(1).max(100).optional(),
    description: Joi.string().optional(),
    logo: Joi.string().uri().optional(),
    website: Joi.string().uri().optional(),
    country: Joi.string().min(1).max(50).optional(),
    foundedYear: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
    isActive: Joi.boolean().optional(),
    sortOrder: Joi.number().integer().optional(),
    metaTitle: Joi.string().max(60).optional(),
    metaDescription: Joi.string().max(160).optional()
  }),

  // Order schemas
  createOrder: Joi.object({
    items: Joi.array().items(
      Joi.object({
        productId: Joi.string().uuid().required(),
        productVariantId: Joi.string().uuid().optional(),
        quantity: Joi.number().integer().min(1).required()
      })
    ).min(1).required(),
    shippingAddress: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      company: Joi.string().optional(),
      address1: Joi.string().required(),
      address2: Joi.string().optional(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      postalCode: Joi.string().required(),
      country: Joi.string().required(),
      phone: Joi.string().optional()
    }).required(),
    billingAddress: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      company: Joi.string().optional(),
      address1: Joi.string().required(),
      address2: Joi.string().optional(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      postalCode: Joi.string().required(),
      country: Joi.string().required(),
      phone: Joi.string().optional()
    }).required(),
    paymentMethod: Joi.string().valid('stripe', 'paypal', 'bank_transfer', 'cash_on_delivery').required(),
    notes: Joi.string().optional()
  }),

  updateOrderStatus: Joi.object({
    status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded').required(),
    trackingNumber: Joi.string().optional(),
    notes: Joi.string().optional()
  }),

  // Query parameters
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sort: Joi.string().optional(),
    order: Joi.string().valid('ASC', 'DESC').default('DESC')
  }),

  productFilters: Joi.object({
    category: Joi.string().uuid().optional(),
    brand: Joi.string().uuid().optional(),
    model: Joi.string().optional(),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),
    inStock: Joi.boolean().optional(),
    featured: Joi.boolean().optional(),
    search: Joi.string().optional()
  })
};

export default {
  validate,
  schemas
};
