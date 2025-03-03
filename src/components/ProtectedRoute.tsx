import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute: React.FC = () => {
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
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // Only check if user is authenticated, not if email is verified
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute; 