const User = require('../models/User');
const Activity = require('../models/Activity');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, username } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (username) {
      // Check if username is already taken by another user
      const existingUser = await User.findOne({ username, _id: { $ne: req.user._id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      updates.username = username;
    }

    // Handle avatar upload if present
    if (req.file) {
      updates.avatar = `/uploads/avatars/${req.file.filename}`;

      // Delete old avatar if not default
      if (req.user.avatar !== 'default-avatar.png' && fs.existsSync(path.join(__dirname, `../public${req.user.avatar}`))) {
        fs.unlinkSync(path.join(__dirname, `../public${req.user.avatar}`));
      }
    }

    // Update user and return the updated document
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true }
    ).select('-password');

    // Add activity record
    await Activity.create({
      user: req.user._id,
      type: 'profile_update',
      description: 'Updated profile information',
      xpEarned: 5
    });

    // Update user XP
    updatedUser.currentXP += 5;
    updatedUser.totalXP += 5;
    
    // Check for level up
    const leveledUp = updatedUser.updateLevel();
    await updatedUser.save();

    res.json({
      user: updatedUser,
      leveledUp
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// Get global leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    // Parse query parameters for pagination and filtering
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const type = req.query.type || 'global'; // global, monthly, or friends

    let query = {};
    let sort = { totalXP: -1, _id: 1 };

    if (type === 'monthly') {
      // For monthly leaderboard, we need to calculate XP earned in the current month
      // This requires a more complex aggregation
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const monthlyLeaderboard = await Activity.aggregate([
        { 
          $match: { 
            timestamp: { $gte: startOfMonth },
            xpEarned: { $gt: 0 }
          } 
        },
        {
          $group: {
            _id: '$user',
            monthlyXP: { $sum: '$xpEarned' }
          }
        },
        { $sort: { monthlyXP: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'userDetails'
          }
        },
        { $unwind: '$userDetails' },
        {
          $project: {
            _id: '$userDetails._id',
            name: '$userDetails.name',
            username: '$userDetails.username',
            avatar: '$userDetails.avatar',
            level: '$userDetails.level',
            totalXP: '$userDetails.totalXP',
            monthlyXP: 1
          }
        }
      ]);

      // Add rank property to each user
      const leaderboardWithRank = monthlyLeaderboard.map((user, idx) => ({
        ...user,
        rank: idx + 1 + skip
      }));

      return res.json({
        leaderboard: leaderboardWithRank,
        type: 'monthly',
        page,
        limit,
        total: await Activity.aggregate([
          { $match: { timestamp: { $gte: startOfMonth }, xpEarned: { $gt: 0 } } },
          { $group: { _id: '$user' } },
          { $count: 'total' }
        ]).then(result => result[0]?.total || 0)
      });
    } 
    else if (type === 'friends' && req.user) {
      // This assumes a "friends" relationship - you'd need to implement this
      // For now, using a simplified approach
      query = { _id: { $in: req.user.friends || [] } };
    }

    // For global leaderboard (default) or friends
    const users = await User.find(query)
      .select('name username avatar level totalXP')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Add rank property to each user based on position
    const leaderboard = users.map((user, idx) => ({
      id: user._id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      level: user.level,
      totalXP: user.totalXP,
      rank: idx + 1 + skip
    }));

    // Get total count for pagination
    const total = await User.countDocuments(query);

    res.json({
      leaderboard,
      type,
      page,
      limit,
      total
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Server error retrieving leaderboard' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(userId)
      .select('-password')
      .populate('badges');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error retrieving user' });
  }
};

// Get user activities
exports.getUserActivities = async (req, res) => {
  try {
    const userId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Authorize - users can only view their own activity unless they're an admin
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this user\'s activities' });
    }

    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const activities = await Activity.find({ user: userId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Activity.countDocuments({ user: userId });

    res.json({
      activities,
      page,
      limit,
      total
    });
  } catch (error) {
    console.error('Get user activities error:', error);
    res.status(500).json({ message: 'Server error retrieving activities' });
  }
};
