#!/usr/bin/env node

/**
 * Check Current Data
 * Simple script to check current data status
 */

import { sequelize } from './src/config/database.js';
import { testConnection } from './src/config/database.js';
import Category from './src/models/Category.js';
import Product from './src/models/Product.js';
import Brand from './src/models/Brand.js';

const checkCurrentData = async () => {
  try {
    console.log('🔍 Checking current data...');
    
    await testConnection();
    
    const brandCount = await Brand.count();
    const categoryCount = await Category.count();
    const productCount = await Product.count();
    
    console.log(`📊 Current Data:`);
    console.log(`  - Brands: ${brandCount}`);
    console.log(`  - Categories: ${categoryCount}`);
    console.log(`  - Products: ${productCount}`);
    
    // Show category breakdown by level
    const categoriesByLevel = await Category.findAll({
      attributes: ['level'],
      group: ['level'],
      raw: true
    });
    
    console.log('\n📂 Categories by level:');
    for (const level of categoriesByLevel) {
      const count = await Category.count({ where: { level: level.level } });
      console.log(`  - Level ${level.level}: ${count} categories`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkCurrentData();
