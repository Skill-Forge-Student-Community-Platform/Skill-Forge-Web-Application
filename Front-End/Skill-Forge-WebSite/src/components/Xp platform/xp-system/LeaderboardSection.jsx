import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  useTheme,
  Button,
  Tabs,
  Tab
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Whatshot as HotIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { leaderboardData, userData } from '../utils/mockData';

const LeaderboardSection = () => {
  const theme = useTheme();
  const [leaderboardType, setLeaderboardType] = useState('global');

  // Get top 10 users
  const topUsers = leaderboardData.slice(0, 10);

  // Highlight current user's row
  const isCurrentUser = (userId) => userId === userData.id;

  // Get medal color based on rank
  const getMedalColor = (rank) => {
    switch(rank) {
      case 1: return theme.palette.mode === 'dark' ? '#FFD700' : '#FFD700'; // Gold
      case 2: return theme.palette.mode === 'dark' ? '#C0C0C0' : '#C0C0C0'; // Silver
      case 3: return theme.palette.mode === 'dark' ? '#CD7F32' : '#CD7F32'; // Bronze
      default: return theme.palette.mode === 'dark' ? '#757575' : '#9e9e9e'; // Gray
    }
  };

  // Get medal icon based on rank
  const getMedalIcon = (rank) => {
    switch(rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return rank;
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        mb: 4,
        background: theme.palette.background.paper
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
        Leaderboard
      </Typography>

      {/* Leaderboard Type Tabs */}
      <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={leaderboardType}
          onChange={(e, newValue) => setLeaderboardType(newValue)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab
            icon={<TrophyIcon />}
            label="Global"
            value="global"
            iconPosition="start"
          />
          <Tab
            icon={<HotIcon />}
            label="Monthly"
            value="monthly"
            iconPosition="start"
          />
          <Tab
            icon={<GroupIcon />}
            label="Friends"
            value="friends"
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Leaderboard Table */}
      <TableContainer
        component={Box}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 4px 20px rgba(0,0,0,0.4)'
            : '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
              <TableCell width="10%" align="center">Rank</TableCell>
              <TableCell width="50%">User</TableCell>
              <TableCell width="20%" align="center">Level</TableCell>
              <TableCell width="20%" align="center">XP</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topUsers.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  backgroundColor: isCurrentUser(user.id)
                    ? (theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.15)' : 'rgba(33, 150, 243, 0.05)')
                    : 'transparent'
                }}
                component={TableRow}
                sx={{
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(0,0,0,0.02)'
                  }
                }}
              >
                <TableCell align="center">
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: user.rank <= 3 ? '1.5rem' : '1rem',
                      color: getMedalColor(user.rank),
                      fontWeight: 'bold'
                    }}
                  >
                    {getMedalIcon(user.rank)}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src={user.avatar}
                      alt={user.name}
                      sx={{
                        width: 40,
                        height: 40,
                        mr: 2,
                        border: user.rank <= 3 ? `2px solid ${getMedalColor(user.rank)}` : 'none'
                      }}
                    />
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {user.name}
                        {isCurrentUser(user.id) && (
                          <Chip
                            label="You"
                            size="small"
                            color="primary"
                            sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                          />
                        )}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        @{user.username}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={`Level ${user.level}`}
                    size="small"
                    color={user.rank <= 3 ? "primary" : "default"}
                    sx={{
                      fontWeight: 'bold',
                      bgcolor: user.rank <= 3 ? getMedalColor(user.rank) : undefined,
                      color: user.rank <= 3 ? '#000' : undefined
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{
                      color: user.rank <= 3
                        ? getMedalColor(user.rank)
                        : theme.palette.text.primary
                    }}
                  >
                    {user.totalXP.toLocaleString()} XP
                  </Typography>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Full Leaderboard Button */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="outlined"
          color="primary"
          sx={{ borderRadius: 8, px: 4 }}
        >
          View Full Leaderboard
        </Button>
      </Box>
    </Paper>
  );
};

export default LeaderboardSection;
