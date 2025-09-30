import { sequelize } from '../config/database.js';
import { testConnection } from '../config/database.js';

const migrate = async () => {
  try {
    console.log('🔄 Starting database migration...');
    
    // Test database connection
    await testConnection();
    
    // Import all models to ensure they're registered
    import('../models/index.js');
    
    // Sync all models - use alter for production safety
    const isProduction = process.env.NODE_ENV === 'production';
    const syncOptions = isProduction 
      ? { alter: true }  // Safe for production - only adds missing columns/tables
      : { force: true }; // Development - recreates everything
    
    console.log(`Using sync option: ${JSON.stringify(syncOptions)}`);
    await sequelize.sync(syncOptions);
    
    console.log('✅ Database migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrate();
