import { sequelize } from './src/config/database.js';
import { User } from './src/models/index.js';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ 
      where: { email: 'admin@ridersmotoshop.com' } 
    });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('📧 Email: admin@ridersmotoshop.com');
      console.log('👤 Role:', existingAdmin.role);
      return;
    }
    
    // Create admin user
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await User.create({
      email: 'admin@ridersmotoshop.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true,
      emailVerified: true
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@ridersmotoshop.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

createAdmin();
