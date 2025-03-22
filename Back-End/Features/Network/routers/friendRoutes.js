import express from 'express';
import { verifyToken } from '../../User-Authentication/middleware/auth.middleware.js';
import { 
  sendFriendRequest,
  acceptFriendRequest, 
  rejectFriendRequest,
  removeFriend,
  getFriendRequests,
  getFriends,
  getSuggestedFriends
} from '../controllers/friendController.js';

const router = express.Router();

router.get('/requests', verifyToken, getFriendRequests);
router.get('/friends', verifyToken, getFriends);
router.get('/suggested', verifyToken, getSuggestedFriends);
router.post('/send-request/:userId', verifyToken, sendFriendRequest);
router.post('/accept-request/:userId', verifyToken, acceptFriendRequest);
router.post('/reject-request/:userId', verifyToken, rejectFriendRequest);
router.delete('/remove/:userId', verifyToken, removeFriend);

export default router;