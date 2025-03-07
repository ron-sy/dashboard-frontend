import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  alpha,
  useTheme,
  IconButton,
  Stack,
} from '@mui/material';
import {
  CameraIcon,
  KeyIcon,
  BellIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAuth } from '../context/AuthContext';

interface Profile {
  display_name: string;
  profile: {
    avatar_url: string | null;
    job_title: string | null;
    department: string | null;
    phone: string | null;
    timezone: string;
    language_preference: string;
    business_address: BusinessAddress;
    notification_preferences: NotificationPreferences;
    system_preferences: SystemPreferences;
    security: SecuritySettings;
  };
}

interface BusinessAddress {
  street: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
}

interface NotificationPreferences {
  email_notifications: boolean;
  desktop_notifications: boolean;
  mobile_notifications: boolean;
  notification_types: {
    team_updates: boolean;
    system_alerts: boolean;
    reports: boolean;
    mentions: boolean;
  };
}

interface SystemPreferences {
  theme: 'light' | 'dark' | 'system';
  date_format: string;
  time_format: '12h' | '24h';
}

interface SecuritySettings {
  two_factor_enabled: boolean;
  last_password_change: string;
  login_history: Array<{
    timestamp: string;
    ip: string;
    device: string;
  }>;
}

const Account: React.FC = () => {
  const theme = useTheme();
  const { currentUser, getToken } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editedProfile, setEditedProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      console.log("Fetching profile data...");
      const token = await getToken();
      console.log("Got auth token");
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/account/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("Profile API response status:", response.status);
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      console.log("Received profile data:", data);
      setProfile(data);
      setEditedProfile(data);
      console.log("Profile state after update:", data);
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEditing = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditedProfile(profile);
    setError(null);
  };

  const handleSaveProfile = async () => {
    if (!editedProfile) return;

    try {
      setError(null);
      const token = await getToken();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/account/profile`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedProfile)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setProfile(editedProfile);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateEditedProfile = (field: string, value: any) => {
    if (!editedProfile) return;
    
    const fieldParts = field.split('.');
    let updatedProfile = { ...editedProfile } as any;
    
    if (fieldParts.length === 1) {
      updatedProfile[field] = value;
    } else {
      let current = updatedProfile;
      for (let i = 0; i < fieldParts.length - 1; i++) {
        current = current[fieldParts[i]];
      }
      current[fieldParts[fieldParts.length - 1]] = value;
    }
    
    setEditedProfile(updatedProfile as Profile);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #121212 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ color: 'white' }}>
            Account Settings
          </Typography>
          <Stack direction="row" spacing={1}>
            {!isEditing ? (
              <IconButton 
                onClick={handleStartEditing}
                sx={{ 
                  color: theme.palette.primary.main,
                  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) }
                }}
              >
                <EditIcon />
              </IconButton>
            ) : (
              <>
                <IconButton 
                  onClick={handleSaveProfile}
                  sx={{ 
                    color: theme.palette.success.main,
                    '&:hover': { backgroundColor: alpha(theme.palette.success.main, 0.1) }
                  }}
                >
                  <SaveIcon />
                </IconButton>
                <IconButton 
                  onClick={handleCancelEditing}
                  sx={{ 
                    color: theme.palette.error.main,
                    '&:hover': { backgroundColor: alpha(theme.palette.error.main, 0.1) }
                  }}
                >
                  <CancelIcon />
                </IconButton>
              </>
            )}
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {/* Profile Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 3, 
              background: alpha('#111111', 0.7),
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                Profile Information
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Display Name"
                  value={isEditing ? editedProfile?.display_name : profile?.display_name}
                  onChange={(e) => updateEditedProfile('display_name', e.target.value)}
                  disabled={!isEditing}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Job Title"
                  value={isEditing ? editedProfile?.profile.job_title : profile?.profile.job_title}
                  onChange={(e) => updateEditedProfile('profile.job_title', e.target.value)}
                  disabled={!isEditing}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Department"
                  value={isEditing ? editedProfile?.profile.department : profile?.profile.department}
                  onChange={(e) => updateEditedProfile('profile.department', e.target.value)}
                  disabled={!isEditing}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Phone"
                  value={isEditing ? editedProfile?.profile.phone : profile?.profile.phone}
                  onChange={(e) => updateEditedProfile('profile.phone', e.target.value)}
                  disabled={!isEditing}
                />
              </Box>

              <Typography variant="subtitle1" sx={{ mb: 2, color: 'white' }}>
                Business Address
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Street"
                  value={isEditing ? editedProfile?.profile.business_address.street : profile?.profile.business_address.street}
                  onChange={(e) => updateEditedProfile('profile.business_address.street', e.target.value)}
                  disabled={!isEditing}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="City"
                  value={isEditing ? editedProfile?.profile.business_address.city : profile?.profile.business_address.city}
                  onChange={(e) => updateEditedProfile('profile.business_address.city', e.target.value)}
                  disabled={!isEditing}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="State"
                  value={isEditing ? editedProfile?.profile.business_address.state : profile?.profile.business_address.state}
                  onChange={(e) => updateEditedProfile('profile.business_address.state', e.target.value)}
                  disabled={!isEditing}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Postal Code"
                  value={isEditing ? editedProfile?.profile.business_address.postal_code : profile?.profile.business_address.postal_code}
                  onChange={(e) => updateEditedProfile('profile.business_address.postal_code', e.target.value)}
                  disabled={!isEditing}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Country"
                  value={isEditing ? editedProfile?.profile.business_address.country : profile?.profile.business_address.country}
                  onChange={(e) => updateEditedProfile('profile.business_address.country', e.target.value)}
                  disabled={!isEditing}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Preferences Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 3, 
              background: alpha('#111111', 0.7),
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                Preferences
              </Typography>

              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Theme</InputLabel>
                  <Select
                    value={isEditing ? editedProfile?.profile.system_preferences.theme : profile?.profile.system_preferences.theme}
                    onChange={(e) => updateEditedProfile('profile.system_preferences.theme', e.target.value)}
                    disabled={!isEditing}
                    label="Theme"
                  >
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                    <MenuItem value="system">System</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Time Format</InputLabel>
                  <Select
                    value={isEditing ? editedProfile?.profile.system_preferences.time_format : profile?.profile.system_preferences.time_format}
                    onChange={(e) => updateEditedProfile('profile.system_preferences.time_format', e.target.value)}
                    disabled={!isEditing}
                    label="Time Format"
                  >
                    <MenuItem value="12h">12 Hour</MenuItem>
                    <MenuItem value="24h">24 Hour</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={isEditing ? editedProfile?.profile.language_preference : profile?.profile.language_preference}
                    onChange={(e) => updateEditedProfile('profile.language_preference', e.target.value)}
                    disabled={!isEditing}
                    label="Language"
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Typography variant="subtitle1" sx={{ mb: 2, color: 'white' }}>
                Notification Preferences
              </Typography>

              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isEditing ? editedProfile?.profile.notification_preferences.email_notifications : profile?.profile.notification_preferences.email_notifications}
                      onChange={(e) => updateEditedProfile('profile.notification_preferences.email_notifications', e.target.checked)}
                      disabled={!isEditing}
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={isEditing ? editedProfile?.profile.notification_preferences.desktop_notifications : profile?.profile.notification_preferences.desktop_notifications}
                      onChange={(e) => updateEditedProfile('profile.notification_preferences.desktop_notifications', e.target.checked)}
                      disabled={!isEditing}
                    />
                  }
                  label="Desktop Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={isEditing ? editedProfile?.profile.notification_preferences.mobile_notifications : profile?.profile.notification_preferences.mobile_notifications}
                      onChange={(e) => updateEditedProfile('profile.notification_preferences.mobile_notifications', e.target.checked)}
                      disabled={!isEditing}
                    />
                  }
                  label="Mobile Notifications"
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Account;

