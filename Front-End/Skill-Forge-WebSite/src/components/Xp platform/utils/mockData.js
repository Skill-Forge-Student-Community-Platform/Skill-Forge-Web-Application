// Mock user data
export const userData = {
  id: 'user123',
  name: 'Dulitha Kariyapperuma',
  username: 'mrdc',
  avatar: 'https://i.pravatar.cc/150?img=12',
  level: 4,
  rank: 'Pro Competitor',
  currentXP: 1250,
  nextLevelXP: 2000,
  totalXP: 5250,
  leaderboardRank: 7,
  joinDate: '2023-09-15',
};

// XP level thresholds
export const xpLevels = [
  { level: 1, xpRequired: 0, rank: 'Novice' },
  { level: 2, xpRequired: 500, rank: 'Beginner' },
  { level: 3, xpRequired: 1000, rank: 'Intermediate' },
  { level: 4, xpRequired: 2000, rank: 'Pro Competitor' },
  { level: 5, xpRequired: 3500, rank: 'Expert' },
  { level: 6, xpRequired: 5500, rank: 'Master' },
  { level: 7, xpRequired: 8000, rank: 'Grandmaster' },
  { level: 8, xpRequired: 12000, rank: 'Legend' },
  { level: 9, xpRequired: 18000, rank: 'Champion' },
  { level: 10, xpRequired: 25000, rank: 'Ultimate Champion' },
];

// Recent XP activities
export const recentXPActivities = [
  { id: 1, activity: 'Completed Challenge: Code Optimization', xp: 150, date: '2023-11-10T14:30:00Z' },
  { id: 2, activity: 'Participated in Hackathon', xp: 300, date: '2023-11-05T09:15:00Z' },
  { id: 3, activity: 'Submitted Article: "Advanced React Patterns"', xp: 200, date: '2023-10-28T16:45:00Z' },
  { id: 4, activity: 'Mentored Junior Developer', xp: 100, date: '2023-10-20T11:00:00Z' },
  { id: 5, activity: 'Completed Daily Coding Challenge', xp: 50, date: '2023-10-15T08:30:00Z' },
];

// Badges data
export const badges = [
  // Earned badges
  {
    id: 'b1',
    name: 'First Steps',
    description: 'Completed your first challenge',
    category: 'Participation',
    icon: '🥉',
    unlocked: true,
    dateEarned: '2023-09-20T10:15:00Z',
  },
  {
    id: 'b2',
    name: 'Team Player',
    description: 'Participated in a team challenge',
    category: 'Participation',
    icon: '👥',
    unlocked: true,
    dateEarned: '2023-09-28T14:30:00Z',
  },
  {
    id: 'b3',
    name: 'Problem Solver',
    description: 'Solved 10 coding challenges',
    category: 'Skill-Based',
    icon: '🧩',
    unlocked: true,
    dateEarned: '2023-10-05T09:45:00Z',
  },
  {
    id: 'b4',
    name: 'Knowledge Sharer',
    description: 'Published your first article',
    category: 'Special',
    icon: '📝',
    unlocked: true,
    dateEarned: '2023-10-15T16:20:00Z',
  },

  // Locked badges
  {
    id: 'b5',
    name: 'Hackathon Hero',
    description: 'Win a hackathon competition',
    category: 'Achievement',
    icon: '🏆',
    unlocked: false,
    unlockRequirement: 'Win 1st place in any hackathon',
  },
  {
    id: 'b6',
    name: 'Mentor Master',
    description: 'Mentor 5 junior developers',
    category: 'Community',
    icon: '👨‍🏫',
    unlocked: false,
    unlockRequirement: 'Mentor 5 different junior developers',
  },
  {
    id: 'b7',
    name: 'Code Streak',
    description: 'Complete challenges for 7 consecutive days',
    category: 'Consistency',
    icon: '🔥',
    unlocked: false,
    unlockRequirement: 'Complete at least one challenge daily for 7 days',
  },
  {
    id: 'b8',
    name: 'Full Stack Wizard',
    description: 'Complete challenges in both frontend and backend',
    category: 'Skill-Based',
    icon: '🧙‍♂',
    unlocked: false,
    unlockRequirement: 'Complete 5 frontend and 5 backend challenges',
  },
];

