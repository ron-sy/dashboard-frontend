import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Box,
  Typography,
  CircularProgress,
  Alert,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  LinearProgress
} from '@mui/material';
import { MandrillService } from '../services/MandrillService';

interface MandrillTemplate {
  name: string;
  slug: string;
}

interface EmailNotificationDialogProps {
  open: boolean;
  onClose: () => void;
  onSend: (templateName: string, recipients: string[]) => void;
  companyId: string;
  stepName: string;
  loading?: boolean;
  error?: string;
}

const EmailNotificationDialog: React.FC<EmailNotificationDialogProps> = ({
  open,
  onClose,
  onSend,
  companyId,
  stepName,
  loading = false,
  error
}) => {
  const [templates, setTemplates] = useState<MandrillTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState<string>('');
  const [loadingTemplates, setLoadingTemplates] = useState<boolean>(false);
  const [templatesError, setTemplatesError] = useState<string | null>(null);
  const [sendToAllUsers, setSendToAllUsers] = useState<boolean>(false);
  
  const mandrillService = new MandrillService();
  
  // Load Mandrill templates when the dialog opens
  useEffect(() => {
    if (open) {
      fetchTemplates();
    }
  }, [open]);
  
  const fetchTemplates = async () => {
    setLoadingTemplates(true);
    setTemplatesError(null);
    
    try {
      const fetchedTemplates = await mandrillService.getTemplates();
      console.log('Fetched templates:', fetchedTemplates);
      
      if (fetchedTemplates.length === 0) {
        setTemplatesError('No email templates found in your Mandrill account. Please create at least one template.');
      } else {
        setTemplates(fetchedTemplates);
        // Auto-select the first template if none is selected
        if (!selectedTemplate && fetchedTemplates.length > 0) {
          setSelectedTemplate(fetchedTemplates[0].slug);
        }
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      setTemplatesError('Failed to load email templates. Please check your Mandrill API key and try again.');
    } finally {
      setLoadingTemplates(false);
    }
  };
  
  const handleAddRecipient = () => {
    if (newRecipient && !recipients.includes(newRecipient) && validateEmail(newRecipient)) {
      setRecipients([...recipients, newRecipient]);
      setNewRecipient('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && validateEmail(newRecipient)) {
      handleAddRecipient();
      e.preventDefault();
    }
  };
  
  const handleDeleteRecipient = (recipientToDelete: string) => {
    setRecipients(recipients.filter(recipient => recipient !== recipientToDelete));
  };
  
  const handleSend = () => {
    if (sendToAllUsers) {
      onSend(selectedTemplate, ['all_company_users']);
    } else {
      onSend(selectedTemplate, recipients);
    }
  };
  
  const validateEmail = (email: string): boolean => {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const isValid = (): boolean => {
    return (
      selectedTemplate !== '' && 
      (sendToAllUsers || recipients.length > 0)
    );
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Send Email Notification
        {loadingTemplates && <LinearProgress />}
      </DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Send an email notification about the status change of "{stepName}"
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Emails will be sent from <strong>ron@syntheticteams.com</strong>
        </Typography>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Important:</strong> Due to Mandrill's security policies, you can only send emails to verified domains. 
            If you're sending to Gmail, Yahoo, or other public email domains, they must be verified in your Mandrill account first.
          </Typography>
        </Alert>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="template-select-label">Email Template</InputLabel>
          <Select
            labelId="template-select-label"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value as string)}
            label="Email Template"
            disabled={loadingTemplates || loading}
          >
            {loadingTemplates ? (
              <MenuItem value="">
                <CircularProgress size={20} /> Loading templates...
              </MenuItem>
            ) : templates.length === 0 ? (
              <MenuItem value="" disabled>
                No templates available
              </MenuItem>
            ) : (
              templates.map((template) => (
                <MenuItem key={template.slug} value={template.slug}>
                  {template.name}
                </MenuItem>
              ))
            )}
          </Select>
          {templatesError && (
            <FormHelperText error>{templatesError}</FormHelperText>
          )}
        </FormControl>
        
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={sendToAllUsers}
                onChange={(e) => setSendToAllUsers(e.target.checked)}
                disabled={loading}
              />
            }
            label="Send to all users in this company"
          />
        </Box>
        
        {!sendToAllUsers && (
          <>
            <Box sx={{ display: 'flex', mt: 2 }}>
              <TextField
                fullWidth
                label="Add Recipient Email"
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
                onKeyPress={handleKeyPress}
                error={newRecipient !== '' && !validateEmail(newRecipient)}
                helperText={newRecipient !== '' && !validateEmail(newRecipient) ? 'Invalid email format' : ''}
                disabled={loading}
                placeholder="Enter email address and press Enter or Add"
              />
              <Button
                variant="contained"
                onClick={handleAddRecipient}
                sx={{ ml: 1 }}
                disabled={!validateEmail(newRecipient) || loading}
              >
                Add
              </Button>
            </Box>
            
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {recipients.map((recipient) => (
                <Chip
                  key={recipient}
                  label={recipient}
                  onDelete={() => handleDeleteRecipient(recipient)}
                  disabled={loading}
                />
              ))}
            </Box>
            
            {recipients.length === 0 && (
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                No recipients added yet
              </Typography>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSend}
          variant="contained"
          color="primary"
          disabled={!isValid() || loading || loadingTemplates || templates.length === 0}
        >
          {loading ? <CircularProgress size={24} sx={{ mr: 1 }} /> : null}
          {loading ? 'Sending...' : 'Send'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailNotificationDialog; 