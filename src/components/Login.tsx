import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Container, 
  Alert, 
  alpha,
  useTheme,
  InputAdornment,
  IconButton
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

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
              mb: 3, 
              fontWeight: 600,
              color: theme.palette.primary.main
            }}
          >
            Deploy the Hybrid Workforce of the Future
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
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
              {loading ? 'Logging in...' : 'Request Access'}
            </Button>
            
            <Typography 
              variant="body2" 
              align="center" 
              sx={{ 
                mt: 2, 
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.75rem'
              }}
            >
              hiring <Box component="span" sx={{ opacity: 0.7 }}>human</Box> engineers and ml researchers
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
