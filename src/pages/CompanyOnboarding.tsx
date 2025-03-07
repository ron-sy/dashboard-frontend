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
  Chip,
  Button
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnimatedGradientButton from '../components/AnimatedGradientButton';

interface OnboardingStep {
  id: string;
  name: string;
  description: string;
  status: 'todo' | 'done';
  updated_at: string;
  todoLink?: string;
  buttonText?: string;
}

const CompanyOnboarding: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
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
        
        // Get all onboarding steps from Firestore subcollection
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/companies/${companyId}/onboarding`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch onboarding steps');
        }
        
        const data = await response.json();
        console.log('Onboarding steps data:', data); // Debug log
        
        // Transform the data into array format with IDs
        const steps = Object.entries(data).map(([id, stepData]: [string, any]) => ({
          id,
          ...stepData
        }));
        
        // First sort by status (done first, then todo)
        // Then sort by pre-defined order
        const stepOrder = ['setup_account', 'process_payment', 'data_integration', 'refer_friend', 'ai_agents', 'training_session', 'performance_review'];
        
        const sortedSteps = steps.sort((a, b) => {
          // If one has status 'done' and the other doesn't, 'done' comes first
          if (a.status === 'done' && b.status !== 'done') return -1;
          if (a.status !== 'done' && b.status === 'done') return 1;
          
          // Then sort by predefined order
          const aIndex = stepOrder.indexOf(a.id);
          const bIndex = stepOrder.indexOf(b.id);
          
          // If both are in the order array, sort by index
          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
          }
          
          // If only one is in the order array, it comes first
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;
          
          // If neither is in the order array, sort by name
          return a.name.localeCompare(b.name);
        });
        
        console.log('Transformed and sorted steps:', sortedSteps);
        setOnboardingSteps(sortedSteps);
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

  const handleStepAction = (step: OnboardingStep) => {
    console.log('Navigating to:', step.todoLink); // Debug log
    
    if (step.todoLink) {
      // Check if it's an external URL (starts with http:// or https://)
      if (step.todoLink.startsWith('http://') || step.todoLink.startsWith('https://')) {
        // Open external links in a new tab
        window.open(step.todoLink, '_blank');
      } else {
        // Use navigate for internal routes
        navigate(step.todoLink);
      }
    }
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

  if (onboardingSteps.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No onboarding steps found for this company.
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ flexGrow: 1, color: 'white' }}>
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
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  width: '100%',
                  pr: 2 // Add padding to prevent button from touching the edge
                }}>
                  <Typography variant="subtitle1" sx={{ color: 'white' }}>
                    {step.name}
                  </Typography>
                  {step.todoLink && step.buttonText && (
                    <Box sx={{ minWidth: 150 }}>
                      <AnimatedGradientButton
                        onClick={() => handleStepAction(step)}
                      >
                        {step.buttonText}
                      </AnimatedGradientButton>
                    </Box>
                  )}
                </Box>
              </StepLabel>
              <StepContent>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </Box>
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip 
                    label={step.status === 'done' ? 'Completed' : 'Pending'}
                    color={step.status === 'done' ? 'success' : 'default'}
                    size="small"
                  />
                  {step.updated_at && (
                    <Chip 
                      label={`Last Updated: ${new Date(step.updated_at).toLocaleDateString()}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
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