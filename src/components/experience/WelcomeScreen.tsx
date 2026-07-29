'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, LogIn, ScanFace, ShoppingCart, Calendar, Sprout, Building2, CheckCircle2, ChevronRight, Zap, Star } from 'lucide-react';
import Link from 'next/link';
import { KeneLogo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SankofaIcon, GyeNyameIcon } from '@/components/ui/adinkra-icons';

export function WelcomeScreen() {
  const [hoveredCard, setHoveredCard] = useState<'client' | 'salon' | null>(null);

  return (
    <div className="min-h-screen bg-[#0A0603] text-[#F8F1E4] selection:bg-[#C8951E] selection:text-[#0F0A05] relative overflow-hidden font-sans flex flex-col justify-between p-4 sm:p-8">
      
      {/* --- AMBIENT BACKGROUND GLOW & ADINKRA WATERMARKS --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-[#C8951E]/20 via-[#8A3B14]/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#2E5A36]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 opacity-[0.03] pointer-events-none">
        <GyeNyameIcon className="w-80 h-80 text-[#C8951E]" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-[0.03] pointer-events-none">
        <SankofaIcon className="w-80 h-80 text-[#C8951E]" />
      </div>

      {/* --- TOP HEADER NAVIGATION --- */}
      <header className="relative z-20 max-w-7xl w-full mx-auto flex items-center justify-between py-2">
        <KeneLogo href="/" subtitle="AFRICA" size="md" />

        {/* Region & Language Selector + Login */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/70 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Abidjan 🇨🇮 · Dakar 🇸🇳 · Bamako 🇲🇱</span>
          </div>

          <Link href="/login">
            <Button className="bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#C8951E] text-[#0F0A05] font-black text-xs rounded-2xl h-10 px-5 shadow-lg shadow-[#C8951E]/20 hover:scale-105 transition cursor-pointer flex items-center gap-2">
              <LogIn className="w-4 h-4 text-[#0F0A05]" />
              <span>Se Connecter</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* --- MAIN WELCOME HERO & DUAL PERSONA CARDS --- */}
      <main className="relative z-20 max-w-6xl w-full mx-auto py-6 sm:py-10 space-y-8 sm:space-y-12 my-auto">
        
        {/* Welcome Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C8951E]/15 border border-[#C8951E]/30 text-[#F3E5AB] text-xs font-mono font-bold shadow-lg"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C8951E] animate-pulse" />
            <span>Kènè OS 2026 · L'Alliance du Luxe, de la Culture & de l'IA</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-6xl font-display font-black text-white tracking-tight leading-tight"
          >
            Choisissez votre univers <br />
            <span className="bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#C8951E] bg-clip-text text-transparent">
              pour accéder à l'expérience
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-xs sm:text-base text-white/70 font-sans max-w-xl mx-auto leading-relaxed"
          >
            Que vous soyez une cliente en quête du soin idéal ou un institut souhaitant digitaliser sa caisse et son agenda, Kènè s'adapte à vous.
          </motion.p>
        </div>

        {/* --- DUAL PERSONA GATEWAY CARDS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          
          {/* 🌸 CARD 1: CLIENTE */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onMouseEnter={() => setHoveredCard('client')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <Link href="/portal">
              <div className="group relative rounded-3xl p-6 sm:p-8 border border-white/10 bg-[#1A1410] hover:border-[var(--gold-kene)]/60 transition-all duration-500 cursor-pointer shadow-2xl h-full flex flex-col justify-between overflow-hidden">
                
                {/* Background Image Preview */}
                <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none">
                  <img 
                    src="/images/afro_beauty_hero_woman_1784684703577.jpg" 
                    alt="Espace Cliente Kènè" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1410] via-[#1A1410]/80 to-transparent" />
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F3E5AB]/20 to-[#C8951E]/20 border border-[var(--gold-kene)]/40 flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform">
                      🌸
                    </div>
                    <Badge className="bg-[var(--gold-kene)]/15 text-[var(--gold-kene)] border border-[var(--gold-kene)]/30 font-mono text-[10px] font-bold px-3 py-1">
                      Espace Particulier
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-white group-hover:text-[var(--gold-kene)] transition-colors">
                      Je suis une Cliente
                    </h3>
                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
                      Scannez votre peau avec le bilan Dermo-IA, suivez vos rituels botaniques sur-mesure et réservez votre soin dans les plus grands instituts.
                    </p>
                  </div>

                  {/* Feature Badges */}
                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-semibold text-white/80">
                    <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 px-2.5 py-1.5 rounded-xl">
                      <ScanFace className="w-3.5 h-3.5 text-[var(--gold-kene)]" /> Bilan Dermo-IA
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 px-2.5 py-1.5 rounded-xl">
                      <Calendar className="w-3.5 h-3.5 text-[var(--gold-kene)]" /> RDV en 3 Clics
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 px-2.5 py-1.5 rounded-xl">
                      <Sprout className="w-3.5 h-3.5 text-[var(--gold-kene)]" /> Rituels Botaniques
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 px-2.5 py-1.5 rounded-xl">
                      <Star className="w-3.5 h-3.5 text-[var(--gold-kene)]" /> Cashback & Points
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#F3E5AB] group-hover:text-white transition-colors relative z-10">
                  <span className="flex items-center gap-1.5">
                    Entrer dans le Portail Beauté <ChevronRight className="w-4 h-4 text-[var(--gold-kene)]" />
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-[var(--gold-kene)] to-[#D4AF37] text-black font-bold flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-5 h-5 text-black" />
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
            onMouseEnter={() => setHoveredCard('salon')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <Link href="/dashboard">
              <div className="group relative rounded-3xl p-6 sm:p-8 border border-white/10 bg-[#1A1410] hover:border-emerald-500/60 transition-all duration-500 cursor-pointer shadow-2xl h-full flex flex-col justify-between overflow-hidden">
                
                {/* Background Image Preview */}
                <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none">
                  <img 
                    src="/images/african_spa_ritual_hero_1784941628398.jpg" 
                    alt="Espace Salon Kènè" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1410] via-[#1A1410]/80 to-transparent" />
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-700/20 border border-emerald-500/40 flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform">
                      🏬
                    </div>
                    <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-bold px-3 py-1">
                      Espace Professionnel
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-white group-hover:text-emerald-300 transition-colors">
                      Je suis un Salon / Institut
                    </h3>
                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
                      Pilotez votre caisse Mobile Money (Wave, Orange Money), votre agenda de cabines, la paie de vos praticiennes et vos bilans clients.
                    </p>
                  </div>

                  {/* Feature Badges */}
                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-semibold text-white/80">
                    <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 px-2.5 py-1.5 rounded-xl">
                      <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" /> Caisse POS Wave/OM
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 px-2.5 py-1.5 rounded-xl">
                      <Building2 className="w-3.5 h-3.5 text-emerald-400" /> Rapport Z Clôture
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 px-2.5 py-1.5 rounded-xl">
                      <Zap className="w-3.5 h-3.5 text-emerald-400" /> Paie CNPS & Compta
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 px-2.5 py-1.5 rounded-xl">
                      <ScanFace className="w-3.5 h-3.5 text-emerald-400" /> Scanner Cabine IA
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-white transition-colors relative z-10">
                  <span className="flex items-center gap-1.5">
                    Accéder au Back-Office Salon <ChevronRight className="w-4 h-4 text-emerald-400" />
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-bold flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-5 h-5 text-black" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

        </div>
      </main>

      {/* --- FOOTER TICKER & REGULATORY CERTIFICATION --- */}
      <footer className="relative z-20 max-w-7xl w-full mx-auto text-center py-4 border-t border-white/5 text-[10px] sm:text-xs text-white/40 font-mono flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span>🌊 Wave & Orange Money Directs</span>
          <span>•</span>
          <span>🌿 Karité de Korhogo & Baobab de Tambacounda</span>
          <span>•</span>
          <span>🔬 Pro-VLM v2.4</span>
        </div>

        <span className="flex items-center gap-1.5 text-[#C8951E] font-bold">
          <ShieldCheck className="w-4 h-4 text-[#C8951E]" /> Conforme aux normes UEMOA & SYSCOHADA
        </span>
      </footer>
    </div>
  );
}
