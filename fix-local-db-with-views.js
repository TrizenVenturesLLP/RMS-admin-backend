#!/usr/bin/env node

/**
 * Local Database Fix Script with View Handling
 * This script will create all missing database tables locally to match production
 * and handle database views that might block migrations
 */

import { sequelize } from './src/config/database.js';
import { testConnection } from './src/config/database.js';

const fixLocalDatabase = async () => {
  try {
    console.log('🚀 Starting local database fix with view handling...');
    console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
    
    // Test database connection
    console.log('🔍 Testing database connection...');
    await testConnection();
    
    // Handle database views that might block migrations
    console.log('🔍 Checking for database views...');
    try {
      // Drop views that might block migrations
      await sequelize.query('DROP VIEW IF EXISTS v_product_categories CASCADE;');
      console.log('✅ Dropped blocking views');
    } catch (error) {
      console.log('ℹ️  No views to drop or views already dropped');
    }
    
    // Import all models to ensure they're registered
    console.log('📋 Loading database models...');
    await import('./src/models/index.js');
    
    // Use force: true to recreate tables (WARNING: This will drop all data!)
    console.log('⚠️  WARNING: This will recreate all tables and drop existing data!');
    console.log('🔄 Recreating all tables...');
    await sequelize.sync({ force: true });
    
    console.log('✅ Local database fix completed successfully!');
    console.log('📝 All required tables should now exist.');
    console.log('🎉 Your local API should now match production.');
    console.log('⚠️  Note: All existing data has been dropped and recreated.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Local database fix failed:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
};

fixLocalDatabase();
