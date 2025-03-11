import express from 'express';
import { Login, Logout, signup , verifyEmail , forgetPassword , resetPassword, checkAuth} from '../Controllers/Auth.controller.js';
import {verifyToken} from '../middleware/verifyToken.js';



const router = express.Router();

router.get("/test", (req, res) => {
  res.send("testing the authentication route");
});

router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signup);
router.post("/login", Login);
router.post("/logout", Logout);

// verify email
router.post("/verify-email", verifyEmail);
// forget password
router.post("/forgot-password", forgetPassword);
// reset password
router.post("/reset-password/:token", resetPassword);


export default router;
