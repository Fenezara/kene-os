'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Scissors, RefreshCw, Check, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter, usePathname } from 'next/navigation';

export function RoleSwitcher() {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Check if current page is in (pro) or (client)
  const isPro = pathname.startsWith('/dashboard') ||
                pathname.startsWith('/agenda') ||
                pathname.startsWith('/pos') ||
                pathname.startsWith('/clients') ||
                pathname.startsWith('/inventory') ||
                pathname.startsWith('/reviews') ||
                pathname.startsWith('/employees') ||
                pathname.startsWith('/marketing') ||
                pathname.startsWith('/diagnoses') ||
                pathname.startsWith('/rh') ||
                pathname.startsWith('/compta') ||
                pathname.startsWith('/services') ||
                pathname.startsWith('/settings') ||
                pathname.startsWith('/reports') ||
                pathname.startsWith('/referral') ||
                pathname.startsWith('/wallet');

  const currentRole = isPro ? 'pro' : 'client';

  const handleSwitchRole = (targetRole: 'client' | 'pro') => {
    setIsOpen(false);

    if (targetRole === 'client') {
      document.cookie = 'kene-session=; path=/; max-age=0; SameSite=Lax';
      document.cookie = `kene-session=client-${Date.now()}; path=/; max-age=86400; SameSite=Lax`;
      toast({
        title: '🌸 Mode Cliente Activé',
        description: 'Vous êtes maintenant dans votre espace personnel (soins, bilans & points fidélité).',
      });
      window.location.href = '/portal';
    } else {
      document.cookie = 'kene-session=; path=/; max-age=0; SameSite=Lax';
      document.cookie = `kene-session=gerant-${Date.now()}; path=/; max-age=86400; SameSite=Lax`;
      toast({
        title: '✂️ Mode Praticienne Pro Activé',
        description: 'Vous êtes maintenant dans votre espace de travail salon (Agenda, Caisse & Diagnostiques).',
      });
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="relative inline-block">
      {/* Switcher Pill Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold font-display transition-all cursor-pointer shadow-md ${
          currentRole === 'pro'
            ? 'bg-[#C8951E]/15 border-[#C8951E]/40 text-[#F3E5AB] hover:bg-[#C8951E]/25'
            : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
        }`}
        title="Changer de profil (Cliente ↔ Praticienne Pro)"
      >
        <span className="text-sm">{currentRole === 'pro' ? '✂️' : '🌸'}</span>
        <span>{currentRole === 'pro' ? 'Praticienne Pro' : 'Espace Cliente'}</span>
        <RefreshCw className="w-3 h-3 opacity-60 ml-0.5" />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 z-50 w-64 bg-[#1A1410] border border-[#C8951E]/40 rounded-2xl p-2.5 shadow-2xl backdrop-blur-2xl"
          >
            <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest px-2 py-1 mb-1 font-mono">
              Changer de Profil Utilisateur
            </div>

            <div className="space-y-1.5">
              {/* Option 1: Espace Cliente */}
              <button
                onClick={() => handleSwitchRole('client')}
                className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  currentRole === 'client'
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
                    : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-sm">
                    🌸
                  </div>
                  <div>
                    <div className="font-bold text-xs font-display">Mon Espace Cliente</div>
                    <div className="text-[9px] text-white/40 font-sans">Soins, bilans & points fidélité</div>
                  </div>
                </div>
                {currentRole === 'client' && <Check className="w-4 h-4 text-emerald-400" />}
              </button>

              {/* Option 2: Espace Praticienne Pro */}
              <button
                onClick={() => handleSwitchRole('pro')}
                className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  currentRole === 'pro'
                    ? 'bg-[#C8951E]/20 border-[#C8951E]/50 text-[#F3E5AB]'
                    : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#C8951E]/20 flex items-center justify-center text-sm">
                    ✂️
                  </div>
                  <div>
                    <div className="font-bold text-xs font-display">Espace Praticienne Pro</div>
                    <div className="text-[9px] text-white/40 font-sans">Agenda, caisse POS & diagnostics</div>
                  </div>
                </div>
                {currentRole === 'pro' && <Check className="w-4 h-4 text-[#C8951E]" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
