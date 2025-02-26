import React, { useState, useEffect } from 'react'
import './SideBar.css'
import { Link } from 'react-router-dom'
import { MdBookmark } from 'react-icons/md'
import { FaUsers, FaTrophy, FaGraduationCap, FaUniversity } from 'react-icons/fa'
import { BsFillAwardFill } from 'react-icons/bs'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import Profile_pic from "../../Assets/test-profile-pic.jpg"

const SideBar = () => {
  const [activeLink, setActiveLink] = useState('');
  const [userProfile, setUserProfile] = useState({
    id: '1',
    fullName: 'Lakshan Fernando',
    university: 'NSBM Green University',
    degree: 'BSc (Hons) in Software Engineering',
    location: 'Colombo, Sri Lanka',
    profilePicture: Profile_pic,
    coverImage: null, // Set to null to test default background
    stats: {
      profileViews: 127,
      postImpressions: 845
    }
  });

  // Simulating API call - replace with actual API call later
  useEffect(() => {
    // Fetch user profile data
    // const fetchUserProfile = async () => {
    //   const response = await fetch('/api/user/profile');
    //   const data = await response.json();
    //   setUserProfile(data);
    // };
    // fetchUserProfile();
  }, []);

  const recentAchievements = [
    { id: 1, name: "Problem Solver", icon: "🏅", date: "2024-01-15" },
    { id: 2, name: "Quick Learner", icon: "🎖️", date: "2024-01-10" },
    { id: 3, name: "Team Player", icon: "🏆", date: "2024-01-05" },
  ];

  return (
    <div className='SideBar'>
      <Link to="/profile" className="profile-card">
        <div className={`profile-background ${!userProfile.coverImage ? 'no-cover' : ''}`}>
          {userProfile.coverImage && <img src={userProfile.coverImage} alt="" className="cover-image" />}
        </div>
        <div className="profile-info">
          <img src={userProfile.profilePicture} alt="Profile" className="profile-avatar" />
          <h3>{userProfile.fullName}</h3>
          <div className="user-details">
            <p className="detail-item">
              <FaUniversity />
              <span>{userProfile.university}</span>
            </p>
            <p className="detail-item">
              <FaGraduationCap />
              <span>{userProfile.degree}</span>
            </p>
            <p className="detail-item">
              <HiOutlineLocationMarker />
              <span>{userProfile.location}</span>
            </p>
          </div>
        </div>
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-label">Profile views</span>
            <span className="stat-value">{userProfile.stats.profileViews}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Post impressions</span>
            <span className="stat-value">{userProfile.stats.postImpressions}</span>
          </div>
        </div>
      </Link>

      <div className="navigation-links">
        <Link to="/friends" className={`side-link ${activeLink === '/friends' ? 'active' : ''}`}
              onClick={() => setActiveLink('/friends')}>
          <FaUsers /> <span>My Network</span>
        </Link>
        <Link to="/saved" className={`side-link ${activeLink === '/saved' ? 'active' : ''}`}
              onClick={() => setActiveLink('/saved')}>
          <MdBookmark /> <span>Saved Items</span>
        </Link>
        <Link to="/leaderboard" className={`side-link ${activeLink === '/leaderboard' ? 'active' : ''}`}
              onClick={() => setActiveLink('/leaderboard')}>
          <FaTrophy /> <span>Leaderboard</span>
        </Link>
      </div>

      <div className="recent-achievements">
        <h4><BsFillAwardFill /> Recent Achievements</h4>
        <div className="achievement-items">
          {recentAchievements.map(achievement => (
            <div key={achievement.id} className="achievement-item">
              <span className="achievement-icon">{achievement.icon}</span>
              <div className="achievement-details">
                <span className="achievement-name">{achievement.name}</span>
                <span className="achievement-date">{achievement.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SideBar
