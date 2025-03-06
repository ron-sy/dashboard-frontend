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
} from '@mui/material';
import {
  CameraIcon,
  KeyIcon,
  BellIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      console.log("Fetching profile data...");
      const token = await getToken();
      console.log("Got auth token");
      
      const response = await fetch('http://localhost:5001/api/account/profile', {
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
      console.log("Profile state after update:", data);
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (updates: Partial<Profile>) => {
    if (!profile) return;

    try {
      const token = await getToken();
      const response = await fetch('http://localhost:5001/api/account/profile', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setProfile({ ...profile, ...updates });
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const updateDisplayName = (value: string) => {
    handleProfileUpdate({ display_name: value });
  };

  const updateProfileField = (field: keyof Profile['profile'], value: any) => {
    if (!profile) return;
    handleProfileUpdate({
      profile: {
        ...profile.profile,
        [field]: value
      }
    });
  };

  const updateBusinessAddress = (field: keyof BusinessAddress, value: string | null) => {
    if (!profile) return;
    handleProfileUpdate({
      profile: {
        ...profile.profile,
        business_address: {
          ...profile.profile.business_address,
          [field]: value
        }
      }
    });
  };

  const updateNotificationPreferences = (field: keyof NotificationPreferences, value: boolean) => {
    if (!profile) return;
    handleProfileUpdate({
      profile: {
        ...profile.profile,
        notification_preferences: {
          ...profile.profile.notification_preferences,
          [field]: value
        }
      }
    });
  };

  const updateSystemPreferences = (field: keyof SystemPreferences, value: any) => {
    if (!profile) return;
    handleProfileUpdate({
      profile: {
        ...profile.profile,
        system_preferences: {
          ...profile.profile.system_preferences,
          [field]: value
        }
      }
    });
  };

  const updateSecurity = (field: keyof SecuritySettings, value: boolean) => {
    if (!profile) return;
    handleProfileUpdate({
      profile: {
        ...profile.profile,
        security: {
          ...profile.profile.security,
          [field]: value
        }
      }
    });
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

        <Typography variant="h4" sx={{ mb: 4, color: 'white' }}>
          Account Settings
        </Typography>

        <Grid container spacing={3}>
          {/* Profile Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 3, 
              background: alpha('#111111', 0.7),
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  src={profile?.profile.avatar_url || undefined}
                  sx={{ width: 64, height: 64, mr: 2 }}
                />
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<Box component={CameraIcon} sx={{ width: 20 }} />}
                    sx={{ 
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.23)'
                    }}
                  >
                    Change Photo
                  </Button>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Display Name"
                    value={profile?.display_name || ''}
                    onChange={(e) => updateDisplayName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Job Title"
                    value={profile?.profile.job_title || ''}
                    onChange={(e) => updateProfileField('job_title', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Department"
                    value={profile?.profile.department || ''}
                    onChange={(e) => updateProfileField('department', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={profile?.profile.phone || ''}
                    onChange={(e) => updateProfileField('phone', e.target.value)}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Business Address */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 3,
              background: alpha('#111111', 0.7),
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                Business Address
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    value={profile?.profile.business_address.street || ''}
                    onChange={(e) => updateBusinessAddress('street', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    value={profile?.profile.business_address.city || ''}
                    onChange={(e) => updateBusinessAddress('city', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State/Province"
                    value={profile?.profile.business_address.state || ''}
                    onChange={(e) => updateBusinessAddress('state', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    value={profile?.profile.business_address.postal_code || ''}
                    onChange={(e) => updateBusinessAddress('postal_code', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    value={profile?.profile.business_address.country || ''}
                    onChange={(e) => updateBusinessAddress('country', e.target.value)}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* System Preferences */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 3,
              background: alpha('#111111', 0.7),
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                System Preferences
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Theme</InputLabel>
                    <Select
                      value={profile?.profile.system_preferences.theme || 'system'}
                      onChange={(e) => updateSystemPreferences('theme', e.target.value)}
                    >
                      <MenuItem value="light">Light</MenuItem>
                      <MenuItem value="dark">Dark</MenuItem>
                      <MenuItem value="system">System</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Time Format</InputLabel>
                    <Select
                      value={profile?.profile.system_preferences.time_format || '24h'}
                      onChange={(e) => updateSystemPreferences('time_format', e.target.value)}
                    >
                      <MenuItem value="12h">12-hour</MenuItem>
                      <MenuItem value="24h">24-hour</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Notifications */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 3,
              background: alpha('#111111', 0.7),
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                Notification Preferences
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile?.profile.notification_preferences.email_notifications || false}
                        onChange={(e) => updateNotificationPreferences('email_notifications', e.target.checked)}
                      />
                    }
                    label="Email Notifications"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile?.profile.notification_preferences.desktop_notifications || false}
                        onChange={(e) => updateNotificationPreferences('desktop_notifications', e.target.checked)}
                      />
                    }
                    label="Desktop Notifications"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile?.profile.notification_preferences.mobile_notifications || false}
                        onChange={(e) => updateNotificationPreferences('mobile_notifications', e.target.checked)}
                      />
                    }
                    label="Mobile Notifications"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Security */}
          <Grid item xs={12}>
            <Paper sx={{ 
              p: 3,
              background: alpha('#111111', 0.7),
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                Security Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile?.profile.security.two_factor_enabled || false}
                        onChange={(e) => updateSecurity('two_factor_enabled', e.target.checked)}
                      />
                    }
                    label="Two-Factor Authentication"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    startIcon={<Box component={KeyIcon} sx={{ width: 20 }} />}
                    sx={{ 
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.23)'
                    }}
                  >
                    Change Password
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Account;

