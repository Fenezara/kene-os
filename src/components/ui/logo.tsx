'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'full' | 'icon' | 'badge';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
  subtitle?: string;
}

export function KeneLogo({
  variant = 'full',
  size = 'md',
  href = '/dashboard',
  className = '',
  subtitle = 'PRO'
}: LogoProps) {
  const [customLogo, setCustomLogo] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kene_custom_salon_logo');
      if (saved) setCustomLogo(saved);
    }
  }, []);

  const sizeClasses = {
    sm: { img: 'w-7 h-7', title: 'text-base', sub: 'text-[9px]' },
    md: { img: 'w-9 h-9', title: 'text-xl', sub: 'text-[10px]' },
    lg: { img: 'w-12 h-12', title: 'text-2xl', sub: 'text-xs' },
  }[size];

  const logoSrc = customLogo || '/images/kene_logo.jpg';

  const content = (
    <div className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
      {/* Emblem Badge with Official or Custom Salon Logo */}
      <div className={`relative rounded-xl overflow-hidden border border-[#C8951E]/40 shadow-lg shadow-[#C8951E]/15 group-hover:scale-105 group-hover:border-[#C8951E] transition-all ${sizeClasses.img}`}>
        <img 
          src={logoSrc} 
          alt="Logo Établissement" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Typography */}
      {variant !== 'icon' && (
        <div className="flex flex-col leading-none">
          <div className={`font-display font-black text-white tracking-tight flex items-center gap-1 ${sizeClasses.title}`}>
            <span>KÈNÈ</span>
            {subtitle && (
              <span className={`font-mono font-bold text-[#C8951E] bg-[#C8951E]/10 border border-[#C8951E]/30 px-1.5 py-0.5 rounded-md uppercase tracking-wider ${sizeClasses.sub}`}>
                {subtitle}
              </span>
            )}
          </div>
          <span className="text-[9px] text-[#C8951E]/70 font-mono tracking-widest uppercase mt-0.5">
            Dermo-Cosmétique OS
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
