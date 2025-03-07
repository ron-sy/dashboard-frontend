import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  alpha,
  useTheme,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Tooltip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import InfoIcon from '@mui/icons-material/Info';
import { useAuth } from '../context/AuthContext';

interface BillingTier {
  name: string;
  description: string;
  features: string[];
  limits: {
    ai_agents: number;
    users: number;
    storage: string;
  };
  price: number;
  active: boolean;
  isDefault: boolean;
  comingSoon?: boolean;
}

interface BillingData {
  form_of_payment: 'credit' | 'check' | 'wire_transfer';
  payment_transferred: number;
  payment_due: number;
  payment_remaining: number;
  tier: string;
  payment_history: Array<{
    payment_id: string;
    form_of_payment: 'credit' | 'check' | 'wire_transfer';
    date_processed: string;
    total: number;
    status: string;
  }>;
}

interface BillingTiersData {
  current_tier: string;
  available_tiers: {
    [key: string]: BillingTier;
  };
  last_updated: string;
}

interface Company {
  id: string;
  name: string;
}

// Currency formatter
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const Billing: React.FC = () => {
  const theme = useTheme();
  const { getToken } = useAuth();
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [billingTiers, setBillingTiers] = useState<BillingTiersData | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [showCopyConfirmation, setShowCopyConfirmation] = useState(false);

  // Fetch companies first
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Fetch billing data when company is selected
  useEffect(() => {
    if (selectedCompanyId) {
      fetchBillingData();
      fetchBillingTiers();
    }
  }, [selectedCompanyId]);

  const fetchCompanies = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/companies`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }

      const data = await response.json();
      setCompanies(data);
      
      // If user has access to only one company, select it automatically
      if (data.length === 1) {
        setSelectedCompanyId(data[0].id);
      }
    } catch (err: any) {
      console.error("Error fetching companies:", err);
      setError(err.message);
    }
  };

  const fetchBillingData = async () => {
    if (!selectedCompanyId) return;
    
    try {
      setLoading(true);
      console.log("Fetching billing data...");
      const token = await getToken();
      console.log("Got auth token");
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/companies/${selectedCompanyId}/billing`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("Billing API response status:", response.status);
      
      if (!response.ok) {
        throw new Error('Failed to fetch billing data');
      }

      const data = await response.json();
      console.log("Received billing data:", data);
      setBillingData(data);
    } catch (err: any) {
      console.error("Error fetching billing data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBillingTiers = async () => {
    if (!selectedCompanyId) return;
    
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/companies/${selectedCompanyId}/billing/tiers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch billing tiers');
      }

      const data = await response.json();
      setBillingTiers(data);
    } catch (err: any) {
      console.error("Error fetching billing tiers:", err);
      setError(err.message);
    }
  };

  const handlePaymentMethodUpdate = async (form_of_payment: 'credit' | 'check' | 'wire_transfer') => {
    if (!selectedCompanyId) return;
    
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/companies/${selectedCompanyId}/billing`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ form_of_payment })
      });

      if (!response.ok) {
        throw new Error('Failed to update payment method');
      }

      const data = await response.json();
      setBillingData(data);
      setSuccess('Payment method updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleAddPayment = async (total: number) => {
    if (!selectedCompanyId || !billingData) return;
    
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/companies/${selectedCompanyId}/billing/payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          form_of_payment: billingData.form_of_payment,
          total
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add payment');
      }

      const data = await response.json();
      setBillingData(data);
      setSuccess('Payment added successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('sales@syntheticteams.com');
    setShowCopyConfirmation(true);
    setTimeout(() => {
      setShowCopyConfirmation(false);
    }, 3000);
  };

  if (loading && !companies.length) {
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
            Billing & Payments
          </Typography>
          
          {companies.length > 1 && (
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Select Company</InputLabel>
              <Select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                label="Select Company"
              >
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>

        {!selectedCompanyId ? (
          <Alert severity="info">Please select a company to view billing information.</Alert>
        ) : loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Billing Tiers */}
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ color: 'white', mb: 3 }}>
                Billing Tiers
              </Typography>
              <Grid container spacing={3}>
                {billingTiers && Object.entries(billingTiers.available_tiers).map(([tierId, tier]) => (
                  <Grid item xs={12} md={6} key={tierId}>
                    <Paper sx={{ 
                      p: 3,
                      background: alpha('#111111', 0.7),
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${tier.active ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.1)'}`,
                      position: 'relative',
                      opacity: tier.active ? 1 : 0.7
                    }}>
                      {tier.comingSoon && (
                        <Chip
                          label="Coming Soon"
                          color="primary"
                          size="small"
                          sx={{ 
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            backgroundColor: alpha(theme.palette.primary.main, 0.2)
                          }}
                        />
                      )}
                      
                      <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                        {tier.name}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                        {tier.description}
                      </Typography>
                      
                      {/* Show price only for non-Pro tiers */}
                      {!tierId.includes('L03_PRO') ? (
                        <Typography variant="h4" sx={{ color: 'white', mb: 3 }}>
                          {formatCurrency(tier.price)}
                          <Typography component="span" variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>
                            /year
                          </Typography>
                        </Typography>
                      ) : (
                        <Typography variant="subtitle1" sx={{ color: theme.palette.primary.main, mb: 3 }}>
                          Custom pricing for enterprise needs
                        </Typography>
                      )}

                      <List>
                        {tier.features.map((feature, index) => (
                          <ListItem key={index} sx={{ py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <CheckCircleIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={feature}
                              sx={{ 
                                '& .MuiListItemText-primary': { 
                                  color: 'text.secondary',
                                  fontSize: '0.875rem'
                                }
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>

                      {tierId.includes('L03_PRO') ? (
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{ mt: 2, backgroundColor: theme.palette.primary.main }}
                          onClick={handleCopyEmail}
                        >
                          Contact Sales
                        </Button>
                      ) : tier.comingSoon ? (
                        <Tooltip title="This tier will be available soon">
                          <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<LockIcon />}
                            disabled
                            sx={{ mt: 2 }}
                          >
                            Coming Soon
                          </Button>
                        </Tooltip>
                      ) : tier.active ? (
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{ mt: 2 }}
                          disabled
                        >
                          Current Plan
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          fullWidth
                          sx={{ mt: 2 }}
                          disabled
                        >
                          Contact Sales
                        </Button>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Payment Method Section */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ 
                p: 3,
                background: alpha('#111111', 0.7),
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                  Payment Method
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Form of Payment</InputLabel>
                  <Select
                    value={billingData?.form_of_payment || 'credit'}
                    onChange={(e) => handlePaymentMethodUpdate(e.target.value as 'credit' | 'check' | 'wire_transfer')}
                  >
                    <MenuItem value="credit">Credit Card</MenuItem>
                    <MenuItem value="check">Check</MenuItem>
                    <MenuItem value="wire_transfer">Wire Transfer</MenuItem>
                  </Select>
                </FormControl>

                {/* Bank Details Box */}
                {(billingData?.form_of_payment === 'check' || billingData?.form_of_payment === 'wire_transfer') && (
                  <Box sx={{ 
                    mt: 3,
                    p: 2,
                    borderRadius: 1,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: alpha(theme.palette.primary.main, 0.1),
                  }}>
                    <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                      Bank Details
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                      Synthetic Teams Inc.
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                      Account Number: <Box component="span" sx={{ color: 'white' }}>267441518433956</Box>
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                      Routing Number: <Box component="span" sx={{ color: 'white' }}>121145349</Box>
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Beneficiary Address: <Box component="span" sx={{ color: 'white' }}>6 St Johns Ln, New York, NY, 10013</Box>
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Payment Summary Section */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ 
                p: 3,
                background: alpha('#111111', 0.7),
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                  Payment Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body1" color="text.secondary">
                      Payment Due: {formatCurrency(billingData?.payment_due || 0)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1" color="text.secondary">
                      Payment Transferred: {formatCurrency(billingData?.payment_transferred || 0)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1" color="text.secondary">
                      Payment Remaining: {formatCurrency(billingData?.payment_remaining || 0)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Payment History Section */}
            <Grid item xs={12}>
              <Paper sx={{ 
                p: 3,
                background: alpha('#111111', 0.7),
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                  Payment History
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Form of Payment</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {billingData?.payment_history.map((payment, index) => (
                        <TableRow key={payment.payment_id}>
                          <TableCell>{payment.payment_id}</TableCell>
                          <TableCell>{new Date(payment.date_processed).toLocaleDateString()}</TableCell>
                          <TableCell>{payment.form_of_payment}</TableCell>
                          <TableCell>{payment.status || 'processing'}</TableCell>
                          <TableCell align="right">{formatCurrency(payment.total)}</TableCell>
                        </TableRow>
                      ))}
                      {(!billingData?.payment_history || billingData.payment_history.length === 0) && (
                        <TableRow>
                          <TableCell colSpan={5} align="center">No payment history available</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
      {showCopyConfirmation && (
        <Alert 
          severity="success" 
          sx={{ 
            position: 'fixed', 
            bottom: 20, 
            right: 20, 
            zIndex: 1000,
            width: '300px'
          }}
        >
          Email copied to clipboard: sales@syntheticteams.com
        </Alert>
      )}
    </Box>
  );
};

export default Billing; 

