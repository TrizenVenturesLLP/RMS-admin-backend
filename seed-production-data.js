#!/usr/bin/env node

/**
 * Seed Production Data
 * This script will create sample data for production environment
 * Run this after deploying to production
 */

import { sequelize } from './src/config/database.js';
import { testConnection } from './src/config/database.js';
import Category from './src/models/Category.js';
import Product from './src/models/Product.js';
import Brand from './src/models/Brand.js';

const seedProductionData = async () => {
  try {
    console.log('🌱 Seeding production data...');
    console.log('🌍 Environment:', process.env.NODE_ENV || 'production');
    
    // Test database connection
    await testConnection();
    
    // Check if data already exists
    const existingBrands = await Brand.count();
    const existingCategories = await Category.count();
    
    if (existingBrands > 0 || existingCategories > 0) {
      console.log('⚠️  Data already exists in production database');
      console.log(`📊 Existing brands: ${existingBrands}`);
      console.log(`📊 Existing categories: ${existingCategories}`);
      console.log('💡 Skipping data seeding to avoid duplicates');
      process.exit(0);
    }
    
    // Create sample brands
    console.log('🏷️  Creating sample brands...');
    const brands = await Brand.bulkCreate([
      {
        name: 'HITECH',
        slug: 'hitech',
        description: 'Premium motorcycle accessories and exhaust systems',
        logo: 'https://example.com/hitech-logo.png',
        country: 'India',
        foundedYear: 2010,
        brandType: 'accessory_brand',
        isFeatured: true,
        featuredOrder: 1
      },
      {
        name: 'Yamaha',
        slug: 'yamaha',
        description: 'Official Yamaha motorcycle parts and accessories',
        logo: 'https://example.com/yamaha-logo.png',
        country: 'Japan',
        foundedYear: 1955,
        brandType: 'bike_manufacturer',
        isFeatured: true,
        featuredOrder: 2
      },
      {
        name: 'Honda',
        slug: 'honda',
        description: 'Honda motorcycle parts and accessories',
        logo: 'https://example.com/honda-logo.png',
        country: 'Japan',
        foundedYear: 1948,
        brandType: 'bike_manufacturer',
        isFeatured: true,
        featuredOrder: 3
      }
    ]);
    console.log(`✅ Created ${brands.length} brands`);
    
    // Create sample categories
    console.log('📂 Creating sample categories...');
    
    // Main categories (Level 1)
    const mainCategories = await Category.bulkCreate([
      {
        name: 'Exhaust Systems',
        slug: 'exhaust-systems',
        description: 'High-performance exhaust systems for motorcycles',
        level: 1,
        categoryType: 'main_menu',
        isVisibleInMenu: true,
        icon: 'exhaust-icon',
        sortOrder: 1
      },
      {
        name: 'Protection Gear',
        slug: 'protection-gear',
        description: 'Safety gear and protective equipment',
        level: 1,
        categoryType: 'main_menu',
        isVisibleInMenu: true,
        icon: 'protection-icon',
        sortOrder: 2
      },
      {
        name: 'Performance Parts',
        slug: 'performance-parts',
        description: 'Performance enhancement parts',
        level: 1,
        categoryType: 'main_menu',
        isVisibleInMenu: true,
        icon: 'performance-icon',
        sortOrder: 3
      }
    ]);
    console.log(`✅ Created ${mainCategories.length} main categories`);
    
    // Sub-categories (Level 2)
    const subCategories = await Category.bulkCreate([
      {
        name: 'Full System Exhausts',
        slug: 'full-system-exhausts',
        description: 'Complete exhaust system replacements',
        parentId: mainCategories[0].id,
        level: 2,
        categoryType: 'product_group',
        isVisibleInMenu: true,
        sortOrder: 1
      },
      {
        name: 'Slip-on Exhausts',
        slug: 'slip-on-exhausts',
        description: 'Slip-on exhaust mufflers',
        parentId: mainCategories[0].id,
        level: 2,
        categoryType: 'product_group',
        isVisibleInMenu: true,
        sortOrder: 2
      },
      {
        name: 'Helmets',
        slug: 'helmets',
        description: 'Motorcycle helmets and head protection',
        parentId: mainCategories[1].id,
        level: 2,
        categoryType: 'product_group',
        isVisibleInMenu: true,
        sortOrder: 1
      },
      {
        name: 'Gloves',
        slug: 'gloves',
        description: 'Motorcycle riding gloves',
        parentId: mainCategories[1].id,
        level: 2,
        categoryType: 'product_group',
        isVisibleInMenu: true,
        sortOrder: 2
      }
    ]);
    console.log(`✅ Created ${subCategories.length} sub-categories`);
    
    // Create sample products
    console.log('🛍️  Creating sample products...');
    const products = await Product.bulkCreate([
      {
        name: 'HITECH Full System Exhaust - Yamaha R15',
        slug: 'hitech-full-system-exhaust-yamaha-r15',
        description: 'High-performance full system exhaust for Yamaha R15 with improved sound and performance',
        shortDescription: 'Premium full system exhaust for Yamaha R15',
        sku: 'HT-FSE-R15-001',
        price: 15000.00,
        comparePrice: 18000.00,
        stockQuantity: 10,
        categoryId: subCategories[0].id,
        brandId: brands[0].id,
        vendorName: 'HITECH',
        productType: 'exhaust',
        accessoryCategory: 'performance',
        compatibleBikes: ['Yamaha R15 V3', 'Yamaha R15 V4'],
        compatibleModels: ['Yamaha R15 V3.0', 'Yamaha R15 V4.0'],
        installationType: 'Professional Required',
        installationTimeMinutes: 120,
        warrantyPeriod: '1 Year',
        material: 'Stainless Steel',
        color: 'Chrome',
        features: [
          'Improved exhaust flow',
          'Enhanced sound quality',
          'Stainless steel construction',
          'Direct bolt-on installation'
        ],
        isActive: true,
        isFeatured: true
      },
      {
        name: 'HITECH Slip-on Exhaust - Honda CBR150R',
        slug: 'hitech-slip-on-exhaust-honda-cbr150r',
        description: 'Performance slip-on exhaust for Honda CBR150R',
        shortDescription: 'Slip-on exhaust for Honda CBR150R',
        sku: 'HT-SOE-CBR150-001',
        price: 8500.00,
        comparePrice: 10000.00,
        stockQuantity: 15,
        categoryId: subCategories[1].id,
        brandId: brands[0].id,
        vendorName: 'HITECH',
        productType: 'exhaust',
        accessoryCategory: 'performance',
        compatibleBikes: ['Honda CBR150R'],
        compatibleModels: ['Honda CBR150R 2020+'],
        installationType: 'DIY',
        installationTimeMinutes: 30,
        warrantyPeriod: '6 Months',
        material: 'Carbon Fiber',
        color: 'Black',
        features: [
          'Lightweight carbon fiber',
          'Easy installation',
          'Improved performance',
          'Aggressive sound'
        ],
        isActive: true,
        isFeatured: true
      }
    ]);
    console.log(`✅ Created ${products.length} products`);
    
    console.log('\n🎉 Production data seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`  - Brands: ${brands.length}`);
    console.log(`  - Categories: ${mainCategories.length + subCategories.length}`);
    console.log(`  - Products: ${products.length}`);
    
    console.log('\n🌳 Testing categories tree...');
    const allCategories = await Category.findAll({
      where: { isActive: true, isVisibleInMenu: true },
      attributes: ['id', 'name', 'slug', 'parentId', 'level', 'categoryType', 'icon', 'image', 'sortOrder', 'isActive'],
      order: [['level', 'ASC'], ['sortOrder', 'ASC'], ['name', 'ASC']]
    });
    
    console.log(`📊 Active categories for tree: ${allCategories.length}`);
    console.log('✅ Production API should now return categories tree with data!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding production data:', error);
    process.exit(1);
  }
};

seedProductionData();
