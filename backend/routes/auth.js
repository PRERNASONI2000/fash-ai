//backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const admin = require('firebase-admin');
const auth = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');
const { userHasAgencyPlan, applyAgencyReferral } = require('../utils/agencyHelpers');

const router = express.Router();

// Validation helpers
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Register
router.post('/register', async (req, res) => {
  console.log('Register route hit. Request body:', req.body);
  try {
    const { name, email, password, ref } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password });
    user = await applyAgencyReferral(user, ref);
    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '5h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).json({ err: true, msg: err.message, errDetail: err.message, status: 500 });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '5h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).json({ err: true, msg: err.message, errDetail: err.message, status: 500 });
  }
});

// Get Current User Profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -resetPasswordToken -resetPasswordExpire')
      .populate('activePlan', 'name credits recurring billingCycle features')
      .populate('purchasedAddons', 'name credits price');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update User Profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, profilePicture } = req.body;

    if (!name && !profilePicture) {
      return res.status(400).json({ message: 'Provide at least one field to update' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (profilePicture) updateData.profilePicture = profilePicture;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select('-password -resetPasswordToken -resetPasswordExpire');
    //-resetPasswordExpire sensitive fields response me bhejne se bachata hai

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete User Profile
router.delete('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Logout
router.post('/logout', auth, async (req, res) => {
  try {
    // In JWT-based auth, logout is handled on the frontend by removing the token
    // No need to maintain a blacklist unless required
    res.json({ message: 'Logout successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Forgot Password
// router.post('/forgot-password', auth, async (req, res) => {
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    console.log('Forgot password route hit. Email:', email);

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('Forgot password error: missing email configuration', {
        SMTP_USER: !!process.env.SMTP_USER,
        SMTP_PASS: !!process.env.SMTP_PASS,
      });
      return res.status(500).json({ message: 'Email configuration error: SMTP_USER and SMTP_PASS must be set.' });
    }

    if (!process.env.FRONTEND_URL) {
      console.warn('Forgot password warning: FRONTEND_URL is not set. Falling back to http://localhost:5173.');
    }

    if (!process.env.JWT_SECRET) {
      console.warn('Forgot password warning: JWT_SECRET is not set. JWT-based routes may use fallback secret.');
    }

    const user = await User.findOne({ email });
    console.log('Forgot password user lookup:', { email, found: !!user, userId: user ? user._id : null });
    if (!user) {
      return res.status(400).json({ message: 'No account found with that email' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log('Forgot password token generation complete. Token preview:', `${resetToken.slice(0, 8)}...`);

    // Save hashed token and expiry to database
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();
    console.log('Forgot password token saved to database for user:', user._id, 'expiresAt:', user.resetPasswordExpire);

    // In development, return reset URL for testing
    const baseUrl = process.env.FRONTEND_URL.replace(/\/$/, '');
    const resetUrl = `${baseUrl}/reset-password/${resetToken}`;
    const message = `
You requested a password reset.

Click the link below to reset your password:

${resetUrl}

If you did not request this, please ignore this email.
`; 
    console.log('Forgot password reset URL:', resetUrl); 
 
    try {
      console.log("Before sendEmail");

await sendEmail(
  user.email,
  "Password Reset Request",
  message
);

console.log("After sendEmail");

      console.log('Forgot password email sent to:', user.email);
    } catch (emailErr) {
      console.error('Forgot password sendEmail failed:', emailErr);
      const message = process.env.NODE_ENV === 'development'
        ? `Email sending failed: ${emailErr.message}`
        : 'Unable to send password reset email';
      return res.status(500).json({ message, error: process.env.NODE_ENV === 'development' ? emailErr.message : undefined });
    }

    res.json({
      message: 'Password reset link sent'
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    if (!password) {
      return res.status(400).json({ message: 'New password is required' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Hash token for comparison
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with matching token and valid expiry
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Firebase admin initialize (sirf ek baar hoga)
// Firebase admin initialize (sirf ek baar hoga)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
    })
  });
}

// Google login/signup route
router.post('/google', async (req, res) => {
  try {
    const { idToken, ref } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'idToken is required' });
    }

    // Firebase se token verify karo
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // User already exists? Nahi toh create karo
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        password: uid,
        googleId: uid,
        name: name || '',
        profilePicture: picture || '',
      });
      user = await applyAgencyReferral(user, ref);
      await user.save();
    }

    // my JWT 
    const secret = process.env.JWT_SECRET;
    if(!secret) {
      return res.status(500).json({ message: 'JWT secret is not defined' });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      secret,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Google auth error:', err.message);
    res.status(401).json({ message: 'Invalid Google token', error: err.message });
  }
});

// Agency invite link (Fashion Studio Agency plan holders only)
router.get('/agency/invite', auth, async (req, res) => {
  try {
    const agencyPlan = await userHasAgencyPlan(req.user._id || req.user.id);
    if (!agencyPlan) {
      return res.status(403).json({ message: 'Agency plan required to generate invite links' });
    }

    const agencyUserId = req.user._id || req.user.id;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const inviteLink = `${frontendUrl}/signup?ref=${agencyUserId}`;

    return res.json({
      inviteLink,
      maxSubUsers: agencyPlan.maxSubUsers,
      subUserCredits: agencyPlan.subUserCredits,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;