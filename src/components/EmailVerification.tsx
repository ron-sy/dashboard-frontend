import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  CircularProgress, 
  Alert,
  alpha,
  useTheme,
  Container
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import EmailIcon from '@mui/icons-material/Email';
import LogoutIcon from '@mui/icons-material/Logout';

const EmailVerification: React.FC = () => {
  const { currentUser, logout, sendEmailVerification } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();

  // Check if email is verified every 5 seconds
  useEffect(() => {
    if (!currentUser) return;

    const checkEmailVerified = async () => {
      try {
        // Force refresh the token to get the latest user data
        await currentUser.reload();
        
        if (currentUser.emailVerified) {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Error checking email verification status:', err);
      }
    };

    const interval = setInterval(checkEmailVerified, 5000);
    return () => clearInterval(interval);
  }, [currentUser, navigate]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown <= 0) return;
    
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResendEmail = async () => {
    if (countdown > 0) return;
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      await sendEmailVerification();
      
      setSuccess('Verification email sent! Please check your inbox.');
      setCountdown(60); // Set a 60-second countdown
    } catch (err: any) {
      setError('Failed to send verification email: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err: any) {
      setError('Failed to log out: ' + (err.message || 'Unknown error'));
    }
  };

  if (!currentUser) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #000000 0%, #121212 100%)',
        backgroundSize: 'cover',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("/network-grid.svg") no-repeat center center',
          backgroundSize: 'cover',
          opacity: 0.1,
          pointerEvents: 'none',
          zIndex: 0
        }
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Box 
            component="img" 
            src="/synthetic-teams-logo.svg" 
            alt="Synthetic Teams" 
            sx={{ height: 50, mb: 2 }}
          />
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              mb: 1
            }}
          >
            synthetic<Box component="span" sx={{ color: theme.palette.primary.main }}>teams</Box>
          </Typography>
        </Box>
        
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 3,
            background: alpha('#111111', 0.7),
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            textAlign: 'center'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <MarkEmailReadIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />
          </Box>
          
          <Typography 
            component="h2" 
            variant="h5" 
            align="center" 
            sx={{ 
              mb: 2, 
              fontWeight: 600,
              color: theme.palette.primary.main
            }}
          >
            Verify Your Email
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3 }}>
            We've sent a verification email to <strong>{currentUser.email}</strong>. 
            Please check your inbox and click the verification link to complete your registration.
          </Typography>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                background: alpha('#f44336', 0.1),
                border: '1px solid rgba(244, 67, 54, 0.2)'
              }}
            >
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                background: alpha('#4caf50', 0.1),
                border: '1px solid rgba(76, 175, 80, 0.2)'
              }}
            >
              {success}
            </Alert>
          )}
          
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            If you don't see the email, check your spam folder or click the button below to resend the verification email.
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<EmailIcon />}
            onClick={handleResendEmail}
            disabled={loading || countdown > 0}
            fullWidth
            sx={{ mb: 2, py: 1.5 }}
          >
            {loading ? 'Sending...' : countdown > 0 ? `Resend Email (${countdown}s)` : 'Resend Verification Email'}
          </Button>
          
          <Button
            variant="outlined"
            color="primary"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            fullWidth
            sx={{ py: 1.5 }}
          >
            Sign Out
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default EmailVerification; 