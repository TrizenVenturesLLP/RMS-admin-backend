#!/bin/bash

# Complete HT Exhaust Data Fix Deployment Script
# This script fixes both local and production environments

echo "🚀 Starting complete HT Exhaust data fix deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in the riders-moto-backend directory"
    exit 1
fi

echo "📋 Current directory: $(pwd)"
echo "🌍 Environment: ${NODE_ENV:-development}"

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

# Run the comprehensive fix script
echo "🔧 Running comprehensive environment fix..."
node fix-both-environments.js

# Check if the fix was successful
if [ $? -eq 0 ]; then
    echo "✅ Environment fix completed successfully!"
    echo "📊 Categories should now be 200+"
    echo "🎉 Both local and production environments are now synchronized!"
else
    echo "❌ Environment fix failed!"
    exit 1
fi

echo "🚀 Deployment complete!"
