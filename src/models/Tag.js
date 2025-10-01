import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import slugify from 'slugify';

const Tag = sequelize.define('Tag', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tagType: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'tag_type'
  },
  color: {
    type: DataTypes.STRING(7),
    allowNull: true
  },
  icon: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  usageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'usage_count'
  }
}, {
  tableName: 'tags',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,
  hooks: {
    beforeCreate: (tag) => {
      if (!tag.slug) {
        tag.slug = slugify(tag.name, { lower: true, strict: true });
      }
    },
    beforeUpdate: (tag) => {
      if (tag.changed('name') && !tag.changed('slug')) {
        tag.slug = slugify(tag.name, { lower: true, strict: true });
      }
    }
  }
});

// Associations
Tag.associate = (models) => {
  // Many-to-many relationship with products through product_tags
  Tag.belongsToMany(models.Product, {
    through: 'product_tags',
    as: 'products',
    foreignKey: 'tag_id',
    otherKey: 'product_id'
  });
};

export default Tag;

