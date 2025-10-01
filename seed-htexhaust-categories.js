import { Category, sequelize } from './src/models/index.js';
import { testConnection } from './src/config/database.js';

/**
 * Complete HT Exhaust Category Structure Seed
 * Based on: https://www.htexhaust.com/
 * 
 * Structure:
 * - Level 1: Main Menu Items
 * - Level 2: Brands / Accessory Types
 * - Level 3: Models / Specific Accessories
 */

const htExhaustCategories = [
  // ============================================================================
  // LEVEL 1: MAIN MENU ITEMS
  // ============================================================================
  {
    name: 'Shop by Bike',
    slug: 'shop-by-bike',
    description: 'Browse motorcycle accessories by your bike brand and model',
    level: 1,
    categoryType: 'main_menu',
    isVisibleInMenu: true,
    isActive: true,
    sortOrder: 1,
    parentId: null,
    children: [
      // ========================================================================
      // YAMAHA
      // ========================================================================
      {
        name: 'YAMAHA',
        slug: 'yamaha',
        level: 2,
        categoryType: 'bike_brand',
        sortOrder: 1,
        children: [
          { name: 'AEROX 155', slug: 'aerox-155', level: 3, categoryType: 'bike_model', sortOrder: 1 },
          { name: 'MT 15', slug: 'mt-15', level: 3, categoryType: 'bike_model', sortOrder: 2 },
          { name: 'R15 V4 / M', slug: 'r15-v4-m', level: 3, categoryType: 'bike_model', sortOrder: 3 },
          { name: 'R15 V3', slug: 'r15-v3', level: 3, categoryType: 'bike_model', sortOrder: 4 },
          { name: 'R3 - BS4', slug: 'r3-bs4', level: 3, categoryType: 'bike_model', sortOrder: 5 },
          { name: 'FZ V2.0', slug: 'fz-v2-0', level: 3, categoryType: 'bike_model', sortOrder: 6 },
          { name: 'FZ V3.0', slug: 'fz-v3-0', level: 3, categoryType: 'bike_model', sortOrder: 7 },
          { name: 'FZ V4.0', slug: 'fz-v4-0', level: 3, categoryType: 'bike_model', sortOrder: 8 },
          { name: 'FZ 25', slug: 'fz-25', level: 3, categoryType: 'bike_model', sortOrder: 9 },
          { name: 'FZ X', slug: 'fz-x', level: 3, categoryType: 'bike_model', sortOrder: 10 },
          { name: 'MT 03', slug: 'mt-03', level: 3, categoryType: 'bike_model', sortOrder: 11 },
          { name: 'R15 V1', slug: 'r15-v1', level: 3, categoryType: 'bike_model', sortOrder: 12 },
          { name: 'CRUX', slug: 'crux', level: 3, categoryType: 'bike_model', sortOrder: 13 },
          { name: 'RAY ZR', slug: 'ray-zr', level: 3, categoryType: 'bike_model', sortOrder: 14 },
          { name: 'FASCINO 125', slug: 'fascino-125', level: 3, categoryType: 'bike_model', sortOrder: 15 }
        ]
      },
      // ========================================================================
      // ROYAL ENFIELD
      // ========================================================================
      {
        name: 'ROYAL ENFIELD',
        slug: 'royal-enfield',
        level: 2,
        categoryType: 'bike_brand',
        sortOrder: 2,
        children: [
          { name: 'Super Meteor 650', slug: 'super-meteor-650', level: 3, categoryType: 'bike_model', sortOrder: 1 },
          { name: 'Himalayan 450', slug: 'himalayan-450', level: 3, categoryType: 'bike_model', sortOrder: 2 },
          { name: 'HIMALAYAN 411', slug: 'himalayan-411', level: 3, categoryType: 'bike_model', sortOrder: 3 },
          { name: 'GUERRILLA 450', slug: 'guerrilla-450', level: 3, categoryType: 'bike_model', sortOrder: 4 },
          { name: 'SCRAM 411', slug: 'scram-411', level: 3, categoryType: 'bike_model', sortOrder: 5 },
          { name: 'HUNTER 350', slug: 'hunter-350', level: 3, categoryType: 'bike_model', sortOrder: 6 },
          { name: 'METEOR 350', slug: 'meteor-350', level: 3, categoryType: 'bike_model', sortOrder: 7 },
          { name: 'CLASSIC 350 UPTO 2021', slug: 'classic-350-upto-2021', level: 3, categoryType: 'bike_model', sortOrder: 8 },
          { name: 'REBORN CLASSIC 350', slug: 'reborn-classic-350', level: 3, categoryType: 'bike_model', sortOrder: 9 },
          { name: 'THUNDERBIRD X', slug: 'thunderbird-x', level: 3, categoryType: 'bike_model', sortOrder: 10 },
          { name: 'THUNDERBIRD 350', slug: 'thunderbird-350', level: 3, categoryType: 'bike_model', sortOrder: 11 },
          { name: 'BULLET 350', slug: 'bullet-350', level: 3, categoryType: 'bike_model', sortOrder: 12 },
          { name: 'ELECTRA 350', slug: 'electra-350', level: 3, categoryType: 'bike_model', sortOrder: 13 },
          { name: 'INTERCEPTOR/GT 650', slug: 'interceptor-gt-650', level: 3, categoryType: 'bike_model', sortOrder: 14 }
        ]
      },
      // ========================================================================
      // BAJAJ
      // ========================================================================
      {
        name: 'BAJAJ',
        slug: 'bajaj',
        level: 2,
        categoryType: 'bike_brand',
        sortOrder: 3,
        children: [
          { name: 'NS 125', slug: 'ns-125', level: 3, categoryType: 'bike_model', sortOrder: 1 },
          { name: 'NS 160', slug: 'ns-160', level: 3, categoryType: 'bike_model', sortOrder: 2 },
          { name: 'NS 200', slug: 'ns-200', level: 3, categoryType: 'bike_model', sortOrder: 3 },
          { name: 'NS 400 Z', slug: 'ns-400-z', level: 3, categoryType: 'bike_model', sortOrder: 4 },
          { name: 'RS 200', slug: 'rs-200', level: 3, categoryType: 'bike_model', sortOrder: 5 },
          { name: 'DOMINAR 250', slug: 'dominar-250', level: 3, categoryType: 'bike_model', sortOrder: 6 },
          { name: 'DOMINAR 400', slug: 'dominar-400', level: 3, categoryType: 'bike_model', sortOrder: 7 },
          { name: 'AVENGER STREET', slug: 'avenger-street', level: 3, categoryType: 'bike_model', sortOrder: 8 },
          { name: 'PULSAR N 150', slug: 'pulsar-n-150', level: 3, categoryType: 'bike_model', sortOrder: 9 },
          { name: 'PULSAR N 160', slug: 'pulsar-n-160', level: 3, categoryType: 'bike_model', sortOrder: 10 },
          { name: 'PULSAR N 250', slug: 'pulsar-n-250', level: 3, categoryType: 'bike_model', sortOrder: 11 },
          { name: 'PULSAR 150', slug: 'pulsar-150', level: 3, categoryType: 'bike_model', sortOrder: 12 },
          { name: 'PULSAR 180', slug: 'pulsar-180', level: 3, categoryType: 'bike_model', sortOrder: 13 },
          { name: 'PULSAR 220 F', slug: 'pulsar-220-f', level: 3, categoryType: 'bike_model', sortOrder: 14 }
        ]
      },
      // ========================================================================
      // HONDA
      // ========================================================================
      {
        name: 'HONDA',
        slug: 'honda',
        level: 2,
        categoryType: 'bike_brand',
        sortOrder: 4,
        children: [
          { name: 'HNESS CB 350', slug: 'hness-cb-350', level: 3, categoryType: 'bike_model', sortOrder: 1 },
          { name: 'CB 350 2024', slug: 'cb-350-2024', level: 3, categoryType: 'bike_model', sortOrder: 2 },
          { name: 'RS CB 350', slug: 'rs-cb-350', level: 3, categoryType: 'bike_model', sortOrder: 3 },
          { name: 'CB 200 X', slug: 'cb-200-x', level: 3, categoryType: 'bike_model', sortOrder: 4 },
          { name: 'CB 300 F', slug: 'cb-300-f', level: 3, categoryType: 'bike_model', sortOrder: 5 },
          { name: 'CB 300 R', slug: 'cb-300-r', level: 3, categoryType: 'bike_model', sortOrder: 6 },
          { name: 'CBR 250 R', slug: 'cbr-250-r', level: 3, categoryType: 'bike_model', sortOrder: 7 },
          { name: 'HORNET 2.0', slug: 'hornet-2-0', level: 3, categoryType: 'bike_model', sortOrder: 8 },
          { name: 'SHINE BS6', slug: 'shine-bs6', level: 3, categoryType: 'bike_model', sortOrder: 9 },
          { name: 'CB UNICORN', slug: 'cb-unicorn', level: 3, categoryType: 'bike_model', sortOrder: 10 },
          { name: 'UNICORN BS6', slug: 'unicorn-bs6', level: 3, categoryType: 'bike_model', sortOrder: 11 },
          { name: 'X BLADE', slug: 'x-blade', level: 3, categoryType: 'bike_model', sortOrder: 12 },
          { name: 'DIO BS4', slug: 'dio-bs4', level: 3, categoryType: 'bike_model', sortOrder: 13 },
          { name: 'DIO BS6', slug: 'dio-bs6', level: 3, categoryType: 'bike_model', sortOrder: 14 },
          { name: 'TRANSALP 750', slug: 'transalp-750', level: 3, categoryType: 'bike_model', sortOrder: 15 }
        ]
      },
      // ========================================================================
      // TVS
      // ========================================================================
      {
        name: 'TVS',
        slug: 'tvs',
        level: 2,
        categoryType: 'bike_brand',
        sortOrder: 5,
        children: [
          { name: 'APACHE RR 310', slug: 'apache-rr-310', level: 3, categoryType: 'bike_model', sortOrder: 1 },
          { name: 'APACHE RTR 310', slug: 'apache-rtr-310', level: 3, categoryType: 'bike_model', sortOrder: 2 },
          { name: 'APACHE 160 2V', slug: 'apache-160-2v', level: 3, categoryType: 'bike_model', sortOrder: 3 },
          { name: 'APACHE 180 2V', slug: 'apache-180-2v', level: 3, categoryType: 'bike_model', sortOrder: 4 },
          { name: 'APACHE 160 4V', slug: 'apache-160-4v', level: 3, categoryType: 'bike_model', sortOrder: 5 },
          { name: 'APACHE 200 4V', slug: 'apache-200-4v', level: 3, categoryType: 'bike_model', sortOrder: 6 },
          { name: 'RONIN 225', slug: 'ronin-225', level: 3, categoryType: 'bike_model', sortOrder: 7 },
          { name: 'RAIDER 125', slug: 'raider-125', level: 3, categoryType: 'bike_model', sortOrder: 8 },
          { name: 'NTORQ', slug: 'ntorq', level: 3, categoryType: 'bike_model', sortOrder: 9 },
          { name: 'JUPITER 125 BS4', slug: 'jupiter-125-bs4', level: 3, categoryType: 'bike_model', sortOrder: 10 },
          { name: 'JUPITER 110 BS6', slug: 'jupiter-110-bs6', level: 3, categoryType: 'bike_model', sortOrder: 11 },
          { name: 'JUPITER 125 BS6', slug: 'jupiter-125-bs6', level: 3, categoryType: 'bike_model', sortOrder: 12 }
        ]
      },
      // ========================================================================
      // KTM
      // ========================================================================
      {
        name: 'KTM',
        slug: 'ktm',
        level: 2,
        categoryType: 'bike_brand',
        sortOrder: 6,
        children: [
          { name: 'ADVENTURE 250', slug: 'adventure-250', level: 3, categoryType: 'bike_model', sortOrder: 1 },
          { name: 'ADVENTURE 390', slug: 'adventure-390', level: 3, categoryType: 'bike_model', sortOrder: 2 },
          { name: 'DUKE 200 BS6', slug: 'duke-200-bs6', level: 3, categoryType: 'bike_model', sortOrder: 3 },
          { name: 'DUKE 250/390 BS6', slug: 'duke-250-390-bs6', level: 3, categoryType: 'bike_model', sortOrder: 4 },
          { name: 'DUKE 200 OLD', slug: 'duke-200-old', level: 3, categoryType: 'bike_model', sortOrder: 5 },
          { name: 'DUKE 250 GEN 3', slug: 'duke-250-gen-3', level: 3, categoryType: 'bike_model', sortOrder: 6 },
          { name: 'DUKE 390 GEN 3', slug: 'duke-390-gen-3', level: 3, categoryType: 'bike_model', sortOrder: 7 },
          { name: 'KTM RC 200 - 2022', slug: 'ktm-rc-200-2022', level: 3, categoryType: 'bike_model', sortOrder: 8 },
          { name: 'KTM RC 200 BS6', slug: 'ktm-rc-200-bs6', level: 3, categoryType: 'bike_model', sortOrder: 9 },
          { name: 'KTM RC 390 BS6', slug: 'ktm-rc-390-bs6', level: 3, categoryType: 'bike_model', sortOrder: 10 }
        ]
      },
      // ========================================================================
      // SUZUKI
      // ========================================================================
      {
        name: 'SUZUKI',
        slug: 'suzuki',
        level: 2,
        categoryType: 'bike_brand',
        sortOrder: 7,
        children: [
          { name: 'V STROM 250', slug: 'v-strom-250', level: 3, categoryType: 'bike_model', sortOrder: 1 },
          { name: 'V STROM 650', slug: 'v-strom-650', level: 3, categoryType: 'bike_model', sortOrder: 2 },
          { name: 'GIXXER 150 SF', slug: 'gixxer-150-sf', level: 3, categoryType: 'bike_model', sortOrder: 3 },
          { name: 'GIXXER 250 SF', slug: 'gixxer-250-sf', level: 3, categoryType: 'bike_model', sortOrder: 4 },
          { name: 'GIXXER NAKED 150cc BS3', slug: 'gixxer-naked-150cc-bs3', level: 3, categoryType: 'bike_model', sortOrder: 5 },
          { name: 'GIXXER NAKED 150cc BS6', slug: 'gixxer-naked-150cc-bs6', level: 3, categoryType: 'bike_model', sortOrder: 6 },
          { name: 'GIXXER NAKED 250', slug: 'gixxer-naked-250', level: 3, categoryType: 'bike_model', sortOrder: 7 },
          { name: 'ACCESS 125', slug: 'access-125', level: 3, categoryType: 'bike_model', sortOrder: 8 },
          { name: 'BURGMAN', slug: 'burgman', level: 3, categoryType: 'bike_model', sortOrder: 9 },
          { name: 'AVENIS 125', slug: 'avenis-125', level: 3, categoryType: 'bike_model', sortOrder: 10 }
        ]
      },
      // ========================================================================
      // KAWASAKI
      // ========================================================================
      {
        name: 'KAWASAKI',
        slug: 'kawasaki',
        level: 2,
        categoryType: 'bike_brand',
        sortOrder: 8,
        children: [
          { name: 'Z 900 - 2020', slug: 'z-900-2020', level: 3, categoryType: 'bike_model', sortOrder: 1 },
          { name: 'ZX 10 R', slug: 'zx-10-r', level: 3, categoryType: 'bike_model', sortOrder: 2 },
          { name: 'NINJA 1000 SX', slug: 'ninja-1000-sx', level: 3, categoryType: 'bike_model', sortOrder: 3 },
          { name: 'VERSYS 650', slug: 'versys-650', level: 3, categoryType: 'bike_model', sortOrder: 4 },
          { name: 'VERSYS 1000', slug: 'versys-1000', level: 3, categoryType: 'bike_model', sortOrder: 5 },
          { name: 'NINJA 250', slug: 'ninja-250', level: 3, categoryType: 'bike_model', sortOrder: 6 },
          { name: 'NINJA 300', slug: 'ninja-300', level: 3, categoryType: 'bike_model', sortOrder: 7 },
          { name: 'KAWASAKI W175', slug: 'kawasaki-w175', level: 3, categoryType: 'bike_model', sortOrder: 8 },
          { name: 'ER - 6N', slug: 'er-6n', level: 3, categoryType: 'bike_model', sortOrder: 9 }
        ]
      },
      // ========================================================================
      // BMW
      // ========================================================================
      {
        name: 'BMW',
        slug: 'bmw',
        level: 2,
        categoryType: 'bike_brand',
        sortOrder: 9,
        children: [
          { name: 'BMW G 310 GS', slug: 'bmw-g-310-gs', level: 3, categoryType: 'bike_model', sortOrder: 1 },
          { name: 'BMW G 310 R', slug: 'bmw-g-310-r', level: 3, categoryType: 'bike_model', sortOrder: 2 },
          { name: 'BMW G 310 RR', slug: 'bmw-g-310-rr', level: 3, categoryType: 'bike_model', sortOrder: 3 }
        ]
      },
      // ========================================================================
      // BENELLI
      // ========================================================================
      {
        name: 'BENELLI',
        slug: 'benelli',
        level: 2,
        categoryType: 'bike_brand',
        sortOrder: 10,
        children: [
          { name: 'TRK 251', slug: 'trk-251', level: 3, categoryType: 'bike_model', sortOrder: 1 },
          { name: 'TRK 502 X', slug: 'trk-502-x', level: 3, categoryType: 'bike_model', sortOrder: 2 },
          { name: 'TNT 300', slug: 'tnt-300', level: 3, categoryType: 'bike_model', sortOrder: 3 },
          { name: 'IMPERIALE 400', slug: 'imperiale-400', level: 3, categoryType: 'bike_model', sortOrder: 4 }
        ]
      },
      // ========================================================================
      // JAWA - YEZDI
      // ========================================================================
      {
        name: 'JAWA - YEZDI',
        slug: 'jawa-yezdi',
        level: 2,
        categoryType: 'bike_brand',
        sortOrder: 11,
        children: [
          { name: 'JAWA 42', slug: 'jawa-42', level: 3, categoryType: 'bike_model', sortOrder: 1 },
          { name: 'BOBBER 42', slug: 'bobber-42', level: 3, categoryType: 'bike_model', sortOrder: 2 },
          { name: 'YEZDI ADVENTURE', slug: 'yezdi-adventure', level: 3, categoryType: 'bike_model', sortOrder: 3 },
          { name: 'YEZDI ROADSTER', slug: 'yezdi-roadster', level: 3, categoryType: 'bike_model', sortOrder: 4 },
          { name: 'YEZDI SCRAMBLER', slug: 'yezdi-scrambler', level: 3, categoryType: 'bike_model', sortOrder: 5 },
          { name: 'YEZDI ADVENTURE 2025', slug: 'yezdi-adventure-2025', level: 3, categoryType: 'bike_model', sortOrder: 6 }
        ]
      },
      // ========================================================================
      // TRIUMPH
      // ========================================================================
      {
        name: 'TRIUMPH',
        slug: 'triumph',
        level: 2,
        categoryType: 'bike_brand',
        sortOrder: 12,
        children: [
          { name: 'SPEED 400', slug: 'speed-400', level: 3, categoryType: 'bike_model', sortOrder: 1 },
          { name: 'TIGER SPORT 660', slug: 'tiger-sport-660', level: 3, categoryType: 'bike_model', sortOrder: 2 }
        ]
      },
      // ========================================================================
      // HERO
      // ========================================================================
      {
        name: 'HERO',
        slug: 'hero',
        level: 2,
        categoryType: 'bike_brand',
        sortOrder: 13,
        children: [
          { name: 'XPULSE 200', slug: 'xpulse-200', level: 3, categoryType: 'bike_model', sortOrder: 1 },
          { name: 'XTREME 125 R', slug: 'xtreme-125-r', level: 3, categoryType: 'bike_model', sortOrder: 2 },
          { name: 'XPULSE 210', slug: 'xpulse-210', level: 3, categoryType: 'bike_model', sortOrder: 3 },
          { name: 'XTREME 250R', slug: 'xtreme-250r', level: 3, categoryType: 'bike_model', sortOrder: 4 }
        ]
      },
      // ========================================================================
      // HARLEY DAVIDSON
      // ========================================================================
      {
        name: 'HARLEY DAVIDSON',
        slug: 'harley-davidson',
        level: 2,
        categoryType: 'bike_brand',
        sortOrder: 14,
        children: [
          { name: 'X 440', slug: 'x-440', level: 3, categoryType: 'bike_model', sortOrder: 1 },
          { name: 'STREET 750', slug: 'street-750', level: 3, categoryType: 'bike_model', sortOrder: 2 }
        ]
      },
      // ========================================================================
      // DUCATI
      // ========================================================================
      {
        name: 'DUCATI',
        slug: 'ducati',
        level: 2,
        categoryType: 'bike_brand',
        sortOrder: 15,
        children: [
          { name: 'SCRAMBLER 800', slug: 'scrambler-800', level: 3, categoryType: 'bike_model', sortOrder: 1 }
        ]
      },
      // ========================================================================
      // MAHINDRA
      // ========================================================================
      {
        name: 'MAHINDRA',
        slug: 'mahindra',
        level: 2,
        categoryType: 'bike_brand',
        sortOrder: 16,
        children: [
          { name: 'MOJO BS3', slug: 'mojo-bs3', level: 3, categoryType: 'bike_model', sortOrder: 1 }
        ]
      },
      // ========================================================================
      // OLA
      // ========================================================================
      {
        name: 'OLA',
        slug: 'ola',
        level: 2,
        categoryType: 'bike_brand',
        sortOrder: 17,
        children: [
          { name: 'OLA S1 GEN 2', slug: 'ola-s1-gen-2', level: 3, categoryType: 'bike_model', sortOrder: 1 }
        ]
      },
      // ========================================================================
      // ATHER
      // ========================================================================
      {
        name: 'ATHER',
        slug: 'ather',
        level: 2,
        categoryType: 'bike_brand',
        sortOrder: 18,
        children: [
          { name: 'ATHER 450 X', slug: 'ather-450-x', level: 3, categoryType: 'bike_model', sortOrder: 1 }
        ]
      },
      // ========================================================================
      // VIDA
      // ========================================================================
      {
        name: 'VIDA',
        slug: 'vida',
        level: 2,
        categoryType: 'bike_brand',
        sortOrder: 19,
        children: [
          { name: 'VIDA VX 2', slug: 'vida-vx-2', level: 3, categoryType: 'bike_model', sortOrder: 1 }
        ]
      }
    ]
  },
  
  // ============================================================================
  // LEVEL 1: SHOP BY ACCESSORIES
  // ============================================================================
  {
    name: 'Shop by Accessories',
    slug: 'shop-by-accessories',
    description: 'Browse accessories by type and category',
    level: 1,
    categoryType: 'main_menu',
    isVisibleInMenu: true,
    isActive: true,
    sortOrder: 2,
    parentId: null,
    children: [
      // ========================================================================
      // TOURING ACCESSORIES
      // ========================================================================
      {
        name: 'TOURING ACCESSORIES',
        slug: 'touring-accessories',
        level: 2,
        categoryType: 'accessory_type',
        sortOrder: 1,
        children: [
          { name: 'BACK REST', slug: 'back-rest', level: 3, categoryType: 'product_group', sortOrder: 1 },
          { name: 'TOPRACK SADDLE STAY', slug: 'toprack-saddle-stay', level: 3, categoryType: 'product_group', sortOrder: 2 },
          { name: 'TOP RACK', slug: 'top-rack', level: 3, categoryType: 'product_group', sortOrder: 3 },
          { name: 'LUGGAGE CARRIER', slug: 'luggage-carrier', level: 3, categoryType: 'product_group', sortOrder: 4 },
          { name: 'TOP PLATE', slug: 'top-plate', level: 3, categoryType: 'product_group', sortOrder: 5 },
          { name: 'SADDLE STAY', slug: 'saddle-stay', level: 3, categoryType: 'product_group', sortOrder: 6 },
          { name: 'FOG LIGHT CLAMP', slug: 'fog-light-clamp', level: 3, categoryType: 'product_group', sortOrder: 7 },
          { name: 'GPS MOUNT', slug: 'gps-mount', level: 3, categoryType: 'product_group', sortOrder: 8 }
        ]
      },
      // ========================================================================
      // PROTECTION ACCESSORIES
      // ========================================================================
      {
        name: 'PROTECTION ACCESSORIES',
        slug: 'protection-accessories',
        level: 2,
        categoryType: 'accessory_type',
        sortOrder: 2,
        children: [
          { name: 'CRASH GUARD', slug: 'crash-guard', level: 3, categoryType: 'product_group', sortOrder: 1 },
          { name: 'FRAME SLIDER', slug: 'frame-slider', level: 3, categoryType: 'product_group', sortOrder: 2 },
          { name: 'SUMP GUARD', slug: 'sump-guard', level: 3, categoryType: 'product_group', sortOrder: 3 },
          { name: 'RADIATOR GUARD', slug: 'radiator-guard', level: 3, categoryType: 'product_group', sortOrder: 4 },
          { name: 'HEAD LIGHT GRILL', slug: 'head-light-grill', level: 3, categoryType: 'product_group', sortOrder: 5 },
          { name: 'CHAIN PROTECTOR', slug: 'chain-protector', level: 3, categoryType: 'product_group', sortOrder: 6 },
          { name: 'SILENCER GUARD', slug: 'silencer-guard', level: 3, categoryType: 'product_group', sortOrder: 7 }
        ]
      },
      // ========================================================================
      // PERFORMANCE ACCESSORIES
      // ========================================================================
      {
        name: 'PERFORMANCE ACCESSORIES',
        slug: 'performance-accessories',
        level: 2,
        categoryType: 'accessory_type',
        sortOrder: 3,
        children: [
          { name: 'EXHAUST BEND PIPE', slug: 'exhaust-bend-pipe', level: 3, categoryType: 'product_group', sortOrder: 1 },
          { name: 'SILENCER - SILVER', slug: 'silencer-silver', level: 3, categoryType: 'product_group', sortOrder: 2 },
          { name: 'SILENCER - BLACK', slug: 'silencer-black', level: 3, categoryType: 'product_group', sortOrder: 3 }
        ]
      },
      // ========================================================================
      // AUXILIARY ACCESSORIES
      // ========================================================================
      {
        name: 'AUXILLARY ACCESSORIES',
        slug: 'auxillary-accessories',
        level: 2,
        categoryType: 'accessory_type',
        sortOrder: 4,
        children: [
          { name: 'FOOT REST', slug: 'foot-rest', level: 3, categoryType: 'product_group', sortOrder: 1 },
          { name: 'MASTER CYLINDER CAP', slug: 'master-cylinder-cap', level: 3, categoryType: 'product_group', sortOrder: 2 },
          { name: 'PADDOCK STAND', slug: 'paddock-stand', level: 3, categoryType: 'product_group', sortOrder: 3 },
          { name: 'HANDLE BAR', slug: 'handle-bar', level: 3, categoryType: 'product_group', sortOrder: 4 },
          { name: 'VISOR', slug: 'visor', level: 3, categoryType: 'product_group', sortOrder: 5 },
          { name: 'SIDE STAND BASE', slug: 'side-stand-base', level: 3, categoryType: 'product_group', sortOrder: 6 },
          { name: 'TAIL TIDY', slug: 'tail-tidy', level: 3, categoryType: 'product_group', sortOrder: 7 }
        ]
      },
      // ========================================================================
      // BOXES AND PANNIERS
      // ========================================================================
      {
        name: 'BOXES AND PANNIERS',
        slug: 'boxes-and-panniers',
        level: 2,
        categoryType: 'accessory_type',
        sortOrder: 5,
        children: [
          { name: 'SIDE METAL BOX', slug: 'side-metal-box', level: 3, categoryType: 'product_group', sortOrder: 1 }
        ]
      }
    ]
  },
  
  // ============================================================================
  // LEVEL 1: SCOOTERS
  // ============================================================================
  {
    name: 'Scooters',
    slug: 'scooters',
    description: 'Scooter accessories and parts',
    level: 1,
    categoryType: 'main_menu',
    isVisibleInMenu: true,
    isActive: true,
    sortOrder: 3,
    parentId: null,
    children: [
      { name: 'AEROX 155', slug: 'scooter-aerox-155', level: 2, categoryType: 'bike_model', sortOrder: 1 },
      { name: 'RAY ZR', slug: 'scooter-ray-zr', level: 2, categoryType: 'bike_model', sortOrder: 2 },
      { name: 'NTORQ', slug: 'scooter-ntorq', level: 2, categoryType: 'bike_model', sortOrder: 3 },
      { name: 'JUPITER 125 BS4', slug: 'scooter-jupiter-125-bs4', level: 2, categoryType: 'bike_model', sortOrder: 4 },
      { name: 'JUPITER 110 BS6', slug: 'scooter-jupiter-110-bs6', level: 2, categoryType: 'bike_model', sortOrder: 5 },
      { name: 'ACCESS 125', slug: 'scooter-access-125', level: 2, categoryType: 'bike_model', sortOrder: 6 },
      { name: 'BURGMAN', slug: 'scooter-burgman', level: 2, categoryType: 'bike_model', sortOrder: 7 },
      { name: 'AVENIS 125', slug: 'scooter-avenis-125', level: 2, categoryType: 'bike_model', sortOrder: 8 },
      { name: 'DIO BS6', slug: 'scooter-dio-bs6', level: 2, categoryType: 'bike_model', sortOrder: 9 },
      { name: 'DIO BS4', slug: 'scooter-dio-bs4', level: 2, categoryType: 'bike_model', sortOrder: 10 }
    ]
  },
  
  // ============================================================================
  // LEVEL 1: EV BIKES
  // ============================================================================
  {
    name: 'EV Bikes',
    slug: 'ev-bikes',
    description: 'Electric vehicle accessories and parts',
    level: 1,
    categoryType: 'main_menu',
    isVisibleInMenu: true,
    isActive: true,
    sortOrder: 4,
    parentId: null,
    children: [
      {
        name: 'VIDA',
        slug: 'ev-vida',
        level: 2,
        categoryType: 'bike_brand',
        sortOrder: 1,
        children: [
          { name: 'VIDA VX 2', slug: 'ev-vida-vx-2', level: 3, categoryType: 'bike_model', sortOrder: 1 }
        ]
      },
      {
        name: 'OLA',
        slug: 'ev-ola',
        level: 2,
        categoryType: 'bike_brand',
        sortOrder: 2,
        children: [
          { name: 'OLA S1', slug: 'ev-ola-s1', level: 3, categoryType: 'bike_model', sortOrder: 1 }
        ]
      },
      {
        name: 'ATHER',
        slug: 'ev-ather',
        level: 2,
        categoryType: 'bike_brand',
        sortOrder: 3,
        children: [
          { name: 'ATHER 450 X', slug: 'ev-ather-450-x', level: 3, categoryType: 'bike_model', sortOrder: 1 }
        ]
      }
    ]
  },
  
  // ============================================================================
  // LEVEL 1: COMBO
  // ============================================================================
  {
    name: 'Combo',
    slug: 'combo',
    description: 'Combo deals and bundles',
    level: 1,
    categoryType: 'main_menu',
    isVisibleInMenu: true,
    isActive: true,
    sortOrder: 5,
    parentId: null,
    children: []
  }
];

