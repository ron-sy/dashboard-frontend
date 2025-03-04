import React, { useState, useEffect } from 'react';
import { 
  Box,
  Typography,
  InputAdornment,
  IconButton,
  useTheme,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import AnimatedGradientButton from './AnimatedGradientButton';
import { ReactComponent as LogoSVG } from '../assets/logo.svg';
import ParticleField from './physics/ParticleField';
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
  Logo,
  LoginPaper,
  StyledTextField,
  SocialButton,
  ErrorAlert,
  Divider,
  FooterText,
  OverlayText
} from './LoginStyles';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [particleCount, setParticleCount] = useState(80);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Adjust particle count based on screen size
  useEffect(() => {
    if (isSmallScreen) {
      setParticleCount(40);
    } else if (isMobile) {
      setParticleCount(60);
    } else {
      setParticleCount(80);
    }
  }, [isMobile, isSmallScreen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Failed to log in: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <LoginContainer>
      <MainContent>
        <LoginSection>
          <LoginContent>
            <Box sx={{ width: '100%', maxWidth: { xs: '100%', sm: 400, md: 448 } }}>
              <Box sx={{ textAlign: 'center' }}>
                <Logo>
                  <LogoSVG />
                </Logo>
              </Box>

              <LoginPaper elevation={0}>
                <Typography component="h1">
                  Sign in to your account
                </Typography>

                {error && <ErrorAlert severity="error">{error}</ErrorAlert>}

                <Box component="form" onSubmit={handleSubmit}>
                  <StyledTextField
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                  />

                  <StyledTextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={toggleShowPassword}
                            edge="end"
                            size="small"
                            sx={{ 
                              color: '#6B7280',
                              padding: '4px',
                              '&:hover': {
                                backgroundColor: '#F3F4F6'
                              }
                            }}
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <AnimatedGradientButton
                    onClick={handleSubmit}
                    disabled={loading}
                    loading={loading}
                  >
                    Sign in
                  </AnimatedGradientButton>

                  <Divider>
                    <span>or</span>
                  </Divider>

                  <Tooltip title="Coming soon" arrow placement="top">
                    <span style={{ width: '100%' }}>
                      <SocialButton
                        fullWidth
                        startIcon={<GoogleIcon sx={{ fontSize: 20 }} />}
                        onClick={(e) => e.preventDefault()}
                        disabled
                      >
                        Sign in with Google
                      </SocialButton>
                    </span>
                  </Tooltip>

                  <Tooltip title="Coming soon" arrow placement="top">
                    <span style={{ width: '100%' }}>
                      <SocialButton
                        fullWidth
                        startIcon={<MicrosoftIcon sx={{ fontSize: 20 }} />}
                        onClick={(e) => e.preventDefault()}
                        disabled
                      >
                        Sign in with Microsoft
                      </SocialButton>
                    </span>
                  </Tooltip>
                </Box>
              </LoginPaper>

              <FooterText>
                New to Synthetic Teams? <a href="/signup">Sign up</a>
              </FooterText>
            </Box>
          </LoginContent>
          
          <LoginFooter>
            <Copyright>
              Copyright © 2025 Synthetic Teams Inc.
            </Copyright>
            <LoginFooterLinks>
              <LoginFooterLink href="/platform-agreement">
                Synthetic Teams Platform Agreement
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

export default Login;
