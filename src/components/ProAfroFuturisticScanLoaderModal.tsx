'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, ShieldCheck, Sparkles, Scan, Droplets, Activity, Layers, Zap, Eye, Terminal, CheckCircle2, ChevronRight, Award } from 'lucide-react';

interface ProAfroFuturisticScanLoaderModalProps {
  isOpen: boolean;
  onComplete?: () => void;
  title?: string;
  subtitle?: string;
  clientName?: string;
}

const PRO_ANALYSIS_STEPS = [
  '⚡ [01/05] SIMULATION VLM-KÈNÈ : Étalonnage Dermo-Biométrique 3D (60 FPS)...',
  '🔬 [02/05] CARTOGRAPHIE PIH : Scan Mélanique & Calcul Profondeur (0.2mm - Épidermique)...',
  '💧 [03/05] BARRIÈRE HYDRIQUE : Mesure Perte Transepidermique TEWL (14.2 g/m²/h)...',
  '✨ [04/05] DERMO-COSMÉTIQUE KÈNÈ LAB : Assemblage Actifs Karité-Baobab-Bissap-Neem...',
  '🩺 [05/05] CONFORMITÉ MÉDICALE : Génération Rapport Certifié UEMOA / OHADA / RPPS...'
];

// 28 3D Anatomical Pro Sensor Nodes
const PRO_NODES_3D = [
  // Scalp / Head
  { x: 0, y: -0.85, z: 0.1, label: 'Vertex Capillaire' },
  { x: -0.35, y: -0.75, z: 0.15, label: 'Ligne Frontale L' },
  { x: 0.35, y: -0.75, z: 0.15, label: 'Ligne Frontale R' },
  // Forehead & Temples
  { x: 0, y: -0.65, z: 0.25, label: 'Front Central' },
  { x: -0.4, y: -0.55, z: 0.2, label: 'Tempe L' },
  { x: 0.4, y: -0.55, z: 0.2, label: 'Tempe R' },
  // Glabella & Eyes
  { x: 0, y: -0.35, z: 0.4, label: 'Glabelle' },
  { x: -0.28, y: -0.32, z: 0.35, label: 'Orbite Gauche' },
  { x: 0.28, y: -0.32, z: 0.35, label: 'Orbite Droite' },
  // Nose
  { x: 0, y: -0.1, z: 0.55, label: 'Arête Nasale' },
  { x: 0, y: 0.1, z: 0.6, label: 'Pointe Nez' },
  { x: -0.18, y: 0.12, z: 0.45, label: 'Narine L' },
  { x: 0.18, y: 0.12, z: 0.45, label: 'Narine R' },
  // Cheeks & Zygomatic
  { x: -0.48, y: -0.05, z: 0.3, label: 'Joue L' },
  { x: 0.48, y: -0.05, z: 0.3, label: 'Joue R' },
  { x: -0.38, y: 0.18, z: 0.25, label: 'Pommette L' },
  { x: 0.38, y: 0.18, z: 0.25, label: 'Pommette R' },
  // Lips & Mouth
  { x: 0, y: 0.28, z: 0.48, label: 'Arc Cupidon' },
  { x: -0.22, y: 0.34, z: 0.4, label: 'Commissure L' },
  { x: 0.22, y: 0.34, z: 0.4, label: 'Commissure R' },
  // Mandible & Chin
  { x: 0, y: 0.62, z: 0.35, label: 'Menton Central' },
  { x: -0.42, y: 0.5, z: 0.15, label: 'Mandibule L' },
  { x: 0.42, y: 0.5, z: 0.15, label: 'Mandibule R' },
  // Neck & Decollete
  { x: 0, y: 0.82, z: 0.1, label: 'Cou Antérieur' },
  { x: -0.3, y: 0.95, z: 0.05, label: 'Clavicule L' },
  { x: 0.3, y: 0.95, z: 0.05, label: 'Clavicule R' },
  { x: 0, y: 1.15, z: 0.0, label: 'Sternum' },
];

