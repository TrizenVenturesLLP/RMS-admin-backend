import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// CORS configuration - permissive for development
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));

app.use(express.json());

// Test routes
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Test server is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/v1/categories', (req, res) => {
  res.json({
    success: true,
    data: {
      categories: [
        { id: '1', name: 'Exhaust System' },
        { id: '2', name: 'Brakes' },
        { id: '3', name: 'Engine' }
      ]
    }
  });
});

app.get('/api/v1/brands', (req, res) => {
  res.json({
    success: true,
    data: {
      brands: [
        { id: '1', name: 'Suzuki' },
        { id: '2', name: 'Yamaha' },
        { id: '3', name: 'Honda' }
      ]
    }
  });
});

app.get('/api/v1/products', (req, res) => {
  res.json({
    success: true,
    data: {
      products: [
        { id: '1', name: 'Test Product', price: 100, sku: 'TEST001' }
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 1
      }
    }
  });
});

// Add POST route for creating products (no authentication required for testing)
app.post('/api/v1/products', (req, res) => {
  console.log('Creating product:', req.body);
  res.json({
    success: true,
    message: 'Product created successfully',
    data: {
      product: {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
});
