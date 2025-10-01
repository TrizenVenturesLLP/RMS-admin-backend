import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import slugify from 'slugify';

const Brand = sequelize.define('Brand', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
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
  logo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [1, 50]
    }
  },
  foundedYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1800,
      max: new Date().getFullYear()
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
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
  },
  // NEW FIELDS FROM MIGRATION 001
  brandType: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'brand_type'
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_featured'
  },
  featuredOrder: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'featured_order'
  },
  bannerImage: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'banner_image'
  }
}, {
  tableName: 'brands',
  timestamps: true,
  hooks: {
    beforeCreate: (brand) => {
      if (!brand.slug) {
        brand.slug = slugify(brand.name, { lower: true, strict: true });
      }
    },
    beforeUpdate: (brand) => {
      if (brand.changed('name') && !brand.changed('slug')) {
        brand.slug = slugify(brand.name, { lower: true, strict: true });
      }
    }
  }
});

// Associations
Brand.associate = (models) => {
  // One-to-many relationship with products
  Brand.hasMany(models.Product, {
    as: 'products',
    foreignKey: 'brandId',
    onDelete: 'SET NULL'
  });
};

export default Brand;
