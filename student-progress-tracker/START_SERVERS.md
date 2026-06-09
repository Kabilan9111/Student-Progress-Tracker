# 🚀 How to Start the Application

## Quick Start (Every Time)

### 1. Start Backend Server
```bash
cd backend
npm start
```
**Backend will run on:** http://localhost:5000

### 2. Start Frontend Server (in a new terminal)
```bash
npm run dev
```
**Frontend will run on:** http://localhost:5173

---

## ✅ What to Expect

### Backend Console Output:
```
🚀 Backend server running on http://localhost:5000
✅ CORS enabled for http://localhost:5173
📡 Endpoints available:
   POST http://localhost:5000/auth/login
   POST http://localhost:5000/otp/send
   POST http://localhost:5000/otp/verify

⚠️  MongoDB not connected (this is OK for development)
   App will work but data won't persist between restarts
```

### Frontend Console Output:
```
VITE v7.3.0  ready in 855 ms
➜  Local:   http://localhost:5173/
```

---

## 📱 Testing the Agent Feature

1. Open browser: http://localhost:5173/agent
2. **Gmail Login:**
   - Enter any email (e.g., `test@example.com`)
   - Enter any password (will be saved in memory)
   - Click "Connect Gmail Account"
   - First time: Creates account
   - Next time: Validates password

3. **WhatsApp OTP:**
   - Enter phone number with country code (e.g., `+1234567890`)
   - Click "Link WhatsApp"
   - Check backend console for OTP code (e.g., `📱 OTP for +1234567890: 123456`)
   - Enter the OTP and click "Verify OTP"

---

## ⚠️ Important Notes

- **Use `npm run dev`** for frontend, NOT `npm start`
- **MongoDB is optional** - app works with in-memory storage
- **Data doesn't persist** between server restarts (unless MongoDB is installed)
- Keep both terminals running while testing
- All API calls visible in browser Network tab

---

## 🐛 Troubleshooting

**Problem:** "Missing script: start"
- **Solution:** Use `npm run dev` instead

**Problem:** Backend crashes immediately
- **Solution:** MongoDB warning is normal, app still works

**Problem:** CORS errors in browser
- **Solution:** Make sure backend is running on port 5000

**Problem:** Blank page
- **Solution:** Check browser console for errors, verify both servers are running
