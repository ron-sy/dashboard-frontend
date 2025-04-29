import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button,
  CircularProgress,
  useTheme,
  useMediaQuery,
  IconButton
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import EmailIcon from '@mui/icons-material/Email';
import LogoutIcon from '@mui/icons-material/Logout';
import ParticleField from './ParticleField';
import AnimatedGradientButton from './AnimatedGradientButton';
import {
  LoginContainer,
  MainContent,
  LoginSection,
  LoginContent,
  LoginFooter,
  LoginFooterLinks,
  LoginFooterLink,
  Copyright,
  GraphicSection,
  LoginPaper,
  ErrorAlert,
  OverlayText
} from './LoginStyles';

const EmailVerification: React.FC = () => {
  const { currentUser, logout, sendEmailVerification } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [particleCount, setParticleCount] = useState(80);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (isSmallScreen) {
      setParticleCount(40);
    } else if (isMobile) {
      setParticleCount(60);
    } else {
      setParticleCount(80);
    }
  }, [isMobile, isSmallScreen]);

  // Check if email is verified every 5 seconds
  useEffect(() => {
    if (!currentUser) return;

    const checkEmailVerified = async () => {
      try {
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
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
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
      setCountdown(60);
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
      <LoginContainer>
        <MainContent>
          <LoginSection>
            <LoginContent>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress size={24} sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
              </Box>
            </LoginContent>
          </LoginSection>
          <GraphicSection>
            <OverlayText variant="h3">
              Deploy the Hybrid Workforce of the Future
            </OverlayText>
            <ParticleField particleCount={particleCount} noGoZone={true} />
          </GraphicSection>
        </MainContent>
      </LoginContainer>
    );
  }

  return (
    <LoginContainer>
      <MainContent>
        <LoginSection>
          <LoginContent>
            <Box sx={{ width: '100%', maxWidth: { xs: '100%', sm: 400, md: 448 } }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box 
                  component="img" 
                  src="/st-newlogo.png" 
                  alt="Synthetic Teams"
                  sx={{ 
                    width: '220px',
                    height: 'auto',
                    margin: '0 auto 32px auto',
                    display: 'block'
                  }}
                />
              </Box>
              
              <LoginPaper>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <MarkEmailReadIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />
                </Box>

                <Typography component="h1">
                  Verify Your Email
                </Typography>

                <Typography variant="body1" sx={{ mt: 2, mb: 3, textAlign: 'center' }}>
                  We've sent a verification email to <strong>{currentUser.email}</strong>. 
                  Please check your inbox and click the verification link to complete your registration.
                </Typography>

                {error && <ErrorAlert severity="error">{error}</ErrorAlert>}
                {success && (
                  <ErrorAlert severity="success" sx={{ 
                    '& .MuiAlert-icon': { color: theme.palette.success.main },
                    borderColor: theme.palette.success.main,
                    backgroundColor: `${theme.palette.success.main}10`
                  }}>
                    {success}
                  </ErrorAlert>
                )}

                <Typography variant="body2" sx={{ mt: 3, mb: 3, color: 'text.secondary', textAlign: 'center' }}>
                  If you don't see the email, check your spam folder or click the button below to resend the verification email.
                </Typography>

                <AnimatedGradientButton
                  onClick={handleResendEmail}
                  disabled={loading || countdown > 0}
                  loading={loading}
                >
                  {loading ? 'Sending...' : countdown > 0 ? `Resend Email (${countdown}s)` : 'Resend Verification Email'}
                </AnimatedGradientButton>

                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  fullWidth
                  sx={{ 
                    mt: 2,
                    height: 42,
                    textTransform: 'none',
                    fontSize: '0.9375rem',
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)'
                    }
                  }}
                >
                  Sign Out
                </Button>
              </LoginPaper>
            </Box>
          </LoginContent>
          
          <LoginFooter>
            <Copyright>
              Copyright © {new Date().getFullYear()} Synthetic Teams Inc.
            </Copyright>
            <LoginFooterLinks>
              <LoginFooterLink href="/platform-agreement">
                Platform Agreement
              </LoginFooterLink>
              <LoginFooterLink href="/privacy">
                Privacy Policy
              </LoginFooterLink>
            </LoginFooterLinks>
          </LoginFooter>
        </LoginSection>
        
        <GraphicSection>
          <OverlayText variant="h3">
            Deploy the Hybrid Workforce of the Future
          </OverlayText>
          <ParticleField particleCount={particleCount} noGoZone={true} />
        </GraphicSection>
      </MainContent>
    </LoginContainer>
  );
};

export default EmailVerification; 