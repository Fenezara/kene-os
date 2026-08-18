'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, LogIn, ScanFace, ShoppingCart, Calendar, Sprout, Building2, ChevronRight, Zap, Star, Phone, CheckCircle2, X } from 'lucide-react';
import Link from 'next/link';
import { KeneLogo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SankofaIcon, GyeNyameIcon } from '@/components/ui/adinkra-icons';
import { Canvas3DScene } from './Canvas3DScene';

interface WelcomeScreenProps {
  onReplayIntro?: () => void;
}

const BOTANICAL_PREVIEWS: Record<string, { title: string; recipe: string; ingredients: string[]; fitzpatrick: string }> = {
  taches: {
    title: 'Soin Anti-Hyperpigmentation & Éclat',
    recipe: 'Sérum Éclaircissant Botanique à la Poudre de Chebe & Huile de Baobab Pur',
    ingredients: ['Beurre de Karité Brut de Korhogo', 'Huile de Baobab de Tambacounda', 'Extrait d\'Aloe Vera'],
    fitzpatrick: 'Phototypes IV, V & VI'
  },
  hydratation: {
    title: 'Rituel Hydratation Profonde Karité',
    recipe: 'Baume Céleste Karité Nuit & Nectar Botanique Hydratant',
    ingredients: ['Beurre de Karité de Korhogo', 'Huile de Moringa', 'Eau Florale d\'Hibiscus'],
    fitzpatrick: 'Toutes Peaux Mélanodermes'
  },
  cheveux: {
    title: 'Élixir Cuir Chevelu & Tresses Protectrices',
    recipe: 'Huile Fortifiante au Chebe & Baobab Bio',
    ingredients: ['Poudre de Chebe Ancestrale', 'Huile de Baobab', 'Huile essentielle de Menthe Poivrée'],
    fitzpatrick: 'Cheveux Crépus (4A/4B/4C) & Bouclés'
  }
};

