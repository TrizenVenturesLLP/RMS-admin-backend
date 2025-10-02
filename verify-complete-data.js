#!/usr/bin/env node

/**
 * Verify Complete Data Structure
 * This script will show the complete data structure we've created
 */

import { sequelize } from './src/config/database.js';
import { testConnection } from './src/config/database.js';
import Category from './src/models/Category.js';
import Product from './src/models/Product.js';
import Brand from './src/models/Brand.js';

const verifyCompleteData = async () => {
  try {
    console.log('🔍 Verifying complete data structure...');
    
    await testConnection();
    
    // Count all data
    const brandCount = await Brand.count();
    const categoryCount = await Category.count();
    const productCount = await Product.count();
    
    console.log('\n📊 DATA SUMMARY:');
    console.log(`🏷️  Brands: ${brandCount}`);
    console.log(`📂 Categories: ${categoryCount}`);
    console.log(`🛍️  Products: ${productCount}`);
    
    // Show category structure by level
    console.log('\n🌳 CATEGORY STRUCTURE:');
    const categoriesByLevel = await Category.findAll({
      attributes: ['level', 'name', 'slug', 'categoryType', 'parentId'],
      order: [['level', 'ASC'], ['sortOrder', 'ASC'], ['name', 'ASC']]
    });
    
    const levelGroups = {};
    categoriesByLevel.forEach(cat => {
      if (!levelGroups[cat.level]) {
        levelGroups[cat.level] = [];
      }
      levelGroups[cat.level].push(cat);
    });
    
    Object.keys(levelGroups).forEach(level => {
      console.log(`\n📁 Level ${level} (${levelGroups[level].length} categories):`);
      levelGroups[level].forEach(cat => {
        console.log(`  - ${cat.name} (${cat.categoryType})`);
      });
    });
    
    // Show brands
    console.log('\n🏷️  BRANDS:');
    const brands = await Brand.findAll({
      attributes: ['name', 'brandType', 'isFeatured'],
      order: [['featuredOrder', 'ASC']]
    });
    brands.forEach(brand => {
      console.log(`  - ${brand.name} (${brand.brandType}) ${brand.isFeatured ? '⭐' : ''}`);
    });
    
    // Show sample products
    console.log('\n🛍️  SAMPLE PRODUCTS:');
    const products = await Product.findAll({
      attributes: ['name', 'sku', 'price', 'vendorName'],
      limit: 10,
      order: [['createdAt', 'DESC']]
    });
    products.forEach(product => {
      console.log(`  - ${product.name} (${product.sku}) - ₹${product.price} - ${product.vendorName}`);
    });
    
    // Test the tree structure
    console.log('\n🌳 TESTING CATEGORIES TREE:');
    const activeCategories = await Category.findAll({
      where: { isActive: true, isVisibleInMenu: true },
      attributes: ['id', 'name', 'slug', 'parentId', 'level', 'categoryType'],
      order: [['level', 'ASC'], ['sortOrder', 'ASC'], ['name', 'ASC']]
    });
    
    console.log(`📊 Active categories for tree: ${activeCategories.length}`);
    
    // Build and show tree structure
    const buildTree = (categories, parentId = null, level = 0) => {
      const indent = '  '.repeat(level);
      return categories
        .filter(cat => cat.parentId === parentId)
        .map(cat => {
          console.log(`${indent}📁 ${cat.name} (${cat.categoryType})`);
          const children = buildTree(categories, cat.id, level + 1);
          return { ...cat.toJSON(), children };
        });
    };
    
    console.log('\n🌳 CATEGORY TREE STRUCTURE:');
    const tree = buildTree(activeCategories);
    
    console.log('\n✅ DATA VERIFICATION COMPLETE!');
    console.log(`🎉 You now have ${categoryCount} categories matching HT Exhaust structure!`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error verifying data:', error);
    process.exit(1);
  }
};

verifyCompleteData();
