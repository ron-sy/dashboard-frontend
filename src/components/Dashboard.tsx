import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  CircularProgress, 
  Alert, 
  Grid,
  alpha,
  useTheme
} from '@mui/material';
import OnboardingProgress, { OnboardingStep } from './OnboardingProgress';
import DetailedOnboarding from './DetailedOnboarding';
import { useOutletContext } from 'react-router-dom';

interface Company {
  id: string;
  name: string;
  created_at: string;
}

interface DashboardContext {
  companies: Company[];
  loading: boolean;
  error: string;
  selectedCompany: string | null;
  setSelectedCompany: (id: string | null) => void;
}

const Dashboard: React.FC = () => {
  const [selectedPhaseName, setSelectedPhaseName] = useState<string | null>(null);
  const [selectedPhaseSteps, setSelectedPhaseSteps] = useState<OnboardingStep[]>([]);
  
  const { companies, loading, error, selectedCompany } = useOutletContext<DashboardContext>();
  const theme = useTheme();

  const handlePhaseSelect = (phaseName: string, steps: OnboardingStep[]) => {
    setSelectedPhaseName(phaseName);
    setSelectedPhaseSteps(steps);
  };

  return (
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
          {selectedCompany ? (
            <>
              <Box sx={{ width: '100%', mb: 3 }}>
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
                  sx={{ fontWeight: 600 }}
                >
                  Set up {companies.find(c => c.id === selectedCompany)?.name} on Synthetic Teams
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 3, width: '100%' }}>
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
      )}
    </Container>
  );
};

export default Dashboard;
