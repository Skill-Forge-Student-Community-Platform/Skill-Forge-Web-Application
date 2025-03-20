const Competition = require('../models/Competition');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Get all competitions with optional filtering
exports.getAllCompetitions = async (req, res) => {
  try {
    const { status, difficulty, limit = 10, page = 1 } = req.query;
    const query = {};
    
    // Apply filters if provided
    if (status) query.status = status;
    if (difficulty) query.difficulty = difficulty;
    
    // Handle pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Find competitions
    const competitions = await Competition.find(query)
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Competition.countDocuments(query);
    
    res.json({
      competitions,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Get competitions error:', error);
    res.status(500).json({ message: 'Server error retrieving competitions' });
  }
};

// Get a competition by ID
exports.getCompetitionById = async (req, res) => {
  try {
    const competitionId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(competitionId)) {
      return res.status(400).json({ message: 'Invalid competition ID' });
    }
    
    const competition = await Competition.findById(competitionId);
    
    if (!competition) {
      return res.status(404).json({ message: 'Competition not found' });
    }
    
    res.json(competition);
  } catch (error) {
    console.error('Get competition error:', error);
    res.status(500).json({ message: 'Server error retrieving competition' });
  }
};

// Create a new competition (admin only)
exports.createCompetition = async (req, res) => {
  try {
    // Check admin role (uncomment when your role system is in place)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to create competitions' });
    }
    
    const {
      title,
      description,
      xpReward,
      startDate,
      endDate,
      difficulty,
      maxParticipants,
      tags,
      requirements
    } = req.body;
    
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end <= start) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }
    
    // Create competition
    const competition = new Competition({
      title,
      description,
      xpReward,
      startDate,
      endDate,
      difficulty,
      maxParticipants: maxParticipants || 100,
      tags: tags || [],
      requirements: requirements || { minLevel: 1 }
    });
    
    await competition.save();
    
    // If real-time updates are needed, emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('competitionCreated', { competition });
    }
    
    res.status(201).json(competition);
  } catch (error) {
    console.error('Create competition error:', error);
    res.status(500).json({ message: 'Server error creating competition' });
  }
};

// Join a competition
exports.joinCompetition = async (req, res) => {
  try {
    const competitionId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(competitionId)) {
      return res.status(400).json({ message: 'Invalid competition ID' });
    }
    
    const userId = req.user._id;
    
    // Find competition
    const competition = await Competition.findById(competitionId);
    
    if (!competition) {
      return res.status(404).json({ message: 'Competition not found' });
    }
    
    // Check if already a participant
    const isParticipant = competition.participants.some(
      (p) => p.user.toString() === userId.toString()
    );
    
    if (isParticipant) {
      return res.status(400).json({ message: 'User is already a participant' });
    }
    
    // Check competition status
    if (competition.status !== 'upcoming' && competition.status !== 'active') {
      return res.status(400).json({ 
        message: `Cannot join competition with status ${competition.status}` 
      });
    }
    
    // Check if competition is full
    if (competition.participants.length >= competition.maxParticipants) {
      return res.status(400).json({ message: 'Competition is full' });
    }
    
    const user = await User.findById(userId);
    
    // Check level requirements
    if (competition.requirements.minLevel > user.level) {
      return res.status(400).json({ 
        message: `User level ${user.level} is below the required level ${competition.requirements.minLevel}`
      });
    }
    
    // Check badge requirements
    if (competition.requirements.badges && competition.requirements.badges.length > 0) {
      const userBadges = user.badges.map(b => b.toString());
      const requiredBadges = competition.requirements.badges.map(b => b.toString());
      
      const hasAllBadges = requiredBadges.every(badge => userBadges.includes(badge));
      
      if (!hasAllBadges) {
        return res.status(400).json({ message: 'User does not have all required badges' });
      }
    }
    
    // Add user to participants
    competition.participants.push({
      user: userId,
      joinDate: Date.now(),
      score: 0
    });
    
    await competition.save();
    
    // Create activity record
    const activity = await Activity.create({
      user: userId,
      type: 'competition_participation',
      description: `Joined the "${competition.title}" competition`,
      xpEarned: 50, // Award some XP for joining
      metadata: { competitionId: competition._id }
    });
    
    // Update user XP
    user.currentXP += 50;
    user.totalXP += 50;
    
    // Check for level up
    const leveledUp = user.updateLevel();
    await user.save();
    
    // If real-time updates are needed, emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(`activity_${userId}`).emit('activityUpdate', { activity });
      io.emit('competitionUpdated', { 
        competitionId: competition._id,
        participantsCount: competition.participants.length
      });
    }
    
    res.json({
      success: true,
      message: 'Successfully joined the competition',
      xpEarned: 50,
      leveledUp
    });
  } catch (error) {
    console.error('Join competition error:', error);
    res.status(500).json({ message: 'Server error joining competition' });
  }
};

// Get competition participants
exports.getParticipants = async (req, res) => {
  try {
    const competitionId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(competitionId)) {
      return res.status(400).json({ message: 'Invalid competition ID' });
    }
    
    const competition = await Competition.findById(competitionId)
      .populate('participants.user', 'name username avatar level totalXP');
    
    if (!competition) {
      return res.status(404).json({ message: 'Competition not found' });
    }
    
    // Sort participants by score
    const participants = competition.participants.sort((a, b) => b.score - a.score);
    
    res.json(participants);
  } catch (error) {
    console.error('Get participants error:', error);
    res.status(500).json({ message: 'Server error retrieving participants' });
  }
};

// Update competition routes to add check role middleware to your competition routes
