const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Set JWT cookie
const sendTokenAsCookie = (res, user, message) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000 // 1 hour
  });

  res.status(200).json({ message });
};

// Signup
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const role = "user" //Admins will be added manually and thus every sign up will assign role as user
    
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role });
    sendTokenAsCookie(res, user, 'Signup successful');
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    sendTokenAsCookie(res, user, 'Login successful');
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Logout
const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

module.exports = {
  signup,
  login,
  logout
};
