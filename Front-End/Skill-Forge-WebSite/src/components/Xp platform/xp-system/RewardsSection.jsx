import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Chip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  IconButton
} from '@mui/material';
import { 
  Star as StarIcon,
  Event as EventIcon,
  AccessTime as TimeIcon,
  EmojiEvents as TrophyIcon,
  Lock as LockIcon,
  CheckCircle as CheckIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { exclusiveBenefits, upcomingCompetitions, userData } from '../../utils/mockData';

const RewardsSection = () => {
  const theme = useTheme();
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  // Calculate time remaining for competition
  const getTimeRemaining = (startDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const diffTime = Math.abs(start - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Starts today!';
    if (diffDays === 1) return 'Starts tomorrow!';
    return `Starts in ${diffDays} days`;
  };
  
  // Filter benefits by user level
  const currentBenefits = exclusiveBenefits.filter(benefit => benefit.level <= userData.level);
  const upcomingBenefits = exclusiveBenefits.filter(benefit => benefit.level > userData.level)
    .sort((a, b) => a.level - b.level);
  const nextBenefit = upcomingBenefits[0];

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
        Rewards & Incentives
      </Typography>
      
      <Grid container spacing={3}>
        {/* Exclusive Benefits Section */}
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              height: '100%',
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, #7b1fa2 0%, #4a148c 100%)' 
                : 'linear-gradient(135deg, #e1bee7 0%, #ce93d8 100%)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                <StarIcon sx={{ mr: 1 }} /> Exclusive Benefits
              </Typography>
              
              {currentBenefits.length > 0 ? (
                <List sx={{ mt: 1 }}>
                  {currentBenefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ListItem 
                        sx={{ 
                          px: 2, 
                          py: 1, 
                          borderRadius: 2, 
                          mb: 1,
                          bgcolor: theme.palette.mode === 'dark' 
                            ? 'rgba(255,255,255,0.1)' 
                            : 'rgba(0,0,0,0.05)'
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckIcon color="success" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={benefit.benefit} 
                          secondary={`Unlocked at Level ${benefit.level}`}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                  Reach Level 3 to unlock your first exclusive benefit!
                </Typography>
              )}
              
              {nextBenefit && (
                <Box 
                  sx={{ 
                    mt: 2, 
                    p: 2, 
                    borderRadius: 2, 
                    bgcolor: theme.palette.mode === 'dark' 
                      ? 'rgba(0,0,0,0.2)' 
                      : 'rgba(255,255,255,0.3)',
                    border: '1px dashed',
                    borderColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255,255,255,0.3)' 
                      : 'rgba(0,0,0,0.2)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LockIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                    <Typography variant="subtitle2" fontWeight="medium">
                      Next Benefit:
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {nextBenefit.benefit}
                  </Typography>
                  <Chip 
                    label={`Unlocks at Level ${nextBenefit.level}`} 
                    size="small" 
                    color="primary"
                    sx={{ 
                      mt: 1,
                      background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
                    }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Upcoming Competitions Section */}
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              height: '100%',
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, #f57c00 0%, #e65100 100%)' 
                : 'linear-gradient(135deg, #ffe0b2 0%, #ffcc80 100%)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                <EventIcon sx={{ mr: 1 }} /> Upcoming Competitions for XP Boost
              </Typography>
              
              <List sx={{ mt: 1 }}>
                {upcomingCompetitions.map((competition, index) => (
                  <motion.div
                    key={competition.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      sx={{ 
                        mb: 2, 
                        bgcolor: theme.palette.mode === 'dark' 
                          ? 'rgba(0,0,0,0.2)' 
                          : 'rgba(255,255,255,0.5)',
                        boxShadow: 'none',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <CardContent sx={{ pb: '16px !important' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {competition.title}
                          </Typography>
                          <Chip 
                            label={`+${competition.xpReward} XP`} 
                            size="small" 
                            color="success"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </Box>
                        
                        <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                          {competition.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TimeIcon fontSize="small" sx={{ mr: 0.5, opacity: 0.7 }} />
                            <Typography variant="caption" color="text.secondary">
                              {getTimeRemaining(competition.startDate)}
                            </Typography>
                          </Box>
                          
                          <Chip 
                            label={competition.difficulty} 
                            size="small" 
                            color={
                              competition.difficulty === 'Beginner' ? 'success' :
                              competition.difficulty === 'Intermediate' ? 'primary' : 'error'
                            }
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                        </Box>
                        
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          {formatDate(competition.startDate)} - {formatDate(competition.endDate)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </List>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  endIcon={<ArrowIcon />}
                  sx={{ 
                    borderRadius: 8,
                    bgcolor: theme.palette.mode === 'dark' ? '#e65100' : '#f57c00',
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' ? '#ef6c00' : '#fb8c00',
                    }
                  }}
                >
                  View All Competitions
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RewardsSection; 