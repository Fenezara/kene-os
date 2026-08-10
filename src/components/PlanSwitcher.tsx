'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Shield, ChevronDown, Check, Lock } from 'lucide-react';
import { KENE_PRICING_PLANS, PricingPlan } from '@/config/pricing';

export function PlanSwitcher() {
  const pathname = usePathname();
  const [activePlan, setActivePlan] = useState<'essentiel' | 'pro' | 'elite'>('essentiel');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('kene_active_plan');
      if (stored && (stored === 'essentiel' || stored === 'pro' || stored === 'elite')) {
        setActivePlan(stored);
      }
    } catch (e) {}
  }, []);

  const handleSelectPlan = (planId: 'essentiel' | 'pro' | 'elite') => {
    setActivePlan(planId);
    setIsOpen(false);
    try {
      localStorage.setItem('kene_active_plan', planId);
      window.dispatchEvent(new Event('kene_plan_changed'));
    } catch (e) {}
  };

  const currentConfig: PricingPlan = KENE_PRICING_PLANS[activePlan] || KENE_PRICING_PLANS.pro;

  return (
    <div className="relative mt-2.5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-2xl bg-[#1A1410] border border-white/10 hover:border-[#C8951E]/50 transition duration-200 cursor-pointer shadow-md group"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div 
            className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse"
            style={{ backgroundColor: currentConfig.color }}
          />
          <div className="text-left truncate">
            <div className="text-[10px] font-bold font-mono tracking-wider uppercase text-white/50 flex items-center gap-1">
              <span>Plan Salon</span>
              <span className="text-[8px] px-1.5 py-0.2 bg-white/5 rounded text-white/40">{currentConfig.dailyCost}</span>
            </div>
            <div className="text-xs font-bold text-white truncate flex items-center gap-1">
              <span>{currentConfig.name.split(':')[1]?.trim() || currentConfig.name}</span>
              <span className="text-[9px] font-mono text-[#C8951E]">({currentConfig.priceMonthly.toLocaleString('fr-FR')} FCFA)</span>
            </div>
          </div>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-white/40 group-hover:text-white transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop click listener */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

            {/* Dropdown Card */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              className="absolute left-0 right-0 top-full mt-1.5 z-50 p-2 rounded-2xl bg-[#15100C] border border-[#C8951E]/30 shadow-2xl space-y-1.5 backdrop-blur-xl"
            >
              <div className="px-2 py-1 text-[9px] font-mono font-bold text-[#C8951E] uppercase tracking-wider flex items-center justify-between border-b border-white/5 pb-1.5 mb-1">
                <span>⚡ Simuler le Plan Salon</span>
                <span>Feature Flag</span>
              </div>

              {(Object.keys(KENE_PRICING_PLANS) as Array<'essentiel' | 'pro' | 'elite'>).map((key) => {
                const plan = KENE_PRICING_PLANS[key];
                const isSelected = activePlan === key;

                return (
                  <button
                    key={key}
                    onClick={() => handleSelectPlan(key)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all duration-200 flex items-center justify-between cursor-pointer border ${
                      isSelected
                        ? 'bg-[#C8951E]/15 border-[#C8951E]/50 text-white shadow-sm'
                        : 'bg-white/5 border-transparent hover:bg-white/10 text-white/70 hover:text-white'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: plan.color }} />
                        <span className="text-xs font-bold">{plan.name}</span>
                        {plan.badge && (
                          <span className="text-[8px] font-mono font-bold bg-[#C8951E]/20 text-[#F3E5AB] px-1.5 py-0.2 rounded-full border border-[#C8951E]/30">
                            {plan.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-white/50 font-mono pl-3.5">
                        {plan.priceMonthly.toLocaleString('fr-FR')} FCFA / mo • {plan.allowedModules.length} modules
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#C8951E] text-black flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 font-bold" />
                      </div>
                    )}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
