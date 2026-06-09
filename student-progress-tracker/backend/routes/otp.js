require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const router = express.Router();

// Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// In-memory OTP storage (use Redis in production)
const otpStore = new Map();

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via Twilio
router.post('/send-otp', async (req, res) => {
  try {
    console.log('[OTP] Send request:', { phone: req.body.phone });
    
    const { phone } = req.body;

    if (!phone) {
      console.log('[OTP] Missing phone number');
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP in memory
    otpStore.set(phone, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    // Send OTP via Twilio
    await client.messages.create({
      body: `Your verification code is: ${otp}`,
      from: process.env.TWILIO_PHONE,
      to: phone,
    });

    console.log(`[OTP] Sent successfully to ${phone}`);

    // Return JSON only - NO devOtp
    res.json({ success: true });
  } catch (error) {
    console.error('[OTP] Send error:', error);
    res.status(500).json({ success: false, error: 'Failed to send OTP' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    console.log('[OTP] Verify request:', { phone: req.body.phone });
    
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      console.log('[OTP] Missing phone or OTP');
      return res.status(400).json({ error: 'Phone number and OTP are required' });
    }

    const stored = otpStore.get(phone);

    if (!stored) {
      console.log('[OTP] OTP not found');
      return res.status(400).json({ error: 'OTP not found or expired' });
    }

    if (stored.expiresAt < Date.now()) {
      otpStore.delete(phone);
      console.log('[OTP] OTP expired');
      return res.status(400).json({ error: 'OTP expired' });
    }

    if (stored.otp !== otp) {
      console.log('[OTP] Invalid OTP');
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // OTP verified - clean up
    otpStore.delete(phone);

    console.log('[OTP] Verification successful');
    
    // Return JSON only
    res.json({ success: true });
  } catch (error) {
    console.error('[OTP] Verify error:', error);
    res.status(500).json({ success: false, error: 'Failed to verify OTP' });
  }
});

module.exports = router;
