'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, RefreshCw, CheckCircle2 } from 'lucide-react';
import { getOfflineQueue, syncOfflineQueue, initOfflineSyncListener } from '@/lib/offline-engine';

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncedToast, setShowSyncedToast] = useState(false);

  useEffect(() => {
    initOfflineSyncListener();

    const updateStatus = () => {
      const offline = !navigator.onLine;
      setIsOffline(offline);
      const queue = getOfflineQueue();
      setPendingCount(queue.length);
    };

    updateStatus();

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    const handleSynced = (e: any) => {
      setShowSyncedToast(true);
      setPendingCount(0);
      setTimeout(() => setShowSyncedToast(false), 4000);
    };

    window.addEventListener('kene-offline-synced', handleSynced);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      window.removeEventListener('kene-offline-synced', handleSynced);
    };
  }, []);

  const handleManualSync = async () => {
    if (!navigator.onLine) return;
    setIsSyncing(true);
    await syncOfflineQueue();
    setIsSyncing(false);
  };

  return (
    <AnimatePresence>
      {/* ── BANNIÈRE MODE HORS-LIGNE (OFFLINE BANNER) ── */}
      {isOffline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-2 left-1/2 -translate-x-1/2 z-[99999] bg-[#1A1410]/95 border border-[var(--gold-kene)]/80 text-white px-4 py-2 rounded-2xl shadow-[0_0_30px_rgba(200,149,30,0.5)] backdrop-blur-xl flex items-center gap-3 text-xs select-none"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <WifiOff className="w-4 h-4 text-amber-400" />
          <div>
            <span className="font-bold text-[#F3E5AB]">Mode Hors-Ligne Actif</span>
            <span className="text-[10px] text-white/70 block">Les données sont enregistrées en sécurité sur votre appareil</span>
          </div>
          {pendingCount > 0 && (
            <span className="bg-[#C8951E] text-black font-mono font-black text-[10px] px-2 py-0.5 rounded-full">
              {pendingCount} en attente
            </span>
          )}
        </motion.div>
      )}

      {/* ── NOTIFICATION SYNCHRO RÉUSSIE QUAND INTERNET REVIENT ── */}
      {showSyncedToast && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[99999] bg-emerald-950/90 border border-emerald-500/80 text-white px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-3 text-xs"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div>
            <span className="font-bold text-emerald-300">Connexion Rétablie !</span>
            <span className="text-[10px] text-emerald-100/80 block">Toutes les opérations hors-ligne ont été synchronisées avec le cloud Kènè OS.</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
