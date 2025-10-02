#!/usr/bin/env node

/**
 * Add Final Categories to Reach 200+
 * This script adds the remaining categories to reach 200+ total
 */

import { sequelize } from './src/config/database.js';
import { testConnection } from './src/config/database.js';
import { Category } from './src/models/index.js';
import slugify from 'slugify';

const addFinalCategories = async () => {
  try {
    console.log('🚀 Adding final categories to reach 200+...');
    console.log('🌍 Environment:', process.env.NODE_ENV || 'development');

    await testConnection();

    // Helper function to create unique slug
    const createUniqueSlug = async (name, baseSlug = null) => {
      let slug = baseSlug || slugify(name, { lower: true, strict: true });
      let counter = 1;
      
      while (true) {
        const existing = await Category.findOne({ where: { slug } });
        if (!existing) {
          return slug;
        }
        slug = `${baseSlug || slugify(name, { lower: true, strict: true })}-${counter}`;
        counter++;
      }
    };

    // Get existing main categories
    const shopByBike = await Category.findOne({ where: { slug: 'shop-by-bike' } });
    const shopByAccessories = await Category.findOne({ where: { slug: 'shop-by-accessories' } });
    const scooters = await Category.findOne({ where: { slug: 'scooters' } });
    const evBikes = await Category.findOne({ where: { slug: 'ev-bikes' } });
    const combo = await Category.findOne({ where: { slug: 'combo' } });

    // Add more bike models to existing brands
    console.log('🏍️ Adding more bike models...');
    
    // Add more Yamaha models
    const yamaha = await Category.findOne({ where: { slug: 'yamaha', parentId: shopByBike.id } });
    if (yamaha) {
      const additionalYamahaModels = [
        'YZF R1', 'YZF R6', 'MT 07', 'MT 09', 'XSR 700', 'XSR 900', 'TMAX 560', 'NMAX 155'
      ];
      
      for (let i = 0; i < additionalYamahaModels.length; i++) {
        const modelName = additionalYamahaModels[i];
        const slug = await createUniqueSlug(modelName);
        
        await Category.create({
          name: modelName,
          slug: slug,
          parentId: yamaha.id,
          level: 3,
          categoryType: 'bike_model',
          isVisibleInMenu: true,
          sortOrder: 20 + i + 1
        });
      }
    }

    // Add more Royal Enfield models
    const royalEnfield = await Category.findOne({ where: { slug: 'royal-enfield', parentId: shopByBike.id } });
    if (royalEnfield) {
      const additionalREModels = [
        'CONTINENTAL GT 650', 'INTERCEPTOR 650', 'BULLET 500', 'THUNDERBIRD 500'
      ];
      
      for (let i = 0; i < additionalREModels.length; i++) {
        const modelName = additionalREModels[i];
        const slug = await createUniqueSlug(modelName);
        
        await Category.create({
          name: modelName,
          slug: slug,
          parentId: royalEnfield.id,
          level: 3,
          categoryType: 'bike_model',
          isVisibleInMenu: true,
          sortOrder: 20 + i + 1
        });
      }
    }

    // Add more Honda models
    const honda = await Category.findOne({ where: { slug: 'honda', parentId: shopByBike.id } });
    if (honda) {
      const additionalHondaModels = [
        'CBR 1000 RR', 'CBR 600 RR', 'CB 1000 R', 'CB 650 R', 'CRF 450 R', 'CRF 250 R'
      ];
      
      for (let i = 0; i < additionalHondaModels.length; i++) {
        const modelName = additionalHondaModels[i];
        const slug = await createUniqueSlug(modelName);
        
        await Category.create({
          name: modelName,
          slug: slug,
          parentId: honda.id,
          level: 3,
          categoryType: 'bike_model',
          isVisibleInMenu: true,
          sortOrder: 20 + i + 1
        });
      }
    }

    // Add more KTM models
    const ktm = await Category.findOne({ where: { slug: 'ktm', parentId: shopByBike.id } });
    if (ktm) {
      const additionalKTMModels = [
        'RC 125', 'RC 200', 'RC 390', 'SUPER DUKE 1290', 'ADVENTURE 1090', 'ADVENTURE 1190'
      ];
      
      for (let i = 0; i < additionalKTMModels.length; i++) {
        const modelName = additionalKTMModels[i];
        const slug = await createUniqueSlug(modelName);
        
        await Category.create({
          name: modelName,
          slug: slug,
          parentId: ktm.id,
          level: 3,
          categoryType: 'bike_model',
          isVisibleInMenu: true,
          sortOrder: 20 + i + 1
        });
      }
    }

    // Add more accessory subcategories
    console.log('🛠️ Adding more accessory subcategories...');
    
    // Add more touring accessories
    const touringAccessories = await Category.findOne({ where: { slug: 'touring-accessories', parentId: shopByAccessories.id } });
    if (touringAccessories) {
      const additionalTouringSubcategories = [
        'TANK BAG', 'SADDLE BAG', 'HELMET LOCK', 'CUP HOLDER', 'PHONE MOUNT'
      ];
      
      for (let i = 0; i < additionalTouringSubcategories.length; i++) {
        const subcategoryName = additionalTouringSubcategories[i];
        const slug = await createUniqueSlug(subcategoryName);
        
        await Category.create({
          name: subcategoryName,
          slug: slug,
          parentId: touringAccessories.id,
          level: 3,
          categoryType: 'product_group',
          isVisibleInMenu: true,
          sortOrder: 10 + i + 1
        });
      }
    }

    // Add more protection accessories
    const protectionAccessories = await Category.findOne({ where: { slug: 'protection-accessories', parentId: shopByAccessories.id } });
    if (protectionAccessories) {
      const additionalProtectionSubcategories = [
        'ENGINE GUARD', 'SWINGARM GUARD', 'FORK GUARD', 'MUDGUARD', 'WINDSCREEN'
      ];
      
      for (let i = 0; i < additionalProtectionSubcategories.length; i++) {
        const subcategoryName = additionalProtectionSubcategories[i];
        const slug = await createUniqueSlug(subcategoryName);
        
        await Category.create({
          name: subcategoryName,
          slug: slug,
          parentId: protectionAccessories.id,
          level: 3,
          categoryType: 'product_group',
          isVisibleInMenu: true,
          sortOrder: 10 + i + 1
        });
      }
    }

    // Add more performance accessories
    const performanceAccessories = await Category.findOne({ where: { slug: 'performance-accessories', parentId: shopByAccessories.id } });
    if (performanceAccessories) {
      const additionalPerformanceSubcategories = [
        'AIR FILTER', 'SPARK PLUG', 'FUEL PUMP', 'THROTTLE BODY', 'ECU TUNING'
      ];
      
      for (let i = 0; i < additionalPerformanceSubcategories.length; i++) {
        const subcategoryName = additionalPerformanceSubcategories[i];
        const slug = await createUniqueSlug(subcategoryName);
        
        await Category.create({
          name: subcategoryName,
          slug: slug,
          parentId: performanceAccessories.id,
          level: 3,
          categoryType: 'product_group',
          isVisibleInMenu: true,
          sortOrder: 10 + i + 1
        });
      }
    }

    // Add more auxillary accessories
    const auxillaryAccessories = await Category.findOne({ where: { slug: 'auxillary-accessories', parentId: shopByAccessories.id } });
    if (auxillaryAccessories) {
      const additionalAuxillarySubcategories = [
        'MIRROR', 'INDICATOR', 'BRAKE LEVER', 'CLUTCH LEVER', 'GRIP'
      ];
      
      for (let i = 0; i < additionalAuxillarySubcategories.length; i++) {
        const subcategoryName = additionalAuxillarySubcategories[i];
        const slug = await createUniqueSlug(subcategoryName);
        
        await Category.create({
          name: subcategoryName,
          slug: slug,
          parentId: auxillaryAccessories.id,
          level: 3,
          categoryType: 'product_group',
          isVisibleInMenu: true,
          sortOrder: 10 + i + 1
        });
      }
    }

    // Add more combo categories
    console.log('📦 Adding more combo categories...');
    if (combo) {
      const additionalComboCategories = [
        'COMBO 6', 'COMBO 7', 'COMBO 8', 'COMBO 9', 'COMBO 10'
      ];
      
      for (let i = 0; i < additionalComboCategories.length; i++) {
        const comboName = additionalComboCategories[i];
        const slug = await createUniqueSlug(comboName);
        
        await Category.create({
          name: comboName,
          slug: slug,
          parentId: combo.id,
          level: 2,
          categoryType: 'combo_package',
          isVisibleInMenu: true,
          sortOrder: 10 + i + 1
        });
      }
    }

    // Count final categories
    const totalCategories = await Category.count();
    const activeCategories = await Category.count({ where: { isActive: true, isVisibleInMenu: true } });
    
    console.log('\n🎉 Final categories added successfully!');
    console.log(`📊 Total categories: ${totalCategories}`);
    console.log(`📊 Active categories: ${activeCategories}`);
    
    if (totalCategories >= 200) {
      console.log('✅ SUCCESS: You now have 200+ categories!');
      console.log(`🎯 Target achieved: ${totalCategories} categories (exceeded 200+)`);
    } else {
      console.log(`⚠️  You have ${totalCategories} categories. Still need ${200 - totalCategories} more to reach 200+.`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding final categories:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
};

addFinalCategories();
