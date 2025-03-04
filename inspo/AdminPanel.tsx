import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Snackbar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BusinessIcon from '@mui/icons-material/Business';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ErrorIcon from '@mui/icons-material/Error';
import { useAuth } from '../context/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface User {
  id: string;
  email: string;
  display_name: string;
  role: string;
  company_ids: string[];
  created_at: string;
}

interface Company {
  id: string;
  name: string;
  created_at: string;
  user_ids: string[];
}

interface OnboardingStep {
  id: string;
  name: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  updated_at: string;
}

interface CompanyWithSteps extends Company {
  onboarding_steps?: OnboardingStep[];
}

const AdminPanel: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companiesWithSteps, setCompaniesWithSteps] = useState<CompanyWithSteps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');
  const [updatingStep, setUpdatingStep] = useState<string | null>(null);

  // Dialog states
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Form states
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserDisplayName, setNewUserDisplayName] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');
  const [newUserCompanies, setNewUserCompanies] = useState<string[]>([]);

  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyUsers, setNewCompanyUsers] = useState<string[]>([]);

  const { getToken, isAdmin } = useAuth();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Fetch users and companies
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const token = await getToken();
        
        if (!token) {
          throw new Error('Authentication required');
        }
        
        console.log('Fetching admin data with real Firebase authentication');
        
        // Fetch users
        const usersResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!usersResponse.ok) {
          const errorData = await usersResponse.json().catch(() => ({}));
          console.error('Error fetching users:', errorData);
          throw new Error(errorData.error || `Failed to fetch users: ${usersResponse.status}`);
        }
        
        const usersData = await usersResponse.json();
        console.log(`Successfully fetched ${usersData.length} users`);
        setUsers(usersData);
        
        // Fetch companies
        const companiesResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/companies`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!companiesResponse.ok) {
          const errorData = await companiesResponse.json().catch(() => ({}));
          console.error('Error fetching companies:', errorData);
          throw new Error(errorData.error || `Failed to fetch companies: ${companiesResponse.status}`);
        }
        
        const companiesData = await companiesResponse.json();
        console.log(`Successfully fetched ${companiesData.length} companies`);
        setCompanies(companiesData);
      } catch (err: any) {
        console.error('Error in admin panel:', err);
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [getToken]);

  // Fetch onboarding steps for all companies when the onboarding tab is selected
  useEffect(() => {
    const fetchOnboardingSteps = async () => {
      if (tabValue !== 2 || companies.length === 0) return;
      
      try {
        setLoading(true);
        setError('');
        const token = await getToken();
        
        if (!token) {
          throw new Error('Authentication required');
        }
        
        console.log('Fetching onboarding steps for all companies');
        
        // Fetch detailed company data with onboarding steps
        const companiesWithStepsData = await Promise.all(
          companies.map(async (company) => {
            try {
              const response = await fetch(`${process.env.REACT_APP_API_URL}/api/companies/${company.id}`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              
              if (!response.ok) {
                console.error(`Failed to fetch details for company ${company.id}`);
                return { ...company, onboarding_steps: [] };
              }
              
              const companyData = await response.json();
              return {
                ...company,
                onboarding_steps: companyData.onboarding_steps || []
              };
            } catch (err) {
              console.error(`Error fetching company ${company.id} details:`, err);
              return { ...company, onboarding_steps: [] };
            }
          })
        );
        
        setCompaniesWithSteps(companiesWithStepsData);
      } catch (err: any) {
        console.error('Error fetching onboarding steps:', err);
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOnboardingSteps();
  }, [tabValue, companies, getToken]);

  // Create a new user
  const handleCreateUser = async () => {
    try {
      setLoading(true);
      setError('');
      const token = await getToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      console.log('Creating new user with Firebase auth:', newUserEmail);
      
      // First create the user in Firebase Authentication through the backend
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: newUserEmail,
          password: newUserPassword || 'ChangeMe123', // Default password if not provided
          display_name: newUserDisplayName || newUserEmail.split('@')[0], // Default to username part of email
          role: newUserRole,
          company_ids: newUserCompanies
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error creating user:', errorData);
        throw new Error(errorData.error || `Failed to create user: ${response.status}`);
      }
      
      const userData = await response.json();
      console.log('User created successfully:', userData.id);
      
      // Add the new user to the users list
      setUsers([...users, userData]);
      setNotification('User created successfully');
      
      // Close dialog and reset form
      setUserDialogOpen(false);
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserDisplayName('');
      setNewUserRole('user');
      setNewUserCompanies([]);
    } catch (err: any) {
      console.error('Error creating user:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Create a new company
  const handleCreateCompany = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/companies`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newCompanyName,
          user_ids: newCompanyUsers
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create company');
      }
      
      const companyData = await response.json();
      setCompanies([...companies, companyData]);
      setNotification('Company created successfully');
      
      // Close dialog and reset form
      setCompanyDialogOpen(false);
      setNewCompanyName('');
      setNewCompanyUsers([]);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Edit user
  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setNewUserDisplayName(user.display_name);
    setNewUserRole(user.role);
    setNewUserCompanies(user.company_ids);
    setEditDialogOpen(true);
  };

  // Update user
  const handleUpdateUser = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError('');
      const token = await getToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      console.log('Updating user with Firebase auth:', currentUser.id);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          display_name: newUserDisplayName,
          role: newUserRole,
          company_ids: newUserCompanies
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error updating user:', errorData);
        throw new Error(errorData.error || `Failed to update user: ${response.status}`);
      }
      
      const userData = await response.json();
      console.log('User updated successfully:', userData.id);
      
      // Update users list
      setUsers(users.map(user => user.id === userData.id ? userData : user));
      setNotification('User updated successfully');
      
      // Close dialog
      setEditDialogOpen(false);
      setCurrentUser(null);
    } catch (err: any) {
      console.error('Error updating user:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Get company name by ID
  const getCompanyName = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : 'Unknown';
  };

  // Render company chips for user
  const renderCompanyChips = (companyIds: string[]) => {
    return companyIds.map(id => (
      <Chip 
        key={id} 
        label={getCompanyName(id)} 
        size="small" 
        sx={{ mr: 0.5, mb: 0.5 }}
      />
    ));
  };

  // Update onboarding step status
  const handleUpdateStepStatus = async (companyId: string, stepId: string, newStatus: 'todo' | 'in_progress' | 'done') => {
    try {
      setUpdatingStep(`${companyId}-${stepId}`);
      setError('');
      const token = await getToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      console.log(`Updating step ${stepId} for company ${companyId} to status: ${newStatus}`);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/companies/${companyId}/onboarding/${stepId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error updating step status:', errorData);
        throw new Error(errorData.error || `Failed to update step status: ${response.status}`);
      }
      
      const updatedStep = await response.json();
      console.log('Step updated successfully:', updatedStep);
      
      // Update the companiesWithSteps state
      setCompaniesWithSteps(prevCompanies => 
        prevCompanies.map(company => {
          if (company.id === companyId && company.onboarding_steps) {
            return {
              ...company,
              onboarding_steps: company.onboarding_steps.map(step => 
                step.id === stepId ? { ...step, status: newStatus, updated_at: new Date().toISOString() } : step
              )
            };
          }
          return company;
        })
      );
      
      setNotification('Onboarding step updated successfully');
    } catch (err: any) {
      console.error('Error updating step status:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setUpdatingStep(null);
    }
  };

  // Get status icon based on step status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckIcon color="success" />;
      case 'in_progress':
        return <AccessTimeIcon color="warning" />;
      default:
        return <ErrorIcon color="disabled" />;
    }
  };

  // Get text representation of status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'done':
        return 'Done';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'To Do';
    }
  };

  if (!isAdmin) {
    return (
      <Paper sx={{ p: 3, m: 3 }}>
        <Typography variant="h5" color="error">
          Access Denied
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          You do not have administrator privileges to access this page.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
            <Tab label="Users" id="tab-0" />
            <Tab label="Companies" id="tab-1" />
            <Tab label="Onboarding Steps" id="tab-2" />
          </Tabs>
        </Box>
        
        {/* Error notification */}
        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}
        
        {/* Success notification */}
        <Snackbar
          open={!!notification}
          autoHideDuration={6000}
          onClose={() => setNotification('')}
          message={notification}
        />
        
        {/* Users Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">User Management</Typography>
            <Button 
              variant="contained" 
              startIcon={<PersonAddIcon />}
              onClick={() => setUserDialogOpen(true)}
            >
              Add User
            </Button>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>Display Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Companies</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.display_name}</TableCell>
                      <TableCell>
                        <Chip 
                          label={user.role} 
                          color={user.role === 'admin' ? 'error' : user.role === 'manager' ? 'warning' : 'default'}
                        />
                      </TableCell>
                      <TableCell>{renderCompanyChips(user.company_ids)}</TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <IconButton 
                          onClick={() => handleEditUser(user)}
                          size="small"
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>
        
        {/* Companies Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Company Management</Typography>
            <Button 
              variant="contained" 
              startIcon={<BusinessIcon />}
              onClick={() => setCompanyDialogOpen(true)}
            >
              Add Company
            </Button>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Users</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>{company.name}</TableCell>
                      <TableCell>{new Date(company.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{company.user_ids?.length || 0} users</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>
        
        {/* Onboarding Steps Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Onboarding Steps Management</Typography>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              {companiesWithSteps.length === 0 ? (
                <Alert severity="info">No companies found. Create a company first to manage onboarding steps.</Alert>
              ) : (
                companiesWithSteps.map((company) => (
                  <Accordion key={company.id} sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1" fontWeight="bold">{company.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {!company.onboarding_steps || company.onboarding_steps.length === 0 ? (
                        <Alert severity="info">No onboarding steps found for this company.</Alert>
                      ) : (
                        <TableContainer component={Paper} variant="outlined">
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Step Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Last Updated</TableCell>
                                <TableCell>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {company.onboarding_steps.map((step) => (
                                <TableRow key={step.id}>
                                  <TableCell>{step.name}</TableCell>
                                  <TableCell>{step.description}</TableCell>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      {getStatusIcon(step.status)}
                                      <Typography variant="body2" sx={{ ml: 1 }}>
                                        {getStatusText(step.status)}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    {new Date(step.updated_at).toLocaleString()}
                                  </TableCell>
                                  <TableCell>
                                    <FormControl sx={{ minWidth: 120 }} size="small">
                                      <Select
                                        value={step.status}
                                        onChange={(e) => handleUpdateStepStatus(company.id, step.id, e.target.value as 'todo' | 'in_progress' | 'done')}
                                        disabled={updatingStep === `${company.id}-${step.id}`}
                                      >
                                        <MenuItem value="todo">To Do</MenuItem>
                                        <MenuItem value="in_progress">In Progress</MenuItem>
                                        <MenuItem value="done">Done</MenuItem>
                                      </Select>
                                    </FormControl>
                                    {updatingStep === `${company.id}-${step.id}` && (
                                      <CircularProgress size={20} sx={{ ml: 1 }} />
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))
              )}
            </Box>
          )}
        </TabPanel>
      </Paper>
      
      {/* Create User Dialog */}
      <Dialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password (leave blank for default)"
            type="password"
            value={newUserPassword}
            onChange={(e) => setNewUserPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Display Name"
            value={newUserDisplayName}
            onChange={(e) => setNewUserDisplayName(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={newUserRole}
              label="Role"
              onChange={(e) => setNewUserRole(e.target.value)}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Companies</InputLabel>
            <Select
              multiple
              value={newUserCompanies}
              label="Companies"
              onChange={(e) => setNewUserCompanies(typeof e.target.value === 'string' ? [e.target.value] : e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={getCompanyName(value)} />
                  ))}
                </Box>
              )}
            >
              {companies.map((company) => (
                <MenuItem key={company.id} value={company.id}>
                  {company.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateUser} 
            variant="contained"
            disabled={!newUserEmail}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Create Company Dialog */}
      <Dialog open={companyDialogOpen} onClose={() => setCompanyDialogOpen(false)}>
        <DialogTitle>Add New Company</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Company Name"
            value={newCompanyName}
            onChange={(e) => setNewCompanyName(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Assign Users</InputLabel>
            <Select
              multiple
              value={newCompanyUsers}
              label="Assign Users"
              onChange={(e) => setNewCompanyUsers(typeof e.target.value === 'string' ? [e.target.value] : e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const user = users.find(u => u.id === value);
                    return <Chip key={value} label={user?.email || value} />;
                  })}
                </Box>
              )}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompanyDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateCompany} 
            variant="contained"
            disabled={!newCompanyName}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            fullWidth
            label="Email"
            value={currentUser?.email || ''}
            disabled
          />
          <TextField
            margin="normal"
            fullWidth
            label="Display Name"
            value={newUserDisplayName}
            onChange={(e) => setNewUserDisplayName(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={newUserRole}
              label="Role"
              onChange={(e) => setNewUserRole(e.target.value)}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Companies</InputLabel>
            <Select
              multiple
              value={newUserCompanies}
              label="Companies"
              onChange={(e) => setNewUserCompanies(typeof e.target.value === 'string' ? [e.target.value] : e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={getCompanyName(value)} />
                  ))}
                </Box>
              )}
            >
              {companies.map((company) => (
                <MenuItem key={company.id} value={company.id}>
                  {company.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateUser} 
            variant="contained"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPanel; 