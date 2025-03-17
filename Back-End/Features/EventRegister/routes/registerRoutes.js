

import express from "express";
import{ registerUser,getRegisteredUsersByEvent,removeUserFromEvent,getRegisteredUser } from "../controllers/registerController.js";

const router = express.Router();
// Register User Route
router.post("/register", registerUser);
router.get("/registered-users", getRegisteredUser);

router.get("/registered-users/:eventId", getRegisteredUsersByEvent);

router.delete("/remove-user/:registrationId", removeUserFromEvent);

//router.patch("/update-points/:userId", updateUserPoints);



export default router;



