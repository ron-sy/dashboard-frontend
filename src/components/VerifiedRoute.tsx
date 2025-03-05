import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const VerifiedRoute: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #000000 0%, #121212 100%)',
        }}
      >
        <CircularProgress size={24} sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
      </Box>
    );
  }

  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but email not verified, redirect to email verification page
  if (!currentUser.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // If authenticated and email verified, render the protected route
  return <Outlet />;
};

export default VerifiedRoute; 