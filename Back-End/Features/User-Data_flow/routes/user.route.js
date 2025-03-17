import express from 'express';
import { verifyToken } from '../../User-Authentication/middleware/auth.middleware.js';
import {
  getUserProfile,
  followUnfollowUser,
  getSuggestedUsers,
  updateUser,
  getCompleteUserProfile  // Add this new controller function
} from '../controllers/user.controller.js';

const router = express.Router();

router.get("/profile/:username", verifyToken, getUserProfile);
router.post("/follow/:id", verifyToken, followUnfollowUser);
router.get("/suggested", verifyToken, getSuggestedUsers);
router.put("/update", verifyToken, updateUser);
router.get("/complete-profile/:userId", verifyToken, getCompleteUserProfile);  // Add new route

export default router;
