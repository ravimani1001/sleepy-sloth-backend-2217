const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Protect Route Middleware
const protect = async (req, res, next) => {
  const token = req.cookies.token;
  console.log("Checking for token")
  if (!token) {
    return res.status(401).json({ message: 'Not logged in' });
  }

  try {
    console.log("Decoding token")
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    console.log("Goin to isAdmin middleware")
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin Only Middleware
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  console.log("Going to uploadWrapper")
  next();
};

module.exports = {
  protect,
  isAdmin
};
