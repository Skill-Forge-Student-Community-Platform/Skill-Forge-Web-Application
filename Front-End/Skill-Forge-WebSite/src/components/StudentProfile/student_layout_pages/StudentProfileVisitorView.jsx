import React, { useState, useEffect } from 'react';
import Studentcover from '../Student _page_compontents/Studentcover';
import IntroSection from './IntroSection';
import ProjectsSection from './ProjectsSection';
import QualificationsSection from './QualificationsSection';
import UserFeed from './UserFeed';
import PortfolioPreview from './PortfolioPreview';
import { useAuthStore } from '../../../store/authStore';
import userAPI from '../../../services/userAPI';

const StudentProfileVisitorView = ({ userId, fullName, profileImage }) => {
  const { user } = useAuthStore();
  const [profileData, setProfileData] = useState({
    bio: "I am a software engineering student",
    school: "University of Technology",
    education: "Computer Science",
    location: "San Francisco, CA",
  });
  const [projects, setProjects] = useState([]);
  const [portfolioData, setPortfolioData] = useState(null);
  const [hasPortfolio, setHasPortfolio] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('not_connected');
  const [qualifications, setQualifications] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Fetch projects - In a real implementation, uncomment and use actual API
        // const projectsResponse = await userAPI.getUserProjects(userId);
        // setProjects(projectsResponse.data.projects || []);

        // Mock projects data
        setProjects([
          {
            id: '1',
            title: 'E-commerce Website',
            description: 'A fully functional online store built with React and Node.js',
            image: 'https://via.placeholder.com/600x400',
            link: 'https://example.com/project'
          }
        ]);

        // Check if user has portfolio - In a real implementation, uncomment and use actual API
        // try {
        //   const portfolioResponse = await userAPI.getUserPortfolio(userId);
        //   setPortfolioData(portfolioResponse.data);
        //   setHasPortfolio(!!portfolioResponse.data);
        // } catch (err) {
        //   // No portfolio or error fetching portfolio
        //   setHasPortfolio(false);
        //   setPortfolioData(null);
        // }

        // For demo, simulating no portfolio
        setHasPortfolio(false);
        setPortfolioData(null);

        // Fetch qualifications - In a real implementation, uncomment and use actual API
        // try {
        //   const qualificationsResponse = await userAPI.getUserQualifications(userId);
        //   setQualifications(qualificationsResponse.data.qualifications || []);
        // } catch (err) {
        //   console.error('Error fetching qualifications:', err);
        //   setQualifications([]);
        // }

        // Mock qualifications data
        setQualifications([
          {
            id: '1',
            title: 'Web Development Certificate',
            issuer: 'Udemy',
            date: 'June 2023',
            credential: 'https://example.com/credential'
          }
        ]);

      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    const checkConnectionStatus = async () => {
      if (!user || !user._id) return;

      try {
        // Check connection status between current user and profile user
        // In a real implementation, uncomment and use actual API
        // const response = await userAPI.checkConnectionStatus(user._id, userId);
        // setConnectionStatus(response.data.status || 'not_connected');

        // Mock status for demo
        setConnectionStatus('not_connected');
      } catch (error) {
        console.error('Error checking connection status:', error);
      }
    };

    fetchUserData();
    checkConnectionStatus();
  }, [userId, user]);

  const handleConnect = async () => {
    if (!user || !user._id) {
      // Handle not logged in state
      alert('Please log in to connect with other users');
      return;
    }

    try {
      // Send connection request - In a real implementation, uncomment and use actual API
      // const response = await userAPI.sendConnectionRequest(user._id, userId);
      setConnectionStatus('pending');
      alert('Connection request sent!');
    } catch (error) {
      console.error('Error sending connection request:', error);
      alert('Failed to send connection request');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Cover photo and profile basics */}
      <Studentcover
        userId={userId}
        isOwner={false}
        profileData={{
          name: fullName || 'Student',
          friendCount: 0, // Update with actual friend count
        }}
        connectionStatus={connectionStatus}
        onConnect={handleConnect}
      />

      {/* Main content grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left sidebar */}
        <div className="md:col-span-1">
          <IntroSection
            profileData={profileData}

            isEditable={false}
          />

          <QualificationsSection
            userId={userId}
            qualifications={qualifications}
            isEditable={false}
          />
        </div>

        {/* Main content area */}
        <div className="md:col-span-2">
          <PortfolioPreview
            userId={userId}
            hasPortfolio={hasPortfolio}
            portfolioData={portfolioData}
            isOwner={false}
          />

          <ProjectsSection
            userId={userId}
            projects={projects}
            isLoading={loading}
            isEditable={false}
          />

          <UserFeed
            userId={userId}
            isLimitedView={true}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentProfileVisitorView;
