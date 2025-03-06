import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  InputAdornment,
  IconButton,
  useTheme,
  Tooltip,
  useMediaQuery,
  Tab,
  Tabs
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import AnimatedGradientButton from './AnimatedGradientButton';
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [particleCount, setParticleCount] = useState(80);
  
  const { login, register } = useAuth();
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      const user = await login(email, password);
      
      if (!user.emailVerified) {
        navigate('/verify-email');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError('Failed to log in: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    
    try {
      setError('');
      setLoading(true);
      const user = await register(email, password);
      navigate('/verify-email');
    } catch (err: any) {
      setError('Failed to create account: ' + (err.message || 'Unknown error'));
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
                <Box 
                  component="img" 
                  src="/synthetic-teams-logo.svg" 
                  alt="Synthetic Teams"
                  sx={{ 
                    width: '180px',
                    height: 'auto',
                    margin: '0 auto 32px auto',
                    display: 'block'
                  }}
                />
              </Box>

              <LoginPaper elevation={0}>
                <Typography component="h1">
                  {tabValue === 0 ? 'Sign in to your account' : 'Create your account'}
                </Typography>

                {error && <ErrorAlert severity="error">{error}</ErrorAlert>}

                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange} 
                  variant="fullWidth" 
                  sx={{ 
                    borderBottom: 1, 
                    borderColor: 'divider',
                    mb: 3,
                    '& .MuiTab-root': {
                      fontWeight: 600,
                      fontSize: '0.9rem',
                    }
                  }}
                >
                  <Tab label="Login" />
                  <Tab label="Create Account" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                  <Box component="form" onSubmit={handleLogin}>
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
                      onClick={handleLogin}
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
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  <Box component="form" onSubmit={handleRegister}>
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
                      autoComplete="new-password"
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

                    <StyledTextField
                      required
                      fullWidth
                      name="confirmPassword"
                      label="Confirm Password"
                      type={showPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                      onClick={handleRegister}
                      disabled={loading}
                      loading={loading}
                    >
                      Create Account
                    </AnimatedGradientButton>
                  </Box>
                </TabPanel>
              </LoginPaper>

              <FooterText>
                {tabValue === 0 ? (
                  <>New to Synthetic Teams? <a href="#" onClick={(e) => { e.preventDefault(); setTabValue(1); }}>Sign up</a></>
                ) : (
                  <>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setTabValue(0); }}>Sign in</a></>
                )}
              </FooterText>
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

export default Login;
