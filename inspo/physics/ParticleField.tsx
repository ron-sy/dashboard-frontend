import React from 'react';
import Gravity, { MatterBody } from './Gravity';
import { styled } from '@mui/material';

// Styled hexagon particle
const Hexagon = styled('div')({
  position: 'relative',
  backgroundColor: '#fff',
  clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
});

interface ParticleFieldProps {
  particleCount?: number;
  className?: string;
  noGoZone?: boolean;
}

const ParticleField: React.FC<ParticleFieldProps> = ({ 
  particleCount = 150,
  className,
  noGoZone = false
}) => {
  // Function to determine max size based on screen width
  const getMaxSize = () => {
    const width = window.innerWidth;
    if (width < 640) return 20; // sm breakpoint
    if (width < 768) return 30; // md breakpoint
    return 40;
  };

  // Function to determine min size based on screen width
  const getMinSize = () => {
    return window.innerWidth < 640 ? 10 : 20;
  };

  // Generate particles with varying sizes
  const particles = Array.from({ length: particleCount }).map((_, index) => {
    const x = `${Math.random() * 100}%`;
    const y = `${Math.random() * 100}%`;
    
    const minSize = getMinSize();
    const maxSize = getMaxSize();
    const size = Math.max(minSize, Math.random() * maxSize);
    const opacity = Math.random() * 0.4 + 0.6; // Random opacity between 0.6 and 1.0
    const rotation = Math.random() * 360; // Random rotation for hexagons
    
    return (
      <MatterBody 
        key={index} 
        x={x} 
        y={y} 
        bodyType="circle" // Keep as circle for physics (better collision)
        matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
      >
        <Hexagon 
          style={{ 
            width: `${size}px`, 
            height: `${size}px`,
            backgroundColor: `rgba(255, 255, 255, ${opacity})`,
            transform: `rotate(${rotation}deg)`
          }} 
        />
      </MatterBody>
    );
  });

  // Define the no-go zone for the text
  const noGoZoneConfig = noGoZone ? {
    x: '50%',
    y: '50%',
    width: 400,
    height: 150,
    repelStrength: 0.0015
  } : undefined;

  return (
    <Gravity 
      attractorStrength={0.0}
      cursorStrength={0.0004}
      cursorFieldRadius={200}
      className={className}
      noGoZone={noGoZoneConfig}
    >
      {particles}
    </Gravity>
  );
};

export default ParticleField; 
