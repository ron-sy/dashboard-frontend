import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress,
  Alert,
  useTheme,
  Chip,
  LinearProgress,
  Button,
  Collapse,
  alpha,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { useAuth } from '../context/AuthContext';

export interface OnboardingStep {
  id: string;
  name: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done' | 'skipped';
  updated_at: string;
  donelink?: string | null;
  clickable?: boolean;
  doneText?: string;
}

// Company response from API with admin flag
interface Company {
  id: string;
  name: string;
  onboarding_steps: OnboardingStep[];
  user_ids: string[];
  created_at: string;
  user_is_admin: boolean;
}

interface OnboardingPhase {
  name: string;
  progress: number;
  steps: OnboardingStep[];
  status: 'todo' | 'in_progress' | 'done' | 'skipped';
}

interface OnboardingProgressProps {
  companyId: string;
  onPhaseSelect: (phaseName: string, steps: OnboardingStep[]) => void;
}

const OnboardingProgress: React.FC<OnboardingProgressProps> = ({ companyId, onPhaseSelect }) => {
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<number | null>(0);
  const [expandedPhases, setExpandedPhases] = useState<number[]>([0]);
  const { getToken } = useAuth();
  const theme = useTheme();
  
  // Fetch onboarding steps from API
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        
        if (!token) {
          throw new Error('Authentication required');
        }
        
        // We now fetch the entire company to get both steps and admin status
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/companies/${companyId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch company details');
        }
        
        const companyData: Company = await response.json();
        
        // Debug log to check if doneText is present in the API response
        console.log('API response company data:', JSON.stringify(companyData, null, 2));
        
        // Check for steps with doneText in the API response
        const stepsWithDoneText = companyData.onboarding_steps.filter(step => step.doneText);
        console.log('Steps with doneText in API response:', JSON.stringify(stepsWithDoneText, null, 2));
        
        setSteps(companyData.onboarding_steps);
        
        console.log(`User is${!companyData.user_is_admin ? ' not' : ''} an admin for this company`);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompany();
  }, [companyId, getToken]);
  
  // Get status icon based on step status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.9)' }} />;
      case 'in_progress':
        return <AccessTimeIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.9)' }} />;
      default:
        return <RadioButtonUncheckedIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.3)' }} />;
    }
  };
  
  // Get phase completion status icon
  const getPhaseStatusIcon = (steps: OnboardingStep[]) => {
    const allDone = steps.every(step => step.status === 'done');
    const anyInProgress = steps.some(step => step.status === 'in_progress');
    const allTodo = steps.every(step => step.status === 'todo');

    if (allDone) return <CheckIcon sx={{ fontSize: 20, color: 'rgba(255, 255, 255, 0.9)' }} />;
    if (anyInProgress) return <AccessTimeIcon sx={{ fontSize: 20, color: 'rgba(255, 255, 255, 0.9)' }} />;
    if (allTodo) return <RadioButtonUncheckedIcon sx={{ fontSize: 20, color: 'rgba(255, 255, 255, 0.3)' }} />;
  };
  
  // Group steps into phases
  const groupStepsByPhase = () => {
    const totalSteps = steps.length;
    if (totalSteps === 0) return [];
    
    const stepsPerPhase = Math.ceil(totalSteps / 4);
    
    const calculatePhaseStatus = (phaseSteps: OnboardingStep[]): 'todo' | 'in_progress' | 'done' | 'skipped' => {
      const allDone = phaseSteps.every(step => step.status === 'done');
      const anyInProgress = phaseSteps.some(step => step.status === 'in_progress');
      const allSkipped = phaseSteps.every(step => step.status === 'skipped');
      
      if (allDone) return 'done';
      if (anyInProgress) return 'in_progress';
      if (allSkipped) return 'skipped';
      return 'todo';
    };

    const calculateProgress = (phaseSteps: OnboardingStep[]): number => {
      if (phaseSteps.length === 0) return 0;
      const completedSteps = phaseSteps.filter(step => step.status === 'done').length;
      return (completedSteps / phaseSteps.length) * 100;
    };
    
    // Create non-overlapping slices of steps for each phase
    const phase1Steps = steps.slice(0, stepsPerPhase);
    const phase2Steps = steps.slice(stepsPerPhase, stepsPerPhase * 2);
    const phase3Steps = steps.slice(stepsPerPhase * 2, stepsPerPhase * 3);
    const phase4Steps = steps.slice(stepsPerPhase * 3);
    
    return [
      {
        name: "Setup & Onboarding",
        steps: phase1Steps,
        progress: calculateProgress(phase1Steps),
        status: calculatePhaseStatus(phase1Steps)
      },
      {
        name: "Goals & Integration",
        steps: phase2Steps,
        progress: calculateProgress(phase2Steps),
        status: calculatePhaseStatus(phase2Steps)
      },
      {
        name: "Training & Deployment",
        steps: phase3Steps,
        progress: calculateProgress(phase3Steps),
        status: calculatePhaseStatus(phase3Steps)
      },
      {
        name: "Optimization & Support",
        steps: phase4Steps,
        progress: calculateProgress(phase4Steps),
        status: calculatePhaseStatus(phase4Steps)
      }
    ];
  };
  
  const phases = groupStepsByPhase();

  // Select first phase by default
  useEffect(() => {
    if (phases.length > 0 && !loading && !error) {
      onPhaseSelect(phases[0].name, phases[0].steps);
    }
  }, [loading, error]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '200px'
      }}>
        <CircularProgress size={24} sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
        {error}
      </Alert>
    );
  }

  const handlePhaseClick = (phase: OnboardingPhase, phaseIndex: number) => {
    // Toggle expansion
    setExpandedPhases(prev => {
      if (prev.includes(phaseIndex)) {
        return prev.filter(p => p !== phaseIndex);
      } else {
        return [...prev, phaseIndex];
      }
    });
    
    // Set selected phase
    setSelectedPhase(phaseIndex);
    
    // Debug log to check if doneText is present in the steps
    console.log('Phase steps before passing to parent:', JSON.stringify(phase.steps, null, 2));
    
    // Check for steps with doneText
    const stepsWithDoneText = phase.steps.filter(step => step.doneText);
    console.log('Steps with doneText before passing to parent:', JSON.stringify(stepsWithDoneText, null, 2));
    
    // Make a clean copy of the phase steps to avoid reference issues
    const cleanPhaseSteps = [...phase.steps];
    
    if (onPhaseSelect) {
      // Pass a clean copy of the steps to avoid state issues
      onPhaseSelect(phase.name, cleanPhaseSteps);
    }
  };

  return (
    <Box sx={{ mt: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
      {phases.map((phase, phaseIndex) => {
        const isSelected = selectedPhase === phaseIndex;
        const isExpanded = expandedPhases.includes(phaseIndex);
        const completedSteps = phase.steps.filter(s => s.status === 'done').length;
        const hasSkipped = phase.steps.some(step => step.status === 'skipped');

        return (
          <Box
            key={phaseIndex}
            onClick={() => handlePhaseClick(phase, phaseIndex)}
            sx={{
              p: 2.5,
              borderRadius: 2,
              backgroundColor: isSelected ? alpha('#1E88E5', 0.1) : '#111111',
              border: isSelected ? '1px solid #1E88E5' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: isSelected ? alpha('#1E88E5', 0.15) : '#161616'
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {phase.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {completedSteps} of {phase.steps.length} steps complete
                  {hasSkipped && ' (some steps skipped)'}
                </Typography>
              </Box>
              <Box
                sx={{
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease-in-out'
                }}
              >
                <ExpandMoreIcon />
              </Box>
            </Box>
            
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ mt: 2 }}>
                {phase.steps.map((step, stepIndex) => (
                  <Box
                    key={stepIndex}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      py: 1,
                      '&:not(:last-child)': {
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: step.status === 'done' 
                          ? '#4CAF50'
                          : step.status === 'skipped'
                          ? '#FF9800'
                          : 'transparent',
                        border: step.status === 'todo' ? '2px solid rgba(255, 255, 255, 0.3)' : 'none',
                        mr: 2
                      }}
                    >
                      {step.status === 'done' && <CheckIcon sx={{ fontSize: 14, color: 'white' }} />}
                      {step.status === 'skipped' && <SkipNextIcon sx={{ fontSize: 14, color: 'white' }} />}
                    </Box>
                    <Typography variant="body2">
                      {step.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Collapse>
          </Box>
        );
      })}
    </Box>
  );
};

export default OnboardingProgress;
