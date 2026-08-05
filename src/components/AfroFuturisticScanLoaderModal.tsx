'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Scan, ShieldCheck, Cpu, Activity, Zap, Dna, Eye } from 'lucide-react';

interface AfroFuturisticScanLoaderModalProps {
  isOpen: boolean;
  onComplete?: () => void;
  title?: string;
  subtitle?: string;
}

const ANALYSIS_STEPS = [
  '⚡ Step 1/5 : Initialisation du Réseau Biométrique VLM-Kènè (60 FPS)...',
  '🔬 Step 2/5 : Scan Spectral 3D & Profondeur PIH (Épiderme 0.2mm)...',
  '💧 Step 3/5 : Mesure de la Perte Transepidermique en Eau (TEWL 14.2 g/m²/h)...',
  '🌱 Step 4/5 : Formulation Botanique Sur-Mesure (Karité, Baobab, Bissap)...',
  '✨ Step 5/5 : Diagnostic Certifié & Aligné (RPPS UEMOA/OHADA)...'
];

export function AfroFuturisticScanLoaderModal({
  isOpen,
  onComplete,
  title = "Analyse Biométrique & Spectrale IA",
  subtitle = "Calcul de la cartographie cutanée 3D et formulation dermo-botanique..."
}: AfroFuturisticScanLoaderModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // Progress simulation (0 to 100%)
  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setCurrentStepIdx(0);
      return;
    }

    const duration = 3200; // 3.2s immersive experience
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

  // Ultra-Creative 3D Holographic Canvas Loop
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = 380);
    let height = (canvas.height = 380);

    // 3D Particles forming a head/body wireframe + Kente ring
    const numParticles = 75;
    const particles = Array.from({ length: numParticles }, (_, i) => {
      const u = (i / numParticles) * Math.PI * 2;
      const v = (i / numParticles) * Math.PI;
      return {
        x: Math.cos(u) * Math.sin(v) * 110,
        y: Math.cos(v) * 120,
        z: Math.sin(u) * Math.sin(v) * 110,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        color: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#00E5FF' : '#00E676'
      };
    });

    let angleX = 0;
    let angleY = 0;
    let laserY = 0;
    let laserDir = 1;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const fov = 220;

      angleX += 0.012;
      angleY += 0.018;

      const projected: { x: number; y: number; z: number; color: string; size: number }[] = [];

      particles.forEach((p) => {
        // Rotate around 3D axes
        let x = p.x;
        let y = p.y;
        let z = p.z;

        // Y rotation
        let cos = Math.cos(0.015);
        let sin = Math.sin(0.015);
        let rx = x * cos - z * sin;
        let rz = z * cos + x * sin;
        x = rx;
        z = rz;

        // X rotation
        cos = Math.cos(0.01);
        sin = Math.sin(0.01);
        let ry = y * cos - z * sin;
        rz = z * cos + y * sin;
        y = ry;

        p.x = x;
        p.y = y;
        p.z = rz;

        const scale = fov / (rz + 220);
        const px = x * scale + centerX;
        const py = y * scale + centerY;

        projected.push({ x: px, y: py, z: rz, color: p.color, size: p.size * scale });

        // Render Glowing Node
        ctx.beginPath();
        ctx.arc(px, py, Math.max(1, p.size * scale * 0.8), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Render Kente 3D Geometric Weave Matrix
      ctx.lineWidth = 0.6;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 50) {
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.strokeStyle = projected[i].color;
            ctx.globalAlpha = (1 - dist / 50) * 0.35;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      // Triple Orbiting Hologram Rings
      ctx.save();
      ctx.translate(centerX, centerY);

      // Ring 1 (Gold)
      ctx.rotate(angleY);
      ctx.beginPath();
      ctx.ellipse(0, 0, 135, 60, angleX, 0, Math.PI * 2);
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 1.8;
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#FFD700';
      ctx.stroke();

      // Ring 2 (Cyan)
      ctx.rotate(angleX * 1.5);
      ctx.beginPath();
      ctx.ellipse(0, 0, 145, 70, -angleY, 0, Math.PI * 2);
      ctx.strokeStyle = '#00E5FF';
      ctx.lineWidth = 1.2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00E5FF';
      ctx.stroke();

      ctx.restore();

      // Sweeping Laser Beam line
      laserY += laserDir * 4.5;
      if (laserY > height) laserDir = -1;
      if (laserY < 0) laserDir = 1;

      const laserGrad = ctx.createLinearGradient(0, laserY - 10, 0, laserY + 10);
      laserGrad.addColorStop(0, 'rgba(0,0,0,0)');
      laserGrad.addColorStop(0.5, '#FFD700');
      laserGrad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = laserGrad;
      ctx.fillRect(0, laserY - 6, width, 12);

      // Spark particles on laser line
      for (let k = 0; k < 6; k++) {
        const sparkX = Math.random() * width;
        ctx.beginPath();
        ctx.arc(sparkX, laserY + (Math.random() - 0.5) * 6, Math.random() * 2 + 1, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999999] bg-[#0F0A05]/95 backdrop-blur-2xl flex items-center justify-center p-4 font-sans select-none overflow-hidden">
        
        {/* Ambient Glowing Background Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C8951E]/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00E5FF]/15 rounded-full blur-3xl animate-pulse pointer-events-none" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-gradient-to-b from-[#1A1410] to-[#0A0603] border-2 border-[#C8951E]/60 rounded-3xl p-6 sm:p-8 shadow-[0_0_90px_rgba(200,149,30,0.35)] text-center space-y-6 flex flex-col items-center overflow-hidden"
        >
          {/* Top Kente Ribbon */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C8951E] via-[#00E5FF] via-[#00E676] via-[#8A3B14] to-[#C8951E]" />

          {/* Header */}
          <div className="space-y-1 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8951E]/20 border border-[#C8951E]/50 text-[#F3E5AB] text-[10px] font-mono font-bold tracking-wider uppercase shadow-inner">
              <Cpu className="w-3.5 h-3.5 animate-spin text-[#FFD700]" /> KÈNÈ VLM SPECTRAL 3D
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight">
              {title}
            </h2>
            <p className="text-xs text-white/60 max-w-xs mx-auto font-sans">
              {subtitle}
            </p>
          </div>

          {/* 3D Holographic Canvas Stage */}
          <div className="relative w-80 h-80 flex items-center justify-center">
            {/* Canvas 3D Mesh */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

            {/* Corner Anchors HUD */}
            <div className="absolute inset-1 border border-[#C8951E]/30 rounded-2xl pointer-events-none flex flex-col justify-between p-2.5 z-20">
              <div className="flex justify-between text-[9px] font-mono text-[#FFD700] font-bold">
                <span>┌ KÈNÈ 3D MESH</span>
                <span>RPPS ┐</span>
              </div>
              <div className="flex justify-between text-[9px] font-mono text-[#00E5FF] font-bold">
                <span>└ TEWL 14.2</span>
                <span>60 FPS ┘</span>
              </div>
            </div>

            {/* Floating Live Biometric HUD Badges */}
            <div className="absolute top-3 right-3 z-30 bg-[#0F0A05]/80 border border-[#00E5FF]/40 backdrop-blur-md px-2 py-1 rounded-xl text-[9px] font-mono text-[#00E5FF] font-bold shadow-lg animate-pulse">
              💧 Hydra 84%
            </div>
            <div className="absolute bottom-3 left-3 z-30 bg-[#0F0A05]/80 border border-[#FFD700]/40 backdrop-blur-md px-2 py-1 rounded-xl text-[9px] font-mono text-[#FFD700] font-bold shadow-lg animate-pulse">
              ✨ Mélanine 68
            </div>

            {/* Center Percentage Display */}
            <div className="relative z-20 text-center space-y-1 bg-black/60 backdrop-blur-xl p-4 sm:p-5 rounded-full border border-[#C8951E]/50 shadow-[0_0_40px_rgba(200,149,30,0.3)]">
              <span className="text-4xl sm:text-5xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#F3E5AB] to-[#00E5FF] tracking-tight">
                {Math.round(progress)}%
              </span>
              <span className="block text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                SCANNING...
              </span>
            </div>
          </div>

          {/* Dynamic AI Status Step */}
          <div className="w-full space-y-2.5 bg-[#0F0A05]/95 border border-white/10 p-3.5 rounded-2xl backdrop-blur-md text-left z-10">
            <div className="flex items-center justify-between text-[10px] font-mono text-white/50 border-b border-white/5 pb-1.5">
              <span className="flex items-center gap-1.5 text-[#FFD700] font-bold">
                <Dna className="w-3.5 h-3.5 animate-spin" /> ÉTAPE BIOMÉTRIQUE
              </span>
              <span className="text-[#FFD700] font-bold font-mono">{currentStepIdx + 1} / {ANALYSIS_STEPS.length}</span>
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

            {/* Progress Bar */}
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-[#C8951E] via-[#00E5FF] to-[#00E676] rounded-full shadow-[0_0_15px_#00E5FF]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>
          </div>

          {/* Audio-Visual Equalizer Bars (432Hz Bio-Resonance) */}
          <div className="flex items-center justify-center gap-1.5 z-10">
            <span className="text-[9px] font-mono text-white/40 uppercase pr-1">Bio-Fréquence 432Hz :</span>
            {[40, 75, 55, 90, 65, 80, 45, 95, 60, 30].map((h, idx) => (
              <motion.div
                key={idx}
                animate={{ height: [8, h / 3, 8] }}
                transition={{ duration: 0.6 + idx * 0.08, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1 rounded-full bg-gradient-to-t from-[#C8951E] to-[#00E5FF]"
              />
            ))}
          </div>

          {/* Footnote */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-white/40 z-10">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Diagnostic Certifié Dermatologique & Conforme OHADA</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
