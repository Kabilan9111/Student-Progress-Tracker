const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// In-memory OTP storage (in production, use Redis)
const otpStore = new Map();

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP (mock - in production, integrate with Twilio/WhatsApp Business API)
router.post('/send-otp', authMiddleware, async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Generate and store OTP
    const otp = generateOTP();
    otpStore.set(phoneNumber, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      userId: req.userId,
    });

    // In production, send OTP via SMS/WhatsApp API
    console.log(`📱 OTP for ${phoneNumber}: ${otp}`);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      // For development only - remove in production
      devOtp: otp,
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP
router.post('/verify-otp', authMiddleware, async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ error: 'Phone number and OTP are required' });
    }

    const stored = otpStore.get(phoneNumber);

    if (!stored) {
      return res.status(400).json({ error: 'OTP not found or expired' });
    }

    if (stored.expiresAt < Date.now()) {
      otpStore.delete(phoneNumber);
      return res.status(400).json({ error: 'OTP expired' });
    }

    if (stored.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (stored.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // OTP verified - update user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.whatsappNumber = phoneNumber;
    user.whatsappConnected = true;
    await user.save();

    // Clean up OTP
    otpStore.delete(phoneNumber);

    res.json({
      success: true,
      message: 'WhatsApp connected successfully',
      user: {
        id: user._id,
        email: user.email,
        gmailConnected: user.gmailConnected,
        whatsappConnected: user.whatsappConnected,
        whatsappNumber: user.whatsappNumber,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Disconnect WhatsApp
router.post('/disconnect', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.whatsappNumber = null;
    user.whatsappConnected = false;
    await user.save();

    res.json({
      success: true,
      message: 'WhatsApp disconnected',
      user: {
        id: user._id,
        email: user.email,
        gmailConnected: user.gmailConnected,
        whatsappConnected: user.whatsappConnected,
        whatsappNumber: user.whatsappNumber,
      },
    });
  } catch (error) {
    console.error('Disconnect WhatsApp error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