// Leaderboard data
export const leaderboardData = [
  { id: 'user1', name: 'Emma Wilson', username: 'emmaw', avatar: 'https://i.pravatar.cc/150?img=5', level: 8, totalXP: 15250, rank: 1 },
  { id: 'user2', name: 'James Smith', username: 'jsmith', avatar: 'https://i.pravatar.cc/150?img=3', level: 7, totalXP: 10800, rank: 2 },
  { id: 'user3', name: 'Sophia Chen', username: 'sophiac', avatar: 'https://i.pravatar.cc/150?img=8', level: 6, totalXP: 8500, rank: 3 },
  { id: 'user4', name: 'Michael Brown', username: 'mbrown', avatar: 'https://i.pravatar.cc/150?img=11', level: 6, totalXP: 7900, rank: 4 },
  { id: 'user5', name: 'Olivia Davis', username: 'odavis', avatar: 'https://i.pravatar.cc/150?img=9', level: 5, totalXP: 6800, rank: 5 },
  { id: 'user6', name: 'William Johnson', username: 'wjohnson', avatar: 'https://i.pravatar.cc/150?img=4', level: 5, totalXP: 6200, rank: 6 },
  { id: 'user123', name: 'Alex Johnson', username: 'alexj', avatar: 'https://i.pravatar.cc/150?img=12', level: 4, totalXP: 5250, rank: 7 },
  { id: 'user7', name: 'Ava Martinez', username: 'amartinez', avatar: 'https://i.pravatar.cc/150?img=1', level: 4, totalXP: 4800, rank: 8 },
  { id: 'user8', name: 'Noah Taylor', username: 'ntaylor', avatar: 'https://i.pravatar.cc/150?img=7', level: 3, totalXP: 3500, rank: 9 },
  { id: 'user9', name: 'Isabella Thomas', username: 'ithomas', avatar: 'https://i.pravatar.cc/150?img=2', level: 3, totalXP: 3200, rank: 10 },
];

// Upcoming competitions
export const upcomingCompetitions = [
  {
    id: 'comp1',
    title: 'Web Performance Hackathon',
    description: 'Build the fastest loading web application',
    xpReward: 500,
    startDate: '2023-12-15T09:00:00Z',
    endDate: '2023-12-17T18:00:00Z',
    difficulty: 'Intermediate',
  },
  {
    id: 'comp2',
    title: 'AI Integration Challenge',
    description: 'Integrate AI capabilities into an existing application',
    xpReward: 750,
    startDate: '2023-12-20T10:00:00Z',
    endDate: '2023-12-22T17:00:00Z',
    difficulty: 'Advanced',
  },
  {
    id: 'comp3',
    title: 'Mobile App Design Sprint',
    description: 'Design a mobile app UI/UX in 48 hours',
    xpReward: 400,
    startDate: '2024-01-05T08:00:00Z',
    endDate: '2024-01-07T08:00:00Z',
    difficulty: 'Beginner',
  },
];

// Exclusive benefits by level
export const exclusiveBenefits = [
  { level: 3, benefit: 'Access to exclusive Discord channels' },
  { level: 4, benefit: 'Priority registration for popular events' },
  { level: 5, benefit: 'Free monthly 1-on-1 mentoring session' },
  { level: 6, benefit: 'Featured profile on the community homepage' },
  { level: 7, benefit: 'Invitation to exclusive networking events' },
  { level: 8, benefit: 'Opportunity to host workshops' },
  { level: 9, benefit: 'Early access to beta features' },
  { level: 10, benefit: 'Lifetime premium membership' },
];
