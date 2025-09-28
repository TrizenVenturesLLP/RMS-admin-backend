import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const ProductImage = sequelize.define('ProductImage', {
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
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 255]
    }
  },
  originalName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 255]
    }
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  altText: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [1, 255]
    }
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  width: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  height: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  isPrimary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'product_images',
  timestamps: true
});

// Associations
ProductImage.associate = (models) => {
  // Many-to-one relationship with product
  ProductImage.belongsTo(models.Product, {
    as: 'product',
    foreignKey: 'productId',
    onDelete: 'CASCADE'
  });
};

export default ProductImage;
