import { sequelize } from '../config/database.js';

const addBikeFields = async () => {
  try {
    console.log('🚀 Adding bike fields to users table...');
    
    // Test database connection first
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    
    // Add bikeBrand column
    console.log('📝 Adding bikeBrand column...');
    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS bikeBrand VARCHAR(50) NULL
    `);
    console.log('✅ bikeBrand column added');
    
    // Add bikeModel column
    console.log('📝 Adding bikeModel column...');
    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS bikeModel VARCHAR(50) NULL
    `);
    console.log('✅ bikeModel column added');
    
    console.log('✅ Successfully added bike fields to users table');
    
    // Show the updated table structure (PostgreSQL syntax)
    const [results] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Updated users table structure:');
    results.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} ${row.is_nullable === 'YES' ? '(nullable)' : '(required)'}`);
    });
    
  } catch (error) {
    console.error('❌ Error adding bike fields:', error);
    throw error;
  }
};

// Run the migration if this file is executed directly
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.argv[1] === __filename) {
  console.log('✅ Running migration...');
  addBikeFields()
    .then(() => {
      console.log('🎉 Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

export default addBikeFields;
