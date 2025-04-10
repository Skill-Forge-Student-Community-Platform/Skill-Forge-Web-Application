import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileAvatar from '../../Home_page/Home_components/ProfileAvatar';

const RecommendedUsers = ({ userId }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch recommended users
    const fetchRecommendedUsers = async () => {
      try {
        setLoading(true);

        // In a real application, you'd make an API call here
        // For now, we'll use mock data with a small delay
        setTimeout(() => {
          const mockUsers = [
            {
              id: 'user-1',
              name: 'Alex Johnson',
              role: 'Student',
              avatar: null,
              skills: ['React', 'JavaScript', 'UI Design']
            },
            {
              id: 'user-2',
              name: 'Sarah Williams',
              role: 'Organizer',
              avatar: null,
              skills: ['Project Management', 'Leadership']
            },
            {
              id: 'user-3',
              name: 'Michael Chen',
              role: 'Student',
              avatar: null,
              skills: ['Python', 'Machine Learning', 'Data Science']
            }
          ];

          setUsers(mockUsers);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching recommended users:', error);
        setLoading(false);
      }
    };

    fetchRecommendedUsers();
  }, [userId]);

  const handleViewProfile = (userId) => {
    if (userId) {
      navigate(`/student/${userId}`);
    }
  };

  const handleConnect = (userId) => {
    console.log(`Connect with user ${userId}`);
    // Here you would make an API call to connect with the user
    alert(`Connection request sent to user ${userId}`);
  };

  if (loading) {
    return (
      <div className="student-section mb-6">
        <h2 className="student-section-title">People You May Know</h2>
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="student-section mb-6">
        <h2 className="student-section-title">People You May Know</h2>
        <div className="student-section-content text-center">
          <p className="text-gray-500">No recommendations available at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="student-section mb-6">
      <h2 className="student-section-title">People You May Know</h2>
      <div className="p-4">
        {users.map(user => (
          <div key={user.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md mb-2">
            <div className="flex items-center cursor-pointer" onClick={() => handleViewProfile(user.id)}>
              <ProfileAvatar
                userId={user.id}
                size="small"
                showLevel={false}
              />
              <div className="ml-3">
                <div className="font-medium text-sm text-gray-900">{user.name}</div>
                <div className="text-xs text-gray-500">{user.role}</div>
              </div>
            </div>
            <button
              className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
              onClick={() => handleConnect(user.id)}
            >
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedUsers;
