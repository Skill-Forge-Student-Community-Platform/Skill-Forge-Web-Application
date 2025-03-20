const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const activityController = require('../controllers/activityController');
const auth = require('../middleware/auth');

// @route   GET /api/activities/:userId
// @desc    Get activities for a user
// @access  Private
router.get('/:userId', auth, activityController.getUserActivities);

// @route   POST /api/activities
// @desc    Create an activity
// @access  Private
router.post(
  '/',
  auth,
  [
    check('type', 'Type is required').isIn([
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
    ]),
    check('description', 'Description is required').not().isEmpty(),
    check('xpEarned', 'XP earned must be a non-negative number').optional().isInt({ min: 0 })
  ],
  activityController.createActivity
);

// @route   GET /api/activities
// @desc    Get global activity feed
// @access  Public (could be private depending on your requirements)
router.get('/', activityController.getGlobalFeed);

module.exports = router;
