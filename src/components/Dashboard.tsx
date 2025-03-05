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
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAuth } from '../context/AuthContext';
import OnboardingProgress, { OnboardingStep } from './OnboardingProgress';
import DetailedOnboarding from './DetailedOnboarding';
import { useNavigate } from 'react-router-dom';
import SideMenu from './SideMenu';

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
  const [onboardingProgress, setOnboardingProgress] = useState(0);
  const [selectedPhaseName, setSelectedPhaseName] = useState<string | null>(null);
  const [selectedPhaseSteps, setSelectedPhaseSteps] = useState<OnboardingStep[]>([]);
  
  const { currentUser, getToken, isAdmin } = useAuth();
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
  
  // Add new useEffect for fetching onboarding progress
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
  
  const navigateToAdmin = () => {
    navigate('/admin');
  };
  
  const selectCompany = (companyId: string) => {
    setSelectedCompany(companyId);
  };
  
  const handlePhaseSelect = (phaseName: string, phaseSteps: OnboardingStep[]) => {
    console.log('Dashboard handling phase select:', phaseName);
    console.log('Dashboard received new steps:', JSON.stringify(phaseSteps, null, 2));
    
    // Check for steps with doneText
    const stepsWithDoneText = phaseSteps.filter(step => step.doneText);
    console.log('Steps with doneText in Dashboard:', JSON.stringify(stepsWithDoneText, null, 2));
    
    // Clear previous steps and set the new ones
    setSelectedPhaseName(phaseName);
    setSelectedPhaseSteps([]); // First clear the steps completely
    
    // Use setTimeout to ensure the state update has been processed
    setTimeout(() => {
      // Create a deep copy of the steps to ensure all properties are preserved
      const deepCopySteps = phaseSteps.map(step => ({...step}));
      console.log('Deep copy of steps before setting state:', JSON.stringify(deepCopySteps, null, 2));
      setSelectedPhaseSteps(deepCopySteps); // Then set the new steps
    }, 0);
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
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* Add spacing for fixed AppBar */}
      <Box sx={{ display: 'flex' }}>
        <SideMenu onboardingProgress={onboardingProgress} companies={companies} />
        
        <Box sx={{ flexGrow: 1 }}>
          <Container maxWidth="lg" sx={{ mt: 6, position: 'relative', zIndex: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}
            
            {loading ? (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                minHeight: '50vh'
              }}>
                <CircularProgress size={24} sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
              </Box>
            ) : (
              <Grid container spacing={3}>
                {/* Main Content */}
                <Grid item xs={12}>
                  {selectedCompany ? (
                    <>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontSize: '0.7rem',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: 'white',
                          mb: 0.2
                        }}
                      >
                        Synthetic Essentials
                      </Typography>
                      <Typography 
                        variant="h5" 
                        sx={{ fontWeight: 600, mb: 3 }}
                      >
                        Set up {companies.find(c => c.id === selectedCompany)?.name} on Synthetic Teams
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 3 }}>
                        <Paper 
                          sx={{ 
                            p: 3,
                            width: '35%',
                            minHeight: '50vh',
                            background: alpha('#111111', 0.7),
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 2,
                            '& .MuiTypography-h6': {
                              fontSize: '14px',
                              fontWeight: 500,
                              mb: 0.5
                            },
                            '& .MuiTypography-body2': {
                              fontSize: '12px',
                              color: 'text.secondary'
                            }
                          }}
                        >
                          {selectedCompany && (
                            <OnboardingProgress 
                              companyId={selectedCompany} 
                              onPhaseSelect={handlePhaseSelect}
                            />
                          )}
                        </Paper>

                        <Box sx={{ 
                          flex: 1,
                          minHeight: '50vh',
                        }}>
                          <DetailedOnboarding
                            key={selectedPhaseName}
                            selectedPhase={selectedPhaseName}
                            steps={selectedPhaseSteps}
                          />
                        </Box>
                      </Box>
                    </>
                  ) : (
                    <Paper 
                      sx={{ 
                        p: 3, 
                        textAlign: 'center',
                        background: alpha('#111111', 0.7),
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        No company selected
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Please select a company from the list to view its dashboard
                      </Typography>
                    </Paper>
                  )}
                </Grid>
              </Grid>
            )}
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
