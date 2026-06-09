require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const otpRoutes = require('./routes/otp');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// MongoDB connection (optional - app works without it for development)
mongoose.connect('mongodb://localhost:27017/student-tracker-agent')
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => {
    console.warn('⚠️  MongoDB not connected (using in-memory storage)');
    console.warn('   Data will not persist between restarts\n');
  });

// Routes
app.use('/auth', authRoutes);
app.use('/otp', otpRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`✅ CORS enabled for http://localhost:5173`);
  console.log(`📡 Endpoints available:`);
  console.log(`   POST http://localhost:${PORT}/auth/login`);
  console.log(`   POST http://localhost:${PORT}/otp/send-otp`);
  console.log(`   POST http://localhost:${PORT}/otp/verify-otp\n`);
});
