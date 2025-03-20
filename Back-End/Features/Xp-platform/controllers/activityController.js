const Activity = require('../models/Activity');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Get activities for a user
exports.getUserActivities = async (req, res) => {
  try {
    const userId = req.params.userId;
    
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
    
    // Apply filters if provided
    const query = { user: userId };
    
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    if (req.query.minXp) {
      query.xpEarned = { $gte: parseInt(req.query.minXp) };
    }
    
    if (req.query.startDate) {
      const startDate = new Date(req.query.startDate);
      query.timestamp = { ...query.timestamp, $gte: startDate };
    }
    
    if (req.query.endDate) {
      const endDate = new Date(req.query.endDate);
      query.timestamp = { ...query.timestamp, $lte: endDate };
    }
    
    const activities = await Activity.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Activity.countDocuments(query);
    
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

// Create an activity
exports.createActivity = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Only admins can create activities for others
    const { userId, type, description, xpEarned = 0, metadata = {} } = req.body;
    
    const targetUserId = userId || req.user._id;
    
    // If creating for another user, check permission
    if (targetUserId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to create activities for other users' });
    }
    
    const user = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Create activity
    const activity = new Activity({
      user: targetUserId,
      type,
      description,
      xpEarned,
      metadata
    });
    
    await activity.save();
    
    // Update user XP if activity earned XP
    if (xpEarned > 0) {
      user.currentXP += xpEarned;
      user.totalXP += xpEarned;
      
      // Check for level up
      let leveledUp = false;
      let newLevel = user.level;
      
      while (user.currentXP >= user.getNextLevelXP()) {
        leveledUp = user.updateLevel();
        if (leveledUp) {
          // Create a level-up activity
          await Activity.create({
            user: targetUserId,
            type: 'level_up',
            description: `Advanced to level ${user.level}`,
            xpEarned: 0,
            metadata: { previousLevel: newLevel, newLevel: user.level }
          });
          newLevel = user.level;
        }
      }
      
      await user.save();
      
      // If real-time updates are needed, emit socket event
      const io = req.app.get('io');
      if (io) {
        // Emit to user's activity feed
        io.to(`activity_${targetUserId}`).emit('activityUpdate', { activity });
        
        // Update leaderboard if significant XP change
        if (xpEarned >= 50) {
          io.to('leaderboard').emit('leaderboardUpdate', {
            userId: targetUserId,
            totalXP: user.totalXP,
            level: user.level
          });
        }
      }
      
      return res.status(201).json({
        activity,
        xpAwarded: xpEarned,
        newTotalXP: user.totalXP,
        currentXP: user.currentXP,
        level: user.level,
        leveledUp
      });
    }
    
    res.status(201).json({ activity });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ message: 'Server error creating activity' });
  }
};

// Get global activity feed
exports.getGlobalFeed = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    
    const activities = await Activity.find()
      .populate('user', 'name username avatar')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Activity.countDocuments();
    
    res.json({
      activities,
      page,
      limit,
      total
    });
  } catch (error) {
    console.error('Get global feed error:', error);
    res.status(500).json({ message: 'Server error retrieving global feed' });
  }
};
