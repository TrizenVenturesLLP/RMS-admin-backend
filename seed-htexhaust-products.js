/**
 * HT EXHAUST PRODUCT SEEDING SCRIPT
 * ==================================
 * Seeds realistic product data based on htexhaust.com catalog
 * 
 * Product Categories Covered:
 * - Exhaust Systems (Performance, Touring, Stock Replacement)
 * - Crash Guards & Protection
 * - Touring Accessories
 * - Performance Parts
 * - Auxiliary Lights
 * 
 * Run: npm run seed:products
 */

import { sequelize } from './src/config/database.js';
import { Product, Category, Brand, ProductImage, ProductCategory, ProductAttribute, Tag } from './src/models/index.js';
import dotenv from 'dotenv';

dotenv.config();

// Helper to find category by name
const findCategoryByName = async (name) => {
  const category = await Category.findOne({ where: { name } });
  if (!category) {
    console.warn(`⚠️  Category not found: ${name}`);
  }
  return category;
};

// Helper to find or create brand
const findOrCreateBrand = async (brandData) => {
  const [brand] = await Brand.findOrCreate({
    where: { name: brandData.name },
    defaults: brandData
  });
  return brand;
};

// Helper to find or create tag
const findOrCreateTag = async (tagData) => {
  const [tag] = await Tag.findOrCreate({
    where: { name: tagData.name },
    defaults: tagData
  });
  return tag;
};

