import { useState, useEffect } from 'react';
import roleServices from '../services/roleServices';
import { useAuthStore } from '../store/authStore';

/**
 * Custom hook for fetching role-specific dashboard data
 *
 * @param {string} userId - The user ID
 * @returns {Object} - Dashboard data, loading state, and error
 */
const useRoleDashboard = (userId) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || !user.role || !userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch data based on role
        const data = await roleServices.fetchDashboardData(user.role, userId);
        console.log(`Dashboard data fetched for ${user.role}:`, data);

        setDashboardData(data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, userId]);

  // Refetch function to manually trigger data refresh
  const refetch = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await roleServices.fetchDashboardData(user.role, userId);
      setDashboardData(data);
    } catch (err) {
      setError(err.message || 'Failed to reload dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  return { dashboardData, isLoading, error, refetch };
};

export default useRoleDashboard;
