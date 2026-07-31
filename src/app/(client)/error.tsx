'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';
import Link from 'next/link';

export default function ClientErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Client Portal Runtime Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#0F0A05] text-white">
      <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-xl">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <h1 className="font-display font-bold text-xl sm:text-2xl text-white mb-2">
        Optimisation de votre Espace Client
      </h1>
      
      <p className="text-xs text-white/60 max-w-md mx-auto mb-4">
        Une mise à jour rapide de l'interface est en cours.
      </p>

      {/* Show detailed error message on screen so it can be identified immediately */}
      {error?.message && (
        <div className="mb-6 max-w-lg w-full bg-red-950/40 border border-red-500/40 rounded-2xl p-3 text-left font-mono text-[11px] text-red-200 overflow-x-auto">
          <div className="font-bold text-red-400 mb-1">Détails de l'erreur :</div>
          <p className="whitespace-pre-wrap">{error.message}</p>
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap justify-center">
        <Button
          onClick={() => reset()}
          className="bg-gradient-to-r from-[var(--gold-kene)] to-[#D4AF37] text-black font-bold text-xs rounded-xl h-10 px-5 shadow-lg flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" /> Réessayer
        </Button>

        <Link href="/welcome">
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl h-10 text-xs px-4">
            <Home className="w-4 h-4 mr-1.5" /> Retour Accueil 3D
          </Button>
        </Link>
      </div>
    </div>
  );
}
