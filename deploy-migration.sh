#!/bin/bash

echo "🚀 Deploying database migration to production..."

# Set production environment
export NODE_ENV=production

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "📋 Current directory: $(pwd)"
echo "🌍 Environment: $NODE_ENV"

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

# Check current database state
echo "🔍 Checking current database tables..."
npm run check-tables

# Run production migration
echo "🔄 Running production database migration..."
npm run migrate:prod

# Verify tables were created
echo "✅ Verifying tables were created..."
npm run check-tables

echo "🎉 Migration deployment completed!"
echo "📝 Your production API should now work correctly."
