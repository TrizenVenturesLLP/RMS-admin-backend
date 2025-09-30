@echo off
echo 🚀 Deploying database migration to production...

REM Set production environment
set NODE_ENV=production

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    exit /b 1
)

echo 📋 Current directory: %CD%
echo 🌍 Environment: %NODE_ENV%

REM Install dependencies if needed
echo 📦 Installing dependencies...
npm install

REM Check current database state
echo 🔍 Checking current database tables...
npm run check-tables

REM Run production migration
echo 🔄 Running production database migration...
npm run migrate:prod

REM Verify tables were created
echo ✅ Verifying tables were created...
npm run check-tables

echo 🎉 Migration deployment completed!
echo 📝 Your production API should now work correctly.
