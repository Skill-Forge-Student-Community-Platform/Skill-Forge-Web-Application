const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Activity = require('../models/Activity');

// Register a new user
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, username, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    // Create new user
    user = new User({
      name,
      username,
      email,
      password,
      // Other fields will use defaults defined in the model
    });

    await user.save();

    // Create welcome activity
    await Activity.create({
      user: user._id,
      type: 'other',
      description: 'Joined the platform',
      xpEarned: 100
    });

    // Update the user's XP for joining
    user.currentXP += 100;
    user.totalXP += 100;
    
    // Check for level up
    const leveledUp = user.updateLevel();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        level: user.level,
        currentXP: user.currentXP,
        totalXP: user.totalXP,
        rank: user.rank,
        joinDate: user.joinDate
      },
      leveledUp
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '7d' }
    );

    // Create login activity
    await Activity.create({
      user: user._id,
      type: 'daily_login',
      description: 'Logged into the platform',
      xpEarned: 10
    });

    // Update user XP
    user.currentXP += 10;
    user.totalXP += 10;
    
    // Check for level up
    const leveledUp = user.updateLevel();
    await user.save();

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        level: user.level,
        currentXP: user.currentXP,
        totalXP: user.totalXP,
        rank: user.rank,
        joinDate: user.joinDate
      },
      leveledUp
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('badges');
      
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error retrieving user data' });
  }
};

// Logout user
exports.logout = (req, res) => {
  // JWT tokens are stateless, so we just return a success message
  // In a real app, you might want to invalidate tokens server-side
  res.json({ message: 'Logged out successfully' });
};
