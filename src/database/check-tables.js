import { sequelize } from '../config/database.js';
import { testConnection } from '../config/database.js';

const checkTables = async () => {
  try {
    console.log('🔍 Checking database tables...');
    
    // Test database connection
    await testConnection();
    
    // Query to check if tables exist
    const query = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'categories', 'brands', 'products', 'product_images', 'product_variants', 'orders', 'order_items', 'media')
      ORDER BY table_name;
    `;
    
    const [results] = await sequelize.query(query);
    
    console.log('📋 Existing tables:');
    if (results.length === 0) {
      console.log('❌ No tables found! Database needs migration.');
    } else {
      results.forEach(row => {
        console.log(`✅ ${row.table_name}`);
      });
    }
    
    const expectedTables = ['users', 'categories', 'brands', 'products', 'product_images', 'product_variants', 'orders', 'order_items', 'media'];
    const existingTableNames = results.map(row => row.table_name);
    const missingTables = expectedTables.filter(table => !existingTableNames.includes(table));
    
    if (missingTables.length > 0) {
      console.log('\n❌ Missing tables:');
      missingTables.forEach(table => {
        console.log(`   - ${table}`);
      });
      console.log('\n💡 Run migration to create missing tables:');
      console.log('   npm run migrate:prod');
    } else {
      console.log('\n✅ All required tables exist!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to check tables:', error);
    process.exit(1);
  }
};

checkTables();
