import { create } from "zustand"; // Make sure you're importing from zustand, not "zustand/vanilla"
import axios from "axios";

// Use the environment variable or fall back to localhost
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/auth";

console.log("API URL being used:", API_URL); // Debug logging

axios.defaults.withCredentials = true;

// Helper function to set common headers
const getAuthHeaders = (contentType = 'application/json') => {
  return {
    'Content-Type': contentType,
  };
};

// Fix how we export the store
const useAuthStore = create((set, get) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,

	updateUserRole: async (role) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(
        `${API_URL}/update-role`,
        { role },
        { headers: getAuthHeaders() }
      );

			set({
				user: {
					...response.data.user
				},
				isLoading: false
			});
			return response.data;
		} catch (error) {
			const errorMessage =
				error.response?.data?.message ||
				"Unable to update user role. Please try again later.";
			set({ error: errorMessage, isLoading: false });
			throw new Error(errorMessage);
		}
	},

	updateProfile: async (profileData) => {
		set({ isLoading: true, error: null });
		try {
      // Determine content type
      const contentType = profileData instanceof FormData ? 'multipart/form-data' : 'application/json';

			const response = await axios.put(
        `${API_URL}/profile`,
        profileData,
        { headers: getAuthHeaders(contentType) }
      );

      // Make sure profile is marked as complete in user object
      const userData = response.data.user || { ...get().user };

      // Explicitly set profileComplete flag to true
      userData.profileComplete = true;
      console.log("Setting profileComplete flag to true after successful profile update");

      // Store updated user data
			set({
				user: userData,
				isLoading: false,
				message: "Profile updated successfully"
			});

			console.log("Updated user in auth store:", userData);
			return response.data;
		} catch (error) {
			console.error('Profile update error:', error);
			const errorMessage =
				error.response?.data?.message ||
				"Unable to update profile. Please try again.";
			set({ error: errorMessage, isLoading: false });
			throw new Error(errorMessage);
		}
	},

	// Get the current user's profile
	getProfile: async () => {
	  set({ isLoading: true, error: null });
	  try {
	    const response = await axios.get(
	      `${API_URL}/profile`,
	      { headers: getAuthHeaders() }
	    );

	    return response.data;
	  } catch (error) {
	    console.error('Get profile error:', error);
	    const errorMessage =
	      error.response?.data?.message ||
	      "Unable to fetch profile. Please try again.";
	    set({ error: errorMessage, isLoading: false });
	    throw new Error(errorMessage);
	  } finally {
	    set({ isLoading: false });
	  }
	},

	// Separate function for uploading just the profile picture
	uploadProfilePicture: async (file) => {
	  set({ isLoading: true, error: null });
	  try {
	    const formData = new FormData();
	    formData.append('profilePicture', file);

	    const response = await axios.post(
	      `${API_URL}/profile/upload-picture`,
	      formData,
	      { headers: getAuthHeaders('multipart/form-data') }
	    );

	    // Update the user object with the new profile picture
	    set(state => ({
	      user: state.user ? {
	        ...state.user,
	        profilePicture: response.data.profilePicture
	      } : null,
	      isLoading: false
	    }));

	    return response.data;
	  } catch (error) {
	    console.error('Profile picture upload error:', error);
	    const errorMessage =
	      error.response?.data?.message ||
	      "Unable to upload profile picture. Please try again.";
	    set({ error: errorMessage, isLoading: false });
	    throw new Error(errorMessage);
	  }
	},

	signup: async (username, email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/signup`,{
          Username: username,
          email,
          password
        });

			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
		} catch (error) {
			const errorMessage = error.response?.data?.message || "Error signing up. Please check your network connection.";
			set({ error: errorMessage, isLoading: false });
			throw error;
		}
	},
	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/login`, { email, password });
			set({
				isAuthenticated: true,
				user: response.data.user,
				error: null,
				isLoading: false,
			});
		} catch (error) {
			console.log('Login error details:', error);
			// Extract error message with better fallbacks
			const errorMessage =
				error.response?.data?.message ||
				(error.response?.status === 400 ? "Invalid login credentials" :
				"Login failed. Please check your network connection and try again.");

			set({ user: null, isLoading: false, error: errorMessage });
			throw error;
		}
	},

	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out. Please try again.", isLoading: false });
			throw error;
		}
	},
	verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/verify-email`, { code });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
			return response.data;
		} catch (error) {
			const errorMessage = error.response?.data?.message || "Error verifying email. Please check your network connection.";
			set({ error: errorMessage, isLoading: false });
			throw error;
		}
	},
	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/check-auth`);
			set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
		} catch (error) {
			set({ error: null, isCheckingAuth: false, isAuthenticated: false });
		}
	},
	forgotPassword: async (email) => {
		set({ isLoading: true, error: null, message: null });
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
			return response.data;
		} catch (error) {
			// Safely handle the error when server is unreachable
			const errorMessage =
				error.response?.data?.message ||
				"Unable to connect to the server. Please check your internet connection or try again later.";

			set({
				isLoading: false,
				error: errorMessage,
			});
			throw new Error(errorMessage);
		}
	},
	resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
			return response.data;
		} catch (error) {
			const errorMessage =
				error.response?.data?.message ||
				"Unable to reset password. Please check your connection or try again later.";

			set({
				isLoading: false,
				error: errorMessage,
			});
			throw new Error(errorMessage);
		}
	},
}));

export { useAuthStore };
// Alternatively, you can use: export default useAuthStore;
