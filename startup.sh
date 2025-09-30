#!/bin/sh

echo "🚀 Starting Node.js application..."

# Wait for external services to be ready
echo "⏳ Waiting for external services..."
sleep 10

# Display environment check
echo "🔍 Environment check:"
echo "REDIS_HOST= $REDIS_HOST"
echo "REDIS_PORT= $REDIS_PORT" 
echo "REDIS_PASSWORD= $REDIS_PASSWORD"
echo "DB_HOST= $DB_HOST"
echo "MINIO_ENDPOINT= $MINIO_ENDPOINT"

# Run database migration
echo "🔄 Running database migration..."
NODE_ENV=production node fix-production-db.js

# Check if migration was successful
if [ $? -eq 0 ]; then
    echo "✅ Database migration completed successfully"
else
    echo "⚠️  Database migration had issues, but continuing with application startup"
    echo "💡 If you see database errors, the tables may need to be created manually"
fi

# Create admin user
echo "👤 Creating admin user..."
NODE_ENV=production node create-admin-user.js

# Check if admin user creation was successful
if [ $? -eq 0 ]; then
    echo "✅ Admin user setup completed"
else
    echo "⚠️  Admin user creation had issues, but continuing with application startup"
fi

# Start the application
echo "🚀 Starting application server..."
exec node src/server.js
