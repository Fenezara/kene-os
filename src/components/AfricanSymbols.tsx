'use client';

import React from 'react';

// 🌍 Authentic West-African Adinkra & Sacred Geometry Symbols
export const AdinkraDuafe = ({ className = "w-6 h-6 text-[#FFD700]" }: { className?: string }) => (
  // Duafe — Sacred Comb (Beauty, Feminine Care & Hygiene)
  <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
    <path d="M20 20 h60 v15 h-60 z M25 35 v45 h6 v-45 z M39 35 v45 h6 v-45 z M53 35 v45 h6 v-45 z M67 35 v45 h6 v-45 z M20 12 a8 8 0 0 1 8 -8 h44 a8 8 0 0 1 8 8 v8 h-60 z" />
    <circle cx="50" cy="12" r="4" fill="#0A0503" />
  </svg>
);

export const AdinkraSankofa = ({ className = "w-6 h-6 text-[#FFD700]" }: { className?: string }) => (
  // Sankofa — Wisdom & Learning from Roots
  <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
    <path d="M50 15 C30 15 15 30 15 50 C15 70 30 85 50 85 C70 85 85 70 85 50 C85 30 70 15 50 15 Z M50 25 C63 25 75 35 75 50 C75 63 63 75 50 75 C37 75 25 63 25 50 C25 35 37 25 50 25 Z" />
    <circle cx="50" cy="50" r="12" />
    <path d="M35 50 L65 50 L50 28 Z" />
  </svg>
);

export const AdinkraGyeNyame = ({ className = "w-6 h-6 text-[#FFD700]" }: { className?: string }) => (
  // Gye Nyame — Supremacy of Nature & Divine Protection
  <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
    <path d="M50 5 L60 25 L85 25 L65 40 L75 65 L50 50 L25 65 L35 40 L15 25 L40 25 Z" />
    <circle cx="50" cy="40" r="8" fill="#0A0503" />
  </svg>
);

export const AdinkraAya = ({ className = "w-6 h-6 text-[#FFD700]" }: { className?: string }) => (
  // Aya — Sacred Fern (Resilience, Endurance & Botanical Healing)
  <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
    <path d="M50 90 Q50 50 80 15 M50 90 Q50 50 20 15 M50 75 Q65 60 85 55 M50 75 Q35 60 15 55 M50 55 Q70 40 88 32 M50 55 Q30 40 12 32 M50 35 Q72 20 85 10 M50 35 Q28 20 15 10" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" />
  </svg>
);

// 🎨 Bogolan Geometric Border Motif
export const BogolanPatternBorder = () => (
  <div className="w-full h-3 bg-repeat-x opacity-40 flex items-center overflow-hidden my-1">
    {[...Array(20)].map((_, i) => (
      <div key={i} className="flex items-center gap-1 shrink-0 text-[#FFD700] text-[10px] font-mono select-none">
        <span>▲</span>
        <span>▼</span>
        <span>◆</span>
        <span>║</span>
      </div>
    ))}
  </div>
);

// ✨ Afro-Futuristic Holographic Halo Component
export const AfroHologramHalo = ({ title }: { title: string }) => (
  <div className="relative inline-flex items-center justify-center p-3 rounded-3xl bg-gradient-to-r from-[#FFD700]/20 via-[#C8951E]/10 to-[#E5A93C]/20 border-2 border-[#FFD700]/60 shadow-[0_0_30px_rgba(255,215,0,0.25)] overflow-hidden">
    <div className="absolute -inset-10 bg-gradient-to-r from-[#FFD700]/30 to-transparent blur-xl animate-pulse pointer-events-none" />
    <div className="relative z-10 flex items-center gap-2">
      <AdinkraDuafe className="w-5 h-5 text-[#FFD700] animate-bounce" />
      <span className="font-serif font-black text-xs text-[#FFD700] tracking-widest uppercase">
        {title}
      </span>
      <AdinkraAya className="w-5 h-5 text-[#FFD700] animate-pulse" />
    </div>
  </div>
);
