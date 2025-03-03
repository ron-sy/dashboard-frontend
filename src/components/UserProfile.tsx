import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Avatar, 
  Divider,
  alpha,
  useTheme
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

const UserProfile: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        borderRadius: 3,
        background: alpha('#111111', 0.7),
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar 
          sx={{ 
            bgcolor: theme.palette.primary.main,
            width: 60,
            height: 60
          }}
        >
          <PersonIcon fontSize="large" />
        </Avatar>
        <Box sx={{ ml: 2 }}>
          <Typography variant="h6">
            {currentUser?.displayName || 'User'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentUser?.email}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Account Information
        </Typography>
        <Typography variant="body2">
          <strong>User ID:</strong> {currentUser?.uid.substring(0, 8)}...
        </Typography>
        <Typography variant="body2">
          <strong>Email Verified:</strong> {currentUser?.emailVerified ? 'Yes' : 'No'}
        </Typography>
      </Box>

      <Button
        variant="outlined"
        color="primary"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
        fullWidth
        sx={{ mt: 3 }}
      >
        Sign Out
      </Button>
    </Paper>
  );
};

export default UserProfile; 