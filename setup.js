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
    fs.copyFileSync('env.production', '.env');
    console.log('✅ .env file created successfully from env.production');
    console.log('✅ Application configured to use production services\n');
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
console.log('1. The application is configured to use production services');
console.log('2. No local database setup required');
console.log('3. Start the development server: npm run dev');
console.log('4. Create admin user (optional): npm run create-admin');
console.log('\n🔗 Useful Commands:');
console.log('- npm run dev          # Start development server');
console.log('- npm run create-admin # Create admin user');
console.log('- npm test             # Run tests');
console.log('- npm run lint         # Run ESLint');
console.log('\n📚 Documentation:');
console.log('- API Documentation: http://localhost:3001/api/v1/docs');
console.log('- Health Check: http://localhost:3001/health');
console.log('\n🆘 Need Help?');
console.log('- Check the README.md file for detailed instructions');
console.log('- Application uses production database and services');
