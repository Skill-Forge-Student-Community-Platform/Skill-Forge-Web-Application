import express from "express";
import { verifyToken } from "../../User-Authentication/middleware/auth.middleware.js";
import { getUsersForSidebar } from "../Controllers/message.controller.js";


const router = express.Router();


router.get("/users", verifyToken, getUsersForSidebar);
// fetches messages with the user id
// router.get("/:id", protectRoute, getMessages);

// Send message to the user id
// router.post("/send/:id", protectRoute, sendMessages);


export default router;

