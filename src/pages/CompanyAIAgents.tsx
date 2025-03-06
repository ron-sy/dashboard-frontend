import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert,
  alpha,
  useTheme,
  Chip,
  Grid,
  Card,
  CardContent,
  Stack,
  Tooltip,
  IconButton,
  Button
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InfoIcon from '@mui/icons-material/Info';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import LockIcon from '@mui/icons-material/Lock';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface AIAgent {
  name: string;
  purpose: string;
  status: 'deployed' | 'training' | 'deactivated';
  output: string;
  input: string;
  training_time: number;
}

// Mock data for the compute usage - in a real app, this would come from your backend
const getComputeData = () => {
  return Array.from({ length: 7 }, () => Math.floor(Math.random() * 80 + 20));
};

const ComputeBarGraph: React.FC = () => {
  const theme = useTheme();
  const data = getComputeData();
  const maxValue = Math.max(...data);
  
  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: 100,
      position: 'relative',
      mt: 1,
      mb: 1,
    }}>
      {/* Y-axis labels */}
      <Box sx={{ 
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 20,
        width: 25,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontSize: '10px',
        color: theme.palette.text.secondary,
      }}>
        <Typography variant="caption" sx={{ fontSize: '10px' }}>100%</Typography>
        <Typography variant="caption" sx={{ fontSize: '10px' }}>50%</Typography>
        <Typography variant="caption" sx={{ fontSize: '10px' }}>0%</Typography>
      </Box>

      {/* Graph area */}
      <Box sx={{ 
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: '80%',
        ml: 4,
        mr: 1,
        mb: 3,
        borderLeft: `1px solid ${alpha(theme.palette.text.secondary, 0.2)}`,
        borderBottom: `1px solid ${alpha(theme.palette.text.secondary, 0.2)}`,
        position: 'relative',
      }}>
        {data.map((value, index) => (
          <Tooltip 
            key={index} 
            title={`Day ${index + 1}: ${value}% compute usage`}
            placement="top"
          >
            <Box
              sx={{
                width: 8,
                height: `${(value / maxValue) * 100}%`,
                backgroundColor: alpha(theme.palette.primary.main, 0.7),
                borderRadius: '2px',
                transition: 'height 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: theme.palette.primary.main,
                }
              }}
            />
          </Tooltip>
        ))}
      </Box>

      {/* X-axis labels */}
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        pl: 4,
        pr: 1,
        color: theme.palette.text.secondary,
      }}>
        {[...Array(7)].map((_, index) => (
          <Typography 
            key={index} 
            variant="caption" 
            sx={{ 
              fontSize: '10px',
              width: 20,
              textAlign: 'center'
            }}
          >
            D{index + 1}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

const CompanyAIAgents: React.FC = () => {
  const theme = useTheme();
  const { companyId } = useParams();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aiagents, setAIAgents] = useState<AIAgent[]>([]);

  useEffect(() => {
    const fetchAIAgents = async () => {
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
          throw new Error('Failed to fetch AI agents');
        }
        
        const data = await response.json();
        setAIAgents(data.aiagents || []);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        console.error('Error fetching AI agents:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (companyId) {
      fetchAIAgents();
    }
  }, [companyId, getToken]);

  const getStatusStyle = (status: string) => {
    const baseStyle = {
      backgroundColor: alpha('#ffffff', 0.05),
      color: theme.palette.text.secondary,
      '&:hover': {
        backgroundColor: alpha('#ffffff', 0.1),
      }
    };

    switch (status) {
      case 'deployed':
        return {
          ...baseStyle,
          backgroundColor: alpha('#ffffff', 0.1),
          color: theme.palette.text.primary,
        };
      case 'training':
        return {
          ...baseStyle,
          backgroundColor: alpha('#ffffff', 0.08),
        };
      case 'deactivated':
        return {
          ...baseStyle,
          backgroundColor: alpha('#ffffff', 0.03),
          color: alpha(theme.palette.text.secondary, 0.7),
        };
      default:
        return baseStyle;
    }
  };

  const formatTrainingTime = (days: number) => {
    if (days < 1) return 'Less than a day';
    return `${days} day${days === 1 ? '' : 's'}`;
  };

  const getFileNameFromUrl = (url: string) => {
    try {
      const fileName = url.split('/').pop() || 'file';
      // Remove any query parameters
      return fileName.split('?')[0];
    } catch {
      return 'file';
    }
  };

  const FilePill: React.FC<{ url: string; label: string }> = ({ url, label }) => {
    const theme = useTheme();
    const fileName = getFileNameFromUrl(url);
    const isInput = label.toLowerCase() === 'input';
    
    return (
      <Box sx={{ flex: 1 }}>
        <Stack 
          direction="row" 
          spacing={0.5} 
          alignItems="center"
          sx={{ mb: 0.5 }}
        >
          {isInput ? (
            <FileUploadIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
          ) : (
            <FileDownloadIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
          )}
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ 
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: 500,
              fontSize: '0.65rem'
            }}
          >
            {label}
          </Typography>
        </Stack>
        <Button
          variant="text"
          onClick={() => window.open(url, '_blank')}
          sx={{
            width: '100%',
            justifyContent: 'flex-start',
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            color: theme.palette.primary.main,
            textTransform: 'none',
            py: 0.75,
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }
          }}
        >
          <Typography 
            noWrap 
            sx={{ 
              fontSize: '0.8rem',
              maxWidth: 'calc(100% - 24px)' // Space for the icon
            }}
          >
            {fileName}
          </Typography>
        </Button>
      </Box>
    );
  };

  const AgentCard: React.FC<{ agent: AIAgent }> = ({ agent }) => (
    <Box>
      <Card
        sx={{
          height: agent.status === 'training' ? 400 : 320,
          background: alpha('#111111', 0.7),
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
          }
        }}
      >
        <CardContent sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          pb: 3 // Increase bottom padding
        }}>
          <Stack spacing={2.5} sx={{ height: '100%' }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                {agent.name}
              </Typography>
              <Chip 
                label={agent.status}
                size="small"
                sx={getStatusStyle(agent.status)}
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
              {agent.purpose}
            </Typography>

            {agent.status === 'training' && (
              <Box sx={{ my: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="caption" color="text.secondary">
                    Compute Usage (Last 7 Days)
                  </Typography>
                  <Tooltip title="Daily compute resource utilization">
                    <InfoIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
                  </Tooltip>
                </Stack>
                <ComputeBarGraph />
              </Box>
            )}

            <Box sx={{ 
              position: 'relative',
              mt: 'auto', // Push to bottom
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '10%',
                height: 1,
                bgcolor: alpha(theme.palette.text.secondary, 0.1),
                transform: 'translate(-50%, -50%)'
              }
            }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <FilePill url={agent.input} label="Input" />
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  px: 1
                }}>
                  <ArrowForwardIcon 
                    sx={{ 
                      fontSize: 16, 
                      color: alpha(theme.palette.text.secondary, 0.3)
                    }} 
                  />
                </Box>
                <FilePill url={agent.output} label="Output" />
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
      {agent.status === 'training' && (
        <Stack 
          direction="row" 
          spacing={1} 
          alignItems="center" 
          sx={{ 
            mt: 1,
            pl: 1,
            opacity: 0.7,
            '&:hover': { opacity: 1 }
          }}
        >
          <AccessTimeIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
          <Typography variant="caption" color="text.secondary">
            {formatTrainingTime(agent.training_time)}
          </Typography>
        </Stack>
      )}
    </Box>
  );

  const NewAgentCard: React.FC = () => (
    <Tooltip title="Available in Pro" placement="top">
      <Card
        sx={{
          height: 300,
          background: alpha('#111111', 0.7),
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'not-allowed',
          position: 'relative',
          '&:hover': {
            '& .lock-icon': {
              opacity: 1,
            },
          },
        }}
      >
        <CardContent sx={{ textAlign: 'center' }}>
          <Stack spacing={3} alignItems="center">
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AddIcon sx={{ fontSize: 40, color: alpha(theme.palette.primary.main, 0.5) }} />
            </Box>
            <Typography variant="h6" color="text.secondary">
              Train New Agent
            </Typography>
            <LockIcon 
              className="lock-icon"
              sx={{ 
                position: 'absolute',
                top: 16,
                right: 16,
                opacity: 0,
                transition: 'opacity 0.2s',
                color: theme.palette.primary.main,
              }} 
            />
          </Stack>
        </CardContent>
      </Card>
    </Tooltip>
  );

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
      <Typography variant="h4" sx={{ mb: 3 }}>
        AI Agents
      </Typography>
      
      <Box sx={{ 
        maxWidth: { sm: '600px', lg: '1200px' }, 
        mx: 'auto',
        px: 2
      }}>
        <Grid container spacing={3} justifyContent="center">
          {aiagents.map((agent, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <AgentCard agent={agent} />
            </Grid>
          ))}
          <Grid item xs={12} sm={6} lg={3}>
            <NewAgentCard />
          </Grid>
          {aiagents.length === 0 && (
            <Grid item xs={12}>
              <Typography color="text.secondary" textAlign="center">
                No AI agents configured
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default CompanyAIAgents; 
