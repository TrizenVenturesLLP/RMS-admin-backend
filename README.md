# Riders Moto Shop Backend API

A comprehensive backend API for the Riders Moto Shop ecosystem, built with Node.js, Express, PostgreSQL, and MinIO.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Product Management**: Full CRUD operations for products, categories, and brands
- **Order Processing**: Complete order management system
- **File Storage**: MinIO integration for media management
- **Email System**: Automated email notifications
- **Caching**: Redis for session management and caching
- **Security**: Rate limiting, CORS, helmet, input validation

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **File Storage**: MinIO
- **Cache**: Redis
- **Authentication**: JWT
- **Email**: Nodemailer
- **Validation**: Joi
- **File Processing**: Sharp
- **Security**: Helmet, CORS, Rate Limiting

## 📋 Prerequisites

Before running the application, make sure you have the following installed:

- Node.js 18 or higher
- PostgreSQL 12 or higher
- Redis 6 or higher
- MinIO server

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd riders-moto-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your configuration.

4. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb riders_moto_shop
   
   # Run migrations
   npm run migrate
   
   # Seed the database (optional)
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 🌐 Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=riders_moto_shop
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRE=30d

# MinIO Configuration
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=riders-moto-media

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Payment Gateway
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh token
- `GET /auth/me` - Get current user
- `PUT /auth/profile` - Update profile
- `POST /auth/logout` - Logout user

### Product Endpoints
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product (Staff/Admin)
- `PUT /products/:id` - Update product (Staff/Admin)
- `DELETE /products/:id` - Delete product (Staff/Admin)

### Category Endpoints
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create category (Staff/Admin)
- `PUT /categories/:id` - Update category (Staff/Admin)
- `DELETE /categories/:id` - Delete category (Staff/Admin)

### Order Endpoints
- `GET /orders` - Get user orders
- `GET /orders/:id` - Get order by ID
- `POST /orders` - Create order
- `PUT /orders/:id/status` - Update order status (Staff/Admin)

## 🔒 Authentication

The API uses JWT-based authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🗄️ Database Schema

### Core Tables
- **Users**: User accounts and authentication
- **Categories**: Product categories with hierarchy
- **Brands**: Product brands
- **Products**: Product catalog
- **ProductImages**: Product images
- **Orders**: Customer orders
- **OrderItems**: Order line items
- **Media**: File storage metadata

## 🚀 Deployment

### Docker Deployment
```bash
# Build the image
docker build -t riders-moto-backend .

# Run the container
docker run -p 3000:3000 riders-moto-backend
```

### Environment Setup
1. Set up PostgreSQL database
2. Configure MinIO server
3. Set up Redis instance
4. Configure environment variables
5. Run database migrations

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server
- `npm test` - Run tests
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## 🔧 External Integrations

### Required Services
1. **PostgreSQL Database**
   - Install PostgreSQL
   - Create database: `riders_moto_shop`
   - Update connection string in `.env`

2. **MinIO Server**
   - Download and install MinIO
   - Start MinIO server
   - Create bucket: `riders-moto-media`

3. **Redis Server**
   - Install Redis
   - Start Redis server
   - Configure connection in `.env`

4. **Email Service**
   - Configure SMTP settings
   - For Gmail: Use App Password
   - Update email configuration in `.env`

### Optional Integrations
- **Stripe**: For payment processing
- **Elasticsearch**: For advanced search
- **CDN**: For file delivery optimization

## 🛡️ Security Features

- JWT-based authentication
- Role-based access control
- Rate limiting
- Input validation
- CORS protection
- Helmet security headers
- Password hashing with bcrypt
- SQL injection prevention

## 📊 Monitoring

- Health check endpoint: `/health`
- API documentation: `/api/v1/docs`
- Error logging and handling
- Request logging with Morgan

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.
