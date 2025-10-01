import { sequelize } from '../config/database.js';

// Import all models
import User from './User.js';
import Category from './Category.js';
import Brand from './Brand.js';
import Product from './Product.js';
import ProductImage from './ProductImage.js';
import ProductVariant from './ProductVariant.js';
import ProductCategory from './ProductCategory.js';
import ProductAttribute from './ProductAttribute.js';
import Tag from './Tag.js';
import ProductTag from './ProductTag.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import Media from './Media.js';

// Define associations
const models = {
  User,
  Category,
  Brand,
  Product,
  ProductImage,
  ProductVariant,
  ProductCategory,
  ProductAttribute,
  Tag,
  ProductTag,
  Order,
  OrderItem,
  Media
};

// Set up associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Export models and sequelize instance
export {
  sequelize,
  User,
  Category,
  Brand,
  Product,
  ProductImage,
  ProductVariant,
  ProductCategory,
  ProductAttribute,
  Tag,
  ProductTag,
  Order,
  OrderItem,
  Media
};

export default models;
