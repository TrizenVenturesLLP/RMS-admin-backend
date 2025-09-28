import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const ProductVariant = sequelize.define('ProductVariant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100]
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
  stockQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
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
  attributes: {
    type: DataTypes.JSON,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'product_variants',
  timestamps: true
});

// Associations
ProductVariant.associate = (models) => {
  // Many-to-one relationship with product
  ProductVariant.belongsTo(models.Product, {
    as: 'product',
    foreignKey: 'productId',
    onDelete: 'CASCADE'
  });
  
  // One-to-many relationship with order items
  ProductVariant.hasMany(models.OrderItem, {
    as: 'orderItems',
    foreignKey: 'productVariantId',
    onDelete: 'SET NULL'
  });
};

export default ProductVariant;
