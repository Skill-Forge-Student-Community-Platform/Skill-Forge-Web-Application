import express from "express";
import { verifyToken } from "../../User-Authentication/middleware/auth.middleware.js";
import { getUsersForSidebar, getMessages, sendMessages } from "../Controllers/message.controller.js";


const router = express.Router();


router.get("/users", verifyToken, getUsersForSidebar);
// fetches messages with the user id
router.get("/:id", verifyToken, getMessages);

// Send message to the user id
router.post("/send/:id", verifyToken, sendMessages);


export default router;