export function WelcomeScreen({ onReplayIntro }: WelcomeScreenProps) {
  const [selectedNeed, setSelectedNeed] = useState<string | null>(null);

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(15); } catch (e) {}
    }
  };

  const handleQuickDemo = (role: 'client' | 'gerant') => {
    triggerHaptic();
    if (typeof window !== 'undefined') {
      const user = role === 'client' ? {
        firstName: 'Cliente',
        lastName: 'Démo',
        name: 'Cliente Démo',
        phone: '+225 07 00 00 00 00',
        email: 'client.demo@kene.africa',
        role: 'client'
      } : {
        name: 'Salon Démo Kènè',
        email: 'salon.demo@kene.africa',
        phone: '+225 07 00 11 22 33',
        salonName: 'Salon Démo Kènè',
        role: 'gerant'
      };
      localStorage.setItem('kene_user', JSON.stringify(user));
      document.cookie = `kene-session=${role}-${Date.now()}; path=/; max-age=31536000; SameSite=Lax`;
      window.location.href = role === 'client' ? '/portal' : '/dashboard';
    }
  };

  return (
    <div className="h-[100dvh] max-h-screen bg-[#070402] text-[#F8F1E4] selection:bg-[#C8951E] selection:text-[#0F0A05] relative overflow-hidden font-sans flex flex-col justify-between p-3 sm:p-6 select-none">
      
      {/* 3D WebGL Canvas Background with Interactive Drag */}
      <Canvas3DScene color="#C8951E" speed={0.004} />

      {/* AMBIENT GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#C8951E]/15 via-[#8A3B14]/10 to-transparent blur-3xl pointer-events-none z-1" />

      {/* TOP HEADER WITH INSTANT DEMO & LOGIN BUTTONS */}
      <header className="relative z-20 max-w-7xl w-full mx-auto flex items-center justify-between py-1 shrink-0">
        <KeneLogo href="/" subtitle="AFRICA" size="sm" />

        <div className="flex items-center gap-2">
          {onReplayIntro && (
            <button
              onClick={() => { triggerHaptic(); onReplayIntro(); }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-[#C8951E]/20 hover:border-[#C8951E] text-[10px] sm:text-xs text-[#F3E5AB] font-mono transition cursor-pointer backdrop-blur-md"
            >
              <Sparkles className="w-3 h-3 text-[#C8951E]" />
              <span className="hidden sm:inline">Intro 3D</span>
            </button>
          )}

          {/* Quick Demo Button */}
          <button
            onClick={() => handleQuickDemo('client')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8951E]/20 border border-[#C8951E]/50 text-[#F3E5AB] hover:bg-[#C8951E]/40 font-mono text-[10px] sm:text-xs font-bold transition shadow-md cursor-pointer backdrop-blur-md"
          >
            <Zap className="w-3 h-3 text-[#FFD700]" />
            <span>Démo 1-Clic</span>
          </button>

          <Link href="/login">
            <Button onClick={triggerHaptic} className="bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#C8951E] text-[#0F0A05] font-black text-xs rounded-xl h-8 sm:h-9 px-4 shadow-lg hover:scale-105 transition cursor-pointer flex items-center gap-1.5">
              <LogIn className="w-3.5 h-3.5 text-[#0F0A05]" />
              <span>Connexion</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-20 max-w-5xl w-full mx-auto my-auto space-y-3 sm:space-y-5 overflow-hidden">
        
        {/* Title Block */}
        <div className="text-center space-y-1.5 sm:space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C8951E]/20 border border-[#C8951E]/50 text-[#F3E5AB] text-[10px] sm:text-xs font-mono font-bold shadow-lg backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#C8951E] animate-ping" />
            <span>XP-3D IMMERSIVE · SÉLECTIONNEZ VOTRE PORTAIL</span>
          </div>

          <h1 className="text-xl sm:text-4xl font-display font-black text-white tracking-tight leading-tight">
            Accédez à votre Univers <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#C8951E] bg-clip-text text-transparent">
              Client ou Professionnel
            </span>
          </h1>
        </div>

        {/* INTERACTIVE PHOTOTYPE MICRO-QUIZ PREVIEW BAR */}
        <div className="bg-black/60 border border-white/15 rounded-2xl p-2.5 sm:p-3 backdrop-blur-xl max-w-3xl mx-auto shadow-2xl">
          <div className="text-center mb-1.5">
            <span className="text-[10px] sm:text-xs font-mono font-semibold text-[#F3E5AB] flex items-center justify-center gap-1">
              <Sprout className="w-3 h-3 text-[#C8951E]" /> Aperçu Instantané · Quel est votre besoin beauté ?
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[10px] sm:text-xs">
            <button
              onClick={() => { triggerHaptic(); setSelectedNeed('taches'); }}
              className="px-2 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#C8951E] hover:bg-[#C8951E]/15 text-white/90 font-bold transition flex items-center justify-center gap-1 cursor-pointer truncate"
            >
              🌸 Taches & Éclat
            </button>
            <button
              onClick={() => { triggerHaptic(); setSelectedNeed('hydratation'); }}
              className="px-2 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#C8951E] hover:bg-[#C8951E]/15 text-white/90 font-bold transition flex items-center justify-center gap-1 cursor-pointer truncate"
            >
              💧 Hydratation Karité
            </button>
            <button
              onClick={() => { triggerHaptic(); setSelectedNeed('cheveux'); }}
              className="px-2 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#C8951E] hover:bg-[#C8951E]/15 text-white/90 font-bold transition flex items-center justify-center gap-1 cursor-pointer truncate"
            >
              💇 Tresses & Cuir Chevelu
            </button>
          </div>
        </div>

        {/* DUAL PERSONA GATEWAY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 max-w-4xl mx-auto">
          
          {/* CARD 1: CLIENTE */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="h-full"
          >
            <Link href="/portal" onClick={triggerHaptic}>
              <div className="group relative rounded-2xl p-4 sm:p-5 border border-[#FFD700]/30 bg-gradient-to-b from-[#1E1610]/95 via-[#1A1410]/90 to-[#0A0603] backdrop-blur-2xl hover:border-[#FFD700] transition-all duration-300 cursor-pointer shadow-2xl h-full flex flex-col justify-between overflow-hidden glass-card-hover shimmer-sweep">
                
                <div className="space-y-2.5 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#FFD700]/30 via-[#C8951E]/20 to-[#8A3B14]/40 border border-[#FFD700]/60 flex items-center justify-center text-xl shadow-lg">
                      🌸
                    </div>
                    <Badge className="bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/50 font-mono text-[9px] sm:text-[10px] font-bold px-2.5 py-0.5 shadow-md">
                      ESPACE CLIENTE PRIVILÈGE
                    </Badge>
                  </div>

                  <div className="space-y-0.5">
                    <h2 className="font-display font-black text-lg sm:text-xl text-white group-hover:text-[#FFD700] transition-colors">
                      Je suis une Cliente
                    </h2>
                    <p className="text-[11px] text-white/70 leading-relaxed font-sans line-clamp-2">
                      Bilan dermo-IA de votre peau mélanoderme, rituels botaniques sur-mesure et rendez-vous salon.
                    </p>
                  </div>

                  {/* Feature Pills */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-semibold text-white/80">
                    <div className="flex items-center gap-1 bg-black/60 border border-[#FFD700]/20 px-2 py-1 rounded-lg">
                      <ScanFace className="w-3 h-3 text-[#FFD700]" /> Dermo-IA 3D
                    </div>
                    <div className="flex items-center gap-1 bg-black/60 border border-[#FFD700]/20 px-2 py-1 rounded-lg">
                      <Calendar className="w-3 h-3 text-[#FFD700]" /> RDV 1-Click
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 mt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#FFD700] relative z-10">
                  <span className="flex items-center gap-1 text-[11px]">
                    Entrer dans mon Espace <ChevronRight className="w-3.5 h-3.5 text-[#FFD700]" />
                  </span>
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#C8951E] text-black font-bold flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-4 h-4 text-black" />
                  </div>
                </div>

              </div>
            </Link>
          </motion.div>

          {/* CARD 2: SALON / INSTITUT PRO */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="h-full"
          >
            <Link href="/dashboard" onClick={triggerHaptic}>
              <div className="group relative rounded-2xl p-4 sm:p-5 border border-emerald-500/30 bg-gradient-to-b from-[#0E1B13]/95 via-[#0A1A10]/90 to-[#0A0603] backdrop-blur-2xl hover:border-emerald-400 transition-all duration-300 cursor-pointer shadow-2xl h-full flex flex-col justify-between overflow-hidden glass-card-hover shimmer-sweep">
                
                <div className="space-y-2.5 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-500/30 via-emerald-600/20 to-emerald-800/40 border border-emerald-500/60 flex items-center justify-center text-xl shadow-lg">
                      🏬
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-mono text-[9px] sm:text-[10px] font-bold px-2.5 py-0.5 shadow-md">
                      ESPACE SALON PRO
                    </Badge>
                  </div>

                  <div className="space-y-0.5">
                    <h2 className="font-display font-black text-lg sm:text-xl text-white group-hover:text-emerald-300 transition-colors">
                      Je suis un Salon Pro
                    </h2>
                    <p className="text-[11px] text-white/70 leading-relaxed font-sans line-clamp-2">
                      Caisse tactile Wave & Orange Money, agenda, bulletins de paie CNPS et comptabilité SYSCOHADA.
                    </p>
                  </div>

                  {/* Feature Pills */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-semibold text-white/80">
                    <div className="flex items-center gap-1 bg-black/60 border border-emerald-500/20 px-2 py-1 rounded-lg">
                      <ShoppingCart className="w-3 h-3 text-emerald-400" /> Caisse Wave/OM
                    </div>
                    <div className="flex items-center gap-1 bg-black/60 border border-emerald-500/20 px-2 py-1 rounded-lg">
                      <Building2 className="w-3 h-3 text-emerald-400" /> Paie CNPS
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 mt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-bold text-emerald-400 relative z-10">
                  <span className="flex items-center gap-1 text-[11px]">
                    Accéder au Back-Office <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                  </span>
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 text-black font-bold flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-4 h-4 text-black" />
                  </div>
                </div>

              </div>
            </Link>
          </motion.div>

        </div>
      </main>

      {/* BOTANICAL RECIPE MODAL PREVIEW */}
      <AnimatePresence>
        {selectedNeed && BOTANICAL_PREVIEWS[selectedNeed] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-md w-full rounded-2xl bg-[#110D09] border border-[#C8951E]/40 p-5 shadow-2xl space-y-4 text-left relative"
            >
              <button
                onClick={() => setSelectedNeed(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <Badge className="bg-[#C8951E]/20 text-[#F3E5AB] border border-[#C8951E]/40 text-[10px] font-mono">
                  RECETTE BOTANIQUE SUR-MESURE
                </Badge>
              </div>

              <div>
                <h3 className="font-display font-black text-xl text-white">
                  {BOTANICAL_PREVIEWS[selectedNeed].title}
                </h3>
                <p className="text-xs text-[#F3E5AB] mt-1 font-semibold">
                  {BOTANICAL_PREVIEWS[selectedNeed].recipe}
                </p>
              </div>

              <div className="space-y-1.5 bg-black/50 border border-white/10 p-3 rounded-xl">
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">Ingrédients Actifs Négro-Africains :</span>
                <div className="space-y-1">
                  {BOTANICAL_PREVIEWS[selectedNeed].ingredients.map((ing, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-white/90">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C8951E]" />
                      <span>{ing}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedNeed(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-white/70 text-xs font-bold hover:bg-white/10"
                >
                  Fermer
                </button>
                <button
                  onClick={() => handleQuickDemo('client')}
                  className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-black font-black text-xs shadow-lg hover:scale-105 transition"
                >
                  Obtenir mon Bilan Complet 🌿
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="relative z-20 max-w-7xl w-full mx-auto text-center py-1.5 border-t border-white/10 text-[9px] sm:text-xs text-white/50 font-mono flex items-center justify-between gap-2 shrink-0 backdrop-blur-md">
        <span className="truncate">🌊 Wave & Orange Money · 🌿 Karité & Baobab</span>
        <span className="flex items-center gap-1 text-[#C8951E] font-bold shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C8951E]" /> UEMOA & SYSCOHADA
        </span>
      </footer>
    </div>
  );
}
