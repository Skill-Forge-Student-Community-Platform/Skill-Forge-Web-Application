import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Grid,
  Card,
  CardContent,
  useTheme,
  IconButton
} from '@mui/material';
import { 
  //import facebook and twitter icons from material ui if we want
  EmojiEvents as TrophyIcon,
  Share as ShareIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const CTASection = () => {
  const theme = useTheme();
  
  // CTA cards data - only keeping the competition card
  const ctaCards = [
    {
      id: 'join',
      title: 'Join a Competition Now',
      description: 'Participate in active competitions to earn XP and showcase your skills. Competitions are a great way to challenge yourself and measure your progress against others in the community.',
      icon: <TrophyIcon fontSize="large" />,
      buttonText: 'Browse Competitions',
      color: theme.palette.mode === 'dark' ? '#1a237e' : '#bbdefb',
      additionalText: 'Currently active competitions: 3'
    }
  ];

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
        Earn More XP
      </Typography>
      
      {/* CTA Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {ctaCards.map((card, index) => (
          <Grid item xs={12} md={5} key={card.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card 
                sx={{ 
                  height: '100%',
                  background: `linear-gradient(135deg, ${card.color} 0%, ${card.color}99 100%)`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <div className="card-header">
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 2,
                        color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)'
                      }}
                    >
                      <div className="card-icon" style={{ marginRight: '16px', opacity: 0.9 }}>
                        {card.icon}
                      </div>
                      <Typography variant="h6" fontWeight="bold" component="h3">
                        {card.title}
                      </Typography>
                    </Box>
                  </div>
                  
                  <div className="card-body">
                    <Typography variant="body2" sx={{ mb: 3, minHeight: 80 }}>
                      {card.description}
                    </Typography>
                    
                    {card.additionalText && (
                      <div className="card-stats" style={{
                        padding: '8px',
                        marginBottom: '16px',
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        borderRadius: '4px',
                        textAlign: 'center'
                      }}>
                        <Typography variant="caption" fontWeight="medium">
                          {card.additionalText}
                        </Typography>
                      </div>
                    )}
                  </div>
                  
                  <div className="card-footer">
                    <Button 
                      variant="contained" 
                      endIcon={<ArrowIcon />}
                      fullWidth
                      sx={{ 
                        borderRadius: 8,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                        color: theme.palette.mode === 'dark' ? 'white' : 'rgba(0,0,0,0.8)',
                        '&:hover': {
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)',
                        }
                      }}
                    >
                      {card.buttonText}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      
      {/* Share Achievements Section */}
      <Box 
        sx={{ 
          p: 3, 
          borderRadius: 2, 
          textAlign: 'center',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #424242 0%, #212121 100%)' 
            : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
        }}
      >
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Share Your Achievements
        </Typography>
        
        <Typography variant="body2" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
          Showcase your badges and XP progress with your network. Inspire others and get recognized for your accomplishments.
        </Typography>
        
        <Button 
          variant="outlined" 
          startIcon={<ShareIcon />}
          sx={{ 
            mt: 3, 
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 'bold',
            borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
            color: theme.palette.mode === 'dark' ? 'white' : 'rgba(0,0,0,0.8)',
            '&:hover': {
              borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
              bgcolor: 'transparent'
            }
          }}
        >
          Generate Shareable Certificate
        </Button>
      </Box>
    </Paper>
  );
};

export default CTASection;