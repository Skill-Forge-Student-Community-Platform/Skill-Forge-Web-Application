import { create } from "zustand"; // Make sure you're importing from zustand, not "zustand/vanilla"
import axios from "axios";
import { toast } from 'react-hot-toast';
// Import the image cache utility
import imageCache from '../utils/imageCache';
// Add this import
import sessionProfileCache from '../utils/sessionProfileCache';
import { io } from 'socket.io-client';

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
	onlineUsers:[],
    socket:null,

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

      console.log(`Sending profile update request to ${API_URL}/profile`);
      console.log(`Content type: ${contentType}`);

      // If it's form data with a file, show a progress message
      if (profileData instanceof FormData && profileData.has('profilePicture')) {
        toast.loading('Uploading profile picture...', { id: 'profile-upload' });

        // Log form data contents for debugging
        console.log('Form data contains:',
          Array.from(profileData.keys()).map(key => {
            if (key === 'profileData') {
              return `profileData: [JSON string]`;
            } else if (key === 'profilePicture') {
              const file = profileData.get('profilePicture');
              return `profilePicture: ${file.name} (${file.type})`;
            }
            return key;
          })
        );
      }

			const response = await axios.put(
        `${API_URL}/profile`,
        profileData,
        { headers: getAuthHeaders(contentType) }
      );

      // Clear any loading toasts
      toast.dismiss('profile-upload');

      // Make sure profile is marked as complete in user object
      const userData = response.data.user || { ...get().user };

      // Clear the image cache for the current user to ensure fresh data
      if (userData._id) {
        imageCache.clearCache(userData._id);
        // Also clear session cache for profile data
        sessionProfileCache.clearProfileData(userData._id);
      }

      // Explicitly set profileComplete flag to true
      userData.profileComplete = true;
      console.log("Profile update successful, user data:", userData);

      // Store updated user data
			set({
				user: userData,
				isLoading: false,
				message: "Profile updated successfully"
			});

			return response.data;
		} catch (error) {
			console.error('Profile update error:', error);

			// Clear any loading toasts
			toast.dismiss('profile-upload');

			let errorMessage = "Unable to update profile. Please try again.";

			if (error.response) {
			  console.log('Error response:', error.response.data);
			  errorMessage = error.response.data?.message || errorMessage;

			  if (error.response.status === 404) {
			    errorMessage = "Profile not found. Please try refreshing the page.";
			  }
			}

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

	    // Clear the image cache for the current user
	    const currentUser = get().user;
	    if (currentUser?._id) {
	      imageCache.clearCache(currentUser._id);
	      // Also clear session cache for profile data
	      sessionProfileCache.clearProfileData(currentUser._id);
	    }

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

	connectSocket:()=>{
		const { authUser } = get();
		if (!authUser || get().socket?.connected) return;
  
		// passing the user id from backend 
		const socket = io(API_URL, {
		  query:{
			userId:authUser._id,
		  },
		});
		socket.connect()
  
		set({socket:socket});
  
		// Listen for online user updates
		socket.on("getOnlineUsers", (userIds)=>{
		  set({onlineUsers:userIds})
		})
  
	},
  
	disconnectSocket:()=>{
		if(get().socket?.connected) get().socket.disconnect();
	},
}));

export { useAuthStore };
