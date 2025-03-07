import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  alpha,
  useTheme,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material';
import { 
  UserGroupIcon, 
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import AnimatedGradientButton from '../components/AnimatedGradientButton';

interface ReferralData {
  referral_count: number;
  referred_emails: string[];
  last_referral_date: string | null;
}

const Referrals: React.FC = () => {
  const theme = useTheme();
  const { getToken } = useAuth();
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCopyConfirmation, setShowCopyConfirmation] = useState(false);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/account/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch referral data');
      }

      const data = await response.json();
      setReferralData(data.referrals);
    } catch (err: any) {
      console.error("Error fetching referral data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContactRep = () => {
    navigator.clipboard.writeText('sales@syntheticteams.com');
    setShowCopyConfirmation(true);
    setTimeout(() => {
      setShowCopyConfirmation(false);
    }, 3000);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #121212 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ color: 'white' }}>
            Referral Program
          </Typography>
          <AnimatedGradientButton
            onClick={handleContactRep}
            startIcon={<Box component={PhoneIcon} sx={{ width: 20, height: 20 }} />}
          >
            Contact Sales
          </AnimatedGradientButton>
          {showCopyConfirmation && (
            <Alert severity="success" sx={{ mt: 1, position: 'absolute', zIndex: 1000, width: '300px' }}>
              Email copied to clipboard: sales@syntheticteams.com
            </Alert>
          )}
        </Box>

        <Grid container spacing={3}>
          {/* Program Details */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ 
              p: 4,
              background: alpha('#111111', 0.7),
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                Program Benefits
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Box component={CheckCircleIcon} sx={{ width: 24, height: 24, color: theme.palette.success.main }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Earn Rewards for Each Referral" 
                    secondary="Get rewarded for each company that joins through your referral"
                    sx={{ 
                      '& .MuiListItemText-primary': { color: 'white' },
                      '& .MuiListItemText-secondary': { color: 'text.secondary' }
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Box component={CheckCircleIcon} sx={{ width: 24, height: 24, color: theme.palette.success.main }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="No Referral Limit" 
                    secondary="Refer as many companies as you want"
                    sx={{ 
                      '& .MuiListItemText-primary': { color: 'white' },
                      '& .MuiListItemText-secondary': { color: 'text.secondary' }
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Box component={CheckCircleIcon} sx={{ width: 24, height: 24, color: theme.palette.success.main }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Quick Payouts" 
                    secondary="Receive rewards within 30 days of successful referral"
                    sx={{ 
                      '& .MuiListItemText-primary': { color: 'white' },
                      '& .MuiListItemText-secondary': { color: 'text.secondary' }
                    }}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Stats Card */}
              <Paper sx={{ 
                p: 4,
                background: alpha('#111111', 0.7),
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}>
                <Box sx={{ 
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <Box component={UserGroupIcon} sx={{ width: 48, height: 48, color: theme.palette.primary.main }} />
                  <Box>
                    <Typography variant="h3" sx={{ color: 'white', mb: 1 }}>
                      {referralData?.referral_count || 0}
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                      Total Referrals
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Contact Info */}
              <Paper sx={{ 
                p: 4,
                background: alpha('#111111', 0.7),
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                  Need Help?
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box component={PhoneIcon} sx={{ width: 24, height: 24, color: theme.palette.primary.main }} />
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      +1 (888) 123-4567
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box component={EnvelopeIcon} sx={{ width: 24, height: 24, color: theme.palette.primary.main }} />
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      support@syntheticteams.com
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
                    Our team is available Monday through Friday, 9 AM to 6 PM EST.
                  </Typography>
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Referrals; 