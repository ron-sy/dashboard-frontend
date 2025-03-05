import { Box, Paper, TextField, Button, Typography, Alert, Container, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';

export const LoginContainer = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  position: 'relative',
  backgroundColor: '#FFFFFF',
  flexDirection: 'column',
  overflow: 'hidden'
}));

export const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  position: 'relative',
  overflow: 'hidden'
}));

export const LoginSection = styled(Box)(({ theme }) => ({
  width: '50%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    width: '100%'
  }
}));

export const LoginContent = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px 40px 24px',
  overflow: 'auto',
  [theme.breakpoints.down('md')]: {
    padding: '24px 20px 24px'
  }
}));

export const LoginFooter = styled(Box)(({ theme }) => ({
  padding: '16px 40px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTop: '1px solid #E5E7EB',
  fontSize: '12px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '12px',
    textAlign: 'center',
    padding: '16px 20px'
  }
}));

export const LoginFooterLinks = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '24px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '8px'
  }
}));

export const LoginFooterLink = styled('a')({
  color: '#6B7280',
  textDecoration: 'none',
  fontSize: '12px',
  transition: 'color 0.15s ease',
  '&:hover': {
    color: '#4B5563',
    textDecoration: 'underline'
  }
});

export const Copyright = styled(Typography)({
  color: '#6B7280',
  fontSize: '12px'
});

export const GraphicSection = styled(Box)(({ theme }) => ({
  width: '50%',
  background: 'linear-gradient(135deg, #B8D3F2 0%, #86B1F2 50%, #4F83CC 100%)',
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}));

export const OverlayText = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  color: 'white',
  fontSize: '28px',
  fontWeight: 700,
  textAlign: 'center',
  lineHeight: 1.2,
  maxWidth: '80%',
  zIndex: 10,
  textShadow: '0 2px 10px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 0, 0, 0.3)',
  padding: '16px',
  [theme.breakpoints.down('lg')]: {
    fontSize: '24px',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '22px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '20px',
    maxWidth: '90%',
  }
}));

export const Logo = styled('div')(({ theme }) => ({
  width: '180px',
  height: '64px',
  margin: '0 auto 32px auto',
  color: '#000000',
  '& svg': {
    width: '100%',
    height: '100%'
  },
  [theme.breakpoints.down('sm')]: {
    width: '150px',
    height: '54px',
    margin: '0 auto 24px auto',
  }
}));

export const LoginPaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: '448px',
  padding: '24px',
  background: '#FFFFFF',
  boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
  borderRadius: '8px',
  border: '1px solid #E5E7EB',
  marginBottom: '16px',
  transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
  '&:hover': {
    boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
    borderColor: '#D1D5DB'
  },
  '& > h1': {
    fontSize: '20px',
    lineHeight: '20px',
    fontWeight: 600,
    marginBottom: '24px',
    color: '#111827'
  }
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: '16px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '6px',
    backgroundColor: '#FFFFFF',
    transition: 'all 0.15s ease',
    height: '40px',
    '& fieldset': {
      borderColor: '#D1D5DB',
      borderWidth: '1px',
      transition: 'border-color 0.15s ease'
    },
    '&:hover fieldset': {
      borderColor: '#9CA3AF',
    },
    '&.Mui-focused': {
      '& fieldset': {
        borderColor: theme.palette.primary.main,
        borderWidth: '2px'
      }
    }
  },
  '& .MuiInputLabel-root': {
    color: '#6B7280',
    fontSize: '14px',
    transform: 'translate(14px, 12px) scale(1)',
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.75)',
    }
  },
  '& .MuiInputBase-input': {
    padding: '10px 14px',
    fontSize: '14px',
    lineHeight: '20px',
    color: '#111827',
    '&::placeholder': {
      color: '#9CA3AF',
      opacity: 1
    }
  }
}));

export const SocialButton = styled(Button)(({ theme }) => ({
  marginBottom: '12px',
  padding: '8px 16px',
  height: '40px',
  fontSize: '14px',
  fontWeight: 500,
  textTransform: 'none',
  backgroundColor: '#FFFFFF',
  color: '#374151',
  border: '1px solid #D1D5DB',
  borderRadius: '6px',
  '&:hover': {
    backgroundColor: '#F9FAFB',
    borderColor: '#9CA3AF'
  },
  '&.Mui-disabled': {
    backgroundColor: '#F3F4F6',
    color: '#9CA3AF',
    borderColor: '#E5E7EB'
  },
  '& .MuiButton-startIcon': {
    marginRight: '12px'
  }
}));

export const ErrorAlert = styled(Alert)(({ theme }) => ({
  marginBottom: '16px',
  borderRadius: '6px',
  '& .MuiAlert-message': {
    padding: '4px 0'
  }
}));

export const Divider = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  margin: '24px 0',
  color: '#6B7280',
  fontSize: '14px',
  '&::before, &::after': {
    content: '""',
    flex: 1,
    borderBottom: '1px solid #E5E7EB'
  },
  '& span': {
    margin: '0 16px'
  }
}));

export const FooterText = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  color: '#6B7280',
  fontSize: '14px',
  '& a': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    fontWeight: 500,
    '&:hover': {
      textDecoration: 'underline'
    }
  }
})); 