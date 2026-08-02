'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Sparkles, Droplets, ShieldCheck, Layers, Zap, Activity, AlertTriangle, ChevronRight, Check } from 'lucide-react';

interface HotspotDetail {
  id: string;
  title: string;
  type: 'pih' | 'hydration' | 'sebum' | 'barrier' | 'collagen';
  depth: string;
  metric: string;
  status: 'critical' | 'warning' | 'optimal';
  zone: string;
  xPercent: number; // Position X on image (%)
  yPercent: number; // Position Y on image (%)
  description: string;
  recommendedBotanical: string;
}

interface SpectralScanOverlayProps {
  imageSrc?: string;
  photos?: string[]; // Array of up to 3 photos (Front, Right Profile, Left Profile)
  clientName?: string;
  hydrationScore?: number;
  pihDepth?: string;
  phototype?: string;
  showControls?: boolean;
}

const DEFAULT_HOTSPOTS: HotspotDetail[] = [
  {
    id: 'pih-cheek',
    title: 'Tache Hyperpigmentation PIH',
    type: 'pih',
    depth: '0.2mm (Épidermique)',
    metric: 'Indice Mélanine 68',
    status: 'warning',
    zone: 'Pommette Droite (Zone Suspecte 🔴)',
    xPercent: 24,
    yPercent: 32,
    description: 'Accumulation mélanique post-inflammatoire sous-cutanée. Risque d\'obscurcissement au soleil.',
    recommendedBotanical: 'Sérum Concentré d\'Hibiscus & Niacinamide 5% (AHA Botaniques)',
  },
  {
    id: 'tewl-forehead',
    title: 'Perte Transepidermique (TEWL)',
    type: 'hydration',
    depth: '0.05mm (Stratum Corneum)',
    metric: '14.2 g/m²/h',
    status: 'critical',
    zone: 'Front & Zone T (Zone Déshydratée 🟡)',
    xPercent: 48,
    yPercent: 20,
    description: 'Évaporation hydrique accélérée du film hydrolipidique due à l\'air sec et savons décapants.',
    recommendedBotanical: 'Beurre de Karité Brut de Korhogo (45%) & Huile de Baobab (30%)',
  },
  {
    id: 'sebum-nose',
    title: 'Sécrétion Séborrhique Excessive',
    type: 'sebum',
    depth: '1.2mm (Glande Sébacée)',
    metric: 'Indice Sébum 74%',
    status: 'warning',
    zone: 'Aile du Nez & Sillon (Zone Séborrhique 🟠)',
    xPercent: 52,
    yPercent: 46,
    description: 'Hyper-activité des glandes sébacées avec pores dilatés et risque de comédons.',
    recommendedBotanical: 'Extrait Purifié de Neem & Moringa (Anti-bactérien & Matifiant)',
  },
  {
    id: 'barrier-[#0F0A05]',
    title: 'Intégrité Barrière Lipidique',
    type: 'barrier',
    depth: '0.1mm',
    metric: 'Intégrité 92%',
    status: 'optimal',
    zone: 'Zone Maxillaire (Zone Saine 🟢)',
    xPercent: 30,
    yPercent: 64,
    description: 'Ciment intercellulaire intact avec bonne cohésion des céramides naturelles.',
    recommendedBotanical: 'Huile Pure de Baobab de Tambacounda (Scellage Hydrique)',
  },
];

