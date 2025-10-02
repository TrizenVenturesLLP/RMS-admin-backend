#!/usr/bin/env node

/**
 * Complete HT Exhaust Data Seeding
 * This script replicates the entire HT Exhaust website structure
 * Based on: https://www.htexhaust.com/
 */

import { sequelize } from './src/config/database.js';
import { testConnection } from './src/config/database.js';
import Category from './src/models/Category.js';
import Product from './src/models/Product.js';
import Brand from './src/models/Brand.js';

const seedHTExhaustData = async () => {
  try {
    console.log('🏍️ Seeding complete HT Exhaust data structure...');
    console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
    
    await testConnection();
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Product.destroy({ where: {} });
    await Category.destroy({ where: {} });
    await Brand.destroy({ where: {} });
    
    // Create brands
    console.log('🏷️ Creating brands...');
    const brands = await Brand.bulkCreate([
      { name: 'HITECH', slug: 'hitech', description: 'Premium motorcycle accessories', brandType: 'accessory_brand', isFeatured: true, featuredOrder: 1 },
      { name: 'htexhaust', slug: 'htexhaust', description: 'HT Exhaust original products', brandType: 'accessory_brand', isFeatured: true, featuredOrder: 2 },
      { name: 'Yamaha', slug: 'yamaha', description: 'Yamaha motorcycle parts', brandType: 'bike_manufacturer', isFeatured: true, featuredOrder: 3 },
      { name: 'Royal Enfield', slug: 'royal-enfield', description: 'Royal Enfield parts', brandType: 'bike_manufacturer', isFeatured: true, featuredOrder: 4 },
      { name: 'Bajaj', slug: 'bajaj', description: 'Bajaj motorcycle parts', brandType: 'bike_manufacturer', isFeatured: true, featuredOrder: 5 },
      { name: 'Honda', slug: 'honda', description: 'Honda motorcycle parts', brandType: 'bike_manufacturer', isFeatured: true, featuredOrder: 6 },
      { name: 'TVS', slug: 'tvs', description: 'TVS motorcycle parts', brandType: 'bike_manufacturer', isFeatured: true, featuredOrder: 7 },
      { name: 'KTM', slug: 'ktm', description: 'KTM motorcycle parts', brandType: 'bike_manufacturer', isFeatured: true, featuredOrder: 8 },
      { name: 'Suzuki', slug: 'suzuki', description: 'Suzuki motorcycle parts', brandType: 'bike_manufacturer', isFeatured: true, featuredOrder: 9 },
      { name: 'Kawasaki', slug: 'kawasaki', description: 'Kawasaki motorcycle parts', brandType: 'bike_manufacturer', isFeatured: true, featuredOrder: 10 },
      { name: 'BMW', slug: 'bmw', description: 'BMW motorcycle parts', brandType: 'bike_manufacturer', isFeatured: true, featuredOrder: 11 },
      { name: 'Benelli', slug: 'benelli', description: 'Benelli motorcycle parts', brandType: 'bike_manufacturer', isFeatured: true, featuredOrder: 12 },
      { name: 'Jawa', slug: 'jawa', description: 'Jawa motorcycle parts', brandType: 'bike_manufacturer', isFeatured: true, featuredOrder: 13 },
      { name: 'Triumph', slug: 'triumph', description: 'Triumph motorcycle parts', brandType: 'bike_manufacturer', isFeatured: true, featuredOrder: 14 },
      { name: 'Hero', slug: 'hero', description: 'Hero motorcycle parts', brandType: 'bike_manufacturer', isFeatured: true, featuredOrder: 15 },
      { name: 'Harley Davidson', slug: 'harley-davidson', description: 'Harley Davidson parts', brandType: 'bike_manufacturer', isFeatured: true, featuredOrder: 16 },
      { name: 'Ducati', slug: 'ducati', description: 'Ducati motorcycle parts', brandType: 'bike_manufacturer', isFeatured: true, featuredOrder: 17 },
      { name: 'Mahindra', slug: 'mahindra', description: 'Mahindra motorcycle parts', brandType: 'bike_manufacturer', isFeatured: true, featuredOrder: 18 },
      { name: 'Ola', slug: 'ola', description: 'Ola electric vehicles', brandType: 'ev_manufacturer', isFeatured: true, featuredOrder: 19 },
      { name: 'Ather', slug: 'ather', description: 'Ather electric vehicles', brandType: 'ev_manufacturer', isFeatured: true, featuredOrder: 20 },
      { name: 'Vida', slug: 'vida', description: 'Vida electric vehicles', brandType: 'ev_manufacturer', isFeatured: true, featuredOrder: 21 }
    ]);
    console.log(`✅ Created ${brands.length} brands`);
    
    // Create main categories (Level 1)
    console.log('📂 Creating main categories...');
    const mainCategories = await Category.bulkCreate([
      {
        name: 'Shop by Bike',
        slug: 'shop-by-bike',
        description: 'Motorcycle parts organized by bike brand and model',
        level: 1,
        categoryType: 'main_menu',
        isVisibleInMenu: true,
        icon: 'bike-icon',
        sortOrder: 1
      },
      {
        name: 'Shop by Accessories',
        slug: 'shop-by-accessories',
        description: 'Motorcycle accessories organized by type',
        level: 1,
        categoryType: 'main_menu',
        isVisibleInMenu: true,
        icon: 'accessories-icon',
        sortOrder: 2
      },
      {
        name: 'Scooters',
        slug: 'scooters',
        description: 'Scooter parts and accessories',
        level: 1,
        categoryType: 'main_menu',
        isVisibleInMenu: true,
        icon: 'scooter-icon',
        sortOrder: 3
      },
      {
        name: 'EV Bikes',
        slug: 'ev-bikes',
        description: 'Electric vehicle parts and accessories',
        level: 1,
        categoryType: 'main_menu',
        isVisibleInMenu: true,
        icon: 'ev-icon',
        sortOrder: 4
      },
      {
        name: 'Combo',
        slug: 'combo',
        description: 'Product bundles and combo offers',
        level: 1,
        categoryType: 'main_menu',
        isVisibleInMenu: true,
        icon: 'combo-icon',
        sortOrder: 5
      }
    ]);
    console.log(`✅ Created ${mainCategories.length} main categories`);
    
    // Create bike brand categories (Level 2)
    console.log('🏍️ Creating bike brand categories...');
    const bikeBrands = await Category.bulkCreate([
      // YAMAHA
      { name: 'YAMAHA', slug: 'yamaha', parentId: mainCategories[0].id, level: 2, categoryType: 'bike_brand', isVisibleInMenu: true, sortOrder: 1 },
      // ROYAL ENFIELD
      { name: 'ROYAL ENFIELD', slug: 'royal-enfield', parentId: mainCategories[0].id, level: 2, categoryType: 'bike_brand', isVisibleInMenu: true, sortOrder: 2 },
      // BAJAJ
      { name: 'BAJAJ', slug: 'bajaj', parentId: mainCategories[0].id, level: 2, categoryType: 'bike_brand', isVisibleInMenu: true, sortOrder: 3 },
      // HONDA
      { name: 'HONDA', slug: 'honda', parentId: mainCategories[0].id, level: 2, categoryType: 'bike_brand', isVisibleInMenu: true, sortOrder: 4 },
      // TVS
      { name: 'TVS', slug: 'tvs', parentId: mainCategories[0].id, level: 2, categoryType: 'bike_brand', isVisibleInMenu: true, sortOrder: 5 },
      // KTM
      { name: 'KTM', slug: 'ktm', parentId: mainCategories[0].id, level: 2, categoryType: 'bike_brand', isVisibleInMenu: true, sortOrder: 6 },
      // SUZUKI
      { name: 'SUZUKI', slug: 'suzuki', parentId: mainCategories[0].id, level: 2, categoryType: 'bike_brand', isVisibleInMenu: true, sortOrder: 7 },
      // KAWASAKI
      { name: 'KAWASAKI', slug: 'kawasaki', parentId: mainCategories[0].id, level: 2, categoryType: 'bike_brand', isVisibleInMenu: true, sortOrder: 8 },
      // BMW
      { name: 'BMW', slug: 'bmw', parentId: mainCategories[0].id, level: 2, categoryType: 'bike_brand', isVisibleInMenu: true, sortOrder: 9 },
      // BENELLI
      { name: 'BENELLI', slug: 'benelli', parentId: mainCategories[0].id, level: 2, categoryType: 'bike_brand', isVisibleInMenu: true, sortOrder: 10 },
      // JAWA - YEZDI
      { name: 'JAWA - YEZDI', slug: 'jawa-yezdi', parentId: mainCategories[0].id, level: 2, categoryType: 'bike_brand', isVisibleInMenu: true, sortOrder: 11 },
      // TRIUMPH
      { name: 'TRIUMPH', slug: 'triumph', parentId: mainCategories[0].id, level: 2, categoryType: 'bike_brand', isVisibleInMenu: true, sortOrder: 12 },
      // HERO
      { name: 'HERO', slug: 'hero', parentId: mainCategories[0].id, level: 2, categoryType: 'bike_brand', isVisibleInMenu: true, sortOrder: 13 },
      // HARLEY DAVIDSON
      { name: 'HARLEY DAVIDSON', slug: 'harley-davidson', parentId: mainCategories[0].id, level: 2, categoryType: 'bike_brand', isVisibleInMenu: true, sortOrder: 14 },
      // DUCATI
      { name: 'DUCATI', slug: 'ducati', parentId: mainCategories[0].id, level: 2, categoryType: 'bike_brand', isVisibleInMenu: true, sortOrder: 15 },
      // MAHINDRA
      { name: 'MAHINDRA', slug: 'mahindra', parentId: mainCategories[0].id, level: 2, categoryType: 'bike_brand', isVisibleInMenu: true, sortOrder: 16 }
    ]);
    console.log(`✅ Created ${bikeBrands.length} bike brand categories`);
    
    // Create YAMAHA models (Level 3)
    console.log('🏍️ Creating YAMAHA model categories...');
    const yamahaModels = await Category.bulkCreate([
      { name: 'AEROX 155', slug: 'aerox-155', parentId: bikeBrands[0].id, level: 3, categoryType: 'bike_model', isVisibleInMenu: true, sortOrder: 1 },
      { name: 'MT 15', slug: 'mt-15', parentId: bikeBrands[0].id, level: 3, categoryType: 'bike_model', isVisibleInMenu: true, sortOrder: 2 },
      { name: 'R15 V4 / M', slug: 'r15-v4-m', parentId: bikeBrands[0].id, level: 3, categoryType: 'bike_model', isVisibleInMenu: true, sortOrder: 3 },
      { name: 'R15 V3', slug: 'r15-v3', parentId: bikeBrands[0].id, level: 3, categoryType: 'bike_model', isVisibleInMenu: true, sortOrder: 4 },
      { name: 'R3 - BS4', slug: 'r3-bs4', parentId: bikeBrands[0].id, level: 3, categoryType: 'bike_model', isVisibleInMenu: true, sortOrder: 5 },
      { name: 'FZ V2.0', slug: 'fz-v2-0', parentId: bikeBrands[0].id, level: 3, categoryType: 'bike_model', isVisibleInMenu: true, sortOrder: 6 },
      { name: 'FZ V3.0', slug: 'fz-v3-0', parentId: bikeBrands[0].id, level: 3, categoryType: 'bike_model', isVisibleInMenu: true, sortOrder: 7 },
      { name: 'FZ V4.0', slug: 'fz-v4-0', parentId: bikeBrands[0].id, level: 3, categoryType: 'bike_model', isVisibleInMenu: true, sortOrder: 8 },
      { name: 'FZ 25', slug: 'fz-25', parentId: bikeBrands[0].id, level: 3, categoryType: 'bike_model', isVisibleInMenu: true, sortOrder: 9 },
      { name: 'FZ X', slug: 'fz-x', parentId: bikeBrands[0].id, level: 3, categoryType: 'bike_model', isVisibleInMenu: true, sortOrder: 10 },
      { name: 'MT 03', slug: 'mt-03', parentId: bikeBrands[0].id, level: 3, categoryType: 'bike_model', isVisibleInMenu: true, sortOrder: 11 },
      { name: 'R15 V1', slug: 'r15-v1', parentId: bikeBrands[0].id, level: 3, categoryType: 'bike_model', isVisibleInMenu: true, sortOrder: 12 },
      { name: 'CRUX', slug: 'crux', parentId: bikeBrands[0].id, level: 3, categoryType: 'bike_model', isVisibleInMenu: true, sortOrder: 13 },
      { name: 'RAY ZR', slug: 'ray-zr', parentId: bikeBrands[0].id, level: 3, categoryType: 'bike_model', isVisibleInMenu: true, sortOrder: 14 },
      { name: 'FASCINO 125', slug: 'fascino-125', parentId: bikeBrands[0].id, level: 3, categoryType: 'bike_model', isVisibleInMenu: true, sortOrder: 15 }
    ]);
    console.log(`✅ Created ${yamahaModels.length} YAMAHA model categories`);
    
    // Create accessory categories (Level 2)
    console.log('🛠️ Creating accessory categories...');
    const accessoryCategories = await Category.bulkCreate([
      {
        name: 'TOURING ACCESSORIES',
        slug: 'touring-accessories',
        parentId: mainCategories[1].id,
        level: 2,
        categoryType: 'accessory_type',
        isVisibleInMenu: true,
        sortOrder: 1
      },
      {
        name: 'PROTECTION ACCESSORIES',
        slug: 'protection-accessories',
        parentId: mainCategories[1].id,
        level: 2,
        categoryType: 'accessory_type',
        isVisibleInMenu: true,
        sortOrder: 2
      },
      {
        name: 'PERFORMANCE ACCESSORIES',
        slug: 'performance-accessories',
        parentId: mainCategories[1].id,
        level: 2,
        categoryType: 'accessory_type',
        isVisibleInMenu: true,
        sortOrder: 3
      },
      {
        name: 'AUXILLARY ACCESSORIES',
        slug: 'auxillary-accessories',
        parentId: mainCategories[1].id,
        level: 2,
        categoryType: 'accessory_type',
        isVisibleInMenu: true,
        sortOrder: 4
      },
      {
        name: 'BOXES AND PANNIERS',
        slug: 'boxes-and-panniers',
        parentId: mainCategories[1].id,
        level: 2,
        categoryType: 'accessory_type',
        isVisibleInMenu: true,
        sortOrder: 5
      }
    ]);
    console.log(`✅ Created ${accessoryCategories.length} accessory categories`);
    
    // Create touring accessory subcategories (Level 3)
    console.log('🎒 Creating touring accessory subcategories...');
    const touringSubcategories = await Category.bulkCreate([
      { name: 'BACK REST', slug: 'back-rest', parentId: accessoryCategories[0].id, level: 3, categoryType: 'product_group', isVisibleInMenu: true, sortOrder: 1 },
      { name: 'TOPRACK SADDLE STAY', slug: 'toprack-saddle-stay', parentId: accessoryCategories[0].id, level: 3, categoryType: 'product_group', isVisibleInMenu: true, sortOrder: 2 },
      { name: 'TOP RACK', slug: 'top-rack', parentId: accessoryCategories[0].id, level: 3, categoryType: 'product_group', isVisibleInMenu: true, sortOrder: 3 },
      { name: 'LUGGAGE CARRIER', slug: 'luggage-carrier', parentId: accessoryCategories[0].id, level: 3, categoryType: 'product_group', isVisibleInMenu: true, sortOrder: 4 },
      { name: 'TOP PLATE', slug: 'top-plate', parentId: accessoryCategories[0].id, level: 3, categoryType: 'product_group', isVisibleInMenu: true, sortOrder: 5 },
      { name: 'SADDLE STAY', slug: 'saddle-stay', parentId: accessoryCategories[0].id, level: 3, categoryType: 'product_group', isVisibleInMenu: true, sortOrder: 6 },
      { name: 'FOG LIGHT CLAMP', slug: 'fog-light-clamp', parentId: accessoryCategories[0].id, level: 3, categoryType: 'product_group', isVisibleInMenu: true, sortOrder: 7 },
      { name: 'GPS MOUNT', slug: 'gps-mount', parentId: accessoryCategories[0].id, level: 3, categoryType: 'product_group', isVisibleInMenu: true, sortOrder: 8 }
    ]);
    console.log(`✅ Created ${touringSubcategories.length} touring subcategories`);
    
    // Create protection accessory subcategories (Level 3)
    console.log('🛡️ Creating protection accessory subcategories...');
    const protectionSubcategories = await Category.bulkCreate([
      { name: 'CRASH GUARD', slug: 'crash-guard', parentId: accessoryCategories[1].id, level: 3, categoryType: 'product_group', isVisibleInMenu: true, sortOrder: 1 },
      { name: 'FRAME SLIDER', slug: 'frame-slider', parentId: accessoryCategories[1].id, level: 3, categoryType: 'product_group', isVisibleInMenu: true, sortOrder: 2 },
      { name: 'SUMP GUARD', slug: 'sump-guard', parentId: accessoryCategories[1].id, level: 3, categoryType: 'product_group', isVisibleInMenu: true, sortOrder: 3 },
      { name: 'RADIATOR GUARD', slug: 'radiator-guard', parentId: accessoryCategories[1].id, level: 3, categoryType: 'product_group', isVisibleInMenu: true, sortOrder: 4 },
      { name: 'HEAD LIGHT GRILL', slug: 'head-light-grill', parentId: accessoryCategories[1].id, level: 3, categoryType: 'product_group', isVisibleInMenu: true, sortOrder: 5 },
      { name: 'CHAIN PROTECTOR', slug: 'chain-protector', parentId: accessoryCategories[1].id, level: 3, categoryType: 'product_group', isVisibleInMenu: true, sortOrder: 6 },
      { name: 'SILENCER GUARD', slug: 'silencer-guard', parentId: accessoryCategories[1].id, level: 3, categoryType: 'product_group', isVisibleInMenu: true, sortOrder: 7 }
    ]);
    console.log(`✅ Created ${protectionSubcategories.length} protection subcategories`);
    
    // Create performance accessory subcategories (Level 3)
    console.log('⚡ Creating performance accessory subcategories...');
    const performanceSubcategories = await Category.bulkCreate([
      { name: 'EXHAUST BEND PIPE', slug: 'exhaust-bend-pipe', parentId: accessoryCategories[2].id, level: 3, categoryType: 'product_group', isVisibleInMenu: true, sortOrder: 1 },
      { name: 'SILENCER - SILVER', slug: 'silencer-silver', parentId: accessoryCategories[2].id, level: 3, categoryType: 'product_group', isVisibleInMenu: true, sortOrder: 2 },
      { name: 'SILENCER - BLACK', slug: 'silencer-black', parentId: accessoryCategories[2].id, level: 3, categoryType: 'product_group', isVisibleInMenu: true, sortOrder: 3 }
    ]);
    console.log(`✅ Created ${performanceSubcategories.length} performance subcategories`);
    
    // Create sample products
    console.log('🛍️ Creating sample products...');
    const products = await Product.bulkCreate([
      // HITECH products
      {
        name: '2 METAL SLIDER /SB 705',
        slug: '2-metal-slider-sb-705',
        description: 'Universal metal slider for motorcycle protection',
        shortDescription: 'Universal metal slider',
        sku: 'SB-705',
        price: 740.00,
        stockQuantity: 50,
        categoryId: protectionSubcategories[1].id, // FRAME SLIDER
        brandId: brands[0].id, // HITECH
        vendorName: 'HITECH',
        productType: 'protection',
        accessoryCategory: 'frame_slider',
        installationType: 'DIY',
        installationTimeMinutes: 30,
        warrantyPeriod: '6 Months',
        material: 'Metal',
        color: 'Silver',
        features: ['Universal fit', 'Easy installation', 'Durable construction'],
        isActive: true,
        isFeatured: false
      },
      {
        name: '10 mm Bobbins / Spools Universal for Paddock SB 898',
        slug: '10mm-bobbins-spools-universal-paddock-sb-898',
        description: 'Universal paddock stand bobbins for motorcycle maintenance',
        shortDescription: 'Universal paddock bobbins',
        sku: 'SB-898',
        price: 560.00,
        stockQuantity: 30,
        categoryId: accessoryCategories[3].id, // AUXILLARY ACCESSORIES
        brandId: brands[0].id, // HITECH
        vendorName: 'HITECH',
        productType: 'auxiliary',
        accessoryCategory: 'maintenance',
        installationType: 'DIY',
        installationTimeMinutes: 15,
        warrantyPeriod: '3 Months',
        material: 'Steel',
        color: 'Black',
        features: ['Universal fit', '10mm thread', 'Easy installation'],
        isActive: true,
        isFeatured: false
      },
      {
        name: '3" METEOR SEATREST EXTENDER FITMENT – SB 669',
        slug: '3-meteor-seatrest-extender-fitment-sb-669',
        description: 'Seat rest extender for Royal Enfield Meteor 350',
        shortDescription: 'Meteor seat rest extender',
        sku: 'SB-669',
        price: 740.00,
        stockQuantity: 25,
        categoryId: touringSubcategories[0].id, // BACK REST
        brandId: brands[1].id, // htexhaust
        vendorName: 'htexhaust',
        productType: 'touring',
        accessoryCategory: 'comfort',
        compatibleBikes: ['Royal Enfield Meteor 350'],
        installationType: 'Professional Required',
        installationTimeMinutes: 60,
        warrantyPeriod: '1 Year',
        material: 'Steel',
        color: 'Black',
        features: ['Perfect fit for Meteor 350', '3 inch extension', 'Powder coated'],
        isActive: true,
        isFeatured: true
      },
      {
        name: 'ADVENTURE 250 390 - GPS MOUNT - SB 739',
        slug: 'adventure-250-390-gps-mount-sb-739',
        description: 'GPS mount for KTM Adventure 250/390',
        shortDescription: 'KTM Adventure GPS mount',
        sku: 'SB-739',
        price: 930.00,
        stockQuantity: 20,
        categoryId: touringSubcategories[7].id, // GPS MOUNT
        brandId: brands[0].id, // HITECH
        vendorName: 'HITECH',
        productType: 'touring',
        accessoryCategory: 'navigation',
        compatibleBikes: ['KTM Adventure 250', 'KTM Adventure 390'],
        installationType: 'DIY',
        installationTimeMinutes: 20,
        warrantyPeriod: '6 Months',
        material: 'Aluminum',
        color: 'Black',
        features: ['Perfect fit for Adventure series', 'Adjustable angle', 'Secure mounting'],
        isActive: true,
        isFeatured: false
      },
      {
        name: 'ADVENTURE 250 390 FLUID TANK CAP - FTC 066',
        slug: 'adventure-250-390-fluid-tank-cap-ftc-066',
        description: 'Fluid tank cap for KTM Adventure 250/390',
        shortDescription: 'KTM Adventure fluid tank cap',
        sku: 'FTC-066',
        price: 280.00,
        stockQuantity: 40,
        categoryId: accessoryCategories[3].id, // AUXILLARY ACCESSORIES
        brandId: brands[0].id, // HITECH
        vendorName: 'HITECH',
        productType: 'auxiliary',
        accessoryCategory: 'maintenance',
        compatibleBikes: ['KTM Adventure 250', 'KTM Adventure 390'],
        installationType: 'DIY',
        installationTimeMinutes: 5,
        warrantyPeriod: '3 Months',
        material: 'Plastic',
        color: 'Black',
        features: ['Perfect fit', 'Easy installation', 'Durable construction'],
        isActive: true,
        isFeatured: false
      },
      {
        name: 'Apache RTR 200 4v TOP RACK With Small Plate SBTVS 104-SMALL',
        slug: 'apache-rtr-200-4v-top-rack-small-plate-sbtvs-104-small',
        description: 'Top rack with small plate for TVS Apache RTR 200 4V',
        shortDescription: 'Apache RTR 200 top rack',
        sku: 'SBTVS-104-SMALL',
        price: 2600.00,
        stockQuantity: 15,
        categoryId: touringSubcategories[2].id, // TOP RACK
        brandId: brands[0].id, // HITECH
        vendorName: 'HITECH',
        productType: 'touring',
        accessoryCategory: 'luggage',
        compatibleBikes: ['TVS Apache RTR 200 4V'],
        installationType: 'Professional Required',
        installationTimeMinutes: 90,
        warrantyPeriod: '1 Year',
        material: 'Steel',
        color: 'Black',
        features: ['Perfect fit for Apache RTR 200', 'Small plate included', 'Powder coated'],
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Apache RR310 Radiator Guard - RD 935',
        slug: 'apache-rr310-radiator-guard-rd-935',
        description: 'Radiator guard for TVS Apache RR310',
        shortDescription: 'Apache RR310 radiator guard',
        sku: 'RD-935',
        price: 1300.00,
        stockQuantity: 20,
        categoryId: protectionSubcategories[3].id, // RADIATOR GUARD
        brandId: brands[0].id, // HITECH
        vendorName: 'HITECH',
        productType: 'protection',
        accessoryCategory: 'engine_protection',
        compatibleBikes: ['TVS Apache RR310'],
        installationType: 'DIY',
        installationTimeMinutes: 45,
        warrantyPeriod: '1 Year',
        material: 'Steel',
        color: 'Black',
        features: ['Perfect fit for RR310', 'Engine protection', 'Powder coated'],
        isActive: true,
        isFeatured: false
      }
    ]);
    console.log(`✅ Created ${products.length} products`);
    
    console.log('\n🎉 Complete HT Exhaust data seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`  - Brands: ${brands.length}`);
    console.log(`  - Categories: ${mainCategories.length + bikeBrands.length + yamahaModels.length + accessoryCategories.length + touringSubcategories.length + protectionSubcategories.length + performanceSubcategories.length}`);
    console.log(`  - Products: ${products.length}`);
    
    // Test categories tree
    console.log('\n🌳 Testing categories tree...');
    const allCategories = await Category.findAll({
      where: { isActive: true, isVisibleInMenu: true },
      attributes: ['id', 'name', 'slug', 'parentId', 'level', 'categoryType', 'icon', 'image', 'sortOrder', 'isActive'],
      order: [['level', 'ASC'], ['sortOrder', 'ASC'], ['name', 'ASC']]
    });
    
    console.log(`📊 Total active categories: ${allCategories.length}`);
    console.log('✅ Your API should now return a complete categories tree matching HT Exhaust structure!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding HT Exhaust data:', error);
    process.exit(1);
  }
};

seedHTExhaustData();
