import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  alpha,
  useTheme,
  Grid,
  Chip,
  Tooltip,
  Button,
  Divider,
  LinearProgress
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PendingIcon from '@mui/icons-material/Pending';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useAuth } from '../context/AuthContext';

// Define the structure of an onboarding step
interface OnboardingStep {
  id: string;
  name: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  updated_at: string;
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

interface OnboardingProgressProps {
  companyId: string;
}

const OnboardingProgress: React.FC<OnboardingProgressProps> = ({ companyId }) => {
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
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
        setSteps(companyData.onboarding_steps);
        setIsUserAdmin(companyData.user_is_admin);
        
        console.log(`User is${!companyData.user_is_admin ? ' not' : ''} an admin for this company`);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompany();
  }, [companyId, getToken]);
  
  // Update the status of an onboarding step
  const updateStepStatus = async (stepId: string, newStatus: 'todo' | 'in_progress' | 'done') => {
    try {
      // Only admins can update step status
      if (!isUserAdmin) {
        setError('Only administrators can update step status');
        return;
      }
      
      setUpdating(stepId);
      const token = await getToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/companies/${companyId}/onboarding/${stepId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        // Try to parse error message from response
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update onboarding step');
      }
      
      const updatedStep = await response.json();
      
      // Update the steps array with the new status
      setSteps(steps.map(step => 
        step.id === stepId ? { ...step, status: newStatus } : step
      ));
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setUpdating(null);
    }
  };
  
  const handleStatusChange = (event: SelectChangeEvent, stepId: string) => {
    const newStatus = event.target.value as 'todo' | 'in_progress' | 'done';
    updateStepStatus(stepId, newStatus);
  };
  
  // Get status icon based on step status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 24 }} />;
      case 'in_progress':
        return <PendingIcon sx={{ color: '#FFC107', fontSize: 24 }} />;
      default:
        return <RadioButtonUncheckedIcon sx={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: 24 }} />;
    }
  };
  
  // Get text representation of status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'done':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'To Do';
    }
  };

  // Get color for status badge
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return '#4CAF50';
      case 'in_progress':
        return '#FFC107';
      default:
        return 'rgba(255, 255, 255, 0.2)';
    }
  };

  // Calculate overall progress percentage
  const calculateProgress = () => {
    if (!steps.length) return 0;
    const completed = steps.filter(step => step.status === 'done').length;
    const inProgress = steps.filter(step => step.status === 'in_progress').length;
    
    // Count in-progress steps as half complete
    return Math.round(((completed + (inProgress * 0.5)) / steps.length) * 100);
  };

  // Group steps into phases
  const groupStepsByPhase = () => {
    // This is a simplified grouping - in a real app, you might have phase data from the backend
    const totalSteps = steps.length;
    if (totalSteps === 0) return [];
    
    const stepsPerPhase = Math.ceil(totalSteps / 4); // Divide into 4 phases
    
    return [
      {
        name: "Setup & Onboarding",
        steps: steps.slice(0, stepsPerPhase)
      },
      {
        name: "Integration & Training",
        steps: steps.slice(stepsPerPhase, stepsPerPhase * 2)
      },
      {
        name: "Deployment & Feedback",
        steps: steps.slice(stepsPerPhase * 2, stepsPerPhase * 3)
      },
      {
        name: "Optimization & Support",
        steps: steps.slice(stepsPerPhase * 3)
      }
    ];
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
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

  const progress = calculateProgress();
  const phases = groupStepsByPhase();
  
  return (
    <Box sx={{ mt: 3 }}>
      {/* Overall Progress Card */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 3,
          background: alpha('#111111', 0.7),
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: 3
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Onboarding Progress
          </Typography>
          <Chip 
            label={`${progress}% Complete`} 
            sx={{ 
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
              color: theme.palette.primary.main,
              fontWeight: 600,
              borderRadius: 2,
              px: 1
            }} 
          />
        </Box>
        
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 10, 
            borderRadius: 5,
            mb: 2,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            '& .MuiLinearProgress-bar': {
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
              borderRadius: 5
            }
          }} 
        />
        
        {!isUserAdmin && (
          <Alert 
            severity="info" 
            sx={{ 
              mt: 2,
              borderRadius: 2,
              background: alpha(theme.palette.primary.main, 0.1),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
            }}
          >
            You are viewing this in read-only mode. Only administrators can update the status of onboarding steps.
          </Alert>
        )}
      </Paper>
      
      {/* Phase-based Steps Display */}
      {phases.map((phase, phaseIndex) => (
        <Paper 
          key={`phase-${phaseIndex}`}
          elevation={3} 
          sx={{ 
            p: 3, 
            mb: 3,
            background: alpha('#111111', 0.7),
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: 3
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 3, 
              fontWeight: 600,
              color: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Box 
              sx={{ 
                width: 30, 
                height: 30, 
                borderRadius: '50%', 
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                fontWeight: 700
              }}
            >
              {phaseIndex + 1}
            </Box>
            {phase.name}
          </Typography>
          
          <Grid container spacing={2}>
            {phase.steps.map((step) => (
              <Grid item xs={12} key={step.id}>
                <Box 
                  sx={{ 
                    p: 3, 
                    borderRadius: 2,
                    border: `1px solid ${alpha(getStatusColor(step.status), 0.3)}`,
                    backgroundColor: alpha(getStatusColor(step.status), 0.05),
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ mr: 2, mt: 0.5 }}>
                      {getStatusIcon(step.status)}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {step.name}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                        {step.description}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ ml: 2 }}>
                      {isUserAdmin ? (
                        <FormControl 
                          size="small" 
                          sx={{ 
                            minWidth: 150,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: alpha('#000000', 0.2)
                            }
                          }}
                        >
                          <Select
                            value={step.status}
                            onChange={(e) => handleStatusChange(e, step.id)}
                            disabled={updating === step.id}
                            displayEmpty
                            renderValue={(value) => (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box 
                                  sx={{ 
                                    width: 8, 
                                    height: 8, 
                                    borderRadius: '50%', 
                                    backgroundColor: getStatusColor(value as string),
                                    mr: 1 
                                  }} 
                                />
                                {getStatusText(value as string)}
                              </Box>
                            )}
                          >
                            <MenuItem value="todo">To Do</MenuItem>
                            <MenuItem value="in_progress">In Progress</MenuItem>
                            <MenuItem value="done">Completed</MenuItem>
                          </Select>
                          {updating === step.id && (
                            <CircularProgress size={16} sx={{ ml: 1, position: 'absolute', right: -24, top: 8 }} />
                          )}
                        </FormControl>
                      ) : (
                        <Chip 
                          size="medium"
                          label={getStatusText(step.status)} 
                          sx={{ 
                            backgroundColor: alpha(getStatusColor(step.status), 0.2),
                            color: getStatusColor(step.status),
                            fontWeight: 500,
                            borderRadius: 1,
                            px: 1
                          }} 
                        />
                      )}
                    </Box>
                  </Box>
                  
                  <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      Updated: {new Date(step.updated_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      ))}
      
      {/* Summary Card */}
      {steps.length > 0 && (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3,
            background: alpha('#111111', 0.7),
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            Onboarding Summary
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mr: 3 
              }}
            >
              <Box 
                sx={{ 
                  width: 10, 
                  height: 10, 
                  borderRadius: '50%', 
                  backgroundColor: '#4CAF50',
                  mr: 1 
                }} 
              />
              <Typography variant="body2">
                {steps.filter(s => s.status === 'done').length} Completed
              </Typography>
            </Box>
            
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mr: 3 
              }}
            >
              <Box 
                sx={{ 
                  width: 10, 
                  height: 10, 
                  borderRadius: '50%', 
                  backgroundColor: '#FFC107',
                  mr: 1 
                }} 
              />
              <Typography variant="body2">
                {steps.filter(s => s.status === 'in_progress').length} In Progress
              </Typography>
            </Box>
            
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center' 
              }}
            >
              <Box 
                sx={{ 
                  width: 10, 
                  height: 10, 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  mr: 1 
                }} 
              />
              <Typography variant="body2">
                {steps.filter(s => s.status === 'todo').length} To Do
              </Typography>
            </Box>
          </Box>
          
          {progress >= 50 && (
            <Box 
              sx={{ 
                mt: 2, 
                p: 2, 
                borderRadius: 2, 
                backgroundColor: alpha('#4CAF50', 0.1),
                border: '1px solid rgba(76, 175, 80, 0.2)',
                maxWidth: 500
              }}
            >
              <Typography variant="body2" sx={{ color: '#4CAF50' }}>
                {progress === 100 
                  ? "Congratulations! You've completed all onboarding steps." 
                  : "You're making great progress! Continue working through the remaining steps."}
              </Typography>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default OnboardingProgress;
