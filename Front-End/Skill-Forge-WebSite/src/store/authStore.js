import { create } from "zustand";
import axios from "axios";

// Use the environment variable or fall back to localhost
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/auth";

console.log("API URL being used:", API_URL); // Debug logging

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,

	signup: async ( username, email, password) => {
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
