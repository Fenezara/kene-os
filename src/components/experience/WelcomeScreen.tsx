'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, LogIn, ScanFace, ShoppingCart, Calendar, Sprout, Building2, ChevronRight, Zap, Star } from 'lucide-react';
import Link from 'next/link';
import { KeneLogo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SankofaIcon, GyeNyameIcon } from '@/components/ui/adinkra-icons';
import { Canvas3DScene } from './Canvas3DScene';

interface WelcomeScreenProps {
  onReplayIntro?: () => void;
}

export function WelcomeScreen({ onReplayIntro }: WelcomeScreenProps) {
  return (
    <div className="h-[100dvh] max-h-screen bg-[#070402] text-[#F8F1E4] selection:bg-[#C8951E] selection:text-[#0F0A05] relative overflow-hidden font-sans flex flex-col justify-between p-3 sm:p-6 select-none">
      
      {/* 3D WebGL Canvas Background */}
      <Canvas3DScene color="#C8951E" speed={0.004} />

      {/* AMBIENT GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#C8951E]/15 via-[#8A3B14]/10 to-transparent blur-3xl pointer-events-none z-1" />

      {/* TOP HEADER */}
      <header className="relative z-20 max-w-7xl w-full mx-auto flex items-center justify-between py-1 shrink-0">
        <KeneLogo href="/" subtitle="AFRICA" size="sm" />

        <div className="flex items-center gap-2">
          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-[#C8951E]/20 hover:border-[#C8951E] text-[10px] sm:text-xs text-[#F3E5AB] font-mono transition cursor-pointer backdrop-blur-md"
            >
              <Sparkles className="w-3 h-3 text-[#C8951E]" />
              <span>Intro 3D</span>
            </button>
          )}

          <Link href="/login">
            <Button className="bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#C8951E] text-[#0F0A05] font-black text-xs rounded-xl h-8 sm:h-9 px-4 shadow-lg hover:scale-105 transition cursor-pointer flex items-center gap-1.5">
              <LogIn className="w-3.5 h-3.5 text-[#0F0A05]" />
              <span>Connexion</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT AREA: FITS 100% MOBILE VIEWPORT WITHOUT SCROLLING */}
      <main className="relative z-20 max-w-5xl w-full mx-auto my-auto space-y-3 sm:space-y-6 overflow-hidden">
        
        {/* Title Block */}
        <div className="text-center space-y-1.5 sm:space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8951E]/15 border border-[#C8951E]/30 text-[#F3E5AB] text-[10px] sm:text-xs font-mono font-bold shadow-md">
            <Sparkles className="w-3 h-3 text-[#C8951E] animate-pulse" />
            <span>KÈNÈ OS v2.4 · Sélectionnez votre Portail</span>
          </div>

          <h1 className="text-xl sm:text-4xl font-display font-black text-white tracking-tight leading-tight">
            Accédez à votre Univers <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#C8951E] bg-clip-text text-transparent">
              Client ou Professionnel
            </span>
          </h1>
        </div>

        {/* DUAL PERSONA GATEWAY CARDS (INSTANT 100% VISIBILITY ON MOBILE) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 max-w-4xl mx-auto">
          
          {/* CARD 1: CLIENTE */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="h-full"
          >
            <Link href="/portal">
              <div className="group relative rounded-2xl p-4 sm:p-6 border border-white/15 bg-gradient-to-b from-white/10 via-[#1A1410]/90 to-[#0A0603] backdrop-blur-xl hover:border-[#C8951E] transition-all duration-300 cursor-pointer shadow-2xl h-full flex flex-col justify-between overflow-hidden">
                
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#F3E5AB]/20 to-[#C8951E]/30 border border-[#C8951E]/50 flex items-center justify-center text-xl sm:text-2xl shadow-md">
                      🌸
                    </div>
                    <Badge className="bg-[#C8951E]/20 text-[#F3E5AB] border border-[#C8951E]/40 font-mono text-[9px] sm:text-[10px] font-bold px-2.5 py-0.5">
                      ESPACE CLIENTE
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <h2 className="font-display font-black text-lg sm:text-2xl text-white group-hover:text-[#F3E5AB] transition-colors">
                      Je suis une Cliente
                    </h2>
                    <p className="text-[11px] sm:text-xs text-white/70 leading-relaxed font-sans line-clamp-2">
                      Bilan dermo-IA de votre peau mélanoderme, rituels botaniques sur-mesure et rendez-vous salon.
                    </p>
                  </div>

                  {/* Feature Pills */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-semibold text-white/80">
                    <div className="flex items-center gap-1 bg-black/50 border border-white/10 px-2 py-1 rounded-lg">
                      <ScanFace className="w-3 h-3 text-[#C8951E]" /> Dermo-IA
                    </div>
                    <div className="flex items-center gap-1 bg-black/50 border border-white/10 px-2 py-1 rounded-lg">
                      <Calendar className="w-3 h-3 text-[#C8951E]" /> RDV 1-Click
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#F3E5AB] relative z-10">
                  <span className="flex items-center gap-1 text-[11px]">
                    Entrer dans mon Espace <ChevronRight className="w-3.5 h-3.5 text-[#C8951E]" />
                  </span>
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-black font-bold flex items-center justify-center shadow-md">
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
            <Link href="/dashboard">
              <div className="group relative rounded-2xl p-4 sm:p-6 border border-white/15 bg-gradient-to-b from-white/10 via-[#0A1A10]/90 to-[#0A0603] backdrop-blur-xl hover:border-emerald-500 transition-all duration-300 cursor-pointer shadow-2xl h-full flex flex-col justify-between overflow-hidden">
                
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-700/30 border border-emerald-500/50 flex items-center justify-center text-xl sm:text-2xl shadow-md">
                      🏬
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-[9px] sm:text-[10px] font-bold px-2.5 py-0.5">
                      ESPACE SALON PRO
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <h2 className="font-display font-black text-lg sm:text-2xl text-white group-hover:text-emerald-300 transition-colors">
                      Je suis un Salon Pro
                    </h2>
                    <p className="text-[11px] sm:text-xs text-white/70 leading-relaxed font-sans line-clamp-2">
                      Caisse tactile Wave & Orange Money, agenda, bulletins de paie CNPS et comptabilité SYSCOHADA.
                    </p>
                  </div>

                  {/* Feature Pills */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-semibold text-white/80">
                    <div className="flex items-center gap-1 bg-black/50 border border-white/10 px-2 py-1 rounded-lg">
                      <ShoppingCart className="w-3 h-3 text-emerald-400" /> Caisse Wave/OM
                    </div>
                    <div className="flex items-center gap-1 bg-black/50 border border-white/10 px-2 py-1 rounded-lg">
                      <Building2 className="w-3 h-3 text-emerald-400" /> Paie CNPS
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-emerald-400 relative z-10">
                  <span className="flex items-center gap-1 text-[11px]">
                    Accéder au Back-Office <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                  </span>
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-bold flex items-center justify-center shadow-md">
                    <ArrowRight className="w-4 h-4 text-black" />
                  </div>
                </div>

              </div>
            </Link>
          </motion.div>

        </div>
      </main>

      {/* FOOTER (ALWAYS VISIBLE & PINNED AT BOTTOM WITHOUT SCROLL) */}
      <footer className="relative z-20 max-w-7xl w-full mx-auto text-center py-1.5 border-t border-white/10 text-[9px] sm:text-xs text-white/50 font-mono flex items-center justify-between gap-2 shrink-0 backdrop-blur-md">
        <span className="truncate">🌊 Wave & Orange Money · 🌿 Karité & Baobab</span>
        <span className="flex items-center gap-1 text-[#C8951E] font-bold shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C8951E]" /> UEMOA & SYSCOHADA
        </span>
      </footer>
    </div>
  );
}
