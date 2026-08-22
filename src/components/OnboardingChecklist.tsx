'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Scissors, Users, ShoppingCart, ArrowRight, Sparkles, ChevronDown, ChevronUp, X, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Step {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: any;
  href: string;
  actionText: string;
  badge: string;
}

const STEPS: Step[] = [
  {
    id: 'services',
    number: 1,
    title: 'Mes Prestations & Tarifs',
    description: 'Vérifiez ou ajoutez vos soins (Tresses, Soin Karité, Coupe, Brushing...) avec leurs prix en FCFA.',
    icon: Scissors,
    href: '/services',
    actionText: 'Configurer mes tarifs',
    badge: '1 minute'
  },
  {
    id: 'clients',
    number: 2,
    title: 'Mon Carnet de Clientes',
    description: 'Enregistrez les numéros et prénoms de vos clientes habituelles pour leur envoyer des rappels.',
    icon: Users,
    href: '/clients',
    actionText: 'Ajouter une cliente',
    badge: '1 minute'
  },
  {
    id: 'pos',
    number: 3,
    title: 'Tester un Premier Encaissement',
    description: 'Faites un encaissement test sur la caisse tactile avec Wave, Orange Money ou Espèces.',
    icon: ShoppingCart,
    href: '/pos',
    actionText: 'Ouvrir la caisse',
    badge: '30 secondes'
  }
];

export function OnboardingChecklist() {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    services: true,
    clients: false,
    pos: false
  });
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kene_onboarding_steps');
      if (saved) {
        setCompletedSteps(JSON.parse(saved));
      }
      const dismissed = localStorage.getItem('kene_onboarding_dismissed');
      if (dismissed === 'true') {
        setIsDismissed(true);
      }
    } catch (e) {}
  }, []);

  const toggleStep = (id: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const updated = { ...completedSteps, [id]: !completedSteps[id] };
    setCompletedSteps(updated);
    try {
      localStorage.setItem('kene_onboarding_steps', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem('kene_onboarding_dismissed', 'true');
    } catch (e) {}
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / STEPS.length) * 100);

  if (isDismissed) {
    return (
      <div className="flex justify-end">
        <button
          onClick={() => setIsDismissed(false)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#C8951E]/20 border border-white/10 hover:border-[#C8951E] text-white/70 hover:text-white text-xs font-semibold transition cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#C8951E]" />
          <span>Guide de Démarrage Rapide</span>
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#1E1610] via-[#16100B] to-[#0D0906] border-2 border-[#C8951E]/40 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden"
    >
      {/* Background Gold Aura */}
      <div className="absolute top-0 right-0 w-80 h-40 bg-[#C8951E]/10 blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F3E5AB] to-[#C8951E] flex items-center justify-center text-xl shadow-lg shrink-0">
            🚀
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-display font-black text-white">
                Bienvenue ! Guide de Démarrage en <span className="bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] bg-clip-text text-transparent">3 Étapes Faciles</span>
              </h2>
              <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C8951E]/20 text-[#F3E5AB] border border-[#C8951E]/40 font-mono">
                {progressPercent}% Prêt
              </span>
            </div>
            <p className="text-white/60 text-xs mt-0.5">
              Suivez ces 3 étapes simples pour rendre votre salon 100% opérationnel en 3 minutes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white flex items-center justify-center cursor-pointer transition"
            title={isExpanded ? 'Réduire' : 'Déplier'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={handleDismiss}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 text-white/60 hover:text-red-300 flex items-center justify-center cursor-pointer transition"
            title="Masquer le guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5 relative z-10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-[#F3E5AB] via-[#C8951E] to-[#4CAF6E] rounded-full"
        />
      </div>

      {/* Steps List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10"
          >
            {STEPS.map((step) => {
              const isDone = completedSteps[step.id];
              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  className={`rounded-2xl p-4 border transition-all duration-300 flex flex-col justify-between ${
                    isDone
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-white'
                      : 'bg-black/50 border-white/10 hover:border-[#C8951E]/60 text-white'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black font-mono ${
                          isDone ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white/80'
                        }`}>
                          {step.number}
                        </span>
                        <span className="text-[10px] font-mono text-white/50">{step.badge}</span>
                      </div>

                      <button
                        onClick={(e) => toggleStep(step.id, e)}
                        className="text-xs flex items-center gap-1 cursor-pointer"
                        title={isDone ? 'Marquer comme à faire' : 'Marquer comme fait'}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-white/30 hover:text-[#C8951E]" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[#C8951E]" />
                      </div>
                      <h3 className="font-bold text-sm text-white">{step.title}</h3>
                    </div>

                    <p className="text-white/60 text-xs leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10">
                    <Link
                      href={step.href}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        isDone
                          ? 'bg-white/5 hover:bg-white/10 text-white/80 border border-white/10'
                          : 'bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-black hover:opacity-95 shadow-md font-black'
                      }`}
                    >
                      <span>{step.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
