'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { KeneLogo } from '@/components/ui/logo';
import { GyeNyameIcon, SankofaIcon } from '@/components/ui/adinkra-icons';

interface BrandSplashScreenProps {
  onComplete: () => void;
}

export function BrandSplashScreen({ onComplete }: BrandSplashScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 bg-[#070402] text-[#F8F1E4] flex flex-col items-center justify-between p-8 overflow-hidden select-none"
    >
      {/* --- AMBIENT GLOW & FLOATING ORBS --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-radial from-[#C8951E]/25 via-[#8A3B14]/15 to-transparent blur-3xl rounded-full pointer-events-none animate-pulse" />
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#2E5A36]/15 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#C8951E]/15 blur-3xl rounded-full pointer-events-none" />

      {/* --- BACKGROUND ADINKRA WATERMARKS --- */}
      <div className="absolute top-12 left-12 opacity-[0.04] pointer-events-none animate-spin-slow">
        <GyeNyameIcon className="w-96 h-96 text-[#C8951E]" />
      </div>
      <div className="absolute bottom-12 right-12 opacity-[0.04] pointer-events-none animate-pulse">
        <SankofaIcon className="w-96 h-96 text-[#C8951E]" />
      </div>

      {/* Top Bar */}
      <div className="w-full max-w-5xl flex items-center justify-between z-10 opacity-60 text-xs font-mono tracking-widest text-[#F3E5AB]">
        <span>KÈNÈ OS v2.4</span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C8951E] animate-ping" />
          SYSTEM READY
        </span>
      </div>

      {/* CENTER LOGO PRESENTATION */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-8 my-auto">
        
        {/* Animated Gold Ring Halo */}
        <div className="relative flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Outer Pulsing Aura */}
            <div className="absolute -inset-8 rounded-full bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#C8951E] opacity-20 blur-xl animate-pulse" />
            
            {/* Main Logo Container */}
            <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-[#C8951E]/30 backdrop-blur-2xl shadow-2xl shadow-[#C8951E]/20">
              <KeneLogo size="lg" subtitle="DERMO-COSMÉTIQUE & IA" href="#" />
            </div>
          </motion.div>
        </div>

        {/* Brand Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="space-y-3 max-w-lg"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C8951E]/15 border border-[#C8951E]/30 text-[#F3E5AB] text-xs font-mono font-bold shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#C8951E] animate-spin" />
            <span>L'Alliance du Luxe, de la Culture & de l'IA</span>
          </div>

          <p className="text-sm sm:text-base text-white/70 font-sans tracking-wide">
            La Première Plateforme Intelligente de Beauté Afro-Contemporaine & Gestion de Salons UEMOA
          </p>
        </motion.div>

        {/* Progress Bar / Loader */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '220px', opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="relative h-1 bg-white/10 rounded-full overflow-hidden"
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ delay: 0.8, duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0 bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#C8951E]"
          />
        </motion.div>
      </div>

      {/* FOOTER & SKIP BUTTON */}
      <div className="w-full max-w-5xl flex items-center justify-between z-10">
        <span className="text-[11px] text-white/40 font-mono">
          ABIDJAN · DAKAR · BAMAKO · LOMÉ
        </span>

        <button
          onClick={onComplete}
          className="px-5 py-2 rounded-full bg-white/5 border border-white/15 text-xs text-[#F3E5AB] font-mono hover:bg-[#C8951E]/20 hover:border-[#C8951E] transition cursor-pointer flex items-center gap-2"
        >
          <span>Accéder Directement</span>
          <span className="text-xs">→</span>
        </button>
      </div>
    </motion.div>
  );
}
