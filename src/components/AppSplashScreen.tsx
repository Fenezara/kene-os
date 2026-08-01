'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function AppSplashScreen() {
  // Initialize to true by default so it covers the page at frame 0 (no flash of portal content)
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if splash screen was already shown in this browser session
    const hasSeenSplash = typeof window !== 'undefined' ? sessionStorage.getItem('kene_app_splash_shown') : null;
    
    if (hasSeenSplash) {
      // If already shown in this tab session, dismiss immediately
      setShowSplash(false);
    } else {
      // Fresh app launch: Keep logo splash screen visible for 2.8 seconds for maximum brand prestige
      const timer = setTimeout(() => {
        setShowSplash(false);
        try {
          sessionStorage.setItem('kene_app_splash_shown', 'true');
        } catch (e) {}
      }, 2800);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!showSplash) return null;

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[999999] bg-[#0F0A05] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden"
        >
          {/* Subtle Golden Ambient Background Glow */}
          <div className="absolute w-[500px] h-[500px] bg-[var(--gold-kene)]/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />

          {/* Main Logo Container */}
          <motion.div
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center space-y-6"
          >
            <div className="relative group">
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] opacity-80 blur-xl animate-pulse" />
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-2 border-[var(--gold-kene)] bg-[#1A1410] p-2 shadow-[0_0_50px_rgba(200,149,30,0.5)] flex items-center justify-center">
                <img
                  src="/images/kene_logo.jpg"
                  alt="Kènè OS Logo"
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#C8951E] to-[#8A3B14] hidden flex-col items-center justify-center font-display font-black text-black text-3xl">
                  KÈNÈ
                </div>
              </div>
            </div>

            {/* Brand Title & Tagline */}
            <div className="space-y-2">
              <motion.h1
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="font-display font-black text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#FFF] via-[#F3E5AB] to-[var(--gold-kene)] tracking-wider drop-shadow-lg"
              >
                KÈNÈ OS
              </motion.h1>

              <motion.p
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xs sm:text-sm text-[#F3E5AB] font-medium tracking-widest uppercase flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-[var(--gold-kene)] animate-spin" />
                La Beauté Mélanoderme, Révélée
              </motion.p>
            </div>

            {/* Animated Gold Progress Bar */}
            <div className="w-48 sm:w-56 h-1.5 bg-white/10 rounded-full overflow-hidden p-0.5 mt-4 border border-[var(--gold-kene)]/30">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.3, duration: 2.3, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] rounded-full shadow-[0_0_15px_rgba(200,149,30,0.8)]"
              />
            </div>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.7 }}
              className="text-[11px] font-mono text-[#F3E5AB]/70 tracking-widest uppercase mt-2 font-bold"
            >
              Initialisation de votre Espace...
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
