import React, { useState, useEffect } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton,
  alpha,
  useTheme,
  CircularProgress
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Outlet, useParams } from 'react-router-dom';
import SideMenu from './SideMenu';

interface Company {
  id: string;
  name: string;
  created_at: string;
}

const DashboardLayout: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { companyId } = useParams();
  const { currentUser, isAdmin, getToken } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [onboardingProgress, setOnboardingProgress] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  const navigateToAdmin = () => {
    navigate('/admin');
  };

  // Fetch companies from API
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        
        if (!token) {
          throw new Error('Authentication required');
        }
        
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/companies`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch companies');
        }
        
        const data = await response.json();
        setCompanies(data);
        
        // Auto-select the company from URL params or the first company if available
        if (companyId) {
          setSelectedCompany(companyId);
        } else if (data.length > 0 && !selectedCompany) {
          setSelectedCompany(data[0].id);
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        console.error('Error fetching companies:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompanies();
  }, [getToken, companyId]);

  // Fetch onboarding progress when selected company changes
  useEffect(() => {
    const fetchOnboardingProgress = async () => {
      if (!selectedCompany) return;
      
      try {
        const token = await getToken();
        if (!token) return;

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/companies/${selectedCompany}/onboarding-progress`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setOnboardingProgress(data.progress);
        }
      } catch (err) {
        console.error('Failed to fetch onboarding progress:', err);
      }
    };

    fetchOnboardingProgress();
  }, [selectedCompany, getToken]);

  return (
    <Box sx={{ 
      minHeight: '100vh',
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
    }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          background: 'transparent', 
          backdropFilter: 'blur(10px)',
          zIndex: (theme) => theme.zIndex.drawer + 1 
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Box 
                component="img" 
                src="/logo.svg" 
                alt="Logo" 
                sx={{ height: 48 }}
              />
            </Typography>
          </Box>
          {isAdmin && (
            <IconButton 
              color="inherit" 
              onClick={navigateToAdmin}
              sx={{ 
                mr: 1,
                background: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.2),
                }
              }}
              title="Admin Dashboard"
            >
              <AdminPanelSettingsIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* Add spacing for fixed AppBar */}
      <Box sx={{ display: 'flex' }}>
        <SideMenu 
          onboardingProgress={onboardingProgress} 
          companies={companies}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
        />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Outlet context={{ companies, loading, error, selectedCompany, setSelectedCompany }} />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
