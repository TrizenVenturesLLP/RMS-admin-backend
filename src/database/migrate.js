import { sequelize } from '../config/database.js';
import { testConnection } from '../config/database.js';

const migrate = async () => {
  try {
    console.log('🔄 Starting database migration...');
    
    // Test database connection
    await testConnection();
    
    // Sync all models with force to recreate tables
    await sequelize.sync({ force: true });
    
    console.log('✅ Database migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrate();
