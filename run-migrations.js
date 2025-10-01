import { sequelize } from './src/config/database.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runMigrations = async () => {
  try {
    console.log('🚀 Starting database migrations...\n');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established\n');

    // Read migration files in order
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = [
      '001-add-enhanced-fields.sql',
      '002-create-many-to-many-tables.sql'
    ];

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      
      try {
        console.log(`📄 Running migration: ${file}`);
        const sql = await fs.readFile(filePath, 'utf8');
        
        // Execute the migration
        await sequelize.query(sql);
        
        console.log(`✅ Migration ${file} completed successfully\n`);
      } catch (error) {
        console.error(`❌ Error running migration ${file}:`, error.message);
        throw error;
      }
    }

    console.log('🎉 All migrations completed successfully!');
    console.log('\n📊 Database Summary:');
    
    // Show summary
    const [results] = await sequelize.query(`
      SELECT 
        'products' as table_name,
        COUNT(*) as total_rows
      FROM products
      UNION ALL
      SELECT 
        'categories' as table_name,
        COUNT(*) as total_rows
      FROM categories
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
    `);
    
    console.table(results);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

runMigrations();

