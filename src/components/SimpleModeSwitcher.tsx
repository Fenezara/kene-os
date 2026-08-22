'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Layers } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SimpleModeSwitcher() {
  const { toast } = useToast();
  const [isSimpleMode, setIsSimpleMode] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kene_simple_mode');
      if (saved !== null) {
        setIsSimpleMode(saved === 'true');
      } else {
        // Default to Simple Mode for better beginner UX
        setIsSimpleMode(true);
        localStorage.setItem('kene_simple_mode', 'true');
      }
    } catch (e) {}
  }, []);

  const toggleMode = (simple: boolean) => {
    setIsSimpleMode(simple);
    try {
      localStorage.setItem('kene_simple_mode', String(simple));
      window.dispatchEvent(new Event('kene_simple_mode_changed'));
      toast({
        title: simple ? '⚡ Mode Simplifié Activé' : '👑 Mode Complet Activé',
        description: simple
          ? 'Affichage épuré des 4 fonctions indispensables pour votre salon.'
          : 'Tous les modules experts (RH, Compta, Dermo-IA, etc.) sont visibles.',
      });
    } catch (e) {}
  };

  return (
    <div className="inline-flex items-center p-1 rounded-2xl bg-black/60 border border-white/10 shadow-lg backdrop-blur-md">
      <button
        onClick={() => toggleMode(true)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
          isSimpleMode
            ? 'bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] font-black shadow-md'
            : 'text-white/60 hover:text-white hover:bg-white/5'
        }`}
      >
        <Zap className="w-3.5 h-3.5" />
        <span>Mode Simple ⚡</span>
      </button>

      <button
        onClick={() => toggleMode(false)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
          !isSimpleMode
            ? 'bg-[#C8951E]/30 text-[#F3E5AB] border border-[#C8951E]/50 font-black shadow-md'
            : 'text-white/60 hover:text-white hover:bg-white/5'
        }`}
      >
        <Layers className="w-3.5 h-3.5" />
        <span>Mode Complet 👑</span>
      </button>
    </div>
  );
}
