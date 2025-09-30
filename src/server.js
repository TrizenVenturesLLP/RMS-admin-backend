import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import configurations
import { testConnection as testDatabase } from './config/database.js';
import { testConnection as testMinIO } from './config/minio.js';
import { testConnection as testRedis } from './config/redis.js';
import { testEmailConfig } from './utils/email.js';

// Import middleware
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import brandRoutes from './routes/brands.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/users.js';
import mediaRoutes from './routes/media.js';
import publicMediaRoutes from './routes/publicMedia.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
    },
  },
  // Disable nosniff for media files to allow proper image loading
  noSniff: false,
}));

// CORS configuration - temporarily permissive for development
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Riders Moto Shop API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// MinIO status check endpoint
app.get('/api/v1/minio-status', async (req, res) => {
  try {
    const { minioClient } = await import('./config/minio.js');
    const bucketName = process.env.MINIO_BUCKET_NAME || 'riders-moto-media';
    
    // Test MinIO connection
    await minioClient.listBuckets();
    
    // Check if bucket exists
    const bucketExists = await minioClient.bucketExists(bucketName);
    
    res.json({
      success: true,
      message: 'MinIO connection successful',
      bucketName,
      bucketExists,
      endpoint: process.env.MINIO_ENDPOINT,
      port: process.env.MINIO_PORT
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'MinIO connection failed',
      error: error.message,
      endpoint: process.env.MINIO_ENDPOINT,
      port: process.env.MINIO_PORT
    });
  }
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/brands', brandRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/media', mediaRoutes);

// Public media routes (no authentication required) - with permissive CORS
app.use('/api/v1/public/media', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
}, publicMediaRoutes);

// API documentation endpoint
app.get('/api/v1/docs', (req, res) => {
  res.json({
    success: true,
    message: 'API Documentation',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      products: '/api/v1/products',
      categories: '/api/v1/categories',
      brands: '/api/v1/brands',
      orders: '/api/v1/orders',
      users: '/api/v1/users',
      media: '/api/v1/media'
    }
  });
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Initialize server
const startServer = async () => {
  try {
    // Test all connections
    console.log('🔍 Testing connections...');
    
    await testDatabase();
    await testMinIO();
    await testRedis();
    await testEmailConfig();
    
    console.log('✅ All connections successful');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api/v1/docs`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer();

export default app;
