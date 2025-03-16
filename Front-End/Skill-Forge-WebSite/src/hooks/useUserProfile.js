import { useState, useEffect, useCallback } from 'react';
import roleServices from '../services/roleServices';
import { useAuthStore } from '../store/authStore';
// Import a local fallback image
import defaultProfilePicture from '../Assets/test-profile-pic.jpg';
// Import our new image cache
import imageCache from '../utils/imageCache';

// Ensure a clean default export with no named export
function useUserProfile(userId) {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(!!userId); // Only set loading true if we have a userId
  const [error, setError] = useState(null);
  const { user } = useAuthStore();
  const [profileImage, setProfileImage] = useState(null);

  // Temporary fallback solution if backend endpoint not yet available
  const getUserData = async (userId) => {
    try {
      // Try the complete profile endpoint first
      const response = await roleServices.fetchUserProfileData(userId);
      return response.data;
    } catch (err) {
      console.log("Complete profile endpoint failed, falling back to basic user data");

      // Fallback to getting current user data from auth store
      if (user && user._id === userId) {
        return {
          _id: user._id,
          username: user.Username,
          firstName: user.FirstName,
          lastName: user.LastName,
          email: user.email,
          role: user.role,
          fullName: user.FirstName && user.LastName ?
            `${user.FirstName} ${user.LastName}` : user.Username,
          profilePicture: user.profilePicture,
          profileComplete: user.profileComplete,
          followers: user.followers || [],
          following: user.following || [],
          coverImg: user.coverImg,
          link: user.link
        };
      }

      throw new Error("User profile data unavailable");
    }
  };

  // Enhanced get profile image function that uses the cache
  const getProfileImage = useCallback(() => {
    // First check if we have set a profile image in state
    if (profileImage) {
      return profileImage;
    }

    // Then check if we have profile picture from merged profile data
    if (profileData?.profilePicture) {
      return profileData.profilePicture;
    }

    // Check if image is in our memory cache
    const cachedImage = imageCache.getCachedImage(userId);
    if (cachedImage) {
      return cachedImage;
    }

    // Then check current user object from auth store
    if (user?.profilePicture && user._id === userId) {
      return user.profilePicture;
    }

    // Finally, use local fallback image
    return defaultProfilePicture;
  }, [profileData, profileImage, user, userId]);

  useEffect(() => {
    // Skip fetching if no userId is provided
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchProfileData = async () => {
      try {
        setIsLoading(true);

        // Start pre-fetching the image to populate cache
        imageCache.getImage(userId).then(imageUrl => {
          if (imageUrl) {
            setProfileImage(imageUrl);
          }
        });

        // Get full profile data
        const data = await getUserData(userId);
        setProfileData(data);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError(typeof err === 'string' ? err : err.message || "Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();

    // Clean up function - run cache maintenance
    return () => {
      imageCache.clearExpiredCache();
    };
  }, [userId, user]);

  // Add this helper function in the useUserProfile hook
  const getInstitutionName = () => {
    const roleData = profileData?.profileData || {};

    if (profileData?.role === 'student') {
      return roleData.school || '';
    } else if (profileData?.role === 'organizer') {
      return roleData.organizationName || '';
    }

    return '';
  };

  // Enhance getOccupation to be more descriptive based on role
  const getOccupation = () => {
    if (!profileData || !profileData.profileData) return "";

    const roleData = profileData.profileData;

    if (profileData.role === 'student') {
      // For students, return field of study + "Student"
      return `${roleData.fieldOfStudy || ''} ${roleData.fieldOfStudy ? 'Student' : 'Student'}`;
    } else if (profileData.role === 'organizer') {
      // For organizers, prioritize position, then organizerType
      return roleData.position || roleData.organizerType || "Organizer";
    }

    return "";
  };

  // Helper to get social links with proper fallbacks
  const getSocialLinks = () => {
    // Try to get from profile-specific data first
    if (profileData?.profileData?.socialLinks) {
      return profileData.profileData.socialLinks;
    }

    // Otherwise construct from available fields
    const links = {};
    const roleData = profileData?.profileData || {};

    // Common links
    if (roleData.linkedin) links.linkedin = roleData.linkedin;
    if (roleData.twitter) links.twitter = roleData.twitter;

    // Student-specific links
    if (profileData?.role === 'student') {
      if (roleData.github) links.github = roleData.github;
      if (roleData.website) links.website = roleData.website;
    }
    // Organizer-specific links
    else if (profileData?.role === 'organizer') {
      if (roleData.facebook) links.facebook = roleData.facebook;
      if (roleData.instagram) links.instagram = roleData.instagram;
      if (roleData.website) links.website = roleData.website;
    }

    return links;
  };

  // Get expertise/skills based on role
  const getSkillsOrExpertise = () => {
    const roleData = profileData?.profileData || {};

    if (profileData?.role === 'student') {
      return roleData.skills || [];
    } else if (profileData?.role === 'organizer') {
      return roleData.expertise || [];
    }

    return [];
  };

  // Get education details (student-specific)
  const getEducationDetails = () => {
    if (profileData?.role !== 'student' || !profileData?.profileData) {
      return null;
    }

    const student = profileData.profileData;
    return {
      school: student.school || '',
      education: student.education || '',
      fieldOfStudy: student.fieldOfStudy || '',
      graduationYear: student.graduationYear || '',
      yearOfStudy: student.yearOfStudy || '',
      studentId: student.studentId || ''
    };
  };

  // Get organization details (organizer-specific)
  const getOrganizationDetails = () => {
    if (profileData?.role !== 'organizer' || !profileData?.profileData) {
      return null;
    }

    const organizer = profileData.profileData;
    return {
      organizationName: organizer.organizationName || '',
      industry: organizer.industry || '',
      position: organizer.position || '',
      organizerType: organizer.organizerType || '',
      isVerified: organizer.isVerified || false
    };
  };

  // Get contact information
  const getContactInfo = () => {
    const baseInfo = {
      email: profileData?.email || user?.email || ''
    };

    const roleData = profileData?.profileData || {};

    if (profileData?.role === 'student') {
      return {
        ...baseInfo,
        mobileNumber: roleData.mobileNumber || '',
        backupEmail: roleData.backupEmail || '',
        preferredNotifications: roleData.preferredNotifications || []
      };
    } else if (profileData?.role === 'organizer') {
      return {
        ...baseInfo,
        contactEmail: roleData.contactEmail || baseInfo.email,
        contactPhone: roleData.contactPhone || '',
        mobileNumber: roleData.mobileNumber || '',
        backupContact: roleData.backupContact || '',
        website: roleData.website || ''
      };
    }

    return baseInfo;
  };

  // Get all workshops (enrolled, completed, or hosted)
  const getWorkshops = () => {
    const roleData = profileData?.profileData || {};

    if (profileData?.role === 'student') {
      return {
        enrolled: roleData.enrolledWorkshops || [],
        completed: roleData.completedWorkshops || []
      };
    } else if (profileData?.role === 'organizer') {
      return {
        hosted: roleData.workshopsHosted || []
      };
    }

    return {};
  };

  // Get interests or preferences
  const getInterests = () => {
    const roleData = profileData?.profileData || {};

    if (profileData?.role === 'student') {
      return {
        interests: roleData.interests || [],
        competitionInterests: roleData.competitionInterests || [],
        preferredCompetitionTypes: roleData.preferredCompetitionTypes || [],
        hackathonTeamPreference: roleData.hackathonTeamPreference || '',
        experienceLevel: roleData.experienceLevel || ''
      };
    } else if (profileData?.role === 'organizer') {
      return {
        preferredEventTypes: roleData.preferredEventTypes || [],
        expectedParticipantsRange: roleData.expectedParticipantsRange || '',
        eventFormatPreference: roleData.eventFormatPreference || ''
      };
    }

    return {};
  };

  // Check if the profile belongs to the current logged in user
  const isOwnProfile = () => {
    return user && user._id === userId;
  };

  // Return consolidated data and helper functions
  return {
    // Status
    profileData,
    isLoading,
    error,
    isProfileComplete: profileData?.profileComplete || profileData?.isProfileComplete || false,
    isVerified: profileData?.isVerified || false,

    // Core data
    userId: profileData?._id || userId,
    firstName: profileData?.firstName || user?.FirstName || '',
    lastName: profileData?.lastName || user?.LastName || '',
    username: profileData?.username || user?.Username || '',
    fullName: profileData?.fullName ||
              (profileData?.firstName && profileData?.lastName ?
                `${profileData.firstName} ${profileData.lastName}` :
                user?.Username || "User"),

    email: profileData?.email || user?.email || '',
    bio: profileData?.bio || '',
    role: profileData?.role || user?.role || null,

    // Social networking
    followers: profileData?.followers || [],
    following: profileData?.following || [],
    coverImage: profileData?.coverImg || null,
    personalLink: profileData?.link || '',

    // Helper functions
    getProfileImage,
    getOccupation,
    getSocialLinks,
    getSkillsOrExpertise,
    getEducationDetails,
    getOrganizationDetails,
    getContactInfo,
    getWorkshops,
    getInterests,
    isOwnProfile,
    getInstitutionName,

    // Raw access to role-specific data
    roleSpecificData: profileData?.profileData || null,

    // Default image for direct use
    defaultProfilePicture
  };
}

export default useUserProfile;
