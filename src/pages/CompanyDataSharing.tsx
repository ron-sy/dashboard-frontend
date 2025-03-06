import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  alpha,
  useTheme,
  Chip
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

interface DataSharing {
  is_connected: boolean;
  connection_type: string;
  connected_at: string;
  connection_details: {
    source_id: string;
    source_name: string;
  };
}

const CompanyDataSharing: React.FC = () => {
  const theme = useTheme();
  const { companyId } = useParams();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dataSharing, setDataSharing] = useState<DataSharing | null>(null);

  useEffect(() => {
    const fetchDataSharing = async () => {
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
          throw new Error('Failed to fetch data sharing settings');
        }
        
        const data = await response.json();
        setDataSharing(data.data_sharing || null);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        console.error('Error fetching data sharing settings:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (companyId) {
      fetchDataSharing();
    }
  }, [companyId, getToken]);

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
        Data Sharing Settings
      </Typography>
      
      <Paper 
        sx={{ 
          p: 3,
          background: alpha('#111111', 0.7),
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}
      >
        {dataSharing ? (
          <List>
            <ListItem>
              <ListItemIcon>
                {dataSharing.is_connected ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <ErrorIcon color="error" />
                )}
              </ListItemIcon>
              <ListItemText 
                primary="Connection Status" 
                secondary={dataSharing.is_connected ? 'Connected' : 'Disconnected'} 
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <InsertDriveFileIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Connection Type" 
                secondary={dataSharing.connection_type} 
              />
            </ListItem>
            
            {dataSharing.is_connected && (
              <>
                <ListItem>
                  <ListItemText 
                    primary="Connected Since" 
                    secondary={new Date(dataSharing.connected_at).toLocaleString()} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="Source Details" 
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Chip 
                          label={`ID: ${dataSharing.connection_details.source_id}`} 
                          size="small" 
                          sx={{ mr: 1 }} 
                        />
                        <Chip 
                          label={`Name: ${dataSharing.connection_details.source_name}`} 
                          size="small" 
                        />
                      </Box>
                    }
                  />
                </ListItem>
              </>
            )}
          </List>
        ) : (
          <Typography color="text.secondary">
            No data sharing settings configured
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default CompanyDataSharing; 