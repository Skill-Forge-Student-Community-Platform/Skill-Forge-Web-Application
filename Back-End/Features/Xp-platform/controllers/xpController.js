const User = require('../models/User');
const Activity = require('../models/Activity');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Award XP to a user
exports.awardXP = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, amount, reason, type = 'other', metadata = {} } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Check if amount is valid
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'XP amount must be positive' });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create activity record
    const activity = new Activity({
      user: userId,
      type,
      description: reason,
      xpEarned: amount,
      metadata
    });
    await activity.save();

    // Update user XP
    user.currentXP += amount;
    user.totalXP += amount;
    
    // Check for level up
    let leveledUp = false;
    let newLevel = user.level;
    
    // Keep checking for level ups until current XP is below threshold
    while (user.currentXP >= user.getNextLevelXP()) {
      leveledUp = user.updateLevel();
      if (leveledUp) {
        // Create a level-up activity
        await Activity.create({
          user: userId,
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
      io.to(`activity_${userId}`).emit('activityUpdate', { activity });
      
      // Update leaderboard if significant XP change
      if (amount >= 50) {
        io.to('leaderboard').emit('leaderboardUpdate', {
          userId,
          totalXP: user.totalXP,
          level: user.level
        });
      }
    }

    res.json({
      success: true,
      xpAwarded: amount,
      newTotalXP: user.totalXP,
      currentXP: user.currentXP,
      level: user.level,
      leveledUp,
      nextLevelXP: user.getNextLevelXP(),
      activity: activity
    });
  } catch (error) {
    console.error('Award XP error:', error);
    res.status(500).json({ message: 'Server error awarding XP' });
  }
};

// Get XP history for a user
exports.getXPHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Authorize - users can only view their own XP history unless they're an admin
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this user\'s XP history' });
    }

    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    // Get activities with positive XP
    const activities = await Activity.find({ 
      user: userId,
      xpEarned: { $gt: 0 }
    })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Activity.countDocuments({ 
      user: userId,
      xpEarned: { $gt: 0 }
    });

    res.json({
      activities,
      page,
      limit,
      total
    });
  } catch (error) {
    console.error('Get XP history error:', error);
    res.status(500).json({ message: 'Server error retrieving XP history' });
  }
};

// Get level requirements
exports.getLevelRequirements = async (req, res) => {
  try {
    // This is a simplified example - in a real app, you might store this in the database
    const levelRequirements = [];
    
    // Generate XP requirements for levels 1-20
    for (let level = 1; level <= 20; level++) {
      const xpRequired = Math.floor(1000 * Math.pow(1.5, level - 1));
      const rankName = level <= 10 ? [
        'Novice', 'Beginner', 'Intermediate', 'Pro Competitor',
        'Expert', 'Master', 'Grandmaster', 'Legend',
        'Champion', 'Ultimate Champion'
      ][level - 1] : `Ultimate Champion ${level - 10}`;
      
      levelRequirements.push({
        level,
        xpRequired,
        rank: rankName,
        benefits: [] // You'd populate this from a benefits collection
      });
    }
    
    res.json(levelRequirements);
  } catch (error) {
    console.error('Get level requirements error:', error);
    res.status(500).json({ message: 'Server error retrieving level requirements' });
  }
};
