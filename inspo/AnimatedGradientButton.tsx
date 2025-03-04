import React from 'react';
import { Button, styled } from '@mui/material';

// Main container with fixed dimensions
const ButtonContainer = styled('div')({
  position: 'relative',
  width: '100%',
  height: '42px',
  borderRadius: '8px',
  marginTop: '16px',
  marginBottom: '16px',
  overflow: 'hidden',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
});

// Static gradient background - much lighter blues
const GradientBg = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(to right,rgb(52, 110, 182),rgb(0, 68, 91),rgb(2, 27, 56))',
});

// Moving shine effect
const ShineEffect = styled('div')({
  position: 'absolute',
  top: 0,
  left: '-100%',
  width: '100%',
  height: '100%',
  background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.6), transparent)',
  animation: 'moveShine 3s infinite',
  '@keyframes moveShine': {
    '0%': { left: '-100%' },
    '100%': { left: '100%' }
  }
});

// Button with transparent background to show gradient
const StyledButton = styled(Button)({
  position: 'relative',
  width: '100%',
  height: '100%',
  backgroundColor: 'transparent',
  color: 'white',
  fontSize: '15px',
  fontWeight: 600,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  '&.Mui-disabled': {
    color: 'rgba(255, 255, 255, 0.7)',
  }
});

interface AnimatedGradientButtonProps {
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const AnimatedGradientButton: React.FC<AnimatedGradientButtonProps> = ({
  onClick,
  disabled,
  loading,
  children
}) => {
  return (
    <ButtonContainer>
      <GradientBg />
      <ShineEffect />
      <StyledButton
        onClick={onClick}
        disabled={disabled || loading}
        disableElevation
        fullWidth
      >
        {loading ? "Signing in..." : children}
      </StyledButton>
    </ButtonContainer>
  );
};

export default AnimatedGradientButton; 