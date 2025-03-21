import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useAuthStore } from '../../../../store/authStore';

// Note: This component is now deprecated as the layout is managed by SettingsPage.jsx
// This is kept for backward compatibility with any existing imports

const SettingsLayout = ({ children, title }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { roleType, userId } = useParams();

  // Handle back navigation more intelligently
  const handleBackNavigation = () => {
    // Get the base URL without the settings part
    const correctRoleType = user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || roleType;
    const baseUrl = `/${correctRoleType}/${user?._id || userId}/home`;

    // Check if we can go back in history, otherwise go to home
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(baseUrl, { replace: true });
    }
  };

  return (
    <>
      {children}
    </>
  );
};

export default SettingsLayout;
