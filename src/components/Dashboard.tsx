import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  CircularProgress, 
  Alert, 
  List, 
  ListItem, 
  ListItemText,
  ListItemButton,
  Divider,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  alpha,
  useTheme
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAuth } from '../context/AuthContext';
import OnboardingProgress from './OnboardingProgress';
import { useNavigate } from 'react-router-dom';

// Define the structure of a company
interface Company {
  id: string;
  name: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { currentUser, getToken, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  
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
        
        // Auto-select the first company if available
        if (data.length > 0 && !selectedCompany) {
          setSelectedCompany(data[0].id);
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompanies();
  }, [getToken, selectedCompany]);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Failed to log out');
    }
  };
  
  const navigateToAdmin = () => {
    navigate('/admin');
  };
  
  const selectCompany = (companyId: string) => {
    setSelectedCompany(companyId);
  };
  
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
      <AppBar position="static" sx={{ background: 'transparent', backdropFilter: 'blur(10px)' }}>
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
                src="/synthetic-teams-logo.svg" 
                alt="Synthetic Teams" 
                sx={{ height: 32, mr: 2 }}
              />
              synthetic<Box component="span" sx={{ color: theme.palette.primary.main }}>teams</Box>
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mr: 2, opacity: 0.7 }}>
            {currentUser?.email}
          </Typography>
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
          <IconButton 
            color="inherit" 
            onClick={handleLogout}
            title="Logout"
            sx={{ 
              background: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                background: alpha(theme.palette.primary.main, 0.2),
              }
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 6, position: 'relative', zIndex: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress sx={{ color: theme.palette.primary.main }} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Company List Sidebar */}
            <Grid item xs={12} md={3}>
              <Paper 
                sx={{ 
                  p: 3, 
                  background: alpha('#111111', 0.7),
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                  Your Companies
                </Typography>
                <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                
                {companies.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No companies found
                  </Typography>
                ) : (
                  <List sx={{ '& .MuiListItemButton-root': { borderRadius: 1 } }}>
                    {companies.map((company) => (
                      <ListItem key={company.id} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                          selected={selectedCompany === company.id}
                          onClick={() => selectCompany(company.id)}
                          sx={{ 
                            borderRadius: 1,
                            '&.Mui-selected': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.15),
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.25),
                              }
                            },
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            }
                          }}
                        >
                          <ListItemText 
                            primary={company.name} 
                            secondary={`Added: ${new Date(company.created_at).toLocaleDateString()}`}
                            primaryTypographyProps={{ fontWeight: 500 }}
                            secondaryTypographyProps={{ fontSize: '0.75rem', sx: { opacity: 0.7 } }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>
            
            {/* Main Content */}
            <Grid item xs={12} md={9}>
              {selectedCompany ? (
                <>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      background: alpha('#111111', 0.7),
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {companies.find(c => c.id === selectedCompany)?.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1, opacity: 0.7 }}>
                      Onboarding Status
                    </Typography>
                  </Paper>
                  
                  <OnboardingProgress companyId={selectedCompany} />
                </>
              ) : (
                <Paper 
                  sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    background: alpha('#111111', 0.7),
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Select a company to view its onboarding status
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;
