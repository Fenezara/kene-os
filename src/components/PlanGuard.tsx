'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles, ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { KENE_PRICING_PLANS } from '@/config/pricing';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PlanGuardProps {
  module: string;
  moduleName: string;
  requiredPlan?: 'pro' | 'elite';
  children: React.ReactNode;
}

export function PlanGuard({ module, moduleName, requiredPlan = 'pro', children }: PlanGuardProps) {
  const [activePlan, setActivePlan] = useState<'essentiel' | 'pro' | 'elite'>('essentiel');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updatePlan = () => {
      try {
        const stored = localStorage.getItem('kene_active_plan');
        if (stored && (stored === 'essentiel' || stored === 'pro' || stored === 'elite')) {
          setActivePlan(stored);
        }
      } catch (e) {}
    };

    updatePlan();
    window.addEventListener('kene_plan_changed', updatePlan);
    return () => window.removeEventListener('kene_plan_changed', updatePlan);
  }, []);

  if (!mounted) {
    return <div className="min-h-[60vh] flex items-center justify-center text-white/50 font-mono text-xs">Vérification des permissions du plan...</div>;
  }

  const allowedModules = KENE_PRICING_PLANS[activePlan]?.allowedModules || [];
  const isAllowed = allowedModules.includes(module);

  if (isAllowed) {
    return <>{children}</>;
  }

  const targetPlanName = requiredPlan === 'elite' ? 'Plan 3 : Élite Royal (30 000 FCFA)' : 'Plan 2 : Pro (15 000 FCFA)';

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full p-8 rounded-3xl bg-gradient-to-b from-[#1E1208] to-[#120B05] border-2 border-[#C8951E]/60 shadow-2xl text-center space-y-6 relative overflow-hidden"
      >
        {/* Glow Effects */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#C8951E]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#8A1C14]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-3xl bg-[#C8951E]/20 border border-[#C8951E]/50 flex items-center justify-center mx-auto text-3xl shadow-xl">
          🔒
        </div>

        <div className="space-y-2">
          <Badge className="bg-[#C8951E]/20 text-[#F3E5AB] border border-[#C8951E]/40 font-mono text-xs px-3 py-1">
            Module Verrouillé en {activePlan.toUpperCase()}
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white">
            Le Module "{moduleName}" Nécessite le {targetPlanName}
          </h2>
          <p className="text-xs sm:text-sm text-white/70 max-w-md mx-auto font-sans leading-relaxed">
            Votre établissement est actuellement configuré sur le <strong>Plan {activePlan.toUpperCase()}</strong>. Pour débloquer l'accès à <strong>{moduleName}</strong>, veuillez effectuer la mise à niveau.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => {
              const nextPlan = requiredPlan === 'elite' ? 'elite' : 'pro';
              localStorage.setItem('kene_active_plan', nextPlan);
              window.dispatchEvent(new Event('kene_plan_changed'));
            }}
            className="w-full sm:w-auto h-12 px-6 bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black text-xs rounded-2xl shadow-xl hover:scale-105 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Simuler le Passage au {targetPlanName}
          </Button>

          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto h-12 px-5 border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-2xl text-xs font-bold gap-2">
              <ArrowLeft className="w-4 h-4" /> Retour au Dashboard
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
