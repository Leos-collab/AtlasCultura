import React, { useEffect, useRef } from 'react';

interface InteractiveParticleCanvasProps {
  theme: 'light' | 'dark';
}

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

export const InteractiveParticleCanvas: React.FC<InteractiveParticleCanvasProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      active: false
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    let nodes: NodePoint[] = [];

    const initNodes = () => {
      nodes = [];
      const count = Math.min(22, Math.floor((width * height) / 45000));
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          radius: Math.random() * 1.5 + 1,
          alpha: Math.random() * 0.35 + 0.25
        });
      }
    };

    initNodes();

    const render = () => {
      // Smooth lerp mouse coordinates
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const isDark = theme === 'dark';

      // 1. Draw Subtle Architectural Grid
      ctx.strokeStyle = isDark ? 'rgba(245, 158, 11, 0.03)' : 'rgba(124, 58, 237, 0.05)';
      ctx.lineWidth = 0.5;
      const gridStep = 80;

      ctx.beginPath();
      for (let x = 0; x < width; x += gridStep) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridStep) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 2. Interactive Ambient Cursor Spotlight (Smooth & Clean)
      if (mouse.active || mouse.x > 0) {
        const spotlight = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, 380
        );

        const centerColor = isDark ? 'rgba(245, 158, 11, 0.08)' : 'rgba(109, 40, 217, 0.08)';
        const midColor = isDark ? 'rgba(251, 191, 36, 0.025)' : 'rgba(139, 92, 246, 0.03)';

        spotlight.addColorStop(0, centerColor);
        spotlight.addColorStop(0.5, midColor);
        spotlight.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = spotlight;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 380, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Render Floating Memory Nodes & Hairline Constellation Links
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        // Bounce smoothly inside viewport
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Draw connections between neighboring nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dist = Math.hypot(n.x - n2.x, n.y - n2.y);
          const maxLinkDist = 140;

          if (dist < maxLinkDist) {
            const linkAlpha = (1 - dist / maxLinkDist) * (isDark ? 0.12 : 0.15);
            ctx.strokeStyle = isDark
              ? `rgba(245, 158, 11, ${linkAlpha})`
              : `rgba(124, 58, 237, ${linkAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }

        // Draw soft connection to mouse cursor
        const distToMouse = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        const mouseLinkDist = 190;

        if (distToMouse < mouseLinkDist) {
          const mouseLinkAlpha = (1 - distToMouse / mouseLinkDist) * (isDark ? 0.28 : 0.25);
          ctx.strokeStyle = isDark
            ? `rgba(251, 191, 36, ${mouseLinkAlpha})`
            : `rgba(139, 92, 246, ${mouseLinkAlpha})`;
          ctx.lineWidth = 0.85;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }

        // Render node dot
        const nodeAlpha = Math.min(0.75, n.alpha + (distToMouse < 180 ? (1 - distToMouse / 180) * 0.35 : 0));
        ctx.fillStyle = isDark
          ? `rgba(245, 158, 11, ${nodeAlpha})`
          : `rgba(109, 40, 217, ${nodeAlpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius + (distToMouse < 140 ? 0.75 : 0), 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-80"
    />
  );
};