export function SpectralScanOverlay({
  imageSrc = '/images/afro_skin_spectral_scanner.jpg',
  photos = [],
  clientName = 'Analyse Cliente',
  hydrationScore = 84,
  pihDepth = '0.2mm',
  phototype = 'Type V',
  showControls = true
}: SpectralScanOverlayProps) {
  const [activeMode, setActiveMode] = useState<'mesh' | 'pih' | 'hydration' | 'barrier'>('mesh');
  const [isScanning, setIsScanning] = useState(false);
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotDetail | null>(DEFAULT_HOTSPOTS[0]);

  // Available photo gallery (fallback to main imageSrc if empty)
  const availablePhotos = photos.length > 0 ? photos : [imageSrc];
  const currentPhoto = availablePhotos[Math.min(selectedPhotoIdx, availablePhotos.length - 1)];

  const handleReScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-3xl overflow-hidden border-2 border-[#C8951E]/60 bg-[#0F0A05] shadow-[0_0_50px_rgba(200,149,30,0.3)] select-none font-sans">
      
      {/* ── HEADER CONTRÔLES MULTI-MODES & MULTI-PHOTOS ── */}
      {showControls && (
        <div className="bg-[#1A1410] border-b border-white/10 p-3 flex flex-wrap items-center justify-between gap-2">
          {/* Multi-Photo View Angle Selector */}
          {availablePhotos.length > 1 ? (
            <div className="flex items-center gap-1.5 bg-[#0F0A05] p-1 rounded-xl border border-white/10">
              <span className="text-[9px] text-white/40 font-mono px-1">Angles ({availablePhotos.length}) :</span>
              {availablePhotos.map((_, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => setSelectedPhotoIdx(pIdx)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition ${
                    selectedPhotoIdx === pIdx ? 'bg-[#C8951E] text-[#0F0A05]' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {pIdx === 0 ? '👤 Face' : pIdx === 1 ? '👤 Profil D.' : '👤 Profil G.'}
                </button>
              ))}
            </div>
          ) : (
            <span className="text-[10px] font-mono text-[#F3E5AB] font-bold flex items-center gap-1">
              ✨ Vue de Face (Scan 3D AI)
            </span>
          )}

          {/* Spectral Filter Modes */}
          <div className="flex items-center gap-1 bg-[#0F0A05] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveMode('mesh')}
              className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg transition ${activeMode === 'mesh' ? 'bg-gradient-to-r from-[#C8951E] to-[#F3E5AB] text-[#0F0A05]' : 'text-white/50 hover:text-white'}`}
            >
              🌟 Mesh 3D
            </button>
            <button
              onClick={() => setActiveMode('pih')}
              className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg transition ${activeMode === 'pih' ? 'bg-red-500 text-white' : 'text-white/50 hover:text-white'}`}
            >
              🔬 PIH Profond
            </button>
            <button
              onClick={() => setActiveMode('hydration')}
              className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg transition ${activeMode === 'hydration' ? 'bg-sky-500 text-white' : 'text-white/50 hover:text-white'}`}
            >
              💧 Hydratation
            </button>
            <button
              onClick={() => setActiveMode('barrier')}
              className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg transition ${activeMode === 'barrier' ? 'bg-emerald-500 text-white' : 'text-white/50 hover:text-white'}`}
            >
              🛡️ Barrière
            </button>
          </div>
        </div>
      )}

      {/* ── IMAGE DE FOND CLIENTE ── */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[4/3] overflow-hidden bg-[#1A1410]">
        <img
          src={currentPhoto}
          alt={clientName}
          className={`w-full h-full object-cover transition-all duration-700 ${
            activeMode === 'pih' ? 'contrast-150 saturate-200 hue-rotate-15' :
            activeMode === 'hydration' ? 'hue-rotate-180 brightness-110' :
            activeMode === 'barrier' ? 'invert opacity-85 contrast-200' : ''
          }`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/afro_skin_spectral_scanner.jpg';
          }}
        />

        {/* Dark Vignette Overlay for Holographic Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A05] via-transparent to-black/50" />

        {/* ── LASER SCANNING LINE ANIMATION ── */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ top: '0%' }}
              animate={{ top: '100%' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent shadow-[0_0_25px_#FFD700] z-30"
            />
          )}
        </AnimatePresence>

        {/* ── MAILLAGE 3D SPECTRAL DORAIS (VECTOR MESH OVERLAY) ── */}
        {activeMode === 'mesh' && (
          <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center opacity-85">
            <svg className="w-full h-full" viewBox="0 0 500 600" fill="none">
              <g stroke="#C8951E" strokeWidth="1.2" strokeOpacity="0.7">
                <path d="M150 120 Q 250 180 350 120" />
                <path d="M130 160 Q 250 230 370 160" />
                <path d="M120 210 Q 250 290 380 210" />
                <path d="M110 270 Q 250 360 390 270" />
                <path d="M115 330 Q 250 430 385 330" />
                <path d="M130 390 Q 250 480 370 390" />
                <path d="M160 450 Q 250 520 340 450" />

                <path d="M150 120 Q 110 270 160 450" />
                <path d="M190 120 Q 150 270 200 480" />
                <path d="M230 120 Q 200 270 240 500" />
                <path d="M270 120 Q 300 270 260 500" />
                <path d="M310 120 Q 350 270 300 480" />
                <path d="M350 120 Q 390 270 340 450" />

                <line x1="150" y1="120" x2="370" y2="390" strokeDasharray="3 3" strokeOpacity="0.4" />
                <line x1="350" y1="120" x2="130" y2="390" strokeDasharray="3 3" strokeOpacity="0.4" />
              </g>
            </svg>
          </div>
        )}

        {/* ── INTELLIGENT CALLOUT HOTSPOTS ANCHORED ONLY TO SUSPECT ZONES ── */}
        <div className="absolute inset-0 z-20">
          {DEFAULT_HOTSPOTS.map((hotspot) => {
            const isSelected = selectedHotspot?.id === hotspot.id;
            const badgeColor = hotspot.status === 'critical' ? 'border-red-500 text-red-200' :
                             hotspot.status === 'warning' ? 'border-amber-500 text-amber-200' : 'border-emerald-500 text-emerald-200';

            return (
              <div
                key={hotspot.id}
                style={{ top: `${hotspot.yPercent}%`, left: `${hotspot.xPercent}%` }}
                className="absolute flex items-center gap-2 group cursor-pointer"
                onClick={() => setSelectedHotspot(hotspot)}
              >
                <div className="relative">
                  <div className={`w-6 h-6 rounded-full bg-black/60 border-2 flex items-center justify-center animate-pulse ${isSelected ? 'scale-125 border-[#FFD700]' : 'border-white/50'}`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${hotspot.status === 'critical' ? 'bg-red-500' : hotspot.status === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  </div>
                  <div className="absolute inset-0 rounded-full border border-white/60 animate-ping opacity-75" />
                </div>

                {/* Floating Callout Card */}
                <div className={`bg-[#0F0A05]/95 border backdrop-blur-md px-2.5 py-1 rounded-xl shadow-xl transition-all ${badgeColor} ${isSelected ? 'ring-2 ring-[#C8951E] scale-105' : 'opacity-85 hover:opacity-100'}`}>
                  <span className="text-[10px] font-mono font-bold block">{hotspot.title}</span>
                  <span className="text-[9px] font-mono text-white/60 block">{hotspot.metric}</span>
                </div>
              </div>
            );
          })}

          {/* ── FLOATING HUD CARD: HYDRATION SCORE (+84%) ── */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-[12%] right-[4%] bg-[#0F0A05]/90 border-2 border-[#C8951E] backdrop-blur-xl rounded-2xl p-2.5 shadow-xl flex items-center gap-2.5 text-white"
          >
            <div>
              <span className="text-[9px] font-mono text-white/50 uppercase block">Score Hydratation</span>
              <div className="flex items-center gap-1">
                <span className="text-xl font-display font-black text-[#F3E5AB]">+{hydrationScore}%</span>
                <Droplets className="w-4 h-4 text-sky-400 animate-bounce" />
              </div>
            </div>
          </motion.div>

          {/* ── FLOATING HUD CARD 2: DERMO-HEALTH CARDS STRIP ── */}
          <div className="absolute bottom-[4%] left-[3%] right-[3%] grid grid-cols-3 gap-2">
            <div className="bg-[#0F0A05]/90 border border-white/10 backdrop-blur-md p-2 rounded-xl text-center">
              <span className="text-[8px] text-white/40 font-mono uppercase block">Indice Mélanine</span>
              <span className="text-xs font-mono font-bold text-[#F3E5AB]">68/100 (Type V)</span>
            </div>
            <div className="bg-[#0F0A05]/90 border border-white/10 backdrop-blur-md p-2 rounded-xl text-center">
              <span className="text-[8px] text-white/40 font-mono uppercase block">Perte TEWL</span>
              <span className="text-xs font-mono font-bold text-amber-300">14.2 g/m²/h</span>
            </div>
            <div className="bg-[#0F0A05]/90 border border-white/10 backdrop-blur-md p-2 rounded-xl text-center">
              <span className="text-[8px] text-white/40 font-mono uppercase block">Flore Microbiome</span>
              <span className="text-xs font-mono font-bold text-emerald-400">94% Équilibré</span>
            </div>
          </div>
        </div>

        {/* Bottom Immersive Watermark Badge */}
        <div className="absolute top-3 left-3 bg-black/60 border border-white/10 px-2.5 py-1 rounded-xl text-[9px] font-mono text-[#F3E5AB] flex items-center gap-1.5 z-20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>XP-3D IMMERSIVE · 60 FPS</span>
        </div>
      </div>

      {/* ── INSPECTEUR DE ZONE SUSPECTE SÉLECTIONNÉE (DRAWER) ── */}
      {selectedHotspot && (
        <div className="bg-[#1A1410] border-t border-white/10 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs">🔬</span>
              <span className="font-display font-bold text-sm text-white">{selectedHotspot.title}</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#C8951E]/20 text-[#F3E5AB] font-mono font-bold">
                {selectedHotspot.zone}
              </span>
            </div>
            <span className="text-[10px] text-white/40 font-mono">{selectedHotspot.depth}</span>
          </div>

          <p className="text-xs text-white/70 font-sans leading-relaxed">
            {selectedHotspot.description}
          </p>

          <div className="bg-[#0A0603] p-2.5 rounded-xl border border-[#2E5A36]/50 flex items-center justify-between text-xs">
            <span className="text-[#4CAF6E] font-bold">🌱 Actif Botanique Préscrit :</span>
            <span className="text-white font-mono font-semibold">{selectedHotspot.recommendedBotanical}</span>
          </div>
        </div>
      )}
    </div>
  );
}
