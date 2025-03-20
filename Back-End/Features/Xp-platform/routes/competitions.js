const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const competitionController = require('../controllers/competitionController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const checkRole = require('../middleware/checkRole');

// @route   GET /api/competitions
// @desc    Get all competitions
// @access  Public
router.get('/', competitionController.getAllCompetitions);

// @route   GET /api/competitions/:id
// @desc    Get competition by ID
// @access  Public
router.get('/:id', competitionController.getCompetitionById);

// @route   POST /api/competitions
// @desc    Create a new competition
// @access  Private/Admin
router.post(
  '/',
  auth,
  checkRole(['admin']),
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('xpReward', 'XP reward must be a positive number').isInt({ min: 1 }),
    check('startDate', 'Start date is required').isISO8601(),
    check('endDate', 'End date is required').isISO8601(),
    check('difficulty', 'Difficulty is required').isIn(['Beginner', 'Intermediate', 'Advanced'])
  ],
  validate,
  competitionController.createCompetition
);

// @route   PUT /api/competitions/:id/join
// @desc    Join a competition
// @access  Private
router.put('/:id/join', auth, competitionController.joinCompetition);

// @route   GET /api/competitions/:id/participants
// @desc    Get competition participants
// @access  Public
router.get('/:id/participants', competitionController.getParticipants);

module.exports = router;
