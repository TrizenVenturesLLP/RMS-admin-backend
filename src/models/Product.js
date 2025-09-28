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
  // Many-to-one relationship with category
  Product.belongsTo(models.Category, {
    as: 'category',
    foreignKey: 'categoryId',
    onDelete: 'SET NULL'
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
