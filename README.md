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

**Note:** The application uses production services (PostgreSQL, Redis, MinIO) hosted on CapRover. No local services are required.

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd riders-moto-backend
   ```

2. **Run setup**
   ```bash
   npm run setup
   ```
   This will install dependencies and create the .env file from the production template.

3. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

**Note:** The application is configured to use production services (database, Redis, MinIO) for both local and production environments. No local database setup is required.

## 🌐 Environment Variables

The application uses a unified configuration that connects to production services. The `.env` file is automatically created from `env.production` during setup.

**Key Configuration:**
- **Database**: External PostgreSQL on CapRover (port 5433)
- **Redis**: Production Redis on CapRover
- **MinIO**: Production MinIO on CapRover
- **Port**: 3001 (development), 80 (production)

**Note**: External PostgreSQL access requires port mapping configuration. See `EXTERNAL_DB_SETUP.md` for setup instructions.

**Environment-based URLs:**
- **Development**: `http://localhost:3001`
- **Production**: `https://rmsadminbackend.llp.trizenventures.com`


## 📚 API Documentation

### Base URL
```
http://localhost:3001/api/v1
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

### CapRover Deployment
The application is deployed on CapRover using the `captain-definition` file.

### Environment Setup
1. Application uses production services automatically
2. No local database setup required
3. Environment variables are pre-configured
4. No migrations needed - database is already set up

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
- `npm run create-admin` - Create admin user
- `npm run setup` - Initial setup (install deps, create .env)
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## 🔧 External Integrations

The application uses production services hosted on CapRover:

### Production Services
1. **PostgreSQL Database** - `srv-captain--rms-postgres`
2. **Redis Cache** - `srv-captain--rms-redis`
3. **MinIO Storage** - `rms-minio-api.llp.trizenventures.com`

### Optional Integrations
- **Stripe**: For payment processing
- **Email Service**: SMTP configuration for notifications

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
