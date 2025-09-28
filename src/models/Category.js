import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import slugify from 'slugify';

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [1, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  parentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  metaTitle: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [1, 60]
    }
  },
  metaDescription: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [1, 160]
    }
  }
}, {
  tableName: 'categories',
  timestamps: true,
  hooks: {
    beforeCreate: (category) => {
      if (!category.slug) {
        category.slug = slugify(category.name, { lower: true, strict: true });
      }
    },
    beforeUpdate: (category) => {
      if (category.changed('name') && !category.changed('slug')) {
        category.slug = slugify(category.name, { lower: true, strict: true });
      }
    }
  }
});

// Associations
Category.associate = (models) => {
  // Self-referencing association for parent-child relationship
  Category.hasMany(models.Category, {
    as: 'children',
    foreignKey: 'parentId',
    onDelete: 'CASCADE'
  });
  
  Category.belongsTo(models.Category, {
    as: 'parent',
    foreignKey: 'parentId',
    onDelete: 'SET NULL'
  });
  
  // One-to-many relationship with products
  Category.hasMany(models.Product, {
    as: 'products',
    foreignKey: 'categoryId',
    onDelete: 'SET NULL'
  });
};

// Instance methods
Category.prototype.getAncestors = async function() {
  const ancestors = [];
  let current = this;
  
  while (current.parent) {
    current = await current.getParent();
    if (current) {
      ancestors.unshift(current);
    } else {
      break;
    }
  }
  
  return ancestors;
};

Category.prototype.getDescendants = async function() {
  const descendants = [];
  
  const findChildren = async (category) => {
    const children = await category.getChildren();
    for (const child of children) {
      descendants.push(child);
      await findChildren(child);
    }
  };
  
  await findChildren(this);
  return descendants;
};

export default Category;
