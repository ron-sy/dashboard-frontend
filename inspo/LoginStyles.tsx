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

export const GraphicContent = styled(Box)({
  flex: 1,
  position: 'relative',
  width: '100%',
  height: '100%'
});

export const GraphicFooter = styled(Box)(({ theme }) => ({
  padding: '24px 40px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  color: 'rgba(255, 255, 255, 0.9)',
  borderTop: '1px solid rgba(255, 255, 255, 0.2)',
  zIndex: 10,
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '16px',
    textAlign: 'center',
    padding: '24px 20px'
  }
}));

export const GraphicFooterLinks = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '24px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '12px'
  }
}));

export const GraphicFooterLink = styled('a')({
  color: 'rgba(255, 255, 255, 0.9)',
  textDecoration: 'none',
  fontSize: '14px',
  transition: 'color 0.15s ease',
  '&:hover': {
    color: '#FFFFFF',
    textDecoration: 'underline'
  }
});

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

export const LoginButton = styled(Button)(({ theme }) => ({
  marginTop: '24px',
  marginBottom: '24px',
  padding: '9px 0',
  height: '42px',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '20px',
  borderRadius: '6px',
  textTransform: 'none',
  backgroundColor: theme.palette.primary.main,
  transition: 'all 0.15s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'translateY(-1px)',
    boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)'
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: 'none'
  }
}));

export const SocialButton = styled(Button)(({ theme }) => ({
  width: '100%',
  marginBottom: '10px',
  padding: '8px 16px',
  height: '40px',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '20px',
  borderRadius: '6px',
  textTransform: 'none',
  color: '#374151',
  backgroundColor: '#FFFFFF',
  border: '1px solid #E5E7EB',
  justifyContent: 'flex-start',
  '& .MuiButton-startIcon': {
    marginRight: '12px',
    marginLeft: '0'
  },
  '&.Mui-disabled': {
    backgroundColor: '#F9FAFB',
    color: '#9CA3AF',
    cursor: 'not-allowed',
    '&:hover': {
      backgroundColor: '#F9FAFB',
      '&::after': {
        content: '"Coming Soon"',
        position: 'absolute',
        right: '16px',
        fontSize: '12px',
        fontWeight: 400,
        color: '#6B7280',
        backgroundColor: '#F9FAFB',
        paddingLeft: '8px'
      }
    }
  }
}));

export const ErrorAlert = styled(Alert)(({ theme }) => ({
  marginBottom: '24px',
  borderRadius: '6px',
  padding: '8px 12px',
  '& .MuiAlert-message': {
    padding: '4px 0',
    fontSize: '14px'
  },
  '& .MuiAlert-icon': {
    fontSize: '20px',
    padding: '4px 0'
  }
}));

export const Divider = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  margin: '16px 0',
  '&::before, &::after': {
    content: '""',
    flex: 1,
    borderBottom: '1px solid #E5E7EB'
  },
  '& span': {
    padding: '0 12px',
    color: '#6B7280',
    fontSize: '13px',
    lineHeight: '16px'
  }
}));

export const FooterText = styled(Typography)(({ theme }) => ({
  color: '#6B7280',
  fontSize: '14px',
  lineHeight: '20px',
  textAlign: 'center',
  marginBottom: '8px',
  '& a': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    fontWeight: 500,
    transition: 'all 0.15s ease',
    '&:hover': {
      color: theme.palette.primary.dark,
      textDecoration: 'underline'
    }
  }
}));

export const Footer = styled(Box)(({ theme }) => ({
  borderTop: '1px solid #E5E7EB',
  padding: '24px 40px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '16px',
    textAlign: 'center',
    padding: '24px 20px'
  }
}));

export const FooterLinks = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '24px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '12px'
  }
}));

export const FooterLink = styled('a')(({ theme }) => ({
  color: '#6B7280',
  fontSize: '14px',
  textDecoration: 'none',
  transition: 'color 0.15s ease',
  '&:hover': {
    color: '#111827'
  }
}));

export const CompanyTitle = styled(Typography)(({ theme }) => ({
  fontSize: '13px',
  lineHeight: '16px',
  fontWeight: 600,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: 'rgba(255, 255, 255, 0.9)',
  marginBottom: '16px'
}));

export const CompanyDescription = styled(Typography)(({ theme }) => ({
  fontSize: '30px',
  lineHeight: '36px',
  fontWeight: 600,
  color: 'white',
  marginBottom: '48px',
  maxWidth: '420px',
  textAlign: 'center'
})); 
