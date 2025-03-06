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
} from '@mui/material';
import { GiftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

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

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const token = await getToken();
      const response = await fetch('http://localhost:5001/api/account/profile', {
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

        <Typography variant="h4" sx={{ mb: 4, color: 'white' }}>
          Referrals
        </Typography>

        <Paper sx={{ 
          p: 6,
          background: alpha('#111111', 0.7),
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <Box 
            component={GiftIcon} 
            sx={{ 
              width: 120, 
              height: 120, 
              color: theme.palette.primary.main,
              mb: 4
            }} 
          />

          <Typography variant="h3" sx={{ 
            color: 'white',
            mb: 2,
            fontWeight: 'bold'
          }}>
            {referralData?.referral_count || 0}
          </Typography>

          <Typography variant="h6" sx={{ 
            color: alpha(theme.palette.primary.main, 0.8),
            mb: 4
          }}>
            Total Referrals
          </Typography>

          {(!referralData?.referred_emails || referralData.referred_emails.length === 0) && (
            <Box sx={{ 
              mt: 4, 
              p: 3, 
              background: alpha(theme.palette.primary.main, 0.1),
              borderRadius: 2,
              maxWidth: 500
            }}>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Share Synthetic Teams with your network and earn rewards! Each successful referral helps us grow together.
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Referrals; 