#!/usr/bin/env node

import { sequelize } from './src/config/database.js';
import { Product, Category, Brand } from './src/models/index.js';
import dotenv from 'dotenv';

dotenv.config();

// HT Exhaust product data extracted from their website
const htexhaustProducts = [
  {
    name: "2 METAL SLIDER /SB 705",
    slug: "2-metal-slider-sb-705",
    description: "High-quality metal sliders for motorcycle protection. Made from premium materials for durability and style.",
    price: 740.00,
    originalPrice: 740.00,
    sku: "SB-705",
    stock: 50,
    category: "Protection Accessories",
    brand: "HITECH",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&h=300&fit=crop&crop=center"
    ],
    specifications: {
      material: "Metal",
      color: "Black",
      weight: "500g",
      compatibility: "Universal"
    },
    features: [
      "Premium metal construction",
      "Easy installation",
      "Universal fit",
      "Durable powder coating"
    ]
  },
  {
    name: "10 mm Bobbins / Spools Universal for Paddock SB 898",
    slug: "10mm-bobbins-spools-universal-paddock-sb-898",
    description: "Universal paddock stand bobbins for easy motorcycle maintenance. Compatible with most motorcycle models.",
    price: 560.00,
    originalPrice: 560.00,
    sku: "SB-898",
    stock: 30,
    category: "Auxiliary Accessories",
    brand: "HITECH",
    images: [
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&h=300&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center"
    ],
    specifications: {
      diameter: "10mm",
      material: "Aluminum",
      color: "Silver",
      weight: "200g"
    },
    features: [
      "Universal compatibility",
      "Aluminum construction",
      "Easy installation",
      "Paddock stand compatible"
    ]
  },
  {
    name: "3\" METEOR SEATREST EXTENDER FITMENT – SB 669",
    slug: "3-meteor-seatrest-extender-fitment-sb-669",
    description: "Seat rest extender for Royal Enfield Meteor 350. Enhances comfort for pillion riders on long journeys.",
    price: 740.00,
    originalPrice: 740.00,
    sku: "SB-669",
    stock: 25,
    category: "Touring Accessories",
    brand: "htexhaust",
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center"
    ],
    specifications: {
      length: "3 inches",
      material: "Steel",
      color: "Black",
      compatibility: "Royal Enfield Meteor 350"
    },
    features: [
      "Royal Enfield Meteor 350 specific",
      "Enhanced pillion comfort",
      "Durable steel construction",
      "Easy installation"
    ]
  },
  {
    name: "ADVENTURE 250 390 - GPS MOUNT - SB 739",
    slug: "adventure-250-390-gps-mount-sb-739",
    description: "GPS mounting system for KTM Adventure 250/390. Secure and vibration-free mounting for navigation devices.",
    price: 930.00,
    originalPrice: 930.00,
    sku: "SB-739",
    stock: 20,
    category: "Touring Accessories",
    brand: "HITECH",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&h=300&fit=crop&crop=center"
    ],
    specifications: {
      compatibility: "KTM Adventure 250/390",
      material: "Aluminum",
      color: "Black",
      weight: "300g"
    },
    features: [
      "KTM Adventure specific",
      "Vibration-free mounting",
      "Adjustable angle",
      "Quick release mechanism"
    ]
  },
  {
    name: "ADVENTURE 250 390 FLUID TANK CAP - FTC 066",
    slug: "adventure-250-390-fluid-tank-cap-ftc-066",
    description: "Fluid tank cap for KTM Adventure 250/390. High-quality replacement cap with improved sealing.",
    price: 280.00,
    originalPrice: 280.00,
    sku: "FTC-066",
    stock: 40,
    category: "Auxiliary Accessories",
    brand: "HITECH",
    images: [
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&h=300&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center"
    ],
    specifications: {
      compatibility: "KTM Adventure 250/390",
      material: "Plastic",
      color: "Black",
      weight: "50g"
    },
    features: [
      "OEM replacement",
      "Improved sealing",
      "Easy installation",
      "Durable construction"
    ]
  },
  {
    name: "Apache RTR 200 4v TOP RACK With Small Plate SBTVS 104-SMALL",
    slug: "apache-rtr-200-4v-top-rack-small-plate-sbtvs-104-small",
    description: "Top rack with small plate for TVS Apache RTR 200 4V. Perfect for carrying luggage and accessories.",
    price: 2600.00,
    originalPrice: 2600.00,
    sku: "SBTVS-104-SMALL",
    stock: 15,
    category: "Touring Accessories",
    brand: "HITECH",
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center"
    ],
    specifications: {
      compatibility: "TVS Apache RTR 200 4V",
      material: "Steel",
      color: "Black",
      weight: "2.5kg",
      plateSize: "Small"
    },
    features: [
      "TVS Apache RTR 200 4V specific",
      "Small plate included",
      "Heavy-duty construction",
      "Easy installation"
    ]
  },
  {
    name: "Apache RR310 Radiator Guard - RD 935",
    slug: "apache-rr310-radiator-guard-rd-935",
    description: "Radiator guard for TVS Apache RR310. Protects radiator from debris and damage while maintaining airflow.",
    price: 1300.00,
    originalPrice: 1300.00,
    sku: "RD-935",
    stock: 35,
    category: "Protection Accessories",
    brand: "HITECH",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&h=300&fit=crop&crop=center"
    ],
    specifications: {
      compatibility: "TVS Apache RR310",
      material: "Steel mesh",
      color: "Black",
      weight: "800g"
    },
    features: [
      "TVS Apache RR310 specific",
      "Debris protection",
      "Maintains airflow",
      "Powder coated finish"
    ]
  },
  {
    name: "BMW G 310 GS FLUID TANK CAP",
    slug: "bmw-g-310-gs-fluid-tank-cap",
    description: "Fluid tank cap for BMW G 310 GS. High-quality replacement with improved durability and sealing.",
    price: 450.00,
    originalPrice: 450.00,
    sku: "BMW-FTC-001",
    stock: 20,
    category: "Auxiliary Accessories",
    brand: "HITECH",
    images: [
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&h=300&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center"
    ],
    specifications: {
      compatibility: "BMW G 310 GS",
      material: "Plastic",
      color: "Black",
      weight: "60g"
    },
    features: [
      "BMW G 310 GS specific",
      "Improved sealing",
      "OEM quality",
      "Easy replacement"
    ]
  },
  {
    name: "BMW G 310 R CRASH GUARD",
    slug: "bmw-g-310-r-crash-guard",
    description: "Crash guard for BMW G 310 R. Provides essential protection for engine and fairing during falls.",
    price: 3200.00,
    originalPrice: 3200.00,
    sku: "BMW-CG-001",
    stock: 12,
    category: "Protection Accessories",
    brand: "HITECH",
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center"
    ],
    specifications: {
      compatibility: "BMW G 310 R",
      material: "Steel",
      color: "Black",
      weight: "3.2kg"
    },
    features: [
      "BMW G 310 R specific",
      "Engine protection",
      "Heavy-duty construction",
      "Powder coated finish"
    ]
  },
  {
    name: "BMW G 310 R GPS MOUNT",
    slug: "bmw-g-310-r-gps-mount",
    description: "GPS mounting system for BMW G 310 R. Secure mounting solution for navigation devices.",
    price: 1200.00,
    originalPrice: 1200.00,
    sku: "BMW-GPS-001",
    stock: 18,
    category: "Touring Accessories",
    brand: "HITECH",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&h=300&fit=crop&crop=center"
    ],
    specifications: {
      compatibility: "BMW G 310 R",
      material: "Aluminum",
      color: "Black",
      weight: "250g"
    },
    features: [
      "BMW G 310 R specific",
      "Vibration-free mounting",
      "Adjustable positioning",
      "Quick release system"
    ]
  }
];

