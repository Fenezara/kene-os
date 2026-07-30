'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ScanFace, ShoppingCart, ArrowRight, ArrowLeft, ChevronRight, CheckCircle2, ShieldCheck, Sprout, Star, Eye } from 'lucide-react';
import { KeneLogo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GyeNyameIcon, SankofaIcon } from '@/components/ui/adinkra-icons';

interface Onboarding3DExperienceProps {
  onComplete: () => void;
}

const ONBOARDING_SLIDES = [
  {
    id: 'slide-1',
    badge: 'LUXE & SAGESSE ANCESTRALE',
    badgeColor: '#C8951E',
    title: "L'Alliance Sublimée du Savoir-Faire & de la Botanique",
    subtitle: "Rituels au Beurre de Karité pur de Korhogo, Baobab de Tambacounda & Poudre de Chebe.",
    description: "Une plateforme conçue spécifiquement pour célébrer les besoins uniques des peaux mélanodermes et des cheveux crépus, frisés et bouclés.",
    image: '/images/afro_beauty_hero_woman_1784684703577.jpg',
    features: [
      { icon: Sprout, text: 'Laboratoire Botanique Sur-Mesure' },
      { icon: Star, text: 'Formulations 100% Naturelles & Certifiées' },
      { icon: ShieldCheck, text: 'Traçabilité des Productrices Locales' },
    ],
    accent: 'from-[#F3E5AB] via-[#D4AF37] to-[#C8951E]',
    bgGlow: 'from-[#C8951E]/20 via-[#8A3B14]/15 to-transparent',
  },
  {
    id: 'slide-2',
    badge: 'INTELLIGENCE ARTIFICIELLE DERMO',
    badgeColor: '#4E9FD1',
    title: 'Diagnostic Cutané IA de Haute Précision',
    subtitle: "Scannez le phototype (Fitzpatrick IV à VI), mesurez l'hydratation et le sébum en cabine.",
    description: "L'IA Kènè Pro-VLM génère instantanément la recette de soin sur-mesure adaptée à chaque cliente et édite son passeport beauté.",
    image: '/images/afro_skin_spectral_scanner_1784941604401.jpg',
    features: [
      { icon: ScanFace, text: 'Analyse Spectrale Phototypes IV, V & VI' },
      { icon: Eye, text: "Cartographie des Zones d'Hyperpigmentation" },
      { icon: CheckCircle2, text: "Ordonnance Beauté & Suivi en Ligne" },
    ],
    accent: 'from-[#64B5F6] via-[#2196F3] to-[#1565C0]',
    bgGlow: 'from-[#2196F3]/20 via-[#0D47A1]/15 to-transparent',
  },
  {
    id: 'slide-3',
    badge: 'CAISSE & COMPTABILITÉ UEMOA',
    badgeColor: '#2E5A36',
    title: 'Caisse Tactile Mobile Money & Suivi 360°',
    subtitle: 'Wave, Orange Money, Agenda Cabines, Paie CNPS & Clôture Z Automatique.',
    description: "Offrez à votre établissement une suite SaaS complète conforme aux directives financières SYSCOHADA et optimisée pour l'Afrique de l'Ouest.",
    image: '/images/african_spa_ritual_hero_1784941628398.jpg',
    features: [
      { icon: ShoppingCart, text: 'Paiement Instantané Wave & Orange Money' },
      { icon: CheckCircle2, text: 'Conformité Fiscale SYSCOHADA & CNPS' },
      { icon: Star, text: 'Programme Parrainage & Wallet Privilège' },
    ],
    accent: 'from-[#81C784] via-[#4CAF50] to-[#2E7D32]',
    bgGlow: 'from-[#4CAF50]/20 via-[#1B5E20]/15 to-transparent',
  },
];

