'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function AppSplashScreen() {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    // Check if splash screen was already shown in this tab session
    const hasSeenSplash = sessionStorage.getItem('kene_app_splash_shown');
    
    if (!hasSeenSplash) {
      setShowSplash(true);
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('kene_app_splash_shown', 'true');
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[99999] bg-[#0F0A05] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden"
        >
          {/* Subtle Golden Ambient Background Glow */}
          <div className="absolute w-96 h-96 bg-[var(--gold-kene)]/15 rounded-full blur-[100px] pointer-events-none animate-pulse" />

          {/* Main Logo Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'out' }}
            className="relative z-10 flex flex-col items-center space-y-5"
          >
            <div className="relative group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] opacity-75 blur-lg animate-tilt" />
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-[var(--gold-kene)]/80 bg-[#1A1410] p-1.5 shadow-2xl flex items-center justify-center">
                <img
                  src="/images/kene_logo.jpg"
                  alt="Kènè OS"
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => {
                    // Fallback to stylized logo placeholder if image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#C8951E] to-[#8A3B14] hidden flex-col items-center justify-center font-display font-black text-black text-3xl">
                  KÈNÈ
                </div>
              </div>
            </div>

            {/* Brand Title */}
            <div className="space-y-1">
              <motion.h1
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="font-display font-black text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#FFF] via-[#F3E5AB] to-[var(--gold-kene)] tracking-wider"
              >
                KÈNÈ OS
              </motion.h1>

              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="text-xs sm:text-sm text-[#F3E5AB]/80 font-medium tracking-widest uppercase flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[var(--gold-kene)]" />
                La Beauté Mélanoderme, Révélée
              </motion.p>
            </div>

            {/* Animated Gold Progress Loader Bar */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 140, opacity: 1 }}
              transition={{ delay: 0.4, duration: 1.2, ease: 'easeInOut' }}
              className="h-1 bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] rounded-full shadow-lg shadow-[var(--gold-kene)]/50 mt-4"
            />

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.6 }}
              className="text-[10px] font-mono text-white/40 tracking-widest uppercase mt-2"
            >
              Chargement de votre Espace...
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
