import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Card,
  CardContent,
  useTheme,
  Grid
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab';
import { motion } from 'framer-motion';
import { recentXPActivities, badges, xpLevels, userData } from '../utils/mockData';

const XPProgressionSection = () => {
  const theme = useTheme();
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Find next unlockable badge (first locked badge)
  const nextBadge = badges.find(badge => !badge.unlocked);

  // Find next level milestone
  const currentLevelIndex = xpLevels.findIndex(level => level.level === userData.level);
  const nextLevel = xpLevels[currentLevelIndex + 1];

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
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
        XP & Level Progression
      </Typography>

      <Grid container spacing={3}>
        {/* Next Unlockable Badge */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              mb: 3,
              height: '100%',
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #303f9f 0%, #1a237e 100%)'
                : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Next Unlockable Badge
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <motion.div
                  initial={{ rotate: -10, scale: 0.9 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    repeatDelay: 5
                  }}
                >
                  <Box
                    sx={{
                      fontSize: '3rem',
                      mr: 2,
                      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))'
                    }}
                  >
                    {nextBadge.icon}
                  </Box>
                </motion.div>

                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {nextBadge.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {nextBadge.description}
                  </Typography>
                  <Chip
                    label={`How to unlock: ${nextBadge.unlockRequirement}`}
                    size="small"
                    color="primary"
                    sx={{
                      mt: 1,
                      background: theme.palette.mode === 'dark' ? '#5c6bc0' : '#42a5f5'
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Milestones Tracker */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              mb: 3,
              height: '100%',
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #00796b 0%, #004d40 100%)'
                : 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Milestones Tracker
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" fontWeight="medium">
                  Next Level: {nextLevel.level} - {nextLevel.rank}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Required XP: {nextLevel.xpRequired}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ flex: 1, mr: 2 }}>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      Progress to next level:
                    </Typography>
                    <Box
                      sx={{
                        height: 8,
                        width: '100%',
                        bgcolor: 'rgba(0,0,0,0.1)',
                        borderRadius: 5,
                        overflow: 'hidden'
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(userData.currentXP / nextLevel.xpRequired) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        style={{
                          height: '100%',
                          background: theme.palette.mode === 'dark'
                            ? 'linear-gradient(to right, #4db6ac, #009688)'
                            : 'linear-gradient(to right, #26a69a, #00796b)',
                          borderRadius: 5
                        }}
                      />
                    </Box>
                  </Box>
                  <Typography variant="body2" fontWeight="bold">
                    {Math.round((userData.currentXP / nextLevel.xpRequired) * 100)}%
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                  XP needed: {nextLevel.xpRequired - userData.currentXP} more XP
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent XP Gains */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Recent XP Gains
        </Typography>

        <Timeline position="center" sx={{ p: 0, m: 0 }}>
          {recentXPActivities.map((activity, index) => (
            <TimelineItem key={activity.id}>
              <TimelineSeparator>
                <TimelineDot
                  color="primary"
                  sx={{
                    boxShadow: '0 0 10px rgba(33, 150, 243, 0.5)',
                    background: theme.palette.mode === 'dark' ? '#5c6bc0' : '#42a5f5'
                  }}
                />
                {index < recentXPActivities.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Box
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                      '&:hover': {
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1" fontWeight="medium">
                        {activity.activity}
                      </Typography>
                      <Chip
                        label={`+${activity.xp} XP`}
                        size="small"
                        color="success"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(activity.date)}
                    </Typography>
                  </Box>
                </motion.div>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Box>
    </Paper>
  );
};

export default XPProgressionSection;
