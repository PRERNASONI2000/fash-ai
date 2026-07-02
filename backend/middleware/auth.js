//backend/middleware/auth.js
// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//   const token = req.header('Authorization')?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
//     req.user = decoded.user;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };



const jwt = require('jsonwebtoken');
const User = require('../models/User'); // User model import karo

module.exports = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    // ✅ FIX: Database se User dhoondo taaki humein proper MongoDB ID (_id) mil jaye
    const user = await User.findById(decoded.user?.id || decoded.user?._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user; // Ab req.user me pura MongoDB object hoga jisme _id hoga
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};