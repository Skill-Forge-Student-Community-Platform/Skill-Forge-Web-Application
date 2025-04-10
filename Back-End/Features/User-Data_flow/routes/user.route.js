import express from 'express';
import { verifyToken } from '../../User-Authentication/middleware/auth.middleware.js';
import {
  getUserProfile,
  followUnfollowUser,
  getSuggestedUsers,
  updateUser,
  getCompleteUserProfile,
  getUserFollowing,
  getUserFollowers
} from '../controllers/user.controller.js';

const router = express.Router();

router.get("/profile/:username", verifyToken, getUserProfile);
router.post("/follow/:id", verifyToken, followUnfollowUser);
router.get("/suggested", verifyToken, getSuggestedUsers);
router.put("/update", verifyToken, updateUser);
router.get("/complete-profile/:userId", verifyToken, getCompleteUserProfile);
router.get("/:userId/following", verifyToken, getUserFollowing);
router.get("/:userId/followers", verifyToken, getUserFollowers);

export default router;