// PRODUCT DATA FROM HT EXHAUST
const htExhaustProducts = [
  // ========================================================================
  // YAMAHA AEROX 155 PRODUCTS
  // ========================================================================
  {
    name: 'HTEXHAUST Yamaha Aerox 155 Slip-On Exhaust',
    slug: 'htexhaust-yamaha-aerox-155-slip-on-exhaust',
    sku: 'HT-AEROX155-SLP-001',
    description: `Premium slip-on exhaust system designed specifically for Yamaha AEROX 155. Features high-quality stainless steel construction with powder-coated finish. Delivers improved performance, enhanced sound, and aggressive styling.

Key Features:
• Material: SS 304 Stainless Steel
• Finish: High-temperature black powder coating
• Easy bolt-on installation (no cutting required)
• Includes all mounting hardware and gaskets
• Improves throttle response and top-end power
• Deep, aggressive exhaust note
• Reduces weight compared to stock exhaust
• Corrosion-resistant construction

Performance Benefits:
• +5% increase in horsepower at high RPM
• Better exhaust gas flow
• Reduced back pressure
• Improved fuel efficiency

Installation:
• Installation time: 30-45 minutes
• Tools required: Basic hand tools
• Professional installation recommended for warranty

Warranty: 1 Year manufacturer warranty against defects`,
    shortDescription: 'Premium SS304 slip-on exhaust for Yamaha AEROX 155. Easy installation, improved performance, and aggressive sound.',
    price: 4999.00,
    comparePrice: 6499.00,
    costPrice: 3500.00,
    stockQuantity: 25,
    lowStockThreshold: 5,
    weight: 2.5,
    dimensions: { length: 450, width: 120, height: 120 },
    isActive: true,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    sortOrder: 1,
    
    // Enhanced fields
    vendorName: 'HITECH',
    manufacturer: 'htexhaust',
    productType: 'performance',
    accessoryCategory: 'exhaust',
    compatibleBikes: ['AEROX 155'],
    compatibleModels: ['Yamaha AEROX 155 (2020-2024)'],
    installationType: 'DIY',
    installationTimeMinutes: 45,
    warrantyPeriod: '1 Year',
    material: 'Stainless Steel SS304',
    color: 'Black',
    finish: 'Powder Coated',
    features: [
      'SS304 stainless steel construction',
      'High-temperature powder coating',
      'Bolt-on installation',
      'Includes all hardware',
      '+5% power increase',
      'Weight reduction',
      'Aggressive sound',
      '1 year warranty'
    ],
    specifications: {
      thread_size: 'M8',
      pipe_diameter: '51mm',
      length: '450mm',
      weight: '2.5kg',
      material_grade: 'SS304',
      heat_shield: 'Integrated',
      db_level: '95dB',
      certification: 'None'
    },
    
    // SEO
    metaTitle: 'Yamaha AEROX 155 Slip-On Exhaust | HTEXHAUST India',
    metaDescription: 'Premium slip-on exhaust for Yamaha AEROX 155. SS304 steel, easy installation, improved performance. Get 23% off. Free shipping!',
    
    // Categories
    categories: ['Exhaust Systems', 'Performance Parts', 'AEROX 155'],
    primaryCategory: 'Exhaust Systems',
    
    // Tags
    tags: ['bestseller', 'featured', 'aerox', 'yamaha', 'exhaust', 'performance', 'slip-on'],
    
    // Images
    images: [
      {
        url: 'https://placehold.co/800x800/1a1a1a/white?text=AEROX+Exhaust+Front',
        altText: 'HTEXHAUST Yamaha AEROX 155 Slip-On Exhaust - Front View',
        isPrimary: true,
        sortOrder: 1
      },
      {
        url: 'https://placehold.co/800x800/2a2a2a/white?text=AEROX+Exhaust+Side',
        altText: 'HTEXHAUST Yamaha AEROX 155 Slip-On Exhaust - Side View',
        isPrimary: false,
        sortOrder: 2
      },
      {
        url: 'https://placehold.co/800x800/3a3a3a/white?text=AEROX+Exhaust+Installed',
        altText: 'HTEXHAUST Yamaha AEROX 155 Slip-On Exhaust - Installed',
        isPrimary: false,
        sortOrder: 3
      },
      {
        url: 'https://placehold.co/800x800/4a4a4a/white?text=AEROX+Exhaust+Detail',
        altText: 'HTEXHAUST Yamaha AEROX 155 Slip-On Exhaust - Detail View',
        isPrimary: false,
        sortOrder: 4
      }
    ],
    
    // Attributes
    attributes: [
      { name: 'Material', value: 'SS304 Stainless Steel', group: 'Specifications', isFilterable: true },
      { name: 'Finish', value: 'Powder Coated', group: 'Specifications', isFilterable: true },
      { name: 'Color', value: 'Black', group: 'Specifications', isFilterable: true },
      { name: 'Bike Model', value: 'AEROX 155', group: 'Compatibility', isFilterable: true },
      { name: 'Bike Brand', value: 'Yamaha', group: 'Compatibility', isFilterable: true },
      { name: 'Installation', value: 'DIY', group: 'Installation', isFilterable: true },
      { name: 'Warranty', value: '1 Year', group: 'Warranty', isFilterable: false },
      { name: 'Pipe Diameter', value: '51mm', group: 'Specifications', isFilterable: false }
    ],
    
    brand: {
      name: 'HTEXHAUST',
      slug: 'htexhaust',
      description: 'Premium motorcycle exhaust and accessories manufacturer',
      brandType: 'accessory_brand',
      isFeatured: true,
      isActive: true
    }
  },

  {
    name: 'Yamaha Aerox 155 Crash Guard - Engine Protector',
    slug: 'yamaha-aerox-155-crash-guard-engine-protector',
    sku: 'HT-AEROX155-CG-001',
    description: `Heavy-duty crash guard designed specifically for Yamaha AEROX 155. Provides maximum protection to your scooter's engine and body panels in case of a fall or accident.

Key Features:
• Material: 20mm mild steel tubing
• Finish: High-quality powder coating
• Perfect fitment with OEM mounting points
• No modifications required
• Maximum ground clearance maintained
• Does not affect center stand operation
• Professional installation recommended

Protection Coverage:
• Engine casing protection
• Side panel protection
• Fairing protection
• Frame protection

Build Quality:
• 20mm thick tubing for maximum strength
• Reinforced welding at stress points
• Anti-corrosion powder coating
• UV-resistant finish
• Tested for impact resistance

Installation:
• Bolt-on installation
• Uses OEM mounting points
• Installation time: 60 minutes
• Includes all mounting hardware

Warranty: 1 Year against manufacturing defects`,
    shortDescription: 'Heavy-duty crash guard for Yamaha AEROX 155. 20mm steel tubing, perfect fit, maximum protection.',
    price: 2499.00,
    comparePrice: 3299.00,
    costPrice: 1800.00,
    stockQuantity: 18,
    lowStockThreshold: 5,
    weight: 3.8,
    dimensions: { length: 600, width: 450, height: 150 },
    isActive: true,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    sortOrder: 2,
    
    vendorName: 'HITECH',
    manufacturer: 'htexhaust',
    productType: 'protection',
    accessoryCategory: 'crash_guard',
    compatibleBikes: ['AEROX 155'],
    compatibleModels: ['Yamaha AEROX 155 (2020-2024)'],
    installationType: 'Professional Required',
    installationTimeMinutes: 60,
    warrantyPeriod: '1 Year',
    material: 'Mild Steel',
    color: 'Black',
    finish: 'Powder Coated',
    features: [
      '20mm mild steel tubing',
      'Perfect OEM fitment',
      'No modifications needed',
      'Maximum protection',
      'Maintains ground clearance',
      'Professional welding',
      '1 year warranty'
    ],
    specifications: {
      tube_diameter: '20mm',
      material_grade: 'Mild Steel',
      weight: '3.8kg',
      mounting_points: '4',
      ground_clearance: 'Maintained'
    },
    
    metaTitle: 'Yamaha AEROX 155 Crash Guard | Engine Protector | HTEXHAUST',
    metaDescription: 'Heavy-duty crash guard for Yamaha AEROX 155. 20mm steel, perfect fit, maximum protection. Get 24% off now!',
    
    categories: ['Crash Guards', 'Protection Accessories', 'AEROX 155'],
    primaryCategory: 'Crash Guards',
    
    tags: ['bestseller', 'featured', 'aerox', 'yamaha', 'crash-guard', 'protection'],
    
    images: [
      {
        url: 'https://placehold.co/800x800/1a1a1a/white?text=AEROX+Crash+Guard',
        altText: 'Yamaha AEROX 155 Crash Guard - Front View',
        isPrimary: true,
        sortOrder: 1
      },
      {
        url: 'https://placehold.co/800x800/2a2a2a/white?text=AEROX+CG+Side',
        altText: 'Yamaha AEROX 155 Crash Guard - Side View',
        isPrimary: false,
        sortOrder: 2
      },
      {
        url: 'https://placehold.co/800x800/3a3a3a/white?text=AEROX+CG+Installed',
        altText: 'Yamaha AEROX 155 Crash Guard - Installed',
        isPrimary: false,
        sortOrder: 3
      }
    ],
    
    attributes: [
      { name: 'Material', value: 'Mild Steel', group: 'Specifications', isFilterable: true },
      { name: 'Tube Diameter', value: '20mm', group: 'Specifications', isFilterable: true },
      { name: 'Finish', value: 'Powder Coated', group: 'Specifications', isFilterable: true },
      { name: 'Color', value: 'Black', group: 'Specifications', isFilterable: true },
      { name: 'Bike Model', value: 'AEROX 155', group: 'Compatibility', isFilterable: true },
      { name: 'Bike Brand', value: 'Yamaha', group: 'Compatibility', isFilterable: true },
      { name: 'Installation', value: 'Professional Required', group: 'Installation', isFilterable: true }
    ],
    
    brand: {
      name: 'HTEXHAUST',
      slug: 'htexhaust'
    }
  },

  // ========================================================================
  // YAMAHA RAY ZR PRODUCTS
  // ========================================================================
  {
    name: 'Yamaha Ray ZR Performance Exhaust System',
    slug: 'yamaha-ray-zr-performance-exhaust-system',
    sku: 'HT-RAYZR-EXH-001',
    description: `High-performance exhaust system for Yamaha Ray ZR. Designed to enhance power delivery and provide a sporty exhaust note while maintaining reliability.

Key Features:
• Material: SS304 stainless steel
• Finish: Chrome plated
• Direct bolt-on replacement
• Improved throttle response
• Enhanced fuel efficiency
• Sporty exhaust note
• Lightweight construction

Performance Benefits:
• Better low-end torque
• Improved mid-range power
• Smoother power delivery
• Reduced exhaust restriction

Build Quality:
• Premium SS304 construction
• Mirror-finish chrome plating
• TIG welded joints
• Heat-resistant silencer packing
• Corrosion-proof design

Installation:
• Direct replacement for stock exhaust
• Installation time: 30 minutes
• Basic tools required
• Includes mounting hardware

Warranty: 1 Year manufacturing warranty`,
    shortDescription: 'Performance exhaust for Yamaha Ray ZR. SS304 steel, chrome finish, improved power and efficiency.',
    price: 3499.00,
    comparePrice: 4499.00,
    costPrice: 2500.00,
    stockQuantity: 15,
    lowStockThreshold: 5,
    weight: 2.2,
    dimensions: { length: 380, width: 100, height: 100 },
    isActive: true,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    sortOrder: 10,
    
    vendorName: 'HITECH',
    manufacturer: 'htexhaust',
    productType: 'performance',
    accessoryCategory: 'exhaust',
    compatibleBikes: ['RAY ZR'],
    compatibleModels: ['Yamaha Ray ZR (2020-2024)', 'Yamaha Ray ZR Street Rally'],
    installationType: 'DIY',
    installationTimeMinutes: 30,
    warrantyPeriod: '1 Year',
    material: 'Stainless Steel SS304',
    color: 'Chrome',
    finish: 'Chrome Plated',
    features: [
      'SS304 stainless steel',
      'Chrome plated finish',
      'Bolt-on installation',
      'Improved power delivery',
      'Better fuel efficiency',
      'Sporty sound',
      'Lightweight design'
    ],
    specifications: {
      pipe_diameter: '38mm',
      length: '380mm',
      weight: '2.2kg',
      material_grade: 'SS304',
      finish_type: 'Chrome',
      db_level: '88dB'
    },
    
    metaTitle: 'Yamaha Ray ZR Performance Exhaust | Chrome | HTEXHAUST',
    metaDescription: 'Performance exhaust for Yamaha Ray ZR. SS304 chrome finish, improved power. Get 22% off. New arrival!',
    
    categories: ['Exhaust Systems', 'Performance Parts', 'RAY ZR'],
    primaryCategory: 'Exhaust Systems',
    
    tags: ['new-arrival', 'featured', 'ray-zr', 'yamaha', 'exhaust', 'performance', 'chrome'],
    
    images: [
      {
        url: 'https://placehold.co/800x800/1a1a1a/white?text=Ray+ZR+Exhaust',
        altText: 'Yamaha Ray ZR Performance Exhaust',
        isPrimary: true,
        sortOrder: 1
      },
      {
        url: 'https://placehold.co/800x800/2a2a2a/white?text=Ray+ZR+EXH+Side',
        altText: 'Yamaha Ray ZR Exhaust - Side View',
        isPrimary: false,
        sortOrder: 2
      }
    ],
    
    attributes: [
      { name: 'Material', value: 'SS304 Stainless Steel', group: 'Specifications', isFilterable: true },
      { name: 'Finish', value: 'Chrome Plated', group: 'Specifications', isFilterable: true },
      { name: 'Color', value: 'Chrome', group: 'Specifications', isFilterable: true },
      { name: 'Bike Model', value: 'RAY ZR', group: 'Compatibility', isFilterable: true },
      { name: 'Bike Brand', value: 'Yamaha', group: 'Compatibility', isFilterable: true },
      { name: 'Installation', value: 'DIY', group: 'Installation', isFilterable: true }
    ],
    
    brand: {
      name: 'HTEXHAUST',
      slug: 'htexhaust'
    }
  },

  // ========================================================================
  // ROYAL ENFIELD PRODUCTS
  // ========================================================================
  {
    name: 'Royal Enfield Classic 350 Touring Crash Guard with Highway Pegs',
    slug: 'royal-enfield-classic-350-touring-crash-guard-highway-pegs',
    sku: 'HT-RE350-CGPEG-001',
    description: `Premium touring crash guard with integrated highway pegs for Royal Enfield Classic 350. Perfect for long-distance touring, providing both protection and riding comfort.

Key Features:
• Material: 25mm heavy-duty steel tubing
• Finish: Chrome plated
• Integrated highway pegs
• Maximum engine protection
• Comfortable foot rest position
• Perfect OEM fitment
• Professional welding

Protection Features:
• Full engine protection
• Tank protection bars
• Side panel guards
• Frame protection
• Impact-tested design

Highway Pegs:
• Adjustable footrest position
• Anti-slip rubber pads
• Reduces rider fatigue on long tours
• Quick release mechanism
• Weight capacity: 100kg

Build Quality:
• 25mm thick steel tubing
• Triple-layer chrome plating
• Reinforced mounting points
• Professional TIG welding
• Corrosion-resistant

Installation:
• Bolt-on installation
• Uses OEM mounting points
• Installation time: 90 minutes
• Professional installation recommended

Warranty: 2 Years against manufacturing defects`,
    shortDescription: 'Touring crash guard with highway pegs for RE Classic 350. 25mm steel, chrome finish, maximum comfort and protection.',
    price: 4999.00,
    comparePrice: 6999.00,
    costPrice: 3500.00,
    stockQuantity: 12,
    lowStockThreshold: 3,
    weight: 8.5,
    dimensions: { length: 800, width: 600, height: 200 },
    isActive: true,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    sortOrder: 3,
    
    vendorName: 'HITECH',
    manufacturer: 'htexhaust',
    productType: 'touring',
    accessoryCategory: 'crash_guard',
    compatibleBikes: ['Classic 350', 'Classic Reborn'],
    compatibleModels: ['Royal Enfield Classic 350 (2021-2024)', 'Royal Enfield Classic 350 Reborn'],
    installationType: 'Professional Required',
    installationTimeMinutes: 90,
    warrantyPeriod: '2 Years',
    material: 'Heavy Duty Steel',
    color: 'Chrome',
    finish: 'Chrome Plated',
    features: [
      '25mm heavy-duty steel',
      'Integrated highway pegs',
      'Chrome plated finish',
      'Maximum protection',
      'Reduces touring fatigue',
      'Adjustable footrest',
      'Professional welding',
      '2 year warranty'
    ],
    specifications: {
      tube_diameter: '25mm',
      material_grade: 'Heavy Duty Steel',
      weight: '8.5kg',
      mounting_points: '6',
      peg_weight_capacity: '100kg',
      chrome_layers: '3'
    },
    
    metaTitle: 'RE Classic 350 Crash Guard with Highway Pegs | HTEXHAUST',
    metaDescription: 'Premium touring crash guard for Royal Enfield Classic 350. Highway pegs, 25mm steel, chrome finish. Save 29%!',
    
    categories: ['Crash Guards', 'Touring Accessories', 'Classic 350'],
    primaryCategory: 'Crash Guards',
    
    tags: ['bestseller', 'featured', 'royal-enfield', 'classic-350', 'touring', 'crash-guard', 'highway-pegs'],
    
    images: [
      {
        url: 'https://placehold.co/800x800/1a1a1a/white?text=RE+Crash+Guard',
        altText: 'Royal Enfield Classic 350 Crash Guard with Highway Pegs',
        isPrimary: true,
        sortOrder: 1
      },
      {
        url: 'https://placehold.co/800x800/2a2a2a/white?text=RE+CG+Side',
        altText: 'RE Classic 350 Crash Guard - Side View',
        isPrimary: false,
        sortOrder: 2
      },
      {
        url: 'https://placehold.co/800x800/3a3a3a/white?text=RE+CG+Pegs',
        altText: 'RE Classic 350 Highway Pegs Detail',
        isPrimary: false,
        sortOrder: 3
      },
      {
        url: 'https://placehold.co/800x800/4a4a4a/white?text=RE+CG+Installed',
        altText: 'RE Classic 350 Crash Guard Installed',
        isPrimary: false,
        sortOrder: 4
      }
    ],
    
    attributes: [
      { name: 'Material', value: 'Heavy Duty Steel', group: 'Specifications', isFilterable: true },
      { name: 'Tube Diameter', value: '25mm', group: 'Specifications', isFilterable: true },
      { name: 'Finish', value: 'Chrome Plated', group: 'Specifications', isFilterable: true },
      { name: 'Color', value: 'Chrome', group: 'Specifications', isFilterable: true },
      { name: 'Bike Model', value: 'Classic 350', group: 'Compatibility', isFilterable: true },
      { name: 'Bike Brand', value: 'Royal Enfield', group: 'Compatibility', isFilterable: true },
      { name: 'Has Highway Pegs', value: 'Yes', group: 'Features', isFilterable: true },
      { name: 'Installation', value: 'Professional Required', group: 'Installation', isFilterable: true }
    ],
    
    brand: {
      name: 'HTEXHAUST',
      slug: 'htexhaust'
    }
  },

  {
    name: 'Royal Enfield Himalayan Heavy Duty Pannier Rack',
    slug: 'royal-enfield-himalayan-heavy-duty-pannier-rack',
    sku: 'HT-REHIM-RACK-001',
    description: `Heavy-duty pannier rack system for Royal Enfield Himalayan. Designed for serious adventure touring with maximum load capacity and durability.

Key Features:
• Material: 20mm square tubing steel
• Finish: Powder coated black
• Load capacity: 20kg per side
• Integrated top box mounting points
• Quick-release pannier system
• Reinforced construction
• Adventure-ready design

Load Capacity:
• Side panniers: 20kg each
• Top box: 10kg
• Total capacity: 50kg
• Weight-tested and certified

Compatibility:
• Works with all major pannier brands
• Quick-release mounting system
• Universal fit for soft/hard panniers
• Top box mounting included

Build Quality:
• 20mm square steel tubing
• Heavy-duty powder coating
• All-weather resistant
• Corrosion-proof hardware
• Reinforced welding at stress points

Installation:
• Bolt-on installation
• Uses OEM mounting points
• Installation time: 120 minutes
• Includes all mounting hardware
• Professional installation recommended

Warranty: 2 Years manufacturing warranty`,
    shortDescription: 'Heavy-duty pannier rack for RE Himalayan. 50kg capacity, quick-release system, adventure-ready.',
    price: 6499.00,
    comparePrice: 8999.00,
    costPrice: 4500.00,
    stockQuantity: 8,
    lowStockThreshold: 3,
    weight: 6.5,
    dimensions: { length: 600, width: 400, height: 300 },
    isActive: true,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    sortOrder: 15,
    
    vendorName: 'HITECH',
    manufacturer: 'htexhaust',
    productType: 'touring',
    accessoryCategory: 'luggage',
    compatibleBikes: ['Himalayan'],
    compatibleModels: ['Royal Enfield Himalayan (2018-2024)', 'Royal Enfield Himalayan 450'],
    installationType: 'Professional Required',
    installationTimeMinutes: 120,
    warrantyPeriod: '2 Years',
    material: 'Square Tubing Steel',
    color: 'Black',
    finish: 'Powder Coated',
    features: [
      '50kg total load capacity',
      'Quick-release pannier system',
      'Top box mounting included',
      'Universal pannier compatibility',
      '20mm square tubing',
      'All-weather resistant',
      'Reinforced construction',
      '2 year warranty'
    ],
    specifications: {
      tube_size: '20mm square',
      side_capacity: '20kg',
      top_capacity: '10kg',
      total_capacity: '50kg',
      weight: '6.5kg',
      material_grade: 'Square Tubing Steel'
    },
    
    metaTitle: 'RE Himalayan Pannier Rack | Heavy Duty 50kg | HTEXHAUST',
    metaDescription: 'Heavy-duty pannier rack for Royal Enfield Himalayan. 50kg capacity, quick-release, adventure-ready. Save 28%!',
    
    categories: ['Touring Accessories', 'Luggage Systems', 'Himalayan'],
    primaryCategory: 'Touring Accessories',
    
    tags: ['new-arrival', 'featured', 'royal-enfield', 'himalayan', 'touring', 'pannier-rack', 'adventure'],
    
    images: [
      {
        url: 'https://placehold.co/800x800/1a1a1a/white?text=Himalayan+Rack',
        altText: 'Royal Enfield Himalayan Pannier Rack',
        isPrimary: true,
        sortOrder: 1
      },
      {
        url: 'https://placehold.co/800x800/2a2a2a/white?text=Himalayan+Rack+Side',
        altText: 'RE Himalayan Pannier Rack - Side View',
        isPrimary: false,
        sortOrder: 2
      },
      {
        url: 'https://placehold.co/800x800/3a3a3a/white?text=Himalayan+Rack+Loaded',
        altText: 'RE Himalayan Pannier Rack - With Luggage',
        isPrimary: false,
        sortOrder: 3
      }
    ],
    
    attributes: [
      { name: 'Material', value: 'Square Tubing Steel', group: 'Specifications', isFilterable: true },
      { name: 'Load Capacity', value: '50kg', group: 'Specifications', isFilterable: true },
      { name: 'Finish', value: 'Powder Coated', group: 'Specifications', isFilterable: true },
      { name: 'Color', value: 'Black', group: 'Specifications', isFilterable: true },
      { name: 'Bike Model', value: 'Himalayan', group: 'Compatibility', isFilterable: true },
      { name: 'Bike Brand', value: 'Royal Enfield', group: 'Compatibility', isFilterable: true },
      { name: 'Quick Release', value: 'Yes', group: 'Features', isFilterable: true },
      { name: 'Installation', value: 'Professional Required', group: 'Installation', isFilterable: true }
    ],
    
    brand: {
      name: 'HTEXHAUST',
      slug: 'htexhaust'
    }
  },

  // ========================================================================
  // UNIVERSAL PRODUCTS
  // ========================================================================
  {
    name: 'Universal LED Auxiliary Fog Lights - 20W (Pair)',
    slug: 'universal-led-auxiliary-fog-lights-20w-pair',
    sku: 'HT-UNI-FOG20-001',
    description: `High-performance 20W LED auxiliary fog lights for motorcycles. Universal fitment suitable for all bikes. Dramatically improves visibility in fog, rain, and night conditions.

Key Features:
• Power: 20W per light (40W pair)
• Lumens: 2000 lumens per light
• Color temperature: 6000K (pure white)
• Beam pattern: Wide flood
• Material: Aluminum alloy housing
• Waterproof: IP67 rated
• Universal fitment

Lighting Performance:
• 2000 lumens per light
• 6000K pure white color
• 120° wide beam angle
• Effective range: 50 meters
• Perfect for fog and rain

Build Quality:
• CNC machined aluminum housing
• Toughened glass lens
• Heat dissipation fins
• Shock-resistant design
• Corrosion-proof coating

Electrical:
• Input voltage: 9-85V DC
• Power consumption: 20W per light
• Includes wiring harness
• On/off switch included
• Relay and fuse included

Installation:
• Universal bracket included
• Adjustable mounting angle
• Installation time: 45 minutes
• Basic wiring knowledge required
• Detailed manual included

Warranty: 1 Year warranty`,
    shortDescription: 'Universal 20W LED fog lights for bikes. 2000 lumens, IP67 waterproof, perfect visibility. Set of 2.',
    price: 1999.00,
    comparePrice: 2999.00,
    costPrice: 1200.00,
    stockQuantity: 35,
    lowStockThreshold: 10,
    weight: 0.8,
    dimensions: { length: 80, width: 80, height: 90 },
    isActive: true,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    sortOrder: 5,
    
    vendorName: 'HITECH',
    manufacturer: 'htexhaust',
    productType: 'auxiliary',
    accessoryCategory: 'lighting',
    compatibleBikes: ['Universal'],
    compatibleModels: ['All Motorcycles', 'Universal Fitment'],
    installationType: 'Moderate',
    installationTimeMinutes: 45,
    warrantyPeriod: '1 Year',
    material: 'Aluminum Alloy',
    color: 'Black',
    finish: 'Anodized',
    features: [
      '20W per light (40W pair)',
      '2000 lumens per light',
      'IP67 waterproof',
      '6000K pure white',
      'Universal fitment',
      'Complete wiring kit',
      'Adjustable bracket',
      '1 year warranty'
    ],
    specifications: {
      power: '20W',
      lumens: '2000',
      color_temp: '6000K',
      beam_angle: '120°',
      waterproof_rating: 'IP67',
      voltage_range: '9-85V DC',
      lifespan: '30000 hours'
    },
    
    metaTitle: 'Universal LED Fog Lights 20W | Motorcycle | HTEXHAUST',
    metaDescription: '20W LED auxiliary fog lights for bikes. 2000 lumens, IP67 waterproof, universal fit. Get 33% off now!',
    
    categories: ['Auxiliary Lights', 'Universal Accessories', 'Performance Parts'],
    primaryCategory: 'Auxiliary Lights',
    
    tags: ['bestseller', 'featured', 'universal', 'led', 'fog-lights', 'lighting', 'safety'],
    
    images: [
      {
        url: 'https://placehold.co/800x800/1a1a1a/white?text=LED+Fog+Lights',
        altText: 'Universal LED Fog Lights 20W',
        isPrimary: true,
        sortOrder: 1
      },
      {
        url: 'https://placehold.co/800x800/2a2a2a/white?text=LED+Lights+Detail',
        altText: 'LED Fog Lights - Detail View',
        isPrimary: false,
        sortOrder: 2
      },
      {
        url: 'https://placehold.co/800x800/3a3a3a/white?text=LED+Lights+Installed',
        altText: 'LED Fog Lights - Installed on Bike',
        isPrimary: false,
        sortOrder: 3
      }
    ],
    
    attributes: [
      { name: 'Power', value: '20W', group: 'Specifications', isFilterable: true },
      { name: 'Lumens', value: '2000', group: 'Specifications', isFilterable: true },
      { name: 'Color Temperature', value: '6000K', group: 'Specifications', isFilterable: true },
      { name: 'Waterproof Rating', value: 'IP67', group: 'Specifications', isFilterable: true },
      { name: 'Material', value: 'Aluminum Alloy', group: 'Specifications', isFilterable: true },
      { name: 'Bike Compatibility', value: 'Universal', group: 'Compatibility', isFilterable: true },
      { name: 'Installation', value: 'Moderate', group: 'Installation', isFilterable: true }
    ],
    
    brand: {
      name: 'HTEXHAUST',
      slug: 'htexhaust'
    }
  },

  {
    name: 'Premium Motorcycle Phone Mount with USB Charger',
    slug: 'premium-motorcycle-phone-mount-usb-charger',
    sku: 'HT-UNI-PHONE-001',
    description: `Premium aluminum phone mount with integrated USB charger for motorcycles. Universal fitment, supports all phone sizes. Perfect for navigation and on-the-go charging.

Key Features:
• Material: CNC aluminum alloy
• Phone size: 4.7" to 7.2"
• USB output: 5V/2.4A fast charging
• 360° rotation
• Quick release mechanism
• Waterproof charging port
• Anti-vibration design

Phone Compatibility:
• iPhone (all models)
• Samsung Galaxy (all models)
• All Android phones
• Phone size: 4.7" to 7.2"
• Max thickness: 12mm with case

Mounting:
• Universal handlebar clamp
• Fits 22mm to 32mm handlebars
• Mirror mount adapter included
• Tool-free installation
• 360° adjustable viewing angle

Charging:
• USB output: 5V/2.4A
• Fast charging support
• Waterproof rubber cap
• LED indicator
• 1.5 meter cable included

Build Quality:
• CNC machined aluminum
• Rubber cushioning pads
• Anti-vibration dampeners
• Waterproof construction
• Durable ball joint

Installation:
• Tool-free installation
• Installation time: 10 minutes
• No permanent modifications
• Includes all hardware

Warranty: 1 Year warranty`,
    shortDescription: 'Premium phone mount with USB charger. CNC aluminum, 360° rotation, fits all phones. Fast charging.',
    price: 1499.00,
    comparePrice: 2499.00,
    costPrice: 900.00,
    stockQuantity: 42,
    lowStockThreshold: 15,
    weight: 0.45,
    dimensions: { length: 120, width: 80, height: 150 },
    isActive: true,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    sortOrder: 6,
    
    vendorName: 'HITECH',
    manufacturer: 'htexhaust',
    productType: 'auxiliary',
    accessoryCategory: 'electronics',
    compatibleBikes: ['Universal'],
    compatibleModels: ['All Motorcycles', 'Universal Fitment'],
    installationType: 'Easy',
    installationTimeMinutes: 10,
    warrantyPeriod: '1 Year',
    material: 'Aluminum Alloy',
    color: 'Black',
    finish: 'Anodized',
    features: [
      'CNC aluminum construction',
      'USB fast charging (5V/2.4A)',
      '360° rotation',
      'Fits all phone sizes',
      'Waterproof design',
      'Anti-vibration dampeners',
      'Tool-free installation',
      '1 year warranty'
    ],
    specifications: {
      phone_size: '4.7" to 7.2"',
      usb_output: '5V/2.4A',
      handlebar_size: '22mm to 32mm',
      rotation: '360°',
      waterproof: 'Yes',
      max_phone_thickness: '12mm'
    },
    
    metaTitle: 'Motorcycle Phone Mount with USB Charger | Universal | HTEXHAUST',
    metaDescription: 'Premium phone mount for bikes. USB fast charging, CNC aluminum, 360° rotation. Fits all phones. Save 40%!',
    
    categories: ['Touring Accessories', 'Universal Accessories', 'Electronics'],
    primaryCategory: 'Touring Accessories',
    
    tags: ['bestseller', 'featured', 'universal', 'phone-mount', 'usb-charger', 'navigation', 'touring'],
    
    images: [
      {
        url: 'https://placehold.co/800x800/1a1a1a/white?text=Phone+Mount',
        altText: 'Motorcycle Phone Mount with USB Charger',
        isPrimary: true,
        sortOrder: 1
      },
      {
        url: 'https://placehold.co/800x800/2a2a2a/white?text=Phone+Mount+Side',
        altText: 'Phone Mount - Side View',
        isPrimary: false,
        sortOrder: 2
      },
      {
        url: 'https://placehold.co/800x800/3a3a3a/white?text=Phone+Mount+USB',
        altText: 'Phone Mount - USB Port Detail',
        isPrimary: false,
        sortOrder: 3
      },
      {
        url: 'https://placehold.co/800x800/4a4a4a/white?text=Phone+Mount+Bike',
        altText: 'Phone Mount - Installed on Bike',
        isPrimary: false,
        sortOrder: 4
      }
    ],
    
    attributes: [
      { name: 'Material', value: 'Aluminum Alloy', group: 'Specifications', isFilterable: true },
      { name: 'Phone Size', value: '4.7" to 7.2"', group: 'Compatibility', isFilterable: true },
      { name: 'USB Output', value: '5V/2.4A', group: 'Specifications', isFilterable: true },
      { name: 'Rotation', value: '360°', group: 'Features', isFilterable: false },
      { name: 'Waterproof', value: 'Yes', group: 'Features', isFilterable: true },
      { name: 'Bike Compatibility', value: 'Universal', group: 'Compatibility', isFilterable: true },
      { name: 'Installation', value: 'Easy', group: 'Installation', isFilterable: true }
    ],
    
    brand: {
      name: 'HTEXHAUST',
      slug: 'htexhaust'
    }
  },

  // ========================================================================
  // MORE YAMAHA AEROX 155 PRODUCTS
  // ========================================================================
  {
    name: 'Yamaha Aerox 155 Racing Footrest Set',
    slug: 'yamaha-aerox-155-racing-footrest-set',
    sku: 'HT-AEROX155-FR-001',
    description: `CNC machined racing footrest set for Yamaha AEROX 155. Provides better grip, improved comfort, and aggressive styling.

Key Features:
• Material: CNC machined aluminum
• Finish: Anodized (Black/Red/Blue options)
• Improved grip pattern
• Lightweight design
• Direct bolt-on replacement
• Anti-slip design

Benefits:
• Better foot grip in aggressive riding
• Wider platform for comfort
• Reduced foot fatigue
• Enhanced styling
• Corrosion-resistant

Build Quality:
• CNC machined from billet aluminum
• Type-III anodizing
• Stainless steel mounting hardware
• Precision fitment

Installation:
• Direct bolt-on replacement
• Installation time: 15 minutes
• Basic tools required
• Includes mounting hardware

Warranty: 1 Year warranty`,
    shortDescription: 'CNC aluminum racing footrests for Yamaha AEROX 155. Better grip, comfort, and style. Available in 3 colors.',
    price: 1799.00,
    comparePrice: 2499.00,
    costPrice: 1100.00,
    stockQuantity: 20,
    lowStockThreshold: 5,
    weight: 0.6,
    dimensions: { length: 120, width: 60, height: 40 },
    isActive: true,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
    sortOrder: 20,
    
    vendorName: 'HITECH',
    manufacturer: 'htexhaust',
    productType: 'performance',
    accessoryCategory: 'footrests',
    compatibleBikes: ['AEROX 155'],
    compatibleModels: ['Yamaha AEROX 155 (2020-2024)'],
    installationType: 'DIY',
    installationTimeMinutes: 15,
    warrantyPeriod: '1 Year',
    material: 'Aluminum',
    color: 'Black',
    finish: 'Anodized',
    features: [
      'CNC machined aluminum',
      'Type-III anodizing',
      'Anti-slip grip pattern',
      'Lightweight design',
      'Direct bolt-on',
      'Available in 3 colors',
      'Stainless hardware'
    ],
    specifications: {
      material_grade: '6061-T6 Aluminum',
      anodizing: 'Type-III',
      weight: '0.6kg',
      colors_available: 'Black, Red, Blue'
    },
    
    metaTitle: 'Yamaha AEROX 155 Racing Footrest | CNC Aluminum | HTEXHAUST',
    metaDescription: 'CNC aluminum racing footrests for AEROX 155. Better grip and comfort. 3 color options. Save 28%!',
    
    categories: ['Performance Parts', 'AEROX 155'],
    primaryCategory: 'Performance Parts',
    
    tags: ['new-arrival', 'aerox', 'yamaha', 'footrests', 'racing', 'performance', 'cnc'],
    
    images: [
      {
        url: 'https://placehold.co/800x800/1a1a1a/white?text=AEROX+Footrest',
        altText: 'Yamaha AEROX 155 Racing Footrest',
        isPrimary: true,
        sortOrder: 1
      },
      {
        url: 'https://placehold.co/800x800/2a2a2a/white?text=Footrest+Detail',
        altText: 'Racing Footrest - Detail View',
        isPrimary: false,
        sortOrder: 2
      }
    ],
    
    attributes: [
      { name: 'Material', value: 'Aluminum', group: 'Specifications', isFilterable: true },
      { name: 'Finish', value: 'Anodized', group: 'Specifications', isFilterable: true },
      { name: 'Color', value: 'Black', group: 'Specifications', isFilterable: true },
      { name: 'Bike Model', value: 'AEROX 155', group: 'Compatibility', isFilterable: true },
      { name: 'Bike Brand', value: 'Yamaha', group: 'Compatibility', isFilterable: true },
      { name: 'Installation', value: 'DIY', group: 'Installation', isFilterable: true }
    ],
    
    brand: {
      name: 'HTEXHAUST',
      slug: 'htexhaust'
    }
  }
];

