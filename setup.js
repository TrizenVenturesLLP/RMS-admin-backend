#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Riders Moto Shop Backend Setup');
console.log('=====================================\n');

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.log('📝 Creating .env file from template...');
  try {
    fs.copyFileSync('env.example', '.env');
    console.log('✅ .env file created successfully');
    console.log('⚠️  Please update the .env file with your configuration\n');
  } catch (error) {
    console.error('❌ Failed to create .env file:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists\n');
}

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
  console.error('❌ Node.js version 18 or higher is required');
  console.error(`Current version: ${nodeVersion}`);
  process.exit(1);
} else {
  console.log(`✅ Node.js version ${nodeVersion} is compatible\n`);
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully\n');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

console.log('🎉 Setup completed successfully!');
console.log('\n📋 Next Steps:');
console.log('1. Update your .env file with correct database and service credentials');
console.log('2. Start PostgreSQL, Redis, and MinIO services');
console.log('3. Run database migration: npm run migrate');
console.log('4. Seed the database: npm run seed');
console.log('5. Start the development server: npm run dev');
console.log('\n🔗 Useful Commands:');
console.log('- npm run dev          # Start development server');
console.log('- npm run migrate      # Run database migrations');
console.log('- npm run seed         # Seed database with sample data');
console.log('- npm test             # Run tests');
console.log('- npm run lint         # Run ESLint');
console.log('\n📚 Documentation:');
console.log('- API Documentation: http://localhost:3000/api/v1/docs');
console.log('- Health Check: http://localhost:3000/health');
console.log('\n🆘 Need Help?');
console.log('- Check the README.md file for detailed instructions');
console.log('- Ensure all external services (PostgreSQL, Redis, MinIO) are running');
