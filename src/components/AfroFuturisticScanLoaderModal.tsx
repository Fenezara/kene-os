'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Scan, ShieldCheck, Cpu } from 'lucide-react';

interface AfroFuturisticScanLoaderModalProps {
  isOpen: boolean;
  onComplete?: () => void;
  title?: string;
  subtitle?: string;
}

const ANALYSIS_STEPS = [
  '⚡ Activation du Réseau Neuronal VLM-Kènè...',
  '🔬 Extraction de la Cartographie Pigmentaire PIH & Mélanine...',
  '💧 Mesure de la Perte Transepidermique en Eau (TEWL)...',
  '🌱 Formulation Botanique Sur-Mesure (Karité, Baobab, Bissap)...',
  '✨ Diagnostic Certifié & Aligné (RPPS UEMOA/OHADA)...'
];

export function AfroFuturisticScanLoaderModal({
  isOpen,
  onComplete,
  title = "Analyse Biométrique & Spectrale IA",
  subtitle = "Calcul de la cartographie cutanée 3D et formulation sur-mesure..."
}: AfroFuturisticScanLoaderModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // Progress counter simulation & step updates
  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setCurrentStepIdx(0);
      return;
    }

    const duration = 3000; // 3 seconds scan experience
    const interval = 40;
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + increment);
        const stepIdx = Math.min(
          ANALYSIS_STEPS.length - 1,
          Math.floor((next / 100) * ANALYSIS_STEPS.length)
        );
        setCurrentStepIdx(stepIdx);

        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => onComplete?.(), 400);
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isOpen, onComplete]);

  // 3D Canvas Particle Core Animation Loop
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = 340);
    let height = (canvas.height = 340);

    const numParticles = 60;
    const particles = Array.from({ length: numParticles }, () => ({
      x: (Math.random() - 0.5) * 220,
      y: (Math.random() - 0.5) * 220,
      z: Math.random() * 250 + 50,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      vz: (Math.random() - 0.5) * 1.2,
      size: Math.random() * 2.5 + 1,
      color: Math.random() > 0.5 ? '#FFD700' : Math.random() > 0.5 ? '#00E5FF' : '#00E676'
    }));

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const fov = 200;

      angle += 0.02;

      const projected: { x: number; y: number; color: string; size: number }[] = [];

      particles.forEach((p) => {
        // Rotate around Y axis
        const cos = Math.cos(0.015);
        const sin = Math.sin(0.015);
        const rx = p.x * cos - p.z * sin;
        const rz = p.z * cos + p.x * sin;
        p.x = rx;
        p.z = rz;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -120 || p.x > 120) p.vx *= -1;
        if (p.y < -120 || p.y > 120) p.vy *= -1;

        const scale = fov / (p.z + 150);
        const px = p.x * scale + centerX;
        const py = p.y * scale + centerY;

        projected.push({ x: px, y: py, color: p.color, size: p.size * scale });

        // Draw particle
        ctx.beginPath();
        ctx.arc(px, py, Math.max(1, p.size * scale), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Kente Mesh Interconnections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 55) {
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.strokeStyle = projected[i].color;
            ctx.globalAlpha = (1 - dist / 55) * 0.35;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      // Outer Rotating Ring
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.arc(0, 0, 130, 0, Math.PI * 1.5);
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#FFD700';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 140, Math.PI * 0.5, Math.PI * 1.8);
      ctx.strokeStyle = '#00E5FF';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] bg-[#0F0A05]/95 backdrop-blur-2xl flex items-center justify-center p-4 font-sans select-none overflow-hidden">
        
        {/* Background Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C8951E]/15 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-3xl animate-pulse pointer-events-none" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-gradient-to-b from-[#1A1410] to-[#0A0603] border-2 border-[#C8951E]/60 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(200,149,30,0.3)] text-center space-y-6 flex flex-col items-center overflow-hidden"
        >
          {/* Top Decorative Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C8951E] via-[#00E5FF] via-[#00E676] to-[#C8951E]" />

          {/* HUD Reticle Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8951E]/20 border border-[#C8951E]/40 text-[#F3E5AB] text-[10px] font-mono font-bold tracking-wider uppercase">
              <Cpu className="w-3.5 h-3.5 animate-spin" /> VLM-2026 SPECTRAL ENGINE
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight">
              {title}
            </h2>
            <p className="text-xs text-white/60 max-w-xs mx-auto font-sans">
              {subtitle}
            </p>
          </div>

          {/* 3D Hologram Particle Globe */}
          <div className="relative w-72 h-72 flex items-center justify-center">
            {/* Canvas 3D Matrix */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

            {/* Corner Anchors */}
            <div className="absolute inset-2 border border-[#C8951E]/30 rounded-2xl pointer-events-none flex flex-col justify-between p-2">
              <div className="flex justify-between text-[9px] font-mono text-[#FFD700] font-bold">
                <span>┌ KÈNÈ 3D</span>
                <span>VLM ┐</span>
              </div>
              <div className="flex justify-between text-[9px] font-mono text-[#00E5FF] font-bold">
                <span>└ RPPS</span>
                <span>60 FPS ┘</span>
              </div>
            </div>

            {/* Center Percentage Display */}
            <div className="relative z-10 text-center space-y-1 bg-black/40 backdrop-blur-md p-4 rounded-full border border-white/10 shadow-2xl">
              <span className="text-4xl sm:text-5xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#F3E5AB] to-[#00E5FF] tracking-tight">
                {Math.round(progress)}%
              </span>
              <span className="block text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
                SCANNING...
              </span>
            </div>
          </div>

          {/* Dynamic AI Status Step */}
          <div className="w-full space-y-3 bg-[#0F0A05]/90 border border-white/10 p-3.5 rounded-2xl backdrop-blur-md text-left">
            <div className="flex items-center justify-between text-[10px] font-mono text-white/50 border-b border-white/5 pb-1.5">
              <span className="flex items-center gap-1"><Scan className="w-3 h-3 text-[#FFD700]" /> ÉTAPE ANATOMIQUE</span>
              <span className="text-[#FFD700] font-bold">{currentStepIdx + 1} / {ANALYSIS_STEPS.length}</span>
            </div>

            <motion.p
              key={currentStepIdx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="text-xs font-semibold text-[#F3E5AB] font-mono min-h-[32px] flex items-center gap-2"
            >
              {ANALYSIS_STEPS[currentStepIdx]}
            </motion.p>

            {/* Progress Bar Line */}
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-[#C8951E] via-[#00E5FF] to-[#00E676] rounded-full shadow-[0_0_12px_#00E5FF]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>
          </div>

          {/* Footnote Certification */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-white/40">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cryptage Dermo-IA & Conforme Normes UEMOA</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
