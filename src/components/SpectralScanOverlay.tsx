'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Sparkles, Droplets, ShieldCheck, Eye, Layers, RefreshCw, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SpectralScanOverlayProps {
  imageSrc?: string;
  clientName?: string;
  hydrationScore?: number;
  pihDepth?: string;
  phototype?: string;
  showControls?: boolean;
}

export function SpectralScanOverlay({
  imageSrc = '/images/spectral_mesh_scan_result.png',
  clientName = 'Analyse Cliente',
  hydrationScore = 84,
  pihDepth = '0.2mm',
  phototype = 'Phototype V',
  showControls = true
}: SpectralScanOverlayProps) {
  const [activeMode, setActiveMode] = useState<'mesh' | 'pih' | 'hydration' | 'barrier'>('mesh');
  const [isScanning, setIsScanning] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>('pih-1');

  const handleReScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-3xl overflow-hidden border-2 border-[#C8951E]/60 bg-[#0F0A05] shadow-[0_0_50px_rgba(200,149,30,0.3)] select-none">
      
      {/* ── IMAGE DE FOND CLIENTE ── */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-[#1A1410]">
        <img
          src={imageSrc}
          alt={clientName}
          className={`w-full h-full object-cover transition-all duration-700 ${
            activeMode === 'pih' ? 'contrast-125 saturate-200 hue-rotate-15' :
            activeMode === 'hydration' ? 'hue-rotate-180 brightness-110' :
            activeMode === 'barrier' ? 'invert opacity-85 contrast-200' : ''
          }`}
          onError={(e) => {
            // Fallback image if custom scan photo fails to load
            (e.target as HTMLImageElement).src = '/images/afro_skin_spectral_scanner.jpg';
          }}
        />

        {/* Dark Vignette Overlay for Holographic Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A05] via-transparent to-black/40" />

        {/* ── LASER SCANNING LINE ANIMATION ── */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ top: '0%' }}
              animate={{ top: '100%' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent shadow-[0_0_20px_#FFD700] z-30"
            />
          )}
        </AnimatePresence>

        {/* ── MAILLAGE 3D SPECTRAL DORAIS (VECTOR MESH OVERLAY) ── */}
        {activeMode === 'mesh' && (
          <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center opacity-90">
            <svg className="w-full h-full" viewBox="0 0 500 600" fill="none">
              {/* 3D Wireframe Contour Lines */}
              <g stroke="#C8951E" strokeWidth="1.2" strokeOpacity="0.7">
                {/* Vertical Facial Curved Grid */}
                <path d="M150 120 Q 250 180 350 120" />
                <path d="M130 160 Q 250 230 370 160" />
                <path d="M120 210 Q 250 290 380 210" />
                <path d="M110 270 Q 250 360 390 270" />
                <path d="M115 330 Q 250 430 385 330" />
                <path d="M130 390 Q 250 480 370 390" />
                <path d="M160 450 Q 250 520 340 450" />

                {/* Longitudinal Curves */}
                <path d="M150 120 Q 110 270 160 450" />
                <path d="M190 120 Q 150 270 200 480" />
                <path d="M230 120 Q 200 270 240 500" />
                <path d="M270 120 Q 300 270 260 500" />
                <path d="M310 120 Q 350 270 300 480" />
                <path d="M350 120 Q 390 270 340 450" />

                {/* Diagonal Perspective Wireframe Grid */}
                <line x1="150" y1="120" x2="370" y2="390" strokeDasharray="3 3" strokeOpacity="0.4" />
                <line x1="350" y1="120" x2="130" y2="390" strokeDasharray="3 3" strokeOpacity="0.4" />
              </g>
            </svg>
          </div>
        )}

        {/* ── INTERACTIVE HUD HOTSPOTS (CALLOUT POINTERS) ── */}
        <div className="absolute inset-0 z-20">
          
          {/* Hotspot 1: PIH DEPTH (Cheekbone) */}
          <div className="absolute top-[28%] left-[22%] sm:left-[24%] flex items-center gap-2 group cursor-pointer" onClick={() => setSelectedHotspot('pih-1')}>
            <div className="relative">
              <div className="w-6 h-6 rounded-full bg-[#C8951E]/30 border border-[#FFD700] flex items-center justify-center animate-pulse">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFD700] shadow-[0_0_10px_#FFD700]" />
              </div>
              <div className="absolute inset-0 rounded-full border border-[#FFD700]/60 animate-ping" />
            </div>
            
            {/* Callout Line & Box */}
            <div className="flex items-center gap-1.5 bg-[#0F0A05]/90 border border-[#C8951E]/80 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-xl">
              <span className="text-[10px] font-mono text-[#F3E5AB] font-bold">PIH DEPTH:</span>
              <span className="text-[11px] font-mono text-[#FFD700] font-black">{pihDepth}</span>
            </div>
          </div>

          {/* Hotspot 2: Pores & Niacinamide Absorption (Lower Cheek) */}
          <div className="absolute top-[44%] left-[28%] sm:left-[30%] flex items-center gap-2 group cursor-pointer" onClick={() => setSelectedHotspot('pih-2')}>
            <div className="relative">
              <div className="w-6 h-6 rounded-full bg-cyan-500/30 border border-cyan-400 flex items-center justify-center animate-pulse">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_10px_cyan]" />
              </div>
            </div>
            
            <div className="bg-[#0F0A05]/90 border border-cyan-500/80 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-xl text-[10px] font-mono text-cyan-200 font-bold">
              1.2mm · L: 74%
            </div>
          </div>

          {/* Hotspot 3: Melanin Index (Jawline) */}
          <div className="absolute top-[58%] left-[32%] sm:left-[34%] flex items-center gap-2 group cursor-pointer" onClick={() => setSelectedHotspot('pih-3')}>
            <div className="relative">
              <div className="w-6 h-6 rounded-full bg-amber-500/30 border border-amber-400 flex items-center justify-center animate-pulse">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_10px_amber]" />
              </div>
            </div>
            
            <div className="bg-[#0F0A05]/90 border border-amber-500/80 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-xl text-[10px] font-mono text-amber-200 font-bold">
              ● PIH : 2.2nm
            </div>
          </div>

          {/* ── FLOATING HUD BADGE 1: HYDRATION SCORE (+84%) ── */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-[35%] right-[5%] sm:right-[8%] bg-[#0F0A05]/90 border-2 border-[var(--gold-kene)] backdrop-blur-xl rounded-2xl p-3 shadow-[0_0_30px_rgba(200,149,30,0.4)] flex items-center gap-3 text-white"
          >
            <div>
              <div className="text-2xl sm:text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#F3E5AB]">
                +{hydrationScore}%
              </div>
              <div className="text-[9px] font-mono font-bold text-[#F3E5AB]/80 uppercase tracking-wider">
                HYDRATION 💧
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center space-y-1 pl-2 border-l border-white/10">
              <div className="w-1.5 h-6 bg-gradient-to-t from-cyan-500 to-[#FFD700] rounded-full" />
              <span className="text-[8px] font-mono text-white/50">60 FPS</span>
            </div>
          </motion.div>

          {/* ── BOTTOM HUD STATUS BADGE: XP-3D IMMERSIVE ── */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between bg-black/85 border border-[#C8951E]/40 backdrop-blur-md px-3.5 py-2 rounded-2xl text-[11px] font-mono font-bold text-white shadow-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD700] animate-ping" />
              <span className="text-[#FFD700] tracking-wider">XP-3D IMMERSIVE SCAN</span>
            </div>
            <div className="flex items-center gap-3 text-white/70 text-[10px]">
              <span>{phototype}</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">60 FPS</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODE SELECTOR CONTROLS (IF ENABLED) ── */}
      {showControls && (
        <div className="p-4 bg-[#140E0A] border-t border-[#C8951E]/30 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-display font-bold text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[var(--gold-kene)]" /> Modes d'Analyse Spectrales :
            </span>
            <Button
              onClick={handleReScan}
              disabled={isScanning}
              className="h-7 text-[10px] bg-gradient-to-r from-[var(--gold-kene)] to-[#D4AF37] text-black font-bold rounded-xl px-2.5 shadow-md flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
              Re-Scanner en 3D
            </Button>
          </div>

          {/* Filter Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'mesh', label: 'Maillage 3D Doré', icon: Scan, color: 'border-[var(--gold-kene)] text-[#F3E5AB]' },
              { id: 'pih', label: 'Vue PIH Profonde', icon: Eye, color: 'border-amber-500 text-amber-300' },
              { id: 'hydration', label: 'Gradient Eau 💧', icon: Droplets, color: 'border-cyan-500 text-cyan-300' },
              { id: 'barrier', label: 'Barrière & Pores', icon: ShieldCheck, color: 'border-emerald-500 text-emerald-300' },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id as any)}
                className={`px-3 py-2 rounded-xl text-[10px] font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                  activeMode === mode.id
                    ? 'bg-[var(--gold-kene)] text-black border-[#FFD700] shadow-lg scale-105'
                    : 'bg-white/5 text-white/70 border-white/10 hover:border-white/30'
                }`}
              >
                <mode.icon className="w-3.5 h-3.5" />
                <span>{mode.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
