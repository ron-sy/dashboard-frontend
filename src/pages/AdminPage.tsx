import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Container, Typography, Paper } from '@mui/material';
import AdminPanel from '../components/AdminPanel';
import { useAuth } from '../context/AuthContext';

const AdminPage: React.FC = () => {
  const { isAdmin } = useAuth();
  
  // Redirect to dashboard if not an admin
  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
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