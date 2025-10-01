import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const ProductAttribute = sequelize.define('ProductAttribute', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'product_id',
    references: {
      model: 'products',
      key: 'id'
    }
  },
  attributeName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'attribute_name'
  },
  attributeValue: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'attribute_value'
  },
  attributeGroup: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'attribute_group'
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'display_order'
  },
  isFilterable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_filterable'
  },
  isSearchable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_searchable'
  },
  isVisible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_visible'
  }
}, {
  tableName: 'product_attributes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true
});

// Associations
ProductAttribute.associate = (models) => {
  // Many-to-one relationship with product
  ProductAttribute.belongsTo(models.Product, {
    as: 'product',
    foreignKey: 'productId',
    onDelete: 'CASCADE'
  });
};

export default ProductAttribute;

