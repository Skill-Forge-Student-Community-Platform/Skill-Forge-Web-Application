import React, { useState } from "react";
import ProfileBackground from "./ProfileBackground";
import IntroSection from "./IntroSection";
import ProjectsSection from "./ProjectsSection";
import QualificationsSection from "./QualificationsSection";
import PostSection from "./PostSection";
import ProfileCardSection from "./ProfileCardSection";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [showNotification, setShowNotification] = useState(false);

  return (
    <div className="profile-container">
      {/* ✅ Profile Background Section */}
      <ProfileBackground />

      {/* ✅ Success Notification */}
      {showNotification && <div className="notification">✅ Post successfully uploaded!</div>}

      {/* ✅ Profile Content Wrapper */}
      <div className="profile-content-wrapper">
        <div className="intro-container">
          <IntroSection />
        </div>
        <div className="profile-card-container">
          <ProfileCardSection />
        </div>
      </div>

      {/* ✅ Projects & Qualifications (Now aligned side by side) */}
      <div className="profile-projects-qualifications">
        <ProjectsSection />
        <QualificationsSection />
      </div>

      {/* ✅ Post Section */}
      <PostSection />
    </div>
  );
};

export default ProfilePage;
