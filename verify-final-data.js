#!/usr/bin/env node

/**
 * Verify Final Data Structure
 * This script checks the final category count and structure
 */

import { sequelize } from './src/config/database.js';
import { testConnection } from './src/config/database.js';
import { Category, Brand, Product } from './src/models/index.js';

const verifyFinalData = async () => {
  try {
    console.log('🔍 Verifying final data structure...');
    console.log('🌍 Environment:', process.env.NODE_ENV || 'development');

    await testConnection();

    // Count all records
    const totalCategories = await Category.count();
    const totalBrands = await Brand.count();
    const totalProducts = await Product.count();
    
    // Count active categories
    const activeCategories = await Category.count({ 
      where: { 
        isActive: true, 
        isVisibleInMenu: true 
      } 
    });

    // Count categories by level
    const level1Categories = await Category.count({ where: { level: 1 } });
    const level2Categories = await Category.count({ where: { level: 2 } });
    const level3Categories = await Category.count({ where: { level: 3 } });

    // Count categories by type
    const mainCategories = await Category.count({ where: { categoryType: 'main_category' } });
    const bikeBrands = await Category.count({ where: { categoryType: 'bike_brand' } });
    const bikeModels = await Category.count({ where: { categoryType: 'bike_model' } });
    const accessoryTypes = await Category.count({ where: { categoryType: 'accessory_type' } });
    const productGroups = await Category.count({ where: { categoryType: 'product_group' } });
    const scooterModels = await Category.count({ where: { categoryType: 'scooter_model' } });
    const evBrands = await Category.count({ where: { categoryType: 'ev_brand' } });
    const evModels = await Category.count({ where: { categoryType: 'ev_model' } });
    const comboPackages = await Category.count({ where: { categoryType: 'combo_package' } });

    // Get main categories with their children counts
    const mainCategoriesWithCounts = await Category.findAll({
      where: { level: 1 },
      include: [{
        model: Category,
        as: 'children',
        required: false
      }],
      order: [['sortOrder', 'ASC']]
    });

    console.log('\n📊 FINAL DATA VERIFICATION RESULTS:');
    console.log('=====================================');
    
    console.log(`📈 Total Categories: ${totalCategories}`);
    console.log(`📈 Active Categories: ${activeCategories}`);
    console.log(`📈 Total Brands: ${totalBrands}`);
    console.log(`📈 Total Products: ${totalProducts}`);
    
    console.log('\n📊 Categories by Level:');
    console.log(`   Level 1 (Main Categories): ${level1Categories}`);
    console.log(`   Level 2 (Brands/Types): ${level2Categories}`);
    console.log(`   Level 3 (Models/Products): ${level3Categories}`);
    
    console.log('\n📊 Categories by Type:');
    console.log(`   Main Categories: ${mainCategories}`);
    console.log(`   Bike Brands: ${bikeBrands}`);
    console.log(`   Bike Models: ${bikeModels}`);
    console.log(`   Accessory Types: ${accessoryTypes}`);
    console.log(`   Product Groups: ${productGroups}`);
    console.log(`   Scooter Models: ${scooterModels}`);
    console.log(`   EV Brands: ${evBrands}`);
    console.log(`   EV Models: ${evModels}`);
    console.log(`   Combo Packages: ${comboPackages}`);
    
    console.log('\n📊 Main Categories Structure:');
    for (const mainCategory of mainCategoriesWithCounts) {
      const childrenCount = mainCategory.children ? mainCategory.children.length : 0;
      console.log(`   ${mainCategory.name}: ${childrenCount} children`);
    }

    // Check if we have the target number of categories
    if (totalCategories >= 200) {
      console.log('\n✅ SUCCESS: You have 200+ categories!');
      console.log('🎉 Your data structure matches the HT Exhaust website!');
    } else {
      console.log(`\n⚠️  You have ${totalCategories} categories.`);
      console.log(`   Still need ${200 - totalCategories} more to reach 200+.`);
    }

    // Check for missing categories
    const missingCategories = [];
    if (scooterModels === 0) missingCategories.push('Scooter Models');
    if (evBrands === 0) missingCategories.push('EV Bike Brands');
    if (evModels === 0) missingCategories.push('EV Bike Models');
    if (comboPackages === 0) missingCategories.push('Combo Packages');

    if (missingCategories.length > 0) {
      console.log('\n⚠️  Missing Categories:');
      missingCategories.forEach(category => console.log(`   - ${category}`));
    } else {
      console.log('\n✅ All category types are present!');
    }

    console.log('\n🎯 VERIFICATION COMPLETE!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error verifying final data:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
};

verifyFinalData();
