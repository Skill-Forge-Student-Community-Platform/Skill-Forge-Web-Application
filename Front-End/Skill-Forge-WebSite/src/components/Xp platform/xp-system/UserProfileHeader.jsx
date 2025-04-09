import React, { useState, useEffect } from 'react';
import {
  Paper, Grid, Typography, Avatar, Box, Chip, LinearProgress,
  IconButton, useMediaQuery, Button
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Brightness4, Brightness7, LightbulbOutlined, EmojiEventsOutlined,
  WorkspacePremiumOutlined, AutoGraphOutlined
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { userData } from '../utils/mockData';
import { useThemeContext } from '../context/ThemeContext';
import { useXpContext } from '../context/XpContext';

const UserProfileHeader = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const { mode, toggleColorMode } = useThemeContext();
  const { userData: userXpData } = useXpContext();

  // Use context data if available, otherwise fallback to mock data
  const user = userXpData || userData;

  // Calculate progress percentage
  const progress = Math.round((user.currentXP / user.nextLevelXP) * 100);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        mb: 4,
        position: 'relative',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(to right, #1a237e, #283593)'
          : 'linear-gradient(to right, #bbdefb, #90caf9)'
      }}
    >
      <IconButton
        onClick={toggleColorMode}
        sx={{ position: 'absolute', top: 10, right: 10 }}
        color="inherit"
      >
        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>

      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={3} md={2}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Avatar
              src={user.avatar}
              alt={user.name}
              sx={{
                width: 100,
                height: 100,
                border: `4px solid ${theme.palette.primary.main}`,
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }}
            />
          </motion.div>
        </Grid>

        {/* User Info Section */}
        <Grid item xs={12} sm={9} md={10}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              {user.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Chip
                label={`${user.rank} - Level ${user.level}`}
                color="primary"
                sx={{
                  fontWeight: 'bold',
                  mr: 2,
                  background: theme.palette.mode === 'dark' ? '#5c6bc0' : '#42a5f5'
                }}
              />
              <Typography variant="body2">
                Rank #{user.leaderboardRank} on Leaderboard
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip
                icon={<WorkspacePremiumOutlined />}
                label={`${user.level} Level`}
                size="small"
                variant="outlined"
                sx={{ borderColor: 'rgba(255,255,255,0.3)' }}
              />
              <Chip
                icon={<EmojiEventsOutlined />}
                label={`${user.rank}`}
                size="small"
                variant="outlined"
                sx={{ borderColor: 'rgba(255,255,255,0.3)' }}
              />
              <Chip
                icon={<AutoGraphOutlined />}
                label={`${user.totalXP} XP Total`}
                size="small"
                variant="outlined"
                sx={{ borderColor: 'rgba(255,255,255,0.3)' }}
              />
              <Chip
                icon={<LightbulbOutlined />}
                label={`${user.membershipType ?
                  (user.membershipType.charAt(0).toUpperCase() + user.membershipType.slice(1)) :
                  'Standard'} Member`}
                size="small"
                variant="outlined"
                sx={{ borderColor: 'rgba(255,255,255,0.3)' }}
              />
            </Box>

            <Box sx={{ mt: 2, mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">
                  Current XP: {user.currentXP}
                </Typography>
                <Typography variant="body2">
                  Next Level: {user.nextLevelXP} XP
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(to right, #64b5f6, #2196f3)'
                      : 'linear-gradient(to right, #1976d2, #0d47a1)'
                  }
                }}
              />
              <Typography variant="body2" sx={{ mt: 0.5, textAlign: 'right' }}>
                {progress}% to Level {user.level + 1}
              </Typography>
            </Box>

            {matches && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: 4,
                    px: 3,
                    backgroundColor: theme.palette.mode === 'dark' ? '#5c6bc0' : '#1976d2'

                  }}
                >
                  View Achievements
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    ml: 2,
                    borderRadius: 4,
                    px: 3,
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'inherit'
                  }}
                >
                  Claim Rewards
                </Button>
              </Box>
            )}

            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" fontWeight="medium">
                Total XP Earned:
              </Typography>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Typography
                  variant="h6"
                  component="span"
                  sx={{
                    ml: 1,
                    color: theme.palette.mode === 'dark' ? '#ffeb3b' : '#f57c00',
                    fontWeight: 'bold'
                  }}
                >
                  {user.totalXP} XP
                </Typography>
              </motion.div>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default UserProfileHeader;
