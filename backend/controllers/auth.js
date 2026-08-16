
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config/jwt');
const User = require('../models/User');
const Discovery = require('../models/Discovery');
const Strain = require('../models/Strain');

// Helper: Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, is_guest: user.is_guest },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );
};

// Register a New User
const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { code: 'CONFLICT', message: 'Username already exists' },
      });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await User.create({
      username,
      email,
      password_hash: passwordHash,
      is_guest: false,
    });
    
    // Auto-discover Gen 0 strains for new users
    const landraceStrains = await Strain.findAll({ where: { generation: 0 } });
    await Discovery.bulkCreate(
      landraceStrains.map((strain) => ({
        user_id: user.id,
        strain_id: strain.id,
      }))
    );
    
    // Generate token
    const token = generateToken(user);
    
    res.json({
      success: true,
      user: { id: user.id, username: user.username, email: user.email, is_guest: false },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Login
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Invalid username or password' },
      });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Invalid username or password' },
      });
    }
    
    // Generate token
    const token = generateToken(user);
    
    res.json({
      success: true,
      user: { id: user.id, username: user.username, email: user.email, is_guest: user.is_guest },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Guest Login
const guestLogin = async (req, res, next) => {
  try {
    // Find or create guest user
    let guestUser = await User.findOne({ where: { username: 'guest' } });
    if (!guestUser) {
      guestUser = await User.create({
        username: 'guest',
        is_guest: true,
      });
      
      // Auto-discover Gen 0 strains for guest
      const landraceStrains = await Strain.findAll({ where: { generation: 0 } });
      await Discovery.bulkCreate(
        landraceStrains.map((strain) => ({
          user_id: guestUser.id,
          strain_id: strain.id,
        }))
      );
    }
    
    // Generate token
    const token = generateToken(guestUser);
    
    res.json({
      success: true,
      user: { id: guestUser.id, username: guestUser.username, is_guest: true },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Logout
const logout = (req, res) => {
  // JWT tokens are stateless, so logout is client-side (remove token)
  res.json({ success: true });
};

// Get Current User
const getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] },
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found' },
      });
    }
    
    res.json({
      success: true,
      user: { id: user.id, username: user.username, email: user.email, is_guest: user.is_guest },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  guestLogin,
  logout,
  getMe,
};
