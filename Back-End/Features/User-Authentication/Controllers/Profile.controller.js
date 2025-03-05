import { User } from '../models/User.js';
import Student from '../models/Student.js';
import Organizer from '../models/Organizer.js';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Validation helpers
const validateStudentProfile = (data) => {
  const errors = {};

  // Basic required fields validation
  if (!data.education) errors.education = 'Education level is required';
  if (!data.school) errors.school = 'School or university name is required';

  // Graduation year validation
  const currentYear = new Date().getFullYear();
  if (data.graduationYear) {
    const year = parseInt(data.graduationYear);
    if (isNaN(year) || year < 1950 || year > currentYear + 30) {
      errors.graduationYear = 'Please enter a valid graduation year';
    }
  } else {
    errors.graduationYear = 'Graduation year is required';
  }

  // Bio length validation
  if (data.bio && data.bio.length > 500) {
    errors.bio = 'Bio cannot exceed 500 characters';
  }

  // Social links validation (if provided)
  if (data.socialLinks) {
    const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/;

    if (data.socialLinks.linkedin && !urlRegex.test(data.socialLinks.linkedin)) {
      errors.linkedin = 'Please enter a valid LinkedIn URL';
    }
    if (data.socialLinks.github && !urlRegex.test(data.socialLinks.github)) {
      errors.github = 'Please enter a valid GitHub URL';
    }
    if (data.socialLinks.twitter && !urlRegex.test(data.socialLinks.twitter)) {
      errors.twitter = 'Please enter a valid Twitter URL';
    }
    if (data.socialLinks.website && !urlRegex.test(data.socialLinks.website)) {
      errors.website = 'Please enter a valid website URL';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const validateOrganizerProfile = (data) => {
  const errors = {};

  // Basic required fields validation
  if (!data.organizationName) errors.organizationName = 'Organization name is required';
  if (!data.industry) errors.industry = 'Industry is required';
  if (!data.position) errors.position = 'Position is required';

  // Bio length validation
  if (data.bio && data.bio.length > 1000) {
    errors.bio = 'Bio cannot exceed 1000 characters';
  }

  // Contact info validation
  if (data.contactEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.contactEmail)) {
      errors.contactEmail = 'Please enter a valid email address';
    }
  }

  if (data.contactPhone) {
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(data.contactPhone.replace(/[\s-]/g, ''))) {
      errors.contactPhone = 'Please enter a valid phone number';
    }
  }

  // URL validations
  const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/;

  if (data.website && !urlRegex.test(data.website)) {
    errors.website = 'Please enter a valid website URL';
  }

  // Social links validation (if provided)
  if (data.socialLinks) {
    if (data.socialLinks.linkedin && !urlRegex.test(data.socialLinks.linkedin)) {
      errors.linkedin = 'Please enter a valid LinkedIn URL';
    }
    if (data.socialLinks.facebook && !urlRegex.test(data.socialLinks.facebook)) {
      errors.facebook = 'Please enter a valid Facebook URL';
    }
    if (data.socialLinks.twitter && !urlRegex.test(data.socialLinks.twitter)) {
      errors.twitter = 'Please enter a valid Twitter URL';
    }
    if (data.socialLinks.instagram && !urlRegex.test(data.socialLinks.instagram)) {
      errors.instagram = 'Please enter a valid Instagram URL';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// File upload helper
const handleFileUpload = async (file) => {
  try {
    if (!file) return null;

    // Define upload directory
    const uploadDir = path.join(process.cwd(), 'uploads', 'profiles');

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate a unique filename
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    // Write file to disk
    await fs.promises.writeFile(filePath, file.buffer);

    // Return the relative URL to access the file
    return `/uploads/profiles/${fileName}`;
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error('Failed to upload profile picture');
  }
};

/**
 * Update the user's role and create corresponding profile
 * @route POST /api/auth/update-role
 * @access Private
 */
export const updateRole = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming authentication middleware adds user to req
    const { role } = req.body;

    // Validate role
    if (!role || !['student', 'organizer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Role must be either 'student' or 'organizer'"
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if role is already assigned and a profile exists
    if (user.role === role && user.profile) {
      return res.status(400).json({
        success: false,
        message: `User already has the ${role} role`
      });
    }

    // Create new profile based on role
    let profile;
    if (role === 'student') {
      profile = new Student({ user: userId });
      await profile.save();

    } else { // role === 'organizer'
      profile = new Organizer({ user: userId });
      await profile.save();
    }

    // Update user with role and profile reference
    user.role = role;
    user.profile = profile._id;
    await user.save();

    // Return success response with updated user
    return res.status(200).json({
      success: true,
      message: `User role updated to ${role} successfully`,
      user: {
        ...user.toObject(),
        password: undefined // Remove password from response
      }
    });

  } catch (error) {
    console.error('Error updating user role:', error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating user role",
      error: error.message
    });
  }
};

/**
 * Get the user's profile data
 * @route GET /api/auth/profile
 * @access Private
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user and populate profile data based on role
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.profile) {
      return res.status(400).json({
        success: false,
        message: "User has no profile. Please set up your profile first."
      });
    }

    let profileData;
    if (user.role === 'student') {
      profileData = await Student.findById(user.profile);
    } else if (user.role === 'organizer') {
      profileData = await Organizer.findById(user.profile);
    }

    if (!profileData) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    return res.status(200).json({
      success: true,
      profile: profileData,
      user: {
        ...user.toObject(),
        password: undefined
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
      error: error.message
    });
  }
};

/**
 * Update the user's profile with additional details
 * @route PUT /api/auth/profile
 * @access Private
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Handle form data from multipart/form-data
    let profileData = {};
    if (req.body.profileData) {
      try {
        profileData = JSON.parse(req.body.profileData);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid profile data format"
        });
      }
    } else {
      profileData = req.body;
    }

    // Get user and validate
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.profile || !user.role) {
      return res.status(400).json({
        success: false,
        message: "User role and profile must be set before updating profile details"
      });
    }

    // Validate profile data based on role
    let validationResult;
    if (user.role === 'student') {
      validationResult = validateStudentProfile(profileData);
    } else if (user.role === 'organizer') {
      validationResult = validateOrganizerProfile(profileData);
    }

    if (!validationResult.isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid profile data",
        errors: validationResult.errors
      });
    }

    // Handle profile picture upload if present
    if (req.file) {
      try {
        const profilePicUrl = await handleFileUpload(req.file);
        profileData.profilePicture = profilePicUrl;
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Error uploading profile picture",
          error: error.message
        });
      }
    }

    // Update profile based on user role
    let updatedProfile;
    if (user.role === 'student') {
      updatedProfile = await Student.findByIdAndUpdate(
        user.profile,
        { ...profileData, isProfileComplete: true },
        { new: true, runValidators: true }
      );
    } else if (user.role === 'organizer') {
      updatedProfile = await Organizer.findByIdAndUpdate(
        user.profile,
        { ...profileData, isProfileComplete: true },
        { new: true, runValidators: true }
      );
    }

    if (!updatedProfile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    // IMPORTANT: Also update the User document to mark profile as complete
    user.profileComplete = true;
    await user.save();

    // Get updated user with profile
    const updatedUser = await User.findById(userId).select('-password');

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedProfile,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating profile",
      error: error.message
    });
  }
};

/**
 * Upload a profile picture
 * @route POST /api/auth/profile/upload-picture
 * @access Private
 */
export const uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.profile || !user.role) {
      return res.status(400).json({
        success: false,
        message: "User role and profile must be set before uploading a profile picture"
      });
    }

    // Handle file upload
    const profilePicUrl = await handleFileUpload(req.file);

    // Update profile with the new picture URL
    let updatedProfile;
    if (user.role === 'student') {
      updatedProfile = await Student.findByIdAndUpdate(
        user.profile,
        { profilePicture: profilePicUrl },
        { new: true }
      );
    } else if (user.role === 'organizer') {
      updatedProfile = await Organizer.findByIdAndUpdate(
        user.profile,
        { profilePicture: profilePicUrl },
        { new: true }
      );
    }

    if (!updatedProfile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      profilePicture: profilePicUrl
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return res.status(500).json({
      success: false,
      message: "Server error while uploading profile picture",
      error: error.message
    });
  }
};
