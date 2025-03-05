import React from 'react';
import { 
  Box, 
  Typography, 
  Button,
  alpha,
  Chip,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LaunchIcon from '@mui/icons-material/Launch';

interface OnboardingStep {
  id: string;
  name: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done' | 'skipped';
  updated_at: string;
  donelink?: string | null;
  clickable?: boolean;
}

interface DetailedOnboardingProps {
  selectedPhase: string | null;
  steps: OnboardingStep[];
}

const DetailedOnboarding: React.FC<DetailedOnboardingProps> = ({ selectedPhase, steps }) => {
  // Add key change detection
  React.useEffect(() => {
    console.log('DetailedOnboarding received new phase:', selectedPhase);
    console.log('DetailedOnboarding received steps:', steps);
  }, [selectedPhase, steps]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckIcon sx={{ fontSize: 20, color: '#4CAF50' }} />;
      case 'in_progress':
        return <AccessTimeIcon sx={{ fontSize: 20, color: 'white' }} />;
      default:
        return <RadioButtonUncheckedIcon sx={{ fontSize: 20, color: 'rgba(255, 255, 255, 0.3)' }} />;
    }
  };

  const getDoneLink = (step: OnboardingStep) => {
    // Debug log to verify the data
    console.log('Step donelink data:', { donelink: step.donelink, clickable: step.clickable });

    if (!step.donelink) return null;

    if (step.clickable) {
      return (
        <Button
          variant="outlined"
          size="small"
          component="a"
          href={step.donelink}
          target="_blank"
          rel="noopener noreferrer"
          endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
          onClick={(e) => {
            e.preventDefault();
            window.open(step.donelink as string, '_blank');
          }}
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            textDecoration: 'none',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              textDecoration: 'none'
            }
          }}
        >
          {step.donelink}
        </Button>
      );
    }

    return (
      <Chip
        label={step.donelink}
        size="small"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: 'rgba(255, 255, 255, 0.7)',
          height: '24px'
        }}
      />
    );
  };

  const getActionButton = (step: OnboardingStep) => {
    switch (step.status) {
      case 'done':
        // For done steps with a donelink that is clickable, show a "View" button
        if (step.donelink && step.clickable) {
          return (
            <Button
              variant="contained"
              endIcon={<LaunchIcon />}
              onClick={() => window.open(step.donelink as string, '_blank')}
              sx={{
                backgroundColor: alpha('#4CAF50', 0.2),
                color: '#4CAF50',
                '&:hover': {
                  backgroundColor: alpha('#4CAF50', 0.3),
                }
              }}
            >
              View
            </Button>
          );
        }
        return null;
      case 'in_progress':
        return (
          <Button
            variant="contained"
            sx={{
              backgroundColor: alpha('#000000', 0.3),
              color: 'white',
              '&:hover': {
                backgroundColor: alpha('#000000', 0.4),
              }
            }}
          >
            Continue
          </Button>
        );
      case 'skipped':
        return (
          <Button
            variant="contained"
            sx={{
              backgroundColor: alpha('#000000', 0.3),
              color: 'white',
              '&:hover': {
                backgroundColor: alpha('#000000', 0.4),
              }
            }}
          >
            Get started
          </Button>
        );
      default:
        return (
          <Button
            variant="contained"
            sx={{
              backgroundColor: alpha('#000000', 0.3),
              color: 'white',
              '&:hover': {
                backgroundColor: alpha('#000000', 0.4),
              }
            }}
          >
            Get started
          </Button>
        );
    }
  };

  // Debug log to verify the steps data
  console.log('Received steps:', steps);

  if (!selectedPhase || steps.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%',
        color: 'rgba(255, 255, 255, 0.5)'
      }}>
        <Typography>Select a phase to view details</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5" sx={{ mb: 2, color: 'white' }}>
        {selectedPhase}
      </Typography>
      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
        Link your card to a bank account so you can make your first purchase or payment.
      </Typography>

      {steps.map((step) => {
        // Debug log for each step
        console.log('Rendering step:', step);
        
        return (
          <Box
            key={step.id}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: '#111111',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: step.donelink && !step.clickable ? 2 : 0 }}>
              {getStatusIcon(step.status)}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontSize: '18px', color: 'white', mb: 1 }}>
                  {step.name}
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                  {step.description}
                </Typography>
              </Box>
              {getActionButton(step)}
            </Box>
            {step.donelink && !step.clickable && (
              <Box sx={{ ml: 5, mt: 2 }}>
                {getDoneLink(step)}
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default DetailedOnboarding; 