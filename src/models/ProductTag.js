import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const ProductTag = sequelize.define('ProductTag', {
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
    },
    field: 'product_id'
  },
  tagId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'tags',
      key: 'id'
    },
    field: 'tag_id'
  }
}, {
  tableName: 'product_tags',
  timestamps: true,
  updatedAt: false,
  indexes: [
    {
      unique: true,
      fields: ['product_id', 'tag_id']
    }
  ]
});

ProductTag.associate = (models) => {
  ProductTag.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
  ProductTag.belongsTo(models.Tag, { foreignKey: 'tagId', as: 'tag' });
};

export default ProductTag;

