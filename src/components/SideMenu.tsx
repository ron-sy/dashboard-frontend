import React, { useState } from 'react';
import { Box, List, ListItemButton, ListItemText, CircularProgress, alpha, useTheme, Collapse, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  BuildingOffice2Icon, 
  Cog6ToothIcon,
  ChartBarIcon,
  CreditCardIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  ClipboardDocumentListIcon,
  BriefcaseIcon,
  RectangleStackIcon,
  ArrowPathIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

interface SideMenuProps {
  onboardingProgress?: number;
  companies: Company[];
}

interface Company {
  id: string;
  name: string;
  created_at: string;
}

const SideMenu: React.FC<SideMenuProps> = ({ onboardingProgress = 63, companies = [] }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false);

  // Extract first name for display
  const displayName = currentUser?.email?.split('@')[0] || 'User';
  const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  // Get the first company for display (if any)
  const firstCompany = companies[0];

  return (
    <Box
      sx={{
        width: 280,
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        height: '100vh',
        p: 0,
        background: alpha('#111111', 0.7),
        backdropFilter: 'blur(10px)',
      }}
    >
      <List component="nav" sx={{ p: 1.5 }}>
        {/* Setup Section */}
        <ListItemButton
          onClick={() => navigate('/setup')}
          sx={{
            borderRadius: '6px',
            mb: 0.5,
            py: 2,
            px: 1.5,
            backgroundColor: alpha('#1A1A1A', 0.5),
            '&:hover': {
              backgroundColor: alpha('#1A1A1A', 0.7),
            },
          }}
        >
          <Box sx={{ position: 'relative', mr: 1.5, display: 'flex', alignItems: 'center' }}>
            {/* Background Circle */}
            <CircularProgress
              variant="determinate"
              value={100}
              size={24}
              sx={{
                color: alpha(theme.palette.primary.main, 0.2),
                position: 'absolute',
                left: 0,
              }}
            />
            {/* Progress Circle */}
            <CircularProgress
              variant="determinate"
              value={63}
              size={24}
              sx={{
                color: theme.palette.primary.main,
                position: 'absolute',
                left: 0,
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                  strokeWidth: '3px',
                },
              }}
            />
            {/* Building Icon */}
            <Box
              sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 14,
                height: 14,
                color: 'text.primary',
              }}
            >
              <BuildingOffice2Icon />
            </Box>
            {/* Spacer to maintain layout */}
            <Box sx={{ width: 24, height: 24 }} />
          </Box>
          <ListItemText 
            primary="Set up Synthetic Teams"
            sx={{ 
              m: 0,
              color: 'text.primary',
              '& .MuiListItemText-primary': {
                fontSize: 14,
                fontWeight: 500,
              }
            }}
          />
        </ListItemButton>

        {/* User Section */}
        <Box sx={{ mt: 2, position: 'relative' }}>
          <ListItemButton
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            sx={{
              borderRadius: '6px',
              py: 0,
              px: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <ListItemText
              primary={formattedName}
              sx={{
                m: 0,
                '& .MuiListItemText-primary': {
                  fontSize: 14,
                  fontWeight: 500,
                },
              }}
            />
            <Box 
              component={Cog6ToothIcon}
              sx={{ 
                width: 18,
                height: 18,
                color: 'text.secondary',
              }}
            />
          </ListItemButton>

          <Collapse in={userMenuOpen} timeout="auto" unmountOnExit>
            <Box
              sx={{
                position: 'absolute',
                top: '100%',
                left: 5,
                right: 0,
                mt: 0.5,
                backgroundColor: alpha('#1A1A1A', 0.95),
                borderRadius: '6px',
                border: '1px solid',
                borderColor: alpha('#ffffff', 0.1),
                boxShadow: `
                  0 0 0 1px ${alpha('#000000', 0.3)},
                  0 4px 6px -1px ${alpha('#000000', 0.2)},
                  0 2px 4px -1px ${alpha('#000000', 0.1)},
                  0 0 8px 0 ${alpha(theme.palette.primary.main, 0.1)}
                `,
                overflow: 'hidden',
                backdropFilter: 'blur(8px)',
                zIndex: 1,
              }}
            >
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{
                    py: 0,
                    px: 1.5,
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  <ListItemText
                    primary={currentUser?.email}
                    sx={{
                      m: 0,
                      '& .MuiListItemText-primary': {
                        fontSize: 13,
                        color: alpha('#ffffff', 0.5),
                      },
                    }}
                  />
                </ListItemButton>
                <ListItemButton
                  onClick={logout}
                  sx={{
                    py: 0,
                    px: 1.5,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <ListItemText
                    primary="Sign out"
                    sx={{
                      m: 0,
                      '& .MuiListItemText-primary': {
                        fontSize: 13,
                        color: theme.palette.error.main,
                      },
                    }}
                  />
                </ListItemButton>
              </List>
            </Box>
          </Collapse>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ mt: 2 }}>
          <ListItemButton
            onClick={() => navigate('/metrics')}
            sx={{
              borderRadius: '6px',
              py: 1,
              px: 1.5,
              mb: 0.5,
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <Box 
              component={ChartBarIcon}
              sx={{ 
                width: 18,
                height: 18,
                color: 'text.secondary',
                mr: 1.5,
                opacity: 0.7,
              }}
            />
            <ListItemText 
              primary="Metrics"
              sx={{
                m: 0,
                '& .MuiListItemText-primary': {
                  fontSize: 14,
                  fontWeight: 500,
                },
              }}
            />
          </ListItemButton>

          <ListItemButton
            onClick={() => navigate('/billing')}
            sx={{
              borderRadius: '6px',
              py: 0,
              px: 1.5,
              mb: 0.5,
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <Box 
              component={CreditCardIcon}
              sx={{ 
                width: 18,
                height: 18,
                color: 'text.secondary',
                mr: 1.5,
                opacity: 0.7,
              }}
            />
            <ListItemText 
              primary="Billing"
              sx={{
                m: 0,
                '& .MuiListItemText-primary': {
                  fontSize: 14,
                  fontWeight: 500,
                },
              }}
            />
          </ListItemButton>

          <ListItemButton
            onClick={() => navigate('/documents')}
            sx={{
              borderRadius: '6px',
              py: 1,
              px: 1.5,
              mb: 0.5,
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <Box 
              component={DocumentTextIcon}
              sx={{ 
                width: 18,
                height: 18,
                color: 'text.secondary',
                mr: 1.5,
                opacity: 0.7,
              }}
            />
            <ListItemText 
              primary="Documents"
              sx={{
                m: 0,
                '& .MuiListItemText-primary': {
                  fontSize: 14,
                  fontWeight: 500,
                },
              }}
            />
          </ListItemButton>
        </Box>

        {/* Companies Section */}
        <Box sx={{ mt: 2, position: 'relative' }}>
          <ListItemButton
            onClick={() => setCompanyMenuOpen(!companyMenuOpen)}
            sx={{
              borderRadius: '6px',
              py: 1,
              px: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <ListItemText
              primary={firstCompany?.name || 'No Company'}
              sx={{
                m: 0,
                '& .MuiListItemText-primary': {
                  fontSize: 14,
                  fontWeight: 500,
                },
              }}
            />
            <Box 
              component={Cog6ToothIcon}
              sx={{ 
                width: 18,
                height: 18,
                color: 'text.secondary',
              }}
            />
          </ListItemButton>

          <Collapse in={companyMenuOpen} timeout="auto" unmountOnExit>
            <Box
              sx={{
                position: 'absolute',
                top: '100%',
                left: 5,
                right: 0,
                mt: 0.5,
                backgroundColor: alpha('#1A1A1A', 0.95),
                borderRadius: '6px',
                border: '1px solid',
                borderColor: alpha('#ffffff', 0.1),
                boxShadow: `
                  0 0 0 1px ${alpha('#000000', 0.3)},
                  0 4px 6px -1px ${alpha('#000000', 0.2)},
                  0 2px 4px -1px ${alpha('#000000', 0.1)},
                  0 0 8px 0 ${alpha(theme.palette.primary.main, 0.1)}
                `,
                overflow: 'hidden',
                backdropFilter: 'blur(8px)',
                zIndex: 1,
              }}
            >
              <List component="div" disablePadding>
                {companies.map((company) => (
                  <ListItemButton
                    key={company.id}
                    onClick={() => {
                      // Handle company selection
                      setCompanyMenuOpen(false);
                    }}
                    sx={{
                      py: 1,
                      px: 1.5,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    <ListItemText
                      primary={company.name}
                      sx={{
                        m: 0,
                        '& .MuiListItemText-primary': {
                          fontSize: 14,
                          fontWeight: 500,
                        },
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Collapse>

          {/* Company Submenu Items */}
          <List component="div" disablePadding sx={{ mt: 0.5 }}>
            <ListItemButton
              sx={{
                borderRadius: '6px',
                py: 1,
                px: 1.5,
                mb: 0.5,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <Box 
                component={UserGroupIcon}
                sx={{ 
                  width: 18,
                  height: 18,
                  color: 'text.secondary',
                  mr: 1.5,
                  opacity: 0.7,
                }}
              />
              <ListItemText 
                primary="Team Members"
                sx={{
                  m: 0,
                  '& .MuiListItemText-primary': {
                    fontSize: 14,
                    fontWeight: 500,
                  },
                }}
              />
            </ListItemButton>

            <ListItemButton
              sx={{
                borderRadius: '6px',
                py: 1,
                px: 1.5,
                mb: 0.5,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <Box 
                component={CalendarIcon}
                sx={{ 
                  width: 18,
                  height: 18,
                  color: 'text.secondary',
                  mr: 1.5,
                  opacity: 0.7,
                }}
              />
              <ListItemText 
                primary="Schedule"
                sx={{
                  m: 0,
                  '& .MuiListItemText-primary': {
                    fontSize: 14,
                    fontWeight: 500,
                  },
                }}
              />
            </ListItemButton>

            <ListItemButton
              sx={{
                borderRadius: '6px',
                py: 1,
                px: 1.5,
                mb: 0.5,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <Box 
                component={ChatBubbleLeftIcon}
                sx={{ 
                  width: 18,
                  height: 18,
                  color: 'text.secondary',
                  mr: 1.5,
                  opacity: 0.7,
                }}
              />
              <ListItemText 
                primary="Messages"
                sx={{
                  m: 0,
                  '& .MuiListItemText-primary': {
                    fontSize: 14,
                    fontWeight: 500,
                  },
                }}
              />
            </ListItemButton>

            <ListItemButton
              sx={{
                borderRadius: '6px',
                py: 1,
                px: 1.5,
                mb: 0.5,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <Box 
                component={ClipboardDocumentListIcon}
                sx={{ 
                  width: 18,
                  height: 18,
                  color: 'text.secondary',
                  mr: 1.5,
                  opacity: 0.7,
                }}
              />
              <ListItemText 
                primary="Tasks"
                sx={{
                  m: 0,
                  '& .MuiListItemText-primary': {
                    fontSize: 14,
                    fontWeight: 500,
                  },
                }}
              />
            </ListItemButton>

            <ListItemButton
              sx={{
                borderRadius: '6px',
                py: 1,
                px: 1.5,
                mb: 0.5,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <Box 
                component={BriefcaseIcon}
                sx={{ 
                  width: 18,
                  height: 18,
                  color: 'text.secondary',
                  mr: 1.5,
                  opacity: 0.7,
                }}
              />
              <ListItemText 
                primary="Projects"
                sx={{
                  m: 0,
                  '& .MuiListItemText-primary': {
                    fontSize: 14,
                    fontWeight: 500,
                  },
                }}
              />
            </ListItemButton>

            <ListItemButton
              sx={{
                borderRadius: '6px',
                py: 1,
                px: 1.5,
                mb: 0.5,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <Box 
                component={RectangleStackIcon}
                sx={{ 
                  width: 18,
                  height: 18,
                  color: 'text.secondary',
                  mr: 1.5,
                  opacity: 0.7,
                }}
              />
              <ListItemText 
                primary="Resources"
                sx={{
                  m: 0,
                  '& .MuiListItemText-primary': {
                    fontSize: 14,
                    fontWeight: 500,
                  },
                }}
              />
            </ListItemButton>

            <ListItemButton
              sx={{
                borderRadius: '6px',
                py: 1,
                px: 1.5,
                mb: 0.5,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <Box 
                component={ArrowPathIcon}
                sx={{ 
                  width: 18,
                  height: 18,
                  color: 'text.secondary',
                  mr: 1.5,
                  opacity: 0.7,
                }}
              />
              <ListItemText 
                primary="Activity"
                sx={{
                  m: 0,
                  '& .MuiListItemText-primary': {
                    fontSize: 14,
                    fontWeight: 500,
                  },
                }}
              />
            </ListItemButton>

            <ListItemButton
              sx={{
                borderRadius: '6px',
                py: 1,
                px: 1.5,
                mb: 0.5,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <Box 
                component={BellIcon}
                sx={{ 
                  width: 18,
                  height: 18,
                  color: 'text.secondary',
                  mr: 1.5,
                  opacity: 0.7,
                }}
              />
              <ListItemText 
                primary="Notifications"
                sx={{
                  m: 0,
                  '& .MuiListItemText-primary': {
                    fontSize: 14,
                    fontWeight: 500,
                  },
                }}
              />
            </ListItemButton>
          </List>
        </Box>
      </List>
    </Box>
  );
};

export default SideMenu; 
