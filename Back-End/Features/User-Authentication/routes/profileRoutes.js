import express from 'express';
import { updateRole, updateProfile, getProfile, uploadProfilePicture } from '../Controllers/Profile.controller.js';
import { verifyToken, checkUserRole, checkProfileComplete } from '../middleware/auth.middleware.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Check file types
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Profile setup routes (no role check needed as these are for initial setup)
router.post("/update-role", verifyToken, updateRole);
router.put("/profile", verifyToken, upload.single('profilePicture'), updateProfile);
router.get("/profile", verifyToken, getProfile);

// Routes that require both role and profile completion
router.post("/profile/upload-picture", verifyToken, checkUserRole, upload.single('profilePicture'), uploadProfilePicture);

// Export example route that requires a complete profile
router.get("/dashboard-data", verifyToken, checkUserRole, checkProfileComplete, (req, res) => {
  res.json({
    success: true,
    message: "You have successfully accessed protected data that requires a complete profile",
    role: req.user.role
  });
});

export default router;
