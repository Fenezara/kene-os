'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Kènè OS] Runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0F0A05] flex flex-col items-center justify-center text-center px-6">
      <div className="text-7xl mb-4">⚠️</div>
      <h1 className="text-3xl font-black text-white mb-2">
        Une erreur est <span className="bg-gradient-to-r from-[#E07A2B] to-[#C8951E] bg-clip-text text-transparent">survenue</span>
      </h1>
      <p className="text-white/50 text-sm max-w-md mb-6">
        Nous sommes désolés, quelque chose s&apos;est mal passé. Notre équipe a été notifiée.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] font-black text-sm shadow-lg hover:opacity-90 transition cursor-pointer"
        >
          🔄 Réessayer
        </button>
        <a
          href="/"
          className="px-6 py-3 rounded-2xl border border-white/20 text-white/70 font-bold text-sm hover:bg-white/5 transition"
        >
          ← Accueil
        </a>
      </div>
      {error?.digest && (
        <p className="text-white/15 text-[9px] mt-8 font-mono">Réf: {error.digest}</p>
      )}
      <p className="text-white/20 text-[10px] mt-4 font-mono">Kènè OS · Support technique</p>
    </div>
  );
}
