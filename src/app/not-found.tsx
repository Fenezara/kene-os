'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0F0A05] flex flex-col items-center justify-center text-center px-6">
      <div className="text-7xl mb-4">🌿</div>
      <h1 className="text-4xl font-black text-white mb-2">
        Page <span className="bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] bg-clip-text text-transparent">introuvable</span>
      </h1>
      <p className="text-white/50 text-sm max-w-md mb-8">
        Cette page n&apos;existe pas ou a été déplacée. Vérifiez l&apos;adresse ou retournez à l&apos;accueil.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] font-black text-sm shadow-lg hover:opacity-90 transition"
        >
          ← Retour à l&apos;Accueil
        </Link>
        <Link
          href="/login"
          className="px-6 py-3 rounded-2xl border border-white/20 text-white/70 font-bold text-sm hover:bg-white/5 transition"
        >
          Se Connecter
        </Link>
      </div>
      <p className="text-white/20 text-[10px] mt-12 font-mono">Erreur 404 · Kènè OS</p>
    </div>
  );
}
