# ClothingCraft Management System

A comprehensive MERN stack application for managing clothing orders with role-based access control and modern UI design.

## 🚀 Features

### Multi-Role Dashboard System
- **Admin**: Complete system oversight, tailor assignment, analytics
- **Visitor**: Order creation for customers, commission tracking
- **Customer**: Order placement and tracking
- **Tailor**: Order fulfillment and status updates

### Core Functionality
- JWT-based authentication with secure token management
- Role-based access control and route protection
- Real-time order status tracking
- Commission calculation for visitors
- Responsive design with modern UI components
- Complete order lifecycle management

## 🛠 Technology Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** enabled for cross-origin requests

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **React Hook Form** for form management
- **Axios** for API communication
- **Lucide React** for icons

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Environment Variables
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/clothing-orders

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRES_IN=7d

# Client URL
CLIENT_URL=http://localhost:5173
```

### Installation Steps

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Start MongoDB**
   Make sure MongoDB is running on your system

3. **Seed the database with demo data**
   ```bash
   npm run seed
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 👥 Demo Accounts

The system comes with pre-seeded demo accounts:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Admin | admin@clothingstore.com | admin123 | Full system access |
| Customer | sarah@example.com | customer123 | Order placement & tracking |
| Visitor | mike@example.com | visitor123 | Customer order creation |
| Tailor | emma@example.com | tailor123 | Order fulfillment |

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Orders
- `GET /api/orders` - Get orders (role-filtered)
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/assign-tailor` - Assign tailor (Admin only)
- `PUT /api/orders/:id/status` - Update order status

### Users
- `GET /api/users/tailors` - Get available tailors (Admin only)
- `GET /api/users/customers` - Get customers (Visitor/Admin)
- `GET /api/users/dashboard-stats` - Get dashboard statistics

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Professional blue/indigo theme with semantic colors
- **Typography**: Consistent font hierarchy with proper line spacing
- **Spacing**: 8px grid system for consistent layouts
- **Components**: Reusable UI components with hover states and animations

### Responsive Design
- **Mobile-first**: Optimized for mobile devices
- **Breakpoints**: Tailored layouts for mobile, tablet, and desktop
- **Accessibility**: Proper contrast ratios and keyboard navigation

### Interactive Elements
- **Loading States**: Smooth loading animations
- **Form Validation**: Real-time validation with helpful error messages
- **Status Updates**: Visual feedback for all user actions
- **Micro-interactions**: Subtle animations and transitions

## 📊 Role-Specific Features

### Admin Dashboard
- System-wide analytics and metrics
- Order management with filtering and sorting
- Tailor assignment and workload distribution
- User management and system oversight

### Visitor Dashboard
- Customer order creation with detailed forms
- Commission tracking and earnings reports
- Order history and status monitoring
- Customer relationship management

### Customer Dashboard
- Intuitive order placement with measurement guides
- Real-time order tracking and status updates
- Order history with detailed information
- Profile management and preferences

### Tailor Dashboard
- Assigned order queue with priority indicators
- Status update tools with completion notes
- Workload management and scheduling
- Customer measurement access

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Role-based Access**: Middleware-protected routes
- **Input Validation**: Server-side validation for all endpoints
- **CORS Configuration**: Properly configured cross-origin requests

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
```

### Environment Configuration
Update environment variables for production:
- Use strong JWT secrets
- Configure production MongoDB URI
- Set NODE_ENV=production
- Update CORS origins

### Recommended Deployment Platforms
- **Backend**: Heroku, DigitalOcean, AWS EC2
- **Database**: MongoDB Atlas, AWS DocumentDB
- **Frontend**: Netlify, Vercel, AWS S3 + CloudFront

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env file

2. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing processes on the port

3. **CORS Errors**
   - Verify CLIENT_URL in .env matches frontend URL
   - Check CORS configuration in server.js

4. **Authentication Issues**
   - Clear localStorage and cookies
   - Verify JWT_SECRET is set correctly

For additional support, please open an issue in the repository.