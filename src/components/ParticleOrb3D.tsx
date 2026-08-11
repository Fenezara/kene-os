'use client';

import React, { useEffect, useRef } from 'react';

interface ParticleOrb3DProps {
  isListening?: boolean;
  isSpeaking?: boolean;
  scrollProgress?: number; // 0 to 1 scroll-driven depth animation
}

export function ParticleOrb3D({
  isListening = false,
  isSpeaking = false,
  scrollProgress = 0,
}: ParticleOrb3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth || 340);
    let height = (canvas.height = canvas.offsetHeight || 340);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 340;
      height = canvas.height = canvas.offsetHeight || 340;
    };
    window.addEventListener('resize', handleResize);

    // 3D Particle Sphere Parameters
    const particleCount = 420;
    const particles: {
      x3d: number;
      y3d: number;
      z3d: number;
      baseRadius: number;
      speed: number;
      color: string;
      size: number;
    }[] = [];

    const colors = ['#FFD700', '#F3E5AB', '#C8951E', '#E5A93C', '#FFF5C0'];

    // Fibonacci sphere distribution
    const radius = Math.min(width, height) * 0.32;
    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;

      particles.push({
        x3d: radius * Math.cos(theta) * Math.sin(phi),
        y3d: radius * Math.sin(theta) * Math.sin(phi),
        z3d: radius * Math.cos(phi),
        baseRadius: radius,
        speed: 0.005 + Math.random() * 0.008,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 1.2 + Math.random() * 2.2,
      });
    }

    let angleX = 0;
    let angleY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Center of sphere
      const cx = width / 2;
      const cy = height / 2;

      // Scroll & Listening dynamics
      const activePulse = isListening ? Math.sin(Date.now() * 0.008) * 15 : isSpeaking ? Math.sin(Date.now() * 0.012) * 20 : 0;
      const scrollRotation = scrollProgress * Math.PI * 2;

      angleX += 0.006 + (isSpeaking ? 0.01 : 0);
      angleY += 0.008 + (isListening ? 0.015 : 0);

      const rotX = angleX + scrollRotation * 0.3;
      const rotY = angleY + scrollRotation * 0.5;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      // Render 3D Glow Aura
      const auraGradient = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.3 + activePulse);
      auraGradient.addColorStop(0, 'rgba(255, 215, 0, 0.25)');
      auraGradient.addColorStop(0.5, 'rgba(200, 149, 30, 0.12)');
      auraGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = auraGradient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.3 + activePulse, 0, Math.PI * 2);
      ctx.fill();

      // Sort particles by Z depth for 3D depth layering
      const sortedParticles = particles.map((p) => {
        // Rotate 3D coordinates
        let y1 = p.y3d * cosX - p.z3d * sinX;
        let z1 = p.y3d * sinX + p.z3d * cosX;

        let x2 = p.x3d * cosY + z1 * sinY;
        let z2 = -p.x3d * sinY + z1 * cosY;

        // Perspective projection
        const fov = 350;
        const scale = fov / (fov + z2);
        const x2d = cx + x2 * scale;
        const y2d = cy + y1 * scale;

        return { x2d, y2d, z2, scale, color: p.color, size: p.size };
      });

      sortedParticles.sort((a, b) => a.z2 - b.z2);

      // Draw 3D connecting energy lines between nearby particles
      ctx.lineWidth = 0.5;
      for (let i = 0; i < sortedParticles.length; i += 4) {
        const p1 = sortedParticles[i];
        for (let j = i + 1; j < sortedParticles.length; j += 8) {
          const p2 = sortedParticles[j];
          const dx = p1.x2d - p2.x2d;
          const dy = p1.y2d - p2.y2d;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 45) {
            const alpha = (1 - dist / 45) * 0.25 * p1.scale;
            ctx.strokeStyle = `rgba(255, 215, 0, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x2d, p1.y2d);
            ctx.lineTo(p2.x2d, p2.y2d);
            ctx.stroke();
          }
        }
      }

      // Draw 3D Particle Points
      sortedParticles.forEach((p) => {
        const opacity = Math.max(0.15, Math.min(1, (p.z2 + radius) / (radius * 2)));
        const finalSize = Math.max(0.8, p.size * p.scale * (1 + activePulse * 0.015));

        ctx.fillStyle = p.color;
        ctx.globalAlpha = opacity;

        ctx.beginPath();
        ctx.arc(p.x2d, p.y2d, finalSize, 0, Math.PI * 2);
        ctx.fill();

        // Extra glow on front particles
        if (p.z2 > 0) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#FFD700';
        } else {
          ctx.shadowBlur = 0;
        }
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isListening, isSpeaking, scrollProgress]);

  return (
    <div className="relative w-full h-72 sm:h-80 flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full max-w-sm max-h-sm block cursor-pointer transition-transform duration-500 hover:scale-105"
      />
    </div>
  );
}
