'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, LogIn, ScanFace, ShoppingCart, Calendar, Sprout, Building2, ChevronRight, Zap, Star, Play, CheckCircle2 } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'all' | 'client' | 'salon'>('all');
  const [hoveredCard, setHoveredCard] = useState<'client' | 'salon' | null>(null);

  return (
    <div className="min-h-screen bg-[#070402] text-[#F8F1E4] selection:bg-[#C8951E] selection:text-[#0F0A05] relative overflow-hidden font-sans flex flex-col justify-between p-4 sm:p-8">
      
      {/* 3D WebGL Canvas Interactive Background */}
      <Canvas3DScene color="#C8951E" speed={0.004} />

      {/* AMBIENT OVERLAY GLOW & WATERMARKS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-[#C8951E]/15 via-[#8A3B14]/10 to-transparent blur-3xl pointer-events-none z-1" />
      
      <div className="absolute top-1/4 left-8 opacity-[0.03] pointer-events-none z-1">
        <GyeNyameIcon className="w-80 h-80 text-[#C8951E]" />
      </div>
      <div className="absolute bottom-8 right-8 opacity-[0.03] pointer-events-none z-1">
        <SankofaIcon className="w-80 h-80 text-[#C8951E]" />
      </div>

      {/* TOP HEADER NAVIGATION */}
      <header className="relative z-20 max-w-7xl w-full mx-auto flex items-center justify-between py-2">
        <KeneLogo href="/" subtitle="AFRICA" size="md" />

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-[#C8951E]/20 hover:border-[#C8951E] text-[11px] text-[#F3E5AB] font-mono transition cursor-pointer backdrop-blur-md shadow-lg"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C8951E]" />
              <span>Revoir l'Intro 3D</span>
            </button>
          )}

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 text-[11px] text-white/80 font-mono backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Afrique de l'Ouest · UEMOA</span>
          </div>

          <Link href="/login">
            <Button className="bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#C8951E] text-[#0F0A05] font-black text-xs rounded-2xl h-10 px-5 shadow-lg shadow-[#C8951E]/20 hover:scale-105 transition cursor-pointer flex items-center gap-2">
              <LogIn className="w-4 h-4 text-[#0F0A05]" />
              <span>Connexion</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-20 max-w-6xl w-full mx-auto py-6 sm:py-10 space-y-8 sm:space-y-10 my-auto">
        
        {/* Title Block */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C8951E]/15 border border-[#C8951E]/30 text-[#F3E5AB] text-xs font-mono font-bold shadow-lg backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C8951E] animate-pulse" />
            <span>KÈNÈ OS v2.4 · L'Alliance de la Culture, du Luxe & de l'IA</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-6xl font-display font-black text-white tracking-tight leading-tight drop-shadow-2xl"
          >
            Bienvenue sur Kènè <br />
            <span className="bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#C8951E] bg-clip-text text-transparent">
              Sélectionnez votre Portail
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-xs sm:text-base text-white/70 font-sans max-w-xl mx-auto leading-relaxed"
          >
            Accédez directement à l'espace dédié à vos besoins.
          </motion.p>

          {/* Quick Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition cursor-pointer border ${
                activeTab === 'all'
                  ? 'bg-[#C8951E] text-black border-[#C8951E] shadow-md'
                  : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
              }`}
            >
              Tous les Espaces
            </button>
            <button
              onClick={() => setActiveTab('client')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition cursor-pointer border ${
                activeTab === 'client'
                  ? 'bg-[#C8951E] text-black border-[#C8951E] shadow-md'
                  : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
              }`}
            >
              🌸 Espace Cliente (Particulier)
            </button>
            <button
              onClick={() => setActiveTab('salon')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition cursor-pointer border ${
                activeTab === 'salon'
                  ? 'bg-emerald-500 text-black border-emerald-500 shadow-md'
                  : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
              }`}
            >
              🏬 Espace Salon (Professionnel)
            </button>
          </div>
        </div>

        {/* DUAL PERSONA GATEWAY CARDS WITH 3D GLASS EFFECT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          
          {/* CARD 1: CLIENTE */}
          {(activeTab === 'all' || activeTab === 'client') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              onMouseEnter={() => setHoveredCard('client')}
              onMouseLeave={() => setHoveredCard(null)}
              className="h-full"
            >
              <Link href="/portal">
                <div className="group relative rounded-3xl p-6 sm:p-8 border border-white/15 bg-gradient-to-b from-white/10 via-[#1A1410]/90 to-[#0A0603] backdrop-blur-xl hover:border-[#C8951E] transition-all duration-500 cursor-pointer shadow-2xl h-full flex flex-col justify-between overflow-hidden">
                  
                  {/* Background Image Ambient Glow */}
                  <div className="absolute inset-0 opacity-25 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none">
                    <img 
                      src="/images/afro_beauty_hero_woman_1784684703577.jpg" 
                      alt="Portail Cliente Kènè" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0603] via-[#1A1410]/80 to-transparent" />
                  </div>

                  <div className="space-y-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F3E5AB]/20 to-[#C8951E]/30 border border-[#C8951E]/50 flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform">
                        🌸
                      </div>
                      <Badge className="bg-[#C8951E]/20 text-[#F3E5AB] border border-[#C8951E]/40 font-mono text-[10px] font-bold px-3 py-1 shadow-md">
                        PORTAIL CLIENTE
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-display font-black text-2xl sm:text-3xl text-white group-hover:text-[#F3E5AB] transition-colors">
                        Espace Particulier & Soins
                      </h3>
                      <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                        Bilan dermo-IA de votre peau mélanoderme, suivi des rituels botaniques sur-mesure et prise de rendez-vous en 1 clic dans votre salon.
                      </p>
                    </div>

                    {/* Features Badges */}
                    <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-semibold text-white/90">
                      <div className="flex items-center gap-2 bg-black/60 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-md">
                        <ScanFace className="w-4 h-4 text-[#C8951E]" /> Diagnostic Dermo-IA
                      </div>
                      <div className="flex items-center gap-2 bg-black/60 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-md">
                        <Calendar className="w-4 h-4 text-[#C8951E]" /> Réservation Express
                      </div>
                      <div className="flex items-center gap-2 bg-black/60 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-md">
                        <Sprout className="w-4 h-4 text-[#C8951E]" /> Ordonnance Botanique
                      </div>
                      <div className="flex items-center gap-2 bg-black/60 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-md">
                        <Star className="w-4 h-4 text-[#C8951E]" /> Wallet & Privilèges
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#F3E5AB] group-hover:text-white transition-colors relative z-10">
                    <span className="flex items-center gap-1.5">
                      Accéder à mon Espace Beauté <ChevronRight className="w-4 h-4 text-[#C8951E]" />
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#C8951E] text-black font-bold flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <ArrowRight className="w-5 h-5 text-black" />
                    </div>
                  </div>

                </div>
              </Link>
            </motion.div>
          )}

          {/* CARD 2: SALON / INSTITUT PRO */}
          {(activeTab === 'all' || activeTab === 'salon') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              onMouseEnter={() => setHoveredCard('salon')}
              onMouseLeave={() => setHoveredCard(null)}
              className="h-full"
            >
              <Link href="/dashboard">
                <div className="group relative rounded-3xl p-6 sm:p-8 border border-white/15 bg-gradient-to-b from-white/10 via-[#0A1A10]/90 to-[#0A0603] backdrop-blur-xl hover:border-emerald-500 transition-all duration-500 cursor-pointer shadow-2xl h-full flex flex-col justify-between overflow-hidden">
                  
                  {/* Background Image Ambient Glow */}
                  <div className="absolute inset-0 opacity-25 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none">
                    <img 
                      src="/images/african_spa_ritual_hero_1784941628398.jpg" 
                      alt="Portail Salon Pro Kènè" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0603] via-[#0A1A10]/80 to-transparent" />
                  </div>

                  <div className="space-y-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-700/30 border border-emerald-500/50 flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform">
                        🏬
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-[10px] font-bold px-3 py-1 shadow-md">
                        PORTAIL PROFESSIONNEL
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-display font-black text-2xl sm:text-3xl text-white group-hover:text-emerald-300 transition-colors">
                        Espace Salon & Institut Pro
                      </h3>
                      <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                        Caisse tactile Wave & Orange Money, gestion d'agenda, bulletins de paie CNPS et comptabilité SYSCOHADA clé en main.
                      </p>
                    </div>

                    {/* Features Badges */}
                    <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-semibold text-white/90">
                      <div className="flex items-center gap-2 bg-black/60 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-md">
                        <ShoppingCart className="w-4 h-4 text-emerald-400" /> Caisse POS Wave/OM
                      </div>
                      <div className="flex items-center gap-2 bg-black/60 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-md">
                        <Building2 className="w-4 h-4 text-emerald-400" /> Clôture Z & Rapport
                      </div>
                      <div className="flex items-center gap-2 bg-black/60 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-md">
                        <Zap className="w-4 h-4 text-emerald-400" /> Paie CNPS & Compta
                      </div>
                      <div className="flex items-center gap-2 bg-black/60 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-md">
                        <ScanFace className="w-4 h-4 text-emerald-400" /> Scanner Cabine IA
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
          )}

        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-20 max-w-7xl w-full mx-auto text-center py-4 border-t border-white/10 text-[10px] sm:text-xs text-white/50 font-mono flex flex-col sm:flex-row items-center justify-between gap-3 backdrop-blur-md">
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
