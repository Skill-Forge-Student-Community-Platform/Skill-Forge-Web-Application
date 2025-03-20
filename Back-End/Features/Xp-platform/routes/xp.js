const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const xpController = require('../controllers/xpController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const checkRole = require('../middleware/checkRole');

// @route   POST /api/xp/award
// @desc    Award XP to a user
// @access  Private (Admin or authorized roles only)
router.post(
  '/award',
  auth,
  checkRole(['admin', 'moderator']),
  [
    check('userId', 'User ID is required').not().isEmpty(),
    check('amount', 'Amount must be a positive number').isInt({ min: 1 }),
    check('reason', 'Reason is required').not().isEmpty(),
    check('type', 'Type must be valid').optional().isIn([
      'challenge_completion',
      'competition_participation',
      'competition_win',
      'badge_earned',
      'article_submission',
      'mentoring',
      'daily_login',
      'profile_update',
      'level_up',
      'other'
    ])
  ],
  validate,
  xpController.awardXP
);

// @route   GET /api/xp/history/:userId
// @desc    Get XP history for a user
// @access  Private
router.get('/history/:userId', auth, validate, xpController.getXPHistory);

// @route   GET /api/xp/levels
// @desc    Get level requirements
// @access  Public
router.get('/levels', validate, xpController.getLevelRequirements);

module.exports = router;
