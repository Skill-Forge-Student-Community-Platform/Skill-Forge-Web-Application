import express from "express";

<<<<<<< HEAD
// import {protectRoute} from "../middleware/auth.middleware.js"
// import { getMessages, getUsersForSidebar, sendMessages } from "../controllers/message.controller.js";

=======
// import {protectRoute} from "../../User-Authentication/middleware/auth.middleware.js";

import { getMessages, getUsersForSidebar, sendMessages } from "../controllers/message.controller.js";
>>>>>>> a083d0924c93b0bf239def691b09391aeba88a05


const router = express.Router();



// router.get("/users", protectRoute, getUsersForSidebar);
// fetches messages with the user id
// router.get("/:id", protectRoute, getMessages);

// Send message to the user id
// router.post("/send/:id", protectRoute, sendMessages);

<<<<<<< HEAD

=======
>>>>>>> a083d0924c93b0bf239def691b09391aeba88a05
export default router;

