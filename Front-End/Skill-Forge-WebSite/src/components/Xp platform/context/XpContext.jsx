import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  userData,
  xpLevels,
  recentXPActivities,
  badges,
  leaderboardData,
  upcomingCompetitions,
  exclusiveBenefits
} from '../utils/mockData';

// Create the context with default values
const XpContext = createContext();

export const XpContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [levels, setLevels] = useState([]);

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Set all the data from mock data
        setUser(userData);
        setActivities(recentXPActivities);
        setUserBadges(badges);
        setLeaderboard(leaderboardData);
        setCompetitions(upcomingCompetitions);
        setBenefits(exclusiveBenefits);
        setLevels(xpLevels);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load XP system data. Please try again later.');
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate progress percentage for current level
  const calculateProgress = () => {
    if (!user) return 0;
    const { currentXP, nextLevelXP } = user;
    const currentLevelData = levels.find(level => level.level === user.level);
    const currentLevelXP = currentLevelData ? currentLevelData.xpRequired : 0;
    const xpForCurrentLevel = nextLevelXP - currentLevelXP;
    const xpProgress = currentXP - currentLevelXP;
    return Math.round((xpProgress / xpForCurrentLevel) * 100);
  };

  const contextValue = {
    isLoading,
    error,
    user,
    activities,
    badges: userBadges,
    leaderboard,
    competitions,
    benefits,
    levels,
    progressPercentage: calculateProgress(),
    // Add functions for updating data if needed in the future
  };

  return (
    <XpContext.Provider value={contextValue}>
      {children}
    </XpContext.Provider>
  );
};

export const useXpContext = () => {
  const context = useContext(XpContext);
  if (context === undefined) {
    throw new Error('useXpContext must be used within an XpContextProvider');
  }
  return context;
};
