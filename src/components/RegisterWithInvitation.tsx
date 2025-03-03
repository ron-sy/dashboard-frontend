import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Container, 
  Alert, 
  alpha,
  useTheme,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

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
  
  const { register, getToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

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
        
        // Use the backend API to validate the invitation
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/invitations/${invitationCode}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          setError(errorData.error || 'Invalid or expired invitation link');
          setValidatingInvitation(false);
          return;
        }
        
        const invitation = await response.json();
        
        // Check if invitation is already used
        if (invitation.used) {
          setError('This invitation link has already been used');
          setValidatingInvitation(false);
          return;
        }
        
        // Check if invitation is expired
        const expiryDate = new Date(invitation.expiryDate);
        if (expiryDate < new Date()) {
          setError('This invitation link has expired');
          setValidatingInvitation(false);
          return;
        }
        
        // Valid invitation
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
      
      // Register the user
      const user = await register(email, password);
      
      // Get the token for authentication
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Use the backend API to mark the invitation as used
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
      
      // Redirect to email verification page
      navigate('/verify-email');
    } catch (err: any) {
      console.error('Failed to create account:', err);
      setError('Failed to create account: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (validatingInvitation) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #000000 0%, #121212 100%)'
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!invitationData && !validatingInvitation) {
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
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderRadius: 3,
              background: alpha('#111111', 0.7),
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <Typography 
              component="h2" 
              variant="h5" 
              align="center" 
              sx={{ 
                mb: 3, 
                fontWeight: 600,
                color: theme.palette.primary.main
              }}
            >
              Invalid Invitation
            </Typography>
            
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                background: alpha('#f44336', 0.1),
                border: '1px solid rgba(244, 67, 54, 0.2)'
              }}
            >
              {error || 'This invitation link is invalid or has expired.'}
            </Alert>
            
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{ mt: 2 }}
            >
              Go to Login
            </Button>
          </Paper>
        </Container>
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
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          <Typography 
            component="h2" 
            variant="h5" 
            align="center" 
            sx={{ 
              mb: 1, 
              fontWeight: 600,
              color: theme.palette.primary.main
            }}
          >
            Create Your Account
          </Typography>
          
          <Typography 
            variant="subtitle1" 
            align="center" 
            sx={{ mb: 3, color: 'text.secondary' }}
          >
            You've been invited to join {invitationData?.companyName}
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
          
          <Box component="form" onSubmit={handleRegister}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  }
                }
              }}
            />
            
            <TextField
              margin="normal"
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
                      sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  }
                }
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              id="confirm-password"
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
                      sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  }
                }
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
                fontSize: '1rem'
              }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
            
            <Typography 
              variant="body2" 
              align="center" 
              sx={{ mt: 2 }}
            >
              Already have an account?{' '}
              <Box 
                component="span" 
                onClick={() => navigate('/login')} 
                sx={{ 
                  color: theme.palette.primary.main, 
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Sign in
              </Box>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterWithInvitation; 