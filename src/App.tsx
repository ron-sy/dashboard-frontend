import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import RegisterWithInvitationPage from './pages/RegisterWithInvitationPage';
import Account from './pages/Account';
import Billing from './pages/Billing';
import Referrals from './pages/Referrals';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import VerifiedRoute from './components/VerifiedRoute';
import DashboardLayout from './components/DashboardLayout';
import CompanyTeam from './pages/CompanyTeam';
import CompanyDataSharing from './pages/CompanyDataSharing';
import CompanyOutputLibrary from './pages/CompanyOutputLibrary';
import CompanyOnboarding from './pages/CompanyOnboarding';
import CompanyAIAgents from './pages/CompanyAIAgents';
import CompanyPlatformMock from './pages/CompanyPlatformMock';
import IntercomProvider from './components/IntercomProvider';

// Create a custom theme based on the synthetic teams branding
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00A3FF', // Blue accent color from the logo
    },
    secondary: {
      main: '#FFFFFF',
    },
    background: {
      default: '#000000',
      paper: '#111111',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#AAAAAA',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 20px',
        },
        containedPrimary: {
          background: 'linear-gradient(90deg, #0088FF 0%, #00A3FF 100%)',
          '&:hover': {
            background: 'linear-gradient(90deg, #0077EE 0%, #0099EE 100%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <IntercomProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterWithInvitationPage />} />
              
              {/* Email verification route - requires authentication but not email verification */}
              <Route element={<ProtectedRoute />}>
                <Route path="/verify-email" element={<EmailVerificationPage />} />
              </Route>
              
              {/* Protected routes - require both authentication and email verification */}
              <Route element={<VerifiedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/referrals" element={<Referrals />} />
                  
                  {/* Company specific routes */}
                  <Route path="/companies/:companyId">
                    <Route path="team" element={<CompanyTeam />} />
                    <Route path="data-sharing" element={<CompanyDataSharing />} />
                    <Route path="output-library" element={<CompanyOutputLibrary />} />
                    <Route path="onboarding" element={<CompanyOnboarding />} />
                    <Route path="ai-agents" element={<CompanyAIAgents />} />
                    <Route path="platform" element={<CompanyPlatformMock />} />
                  </Route>
                </Route>
              </Route>
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </IntercomProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
