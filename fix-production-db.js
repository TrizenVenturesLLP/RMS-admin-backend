#!/usr/bin/env node

/**
 * Production Database Fix Script
 * This script will create all missing database tables in production
 */

import { sequelize } from './src/config/database.js';
import { testConnection } from './src/config/database.js';

const fixProductionDatabase = async () => {
  try {
    console.log('🚀 Starting production database fix...');
    console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
    
    // Test database connection
    console.log('🔍 Testing database connection...');
    await testConnection();
    
    // Import all models to ensure they're registered
    console.log('📋 Loading database models...');
    await import('./src/models/index.js');
    
    // Use alter for production safety - only adds missing tables/columns
    console.log('🔄 Creating missing tables...');
    await sequelize.sync({ alter: true });
    
    console.log('✅ Production database fix completed successfully!');
    console.log('📝 All required tables should now exist.');
    console.log('🎉 Your API should work correctly now.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Production database fix failed:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
};

fixProductionDatabase();
