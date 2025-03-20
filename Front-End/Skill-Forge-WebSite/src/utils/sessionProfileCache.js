/**
 * Session storage cache for profile-related data
 * Maintains data across page refreshes but not across browser sessions
 */
const sessionProfileCache = {
  /**
   * Store profile data in session storage with flattened fields for faster access
   * @param {string} userId - User ID
   * @param {Object} data - Profile data to store
   */
  storeProfileData(userId, data) {
    if (!userId || !data) return;

    try {
      // Create a modified version of data with common fields flattened
      const flattenedData = { ...data };

      // Store critical display fields at top level for fastest access
      // This ensures text data is immediately accessible without parsing nested structures
      if (data.profileData) {
        // Extract common fields
        const profileData = data.profileData;

        if (data.role === 'student') {
          // Student-specific critical fields
          flattenedData.fieldOfStudy = profileData.fieldOfStudy || '';
          flattenedData.school = profileData.school || '';
          flattenedData.yearOfStudy = profileData.yearOfStudy || '';

          // Pre-compute the occupation string to avoid computation on render
          flattenedData.occupation = `${profileData.fieldOfStudy || ''} ${profileData.fieldOfStudy ? 'Student' : 'Student'}`;
          flattenedData.institution = profileData.school || '';
        } else if (data.role === 'organizer') {
          // Organizer-specific critical fields
          flattenedData.organizationName = profileData.organizationName || '';
          flattenedData.position = profileData.position || '';
          flattenedData.organizerType = profileData.organizerType || '';

          // Pre-compute display strings
          flattenedData.occupation = profileData.position || profileData.organizerType || 'Organizer';
          flattenedData.institution = profileData.organizationName || '';
        }
      }

      // Also flatten name fields for immediate access
      if (!flattenedData.fullName && (data.firstName || data.lastName)) {
        flattenedData.fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
      }

      const key = `profile_data_${userId}`;
      const serialized = JSON.stringify({
        data: flattenedData,
        timestamp: Date.now(),
      });

      sessionStorage.setItem(key, serialized);

      // Also store critical fields in a separate, smaller cache for even faster access
      this.storeTextFields(userId, {
        fullName: flattenedData.fullName,
        occupation: flattenedData.occupation,
        institution: flattenedData.institution,
        role: data.role
      });
    } catch (error) {
      console.error('Error storing profile data in session storage:', error);
    }
  },

  /**
   * Store just critical text fields for fastest possible access
   * @param {string} userId - User ID
   * @param {Object} fields - Critical display fields
   */
  storeTextFields(userId, fields) {
    if (!userId || !fields) return;

    try {
      const key = `profile_text_${userId}`;
      sessionStorage.setItem(key, JSON.stringify({
        fields,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error storing text fields in session storage:', error);
    }
  },

  /**
   * Get just the critical text fields for immediate display
   * @param {string} userId - User ID
   * @returns {Object|null} Critical text fields if available
   */
  getTextFields(userId) {
    if (!userId) return null;

    try {
      const key = `profile_text_${userId}`;
      const data = sessionStorage.getItem(key);

      if (!data) return null;

      const { fields, timestamp } = JSON.parse(data);
      const now = Date.now();

      // Even longer expiration for text fields (24 hours)
      if (now - timestamp > 24 * 60 * 60 * 1000) {
        sessionStorage.removeItem(key);
        return null;
      }

      return fields;
    } catch (error) {
      console.error('Error getting text fields from session storage:', error);
      return null;
    }
  },

  /**
   * Get profile data from session storage
   * @param {string} userId - User ID

   * @returns {Object|null} Profile data if available and not expired
   */
  getProfileData(userId) {
    if (!userId) return null;

    try {
      const key = `profile_data_${userId}`;
      const serialized = sessionStorage.getItem(key);

      if (!serialized) return null;

      const { data, timestamp } = JSON.parse(serialized);
      const now = Date.now();

      // Data expires after 15 minutes
      if (now - timestamp > 15 * 60 * 1000) {
        sessionStorage.removeItem(key);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error retrieving profile data from session storage:', error);
      return null;
    }
  },

  /**
   * Clear profile data for a specific user
   * @param {string} userId - User ID
   */
  clearProfileData(userId) {
    if (!userId) return;

    try {
      const key = `profile_data_${userId}`;
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Error clearing profile data from session storage:', error);
    }
  },

  /**
   * Clear all profile data from session storage
   */
  clearAllProfileData() {
    try {
      const keys = [];

      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key.startsWith('profile_data_')) {
          keys.push(key);
        }
      }

      keys.forEach(key => {
        sessionStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing all profile data from session storage:', error);
    }
  }
};

export default sessionProfileCache;
