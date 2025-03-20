import express from 'express';
import { verifyToken } from '../../User-Authentication/middleware/auth.middleware.js';
import {
  getNotifications,
  deleteAllNotifications,
  deleteNotification,
  markAllAsRead,
  markAsRead
} from '../controllers/Notification.controller.js';

const router = express.Router();

// Notification routes - all require authentication
router.get('/', verifyToken, getNotifications);
router.delete('/', verifyToken, deleteAllNotifications);

router.delete('/:notificationId', verifyToken, deleteNotification);
router.patch('/read/all', verifyToken, markAllAsRead);
router.patch('/read/:notificationId', verifyToken, markAsRead);

export default router;
