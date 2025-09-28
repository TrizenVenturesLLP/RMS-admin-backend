#!/bin/bash

# Setup script for local development

echo "🚀 Setting up Riders Moto Backend for local development..."

# Copy local environment file
echo "📋 Setting up environment variables..."
cp env.local .env

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

# Run database migration
echo "🗄️ Running database migrations..."
npm run migrate

# Run database seeding (optional)
echo "🌱 Seeding database..."
npm run seed

echo "✅ Local setup complete!"
echo ""
echo "📡 Services are running:"
echo "  - PostgreSQL: localhost:5432"
echo "  - Redis: localhost:6379"
echo "  - MinIO: localhost:9000 (Console: localhost:9001)"
echo ""
echo "🚀 Start your backend with: npm run dev"
echo "🔗 Your API will be available at: http://localhost:3001"
