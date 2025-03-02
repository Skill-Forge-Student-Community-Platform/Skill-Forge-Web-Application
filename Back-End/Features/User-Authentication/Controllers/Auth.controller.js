import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { User } from "../models/User.js";
import {generateTokenAndSetCookie} from "../utils/generateTokenAndSetCookie.js";
import {sendVerificationEmail , sendWelcomeEmail , SendPasswordResetEmail ,SendResetSuccessEmail } from "../MailTrap/Emails.js";


export const signup = async (req , res) => {
  const { FirstName, LastName, Username, email, password } = req.body;

  try {
    if (!Username || !email || !password) {
      throw new Error("All fields are required");
    }

    // Check for existing email separately
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        message: "Email is already registered with a SkillForge account"
      });
    }

    // Check for existing username
    const usernameExists = await User.findOne({ Username });
    if (usernameExists) {
      return res.status(400).json({
        message: "Username is already taken"
      });
    }

    // hash the password , making the password not readable
    const hashedPassword = await bcryptjs.hash(password, 10);
    // generate random a verification token
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      FirstName,
      LastName,
      Username,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 1000, // 24h
    })

    await user.save();
    // jwt
    generateTokenAndSetCookie(res, user._id);
    // send verification email
    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    // Handle MongoDB duplicate key error specifically
    if (error.code === 11000) {
      // Check which field caused the duplicate error
      if (error.keyPattern?.email) {
        return res.status(400).json({
          message: "Email is already registered with a SkillForge account"
        });
      } else if (error.keyPattern?.Username) {
        return res.status(400).json({
          message: "Username is already taken"
        });
      } else {
        return res.status(400).json({
          message: "User already exists"
        });
      }
    }

    res.status(400).json({
      message: error.message
    });
  }

}

export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No account found with this email"
      });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid password"
      });
    }

    generateTokenAndSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error logging in: ", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during login"
    });
  }
}

export const Logout = async (req , res) => {
  res.clearCookie("AuthenticationToken");
  res.status(200).json({success: true,message: "logged out successfully"});

}

export const verifyEmail = async  (req , res) => {
  const {code} = req.body;

  try {
    const user = await User.findOne({
     verificationToken: code,
     verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({success: false, message: "Invalid or expired verification code"});
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.FirstName);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user :{
          ...user._doc,
          password: undefined,
        }
    });
  } catch (error) {
    console.log("Error verifying email: ", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export const forgetPassword = async (req , res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not Found" });
    }
    // Generate Reset tokens
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt  = Date.now() + 1 * 60 * 60 * 1000; // 1h time

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // Update to include the /auth prefix in the reset password URL
    await SendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`);
    console.log("Reset URL: ", `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`);

    res.status(200).json({success : true, message: "Password reset Link send to your email" });

  } catch (error) {
    console.log("Error in resetting the  password: ", error);
    res.status(400).json({ success: false, message: error.message });
  }
}

export const resetPassword = async (req , res) => {
  try {
    const{token} = req.params;
    const {password} = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: {$gt: Date.now()},
    });

    if (!user) {
        return res.status(400).json({success: false, message:"Invalid or reset token is expired"});
    }

    // update to new password after hashing it
    const hashedPassword = await bcryptjs.hash(password,10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    await SendResetSuccessEmail(user.email);

    res.status(200).json({success : true, message : "password rest successful"});
  } catch (error) {
      console.log("Error resetting the password", error)
      res.status(400).json({success: false , message: error.message});
  }
}

export const checkAuth = async (req , res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      res.status(400).json({success: false, message: "User not found"});
    }

    res.status(200).json({success: true, user});

  } catch (error) {
      console.log("Error in checkAuth" , error);
      res.status(400).json({success: false, message: error.message});
  }
}
