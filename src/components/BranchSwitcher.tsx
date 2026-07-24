'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, Check, Building2, MapPin, Lock, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BRANCHES = [
  { id: 'abidjan', name: 'Kènè Institut Cocody', city: 'Abidjan (Côte d\'Ivoire 🇨🇮)', currency: 'XOF', plan: 'Plan Pro' },
  { id: 'dakar', name: 'Kènè Afro Beauty Almadies', city: 'Dakar (Sénégal 🇸🇳)', currency: 'XOF', plan: 'Plan Pro' },
  { id: 'bamako', name: 'Kènè Botanique Bamako Coura', city: 'Bamako (Mali 🇲🇱)', currency: 'XOF', plan: 'Plan Pro' },
  { id: 'douala', name: 'Kènè Dermo Spa Douala', city: 'Douala (Cameroun 🇨🇲)', currency: 'XAF', plan: 'Plan Chaîne' },
];

export function BranchSwitcher() {
  const { toast } = useToast();
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if logged in user has Super-Admin role
    if (typeof document !== 'undefined') {
      const cookies = document.cookie;
      const isSuperAdminSession = cookies.includes('kene-session=admin-');
      setIsAdmin(isSuperAdminSession);
    }
  }, []);

  const handleSelect = (branch: typeof BRANCHES[0]) => {
    if (!isAdmin) {
      toast({
        title: "🔒 Accès Refusé (Isolation Multi-Tenants)",
        description: "Seul le Super-Admin SaaS peut naviguer entre les différentes entreprises.",
        variant: "destructive",
      });
      setIsOpen(false);
      return;
    }

    setSelectedBranch(branch);
    setIsOpen(false);
    toast({
      title: `🔄 Super-Admin : Basculement vers ${branch.name}`,
      description: `Interface et données synchronisées pour ${branch.city}.`,
    });
  };

  return (
    <div className="relative mt-4">
      {/* Active Salon Chip Button */}
      <button
        onClick={() => {
          if (!isAdmin) {
            toast({
              title: "🛡️ Établissement Isolé",
              description: "Votre entreprise est strictement isolée. Seul le Super-Admin SaaS a le droit d'accéder aux interfaces de toutes les entreprises.",
            });
            return;
          }
          setIsOpen(!isOpen);
        }}
        className="w-full bg-[#241C16] hover:bg-[#2A211A] border border-[#C8951E]/20 rounded-2xl px-3 py-2.5 flex items-center gap-2.5 transition-all text-left group cursor-pointer"
      >
        <div className="w-6 h-6 rounded-xl bg-gradient-to-br from-[#C8951E]/40 to-[#8A3B14]/30 flex items-center justify-center shrink-0">
          {isAdmin ? (
            <ShieldCheck className="w-3.5 h-3.5 text-[#C8951E]" />
          ) : (
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-bold text-white/90 truncate font-display group-hover:text-[#F3E5AB] transition-colors">
            {selectedBranch.name}
          </div>
          <div className="text-[9px] text-[#C8951E]/70 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            {isAdmin ? 'Super-Admin 🔐' : 'Données Isolées 🔒'}
          </div>
        </div>
        {isAdmin && (
          <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${isOpen ? 'rotate-180 text-[#C8951E]' : ''}`} />
        )}
      </button>

      {/* Dropdown Menu (Only accessible to Super-Admin) */}
      <AnimatePresence>
        {isOpen && isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#1A1410] border border-[#C8951E]/30 rounded-2xl p-2 shadow-2xl backdrop-blur-xl"
          >
            <div className="text-[9px] font-bold text-[#C8951E] uppercase tracking-wider px-2 py-1 mb-1 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#C8951E]" /> Console Super-Admin (Accès Global)
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-none">
              {BRANCHES.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleSelect(b)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    selectedBranch.id === b.id ? 'bg-[#C8951E]/20 text-[#F3E5AB]' : 'hover:bg-white/5 text-white/70 hover:text-white'
                  }`}
                >
                  <div>
                    <div className="font-bold font-display">{b.name}</div>
                    <div className="text-[9px] text-white/40 flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-[#C8951E]" /> {b.city}
                    </div>
                  </div>
                  {selectedBranch.id === b.id && (
                    <Check className="w-4 h-4 text-[#C8951E]" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
