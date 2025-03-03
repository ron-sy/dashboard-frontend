import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Snackbar,
  IconButton,
  InputAdornment,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  alpha,
  useTheme,
  SelectChangeEvent
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useAuth } from '../context/AuthContext';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

interface Company {
  id: string;
  name: string;
}

interface InvitationLinkGeneratorProps {
  companies: Company[];
}

const InvitationLinkGenerator: React.FC<InvitationLinkGeneratorProps> = ({ companies }) => {
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [expiryDays, setExpiryDays] = useState<number>(7);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [generatedLink, setGeneratedLink] = useState<string>('');
  
  const { getToken } = useAuth();
  const theme = useTheme();
  
  const handleCompanyChange = (event: SelectChangeEvent) => {
    setSelectedCompany(event.target.value);
  };
  
  const handleExpiryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0) {
      setExpiryDays(value);
    }
  };
  
  const generateLink = async () => {
    if (!selectedCompany) {
      setError('Please select a company');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Get the token for authentication
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Generate a unique invitation code
      const invitationCode = uuidv4();
      
      // Calculate expiry date
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + expiryDays);
      
      // Create invitation data
      const invitationData = {
        code: invitationCode,
        companyId: selectedCompany,
        companyName: companies.find(c => c.id === selectedCompany)?.name || '',
        expiryDate: expiryDate.toISOString(),
        used: false
      };
      
      // Use the backend API to create the invitation
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/invitations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invitationData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to create invitation: ${response.status}`);
      }
      
      // Generate the full invitation URL
      const baseUrl = window.location.origin;
      const invitationUrl = `${baseUrl}/register?invitation=${invitationCode}`;
      
      setGeneratedLink(invitationUrl);
      setSuccess(true);
    } catch (err: any) {
      console.error('Error generating invitation link:', err);
      setError(err.message || 'Failed to generate invitation link');
    } finally {
      setLoading(false);
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink)
      .then(() => {
        setSuccess(true);
      })
      .catch(err => {
        setError('Failed to copy to clipboard');
      });
  };
  
  const handleCloseSnackbar = () => {
    setSuccess(false);
  };
  
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        background: alpha('#111111', 0.7),
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
        Generate Invitation Link
      </Typography>
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            borderRadius: 2,
            background: alpha('#f44336', 0.1),
            border: '1px solid rgba(244, 67, 54, 0.2)'
          }}
        >
          {error}
        </Alert>
      )}
      
      <FormControl fullWidth margin="normal">
        <InputLabel id="company-select-label">Company</InputLabel>
        <Select
          labelId="company-select-label"
          id="company-select"
          value={selectedCompany}
          onChange={handleCompanyChange}
          label="Company"
          sx={{
            borderRadius: 1,
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            }
          }}
        >
          {companies.map((company) => (
            <MenuItem key={company.id} value={company.id}>
              {company.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <TextField
        margin="normal"
        fullWidth
        id="expiry-days"
        label="Expiry (days)"
        type="number"
        value={expiryDays}
        onChange={handleExpiryChange}
        InputProps={{
          inputProps: { min: 1 }
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            }
          }
        }}
      />
      
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={generateLink}
        disabled={loading}
        sx={{ mt: 3, mb: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Generate Invitation Link'}
      </Button>
      
      {generatedLink && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Invitation Link:
          </Typography>
          <TextField
            fullWidth
            value={generatedLink}
            variant="outlined"
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={copyToClipboard}
                    title="Copy to clipboard"
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                }
              }
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            This link will expire in {expiryDays} days and can only be used once.
          </Typography>
        </Box>
      )}
      
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Link copied to clipboard!"
      />
    </Paper>
  );
};

export default InvitationLinkGenerator; 