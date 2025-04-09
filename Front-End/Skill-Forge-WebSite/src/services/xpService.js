import axios from 'axios';
import { API_URL } from '../config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    Authorization: `Bearer ${token}`
  };
};

// Get user XP data
export const getUserXpData = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/xp-platform/users/${userId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user XP data:', error);
    throw error;
  }
};

// Get user badges
export const getUserBadges = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/xp-platform/badges/user/${userId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user badges:', error);
    throw error;
  }
};

// Get leaderboard
export const getLeaderboard = async (type = 'global', page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/xp-platform/users/leaderboard`, {
      headers: getAuthHeaders(),
      params: { type, page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};

// Get user XP history
export const getXpHistory = async (userId, page = 1, limit = 20) => {
  try {
    const response = await axios.get(`${API_URL}/xp-platform/xp/history/${userId}`, {
      headers: getAuthHeaders(),
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching XP history:', error);
    throw error;
  }
};

// Get available competitions
export const getCompetitions = async (status, difficulty, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/xp-platform/competitions`, {
      headers: getAuthHeaders(),
      params: { status, difficulty, page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching competitions:', error);
    throw error;
  }
};

// Join a competition
export const joinCompetition = async (competitionId) => {
  try {
    const response = await axios.post(
      `${API_URL}/xp-platform/competitions/${competitionId}/join`,
      {},
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error joining competition:', error);
    throw error;
  }
};

// Check for unlockable badges
export const checkBadgeRequirements = async (userId) => {
  try {
    const response = await axios.get(
      `${API_URL}/xp-platform/badges/check-requirements/${userId}`,
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error checking badge requirements:', error);
    throw error;
  }
};
