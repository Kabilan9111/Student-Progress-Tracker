const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// In-memory storage (fallback when MongoDB is not available)
const inMemoryUsers = new Map();

// Try to import User model, but don't fail if MongoDB is not connected
let User;
try {
  User = require('../models/User');
} catch (err) {
  console.log('[AUTH] MongoDB models not loaded, using in-memory storage');
}

// Helper function to hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Helper function to compare password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Login or Register
router.post('/login', async (req, res) => {
  try {
    console.log('[AUTH] Login request received:', { email: req.body.email });
    
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('[AUTH] Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Try MongoDB first, fallback to in-memory storage
    let user;
    let isNewUser = false;

    if (User) {
      // MongoDB available - use database
      user = await User.findOne({ email });

      if (!user) {
        console.log('[AUTH] User not found in DB, creating new account');
        user = new User({
          email,
          password,
          gmailConnected: true,
        });
        await user.save();
        isNewUser = true;
      } else {
        console.log('[AUTH] User found in DB, verifying password');
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          console.log('[AUTH] Invalid password');
          return res.status(401).json({ error: 'Invalid email or password' });
        }
        user.gmailConnected = true;
        await user.save();
      }

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(isNewUser ? 201 : 200).json({
        success: true,
        message: isNewUser ? 'Account created successfully' : 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          gmailConnected: user.gmailConnected,
          whatsappConnected: user.whatsappConnected,
          whatsappNumber: user.whatsappNumber,
        },
      });
    } else {
      // MongoDB not available - use in-memory storage
      console.log('[AUTH] Using in-memory storage');
      
      if (inMemoryUsers.has(email)) {
        // User exists - verify password
        const storedUser = inMemoryUsers.get(email);
        const isMatch = await comparePassword(password, storedUser.password);
        
        if (!isMatch) {
          console.log('[AUTH] Invalid password (in-memory)');
          return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        storedUser.gmailConnected = true;
        console.log('[AUTH] Login successful (in-memory)');
      } else {
        // Create new user
        console.log('[AUTH] Creating new account (in-memory)');
        const hashedPassword = await hashPassword(password);
        inMemoryUsers.set(email, {
          email,
          password: hashedPassword,
          gmailConnected: true,
          whatsappConnected: false,
          whatsappNumber: null,
        });
        isNewUser = true;
      }

      const userData = inMemoryUsers.get(email);
      const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(isNewUser ? 201 : 200).json({
        success: true,
        message: isNewUser ? 'Account created successfully' : 'Login successful',
        token,
        user: {
          email: userData.email,
          gmailConnected: userData.gmailConnected,
          whatsappConnected: userData.whatsappConnected,
          whatsappNumber: userData.whatsappNumber,
        },
      });
    }
  } catch (error) {
    console.error('[AUTH] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
