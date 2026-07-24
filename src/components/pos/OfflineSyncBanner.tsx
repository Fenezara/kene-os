'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function OfflineSyncBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Sync browser network events
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      triggerAutoSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const triggerAutoSync = () => {
    if (pendingSyncCount > 0) {
      setIsSyncing(true);
      setTimeout(() => {
        setPendingSyncCount(0);
        setIsSyncing(false);
      }, 2000);
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence>
        {!isOnline ? (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center justify-between text-amber-400 text-xs font-medium mb-4"
          >
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Mode Hors-Ligne Actif — Les ventes sont stockées localement sur la tablette de caisse.</span>
            </div>
            <Badge variant="outline" className="border-amber-500/50 text-amber-400">
              {pendingSyncCount} vente(s) en attente
            </Badge>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex items-center justify-between text-[11px] text-karite/60 bg-[#1A1410] border border-[#362A21] px-3 py-1.5 rounded-lg mb-4"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5" /> Serveur Caisse Synchronisé
              </span>
            </div>
            {isSyncing && (
              <span className="flex items-center gap-1 text-[var(--gold-kene)]">
                <RefreshCw className="w-3 h-3 animate-spin" /> Synchro en cours...
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
