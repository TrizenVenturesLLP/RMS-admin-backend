import { sequelize } from '../config/database.js';
import { User, Category, Brand, Product, ProductImage, ProductVariant } from '../models/index.js';
import bcrypt from 'bcryptjs';

const seed = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    await sequelize.sync({ force: true });
    
    // Create admin user
    const adminUser = await User.create({
      email: 'admin@ridersmotoshop.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true,
      emailVerified: true
    });
    
    console.log('✅ Admin user created');
    
    // Create sample categories
    const categories = await Category.bulkCreate([
      {
        name: 'Engine Parts',
        slug: 'engine-parts',
        description: 'High-performance engine components and parts',
        isActive: true,
        sortOrder: 1
      },
      {
        name: 'Brake System',
        slug: 'brake-system',
        description: 'Brake pads, discs, and brake system components',
        isActive: true,
        sortOrder: 2
      },
      {
        name: 'Exhaust System',
        slug: 'exhaust-system',
        description: 'Exhaust pipes, mufflers, and exhaust components',
        isActive: true,
        sortOrder: 3
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Motorcycle accessories and gear',
        isActive: true,
        sortOrder: 4
      },
      {
        name: 'Tires',
        slug: 'tires',
        description: 'Motorcycle tires for all riding conditions',
        isActive: true,
        sortOrder: 5
      }
    ]);
    
    console.log('✅ Categories created');
    
    // Create sample brands
    const brands = await Brand.bulkCreate([
      {
        name: 'Yamaha',
        slug: 'yamaha',
        description: 'Japanese motorcycle manufacturer',
        country: 'Japan',
        foundedYear: 1955,
        isActive: true,
        sortOrder: 1
      },
      {
        name: 'Honda',
        slug: 'honda',
        description: 'Japanese motorcycle and automobile manufacturer',
        country: 'Japan',
        foundedYear: 1948,
        isActive: true,
        sortOrder: 2
      },
      {
        name: 'Kawasaki',
        slug: 'kawasaki',
        description: 'Japanese multinational corporation',
        country: 'Japan',
        foundedYear: 1896,
        isActive: true,
        sortOrder: 3
      },
      {
        name: 'Suzuki',
        slug: 'suzuki',
        description: 'Japanese multinational corporation',
        country: 'Japan',
        foundedYear: 1909,
        isActive: true,
        sortOrder: 4
      },
      {
        name: 'Ducati',
        slug: 'ducati',
        description: 'Italian motorcycle manufacturer',
        country: 'Italy',
        foundedYear: 1926,
        isActive: true,
        sortOrder: 5
      }
    ]);
    
    console.log('✅ Brands created');
    
    // Create sample products
    const products = await Product.bulkCreate([
      {
        name: 'Yamaha MT-09 Air Filter',
        slug: 'yamaha-mt-09-air-filter',
        description: 'High-performance air filter for Yamaha MT-09',
        shortDescription: 'Premium air filter for enhanced performance',
        sku: 'YAM-MT09-AF-001',
        price: 45.99,
        comparePrice: 59.99,
        costPrice: 25.00,
        stockQuantity: 25,
        lowStockThreshold: 5,
        weight: 0.5,
        categoryId: categories[0].id,
        brandId: brands[0].id,
        isActive: true,
        isFeatured: true,
        sortOrder: 1
      },
      {
        name: 'Honda CBR600RR Brake Pads',
        slug: 'honda-cbr600rr-brake-pads',
        description: 'High-performance brake pads for Honda CBR600RR',
        shortDescription: 'Premium brake pads for superior stopping power',
        sku: 'HON-CBR600-BP-001',
        price: 89.99,
        comparePrice: 119.99,
        costPrice: 45.00,
        stockQuantity: 15,
        lowStockThreshold: 5,
        weight: 0.8,
        categoryId: categories[1].id,
        brandId: brands[1].id,
        isActive: true,
        isFeatured: true,
        sortOrder: 2
      },
      {
        name: 'Kawasaki Ninja 300 Chain',
        slug: 'kawasaki-ninja-300-chain',
        description: 'O-ring chain for Kawasaki Ninja 300',
        shortDescription: 'Durable O-ring chain for smooth power transmission',
        sku: 'KAW-NIN300-CH-001',
        price: 129.99,
        comparePrice: 159.99,
        costPrice: 65.00,
        stockQuantity: 8,
        lowStockThreshold: 5,
        weight: 2.1,
        categoryId: categories[0].id,
        brandId: brands[2].id,
        isActive: true,
        isFeatured: false,
        sortOrder: 3
      },
      {
        name: 'Suzuki GSX-R750 Exhaust',
        slug: 'suzuki-gsx-r750-exhaust',
        description: 'Performance exhaust system for Suzuki GSX-R750',
        shortDescription: 'High-performance exhaust for enhanced sound and power',
        sku: 'SUZ-GSXR750-EX-001',
        price: 299.99,
        comparePrice: 399.99,
        costPrice: 150.00,
        stockQuantity: 0,
        lowStockThreshold: 5,
        weight: 5.2,
        categoryId: categories[2].id,
        brandId: brands[3].id,
        isActive: true,
        isFeatured: true,
        sortOrder: 4
      },
      {
        name: 'Ducati Panigale V4 Mirror Set',
        slug: 'ducati-panigale-v4-mirror-set',
        description: 'Carbon fiber mirror set for Ducati Panigale V4',
        shortDescription: 'Lightweight carbon fiber mirrors for sport riding',
        sku: 'DUC-PANV4-MR-001',
        price: 159.99,
        comparePrice: 199.99,
        costPrice: 80.00,
        stockQuantity: 12,
        lowStockThreshold: 5,
        weight: 0.3,
        categoryId: categories[3].id,
        brandId: brands[4].id,
        isActive: true,
        isFeatured: false,
        sortOrder: 5
      }
    ]);
    
    console.log('✅ Products created');
    
    // Create sample product variants
    await ProductVariant.bulkCreate([
      {
        productId: products[0].id,
        name: 'Standard',
        sku: 'YAM-MT09-AF-001-STD',
        price: 45.99,
        stockQuantity: 25,
        isActive: true,
        sortOrder: 1
      },
      {
        productId: products[1].id,
        name: 'Racing',
        sku: 'HON-CBR600-BP-001-RAC',
        price: 89.99,
        stockQuantity: 15,
        isActive: true,
        sortOrder: 1
      },
      {
        productId: products[2].id,
        name: '520 Pitch',
        sku: 'KAW-NIN300-CH-001-520',
        price: 129.99,
        stockQuantity: 8,
        isActive: true,
        sortOrder: 1
      }
    ]);
    
    console.log('✅ Product variants created');
    
    // Create sample product images
    await ProductImage.bulkCreate([
      {
        productId: products[0].id,
        filename: 'yamaha-mt09-air-filter-1.jpg',
        originalName: 'yamaha-mt09-air-filter-1.jpg',
        url: 'https://example.com/images/yamaha-mt09-air-filter-1.jpg',
        altText: 'Yamaha MT-09 Air Filter',
        mimeType: 'image/jpeg',
        size: 1024000,
        width: 800,
        height: 600,
        isPrimary: true,
        sortOrder: 1
      },
      {
        productId: products[1].id,
        filename: 'honda-cbr600rr-brake-pads-1.jpg',
        originalName: 'honda-cbr600rr-brake-pads-1.jpg',
        url: 'https://example.com/images/honda-cbr600rr-brake-pads-1.jpg',
        altText: 'Honda CBR600RR Brake Pads',
        mimeType: 'image/jpeg',
        size: 1200000,
        width: 800,
        height: 600,
        isPrimary: true,
        sortOrder: 1
      }
    ]);
    
    console.log('✅ Product images created');
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample Data Created:');
    console.log(`- 1 Admin user (admin@ridersmotoshop.com / admin123)`);
    console.log(`- ${categories.length} Categories`);
    console.log(`- ${brands.length} Brands`);
    console.log(`- ${products.length} Products`);
    console.log(`- 3 Product Variants`);
    console.log(`- 2 Product Images`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
