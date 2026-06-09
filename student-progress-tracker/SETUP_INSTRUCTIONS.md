# Complete Setup Instructions

## Backend Setup

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Start MongoDB
Make sure MongoDB is running on your system:
- **Windows**: MongoDB service should be running
- **Mac/Linux**: `mongod` or check if service is running

### 3. Start Backend Server
```bash
cd backend
npm run dev
```

Backend will run on: `http://localhost:5000`

## Frontend Setup

Frontend already configured. Just ensure it's running:
```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

## Testing

### Test Gmail Login:
1. Go to http://localhost:5173/agent
2. Enter email and password
3. If email doesn't exist, account is created automatically
4. If exists, password is validated
5. On success, shows "Connected ✓"

### Test WhatsApp OTP:
1. After Gmail login, enter phone number
2. Click "Send OTP"
3. Check backend console for OTP (also shown on screen in dev mode)
4. Enter the 6-digit OTP
5. Click "Verify OTP"
6. On success, shows "Connected ✓"

### Test Disconnect:
- Click "Disconnect" button next to each connected service
- Click "Reset Agent" to logout completely

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login or create account
- `GET /api/auth/me` - Get current user
- `POST /api/auth/disconnect-gmail` - Disconnect Gmail
- `POST /api/auth/logout` - Logout

### WhatsApp OTP
- `POST /api/whatsapp/send-otp` - Send OTP to phone
- `POST /api/whatsapp/verify-otp` - Verify OTP
- `POST /api/whatsapp/disconnect` - Disconnect WhatsApp

## Security Features

✅ Passwords hashed with bcrypt (10 rounds)
✅ JWT authentication (tokens expire in 7 days)
✅ No plain text passwords stored
✅ OTP expires in 5 minutes
✅ Input validation on backend
✅ Error handling with proper messages

## Troubleshooting

**MongoDB connection error:**
- Ensure MongoDB is installed and running
- Check connection string in `backend/server.js`

**CORS error:**
- Backend allows `http://localhost:5173` by default
- If frontend runs on different port, update CORS in `backend/server.js`

**OTP not received:**
- Check backend console for OTP
- OTP is displayed on frontend in development mode

**Port already in use:**
- Backend: Change PORT in `backend/server.js`
- Frontend: Vite will prompt to use different port
