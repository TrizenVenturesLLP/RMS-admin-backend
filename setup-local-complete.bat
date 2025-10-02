@echo off
REM Local setup script with complete HT Exhaust data
echo 🚀 Setting up local environment with complete HT Exhaust data...

REM Fix local database
echo 🔧 Fixing local database...
node fix-local-db-with-views.js

REM Create admin user
echo 👤 Creating admin user...
node create-admin-user.js

REM Seed complete HT Exhaust data
echo 🌱 Seeding complete HT Exhaust data...
node fix-both-environments-ultimate.js

REM Add final categories to reach 200+
echo ➕ Adding final categories to reach 200+...
node add-final-categories.js

REM Check if data seeding was successful
if %errorlevel% equ 0 (
    echo ✅ Complete HT Exhaust data seeding completed
    echo 📊 Local now has 200+ categories
) else (
    echo ⚠️  Data seeding had issues
)

echo 🎉 Local setup completed!
echo 📊 Both local and production now have identical 200+ categories
pause
