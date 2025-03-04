import React, { useEffect, useRef, useState } from 'react';
import * as Matter from 'matter-js';

interface GravityProps {
  children: React.ReactNode;
  attractorPoint?: { x: number | string; y: number | string };
  attractorStrength?: number;
  cursorStrength?: number;
  cursorFieldRadius?: number;
  resetOnResize?: boolean;
  addTopWall?: boolean;
  autoStart?: boolean;
  className?: string;
  noGoZone?: {
    x: number | string;
    y: number | string;
    width: number;
    height: number;
    repelStrength?: number;
  };
}

interface MatterBodyProps {
  children: React.ReactNode;
  x: number | string;
  y: number | string;
  bodyType?: 'rectangle' | 'circle';
  mass?: number;
  restitution?: number;
  friction?: number;
  frictionAir?: number;
  matterBodyOptions?: any;
  className?: string;
}

// Helper to convert percentage to pixels
const percentToPixels = (percent: string, dimension: number): number => {
  return (parseFloat(percent) / 100) * dimension;
};

// Helper to get position in pixels
const getPositionInPixels = (
  pos: number | string,
  dimension: number
): number => {
  if (typeof pos === 'string' && pos.endsWith('%')) {
    return percentToPixels(pos, dimension);
  }
  return typeof pos === 'number' ? pos : parseFloat(pos);
};

export const MatterBody: React.FC<MatterBodyProps> = ({
  children,
  x,
  y,
  bodyType = 'circle',
  mass = 1,
  restitution = 0.2,
  friction = 0.5,
  frictionAir = 0.05,
  matterBodyOptions,
  className,
}) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [bodyId] = useState(`body-${Math.random().toString(36).substr(2, 9)}`);

  return (
    <div
      ref={bodyRef}
      className={`matter-body ${className || ''}`}
      data-matter-body-id={bodyId}
      data-matter-body-type={bodyType}
      data-matter-body-x={x}
      data-matter-body-y={y}
      data-matter-body-mass={mass}
      data-matter-body-restitution={restitution}
      data-matter-body-friction={friction}
      data-matter-body-friction-air={frictionAir}
      data-matter-body-options={matterBodyOptions ? JSON.stringify(matterBodyOptions) : ''}
      style={{ position: 'absolute', transform: 'translate(-50%, -50%)' }}
    >
      {children}
    </div>
  );
};

