'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, ShieldCheck, Sparkles, Scan, Droplets, Activity, Layers } from 'lucide-react';

interface AfroFuturisticScanLoaderModalProps {
  isOpen: boolean;
  onComplete?: () => void;
  title?: string;
  subtitle?: string;
}

const ANALYSIS_STEPS = [
  '⚡ Step 1/5 : Initialisation du Réseau Biométrique VLM-Kènè (60 FPS)...',
  '🔬 Step 2/5 : Cartographie Pigmentaire PIH & Profondeur de Mélanine (0.2mm)...',
  '💧 Step 3/5 : Mesure de la Perte Transepidermique en Eau (TEWL 14.2 g/m²/h)...',
  '✨ Step 4/5 : Formulation Dermo-Cosmétique Sur-Mesure (Karité, Baobab, Bissap)...',
  '✨ Step 5/5 : Diagnostic Certifié & Aligné (RPPS UEMOA/OHADA)...'
];

// 3D Anatomical Face Landmarks (Normalized coordinates)
const FACE_NODES_3D = [
  // Forehead
  { x: 0, y: -0.65, z: 0.2, label: 'Front' },
  { x: -0.3, y: -0.6, z: 0.15, label: 'Tempe L' },
  { x: 0.3, y: -0.6, z: 0.15, label: 'Tempe R' },
  // Eyes / Eyebrows
  { x: -0.25, y: -0.3, z: 0.3, label: 'Œil L' },
  { x: 0.25, y: -0.3, z: 0.3, label: 'Œil R' },
  { x: 0, y: -0.3, z: 0.35, label: 'Glabelle' },
  // Nose
  { x: 0, y: -0.1, z: 0.5, label: 'Arête Nez' },
  { x: 0, y: 0.1, z: 0.55, label: 'Pointe Nez' },
  { x: -0.15, y: 0.12, z: 0.4, label: 'Narine L' },
  { x: 0.15, y: 0.12, z: 0.4, label: 'Narine R' },
  // Cheeks
  { x: -0.45, y: -0.05, z: 0.25, label: 'Joue L' },
  { x: 0.45, y: -0.05, z: 0.25, label: 'Joue R' },
  { x: -0.35, y: 0.15, z: 0.2, label: 'Pommette L' },
  { x: 0.35, y: 0.15, z: 0.2, label: 'Pommette R' },
  // Mouth & Lips
  { x: -0.2, y: 0.32, z: 0.35, label: 'Lèvre L' },
  { x: 0.2, y: 0.32, z: 0.35, label: 'Lèvre R' },
  { x: 0, y: 0.28, z: 0.42, label: 'Arc Cupidon' },
  { x: 0, y: 0.38, z: 0.4, label: 'Menton Sup' },
  // Jawline & Chin
  { x: 0, y: 0.62, z: 0.3, label: 'Menton' },
  { x: -0.4, y: 0.48, z: 0.1, label: 'Mâchoire L' },
  { x: 0.4, y: 0.48, z: 0.1, label: 'Mâchoire R' }
];

