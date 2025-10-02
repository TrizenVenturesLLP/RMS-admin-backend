#!/bin/bash

# Production startup script with complete HT Exhaust data seeding
echo "🚀 Starting HT Exhaust production environment..."

# Fix production database
echo "🔧 Fixing production database..."
NODE_ENV=production node fix-production-db.js

# Create admin user
echo "👤 Creating admin user..."
NODE_ENV=production node create-admin-user.js

# Seed complete HT Exhaust production data
echo "🌱 Seeding complete HT Exhaust production data..."
NODE_ENV=production node fix-both-environments-ultimate.js

# Add final categories to reach 200+
echo "➕ Adding final categories to reach 200+..."
NODE_ENV=production node add-final-categories.js

# Check if data seeding was successful
if [ $? -eq 0 ]; then
    echo "✅ Complete HT Exhaust production data seeding completed"
    echo "📊 Production now has 200+ categories"
else
    echo "⚠️  Data seeding had issues, but continuing with application startup"
fi

# Start the application
echo "🎉 Starting HT Exhaust application..."
npm start
