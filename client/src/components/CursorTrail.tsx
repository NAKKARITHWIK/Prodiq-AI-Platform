import React, { useEffect, useRef } from 'react';

export const CursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  
  // Track actual mouse position
  const targetMouse = useRef({ x: -100, y: -100 });
  // Track interpolated position for a smooth, heavy "light source" feeling
  const currentMouse = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only enable on devices with a fine pointer (i.e. mouse, not touch)
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.current.x = e.clientX;
      targetMouse.current.y = e.clientY;
      
      // If it's the first move, snap the current position to the target immediately
      if (currentMouse.current.x === -100) {
        currentMouse.current.x = e.clientX;
        currentMouse.current.y = e.clientY;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Interpolate current mouse towards target mouse (easing factor 0.1)
      // This creates a smooth lag effect for the light glow
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * 0.1;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * 0.1;
        
      const x = currentMouse.current.x;
      const y = currentMouse.current.y;
      
      if (x !== -100 && y !== -100) {
        // Red Ambient Glow
        const radius = 350; // Large, soft light
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        
        // Use the blackish-red theme color for the glow
        gradient.addColorStop(0, 'rgba(127, 29, 29, 0.15)'); // Deep red center
        gradient.addColorStop(0.5, 'rgba(69, 10, 10, 0.05)'); // Smooth dropoff
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Fade to transparent
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      // mix-blend-screen acts as a true light source overlay, brightening elements naturally
      className="fixed inset-0 pointer-events-none z-[9999] mix-blend-screen"
      aria-hidden="true"
    />
  );
};
