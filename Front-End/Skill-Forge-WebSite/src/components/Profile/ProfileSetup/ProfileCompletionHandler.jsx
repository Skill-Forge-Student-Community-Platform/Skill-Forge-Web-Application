import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

const ProfileCompletionHandler = ({ role, userId }) => {
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    setRedirecting(true);

    // Start countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);

          // Properly format the role for the URL (capitalize first letter)
          const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

          // Navigate to the proper role-specific home URL
          const targetUrl = `/${formattedRole}/${userId}/home`;
          console.log(`Navigation to role-specific home: ${targetUrl}`);

          // Use replace: true to prevent going back to the profile setup page
          navigate(targetUrl, { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, role, userId]);

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 z-50 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md text-center border-4 border-green-100">
        <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle size={50} className="text-green-500" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Profile Successfully Created!
        </h2>

        <p className="text-gray-600 mb-6">
          Your profile has been set up successfully and you're ready to explore Skill Forge.
        </p>

        <div className="mb-4 flex items-center justify-center space-x-2">
          <Loader size={16} className="animate-spin text-[#0a66c2]" />
          <p className="text-sm text-gray-500">
            Redirecting to dashboard in <span className="font-bold text-[#0a66c2]">{countdown}</span> seconds...
          </p>
        </div>

        <button
          onClick={() => {
            const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);
            navigate(`/${formattedRole}/${userId}/home`, { replace: true });
          }}
          className="w-full py-2 px-4 bg-[#0a66c2] hover:bg-[#084b8a] text-white rounded-lg transition-colors"
        >
          Go to Dashboard Now
        </button>
      </div>
    </div>
  );
};

export default ProfileCompletionHandler;
