import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  alpha,
  useTheme
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface TeamMember {
  user_id: string;
  role: string;
  joined_at: string;
}

const CompanyTeam: React.FC = () => {
  const theme = useTheme();
  const { companyId } = useParams();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
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
          throw new Error('Failed to fetch team members');
        }
        
        const data = await response.json();
        setTeamMembers(data.team_members || []);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        console.error('Error fetching team members:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (companyId) {
      fetchTeamMembers();
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
        Team Members
      </Typography>
      
      <Paper 
        sx={{ 
          p: 3,
          background: alpha('#111111', 0.7),
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Joined</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.user_id}>
                  <TableCell>{member.user_id}</TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{member.role}</TableCell>
                  <TableCell>{new Date(member.joined_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default CompanyTeam; 