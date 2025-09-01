# TaskManager - Complete Setup Guide

This guide will help you set up the complete TaskManager application with both the React Native frontend and Node.js backend.

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **React Native development environment** (for mobile development)
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

## Project Structure

```
TaskManager/
├── backend/                 # Node.js backend API
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── server.js           # Main server file
│   ├── setup.js            # Database setup script
│   └── package.json        # Backend dependencies
├── src/                    # React Native frontend
│   ├── components/         # Reusable components
│   ├── screens/            # App screens
│   ├── services/           # API services
│   ├── stores/             # State management
│   └── ...
└── package.json            # Frontend dependencies
```

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
```bash
# Copy the example environment file
cp env.example .env
```

Edit the `.env` file with your configuration:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/taskmanager
# For MongoDB Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/taskmanager

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 4. Set Up MongoDB

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Create database: `taskmanager`

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env`

### 5. Initialize Database with Sample Data
```bash
npm run setup
```

This will create:
- A sample user: `demo@example.com` / `password123`
- Sample tasks for testing

### 6. Start the Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## Frontend Setup

### 1. Install Frontend Dependencies
```bash
# From the root directory
npm install
```

### 2. Configure API Base URL

Edit `src/services/api.ts` and update the `API_BASE_URL`:
```typescript
const API_BASE_URL = 'http://localhost:5000/api';
```

**For Android Emulator**: Use `http://10.0.2.2:5000/api`
**For iOS Simulator**: Use `http://localhost:5000/api`
**For Physical Device**: Use your computer's IP address

### 3. Start Metro Bundler
```bash
npm start
```

### 4. Run on Device/Simulator

#### Android
```bash
npm run android
```

#### iOS (macOS only)
```bash
npm run ios
```

## Testing the Setup

### 1. Backend Health Check
Visit `http://localhost:5000/api/health` in your browser or use curl:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "TaskManager API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Test Authentication
Use the sample credentials to test login:
- Email: `demo@example.com`
- Password: `password123`

### 3. API Testing with Postman/Insomnia

#### Register a new user:
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "displayName": "Test User"
}
```

#### Login:
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "demo@example.com",
  "password": "password123"
}
```

#### Create a task (requires authentication):
```
POST http://localhost:5000/api/tasks
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "title": "Test Task",
  "description": "This is a test task",
  "dueDate": "2024-01-15T00:00:00.000Z",
  "priority": "medium"
}
```

## Common Issues and Solutions

### 1. MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access for cloud MongoDB

### 2. CORS Issues
- Update `CORS_ORIGIN` in `.env` to match your frontend URL
- For development, you can use `*` (not recommended for production)

### 3. React Native Network Issues
- Use correct IP address for your device
- Check firewall settings
- Ensure both frontend and backend are running

### 4. JWT Token Issues
- Verify `JWT_SECRET` is set in `.env`
- Check token expiration settings
- Ensure proper token format in Authorization header

## Development Workflow

### 1. Backend Development
```bash
cd backend
npm run dev  # Auto-restart on file changes
```

### 2. Frontend Development
```bash
# Terminal 1: Start Metro bundler
npm start

# Terminal 2: Run on device/simulator
npm run android  # or npm run ios
```

### 3. Database Management
```bash
cd backend
npm run setup  # Reset database with sample data
```

## Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in `.env`
2. Use a production MongoDB instance
3. Set a strong `JWT_SECRET`
4. Configure proper CORS origins
5. Deploy to platforms like:
   - Heroku
   - Railway
   - DigitalOcean
   - AWS

### Frontend Deployment
1. Update `API_BASE_URL` to production backend URL
2. Build for production:
   ```bash
   # Android
   cd android && ./gradlew assembleRelease
   
   # iOS
   # Use Xcode to archive and distribute
   ```

## API Documentation

The complete API documentation is available in `backend/README.md`

## Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify all prerequisites are installed
3. Ensure all environment variables are set correctly
4. Check network connectivity between frontend and backend

## Next Steps

1. **Customize the UI**: Modify components in `src/components/`
2. **Add Features**: Extend the API in `backend/controllers/`
3. **Add Tests**: Create test files for both frontend and backend
4. **Add Real-time Features**: Integrate WebSocket for live updates
5. **Add Push Notifications**: Implement task reminders
6. **Add Offline Support**: Implement local storage and sync
