import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import Badge from "./Badge";
import BadgeList from "./BadgeList";
import ProfileCard from "./ProfileCard";
import QuickStats from "./QuickStats";
import StatsCard from "./StatsCard";
import "./AchievementCenter.css";

const AchievementCenter = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('badges');

  // Mock user data for demonstration
  const userProfile = {
    avatar: user?.profilePicture || "https://via.placeholder.com/100",
    name: user?.Username || "User Name",
    title: user?.role === "student" ? "Student" : "Organizer",
    isPro: true
  };

  // Mock achieved badges
  const achievedBadges = [
    {
      id: 1,
      icon: "🏆",
      title: "First Event",
      description: "Attended your first event",
      xp: "+50 XP",
      timeAgo: "2 weeks ago",
      color: "gold"
    },
    {
      id: 2,
      icon: "💬",
      title: "Social Butterfly",
      description: "Posted 10 comments",
      xp: "+100 XP",
      timeAgo: "1 week ago",
      color: "purple"
    },
    {
      id: 3,
      icon: "📊",
      title: "Top Contributor",
      description: "Reached the leaderboard",
      xp: "+150 XP",
      timeAgo: "3 days ago",
      color: "blue"
    }
  ];

  // Mock next badges to unlock
  const nextBadges = [
    {
      id: 4,
      icon: "🌟",
      title: "Event Master",
      description: "Attend 10 events",
      progress: 70,
      remaining: "3 more events needed",
      color: "gold"
    },
    {
      id: 5,
      icon: "📚",
      title: "Knowledge Seeker",
      description: "Complete 5 learning paths",
      progress: 40,
      remaining: "3 more to go",
      color: "green"
    }
  ];

  return (
    <div className="achievement-center">
      <div className="main-content">
        {/* Left column - Profile info - similar to Home.jsx */}
        <div className="side-content">
          <div className="profile-section">
            <ProfileCard user={userProfile} />
            <QuickStats userId={user?._id} />
          </div>
        </div>

        {/* Middle column - Main achievement content */}
        <div className="achievement-content">
          <div className="section-card main-section">
            <h2 className="section-title">
              <span className="section-icon">🏅</span>
              Your Achievements
            </h2>

            <div className="achievement-tabs">
              <button
                className={`tab ${activeTab === 'badges' ? 'active' : ''}`}
                onClick={() => setActiveTab('badges')}
              >
                Badges
              </button>
              <button
                className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
                onClick={() => setActiveTab('stats')}
              >
                Statistics
              </button>
            </div>

            {activeTab === 'badges' ? (
              <BadgeList
                achievedBadges={achievedBadges}
                nextBadges={nextBadges}
              />
            ) : (
              <StatsCard />
            )}
          </div>
        </div>

        {/* Right column - Additional info */}
        <div className="aside-content">
          <div className="section-card">
            <h3 className="aside-title">Achievement Tips</h3>
            <div className="tip-list">
              <div className="tip-item">
                <span className="tip-icon">💡</span>
                <p>Attend events regularly to earn participation badges</p>
              </div>
              <div className="tip-item">
                <span className="tip-icon">✍️</span>
                <p>Comment on posts to increase your engagement score</p>
              </div>
              <div className="tip-item">
                <span className="tip-icon">🔗</span>
                <p>Connect with other members to expand your network</p>
              </div>
            </div>
          </div>

          <div className="section-card upcoming-section">
            <h3 className="aside-title">Upcoming Badges</h3>

            <div className="upcoming-list">
              <div className="upcoming-badge">
                <div className="upcoming-icon">🌐</div>
                <div className="upcoming-details">
                  <h4>Network Navigator</h4>
                  <p>Connect with 20 members</p>
                </div>
              </div>
              <div className="upcoming-badge">
                <div className="upcoming-icon">📝</div>
                <div className="upcoming-details">
                  <h4>Content Creator</h4>
                  <p>Create 5 posts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementCenter;
