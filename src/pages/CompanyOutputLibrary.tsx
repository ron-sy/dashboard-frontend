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
  ListItemSecondaryAction,
  IconButton,
  alpha,
  useTheme,
  Chip
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import AssignmentIcon from '@mui/icons-material/Assignment';

interface OutputFile {
  id: string;
  name: string;
  description: string;
  file_type: string;
  size_bytes: number;
  uploaded_at: string;
  uploaded_by: string;
  download_url: string;
}

interface OutputLibrary {
  files: OutputFile[];
  total_files: number;
  total_size_bytes: number;
}

const CompanyOutputLibrary: React.FC = () => {
  const theme = useTheme();
  const { companyId } = useParams();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [outputLibrary, setOutputLibrary] = useState<OutputLibrary | null>(null);

  useEffect(() => {
    const fetchOutputLibrary = async () => {
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
          throw new Error('Failed to fetch output library');
        }
        
        const data = await response.json();
        setOutputLibrary(data.output_library || null);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        console.error('Error fetching output library:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (companyId) {
      fetchOutputLibrary();
    }
  }, [companyId, getToken]);

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <PictureAsPdfIcon />;
      case 'docx':
      case 'doc':
        return <DescriptionIcon />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <ImageIcon />;
      default:
        return <DescriptionIcon />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

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
        Output Library
      </Typography>
      
      <Paper 
        sx={{ 
          p: 3,
          background: alpha('#111111', 0.7),
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}
      >
        {outputLibrary ? (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Library Statistics
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Chip 
                  label={`Total Files: ${outputLibrary.total_files}`} 
                  size="small" 
                />
                <Chip 
                  label={`Total Size: ${formatFileSize(outputLibrary.total_size_bytes)}`} 
                  size="small" 
                />
              </Box>
            </Box>

            {outputLibrary.files.length > 0 ? (
              <List>
                {outputLibrary.files.map((file) => (
                  <ListItem key={file.id}>
                    <ListItemIcon>
                      {getFileIcon(file.file_type)}
                    </ListItemIcon>
                    <ListItemText 
                      primary={file.name}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {file.description}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Chip 
                              label={`Size: ${formatFileSize(file.size_bytes)}`} 
                              size="small" 
                              sx={{ mr: 1 }} 
                            />
                            <Chip 
                              label={`Type: ${file.file_type.toUpperCase()}`} 
                              size="small" 
                              sx={{ mr: 1 }} 
                            />
                            <Chip 
                              label={`Uploaded: ${new Date(file.uploaded_at).toLocaleDateString()}`} 
                              size="small" 
                            />
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton 
                        edge="end" 
                        aria-label="download"
                        onClick={() => window.open(file.download_url, '_blank')}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 8,
                  px: 3,
                  textAlign: 'center',
                  background: alpha('#1A1A1A', 0.3),
                  borderRadius: 2,
                  border: '1px dashed',
                  borderColor: alpha('#ffffff', 0.1),
                }}
              >
                <Box 
                  component={AssignmentIcon}
                  sx={{ 
                    width: 48,
                    height: 48,
                    color: alpha(theme.palette.primary.main, 0.5),
                    mb: 2
                  }}
                />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                  No Files Yet
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    maxWidth: 400,
                    mb: 3,
                    lineHeight: 1.6
                  }}
                >
                  Your AI agents will store their output files here. Once they start processing your data, you'll be able to access, download, and manage all generated files in this library.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Chip 
                    label="PDF Reports" 
                    icon={<PictureAsPdfIcon />}
                    sx={{ 
                      backgroundColor: alpha('#ffffff', 0.05),
                      '& .MuiChip-icon': { color: '#FF5252' }
                    }}
                  />
                  <Chip 
                    label="Excel Sheets" 
                    icon={<DescriptionIcon />}
                    sx={{ 
                      backgroundColor: alpha('#ffffff', 0.05),
                      '& .MuiChip-icon': { color: '#4CAF50' }
                    }}
                  />
                  <Chip 
                    label="Word Documents" 
                    icon={<DescriptionIcon />}
                    sx={{ 
                      backgroundColor: alpha('#ffffff', 0.05),
                      '& .MuiChip-icon': { color: '#2196F3' }
                    }}
                  />
                </Box>
              </Box>
            )}
          </>
        ) : (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center',
              py: 8,
              px: 3,
              textAlign: 'center',
              background: alpha('#1A1A1A', 0.3),
              borderRadius: 2,
              border: '1px dashed',
              borderColor: alpha('#ffffff', 0.1),
            }}
          >
            <Box 
              component={AssignmentIcon}
              sx={{ 
                width: 48,
                height: 48,
                color: alpha(theme.palette.primary.main, 0.5),
                mb: 2
              }}
            />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
              Output Library Not Configured
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                maxWidth: 400,
                mb: 3,
                lineHeight: 1.6
              }}
            >
              The output library needs to be configured for this company. Once set up, this is where you'll find all the files generated by your AI agents.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Chip 
                label="Configure Library" 
                sx={{ 
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              />
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default CompanyOutputLibrary; 