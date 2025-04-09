import { Container, Box, useTheme, CircularProgress, Typography } from '@mui/material';
import UserProfileHeader from '../xp-system/UserProfileHeader';
import XPProgressionSection from '../xp-system/XPProgressionSection';
import BadgesSection from '../xp-system/BadgesSection';
import LeaderboardSection from '../xp-system/LeaderboardSection';
import RewardsSection from '../xp-system/RewardsSection';
import CTASection from '../xp-system/CTASection';
import { useXpContext } from '../context/XpContext';

const XPSystemPage = () => {
  const theme = useTheme();
  const { isLoading, error } = useXpContext();

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)'
            : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)'
            : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'
        }}
      >
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

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