const Gravity: React.FC<GravityProps> = ({
  children,
  attractorPoint = { x: '50%', y: '50%' },
  attractorStrength = 0.0,
  cursorStrength = 0.0004,
  cursorFieldRadius = 200,
  resetOnResize = true,
  addTopWall = true,
  autoStart = true,
  className,
  noGoZone,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const bodiesRef = useRef<{ [key: string]: Matter.Body }>({});
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize physics engine
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 0 },
    });
    engineRef.current = engine;

    // Create runner with slower update rate
    const runner = Matter.Runner.create({
      delta: 1000 / 30, // 30 fps instead of default 60 fps
      isFixed: true
    });
    runnerRef.current = runner;

    // Get container dimensions
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    // Create walls
    const wallOptions = { isStatic: true, restitution: 0.3 };
    const walls = [
      Matter.Bodies.rectangle(containerWidth / 2, containerHeight + 50, containerWidth + 100, 100, wallOptions), // bottom
      Matter.Bodies.rectangle(-50, containerHeight / 2, 100, containerHeight + 100, wallOptions), // left
      Matter.Bodies.rectangle(containerWidth + 50, containerHeight / 2, 100, containerHeight + 100, wallOptions), // right
    ];

    if (addTopWall) {
      walls.push(Matter.Bodies.rectangle(containerWidth / 2, -50, containerWidth + 100, 100, wallOptions)); // top
    }

    Matter.World.add(engine.world, walls);

    // Create bodies for each child with data-matter-body-id
    const bodyElements = containerRef.current.querySelectorAll('[data-matter-body-id]');
    bodyElements.forEach((element) => {
      const el = element as HTMLElement;
      const bodyId = el.dataset.matterBodyId as string;
      const bodyType = el.dataset.matterBodyType as string;
      const x = getPositionInPixels(el.dataset.matterBodyX as string, containerWidth);
      const y = getPositionInPixels(el.dataset.matterBodyY as string, containerHeight);
      const mass = parseFloat(el.dataset.matterBodyMass as string) || 1;
      const restitution = parseFloat(el.dataset.matterBodyRestitution as string) || 0.2;
      const friction = parseFloat(el.dataset.matterBodyFriction as string) || 0.5;
      const frictionAir = parseFloat(el.dataset.matterBodyFrictionAir as string) || 0.05;

      const width = el.offsetWidth;
      const height = el.offsetHeight;

      // Parse additional options if provided
      let additionalOptions = {};
      if (el.dataset.matterBodyOptions) {
        try {
          additionalOptions = JSON.parse(el.dataset.matterBodyOptions);
        } catch (e) {
          console.error('Failed to parse matter body options', e);
        }
      }

      let body;
      if (bodyType === 'circle') {
        const radius = Math.max(width, height) / 2;
        body = Matter.Bodies.circle(x, y, radius, {
          mass,
          restitution,
          friction,
          frictionAir,
          inertia: Infinity, // Prevent rotation
          inverseInertia: 0,
          ...additionalOptions
        });
      } else {
        body = Matter.Bodies.rectangle(x, y, width, height, {
          mass,
          restitution,
          friction,
          frictionAir,
          inertia: Infinity, // Prevent rotation
          inverseInertia: 0,
          ...additionalOptions
        });
      }

      bodiesRef.current[bodyId] = body;
      Matter.World.add(engine.world, body);
    });

    // Handle mouse move for cursor attractor
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        mousePosition.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }
    };

    containerRef.current.addEventListener('mousemove', handleMouseMove);

    // Apply attractor forces
    Matter.Events.on(engine, 'beforeUpdate', () => {
      const bodies = Matter.Composite.allBodies(engine.world);
      
      // Static attractor point
      const attractorX = getPositionInPixels(attractorPoint.x, containerWidth);
      const attractorY = getPositionInPixels(attractorPoint.y, containerHeight);

      // No-go zone calculations
      let noGoX = 0;
      let noGoY = 0;
      let noGoWidth = 0;
      let noGoHeight = 0;
      let noGoRepelStrength = 0.001;

      if (noGoZone) {
        noGoX = getPositionInPixels(noGoZone.x, containerWidth);
        noGoY = getPositionInPixels(noGoZone.y, containerHeight);
        noGoWidth = noGoZone.width;
        noGoHeight = noGoZone.height;
        noGoRepelStrength = noGoZone.repelStrength || 0.001;
      }

      bodies.forEach((body: Matter.Body) => {
        if (!body.isStatic) {
          // Limit maximum velocity
          const maxVelocity = 2;
          if (Math.abs(body.velocity.x) > maxVelocity || Math.abs(body.velocity.y) > maxVelocity) {
            const velocityMagnitude = Math.sqrt(body.velocity.x * body.velocity.x + body.velocity.y * body.velocity.y);
            const scale = maxVelocity / velocityMagnitude;
            Matter.Body.setVelocity(body, {
              x: body.velocity.x * scale,
              y: body.velocity.y * scale
            });
          }

          // Apply force from static attractor if strength > 0
          if (attractorStrength > 0) {
            const forceX = (attractorX - body.position.x) * attractorStrength;
            const forceY = (attractorY - body.position.y) * attractorStrength;
            Matter.Body.applyForce(body, body.position, { x: forceX, y: forceY });
          }

          // Apply repelling force from no-go zone if defined
          if (noGoZone) {
            const halfWidth = noGoWidth / 2;
            const halfHeight = noGoHeight / 2;
            
            // Check if the body is inside or near the no-go zone
            if (
              body.position.x > noGoX - halfWidth - 50 && 
              body.position.x < noGoX + halfWidth + 50 &&
              body.position.y > noGoY - halfHeight - 50 && 
              body.position.y < noGoY + halfHeight + 50
            ) {
              // Calculate direction away from center of no-go zone
              const dx = body.position.x - noGoX;
              const dy = body.position.y - noGoY;
              
              // Calculate distance from center
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              // Normalize direction and apply force
              if (distance > 0) {
                const normalizedDx = dx / distance;
                const normalizedDy = dy / distance;
                
                // Force is stronger when closer to the center
                const forceMagnitude = noGoRepelStrength * (1 + (halfWidth - Math.min(Math.abs(dx), halfWidth)) / halfWidth);
                
                Matter.Body.applyForce(body, body.position, {
                  x: normalizedDx * forceMagnitude,
                  y: normalizedDy * forceMagnitude
                });
              }
            }
          }

          // Apply force from cursor
          const dx = mousePosition.current.x - body.position.x;
          const dy = mousePosition.current.y - body.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < cursorFieldRadius) {
            const force = cursorStrength * (1 - distance / cursorFieldRadius);
            Matter.Body.applyForce(body, body.position, {
              x: dx * force,
              y: dy * force,
            });
          }
        }
      });
    });

    // Update DOM elements based on physics bodies
    Matter.Events.on(engine, 'afterUpdate', () => {
      Object.entries(bodiesRef.current).forEach(([id, body]) => {
        const element = containerRef.current?.querySelector(`[data-matter-body-id="${id}"]`) as HTMLElement;
        if (element) {
          element.style.left = `${body.position.x}px`;
          element.style.top = `${body.position.y}px`;
          element.style.transform = `translate(-50%, -50%)`;
        }
      });
    });

    // Start the physics simulation
    if (autoStart) {
      Matter.Runner.run(runner, engine);
    }

    // Handle window resize
    const handleResize = () => {
      if (resetOnResize && containerRef.current) {
        // Stop the current simulation
        Matter.Runner.stop(runner);
        Matter.World.clear(engine.world, false);
        Matter.Engine.clear(engine);

        // Reinitialize everything
        window.location.reload();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      // Clean up
      Matter.Runner.stop(runner);
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
    };
  }, [
    attractorPoint,
    attractorStrength,
    cursorStrength,
    cursorFieldRadius,
    resetOnResize,
    addTopWall,
    autoStart,
    noGoZone
  ]);

  return (
    <div
      ref={containerRef}
      className={`gravity-container ${className || ''}`}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}
    >
      {children}
    </div>
  );
};

export default Gravity;