import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Chip,
  Tooltip,
  Modal,
  Button,
  IconButton,
  useTheme,
  Tabs,
  Tab
} from '@mui/material';
import { Close, Info } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { badges } from '../../utils/mockData';

const BadgesSection = () => {
  const theme = useTheme();
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  
  // Filter badges by category and unlock status
  const filteredBadges = badges.filter(badge => 
    (filterCategory === 'all' || badge.category === filterCategory)
  );
  
  const earnedBadges = filteredBadges.filter(badge => badge.unlocked);
  const lockedBadges = filteredBadges.filter(badge => !badge.unlocked);
  
  // Handle badge click
  const handleBadgeClick = (badge) => {
    setSelectedBadge(badge);
    setModalOpen(true);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Get all unique categories
  const categories = ['all', ...new Set(badges.map(badge => badge.category))];

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
        Badges & Achievements
      </Typography>
      
      {/* Category Filter */}
      <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={filterCategory} 
          onChange={(e, newValue) => setFilterCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
        >
          {categories.map(category => (
            <Tab 
              key={category} 
              label={category.charAt(0).toUpperCase() + category.slice(1)} 
              value={category}
            />
          ))}
        </Tabs>
      </Box>
      
      {/* Earned Badges Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h3" fontWeight="bold">
            🛡️ Earned Badges
          </Typography>
          <Chip 
            label={`${earnedBadges.length} badges`} 
            size="small" 
            color="primary" 
            sx={{ ml: 2 }}
          />
        </Box>
        
        <Grid container spacing={2}>
          {earnedBadges.map((badge, index) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={badge.id}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card 
                  onClick={() => handleBadgeClick(badge)}
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                    textAlign: 'center',
                    background: theme.palette.mode === 'dark' 
                      ? 'linear-gradient(135deg, #303f9f 0%, #1a237e 100%)' 
                      : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                      pointerEvents: 'none'
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      fontSize: '3rem', 
                      mb: 1,
                      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))'
                    }}
                  >
                    {badge.icon}
                  </Box>
                  <Typography variant="subtitle1" fontWeight="bold" noWrap>
                    {badge.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {badge.category}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {/* Locked Badges Section */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h3" fontWeight="bold">
            🔒 Locked Badges
          </Typography>
          <Chip 
            label={`${lockedBadges.length} badges`} 
            size="small" 
            color="default" 
            sx={{ ml: 2 }}
          />
        </Box>
        
        <Grid container spacing={2}>
          {lockedBadges.map((badge, index) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={badge.id}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05 + 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Tooltip title={`How to unlock: ${badge.unlockRequirement}`} arrow>
                  <Card 
                    onClick={() => handleBadgeClick(badge)}
                    sx={{ 
                      height: '100%',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 2,
                      textAlign: 'center',
                      filter: 'grayscale(1)',
                      opacity: 0.7,
                      background: theme.palette.mode === 'dark' 
                        ? 'linear-gradient(135deg, #424242 0%, #212121 100%)' 
                        : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                      position: 'relative'
                    }}
                  >
                    <Box 
                      sx={{ 
                        fontSize: '3rem', 
                        mb: 1,
                        filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.1))'
                      }}
                    >
                      {badge.icon}
                    </Box>
                    <Typography variant="subtitle1" fontWeight="bold" noWrap>
                      {badge.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {badge.category}
                    </Typography>
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8,
                        color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                      }}
                    >
                      <Info fontSize="small" />
                    </Box>
                  </Card>
                </Tooltip>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {/* Badge Detail Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="badge-detail-modal"
        closeAfterTransition
      >
        <AnimatePresence>
          {modalOpen && selectedBadge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: 500,
                backgroundColor: theme.palette.background.paper,
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                borderRadius: 12,
                padding: 24,
                outline: 'none'
              }}
            >
              <IconButton
                onClick={() => setModalOpen(false)}
                sx={{ position: 'absolute', top: 8, right: 8 }}
              >
                <Close />
              </IconButton>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box 
                  sx={{ 
                    fontSize: '4rem', 
                    mr: 3,
                    filter: selectedBadge.unlocked 
                      ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' 
                      : 'grayscale(1) drop-shadow(0 2px 3px rgba(0,0,0,0.1))',
                    opacity: selectedBadge.unlocked ? 1 : 0.7
                  }}
                >
                  {selectedBadge.icon}
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {selectedBadge.name}
                  </Typography>
                  <Chip 
                    label={selectedBadge.category} 
                    size="small" 
                    color={selectedBadge.unlocked ? "primary" : "default"}
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>
              
              <Typography variant="body1" paragraph>
                {selectedBadge.description}
              </Typography>
              
              {selectedBadge.unlocked ? (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Earned on:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(selectedBadge.dateEarned)}
                  </Typography>
                </Box>
              ) : (
                <Box 
                  sx={{ 
                    mt: 2, 
                    p: 2, 
                    borderRadius: 2, 
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' 
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    How to unlock:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedBadge.unlockRequirement}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  onClick={() => setModalOpen(false)}
                  sx={{ borderRadius: 8 }}
                >
                  Close
                </Button>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    </Paper>
  );
};

export default BadgesSection; 