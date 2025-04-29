import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  InputAdornment,
  IconButton,
  useTheme,
  Tooltip,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import AnimatedGradientButton from './AnimatedGradientButton';
import ParticleField from './ParticleField';
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
  StyledTextField,
  SocialButton,
  ErrorAlert,
  Divider,
  FooterText,
  OverlayText
} from './LoginStyles';

const RegisterWithInvitation: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [invitationCode, setInvitationCode] = useState<string | null>(null);
  const [invitationData, setInvitationData] = useState<any>(null);
  const [validatingInvitation, setValidatingInvitation] = useState(true);
  const [particleCount, setParticleCount] = useState(80);
  
  const { register, getToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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

  // Extract invitation code from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('invitation');
    setInvitationCode(code);
  }, [location]);

  // Validate invitation code
  useEffect(() => {
    const validateInvitation = async () => {
      if (!invitationCode) {
        setError('Invalid invitation link');
        setValidatingInvitation(false);
        return;
      }

      try {
        setValidatingInvitation(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/invitations/${invitationCode}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          setError(errorData.error || 'Invalid or expired invitation link');
          setValidatingInvitation(false);
          return;
        }
        
        const invitation = await response.json();
        
        if (invitation.used) {
          setError('This invitation link has already been used');
          setValidatingInvitation(false);
          return;
        }
        
        const expiryDate = new Date(invitation.expiryDate);
        if (expiryDate < new Date()) {
          setError('This invitation link has expired');
          setValidatingInvitation(false);
          return;
        }
        
        setInvitationData(invitation);
        setValidatingInvitation(false);
      } catch (err: any) {
        console.error('Error validating invitation:', err);
        setError('Error validating invitation: ' + (err.message || 'Unknown error'));
        setValidatingInvitation(false);
      }
    };
    
    if (invitationCode) {
      validateInvitation();
    } else {
      setValidatingInvitation(false);
    }
  }, [invitationCode]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invitationData) {
      setError('Invalid invitation');
      return;
    }
    
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
      const token = await getToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/invitations/${invitationCode}/use`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to use invitation: ${response.status}`);
      }
      
      navigate('/verify-email');
    } catch (err: any) {
      console.error('Failed to create account:', err);
      setError('Failed to create account: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  if (validatingInvitation) {
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

  if (!invitationData && !validatingInvitation) {
    return (
      <LoginContainer>
        <MainContent>
          <LoginSection>
            <LoginContent>
              <Box sx={{ width: '100%', maxWidth: { xs: '100%', sm: 400, md: 448 } }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Box 
                    component="img" 
                    src="/st-newlogo.png" 
                    alt="Synthetic Teams"
                    sx={{ 
                      width: '220px',
                      height: 'auto',
                      margin: '0 auto'
                    }}
                  />
                </Box>
                <LoginPaper>
                  <Typography component="h1">
                    Invalid Invitation
                  </Typography>
                  <ErrorAlert severity="error">
                    {error || 'This invitation link is invalid or has expired.'}
                  </ErrorAlert>
                  <AnimatedGradientButton
                    onClick={() => navigate('/login')}
                  >
                    Go to Login
                  </AnimatedGradientButton>
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
                <Typography component="h1">
                  Create Your Account
                </Typography>
                
                <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary', textAlign: 'center' }}>
                  You've been invited to join{' '}
                  <Box component="span" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                    {invitationData?.companyName}
                  </Box>
                </Typography>
                
                {error && <ErrorAlert severity="error">{error}</ErrorAlert>}
                
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
                            onClick={() => setShowPassword(!showPassword)}
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
                            onClick={() => setShowPassword(!showPassword)}
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
                        Sign up with Google
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
                        Sign up with Microsoft
                      </SocialButton>
                    </span>
                  </Tooltip>
                  
                  <FooterText>
                    Already have an account?{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
                      Sign in
                    </a>
                  </FooterText>
                </Box>
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

export default RegisterWithInvitation; 