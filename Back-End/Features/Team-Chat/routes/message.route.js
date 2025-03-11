import express from "express";
<<<<<<< HEAD
import {protectRoute} from "../middleware/auth.middleware.js"
import { getMessages, getUsersForSidebar, sendMessages } from "../Controllers/message.controller.js";
=======

// import {protectRoute} from "../../User-Authentication/middleware/auth.middleware.js";

import { getMessages, getUsersForSidebar, sendMessages } from "../controllers/message.controller.js";
>>>>>>> a083d0924c93b0bf239def691b09391aeba88a05


const router = express.Router();

<<<<<<< HEAD
// before gettiing the users the the route must be protected
// when accessing this endpoint, its checks, whether the route is protected or not
// if protected it then gets the users
router.get("/users", protectRoute, getUsersForSidebar);
=======


// router.get("/users", protectRoute, getUsersForSidebar);
>>>>>>> a083d0924c93b0bf239def691b09391aeba88a05
// fetches messages with the user id
// router.get("/:id", protectRoute, getMessages);

// Send message to the user id
// router.post("/send/:id", protectRoute, sendMessages);

export default router;