export function AfroFuturisticScanLoaderModal({
  isOpen,
  onComplete,
  title = "Analyse Biométrique & Spectrale IA",
  subtitle = "Calcul de la cartographie cutanée 3D et formulation dermo-cosmétique..."
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

    const duration = 3400;
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

  // 3D Golden Anatomical Face Mesh Loop
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = 380);
    let height = (canvas.height = 380);

    let angleY = 0;
    let laserY = 0;
    let laserDir = 1;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2 + 10;
      const scaleFactor = 150;

      angleY += 0.015;

      // Project 3D Face Nodes
      const projected = FACE_NODES_3D.map((node) => {
        // Rotate around Y axis
        const cos = Math.cos(angleY);
        const sin = Math.sin(angleY);
        const rx = node.x * cos - node.z * sin;
        const rz = node.z * cos + node.x * sin;

        const scale = 220 / (rz + 220);
        const px = rx * scaleFactor * scale + centerX;
        const py = node.y * scaleFactor * scale + centerY;

        return { x: px, y: py, z: rz, label: node.label, scale };
      });

      // Render Kente Mesh Connections between facial nodes
      ctx.lineWidth = 0.8;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 65) {
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.strokeStyle = dist < 35 ? '#FFD700' : '#00E5FF';
            ctx.globalAlpha = (1 - dist / 65) * 0.45;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      // Render Glowing Facial Nodes
      projected.forEach((p, idx) => {
        const isSelected = idx === Math.floor((angleY * 4) % projected.length);

        ctx.beginPath();
        ctx.arc(p.x, p.y, isSelected ? 5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? '#FFFFFF' : p.z > 0 ? '#FFD700' : '#00E5FF';
        ctx.shadowBlur = isSelected ? 15 : 8;
        ctx.shadowColor = isSelected ? '#FFD700' : '#00E5FF';
        ctx.fill();
        ctx.shadowBlur = 0;

        if (isSelected) {
          ctx.font = '9px monospace';
          ctx.fillStyle = '#FFD700';
          ctx.fillText(p.label, p.x + 8, p.y + 3);
        }
      });

      // Orbiting Kente Sun Reticle Rings
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angleY * 0.7);

      // Gold Outer Ring
      ctx.beginPath();
      ctx.arc(0, 0, 140, 0, Math.PI * 1.6);
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#FFD700';
      ctx.stroke();

      // Cyan Inner Counter Ring
      ctx.rotate(-angleY * 1.4);
      ctx.beginPath();
      ctx.arc(0, 0, 150, Math.PI * 0.4, Math.PI * 1.8);
      ctx.strokeStyle = '#00E5FF';
      ctx.lineWidth = 1.2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00E5FF';
      ctx.stroke();

      ctx.restore();

      // Sweeping Laser Beam
      laserY += laserDir * 3.5;
      if (laserY > height - 40) laserDir = -1;
      if (laserY < 40) laserDir = 1;

      const laserGrad = ctx.createLinearGradient(0, laserY - 8, 0, laserY + 8);
      laserGrad.addColorStop(0, 'rgba(0,0,0,0)');
      laserGrad.addColorStop(0.5, '#FFD700');
      laserGrad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = laserGrad;
      ctx.fillRect(20, laserY - 4, width - 40, 8);

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
          className="relative w-full max-w-md bg-gradient-to-b from-[#1A1410] via-[#110D09] to-[#0A0603] border-2 border-[#C8951E]/60 rounded-3xl p-6 sm:p-8 shadow-[0_0_90px_rgba(200,149,30,0.35)] text-center space-y-5 flex flex-col items-center overflow-hidden"
        >
          {/* Top Kente Ribbon */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C8951E] via-[#00E5FF] via-[#00E676] via-[#8A3B14] to-[#C8951E]" />

          {/* Header */}
          <div className="space-y-1 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8951E]/20 border border-[#C8951E]/50 text-[#F3E5AB] text-[10px] font-mono font-bold tracking-wider uppercase shadow-inner">
              <Cpu className="w-3.5 h-3.5 animate-spin text-[#FFD700]" /> KÈNÈ 3D ANATOMICAL VLM
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight">
              {title}
            </h2>
            <p className="text-xs text-white/60 max-w-xs mx-auto font-sans">
              {subtitle}
            </p>
          </div>

          {/* 3D Anatomical Face Canvas */}
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
            <div className="absolute top-4 right-4 z-30 bg-[#0F0A05]/85 border border-[#00E5FF]/50 backdrop-blur-md px-2.5 py-1 rounded-xl text-[9px] font-mono text-[#00E5FF] font-bold shadow-lg animate-pulse flex items-center gap-1">
              <Droplets className="w-3 h-3 text-[#00E5FF]" /> TEWL 14.2 g/m²
            </div>
            <div className="absolute bottom-4 left-4 z-30 bg-[#0F0A05]/85 border border-[#FFD700]/50 backdrop-blur-md px-2.5 py-1 rounded-xl text-[9px] font-mono text-[#FFD700] font-bold shadow-lg animate-pulse flex items-center gap-1">
              <Layers className="w-3 h-3 text-[#FFD700]" /> PIH Mélanine 68
            </div>

            {/* Center Percentage Display */}
            <div className="relative z-20 text-center space-y-1 bg-black/70 backdrop-blur-xl p-4 sm:p-5 rounded-full border border-[#C8951E]/60 shadow-[0_0_50px_rgba(200,149,30,0.4)]">
              <span className="text-4xl sm:text-5xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#F3E5AB] to-[#00E5FF] tracking-tight">
                {Math.round(progress)}%
              </span>
              <span className="block text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                CALCULATING...
              </span>
            </div>
          </div>

          {/* Dynamic AI Status Step */}
          <div className="w-full space-y-2.5 bg-[#0F0A05]/95 border border-white/10 p-3.5 rounded-2xl backdrop-blur-md text-left z-10">
            <div className="flex items-center justify-between text-[10px] font-mono text-white/50 border-b border-white/5 pb-1.5">
              <span className="flex items-center gap-1.5 text-[#FFD700] font-bold">
                <Activity className="w-3.5 h-3.5 animate-spin" /> ÉTAPE BIOMÉTRIQUE
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
