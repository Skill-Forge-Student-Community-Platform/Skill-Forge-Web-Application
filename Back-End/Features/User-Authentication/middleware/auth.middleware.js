import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import Student from '../models/Student.js';
import Organizer from '../models/Organizer.js';

export const verifyToken = (req, res, next) => {
  try {
    // Get token from cookie OR Authorization header
    const token = req.cookies.AuthenticationToken || req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to request
    req.user = {
      id: decoded.userId,
      email: decoded.email
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired. Please log in again.'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token. Please log in again.'
    });
  }
};

export const checkUserRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.role) {
      return res.status(403).json({
        success: false,
        message: 'You must select a role (student or organizer) before accessing this resource.'
      });
    }

    // Add role to request for convenience
    req.user.role = user.role;
    next();
  } catch (error) {
    console.error('Role check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while checking user role.'
    });
  }
};

export const checkProfileComplete = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.role || !user.profile) {
      return res.status(403).json({
        success: false,
        message: 'You must complete your profile before accessing this resource.'
      });
    }

    // Check if profile is complete based on user role
    let profileComplete = false;
    if (user.role === 'student') {
      const studentProfile = await Student.findById(user.profile);
      profileComplete = studentProfile && studentProfile.isProfileComplete;
    } else if (user.role === 'organizer') {
      const organizerProfile = await Organizer.findById(user.profile);
      profileComplete = organizerProfile && organizerProfile.isProfileComplete;
    }

    if (!profileComplete) {
      return res.status(403).json({
        success: false,
        message: 'Please complete your profile before accessing this resource.'
      });
    }

    next();
  } catch (error) {
    console.error('Profile completion check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while checking profile completion.'
    });
  }
};