// Categories data
const categories = [
  {
    name: "Protection Accessories",
    description: "Essential protection gear for your motorcycle including crash guards, radiator guards, and frame sliders.",
    slug: "protection-accessories",
    image: "https://via.placeholder.com/400x300/1a1a1a/ffffff?text=Protection+Accessories"
  },
  {
    name: "Touring Accessories",
    description: "Accessories for long-distance touring including top racks, GPS mounts, and luggage carriers.",
    slug: "touring-accessories",
    image: "https://via.placeholder.com/400x300/2a2a2a/ffffff?text=Touring+Accessories"
  },
  {
    name: "Auxiliary Accessories",
    description: "Additional accessories to enhance your motorcycle's functionality and convenience.",
    slug: "auxiliary-accessories",
    image: "https://via.placeholder.com/400x300/3a3a3a/ffffff?text=Auxiliary+Accessories"
  }
];

// Brands data
const brands = [
  {
    name: "HITECH",
    description: "Premium motorcycle accessories manufacturer known for quality and durability.",
    slug: "hitech",
    logo: "https://via.placeholder.com/200x100/1a1a1a/ffffff?text=HITECH"
  },
  {
    name: "htexhaust",
    description: "HT Exhaust - Leading manufacturer of motorcycle exhaust systems and accessories since 1996.",
    slug: "htexhaust",
    logo: "https://via.placeholder.com/200x100/2a2a2a/ffffff?text=HT+EXHAUST"
  }
];

const seedHTExhaustProducts = async () => {
  try {
    console.log('🚀 Starting HT Exhaust product seeding...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Create categories
    console.log('📁 Creating categories...');
    const createdCategories = {};
    for (const categoryData of categories) {
      const [category, created] = await Category.findOrCreate({
        where: { slug: categoryData.slug },
        defaults: categoryData
      });
      createdCategories[categoryData.name] = category;
      console.log(`${created ? '✅ Created' : '📋 Found'} category: ${category.name}`);
    }

    // Create brands
    console.log('🏷️ Creating brands...');
    const createdBrands = {};
    for (const brandData of brands) {
      const [brand, created] = await Brand.findOrCreate({
        where: { slug: brandData.slug },
        defaults: brandData
      });
      createdBrands[brandData.name] = brand;
      console.log(`${created ? '✅ Created' : '📋 Found'} brand: ${brand.name}`);
    }

    // Create products
    console.log('🛍️ Creating products...');
    let createdCount = 0;
    let existingCount = 0;

    for (const productData of htexhaustProducts) {
      const [product, created] = await Product.findOrCreate({
        where: { sku: productData.sku },
              defaults: {
          ...productData,
          categoryId: createdCategories[productData.category].id,
          brandId: createdBrands[productData.brand].id,
          status: 'active',
          featured: false,
          isActive: true
        }
      });

      if (created) {
        createdCount++;
        console.log(`✅ Created product: ${product.name} (${product.sku})`);
      } else {
        existingCount++;
        console.log(`📋 Product already exists: ${product.name} (${product.sku})`);
      }
    }

    console.log('\n🎉 HT Exhaust product seeding completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Brands: ${brands.length}`);
    console.log(`   - Products created: ${createdCount}`);
    console.log(`   - Products already existing: ${existingCount}`);
    console.log(`   - Total products processed: ${htexhaustProducts.length}`);
        
      } catch (error) {
    console.error('❌ Error seeding HT Exhaust products:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
};

// Run the seeding function
seedHTExhaustProducts()
  .then(() => {
    console.log('✅ Seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
