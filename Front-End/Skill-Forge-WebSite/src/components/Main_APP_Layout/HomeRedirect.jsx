import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import LoadingSpinner from '../Registration/shared/LoadingSpinner';

const HomeRedirect = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      // Capitalize first letter of role for URL
      const roleForUrl = user.role.charAt(0).toUpperCase() + user.role.slice(1);

      // Redirect to the appropriate role-based URL with userId
      const targetUrl = `/${roleForUrl}/${user._id}/home`;
      console.log(`Redirecting to ${targetUrl}`);
      navigate(targetUrl, { replace: true });
    }
  }, [user, navigate]);

  // Show loading spinner while redirecting
  return <LoadingSpinner />;
};

export default HomeRedirect;
