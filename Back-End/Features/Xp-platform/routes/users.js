const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const multer = require('multer');
const path = require('path');

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads/avatars'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${req.user._id}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || 5242880) // 5MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (ext && mimetype) {
      return cb(null, true);
    }
    
    cb(new Error('Only image files are allowed!'));
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', auth, userController.getUserById);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/profile',
  auth,
  upload.single('avatar'),
  [
    check('name', 'Name cannot be empty if provided').optional().not().isEmpty(),
    check('username', 'Username cannot be empty if provided').optional().not().isEmpty()
  ],
  validate,
  userController.updateProfile
);

// @route   GET /api/users/leaderboard
// @desc    Get global leaderboard
// @access  Public
router.get('/leaderboard', userController.getLeaderboard);

// @route   GET /api/users/:id/activities
// @desc    Get user activities
// @access  Private
router.get('/:id/activities', auth, userController.getUserActivities);

module.exports = router;