export function Onboarding3DExperience({ onComplete }: Onboarding3DExperienceProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const currentSlide = ONBOARDING_SLIDES[currentSlideIndex];

  // Mouse Parallax movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleNext = () => {
    if (currentSlideIndex < ONBOARDING_SLIDES.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#0A0603] text-[#F8F1E4] selection:bg-[#C8951E] selection:text-[#0F0A05] relative overflow-hidden font-sans flex flex-col justify-between p-4 sm:p-8"
      style={{ perspective: '1200px' }}
    >
      {/* Dynamic Background Glow */}
      <motion.div
        animate={{
          background: `radial-gradient(circle at ${50 + mousePos.x * 30}% ${50 + mousePos.y * 30}%, ${currentSlide.badgeColor}25, transparent 70%)`,
        }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 pointer-events-none blur-3xl"
      />

      {/* Floating Background Adinkra Watermarks */}
      <div 
        className="absolute top-10 left-10 opacity-[0.03] pointer-events-none transition-transform duration-300"
        style={{ transform: `translate3d(${mousePos.x * -40}px, ${mousePos.y * -40}px, 0)` }}
      >
        <GyeNyameIcon className="w-96 h-96 text-[#C8951E]" />
      </div>
      <div 
        className="absolute bottom-10 right-10 opacity-[0.03] pointer-events-none transition-transform duration-300"
        style={{ transform: `translate3d(${mousePos.x * 40}px, ${mousePos.y * 40}px, 0)` }}
      >
        <SankofaIcon className="w-96 h-96 text-[#C8951E]" />
      </div>

      {/* TOP NAVBAR */}
      <header className="relative z-30 max-w-7xl w-full mx-auto flex items-center justify-between py-2">
        <KeneLogo href="/" subtitle="AFRICA" size="md" />

        {/* Step Indicator Dots & Skip */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 px-3 py-1.5 rounded-full">
            {ONBOARDING_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlideIndex 
                    ? 'w-6 bg-[#C8951E]' 
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          <button
            onClick={onComplete}
            className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition cursor-pointer"
          >
            Passer
          </button>
        </div>
      </header>

      {/* MAIN 3D DISPLAY AREA */}
      <main className="relative z-20 max-w-6xl w-full mx-auto py-6 sm:py-10 my-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, rotateY: 15, scale: 0.95, z: -100 }}
            animate={{ 
              opacity: 1, 
              rotateY: mousePos.x * 12, 
              rotateX: mousePos.y * -12, 
              scale: 1, 
              z: 0 
            }}
            exit={{ opacity: 0, rotateY: -15, scale: 0.95, z: -100 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            style={{ transformStyle: 'preserve-3d' }}
          >
            
            {/* LEFT COLUMN: TEXT STORYTELLING */}
            <div className="lg:col-span-7 space-y-6">
              <Badge 
                style={{ backgroundColor: `${currentSlide.badgeColor}20`, color: currentSlide.badgeColor, borderColor: `${currentSlide.badgeColor}40` }}
                className="border font-mono text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" />
                {currentSlide.badge}
              </Badge>

              <h1 className="text-3xl sm:text-5xl font-display font-black text-white leading-tight tracking-tight">
                {currentSlide.title}
              </h1>

              <p className="text-base sm:text-lg text-[#F3E5AB] font-medium leading-relaxed">
                {currentSlide.subtitle}
              </p>

              <p className="text-xs sm:text-sm text-white/70 font-sans leading-relaxed">
                {currentSlide.description}
              </p>

              {/* Feature Highlights */}
              <div className="space-y-3 pt-2">
                {currentSlide.features.map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-md hover:border-[#C8951E]/50 transition"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#C8951E]/20 border border-[#C8951E]/40 flex items-center justify-center text-[#F3E5AB]">
                        <Icon className="w-4 h-4 text-[#C8951E]" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-white/90">
                        {feat.text}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: 3D FLOATING IMAGE CARD */}
            <div className="lg:col-span-5 flex justify-center">
              <div 
                className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden border-2 border-white/15 bg-gradient-to-b from-white/10 to-black/40 backdrop-blur-2xl shadow-2xl group transition-transform duration-300"
                style={{
                  transform: `translate3d(${mousePos.x * 20}px, ${mousePos.y * 20}px, 40px)`,
                  boxShadow: `0 25px 50px -12px ${currentSlide.badgeColor}30`,
                }}
              >
                {/* Visual Image */}
                <img 
                  src={currentSlide.image} 
                  alt={currentSlide.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0603] via-transparent to-transparent opacity-80" />

                {/* Floating Micro Badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-md flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#F3E5AB]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>XP-3D IMMERSIVE</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/50">SLIDE {currentSlideIndex + 1}/3</span>
                </div>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>
      </main>

      {/* FOOTER NAVIGATION CONTROLS */}
      <footer className="relative z-30 max-w-7xl w-full mx-auto flex items-center justify-between py-4 border-t border-white/10">
        
        {/* Previous Button */}
        <Button
          onClick={handlePrev}
          disabled={currentSlideIndex === 0}
          variant="outline"
          className="border-white/10 text-white/70 hover:text-white hover:bg-white/5 disabled:opacity-30 rounded-2xl h-11 px-5 font-mono text-xs cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Précédent</span>
        </Button>

        {/* Slide Counter */}
        <span className="text-xs font-mono text-white/50 hidden sm:inline">
          Étape {currentSlideIndex + 1} sur {ONBOARDING_SLIDES.length}
        </span>

        {/* Next / Complete Button */}
        <Button
          onClick={handleNext}
          className={`bg-gradient-to-r ${currentSlide.accent} text-[#0F0A05] font-black text-xs rounded-2xl h-11 px-6 shadow-lg hover:scale-105 transition cursor-pointer flex items-center gap-2`}
        >
          <span>{currentSlideIndex === ONBOARDING_SLIDES.length - 1 ? 'Accéder à l\'Expérience Kènè' : 'Suivant'}</span>
          {currentSlideIndex === ONBOARDING_SLIDES.length - 1 ? (
            <ChevronRight className="w-4 h-4 text-[#0F0A05]" />
          ) : (
            <ArrowRight className="w-4 h-4 text-[#0F0A05]" />
          )}
        </Button>

      </footer>
    </div>
  );
}
