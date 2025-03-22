import { Container, Box, useTheme } from '@mui/material';
import UserProfileHeader from '../components/xp-system/UserProfileHeader';
import XPProgressionSection from '../components/xp-system/XPProgressionSection';
import BadgesSection from '../components/xp-system/BadgesSection';
import LeaderboardSection from '../components/xp-system/LeaderboardSection';
import RewardsSection from '../components/xp-system/RewardsSection';
import CTASection from '../components/xp-system/CTASection';

const XPSystemPage = () => {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        py: 4,
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)' 
          : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'
      }}
    >
      <Container maxWidth="lg">
        <UserProfileHeader />
        <XPProgressionSection />
        <BadgesSection />
        <LeaderboardSection />
        <RewardsSection />
        <CTASection />
      </Container>
    </Box>
  );
};

export default XPSystemPage; 