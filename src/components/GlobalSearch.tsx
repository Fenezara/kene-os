'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, X, Calendar, ShoppingCart, Users, ScanFace, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const QUICK_ACTIONS = [
  { label: 'Nouveau Rendez-vous', icon: Calendar, href: '/agenda', shortcut: 'A' },
  { label: 'Encaisser une Vente', icon: ShoppingCart, href: '/pos', shortcut: 'P' },
  { label: 'Ajouter une Cliente', icon: Users, href: '/clients', shortcut: 'C' },
  { label: 'Diagnostic IA', icon: ScanFace, href: '/diagnoses', shortcut: 'D' },
  { label: 'Lancer Campagne', icon: MessageSquare, href: '/marketing', shortcut: 'M' },
];

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const filteredActions = query 
    ? QUICK_ACTIONS.filter(a => a.label.toLowerCase().includes(query.toLowerCase()))
    : QUICK_ACTIONS;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-[#0A0603]/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="relative w-full max-w-xl bg-[#0F0A05] border border-[#C8951E]/20 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Gold line at top */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#C8951E] to-transparent opacity-50" />
          
          <div className="flex items-center gap-3 p-4 border-b border-white/5">
            <Search className="w-5 h-5 text-white/40" />
            <input
              autoFocus
              type="text"
              placeholder="Rechercher (Clients, RDV, Factures...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none text-white placeholder-white/30 focus:outline-none focus:ring-0 text-base"
            />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-white/30 bg-white/5 px-1.5 py-0.5 rounded">ESC</span>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white/50">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-2 max-h-[60vh] overflow-y-auto scrollbar-none">
            {query && filteredActions.length === 0 ? (
              <div className="py-12 text-center text-white/40 text-sm">
                Aucun rÃ©sultat trouvÃ© pour "{query}"
              </div>
            ) : (
              <div className="space-y-1">
                <div className="px-3 py-2 text-[10px] font-bold tracking-[0.15em] uppercase text-white/30">
                  {query ? 'RÃ©sultats' : 'Actions Rapides'}
                </div>
                {filteredActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setIsOpen(false);
                      router.push(action.href);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-white/5 transition-colors text-left group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#C8951E]/20 group-hover:text-[#C8951E] text-white/60 transition-colors">
                      <action.icon className="w-4 h-4" />
                    </div>
                    <span className="flex-1 text-sm font-medium text-white/80 group-hover:text-white">{action.label}</span>
                    {!query && (
                      <span className="text-[10px] font-mono text-white/30 bg-white/5 px-2 py-1 rounded-lg">
                        {action.shortcut}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