// Recursive function to insert categories
const insertCategoriesRecursively = async (categories, parentId = null) => {
  for (const categoryData of categories) {
    const { children, ...categoryFields } = categoryData;
    
    // Create the category
    const category = await Category.create({
      ...categoryFields,
      parentId
    });
    
    console.log(`✅ Created: ${categoryFields.name} (Level ${categoryFields.level})`);
    
    // Recursively insert children
    if (children && children.length > 0) {
      await insertCategoriesRecursively(children, category.id);
    }
  }
};

// Main seed function
const seedHTExhaustCategories = async () => {
  try {
    console.log('🌱 Starting HT Exhaust category seeding...\n');
    
    // Test database connection
    await testConnection();
    
    // Check if categories already exist
    const existingCount = await Category.count();
    
    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing categories.`);
      const readline = await import('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      // In non-interactive mode, skip deletion
      console.log('⚠️  Skipping deletion in non-interactive mode.');
      console.log('💡 To clear existing categories, run: npm run migrate then seed again\n');
    }
    
    console.log('📊 Inserting HT Exhaust category structure...\n');
    
    // Insert all categories
    await insertCategoriesRecursively(htExhaustCategories);
    
    // Get final count
    const [results] = await sequelize.query(`
      SELECT 
        level,
        COUNT(*) as count,
        string_agg(DISTINCT category_type, ', ') as types
      FROM categories
      GROUP BY level
      ORDER BY level;
    `);
    
    console.log('\n✅ Category seeding completed!\n');
    console.log('📊 Summary by Level:');
    console.table(results);
    
    const totalCount = await Category.count();
    console.log(`\n🎉 Total Categories: ${totalCount}`);
    console.log('\n💡 Next Steps:');
    console.log('  1. Test the category tree API: GET /api/v1/categories/tree');
    console.log('  2. Assign products to multiple categories');
    console.log('  3. Update frontend to use dynamic navigation\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run the seed
seedHTExhaustCategories();

