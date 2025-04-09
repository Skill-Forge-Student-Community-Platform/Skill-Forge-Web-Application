import express from 'express';
import { searchEvents } from '../Controllers/event.controller.js';
import { protect } from '../../User-Authentication/middlewares/authMiddleware.js';

const router = express.Router();

// Search events route
router.get('/search', protect, searchEvents);

// ...existing routes...

export default router;
