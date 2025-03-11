import express from "express";
import {protectRoute} from "../middleware/auth.middleware.js"
import { getMessages, getUsersForSidebar, sendMessages } from "../Controllers/message.controller.js";


const router = express.Router();

// before gettiing the users the the route must be protected
// when accessing this endpoint, its checks, whether the route is protected or not
// if protected it then gets the users
router.get("/users", protectRoute, getUsersForSidebar);
// fetches messages with the user id
router.get("/:id", protectRoute, getMessages);

// Send message to the user id
router.post("/send/:id", protectRoute, sendMessages);

export default router;