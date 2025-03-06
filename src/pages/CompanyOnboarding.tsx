import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  alpha,
  useTheme,
  Chip
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface OnboardingStep {
  id: string;
  name: string;
  description: string;
  status: 'todo' | 'done';
  updated_at: string;
}

const CompanyOnboarding: React.FC = () => {
  const theme = useTheme();
  const { companyId } = useParams();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>([]);

  useEffect(() => {
    const fetchOnboardingSteps = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        
        if (!token) {
          throw new Error('Authentication required');
        }
        
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/companies/${companyId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch onboarding steps');
        }
        
        const data = await response.json();
        setOnboardingSteps(data.onboarding_steps || []);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        console.error('Error fetching onboarding steps:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (companyId) {
      fetchOnboardingSteps();
    }
  }, [companyId, getToken]);

  const calculateProgress = () => {
    if (onboardingSteps.length === 0) return 0;
    const completedSteps = onboardingSteps.filter(step => step.status === 'done').length;
    return Math.round((completedSteps / onboardingSteps.length) * 100);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Onboarding Progress
        </Typography>
        <Chip 
          label={`${calculateProgress()}% Complete`}
          color={calculateProgress() === 100 ? 'success' : 'primary'}
        />
      </Box>
      
      <Paper 
        sx={{ 
          p: 3,
          background: alpha('#111111', 0.7),
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}
      >
        <Stepper orientation="vertical">
          {onboardingSteps.map((step) => (
            <Step key={step.id} active={true} completed={step.status === 'done'}>
              <StepLabel>
                <Typography variant="subtitle1">
                  {step.name}
                </Typography>
              </StepLabel>
              <StepContent>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </Box>
                <Box sx={{ mt: 1 }}>
                  <Chip 
                    label={step.status === 'done' ? 'Completed' : 'Pending'}
                    color={step.status === 'done' ? 'success' : 'default'}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip 
                    label={`Last Updated: ${new Date(step.updated_at).toLocaleDateString()}`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>
    </Box>
  );
};

export default CompanyOnboarding; 