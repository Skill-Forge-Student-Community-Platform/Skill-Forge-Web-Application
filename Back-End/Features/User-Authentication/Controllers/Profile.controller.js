import { User } from '../models/User.js';
import Student from '../models/Student.js';
import Organizer from '../models/Organizer.js';
import { v2 as cloudinary } from 'cloudinary';


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

// File upload helper (updated to use cloudinary)
const handleFileUpload = async (file) => {
  try {
    if (!file) return null;

    // Debug logging
    console.log("File received for upload:", file.name);
    console.log("File mime type:", file.mimetype);
    console.log("File data type:", typeof file.data);

    // Check if we have valid Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET) {
      throw new Error("Cloudinary configuration is incomplete");
    }

    // Common upload options
    const uploadOptions = {
      folder: 'skill-forge/profile-pictures',
      resource_type: 'auto'
    };

    // Handle file data based on what's available
    let result;

    if (file.tempFilePath) {
      // express-fileupload gives us a tempFilePath (string path)
      console.log("Using tempFilePath for upload");
      result = await cloudinary.uploader.upload(file.tempFilePath, uploadOptions);
    } else if (file.path) {
      // multer gives us a path (string path)
      console.log("Using path for upload");
      result = await cloudinary.uploader.upload(file.path, uploadOptions);
    } else if (file.data) {
      // For Buffer data, we need to use the buffer upload approach
      console.log("Using buffer data for upload");

      // Convert buffer to base64 string for Cloudinary
      const base64Data = file.data.toString('base64');
      const dataURI = `data:${file.mimetype};base64,${base64Data}`;

      result = await cloudinary.uploader.upload(dataURI, uploadOptions);
    } else {
      throw new Error("No valid file data found to upload");
    }

    if (!result || !result.secure_url) {
      throw new Error("Upload succeeded but no URL was returned");
    }

    console.log("Cloudinary upload successful:", result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error('File upload error details:', error);
    // More specific error message with actual error details
    throw new Error(`Failed to upload profile picture: ${error.message || 'Unknown cloudinary error'}`);
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
    console.log(`Processing profile update for user: ${userId}`);

    // Handle form data from multipart/form-data
    let profileData = {};
    if (req.body.profileData) {
      try {
        profileData = JSON.parse(req.body.profileData);
        console.log("Successfully parsed profile data JSON");
      } catch (error) {
        console.error("Failed to parse profile data JSON:", error);
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
      console.log(`User ${userId} not found`);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log(`Found user ${userId}, role: ${user.role}, profile ID: ${user.profile}`);

    if (!user.profile || !user.role) {
      return res.status(400).json({
        success: false,
        message: "User role and profile must be set before updating profile details"
      });
    }

    // First check if profile exists, create if it doesn't
    let existingProfile;
    if (user.role === 'student') {
      existingProfile = await Student.findById(user.profile);
      if (!existingProfile) {
        console.log(`Student profile ${user.profile} not found, creating new profile`);
        existingProfile = new Student({ _id: user.profile, user: userId });
        await existingProfile.save();
      }
    } else if (user.role === 'organizer') {
      existingProfile = await Organizer.findById(user.profile);
      if (!existingProfile) {
        console.log(`Organizer profile ${user.profile} not found, creating new profile`);
        existingProfile = new Organizer({ _id: user.profile, user: userId });
        await existingProfile.save();
      }
    }

    console.log(`Profile exists: ${!!existingProfile}`);

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
    if (req.files && req.files.profilePicture) {
      try {
        console.log("Profile picture found in request:", req.files.profilePicture.name);

        // Validate file type (optional but recommended)
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        if (!allowedTypes.includes(req.files.profilePicture.mimetype)) {
          return res.status(400).json({
            success: false,
            message: "Invalid file type. Only JPG, PNG and GIF images are allowed."
          });
        }

        const profilePicUrl = await handleFileUpload(req.files.profilePicture);
        if (!profilePicUrl) {
          throw new Error("Failed to get URL after upload");
        }

        profileData.profilePicture = profilePicUrl;
      } catch (error) {
        console.error("Profile picture upload failed:", error);
        return res.status(500).json({
          success: false,
          message: "Error uploading profile picture",
          error: error.message || "Unknown upload error"
        });
      }
    }

    // Update profile based on user role - using findOneAndUpdate for better reliability
    let updatedProfile;
    if (user.role === 'student') {
      updatedProfile = await Student.findOneAndUpdate(
        { _id: user.profile },
        { ...profileData, isProfileComplete: true, user: userId },
        { new: true, runValidators: true, upsert: true }
      );
    } else if (user.role === 'organizer') {
      updatedProfile = await Organizer.findOneAndUpdate(
        { _id: user.profile },
        { ...profileData, isProfileComplete: true, user: userId },
        { new: true, runValidators: true, upsert: true }
      );
    }

    if (!updatedProfile) {
      console.error(`Failed to update/create profile for user ${userId}`);
      return res.status(500).json({
        success: false,
        message: "Failed to update profile"
      });
    }

    console.log(`Successfully updated profile for user ${userId}`);

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
 * Create the user's initial profile
 * @route POST /api/auth/create-profile
 * @access Private
 */
export const createProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Handle form data from express-fileupload
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
        message: "User role must be set before creating a profile"
      });
    }

    // Check if user already has a complete profile
    if (user.profileComplete) {
      return res.status(400).json({
        success: false,
        message: "User already has a complete profile. Use the update route instead."
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
    if (req.files && req.files.profilePicture) {
      try {
        console.log("Profile picture found in request:", req.files.profilePicture.name);

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        if (!allowedTypes.includes(req.files.profilePicture.mimetype)) {
          return res.status(400).json({
            success: false,
            message: "Invalid file type. Only JPG, PNG and GIF images are allowed."
          });
        }

        const profilePicUrl = await handleFileUpload(req.files.profilePicture);
        if (!profilePicUrl) {
          throw new Error("Failed to get URL after upload");
        }

        profileData.profilePicture = profilePicUrl;
      } catch (error) {
        console.error("Profile picture upload failed:", error);
        return res.status(500).json({
          success: false,
          message: "Error uploading profile picture",
          error: error.message || "Unknown upload error"
        });
      }
    }

    // Create/update profile based on user role
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

    // Get updated user data
    const updatedUser = await User.findById(userId).select('-password');

    return res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile: updatedProfile,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating profile",
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

    // Check if request has files
    if (!req.files || !req.files.profilePicture) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!allowedTypes.includes(req.files.profilePicture.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file type. Only JPG, PNG and GIF images are allowed."
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
    console.log("Processing profile picture upload");
    const profilePicUrl = await handleFileUpload(req.files.profilePicture);
    if (!profilePicUrl) {
      throw new Error("Failed to get URL after upload");
    }

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
