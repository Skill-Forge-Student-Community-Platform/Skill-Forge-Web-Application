import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  LinearProgress, 
  Paper, 
  Grid, 
  Chip,
  useTheme,
  IconButton
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { userData } from '../../utils/mockData';
import { useThemeContext } from '../../context/ThemeContext';

const UserProfileHeader = () => {
  const theme = useTheme();
  const { mode, toggleColorMode } = useThemeContext();
  const [progress, setProgress] = useState(0);
  
  // Calculate XP progress percentage
  const xpProgress = Math.round((userData.currentXP / userData.nextLevelXP) * 100);
  
  // Animate progress bar on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(xpProgress);
    }, 500);
    return () => clearTimeout(timer);
  }, [xpProgress]);

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
      {/* Dark/Light Mode Toggle */}
      <IconButton 
        onClick={toggleColorMode} 
        sx={{ position: 'absolute', top: 10, right: 10 }}
        color="inherit"
      >
        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>

      <Grid container spacing={3} alignItems="center">
        {/* Avatar Section */}
        <Grid item xs={12} sm={3} md={2}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Avatar 
              src={userData.avatar} 
              alt={userData.name}
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
              {userData.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Chip 
                label={`${userData.rank} - Level ${userData.level}`} 
                color="primary" 
                sx={{ 
                  fontWeight: 'bold',
                  mr: 2,
                  background: theme.palette.mode === 'dark' ? '#5c6bc0' : '#42a5f5'
                }} 
              />
              <Typography variant="body2">
                Rank #{userData.leaderboardRank} on Leaderboard
              </Typography>
            </Box>

            {/* XP Progress Bar */}
            <Box sx={{ mt: 2, mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">
                  Current XP: {userData.currentXP}
                </Typography>
                <Typography variant="body2">
                  Next Level: {userData.nextLevelXP} XP
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
                {progress}% to Level {userData.level + 1}
              </Typography>
            </Box>

            {/* Total XP */}
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
                  {userData.totalXP} XP
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