export function ProAfroFuturisticScanLoaderModal({
  isOpen,
  onComplete,
  title = "Cabinet Dermo-IA Pro — Scanner Octo-Spectral 3D",
  subtitle = "Calcul biométrique multicouche & télémétrie spectrale avancée...",
  clientName = "Cliente Salon",
}: ProAfroFuturisticScanLoaderModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [clientPhotos, setClientPhotos] = useState<string[]>([]);
  const [isFastScan, setIsFastScan] = useState(false);

  // Retrieve photos from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedPhotosJson = localStorage.getItem('kene_latest_client_photos');
        if (storedPhotosJson) {
          const parsed = JSON.parse(storedPhotosJson);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setClientPhotos(parsed);
            return;
          }
        }
        const singlePhoto = localStorage.getItem('kene_latest_client_photo');
        if (singlePhoto) setClientPhotos([singlePhoto]);
      } catch (e) {}
    }
  }, [isOpen]);

  // Progress simulation (0 to 100%)
  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setCurrentStepIdx(0);
      return;
    }

    const duration = isFastScan ? 1600 : 3400;
    const interval = 30;
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + increment);
        const stepIdx = Math.min(
          PRO_ANALYSIS_STEPS.length - 1,
          Math.floor((next / 100) * PRO_ANALYSIS_STEPS.length)
        );
        setCurrentStepIdx(stepIdx);

        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => onComplete?.(), 300);
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isOpen, isFastScan, onComplete]);

  // 3D Holographic Rendering Loop
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angleY = 0;
    let angleX = 0.1;
    let laserY = -1;
    let laserDir = 1;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 500);
      const height = (canvas.height = canvas.parentElement?.clientHeight || 450);
      const centerX = width / 2;
      const centerY = height / 2 - 10;
      const scale = Math.min(width, height) * 0.38;

      ctx.clearRect(0, 0, width, height);

      angleY += 0.015;
      laserY += 0.015 * laserDir;
      if (laserY > 1.2) laserDir = -1;
      if (laserY < -1.2) laserDir = 1;

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      // Project 3D nodes to 2D screen
      const projectedNodes = PRO_NODES_3D.map((node) => {
        const x1 = node.x * cosY - node.z * sinY;
        const z1 = node.x * sinY + node.z * cosY;

        const y2 = node.y * cosX - z1 * sinX;
        const z2 = node.y * sinX + z1 * cosX;

        const perspective = 600 / (600 + z2 * scale);
        const screenX = centerX + x1 * scale * perspective;
        const screenY = centerY + y2 * scale * perspective;

        return { screenX, screenY, z2, label: node.label, origZ: node.z };
      });

      // Draw wireframe grid connections
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.35;

      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const dx = projectedNodes[i].screenX - projectedNodes[j].screenX;
          const dy = projectedNodes[i].screenY - projectedNodes[j].screenY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < scale * 0.45) {
            ctx.beginPath();
            ctx.moveTo(projectedNodes[i].screenX, projectedNodes[i].screenY);
            ctx.lineTo(projectedNodes[j].screenX, projectedNodes[j].screenY);
            ctx.stroke();
          }
        }
      }

      // Draw 3D Kenté Orbiting Reticle Rings
      const ringRadius = scale * 0.85;
      ctx.save();
      ctx.translate(centerX, centerY);

      ctx.beginPath();
      ctx.ellipse(0, 0, ringRadius, ringRadius * 0.35, angleY * 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      ctx.setLineDash([12, 8]);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(0, 0, ringRadius * 1.15, ringRadius * 0.42, -angleY * 0.7, 0, Math.PI * 2);
      ctx.strokeStyle = '#00E5FF';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 6]);
      ctx.stroke();
      ctx.restore();

      // Draw Laser Scanning Plane
      const currentScanY = centerY + laserY * scale * 0.5;
      const gradient = ctx.createLinearGradient(0, currentScanY - 15, 0, currentScanY + 15);
      gradient.addColorStop(0, 'rgba(0, 229, 255, 0)');
      gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.8)');
      gradient.addColorStop(1, 'rgba(0, 229, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(centerX - scale * 0.9, currentScanY - 10, scale * 1.8, 20);

      // Draw active sensor nodes
      projectedNodes.forEach((p, idx) => {
        const isFocus = idx % 3 === 0;
        const nodeColor = isFocus ? '#00E5FF' : '#FFD700';
        const nodeSize = isFocus ? 4.5 : 3;

        ctx.beginPath();
        ctx.arc(p.screenX, p.screenY, nodeSize, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.globalAlpha = 0.9;
        ctx.fill();

        if (isFocus) {
          ctx.beginPath();
          ctx.arc(p.screenX, p.screenY, nodeSize * 2.5, 0, Math.PI * 2);
          ctx.strokeStyle = '#00E5FF';
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.5;
          ctx.stroke();
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 overflow-hidden font-sans">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-4xl w-full bg-[#0A0603] border-2 border-[#C8951E]/60 rounded-3xl p-4 sm:p-6 shadow-[0_0_80px_rgba(200,149,30,0.3)] text-white space-y-4 overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C8951E] to-[#8A3B14] flex items-center justify-center shadow-md">
                <Cpu className="w-5 h-5 text-black animate-pulse" />
              </div>
              <div>
                <h3 className="font-display font-black text-sm sm:text-base text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#F3E5AB] to-[#00E5FF] uppercase tracking-wide">
                  {title}
                </h3>
                <p className="text-[11px] text-emerald-400 font-mono font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Cabinet Pro • {clientName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFastScan(!isFastScan)}
                className={`text-[10px] font-mono font-bold px-3 py-1 rounded-xl border transition cursor-pointer ${
                  isFastScan ? 'bg-[#FFD700] text-black border-[#FFD700]' : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                }`}
              >
                ⚡ {isFastScan ? 'Mode Turbo Actif' : 'Activer Mode Turbo'}
              </button>
            </div>
          </div>

          {/* Main Content Grid (Canvas 3D + Telemetry) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            
            {/* 3D Hologram Canvas (Cols 1-2) */}
            <div className="md:col-span-2 relative h-72 sm:h-80 bg-[#0F0A05] rounded-2xl border border-[#C8951E]/30 overflow-hidden flex items-center justify-center shadow-inner">
              <canvas ref={canvasRef} className="w-full h-full" />

              {/* Central Holographic Percentage Badge */}
              <div className="absolute top-4 left-4 z-20 bg-black/80 backdrop-blur-md p-3 rounded-2xl border border-[#C8951E]/50 space-y-0.5">
                <span className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#F3E5AB] to-[#00E5FF]">
                  {Math.round(progress)}%
                </span>
                <span className="block text-[8px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  SCAN VLM PRO ACTIVE
                </span>
              </div>

              {/* Orbiting Captured Client Photos HUD */}
              {clientPhotos.length > 0 && (
                <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center gap-2 bg-black/70 p-2 rounded-xl border border-white/10 backdrop-blur-md overflow-x-auto no-scrollbar">
                  <span className="text-[9px] font-mono text-white/50 shrink-0">Clichés Client :</span>
                  {clientPhotos.map((photoUrl, idx) => (
                    <div key={idx} className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#FFD700]/60 shrink-0">
                      <img src={photoUrl} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-[7px] text-center font-mono text-[#F3E5AB]">#{idx + 1}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Live Clinical Telemetry Stream (Col 3) */}
            <div className="space-y-2 bg-[#0F0A05] p-3.5 rounded-2xl border border-white/10 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-emerald-400 font-bold text-[10px] uppercase flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5 text-[#FFD700]" /> Télémétrie Clinique
                </span>
                <span className="text-[9px] text-white/40">432 Hz Bio-Scan</span>
              </div>

              <div className="space-y-1.5 text-[10px]">
                <div className="bg-white/5 p-2 rounded-xl border border-white/5 space-y-0.5">
                  <span className="text-white/40 block">Perte TEWL (Barrière)</span>
                  <span className="text-[#FFD700] font-bold">14.2 g/m²/h [Alerte Évaporation]</span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl border border-white/5 space-y-0.5">
                  <span className="text-white/40 block">Indice Mélanique PIH</span>
                  <span className="text-red-400 font-bold">68/100 (Type V Fitzpatrick)</span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl border border-white/5 space-y-0.5">
                  <span className="text-white/40 block">Activité Séborrhique</span>
                  <span className="text-sky-400 font-bold">74% (Hyper-sécrétion Zone T)</span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl border border-white/5 space-y-0.5">
                  <span className="text-white/40 block">Soin Dermo-Cosmétique</span>
                  <span className="text-emerald-300 font-bold">Karité + Baobab + Bissap</span>
                </div>
              </div>
            </div>
          </div>

          {/* VLM Terminal Sub-phase Message */}
          <div className="bg-[#0F0A05] border border-[#C8951E]/40 p-3 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-white/50 border-b border-white/5 pb-1">
              <span className="text-[#FFD700] font-bold flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 animate-spin" /> ÉTAPE BIOMÉTRIQUE PRO
              </span>
              <span className="text-[#FFD700] font-bold font-mono">{currentStepIdx + 1} / {PRO_ANALYSIS_STEPS.length}</span>
            </div>

            <p className="text-xs font-mono font-bold text-[#F3E5AB]">
              {PRO_ANALYSIS_STEPS[currentStepIdx]}
            </p>

            {/* Glowing Gradient Progress Bar */}
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-[#C8951E] via-[#00E5FF] to-[#00E676] rounded-full shadow-[0_0_15px_#00E5FF]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>
          </div>

          {/* Bio-Frequency Equalizer Bars */}
          <div className="flex items-center justify-between border-t border-white/10 pt-2 text-[10px] font-mono text-white/40">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Diagnostic Médical Certifié UEMOA / OHADA</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[9px]">Bio-Fréquence :</span>
              {[45, 80, 60, 95, 70, 85, 50, 90, 65, 40].map((h, idx) => (
                <motion.div
                  key={idx}
                  animate={{ height: [6, h / 3, 6] }}
                  transition={{ duration: 0.5 + idx * 0.08, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-1 rounded-full bg-gradient-to-t from-[#C8951E] via-[#00E5FF] to-[#00E676]"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
