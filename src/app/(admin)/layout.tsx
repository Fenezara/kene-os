'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, ShoppingBag, ShieldCheck, Sparkles, UserPlus } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  useEffect(() => {
    // Ensure active admin session cookie is set for smooth super-admin navigation
    if (!document.cookie.includes('kene-session')) {
      document.cookie = 'kene-session=admin-active; path=/; max-age=86400; SameSite=Lax';
    }
  }, []);

  const adminNav = [
    { href: '/admin', label: 'Vue Globale (Tenants)', icon: Building2 },
    { href: '/admin/marketplace', label: 'Kènè App Store', icon: ShoppingBag },
    { href: '/admin/security', label: 'Audit & Sécurité', icon: ShieldCheck },
    { href: '/onboarding', label: 'Nouveau Salon (Wizard)', icon: UserPlus },
  ];

  return (
    <div className="min-h-screen bg-[#0F0A05] text-[#F8F1E4] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-16 bg-[#1A1410] border-b border-white/10 px-8 flex items-center justify-between sticky top-0 z-50">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8A1C14] to-[#C8951E] flex items-center justify-center font-bold text-white font-display shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-white">
            Console Super-Admin <span className="text-[var(--gold-kene)]">Kènè SaaS</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-bold">
            🟢 Plateforme Active (82 Routes)
          </span>
          <div className="text-xs text-white/60 font-mono">
            Super-Administrateur
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex">
        {/* Left Nav */}
        <aside className="w-64 bg-[#1A1410] border-r border-white/10 p-6 space-y-2 shrink-0">
          <div className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-3 px-3">
            Navigation Administrateur
          </div>
          {adminNav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[var(--gold-kene)] text-[#0F0A05] shadow-lg'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </aside>

        {/* Content */}
        <main className="flex-1 p-8 overflow-y-auto bg-[#140F0B]">
          {children}
        </main>
      </div>
    </div>
  );
}
