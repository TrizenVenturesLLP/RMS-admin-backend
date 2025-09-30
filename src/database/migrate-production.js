import { sequelize } from '../config/database.js';
import { testConnection } from '../config/database.js';

const migrateProduction = async () => {
  try {
    console.log('🔄 Starting production database migration...');
    
    // Test database connection
    await testConnection();
    
    // Import all models to ensure they're registered
    import('../models/index.js');
    
    // Use alter for production safety - only adds missing tables/columns
    console.log('Using production-safe migration (alter: true)');
    await sequelize.sync({ alter: true });
    
    console.log('✅ Production database migration completed successfully');
    console.log('📋 All tables should now exist in the database');
    process.exit(0);
  } catch (error) {
    console.error('❌ Production migration failed:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
};

migrateProduction();
