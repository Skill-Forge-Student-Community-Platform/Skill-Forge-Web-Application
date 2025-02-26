// AchievementCenter.jsx (Main file that assembles all components)
import React from "react";
import Sidebar from "./Sidebar";
import StatsOverview from "./StatsOverview";
import BadgeList from "./BadgeList";
import NextUnlock from "./NextUnlock";
import ProfileCard from "./ProfileCard";
import QuickStats from "./QuickStats";
import "./AchievementCenter.css"; 

const AchievementCenter = () => {
  return (
    <div className="achievement-center">
      <Sidebar />
      <div className="main-content">
        <StatsOverview />
        <BadgeList />
        <NextUnlock />
        <ProfileCard />
        <QuickStats />
      </div>
    </div>
  );
};

export default AchievementCenter;