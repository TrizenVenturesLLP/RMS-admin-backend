#!/usr/bin/env node

/**
 * Add ALL Missing Categories from HT Exhaust Website
 * This script adds every single category from the reference website
 * Target: 200+ categories to match the complete HT Exhaust structure
 */

import { sequelize } from './src/config/database.js';
import { testConnection } from './src/config/database.js';
import Category from './src/models/Category.js';

const addAllMissingCategories = async () => {
  try {
    console.log('🏍️ Adding ALL missing categories from HT Exhaust website...');
    
    await testConnection();
    
    // Get existing main categories
    const shopByBike = await Category.findOne({ where: { slug: 'shop-by-bike' } });
    const shopByAccessories = await Category.findOne({ where: { slug: 'shop-by-accessories' } });
    const scooters = await Category.findOne({ where: { slug: 'scooters' } });
    const evBikes = await Category.findOne({ where: { slug: 'ev-bikes' } });
    const combo = await Category.findOne({ where: { slug: 'combo' } });
    
    console.log('📂 Adding ALL bike brand categories with complete models...');
    
    // YAMAHA - ALL models from website
    const yamaha = await Category.findOne({ where: { slug: 'yamaha' } });
    if (yamaha) {
      const yamahaModels = [
        'AEROX 155', 'MT 15', 'R15 V4 / M', 'R15 V3', 'R3 - BS4', 'FZ V2.0', 'FZ V3.0', 'FZ V4.0',
        'FZ 25', 'FZ X', 'MT 03', 'R15 V1', 'CRUX', 'RAY ZR', 'FASCINO 125'
      ];
      
      for (let i = 0; i < yamahaModels.length; i++) {
        const modelName = yamahaModels[i];
        const slug = modelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        await Category.findOrCreate({
          where: { slug: slug, parentId: yamaha.id },
          defaults: {
            name: modelName,
            slug: slug,
            parentId: yamaha.id,
            level: 3,
            categoryType: 'bike_model',
            isVisibleInMenu: true,
            sortOrder: i + 1
          }
        });
      }
    }
    
    // ROYAL ENFIELD - ALL models from website
    const royalEnfield = await Category.findOne({ where: { slug: 'royal-enfield' } });
    if (royalEnfield) {
      const reModels = [
        'Super Meteor 650', 'Himalayan 450', 'HIMALAYAN 411', 'GUERRILLA 450', 'SCRAM 411',
        'HUNTER 350', 'METEOR 350', 'CLASSIC 350 UPTO 2021', 'REBORN CLASSIC 350',
        'THUNDERBIRD X', 'THUNDERBIRD 350', 'BULLET 350', 'ELECTRA 350', 'INTERCEPTOR/GT 650'
      ];
      
      for (let i = 0; i < reModels.length; i++) {
        const modelName = reModels[i];
        const slug = modelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        await Category.findOrCreate({
          where: { slug: slug, parentId: royalEnfield.id },
          defaults: {
            name: modelName,
            slug: slug,
            parentId: royalEnfield.id,
            level: 3,
            categoryType: 'bike_model',
            isVisibleInMenu: true,
            sortOrder: i + 1
          }
        });
      }
    }
    
    // BAJAJ - ALL models from website
    const bajaj = await Category.findOne({ where: { slug: 'bajaj' } });
    if (bajaj) {
      const bajajModels = [
        'NS 125', 'NS 160', 'NS 200', 'NS 400 Z', 'RS 200', 'DOMINAR 250', 'DOMINAR 400',
        'AVENGER STREET', 'PULSAR N 150', 'PULSAR N 160', 'PULSAR N 250', 'PULSAR 150',
        'PULSAR 180', 'PULSAR 220 F'
      ];
      
      for (let i = 0; i < bajajModels.length; i++) {
        const modelName = bajajModels[i];
        const slug = modelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        await Category.findOrCreate({
          where: { slug: slug, parentId: bajaj.id },
          defaults: {
            name: modelName,
            slug: slug,
            parentId: bajaj.id,
            level: 3,
            categoryType: 'bike_model',
            isVisibleInMenu: true,
            sortOrder: i + 1
          }
        });
      }
    }
    
    // HONDA - ALL models from website
    const honda = await Category.findOne({ where: { slug: 'honda' } });
    if (honda) {
      const hondaModels = [
        'HNESS CB 350', 'CB 350 2024', 'RS CB 350', 'CB 200 X', 'CB 300 F', 'CB 300 R',
        'CBR 250 R', 'HORNET 2.0', 'SHINE BS6', 'CB UNICORN', 'UNICORN BS6', 'X BLADE',
        'DIO BS4', 'DIO BS6', 'TRANSALP 750'
      ];
      
      for (let i = 0; i < hondaModels.length; i++) {
        const modelName = hondaModels[i];
        const slug = modelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        await Category.findOrCreate({
          where: { slug: slug, parentId: honda.id },
          defaults: {
            name: modelName,
            slug: slug,
            parentId: honda.id,
            level: 3,
            categoryType: 'bike_model',
            isVisibleInMenu: true,
            sortOrder: i + 1
          }
        });
      }
    }
    
    // TVS - ALL models from website
    const tvs = await Category.findOne({ where: { slug: 'tvs' } });
    if (tvs) {
      const tvsModels = [
        'APACHE RR 310', 'APACH RTR 310', 'APACHE 160 2V', 'APACHE 180 2V', 'APACHE 160 4V',
        'APACHE 200 4V', 'RONIN 225', 'RAIDER 125', 'NTORQ', 'JUPITER 125 BS4',
        'JUPITER 110 BS6', 'JUPITER 125 BS6'
      ];
      
      for (let i = 0; i < tvsModels.length; i++) {
        const modelName = tvsModels[i];
        const slug = modelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        await Category.findOrCreate({
          where: { slug: slug, parentId: tvs.id },
          defaults: {
            name: modelName,
            slug: slug,
            parentId: tvs.id,
            level: 3,
            categoryType: 'bike_model',
            isVisibleInMenu: true,
            sortOrder: i + 1
          }
        });
      }
    }
    
    // KTM - ALL models from website
    const ktm = await Category.findOne({ where: { slug: 'ktm' } });
    if (ktm) {
      const ktmModels = [
        'ADVENTURE 250', 'ADVENTURE 390', 'DUKE 200 BS6', 'DUKE 250/390 BS6', 'DUKE 200 OLD',
        'DUKE 250 GEN 3', 'DUKE 390 GEN 3', 'KTM RC 200 - 2022', 'KTM RC 200 BS6', 'KTM RC 390 BS6'
      ];
      
      for (let i = 0; i < ktmModels.length; i++) {
        const modelName = ktmModels[i];
        const slug = modelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        await Category.findOrCreate({
          where: { slug: slug, parentId: ktm.id },
          defaults: {
            name: modelName,
            slug: slug,
            parentId: ktm.id,
            level: 3,
            categoryType: 'bike_model',
            isVisibleInMenu: true,
            sortOrder: i + 1
          }
        });
      }
    }
    
    // SUZUKI - ALL models from website
    const suzuki = await Category.findOne({ where: { slug: 'suzuki' } });
    if (suzuki) {
      const suzukiModels = [
        'V STROM 250', 'V STROM 650', 'GIXXER 150 SF', 'GIXXER 250 SF', 'GIXXER NAKED 150cc BS3',
        'GIXXER NAKED 150cc BS6', 'GIXXER NAKED 250', 'ACCESS 125', 'BURGMAN', 'AVENIS 125'
      ];
      
      for (let i = 0; i < suzukiModels.length; i++) {
        const modelName = suzukiModels[i];
        const slug = modelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        await Category.findOrCreate({
          where: { slug: slug, parentId: suzuki.id },
          defaults: {
            name: modelName,
            slug: slug,
            parentId: suzuki.id,
            level: 3,
            categoryType: 'bike_model',
            isVisibleInMenu: true,
            sortOrder: i + 1
          }
        });
      }
    }
    
    // KAWASAKI - ALL models from website
    const kawasaki = await Category.findOne({ where: { slug: 'kawasaki' } });
    if (kawasaki) {
      const kawasakiModels = [
        'Z 900 - 2020', 'ZX 10 R', 'NINJA 1000 SX', 'VERSYS 650', 'VERSYS 1000',
        'NINJA 250', 'NINJA 300', 'KAWASAKI W175', 'ER - 6N'
      ];
      
      for (let i = 0; i < kawasakiModels.length; i++) {
        const modelName = kawasakiModels[i];
        const slug = modelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        await Category.findOrCreate({
          where: { slug: slug, parentId: kawasaki.id },
          defaults: {
            name: modelName,
            slug: slug,
            parentId: kawasaki.id,
            level: 3,
            categoryType: 'bike_model',
            isVisibleInMenu: true,
            sortOrder: i + 1
          }
        });
      }
    }
    
    // BMW - ALL models from website
    const bmw = await Category.findOne({ where: { slug: 'bmw' } });
    if (bmw) {
      const bmwModels = ['BMW G 310 GS', 'BMW G 310 R', 'BMW G 310 RR'];
      
      for (let i = 0; i < bmwModels.length; i++) {
        const modelName = bmwModels[i];
        const slug = modelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        await Category.findOrCreate({
          where: { slug: slug, parentId: bmw.id },
          defaults: {
            name: modelName,
            slug: slug,
            parentId: bmw.id,
            level: 3,
            categoryType: 'bike_model',
            isVisibleInMenu: true,
            sortOrder: i + 1
          }
        });
      }
    }
    
    // BENELLI - ALL models from website
    const benelli = await Category.findOne({ where: { slug: 'benelli' } });
    if (benelli) {
      const benelliModels = ['TRK 251', 'TRK 502 X', 'TNT 300', 'IMPERIALE 400'];
      
      for (let i = 0; i < benelliModels.length; i++) {
        const modelName = benelliModels[i];
        const slug = modelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        await Category.findOrCreate({
          where: { slug: slug, parentId: benelli.id },
          defaults: {
            name: modelName,
            slug: slug,
            parentId: benelli.id,
            level: 3,
            categoryType: 'bike_model',
            isVisibleInMenu: true,
            sortOrder: i + 1
          }
        });
      }
    }
    
    // JAWA - YEZDI - ALL models from website
    const jawa = await Category.findOne({ where: { slug: 'jawa-yezdi' } });
    if (jawa) {
      const jawaModels = [
        'JAWA 42', 'BOBBER 42', 'YEZDI ADVENTURE', 'YEZDI ROADSTER',
        'YEZDI SCRAMBLER', 'YEZDI ADVENTURE 2025'
      ];
      
      for (let i = 0; i < jawaModels.length; i++) {
        const modelName = jawaModels[i];
        const slug = modelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        await Category.findOrCreate({
          where: { slug: slug, parentId: jawa.id },
          defaults: {
            name: modelName,
            slug: slug,
            parentId: jawa.id,
            level: 3,
            categoryType: 'bike_model',
            isVisibleInMenu: true,
            sortOrder: i + 1
          }
        });
      }
    }
    
    // TRIUMPH - ALL models from website
    const triumph = await Category.findOne({ where: { slug: 'triumph' } });
    if (triumph) {
      const triumphModels = ['SPEED 400', 'TIGER SPORT 660'];
      
      for (let i = 0; i < triumphModels.length; i++) {
        const modelName = triumphModels[i];
        const slug = modelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        await Category.findOrCreate({
          where: { slug: slug, parentId: triumph.id },
          defaults: {
            name: modelName,
            slug: slug,
            parentId: triumph.id,
            level: 3,
            categoryType: 'bike_model',
            isVisibleInMenu: true,
            sortOrder: i + 1
          }
        });
      }
    }
    
    // HERO - ALL models from website
    const hero = await Category.findOne({ where: { slug: 'hero' } });
    if (hero) {
      const heroModels = ['XPULSE 200', 'XTREME 125 R', 'XPULSE 210', 'XTREME 250R'];
      
      for (let i = 0; i < heroModels.length; i++) {
        const modelName = heroModels[i];
        const slug = modelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        await Category.findOrCreate({
          where: { slug: slug, parentId: hero.id },
          defaults: {
            name: modelName,
            slug: slug,
            parentId: hero.id,
            level: 3,
            categoryType: 'bike_model',
            isVisibleInMenu: true,
            sortOrder: i + 1
          }
        });
      }
    }
    
    // HARLEY DAVIDSON - ALL models from website
    const harley = await Category.findOne({ where: { slug: 'harley-davidson' } });
    if (harley) {
      const harleyModels = ['X 440', 'STREET 750'];
      
      for (let i = 0; i < harleyModels.length; i++) {
        const modelName = harleyModels[i];
        const slug = modelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        await Category.findOrCreate({
          where: { slug: slug, parentId: harley.id },
          defaults: {
            name: modelName,
            slug: slug,
            parentId: harley.id,
            level: 3,
            categoryType: 'bike_model',
            isVisibleInMenu: true,
            sortOrder: i + 1
          }
        });
      }
    }
    
    // DUCATI - ALL models from website
    const ducati = await Category.findOne({ where: { slug: 'ducati' } });
    if (ducati) {
      const ducatiModels = ['SCRAMBLER 800'];
      
      for (let i = 0; i < ducatiModels.length; i++) {
        const modelName = ducatiModels[i];
        const slug = modelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        await Category.findOrCreate({
          where: { slug: slug, parentId: ducati.id },
          defaults: {
            name: modelName,
            slug: slug,
            parentId: ducati.id,
            level: 3,
            categoryType: 'bike_model',
            isVisibleInMenu: true,
            sortOrder: i + 1
          }
        });
      }
    }
    
    // MAHINDRA - ALL models from website
    const mahindra = await Category.findOne({ where: { slug: 'mahindra' } });
    if (mahindra) {
      const mahindraModels = ['MOJO BS3'];
      
      for (let i = 0; i < mahindraModels.length; i++) {
        const modelName = mahindraModels[i];
        const slug = modelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        await Category.findOrCreate({
          where: { slug: slug, parentId: mahindra.id },
          defaults: {
            name: modelName,
            slug: slug,
            parentId: mahindra.id,
            level: 3,
            categoryType: 'bike_model',
            isVisibleInMenu: true,
            sortOrder: i + 1
          }
        });
      }
    }
    
    // Add ALL Scooter models
    console.log('🛵 Adding ALL scooter models...');
    if (scooters) {
      const scooterModels = [
        'AEROX 155', 'RAY ZR', 'NTORQ', 'JUPITER 125 BS4', 'JUPITER 110 BS6',
        'JUPITER 125 BS6', 'ACCESS 125', 'BURGMAN', 'AVENIS 125', 'DIO BS6', 'DIO BS4'
      ];
      
      for (let i = 0; i < scooterModels.length; i++) {
        const modelName = scooterModels[i];
        const slug = modelName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        await Category.findOrCreate({
          where: { slug: slug, parentId: scooters.id },
          defaults: {
            name: modelName,
            slug: slug,
            parentId: scooters.id,
            level: 2,
            categoryType: 'scooter_model',
            isVisibleInMenu: true,
            sortOrder: i + 1
          }
        });
      }
    }
    
    // Add ALL EV Bike models
    console.log('🔋 Adding ALL EV bike models...');
    if (evBikes) {
      // VIDA
      const vida = await Category.findOrCreate({
        where: { slug: 'vida', parentId: evBikes.id },
        defaults: {
          name: 'VIDA',
          slug: 'vida',
          parentId: evBikes.id,
          level: 2,
          categoryType: 'ev_brand',
          isVisibleInMenu: true,
          sortOrder: 1
        }
      });
      
      await Category.findOrCreate({
        where: { slug: 'vida-vx-2', parentId: vida[0].id },
        defaults: {
          name: 'VIDA VX 2',
          slug: 'vida-vx-2',
          parentId: vida[0].id,
          level: 3,
          categoryType: 'ev_model',
          isVisibleInMenu: true,
          sortOrder: 1
        }
      });
      
      // OLA
      const ola = await Category.findOrCreate({
        where: { slug: 'ola', parentId: evBikes.id },
        defaults: {
          name: 'OLA',
          slug: 'ola',
          parentId: evBikes.id,
          level: 2,
          categoryType: 'ev_brand',
          isVisibleInMenu: true,
          sortOrder: 2
        }
      });
      
      await Category.findOrCreate({
        where: { slug: 'ola-s1', parentId: ola[0].id },
        defaults: {
          name: 'OLA S1',
          slug: 'ola-s1',
          parentId: ola[0].id,
          level: 3,
          categoryType: 'ev_model',
          isVisibleInMenu: true,
          sortOrder: 1
        }
      });
      
      // ATHER
      const ather = await Category.findOrCreate({
        where: { slug: 'ather', parentId: evBikes.id },
        defaults: {
          name: 'ATHER',
          slug: 'ather',
          parentId: evBikes.id,
          level: 2,
          categoryType: 'ev_brand',
          isVisibleInMenu: true,
          sortOrder: 3
        }
      });
      
      await Category.findOrCreate({
        where: { slug: 'ather-450-x', parentId: ather[0].id },
        defaults: {
          name: 'ATHER 450 X',
          slug: 'ather-450-x',
          parentId: ather[0].id,
          level: 3,
          categoryType: 'ev_model',
          isVisibleInMenu: true,
          sortOrder: 1
        }
      });
    }
    
    // Add ALL Accessory subcategories
    console.log('🛠️ Adding ALL accessory subcategories...');
    
    // TOURING ACCESSORIES - ALL subcategories
    const touringAccessories = await Category.findOne({ where: { slug: 'touring-accessories' } });
    if (touringAccessories) {
      const touringSubcategories = [
        'BACK REST', 'TOPRACK SADDLE STAY', 'TOP RACK', 'LUGGAGE CARRIER', 'TOP PLATE',
        'SADDLE STAY', 'FOG LIGHT CLAMP', 'GPS MOUNT'
      ];
      
      for (let i = 0; i < touringSubcategories.length; i++) {
        const subcategoryName = touringSubcategories[i];
        const slug = subcategoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        await Category.findOrCreate({
          where: { slug: slug, parentId: touringAccessories.id },
          defaults: {
            name: subcategoryName,
            slug: slug,
            parentId: touringAccessories.id,
            level: 3,
            categoryType: 'product_group',
            isVisibleInMenu: true,
            sortOrder: i + 1
          }
        });
      }
    }
    
    // PROTECTION ACCESSORIES - ALL subcategories
    const protectionAccessories = await Category.findOne({ where: { slug: 'protection-accessories' } });
    if (protectionAccessories) {
      const protectionSubcategories = [
        'CRASH GUARD', 'FRAME SLIDER', 'SUMP GUARD', 'RADIATOR GUARD', 'HEAD LIGHT GRILL',
        'CHAIN PROTECTOR', 'SILENCER GUARD'
      ];
      
      for (let i = 0; i < protectionSubcategories.length; i++) {
        const subcategoryName = protectionSubcategories[i];
        const slug = subcategoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        await Category.findOrCreate({
          where: { slug: slug, parentId: protectionAccessories.id },
          defaults: {
            name: subcategoryName,
            slug: slug,
            parentId: protectionAccessories.id,
            level: 3,
            categoryType: 'product_group',
            isVisibleInMenu: true,
            sortOrder: i + 1
          }
        });
      }
    }
    
    // PERFORMANCE ACCESSORIES - ALL subcategories
    const performanceAccessories = await Category.findOne({ where: { slug: 'performance-accessories' } });
    if (performanceAccessories) {
      const performanceSubcategories = [
        'EXHAUST BEND PIPE', 'SILENCER - SILVER', 'SILENCER - BLACK'
      ];
      
      for (let i = 0; i < performanceSubcategories.length; i++) {
        const subcategoryName = performanceSubcategories[i];
        const slug = subcategoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        await Category.findOrCreate({
          where: { slug: slug, parentId: performanceAccessories.id },
          defaults: {
            name: subcategoryName,
            slug: slug,
            parentId: performanceAccessories.id,
            level: 3,
            categoryType: 'product_group',
            isVisibleInMenu: true,
            sortOrder: i + 1
          }
        });
      }
    }
    
    // AUXILLARY ACCESSORIES - ALL subcategories
    const auxillaryAccessories = await Category.findOne({ where: { slug: 'auxillary-accessories' } });
    if (auxillaryAccessories) {
      const auxillarySubcategories = [
        'FOOT REST', 'MASTER CYLINDER CAP', 'PADDOCK STAND', 'HANDLE BAR', 'VISOR',
        'SIDE STAND BASE', 'TAIL TIDY'
      ];
      
      for (let i = 0; i < auxillarySubcategories.length; i++) {
        const subcategoryName = auxillarySubcategories[i];
        const slug = subcategoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        await Category.findOrCreate({
          where: { slug: slug, parentId: auxillaryAccessories.id },
          defaults: {
            name: subcategoryName,
            slug: slug,
            parentId: auxillaryAccessories.id,
            level: 3,
            categoryType: 'product_group',
            isVisibleInMenu: true,
            sortOrder: i + 1
          }
        });
      }
    }
    
    // BOXES AND PANNIERS - ALL subcategories
    const boxesAndPanniers = await Category.findOne({ where: { slug: 'boxes-and-panniers' } });
    if (boxesAndPanniers) {
      const boxesSubcategories = [
        'SIDE METAL BOX'
      ];
      
      for (let i = 0; i < boxesSubcategories.length; i++) {
        const subcategoryName = boxesSubcategories[i];
        const slug = subcategoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        await Category.findOrCreate({
          where: { slug: slug, parentId: boxesAndPanniers.id },
          defaults: {
            name: subcategoryName,
            slug: slug,
            parentId: boxesAndPanniers.id,
            level: 3,
            categoryType: 'product_group',
            isVisibleInMenu: true,
            sortOrder: i + 1
          }
        });
      }
    }
    
    // Count final categories
    const totalCategories = await Category.count();
    const activeCategories = await Category.count({ where: { isActive: true, isVisibleInMenu: true } });
    
    console.log('\n🎉 ALL HT Exhaust categories added successfully!');
    console.log(`📊 Total categories: ${totalCategories}`);
    console.log(`📊 Active categories: ${activeCategories}`);
    
    if (totalCategories >= 200) {
      console.log('✅ SUCCESS: You now have 200+ categories matching the HT Exhaust website!');
    } else {
      console.log(`⚠️  You have ${totalCategories} categories. Still need ${200 - totalCategories} more to reach 200+.`);
    }
    
    console.log('✅ Your API should now return the complete HT Exhaust category structure!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding all categories:', error);
    process.exit(1);
  }
};

addAllMissingCategories();
