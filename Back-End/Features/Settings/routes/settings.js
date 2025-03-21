const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  updateName,
  updateEmail,
  updatePassword,
  getLastLogin,
  updateSocialLinks,
  updateNotifications,
  deleteAccount
} = require('../controllers/settingsController');

/**
 * @route   PUT /api/settings/profile
 * @desc    Update user profile (name and username)
 * @access  Private
 */
router.put('/profile', auth, updateName);

/**
 * @route   PUT /api/settings/name
 * @desc    Update user name and username (alias for /profile)
 * @access  Private
 */
router.put('/name', auth, updateName);

/**
 * @route   PUT /api/settings/email
 * @desc    Update user email
 * @access  Private
 */
router.put('/email', auth, updateEmail);

/**
 * @route   PUT /api/settings/password
 * @desc    Update user password
 * @access  Private
 */
router.put('/password', auth, updatePassword);

/**
 * @route   GET /api/settings/last-login
 * @desc    Get user's last login information
 * @access  Private
 */
router.get('/last-login', auth, getLastLogin);

/**
 * @route   PUT /api/settings/social-links
 * @desc    Update user's social links
 * @access  Private
 */
router.put('/social-links', auth, updateSocialLinks);

/**
 * @route   PUT /api/settings/notifications
 * @desc    Update user's notification settings
 * @access  Private
 */
router.put('/notifications', auth, updateNotifications);

/**
 * @route   DELETE /api/settings/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/account', auth, deleteAccount);

module.exports = router; 