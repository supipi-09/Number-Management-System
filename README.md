# Number Management System

A comprehensive telecom number management system with role-based access control, built with React, Node.js, Express, and MongoDB.

## 🚀 Features

### Authentication & Authorization

- JWT-based authentication
- Role-based access control (Admin/Number Manager)
- Secure password hashing with bcrypt
- Protected routes and API endpoints

### Dashboard & Analytics

- Real-time statistics and KPIs
- Interactive charts and data visualization
- Monthly allocation trends
- Service type distribution analysis
- System health monitoring

### Number Management

- Complete CRUD operations for phone numbers
- Advanced filtering and search capabilities
- Status management (Available, Allocated, Reserved, Held, Quarantined)
- Service type categorization (LTE, IPTL, FTTH/Copper)
- Special type classification (Elite, Gold, Platinum, Silver, Standard)
- Bulk CSV import functionality

### Activity Logging

- Comprehensive audit trail
- User attribution for all actions
- Searchable log history
- Action tracking and timestamps

### User Management (Admin Only)

- User creation and management
- Role assignment and permissions
- Account activation/deactivation
- User activity statistics

## 🏗️ Project Structure

```
Number Management System/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── theme.ts        # Material-UI theme
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── scripts/        # Utility scripts
│   │   ├── types/          # TypeScript types
│   │   └── server.ts       # Main server file
│   ├── package.json
│   └── tsconfig.json
├── package.json            # Root package.json
└── README.md
```

## 🛠️ Technology Stack

### Frontend

- **React 18** with TypeScript
- **Material-UI (MUI)** for components and theming
- **React Router** for navigation
- **Recharts** for data visualization
- **Axios** for API communication
- **Vite** for build tooling

### Backend

- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **Multer** for file uploads
- **Express Rate Limit** for API protection

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd number-management-system
   ```

2. **Install dependencies**

   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   ```bash
   cd server
   cp .env.example .env
   ```

   Edit the `.env` file with your configuration:

   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/number_management
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:3000
   ```

4. **Start MongoDB**

   - Local: Start your MongoDB service
   - Atlas: Ensure your cluster is running and update the connection string

5. **Seed the database (optional)**

   ```bash
   npm run seed
   ```

6. **Start the development servers**

   ```bash
   npm run dev
   ```

   This will start both the client (http://localhost:3000) and server (http://localhost:5000) concurrently.

## 🔐 Demo Credentials

### Admin Account

- **Username:** admin
- **Password:** admin123
- **Permissions:** Full system access

### Number Manager Account

- **Username:** numbermanager
- **Password:** manager123
- **Permissions:** Number management and viewing

## 📊 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update` - Update user profile
- `POST /api/auth/register` - Register new user (admin only)

### Numbers

- `GET /api/numbers` - Get all numbers with filtering
- `GET /api/numbers/:id` - Get specific number
- `POST /api/numbers` - Create new number (admin only)
- `PUT /api/numbers/:id` - Update number
- `POST /api/numbers/import` - Bulk import CSV (admin only)
- `GET /api/numbers/stats/summary` - Get number statistics

### Logs

- `GET /api/logs` - Get activity logs
- `GET /api/logs/number/:number` - Get logs for specific number
- `GET /api/logs/stats` - Get log statistics

### Users (Admin Only)

- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Deactivate user
- `GET /api/users/stats` - Get user statistics

### Dashboard

- `GET /api/dashboard/summary` - Get dashboard summary
- `GET /api/dashboard/analytics` - Get analytics data
- `GET /api/dashboard/health` - Get system health (admin only)

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcrypt with salt rounds
- **Rate Limiting** to prevent API abuse
- **CORS Configuration** for cross-origin requests
- **Input Validation** using express-validator
- **Role-Based Access Control** for API endpoints
- **Helmet.js** for security headers

## 📱 Responsive Design

The application is fully responsive and optimized for:

- Desktop computers (1920px and above)
- Laptops (1024px - 1919px)
- Tablets (768px - 1023px)
- Mobile devices (320px - 767px)

## 🧪 Development Scripts

### Root Level

- `npm run dev` - Start both client and server in development mode
- `npm run install:all` - Install dependencies for all packages
- `npm run seed` - Seed the database with sample data

### Client

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Server

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run seed` - Seed database with sample data

## 🚀 Deployment

### Frontend (Client)

1. Build the client: `cd client && npm run build`
2. Deploy the `dist` folder to your hosting service (Netlify, Vercel, etc.)

### Backend (Server)

1. Build the server: `cd server && npm run build`
2. Deploy to your hosting service (Heroku, Railway, DigitalOcean, etc.)
3. Set environment variables on your hosting platform
4. Ensure MongoDB is accessible from your hosting environment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
CLIENT_URL=your-production-client-url
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the API endpoints and examples

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
  - User authentication and authorization
  - Number management system
  - Dashboard and analytics
  - Activity logging
  - CSV import functionality
  - Responsive design

---

**Number Management System** - A comprehensive solution for telecom number management with modern web technologies.
