import express from 'express';
import {
  createPost,
  getFeedPosts,
  getUserPosts,
  likeUnlikePost,
  addComment,
  deletePost,
  sharePost
} from '../controllers/Post.controller.js';
import { verifyToken, checkUserRole, checkProfileComplete } from '../../User-Authentication/middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected - require authentication, role selection and profile completion
router.post('/create', verifyToken, checkUserRole, checkProfileComplete, createPost);
router.get('/feed', verifyToken, getFeedPosts);
router.get('/user/:userId', verifyToken, getUserPosts);
router.post('/:postId/like', verifyToken, likeUnlikePost);
router.post('/:postId/comment', verifyToken, addComment);
router.delete('/:postId', verifyToken, checkProfileComplete, deletePost);
router.post('/:postId/share', verifyToken, checkUserRole, checkProfileComplete, sharePost);

export default router;
