# 🚀 Quick Start Guide

## Simplified Setup (No Docker, No Migrations)

### 1. Install Dependencies
```bash
npm run setup
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Access the Application
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/v1/docs
- **Health Check**: http://localhost:3001/health

### 4. Create Admin User (Optional)
```bash
npm run create-admin
```

## What's Different?

✅ **No Docker required** - Uses production services directly  
✅ **No migrations needed** - Database is already set up  
✅ **No local database setup** - Connects to production PostgreSQL  
✅ **No Redis setup** - Uses production Redis  
✅ **No MinIO setup** - Uses production MinIO  

## Environment Configuration

The application automatically uses:
- **Database**: External PostgreSQL on CapRover (port 5433)
- **Cache**: Production Redis on CapRover
- **Storage**: Production MinIO on CapRover
- **Port**: 3001 (development)

**Note**: External PostgreSQL access requires port mapping configuration in CapRover. See `EXTERNAL_DB_SETUP.md` for setup instructions.

## Frontend Integration

The shop frontend automatically connects to:
- **Development**: http://localhost:3001/api/v1
- **Production**: https://rmsadminbackend.llp.trizenventures.com/api/v1

## Troubleshooting

### Connection Issues
- Ensure you have internet connection (uses production services)
- Check if production services are running

### Port Conflicts
- Backend runs on port 3001
- Frontend runs on port 8080 (shop), 5173 (admin), 5175 (launch)

### Environment Variables
- `.env` file is created automatically from `env.production`
- No manual configuration needed

## Development Workflow

1. **Start backend**: `npm run dev`
2. **Start frontend**: `cd riders-moto-shop && npm run dev`
3. **Make changes** - Hot reload enabled
4. **Test** - Uses production data
5. **Deploy** - Push to repository (auto-deploys to CapRover)

## Benefits

- 🚀 **Faster setup** - No local services to configure
- 🔄 **Same data** - Development uses production data
- 🛠️ **Simpler workflow** - No migration scripts
- 📦 **Less dependencies** - Only Node.js required
- 🌐 **Always up-to-date** - Production data is current