// ============================================================================
// SEEDING FUNCTION
// ============================================================================
const seedProducts = async () => {
  try {
    console.log('🌱 Starting HT Exhaust products seeding...\n');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected\n');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const productData of htExhaustProducts) {
      try {
        console.log(`📦 Processing: ${productData.name}`);
        
        // 1. Find or create brand
        const brand = await findOrCreateBrand(productData.brand);
        
        // 2. Find categories
        const categoryIds = [];
        let primaryCategoryId = null;
        
        for (const categoryName of productData.categories) {
          const category = await findCategoryByName(categoryName);
          if (category) {
            categoryIds.push(category.id);
            if (categoryName === productData.primaryCategory) {
              primaryCategoryId = category.id;
            }
          }
        }
        
        // 3. Create product
        const productAttributes = { ...productData };
        delete productAttributes.categories;
        delete productAttributes.primaryCategory;
        delete productAttributes.tags;
        delete productAttributes.images;
        delete productAttributes.attributes;
        delete productAttributes.brand;
        
        productAttributes.brandId = brand.id;
        productAttributes.categoryId = primaryCategoryId; // Legacy field
        
        const [product, created] = await Product.findOrCreate({
          where: { sku: productData.sku },
          defaults: productAttributes
        });
        
        if (!created) {
          console.log(`   ℹ️  Product already exists, updating...`);
          await product.update(productAttributes);
        }
        
        // 4. Create product-category relationships
        if (categoryIds.length > 0) {
          for (const categoryId of categoryIds) {
            await ProductCategory.findOrCreate({
              where: {
                productId: product.id,
                categoryId: categoryId
              },
              defaults: {
                isPrimary: categoryId === primaryCategoryId,
                sortOrder: 0
              }
            });
          }
        }
        
        // 5. Create product images
        if (productData.images && productData.images.length > 0) {
          for (const imageData of productData.images) {
            // Generate filename from URL
            const filename = imageData.url.split('/').pop() || 'placeholder.jpg';
            
            await ProductImage.findOrCreate({
              where: {
                productId: product.id,
                url: imageData.url
              },
              defaults: {
                ...imageData,
                productId: product.id,
                filename: filename,
                originalName: filename,
                mimeType: 'image/jpeg',
                size: 102400, // 100KB placeholder
                width: 800,
                height: 800
              }
            });
          }
        }
        
        // 6. Create product attributes (normalized)
        if (productData.attributes && productData.attributes.length > 0) {
          for (const attrData of productData.attributes) {
            await ProductAttribute.findOrCreate({
              where: {
                productId: product.id,
                attributeName: attrData.name,
                attributeValue: attrData.value
              },
              defaults: {
                ...attrData,
                productId: product.id,
                attributeGroup: attrData.group,
                displayOrder: 0
              }
            });
          }
        }
        
        // 7. Create tags and link to product
        if (productData.tags && productData.tags.length > 0) {
          for (const tagName of productData.tags) {
            const tag = await findOrCreateTag({
              name: tagName,
              slug: tagName.toLowerCase().replace(/\s+/g, '-'),
              tagType: 'product_feature'
            });
            
            // Link product to tag
            await sequelize.models.ProductTag.findOrCreate({
              where: {
                productId: product.id,
                tagId: tag.id
              }
            });
          }
        }
        
        console.log(`   ✅ Success: ${product.name} (${product.sku})\n`);
        successCount++;
        
      } catch (error) {
        console.error(`   ❌ Error: ${productData.name}`);
        console.error(`   Error details: ${error.message}\n`);
        errorCount++;
      }
    }
    
    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('📊 SEEDING SUMMARY');
    console.log('='.repeat(80));
    console.log(`✅ Successfully seeded: ${successCount} products`);
    console.log(`❌ Errors: ${errorCount} products`);
    console.log('='.repeat(80) + '\n');
    
    // Show database stats
    console.log('📈 DATABASE STATISTICS:');
    const stats = await sequelize.query(`
      SELECT 
        'products' as table_name,
        COUNT(*) as total_rows
      FROM products
      UNION ALL
      SELECT 
        'product_images' as table_name,
        COUNT(*) as total_rows
      FROM product_images
      UNION ALL
      SELECT 
        'product_categories' as table_name,
        COUNT(*) as total_rows
      FROM product_categories
      UNION ALL
      SELECT 
        'product_attributes' as table_name,
        COUNT(*) as total_rows
      FROM product_attributes
      UNION ALL
      SELECT 
        'tags' as table_name,
        COUNT(*) as total_rows
      FROM tags
      ORDER BY table_name;
    `, { type: sequelize.QueryTypes.SELECT });
    
    console.table(stats);
    
    console.log('\n✨ Product seeding completed!\n');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ SEEDING FAILED:', error);
    console.error(error.stack);
    process.exit(1);
  }
};

// Run seeding
seedProducts();

