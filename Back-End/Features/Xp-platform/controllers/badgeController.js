const Badge = require('../models/Badge');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Get all badges
exports.getAllBadges = async (req, res) => {
  try {
    const { category, status } = req.query;
    const query = {};
    
    // Apply filters if provided
    if (category) query.category = category;
    if (status === 'active') query.isActive = true;
    else if (status === 'inactive') query.isActive = false;
    
    const badges = await Badge.find(query).sort({ requiredLevel: 1, name: 1 });
    
    res.json(badges);
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({ message: 'Server error retrieving badges' });
  }
};

// Get badges for a specific user
exports.getUserBadges = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const user = await User.findById(userId).populate('badges');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.badges);
  } catch (error) {
    console.error('Get user badges error:', error);
    res.status(500).json({ message: 'Server error retrieving user badges' });
  }
};

// Create a new badge (admin only)
exports.createBadge = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Check if admin (you'd need to implement role-based auth)
    // if (req.user.role !== 'admin') {
    //   return res.status(403).json({ message: 'Not authorized to create badges' });
    // }
    
    const {
      name,
      description,
      category,
      icon,
      unlockRequirement,
      xpReward,
      requiredLevel,
      isActive
    } = req.body;
    
    // Check if badge with same name already exists
    const existingBadge = await Badge.findOne({ name });
    if (existingBadge) {
      return res.status(400).json({ message: 'Badge with this name already exists' });
    }
    
    // Create badge
    const badge = new Badge({
      name,
      description,
      category,
      icon,
      unlockRequirement,
      xpReward,
      requiredLevel: requiredLevel || 1,
      isActive: isActive !== undefined ? isActive : true
    });
    
    await badge.save();
    
    res.status(201).json(badge);
  } catch (error) {
    console.error('Create badge error:', error);
    res.status(500).json({ message: 'Server error creating badge' });
  }
};

// Award a badge to a user
exports.awardBadge = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { userId, badgeId } = req.body;
    
    // Validate input
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(badgeId)) {
      return res.status(400).json({ message: 'Invalid user ID or badge ID' });
    }
    
    // Get user and badge
    const [user, badge] = await Promise.all([
      User.findById(userId),
      Badge.findById(badgeId)
    ]);
    
    // Check if user and badge exist
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!badge) return res.status(404).json({ message: 'Badge not found' });
    
    // Check if user already has this badge
    if (user.badges.includes(badgeId)) {
      return res.status(400).json({ message: 'User already has this badge' });
    }
    
    // Add badge to user
    user.badges.push(badgeId);
    await user.save();
    
    // Create activity record
    const activity = await Activity.create({
      user: userId,
      type: 'badge_earned',
      description: `Earned the "${badge.name}" badge`,
      xpEarned: badge.xpReward,
      metadata: { badgeId: badge._id }
    });
    
    // Update user XP
    user.currentXP += badge.xpReward;
    user.totalXP += badge.xpReward;
    
    // Check for level up
    let leveledUp = false;
    let newLevel = user.level;
    
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
      io.to(`activity_${userId}`).emit('badgeEarned', { 
        badge, 
        activity,
        xpEarned: badge.xpReward,
        currentXP: user.currentXP,
        totalXP: user.totalXP,
        level: user.level,
        leveledUp
      });
    }
    
    res.json({
      success: true,
      badge,
      xpEarned: badge.xpReward,
      currentXP: user.currentXP,
      totalXP: user.totalXP,
      level: user.level,
      leveledUp
    });
  } catch (error) {
    console.error('Award badge error:', error);
    res.status(500).json({ message: 'Server error awarding badge' });
  }
};

// Check badge requirements for a user
exports.checkBadgeRequirements = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const user = await User.findById(userId).populate('badges');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get all badges user doesn't have yet
    const userBadgeIds = user.badges.map(badge => badge._id.toString());
    const unlockedBadges = await Badge.find({
      _id: { $nin: userBadgeIds },
      isActive: true
    });
    
    // Check which badges the user now qualifies for
    const badgesToUnlock = [];
    for (const badge of unlockedBadges) {
      const meetsRequirements = await badge.checkRequirements(user);
      if (meetsRequirements) {
        badgesToUnlock.push(badge);
      }
    }
    
    if (badgesToUnlock.length > 0) {
      res.json({
        eligibleBadges: badgesToUnlock,
        count: badgesToUnlock.length
      });
    } else {
      res.json({
        eligibleBadges: [],
        count: 0,
        message: 'No new badges available to unlock'
      });
    }
  } catch (error) {
    console.error('Check badge requirements error:', error);
    res.status(500).json({ message: 'Server error checking badge requirements' });
  }
};
