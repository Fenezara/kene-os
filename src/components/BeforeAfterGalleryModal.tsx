'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Sparkles, TrendingUp, Sliders, Calendar, Printer, ScanFace, ArrowRight, ShieldCheck } from 'lucide-react';

interface DiagnosisSession {
  id: string;
  date: string;
  title: string;
  hydration: string;
  scoreGlobal: number;
  pihScore: number;
  photo: string;
  formula: string;
}

const DEFAULT_SESSIONS: DiagnosisSession[] = [
  {
    id: 'session-3',
    date: '28 Juillet 2026 (Aujourd\'hui)',
    title: 'Soin 3 — Cure Régénérante Karité & Baobab',
    hydration: '85%',
    scoreGlobal: 85,
    pihScore: 8,
    photo: '/images/afro_skin_spectral_scanner.jpg',
    formula: 'Sérum Baobab & Niacinamide Bio 10%',
  },
  {
    id: 'session-2',
    date: '10 Mars 2026',
    title: 'Soin 2 — Peel Botanique Neem & Aloe Vera',
    hydration: '74%',
    scoreGlobal: 74,
    pihScore: 22,
    photo: '/images/afro_beauty_hero_woman.jpg',
    formula: 'Masque Karité Brut & Beurre de Moringa',
  },
  {
    id: 'session-1',
    date: '15 Janvier 2026',
    title: 'Soin 1 — Diagnostic Initial & Bilan Dermo-IA',
    hydration: '52%',
    scoreGlobal: 65,
    pihScore: 38,
    photo: '/images/afro_man_dermo_care.jpg',
    formula: 'Ordonnance Botanique Initiale Sur-Mesure',
  },
];

