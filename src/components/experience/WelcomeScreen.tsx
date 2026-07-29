'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, User, Store, ShieldCheck, LogIn } from 'lucide-react';
import Link from 'next/link';
import { KeneLogo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';

export function WelcomeScreen() {
  return (
    <div className="min-h-screen bg-[#0F0A05] text-[#F8F1E4] selection:bg-[#C8951E] selection:text-[#0F0A05] relative overflow-hidden font-sans flex flex-col justify-between p-4 sm:p-8">
      
      {/* Ambient background lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#C8951E]/15 via-[#8A3B14]/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#2E5A36]/10 blur-3xl pointer-events-none" />

      {/* --- TOP HEADER NAVIGATION --- */}
      <header className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <KeneLogo href="/" subtitle="AFRICA" size="md" />

        <Link href="/login">
          <Button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold rounded-2xl h-10 px-4 cursor-pointer flex items-center gap-2 transition">
            <LogIn className="w-4 h-4 text-[#C8951E]" />
            <span>Déjà un compte ? Se Connecter</span>
          </Button>
        </Link>
      </header>

      {/* --- MAIN WELCOME HERO & DUAL PERSONA CARDS --- */}
      <main className="relative z-10 max-w-5xl w-full mx-auto py-8 sm:py-12 space-y-8 sm:space-y-12 my-auto">
        
        {/* Welcome Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C8951E]/15 border border-[#C8951E]/30 text-[#F3E5AB] text-xs font-mono font-bold"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C8951E]" /> Bienvenue sur Kènè OS 2026
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight"
          >
            Choisissez votre univers <br />
            <span className="bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#C8951E] bg-clip-text text-transparent">
              pour commencer
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-xs sm:text-sm text-white/60 font-sans"
          >
            La première suite dermo-cosmétique & plateforme intégrée dédiée à la beauté afro-contemporaine.
          </motion.p>
        </div>

        {/* --- DUAL PERSONA CARDS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* 🌸 CARD 1: CLIENTE */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/portal">
              <div className="group relative rounded-3xl p-6 sm:p-8 border border-white/10 bg-[#1A1410] hover:border-[var(--gold-kene)]/50 transition-all duration-300 cursor-pointer shadow-2xl h-full flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--gold-kene)]/10 rounded-full blur-2xl group-hover:bg-[var(--gold-kene)]/20 transition-all" />

                <div className="space-y-4 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F3E5AB]/20 to-[#C8951E]/20 border border-[var(--gold-kene)]/40 flex items-center justify-center text-2xl shadow-lg">
                    🌸
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[var(--gold-kene)] font-bold uppercase tracking-widest block">Espace Particulier</span>
                    <h3 className="font-display font-black text-2xl text-white group-hover:text-[var(--gold-kene)] transition-colors">
                      Je suis une Cliente
                    </h3>
                  </div>

                  <p className="text-xs text-white/60 leading-relaxed font-sans">
                    Réalisez votre bilan de peau Dermo-IA, découvrez vos rituels botaniques sur-mesure et réservez un soin dans un institut certifié.
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs font-bold text-[#F3E5AB] group-hover:text-white transition-colors relative z-10">
                  <span>Accéder à l'Espace Cliente</span>
                  <div className="w-8 h-8 rounded-full bg-[var(--gold-kene)]/20 group-hover:bg-[var(--gold-kene)] text-[#0F0A05] flex items-center justify-center transition-all">
                    <ArrowRight className="w-4 h-4 text-[var(--gold-kene)] group-hover:text-black" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* 🏬 CARD 2: SALON / INSTITUT */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Link href="/dashboard">
              <div className="group relative rounded-3xl p-6 sm:p-8 border border-white/10 bg-[#1A1410] hover:border-emerald-500/50 transition-all duration-300 cursor-pointer shadow-2xl h-full flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />

                <div className="space-y-4 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-700/20 border border-emerald-500/40 flex items-center justify-center text-2xl shadow-lg">
                    🏬
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest block">Espace Professionnel</span>
                    <h3 className="font-display font-black text-2xl text-white group-hover:text-emerald-300 transition-colors">
                      Je suis un Salon / Institut
                    </h3>
                  </div>

                  <p className="text-xs text-white/60 leading-relaxed font-sans">
                    Gérez vos encaissements Mobile Money (Wave, OM), votre agenda de cabines, la paie de vos praticiennes et vos bilans cliniques.
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-white transition-colors relative z-10">
                  <span>Accéder au Back-Office Salon</span>
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500 text-black flex items-center justify-center transition-all">
                    <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:text-black" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

        </div>
      </main>

      {/* --- FOOTER REGULATORY & COPYRIGHT --- */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto text-center py-4 border-t border-white/5 text-[10px] text-white/30 font-mono flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© {new Date().getFullYear()} Kènè OS · La Suite Beauté & Dermo-Cosmétique Africaine</span>
        <span className="flex items-center gap-1 text-[#C8951E]">
          <ShieldCheck className="w-3.5 h-3.5" /> Norme Certifiée OHADA & UEMOA
        </span>
      </footer>
    </div>
  );
}
