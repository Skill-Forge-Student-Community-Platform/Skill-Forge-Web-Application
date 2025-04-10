import React, { useState, useEffect } from 'react';
import Studentcover from '../Student _page_compontents/Studentcover';
import IntroSection from './IntroSection';
import ProjectsSection from './ProjectsSection';
import QualificationsSection from './QualificationsSection';
import UserFeed from './UserFeed';
import PortfolioPreview from './PortfolioPreview';
import userAPI from '../../../services/userAPI';

const StudentProfileOwnerView = ({ userId, profileData }) => {
  const [portfolio, setPortfolio] = useState(null);
  const [hasPortfolio, setHasPortfolio] = useState(false);

  useEffect(() => {
    const checkPortfolio = async () => {
      try {
        // In a real implementation, replace with actual API call
        // const response = await userAPI.getUserPortfolio(userId);
        // setPortfolio(response.data);
        // setHasPortfolio(!!response.data);

        // For demo purposes, simulating no portfolio
        setHasPortfolio(false);
        setPortfolio(null);
      } catch (error) {
        console.error('Error checking portfolio:', error);
        setHasPortfolio(false);
      }
    };

    checkPortfolio();
  }, [userId]);

  const handleSaveIntro = (newDetails) => {
    // In a real implementation, save to the server
    console.log('Saving intro details:', newDetails);
  };

  // This would be passed to child components to handle profile updates
  const handleProfileUpdate = async (section, data) => {
    try {
      // In a real implementation, connect to API
      // await userAPI.updateProfileSection(userId, section, data);
      console.log(`Updated ${section}:`, data);
    } catch (error) {
      console.error(`Error updating ${section}:`, error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Cover photo and profile basics */}
      <Studentcover
        userId={userId}
        isOwner={true}
        profileData={{
          name: profileData?.fullName || 'Student',
          friendCount: 0, // Update with actual friend count
        }}
      />

      {/* Main content grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left sidebar */}
        <div className="md:col-span-1">
          <IntroSection
            profileData={profileData}
            isEditable={true}
            onSave={handleSaveIntro}
          />

          <QualificationsSection
            userId={userId}
            qualifications={profileData?.qualifications || []}
            isEditable={true}
          />
        </div>

        {/* Main content area */}
        <div className="md:col-span-2">
          <PortfolioPreview
            userId={userId}
            hasPortfolio={hasPortfolio}
            portfolioData={portfolio}
            isOwner={true}
          />

          <ProjectsSection
            userId={userId}
            projects={profileData?.projects || []}
            isEditable={true}
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

export default StudentProfileOwnerView;
