#!/usr/bin/env node

/**
 * Create Admin User Script
 * This script creates the default admin user for production
 */

import { sequelize } from './src/config/database.js';
import { testConnection } from './src/config/database.js';
import { User } from './src/models/index.js';
import bcrypt from 'bcryptjs';

const createAdminUser = async () => {
  try {
    console.log('🚀 Creating admin user...');
    console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
    
    // Test database connection
    console.log('🔍 Testing database connection...');
    await testConnection();
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ 
      where: { email: 'admin@ridersmotoshop.com' } 
    });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Role:', existingAdmin.role);
      console.log('🟢 Active:', existingAdmin.isActive);
      process.exit(0);
    }
    
    // Create admin user
    console.log('👤 Creating admin user...');
    const adminUser = await User.create({
      email: 'admin@ridersmotoshop.com',
      password: 'admin123',
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
    console.log('🎉 You can now login to the admin dashboard!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
};

createAdminUser();
