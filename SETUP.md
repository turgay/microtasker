# MicroTasker Setup Guide

This guide will help you set up MicroTasker with Neon DB authentication and user-specific task management.

## Prerequisites

- Node.js 18+ and npm
- A Neon account (https://neon.tech)
- Git

## Backend Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Database Setup

1. **Create a Neon Project**:
   - Go to https://neon.tech and create a new project
   - Copy your database connection string

2. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Neon database URL:
   ```env
   DATABASE_URL=postgresql://username:password@ep-example-123456.us-east-1.aws.neon.tech/neondb?sslmode=require
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

3. **Generate and Run Database Migrations**:
   ```bash
   # Generate migration files
   npx drizzle-kit generate:pg
   
   # Push schema to database
   npx drizzle-kit push:pg
   ```

### 3. Start Backend Server

```bash
npm run dev
```

The API server will start on http://localhost:3001

## Frontend Setup

### 1. Install Dependencies

```bash
# From project root
npm install
```

### 2. Configure Environment Variables

Create `.env.local` in the project root:
```env
VITE_API_URL=http://localhost:3001/api
```

### 3. Start Frontend Development Server

```bash
npm run dev
```

The frontend will start on http://localhost:5173

## Database Schema

The application uses two main tables:

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `name` (String, Optional)
- `password_hash` (String)
- `created_at` (Timestamp)
- `last_login` (Timestamp)

### Tasks Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to users.id)
- `title` (String)
- `category` (Enum: Read, Write, Speak, Learn, Pray, Break, Build)
- `tags` (String Array)
- `priority` (Enum: High, Medium, Low)
- `completed` (Boolean)
- `repeat` (Enum: daily, weekly, custom, none)
- `time_estimate` (Enum: 2-5 min, 5-10 min, 10+ min)
- `due_date` (Timestamp, Optional)
- `completed_at` (Timestamp, Optional)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Tasks (Authenticated)
- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/:id` - Get specific task

## Features

### Landing Page
- Hero section with value proposition
- Feature highlights
- Category preview
- Call-to-action buttons

### Authentication
- User registration with validation
- Secure login with JWT tokens
- Password strength requirements
- Form validation and error handling

### Task Management
- User-specific task storage
- Seven life categories (Read, Write, Speak, Learn, Pray, Break, Build)
- Priority levels and time estimates
- Due date scheduling
- Progress tracking

### Dashboard Views
- **Backlog**: All unscheduled tasks
- **Planning**: Schedule and organize tasks
- **Today**: Focus on today's priorities
- **Progress**: Track completion and productivity

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token authentication
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Input validation and sanitization
- SQL injection protection via Drizzle ORM

## Development

### Backend Development
```bash
cd server
npm run dev  # Starts with nodemon for auto-reload
```

### Frontend Development
```bash
npm run dev  # Starts Vite dev server
```

### Database Operations
```bash
# Generate new migration
npx drizzle-kit generate:pg

# Push schema changes
npx drizzle-kit push:pg

# View database in Drizzle Studio
npx drizzle-kit studio
```

## Production Deployment

### Backend
1. Set production environment variables
2. Build the application: `npm run build`
3. Start with: `npm start`

### Frontend
1. Build for production: `npm run build`
2. Deploy the `dist` folder to your hosting service

### Database
- Neon automatically handles production database scaling
- Ensure connection pooling is configured for high traffic

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Verify your Neon database URL is correct
   - Check that your IP is whitelisted in Neon console

2. **CORS Errors**:
   - Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
   - Check that both servers are running

3. **Authentication Issues**:
   - Verify JWT_SECRET is set in backend environment
   - Check that tokens are being sent in Authorization header

4. **Build Errors**:
   - Run `npm install` in both root and server directories
   - Ensure all environment variables are set

### Logs
- Backend logs: Check console output from `npm run dev`
- Frontend logs: Check browser developer console
- Database logs: Available in Neon console

## Support

For issues specific to:
- **Neon Database**: https://neon.tech/docs
- **Drizzle ORM**: https://orm.drizzle.team
- **React/Vite**: https://vitejs.dev/guide
