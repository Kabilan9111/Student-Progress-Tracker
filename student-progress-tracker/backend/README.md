# Backend Setup Complete

## Start Backend Server

```bash
cd backend
npm install
npm run dev
```

Backend will start on: **http://localhost:5000**

## Console Output

When server starts, you'll see:
```
✅ MongoDB connected successfully
🚀 Backend server running on http://localhost:5000
✅ CORS enabled for http://localhost:5173
📡 Endpoints available:
   POST http://localhost:5000/auth/login
   POST http://localhost:5000/otp/send
   POST http://localhost:5000/otp/verify
```

## API Endpoints

### 1. Gmail Login
**POST** `/auth/login`
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

Response (New User):
```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "jwt_token_here",
  "user": { "email": "...", "gmailConnected": true }
}
```

Response (Existing User - Correct Password):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here"
}
```

Response (Wrong Password):
```json
{
  "error": "Invalid email or password"
}
```

### 2. Send OTP
**POST** `/otp/send`
```json
{
  "phone": "+1234567890"
}
```

Response:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "devOtp": "123456"
}
```

**OTP is also logged in backend console**

### 3. Verify OTP
**POST** `/otp/verify`
```json
{
  "phone": "+1234567890",
  "otp": "123456"
}
```

Response (Correct OTP):
```json
{
  "success": true,
  "message": "WhatsApp connected successfully",
  "phone": "+1234567890"
}
```

Response (Wrong OTP):
```json
{
  "error": "Invalid OTP"
}
```

## Testing

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `npm run dev`
3. Open http://localhost:5173/agent
4. Try logging in - check browser Network tab
5. Try sending OTP - check backend console for OTP code

## Backend Console Logs

Every request shows:
- `[AUTH] Login request received`
- `[OTP] Send OTP request received`
- `[OTP] Verify OTP request received`
- `📱 OTP for +123456: 123456`

## Requirements

- MongoDB running on localhost:27017
- Node.js v18+
- Backend dependencies installed (`npm install`)
