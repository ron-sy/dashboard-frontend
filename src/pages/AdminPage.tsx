import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Container, Typography, Paper } from '@mui/material';
import AdminPanel from '../components/AdminPanel';
import { useAuth } from '../context/AuthContext';

const AdminPage: React.FC = () => {
  const { currentUser, loading, isAdmin } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5">Loading...</Typography>
        </Paper>
      </Container>
    );
  }
  
  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // Render the admin panel
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage users and companies
        </Typography>
      </Box>
      
      <AdminPanel />
    </Container>
  );
};

export default AdminPage; 