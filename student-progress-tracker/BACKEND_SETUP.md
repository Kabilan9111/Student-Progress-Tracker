# Student Progress Tracker - Backend Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)

## Installation

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Configure MongoDB
- For local MongoDB: Make sure MongoDB is running on `mongodb://localhost:27017`
- For MongoDB Atlas: Update connection string in `backend/server.js`

### 3. Start Backend Server
```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

### 4. Start Frontend
```bash
cd ..
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login or register user
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/disconnect-gmail` - Disconnect Gmail
- `POST /api/auth/logout` - Logout

### WhatsApp
- `POST /api/whatsapp/send-otp` - Send OTP to phone
- `POST /api/whatsapp/verify-otp` - Verify OTP
- `POST /api/whatsapp/disconnect` - Disconnect WhatsApp

## Features Implemented

✅ Real authentication with bcrypt password hashing
✅ JWT token-based sessions
✅ Email/password login (creates account if not exists)
✅ WhatsApp OTP verification
✅ Disconnect/logout functionality
✅ MongoDB database persistence
✅ Secure API with auth middleware

## Development Notes

- OTP is logged to console in development mode
- Check browser console for `Dev OTP:` message when testing WhatsApp linking
- All passwords are hashed with bcrypt before storage
- JWT tokens expire in 7 days

## Security

- Never commit `.env` files with production secrets
- Change JWT_SECRET in production
- Use environment variables for sensitive data
- Implement rate limiting for production
- Add HTTPS in production
