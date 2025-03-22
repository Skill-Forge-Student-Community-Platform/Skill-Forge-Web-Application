import express from "express";
import { searchUsers } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/search",protectRoute, searchUsers);

export default router;
