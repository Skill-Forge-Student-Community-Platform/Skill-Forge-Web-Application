import React from 'react';
import { useParams } from 'react-router-dom';
import OrganizerCover from './shared/OrganizerCover';
import ProfileIntro from './Organizer/ProfileIntro';
import EventManagement from './Organizer/EventManagement';
import OrganizerPostActivity from './Organizer/OrganizerPostActivity';
import OrganizerStatistics from './Organizer/OrganizerStatistics';
import PastEventsSection from './Organizer/PastEventsSection';
import { useAuthStore } from '../../store/authStore';
import useUserProfile from '../../hooks/useUserProfile';
import './OrganizerProfilePage.css';

export default function OrganizerProfilePage() {
  const { userId: profileId } = useParams();
  const { user: authUser } = useAuthStore();

  // Determine if this is the current user's profile
  const isOwnProfile = authUser && (!profileId || profileId === authUser._id);
  const userId = isOwnProfile ? authUser?._id : profileId;

  // Use the custom hook to get profile data
  const {
    fullName,
    bio,
    roleSpecificData,
    isLoading,
    error,
    getProfileImage,
    getOrganizationDetails,
    coverImage,
    followers
  } = useUserProfile(userId);

  // Error and loading states
  if (isLoading) {
    return (
      <div className="organizer-loading-container">
        <div className="organizer-loading-spinner"></div>
        <p className="organizer-loading-text">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="organizer-error-container">
        <div className="organizer-error-icon">⚠️</div>
        <p className="organizer-error-message">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="organizer-retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  const orgDetails = getOrganizationDetails();

  return (
    <div className="organizer-profile-page">
      {/* Cover Section */}
      <section className="organizer-cover-section">
        <OrganizerCover
          userId={userId}
          isOwnProfile={isOwnProfile}
          fullName={fullName}
          coverImage={coverImage}
          profileImage={getProfileImage()}
          organizationDetails={orgDetails}
          followerCount={followers?.length || 0}
        />
      </section>

      <div className="organizer-profile-content">
        <div className="organizer-content-layout">
          {/* Left Sidebar - Profile Intro only */}
          <aside className="organizer-sidebar">
            <ProfileIntro
              userId={userId}
              isOwnProfile={isOwnProfile}
              bio={bio}
              roleData={roleSpecificData}
            />
          </aside>

          {/* Main Content Area */}
          <main className="organizer-main-content">
            {/* Statistics Section - Moved to top of main content */}
            <section className="organizer-section organizer-statistics-section">
              <h2 className="organizer-section-title">Event Statistics Dashboard</h2>
              <div className="organizer-section-content">
                <OrganizerStatistics userId={userId} />
              </div>
            </section>

            {/* Current Events Section */}
            <section className="organizer-section organizer-current-events">
              <h2 className="organizer-section-title">Current & Upcoming Events</h2>
              <div className="organizer-section-content">
                <EventManagement userId={userId} />
              </div>
            </section>

            {/* Past Events Section */}
            <section className="organizer-section organizer-past-events">
              <h2 className="organizer-section-title">Past Events</h2>
              <div className="organizer-section-content">
                <PastEventsSection userId={userId} />
              </div>
            </section>

            {/* Activity Feed Section */}
            <section className="organizer-section organizer-activity-feed">
              <h2 className="organizer-section-title">Recent Activity</h2>
              <div className="organizer-section-content">
                <OrganizerPostActivity
                  userId={userId}
                  isOwnProfile={isOwnProfile}
                  displayMode="horizontal-slider"
                />
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
