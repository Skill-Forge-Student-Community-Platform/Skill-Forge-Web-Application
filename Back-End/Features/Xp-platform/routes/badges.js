const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const badgeController = require('../controllers/badgeController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const checkRole = require('../middleware/checkRole');

// @route   GET /api/badges
// @desc    Get all badges
// @access  Public
router.get('/', badgeController.getAllBadges);

// @route   GET /api/badges/:userId
// @desc    Get user badges
// @access  Private
router.get('/:userId', auth, badgeController.getUserBadges);

// @route   POST /api/badges
// @desc    Create a new badge (admin only)
// @access  Private/Admin
router.post(
  '/',
  auth,
  checkRole(['admin']),
  [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('category', 'Category is required').isIn(['Participation', 'Skill-Based', 'Achievement', 'Community', 'Special']),
    check('icon', 'Icon is required').not().isEmpty(),
    check('unlockRequirement', 'Unlock requirement is required').not().isEmpty(),
    check('xpReward', 'XP reward must be a positive number').isInt({ min: 0 })
  ],
  validate,
  badgeController.createBadge
);

// @route   POST /api/badges/award
// @desc    Award a badge to a user
// @access  Private/Admin
router.post(
  '/award',
  auth,
  checkRole(['admin', 'moderator']),
  [
    check('userId', 'User ID is required').not().isEmpty(),
    check('badgeId', 'Badge ID is required').not().isEmpty()
  ],
  validate,
  badgeController.awardBadge
);

// @route   GET /api/badges/check/:userId
// @desc    Check badge requirements for a user
// @access  Private
router.get('/check/:userId', auth, badgeController.checkBadgeRequirements);

module.exports = router;
