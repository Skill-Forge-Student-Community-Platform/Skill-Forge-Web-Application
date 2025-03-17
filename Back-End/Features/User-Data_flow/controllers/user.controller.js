import { User } from '../../User-Authentication/models/User.js';
import Student from '../../User-Authentication/models/Student.js';
import Organizer from '../../User-Authentication/models/Organizer.js';
import Notification from '../../Notifications/models/Notification.js';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from "cloudinary";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    // Find user by username
    const user = await User.findOne({ Username: username }).select("-password");
    if (!user) return res.status(404).json({
      success: false,
      message: "User not found"
    });

    // Get additional profile details based on role
    let profileData = null;
    if (user.role && user.profile) {
      if (user.role === 'student') {
        profileData = await Student.findById(user.profile);
      } else if (user.role === 'organizer') {
        profileData = await Organizer.findById(user.profile);
      }
    }

    res.status(200).json({
      success: true,
      user: user,
      profile: profileData
    });
  } catch (error) {
    console.log("Error in getUserProfile: ", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;

    if (id === currentUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow/unfollow yourself"
      });
    }

    const userToModify = await User.findById(id);
    const currentUser = await User.findById(currentUserId);

    if (!userToModify || !currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow logic
      await User.findByIdAndUpdate(id, { $pull: { followers: currentUserId } });
      await User.findByIdAndUpdate(currentUserId, { $pull: { following: id } });

      //TODO: return id of  the user as a response
      return res.status(200).json({
        success: true,
        message: "User unfollowed successfully"
      });
    } else {
      // Follow logic
      await User.findByIdAndUpdate(id, { $push: { followers: currentUserId } });
      await User.findByIdAndUpdate(currentUserId, { $push: { following: id } });

      // Create notification
      const newNotification = new Notification({
        type: "follow",
        from: currentUserId,
        to: id,
        createdAt: Date.now()
      });

      await newNotification.save();
      // TODO: Send notification to user
      return res.status(200).json({
        success: true,
        message: "User followed successfully"
      });
    }
  } catch (error) {

    console.log("Error in followUnfollowUser: ", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user.id; // Using req.user.id as per your authentication setup

    const usersFollowedByMe = await User.findById(userId).select("following");

    // Use aggregation to get a random sample of users that aren't the current user
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      { $sample: { size: 10 } }, // Get a random sample of 10 users
    ]);

    // Filter out users that are already being followed
    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );

    // Take only the first 4 for suggestions
    const suggestedUsers = filteredUsers.slice(0, 4);

    // Remove passwords from the results
    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json({
      success: true,
      suggestedUsers
    });
  } catch (error) {
    console.log("Error in getSuggestedUsers: ", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateUser = async (req, res) => {
  const { FirstName, LastName, email, Username, currentPassword, newPassword, bio, link } = req.body;
  let { profilePicture, coverImg } = req.body;

  const userId = req.user.id;

  try {
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({
      success: false,
      message: "User not found"
    });

    // Password update logic
    if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Please provide both current password and new password"
      });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long"
        });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Handle profile picture upload via Cloudinary
    if (profilePicture && profilePicture.startsWith('data:')) {
      // Get current profile picture from role-specific profile
      let currentProfilePic = null;
      if (user.role === 'student') {
        const studentProfile = await Student.findById(user.profile);
        if (studentProfile) {
          currentProfilePic = studentProfile.profilePicture;
        }
      } else if (user.role === 'organizer') {
        const organizerProfile = await Organizer.findById(user.profile);
        if (organizerProfile) {
          currentProfilePic = organizerProfile.profilePicture;
        }
      }

      // Delete old profile image from Cloudinary if it exists
      if (currentProfilePic && currentProfilePic.includes('cloudinary')) {
        const publicId = currentProfilePic.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload new profile image
      const uploadedResponse = await cloudinary.uploader.upload(profilePicture, {
        folder: 'skill-forge/profiles',
        resource_type: 'image'
      });
      profilePicture = uploadedResponse.secure_url;
    }

    // Handle cover image upload via Cloudinary
    if (coverImg && coverImg.startsWith('data:')) {
      // Delete old cover image from Cloudinary if it exists
      if (user.coverImg && user.coverImg.includes('cloudinary')) {
        const publicId = user.coverImg.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload new cover image
      const uploadedResponse = await cloudinary.uploader.upload(coverImg, {
        folder: 'skill-forge/covers',
        resource_type: 'image'
      });
      coverImg = uploadedResponse.secure_url;
      user.coverImg = coverImg;
    }

    // Update user fields if provided
    user.FirstName = FirstName || user.FirstName;
    user.LastName = LastName || user.LastName;
    user.email = email || user.email;
    user.Username = Username || user.Username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    // Profile picture and cover image are already handled above

    // Save the updated user
    await user.save();

    // Update profile data based on role
    if (user.role && user.profile) {
      if (user.role === 'student') {
        const studentProfile = await Student.findById(user.profile);
        if (studentProfile) {
          if (bio !== undefined) studentProfile.bio = bio;
          if (profilePicture) studentProfile.profilePicture = profilePicture;
          await studentProfile.save();
        }
      } else if (user.role === 'organizer') {
        const organizerProfile = await Organizer.findById(user.profile);
        if (organizerProfile) {
          if (bio !== undefined) organizerProfile.bio = bio;
          if (profilePicture) organizerProfile.profilePicture = profilePicture;
          await organizerProfile.save();
        }
      }
    }

    // Fetch the updated user to return in response
    const updatedUser = await User.findById(userId).select("-password");

    // Get updated profile data
    let profileData = null;
    if (user.role && user.profile) {
      if (user.role === 'student') {
        profileData = await Student.findById(user.profile);
      } else if (user.role === 'organizer') {
        profileData = await Organizer.findById(user.profile);
      }
    }

    return res.status(200).json({
      success: true,
      user: updatedUser,
      profile: profileData,
      message: "User updated successfully"
    });
  } catch (error) {
    console.log("Error in updateUser: ", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getCompleteUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find user by ID
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({
      success: false,
      message: "User not found"
    });

    // Get additional profile details based on role
    let profileData = null;
    if (user.role && user.profile) {
      if (user.role === 'student') {
        profileData = await Student.findById(user.profile);
      } else if (user.role === 'organizer') {
        profileData = await Organizer.findById(user.profile);
      }
    }

    // Create a merged profile object with normalized structure
    const completeProfile = {
      // Basic user info
      _id: user._id,
      username: user.Username,
      firstName: user.FirstName,
      lastName: user.LastName,
      email: user.email,
      role: user.role,

      // Derived fields for consistent access
      fullName: user.FirstName && user.LastName ?
        `${user.FirstName} ${user.LastName}` :
        (profileData?.fullName || user.Username),

      // Cover image from user model
      coverImg: user.coverImg,

      // Profile picture - prioritize from role-specific profile
      profilePicture: profileData?.profilePicture || null,

      // Bio - prioritize from role-specific profile
      bio: profileData?.bio || null,

      // Social data
      link: user.link || null,
      socialLinks: profileData?.socialLinks || {},

      // User social networking data
      followers: user.followers,
      following: user.following,

      // Complete role-specific profile data
      profileData: profileData,

      // Timestamps
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,

      // Profile completion status
      profileComplete: user.profileComplete
    };

    res.status(200).json({
      success: true,
      data: completeProfile
    });
  } catch (error) {
    console.log("Error in getCompleteUserProfile: ", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
