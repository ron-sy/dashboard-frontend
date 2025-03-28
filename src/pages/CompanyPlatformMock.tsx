import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  alpha,
  useTheme,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LockIcon from '@mui/icons-material/Lock';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ChatIcon from '@mui/icons-material/Chat';
import AddIcon from '@mui/icons-material/Add';
import ParticleField from '../components/ParticleField';

const CompanyPlatformMock: React.FC = () => {
  const theme = useTheme();
  const { companyId } = useParams();
  const { getToken } = useAuth();

  // Mock chat history data
  const mockChats = [
    { title: "Team Productivity Analysis", date: "1h ago", active: true },
    { title: "Q3 Sales Strategy", date: "2d ago", active: false },
    { title: "Marketing Campaign Ideas", date: "1w ago", active: false },
    { title: "Competitor Research", date: "2w ago", active: false },
    { title: "HR Policy Updates", date: "3w ago", active: false },
  ];

  // Gradient background inspired by ChatGPT's interface
  const chatGptGradient = `
    radial-gradient(circle at 30% 107%, 
      rgba(66, 103, 212, 0.2) 0%, 
      rgba(87, 154, 237, 0.2) 5%, 
      rgba(106, 102, 197, 0.2) 45%,
      rgba(76, 99, 242, 0.2) 60%,
      rgba(6, 63, 159, 0.2) 90%)
  `;

  return (
    <Box 
      sx={{ 
        position: 'relative', 
        height: '100%', 
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
      }}
    >
      {/* ChatGPT-like gradient background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: chatGptGradient,
          zIndex: -1
        }}
      />
      
      {/* Particle effect in background */}
      <ParticleField particleCount={100} noGoZone={true} />
      
      {/* Mock Chat Interface (Blurred/Blocked) */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          zIndex: 0,
          opacity: 0.4,
          filter: 'blur(3px)',
          pointerEvents: 'none'
        }}
      >
        {/* Sidebar with chat history */}
        <Box
          sx={{
            width: '260px',
            height: '100%',
            backgroundColor: alpha('#0F0F0F', 0.7),
            backdropFilter: 'blur(10px)',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* New Chat Button */}
          <Box sx={{ p: 2 }}>
            <Button 
              variant="outlined" 
              fullWidth 
              startIcon={<AddIcon />}
              sx={{ 
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                justifyContent: 'flex-start',
                textTransform: 'none',
                py: 1
              }}
            >
              New chat
            </Button>
          </Box>
          
          {/* Chat History */}
          <List sx={{ pt: 0 }}>
            {mockChats.map((chat, index) => (
              <React.Fragment key={index}>
                <ListItemButton
                  sx={{ 
                    py: 1.5,
                    backgroundColor: chat.active ? alpha(theme.palette.primary.main, 0.1) : 'transparent'
                  }}
                >
                  <ListItemText 
                    primary={chat.title} 
                    secondary={chat.date}
                    primaryTypographyProps={{ 
                      noWrap: true,
                      fontSize: '0.9rem',
                      fontWeight: chat.active ? 600 : 400
                    }}
                    secondaryTypographyProps={{ 
                      noWrap: true,
                      fontSize: '0.75rem',
                      color: 'rgba(255, 255, 255, 0.5)'
                    }}
                  />
                </ListItemButton>
                {index < mockChats.length - 1 && (
                  <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }} />
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>
        
        {/* Main Chat Area */}
        <Box 
          sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          {/* Message Area */}
          <Box 
            sx={{ 
              flex: 1, 
              p: 3, 
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              overflowY: 'hidden'
            }}
          >
            {/* Title */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Team Productivity Analysis
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Started 1 hour ago
              </Typography>
            </Box>
            
            {/* User Message */}
            <Box sx={{ alignSelf: 'flex-end', maxWidth: '70%' }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <Typography variant="body2">How can Synthetic Teams help our organization improve team productivity?</Typography>
              </Paper>
            </Box>
            
            {/* AI Response */}
            <Box sx={{ alignSelf: 'flex-start', maxWidth: '70%' }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: alpha('#111111', 0.6),
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <Typography variant="body2">
                  Synthetic Teams provides powerful AI solutions tailored specifically for your team's productivity needs. We analyze workflow patterns, identify bottlenecks, and suggest optimizations...
                </Typography>
              </Paper>
            </Box>
          </Box>
          
          {/* Enhanced Input Box */}
          <Box 
            sx={{ 
              p: 3, 
              display: 'flex',
              justifyContent: 'center',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: alpha('#111111', 0.6),
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                width: '100%',
                maxWidth: '800px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Message Synthetic Teams...
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  size="small" 
                  variant="text" 
                  sx={{ 
                    minWidth: 'auto', 
                    color: 'rgba(255, 255, 255, 0.3)',
                    '&:hover': { color: 'rgba(255, 255, 255, 0.5)' }
                  }}
                >
                  <ChatIcon fontSize="small" />
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Centered Popup Box */}
      <Paper
        elevation={4}
        sx={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '450px',
          width: '90%',
          p: 4,
          borderRadius: 3,
          backgroundColor: alpha('#111111', 0.85),
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 161, 255, 0.2)',
          textAlign: 'center',
          my: 4
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
          Platform Ready
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.7)' }}>
          Your AI-powered platform is ready. Meet your AI agents and start exploring the future of team collaboration.
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          fullWidth
          endIcon={<OpenInNewIcon />}
          onClick={() => window.open('https://st-platform.vercel.app/maven', '_blank')}
          sx={{
            py: 1.5,
            background: 'linear-gradient(90deg, #0088FF 0%, #00A3FF 100%)',
            '&:hover': {
              background: 'linear-gradient(90deg, #0077EE 0%, #0099EE 100%)',
            },
            boxShadow: '0 4px 12px rgba(0, 128, 255, 0.3)'
          }}
        >
          Open Platform
        </Button>
      </Paper>
    </Box>
  );
};

export default CompanyPlatformMock;