export function BeforeAfterGalleryModal({
  isOpen,
  onClose,
  clientPhoto,
  sessions = DEFAULT_SESSIONS,
}: {
  isOpen: boolean;
  onClose: () => void;
  clientPhoto?: string | null;
  sessions?: DiagnosisSession[];
}) {
  // Merge client latest real photo if available into session-3
  const activeSessions = sessions.map((s, idx) => {
    if (idx === 0 && clientPhoto && clientPhoto.length > 20) {
      return { ...s, photo: clientPhoto };
    }
    return s;
  });

  const [beforeIndex, setBeforeIndex] = useState(activeSessions.length - 1); // Oldest session
  const [afterIndex, setAfterIndex] = useState(0); // Latest session
  const [sliderPos, setSliderPos] = useState(50);
  const [filterMode, setFilterMode] = useState<'standard' | 'melanin' | 'wood_uv' | 'vascular'>('standard');
  const [selectedZone, setSelectedZone] = useState<'visage' | 'joues' | 'zone_t'>('visage');

  const beforeSession = activeSessions[beforeIndex] || activeSessions[activeSessions.length - 1];
  const afterSession = activeSessions[afterIndex] || activeSessions[0];

  const scoreDiff = afterSession.scoreGlobal - beforeSession.scoreGlobal;
  const pihDiff = beforeSession.pihScore - afterSession.pihScore;

  const getSpectralClass = (mode: string) => {
    switch (mode) {
      case 'melanin': return 'sepia contrast-150 brightness-90 saturate-200';
      case 'wood_uv': return 'invert hue-rotate-180 contrast-200 brightness-110';
      case 'vascular': return 'hue-rotate-90 saturate-200 contrast-125';
      default: return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="kene-printable-document bg-[#0F0A05] border border-[#C8951E]/30 text-white rounded-3xl max-w-4xl p-6 shadow-2xl overflow-y-auto max-h-[92vh]">
        <DialogHeader className="border-b border-white/10 pb-4">
          <DialogTitle className="font-display text-xl text-white flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#C8951E] to-[#8A5C0A] flex items-center justify-center">
                <ScanFace className="w-5 h-5 text-[#0F0A05]" />
              </div>
              <div>
                <span className="font-bold text-white text-lg block">Galerie Évolution Cutanée Avant / Après</span>
                <span className="text-white/40 text-xs font-normal">Visualisez les progrès spectaculaires des traitements dermo-cosmétiques</span>
              </div>
            </div>
            <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono text-xs px-3 py-1">
              ✨ +{scoreDiff}% Amélioration Globale
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* 1. SELECTION DES DEUX SESSIONS A COMPARER */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#1A1410] p-4 rounded-2xl border border-white/5">
            <div>
              <label className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-wider block mb-1.5">
                🔴 Bilan Référence (AVANT)
              </label>
              <select
                value={beforeIndex}
                onChange={(e) => setBeforeIndex(Number(e.target.value))}
                className="w-full bg-[#0F0A05] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-[#C8951E] outline-none font-bold"
              >
                {activeSessions.map((s, idx) => (
                  <option key={s.id} value={idx}>
                    {s.date} — {s.title} ({s.hydration})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1.5">
                🟢 Bilan de Suivi (APRÈS)
              </label>
              <select
                value={afterIndex}
                onChange={(e) => setAfterIndex(Number(e.target.value))}
                className="w-full bg-[#0F0A05] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 outline-none font-bold"
              >
                {activeSessions.map((s, idx) => (
                  <option key={s.id} value={idx}>
                    {s.date} — {s.title} ({s.hydration})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. FILTRES SPECTRAUX & ZONES */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#140E0A] p-3 rounded-2xl border border-white/5 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-white/40 text-[10px] font-mono uppercase mr-1">Filtre d'Analyse :</span>
              {(['standard', 'melanin', 'wood_uv', 'vascular'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setFilterMode(m)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-[10px] transition cursor-pointer ${
                    filterMode === m
                      ? 'bg-[#C8951E] text-[#0F0A05] shadow-md'
                      : 'bg-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  {m === 'standard' ? '📷 Naturel' : m === 'melanin' ? '🟡 Mélanine PIH' : m === 'wood_uv' ? '🟦 Lumière UV' : '🔴 Vasculaire'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-white/40 text-[10px] font-mono uppercase mr-1">Zone Focus :</span>
              {(['visage', 'joues', 'zone_t'] as const).map((z) => (
                <button
                  key={z}
                  onClick={() => setSelectedZone(z)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                    selectedZone === z
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'text-white/40 hover:text-white bg-white/5'
                  }`}
                >
                  {z === 'visage' ? 'Visage Entier' : z === 'joues' ? 'Joues & Taches' : 'Zone-T'}
                </button>
              ))}
            </div>
          </div>

          {/* 3. INTERACTIVE SLIDER SPLIT SCREEN BEFORE / AFTER */}
          <div className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-3xl overflow-hidden border border-[#C8951E]/30 bg-black select-none shadow-2xl">
            <div
              className="relative w-full h-full cursor-ew-resize overflow-hidden"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                setSliderPos((x / rect.width) * 100);
              }}
              onTouchMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const touch = e.touches[0];
                if (touch) {
                  const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
                  setSliderPos((x / rect.width) * 100);
                }
              }}
            >
              {/* Before Image (Left Base) */}
              <img
                src={beforeSession.photo}
                alt="Bilan Initial"
                className={`absolute inset-0 w-full h-full object-cover ${getSpectralClass(filterMode)} ${selectedZone === 'joues' ? 'scale-125 origin-bottom-left' : selectedZone === 'zone_t' ? 'scale-125 origin-top' : ''} transition-transform duration-300`}
              />
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white border border-white/20 px-3 py-1 rounded-xl z-10 space-y-0.5">
                <span className="text-[9px] font-mono font-bold text-red-400 block uppercase">🔴 AVANT — {beforeSession.date}</span>
                <span className="text-xs font-display font-bold text-white block">{beforeSession.title}</span>
                <span className="text-[10px] text-white/60 font-mono">Hydratation: {beforeSession.hydration} · Score: {beforeSession.scoreGlobal}%</span>
              </div>

              {/* After Image (Right Clipped Overlay) */}
              <div
                className="absolute inset-y-0 right-0 overflow-hidden"
                style={{ left: `${sliderPos}%` }}
              >
                <img
                  src={afterSession.photo}
                  alt="Bilan Actuel"
                  className={`absolute inset-y-0 right-0 w-full h-full object-cover max-w-none ${getSpectralClass(filterMode)} ${selectedZone === 'joues' ? 'scale-125 origin-bottom-left' : selectedZone === 'zone_t' ? 'scale-125 origin-top' : ''} transition-transform duration-300`}
                  style={{ width: '100%', minWidth: '100%' }}
                />
                <div className="absolute top-4 right-4 bg-emerald-950/90 backdrop-blur-md text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-xl z-10 space-y-0.5 text-right">
                  <span className="text-[9px] font-mono font-bold text-emerald-400 block uppercase">🟢 APRÈS — {afterSession.date}</span>
                  <span className="text-xs font-display font-bold text-white block">{afterSession.title}</span>
                  <span className="text-[10px] text-emerald-300 font-mono font-bold">Hydratation: {afterSession.hydration} · Score: {afterSession.scoreGlobal}%</span>
                </div>
              </div>

              {/* Gold Divider Handle */}
              <div
                className="absolute inset-y-0 w-1 bg-[#C8951E] z-20 shadow-[0_0_16px_#C8951E]"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#C8951E] text-[#0F0A05] flex items-center justify-center font-bold text-sm shadow-xl border-2 border-white">
                  ↔️
                </div>
              </div>
            </div>
          </div>

          {/* 4. PROGRECTION KPI METRICS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#1A1410] border border-emerald-500/30 p-3.5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-white/40 text-[10px] font-mono uppercase block">Score de Santé Peau</span>
                <span className="font-display font-black text-xl text-emerald-400">{afterSession.scoreGlobal}%</span>
                <span className="text-[10px] text-white/50 block mt-0.5">Initial: {beforeSession.scoreGlobal}%</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-xs text-emerald-400">
                +{scoreDiff}%
              </div>
            </div>

            <div className="bg-[#1A1410] border border-[#C8951E]/30 p-3.5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-white/40 text-[10px] font-mono uppercase block">Réduction Taches PIH</span>
                <span className="font-display font-black text-xl text-[#F3E5AB]">-{pihDiff}% Taches</span>
                <span className="text-[10px] text-white/50 block mt-0.5">Mélanine lissée</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#C8951E]/10 border border-[#C8951E]/20 flex items-center justify-center font-mono font-bold text-xs text-[#F3E5AB]">
                📉 -{pihDiff}%
              </div>
            </div>

            <div className="bg-[#1A1410] border border-blue-500/30 p-3.5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-white/40 text-[10px] font-mono uppercase block">Niveau d'Hydratation</span>
                <span className="font-display font-black text-xl text-blue-400">{afterSession.hydration}</span>
                <span className="text-[10px] text-white/50 block mt-0.5">Initial: {beforeSession.hydration}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-mono font-bold text-xs text-blue-400">
                💧 High
              </div>
            </div>
          </div>

          {/* 5. FORMULATION DERMO-COSMÉTIQUE RECOMMANDÉE */}
          <div className="bg-gradient-to-r from-[#1A1410] via-[#241B14] to-[#1A1410] border border-[#C8951E]/20 p-4 rounded-2xl flex items-center justify-between flex-wrap gap-3">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#C8951E] font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Prescription Dermo-Cosmétique Actuelle
              </span>
              <p className="text-xs font-bold text-white">{afterSession.formula}</p>
            </div>
            <Button
              onClick={() => window.print()}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl h-9 px-4 border border-white/10 flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Imprimer le Bilan Évolutif
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
