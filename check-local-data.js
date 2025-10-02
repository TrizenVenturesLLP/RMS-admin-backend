#!/usr/bin/env node

/**
 * Check Local Database Data
 * This script will check what data exists in your local database
 */

import { sequelize } from './src/config/database.js';
import { testConnection } from './src/config/database.js';
import Category from './src/models/Category.js';
import Product from './src/models/Product.js';
import Brand from './src/models/Brand.js';

const checkLocalData = async () => {
  try {
    console.log('🔍 Checking local database data...');
    
    // Test database connection
    await testConnection();
    
    // Check categories
    const categoryCount = await Category.count();
    console.log(`📊 Categories: ${categoryCount}`);
    
    if (categoryCount > 0) {
      const categories = await Category.findAll({
        attributes: ['id', 'name', 'slug', 'level', 'categoryType', 'isActive', 'isVisibleInMenu'],
        limit: 5
      });
      console.log('📋 Sample categories:');
      categories.forEach(cat => {
        console.log(`  - ${cat.name} (${cat.slug}) - Level: ${cat.level}, Type: ${cat.categoryType}, Active: ${cat.isActive}`);
      });
    }
    
    // Check products
    const productCount = await Product.count();
    console.log(`📊 Products: ${productCount}`);
    
    // Check brands
    const brandCount = await Brand.count();
    console.log(`📊 Brands: ${brandCount}`);
    
    // Test the categories tree endpoint logic
    console.log('\n🌳 Testing categories tree logic...');
    const allCategories = await Category.findAll({
      where: { isActive: true, isVisibleInMenu: true },
      attributes: ['id', 'name', 'slug', 'parentId', 'level', 'categoryType', 'icon', 'image', 'sortOrder', 'isActive'],
      order: [['level', 'ASC'], ['sortOrder', 'ASC'], ['name', 'ASC']]
    });
    
    console.log(`📊 Active categories for tree: ${allCategories.length}`);
    
    if (allCategories.length > 0) {
      console.log('📋 Categories that would appear in tree:');
      allCategories.forEach(cat => {
        console.log(`  - ${cat.name} (Level: ${cat.level}, Parent: ${cat.parentId || 'None'})`);
      });
    } else {
      console.log('⚠️  No active categories found for tree!');
      console.log('💡 This explains why production returns empty tree.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking local data:', error);
    process.exit(1);
  }
};

checkLocalData();
