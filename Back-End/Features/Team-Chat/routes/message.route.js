import express from "express";
// import {protectRoute} from "../middleware/auth.middleware.js"
// import { getMessages, getUsersForSidebar, sendMessages } from "../controllers/message.controller.js";


const router = express.Router();


// router.get("/users", protectRoute, getUsersForSidebar);
// fetches messages with the user id
// router.get("/:id", protectRoute, getMessages);

// Send message to the user id
// router.post("/send/:id", protectRoute, sendMessages);

export default router;
