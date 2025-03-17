import express from 'express';
import { updateRole, createProfile, updateProfile, getProfile, uploadProfilePicture } from '../Controllers/Profile.controller.js';
import { verifyToken, checkUserRole, checkProfileComplete } from '../middleware/auth.middleware.js';

const router = express.Router();

// Profile setup routes (no role check needed as these are for initial setup)
router.post("/update-role", verifyToken, updateRole);
router.post("/create-profile", verifyToken, createProfile);  // New route for initial profile creation
router.put("/profile", verifyToken, updateProfile);  // express-fileupload handles this from app config
router.get("/profile", verifyToken, getProfile);

// Routes that require both role and profile completion
router.post("/profile/upload-picture", verifyToken, checkUserRole, uploadProfilePicture);

// Export example route that requires a complete profile
router.get("/dashboard-data", verifyToken, checkUserRole, checkProfileComplete, (req, res) => {
  res.json({
    success: true,
    message: "You have successfully accessed protected data that requires a complete profile",
    role: req.user.role
  });
});

export default router;
