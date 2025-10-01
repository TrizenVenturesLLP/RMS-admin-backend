import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import slugify from 'slugify';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 200]
    }
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [1, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  shortDescription: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      len: [1, 500]
    }
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [1, 50]
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  comparePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  costPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  lowStockThreshold: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
    validate: {
      min: 0
    }
  },
  weight: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  dimensions: {
    type: DataTypes.JSON,
    allowNull: true
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  brandId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'brands',
      key: 'id'
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isDigital: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  metaTitle: {
    type: DataTypes.STRING(60),
    allowNull: true,
    validate: {
      len: [1, 60]
    }
  },
  metaDescription: {
    type: DataTypes.STRING(160),
    allowNull: true,
    validate: {
      len: [1, 160]
    }
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true
  },
  attributes: {
    type: DataTypes.JSON,
    allowNull: true
  },
  // NEW FIELDS FROM MIGRATION 001
  vendorName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'vendor_name'
  },
  manufacturer: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'manufacturer'
  },
  productType: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'product_type'
  },
  accessoryCategory: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'accessory_category'
  },
  compatibleBikes: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'compatible_bikes'
  },
  compatibleModels: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'compatible_models'
  },
  isNewArrival: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_new_arrival'
  },
  isBestseller: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_bestseller'
  },
  isCombo: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_combo'
  },
  installationType: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'installation_type'
  },
  installationGuideUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'installation_guide_url'
  },
  installationVideoUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'installation_video_url'
  },
  installationTimeMinutes: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'installation_time_minutes'
  },
  warrantyPeriod: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'warranty_period'
  },
  material: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'material'
  },
  color: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'color'
  },
  finish: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'finish'
  },
  specifications: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'specifications'
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'published_at'
  },
  availableFrom: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'available_from'
  },
  availableUntil: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'available_until'
  },
  skuInternal: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'sku_internal'
  },
  barcode: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'barcode'
  },
  features: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true,
    field: 'features'
  }
}, {
  tableName: 'products',
  timestamps: true,
  hooks: {
    beforeCreate: (product) => {
      if (!product.slug) {
        product.slug = slugify(product.name, { lower: true, strict: true });
      }
    },
    beforeUpdate: (product) => {
      if (product.changed('name') && !product.changed('slug')) {
        product.slug = slugify(product.name, { lower: true, strict: true });
      }
    }
  }
});

// Associations
Product.associate = (models) => {
  // Many-to-one relationship with category (LEGACY - kept for backward compatibility)
  Product.belongsTo(models.Category, {
    as: 'category',
    foreignKey: 'categoryId',
    onDelete: 'SET NULL'
  });
  
  // Many-to-many relationship with categories (NEW - primary way to handle categories)
  Product.belongsToMany(models.Category, {
    through: 'product_categories',
    as: 'categories',
    foreignKey: 'product_id',
    otherKey: 'category_id'
  });
  
  // One-to-many relationship with product_attributes (NEW - normalized attributes)
  Product.hasMany(models.ProductAttribute, {
    as: 'attributesList',
    foreignKey: 'productId',
    onDelete: 'CASCADE'
  });
  
  // Many-to-many relationship with tags (NEW)
  Product.belongsToMany(models.Tag, {
    through: 'product_tags',
    as: 'tagsList',
    foreignKey: 'product_id',
    otherKey: 'tag_id'
  });
  
  // Many-to-one relationship with brand
  Product.belongsTo(models.Brand, {
    as: 'brand',
    foreignKey: 'brandId',
    onDelete: 'SET NULL'
  });
  
  // One-to-many relationship with product images
  Product.hasMany(models.ProductImage, {
    as: 'images',
    foreignKey: 'productId',
    onDelete: 'CASCADE'
  });
  
  // One-to-many relationship with product variants
  Product.hasMany(models.ProductVariant, {
    as: 'variants',
    foreignKey: 'productId',
    onDelete: 'CASCADE'
  });
  
  // Many-to-many relationship with orders through order items
  Product.belongsToMany(models.Order, {
    through: models.OrderItem,
    as: 'orders',
    foreignKey: 'productId',
    otherKey: 'orderId'
  });
};

// Instance methods
Product.prototype.isInStock = function() {
  return this.stockQuantity > 0;
};

Product.prototype.isLowStock = function() {
  return this.stockQuantity <= this.lowStockThreshold;
};

Product.prototype.getDiscountPercentage = function() {
  if (!this.comparePrice || this.comparePrice <= this.price) {
    return 0;
  }
  return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
};

Product.prototype.getPrimaryImage = function() {
  if (this.images && this.images.length > 0) {
    const primaryImage = this.images.find(img => img.isPrimary);
    return primaryImage || this.images[0];
  }
  return null;
};

export default Product;
