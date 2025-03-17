import { useState, useEffect, useCallback } from 'react';
import roleServices from '../services/roleServices';
import { useAuthStore } from '../store/authStore';
// Import a local fallback image
import defaultProfilePicture from '../Assets/test-profile-pic.jpg';
// Import the imageCache utility
import imageCache from '../utils/imageCache';
// Add this to your userUserProfile hook
import sessionProfileCache from '../utils/sessionProfileCache';

// Ensure a clean default export with no named export
function useUserProfile(userId) {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(!!userId); // Only set loading true if we have a userId
  const [error, setError] = useState(null);
  const { user } = useAuthStore();
  const [textDataReady, setTextDataReady] = useState(false);

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

  useEffect(() => {
    // Skip fetching if no userId is provided
    if (!userId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    let abortController = new AbortController();

    // First check for text fields which are ultra-fast
    const textFields = sessionProfileCache.getTextFields(userId);
    if (textFields && isMounted) {
      // Create a minimal profile data object with just text fields
      const minimalData = {
        fullName: textFields.fullName,
        role: textFields.role,
        // Add the pre-computed fields
        occupation: textFields.occupation,
        institution: textFields.institution,

        // Flag that this is minimal data
        _isMinimalData: true
      };

      setProfileData(minimalData);
      setTextDataReady(true);
      // Don't set isLoading to false yet, as we still need to load the full data
    }

    // Then, try to get full cached data
    const sessionData = sessionProfileCache.getProfileData(userId);
    if (sessionData && isMounted) {
      // Apply cached data - this might replace the minimal data with more complete data
      setProfileData(sessionData);
      setTextDataReady(true);
      setIsLoading(false); // Now we can set loading to false
    }

    // Then, fetch fresh data in the background
    const fetchProfileData = async () => {
      if (!userId) return;

      try {
        // Only set loading if we don't have cached data
        if (!sessionData && isMounted) {
          setIsLoading(true);
        }

        // Try to get the image from cache
        const cachedImageUrl = imageCache.getCachedImage(userId);
        if (cachedImageUrl && isMounted) {
          // Update profile image immediately if we have it cached
          setProfileData(prev => prev ? {...prev, profilePicture: cachedImageUrl} : { profilePicture: cachedImageUrl });
        }

        // Get fresh data from backend
        const data = await getUserData(userId);

        if (isMounted) {
          // Update with fresh data
          setProfileData(data);

          // Update session cache
          sessionProfileCache.storeProfileData(userId, data);

          // Update image cache
          if (data?.profilePicture) {
            imageCache._saveToIndexedDB(
              `profile_${userId}`,
              data.profilePicture,
              Date.now() + (30 * 60 * 1000)
            );
          }
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);

        // Only set error if we don't already have cached data
        if (isMounted && !sessionData) {
          setError(typeof err === 'string' ? err : err.message || "Failed to load profile data");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Execute the fetch operation as a background update
    fetchProfileData();

    // Clean up function to prevent state updates after unmount
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [userId, user]);

  // Helper function to get profile image with better fallbacks and caching
  const getProfileImage = useCallback(() => {
    // First check if we have profile picture from merged profile data
    if (profileData?.profilePicture) {
      return profileData.profilePicture;
    }

    // Check cache synchronously for immediate response
    const cachedImage = imageCache.getCachedImage(userId);
    if (cachedImage) {
      return cachedImage;
    }

    // Then check current user object from auth store
    if (user?.profilePicture) {
      return user.profilePicture;
    }

    // Finally, use local fallback image
    return defaultProfilePicture;
  }, [profileData, userId, user]);

  // Optimize getOccupation and getInstitutionName to work faster with cached data
  const getOccupation = useCallback(() => {
    if (!profileData) return "";

    // If we have a pre-computed occupation, use it
    if (profileData.occupation) {
      return profileData.occupation;
    }

    // If we don't have profile-specific data, we need to handle that case
    if (!profileData.profileData) {
      // Check role directly from profileData
      if (profileData.role === 'student') {
        return profileData.fieldOfStudy ? `${profileData.fieldOfStudy} Student` : "Student";
      } else if (profileData.role === 'organizer') {
        return profileData.position || profileData.organizerType || "Organizer";
      }
      return "";
    }

    // Otherwise, use the profile-specific data as before
    const roleData = profileData.profileData;

    if (profileData.role === 'student') {
      return `${roleData.fieldOfStudy || ''} ${roleData.fieldOfStudy ? 'Student' : 'Student'}`;
    } else if (profileData.role === 'organizer') {
      return roleData.position || roleData.organizerType || "Organizer";
    }

    return "";
  }, [profileData]);

  // Optimize getInstitutionName to work with both flattened and nested data structures
  const getInstitutionName = useCallback(() => {
    if (!profileData) return "";

    // If we have a pre-computed institution, use it
    if (profileData.institution) {
      return profileData.institution;
    }

    // First check if it's flattened in the session storage data
    if (profileData.school) {
      return profileData.school;
    } else if (profileData.organizationName) {
      return profileData.organizationName;
    }

    // Fall back to nested data
    const roleData = profileData.profileData || {};

    if (profileData.role === 'student') {
      return roleData.school || '';
    } else if (profileData.role === 'organizer') {
      return roleData.organizationName || '';
    }

    return '';
  }, [profileData]);

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
    defaultProfilePicture,

    // Expose the ability to force refresh the image
    refreshProfileImage: () => imageCache.getImage(userId, true),

    // Add this new flag
    textDataReady
  };
}

export default useUserProfile;
