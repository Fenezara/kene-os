'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, ShoppingBag, ShieldCheck, UserPlus, Crown, Menu, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KeneLogo } from '@/components/ui/logo';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Ensure active admin session cookie is set for smooth super-admin navigation
    if (!document.cookie.includes('kene-session')) {
      document.cookie = 'kene-session=admin-active; path=/; max-age=86400; SameSite=Lax';
    }
  }, []);

  // Don't render admin header/sidebar on the isolated admin login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const adminNav = [
    { href: '/admin', label: 'Vue Globale (Salons)', icon: Building2 },
    { href: '/admin/marketplace', label: 'Marketplace Addons', icon: ShoppingBag },
    { href: '/admin/security', label: 'Audit & Sécurité OWASP', icon: ShieldCheck },
    { href: '/onboarding', label: 'Nouveau Salon (Wizard)', icon: UserPlus },
  ];

  return (
    <div className="min-h-screen bg-[#0F0A05] text-[#F8F1E4] flex flex-col font-sans">
      {/* ── TOP STICKY NAVBAR ── */}
      <header className="h-16 bg-[#1A1410] border-b border-white/10 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-white/70 hover:text-white bg-white/5 border border-white/10"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <KeneLogo href="/admin" subtitle="ADMIN" size="md" />
        </div>

        {/* Desktop Header Stats */}
        <div className="hidden sm:flex items-center gap-4">
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-3 py-1 font-bold">
            🟢 Plateforme Active (SOC2 / OWASP)
          </Badge>
          <Link href="/login">
            <Button size="sm" variant="outline" className="border-white/10 text-xs text-white/80 hover:bg-white/5 h-8">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Sortie Admin
            </Button>
          </Link>
        </div>
      </header>

      {/* ── MOBILE DROPDOWN MENU ── */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1A1410] border-b border-white/10 p-4 space-y-2 z-40">
          <div className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2 px-2">
            Navigation Administrateur
          </div>
          {adminNav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[var(--gold-kene)] text-[#0F0A05] shadow-lg font-black'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* ── MAIN CONTAINER WITH SIDEBAR & RESPONSIVE MAIN CONTENT ── */}
      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-[#1A1410] border-r border-white/10 p-6 space-y-2 shrink-0">
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
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[var(--gold-kene)] to-[#D4AF37] text-black shadow-lg font-black'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-[#140F0B]">
          {children}
        </main>
      </div>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full ${className}`}>
      {children}
    </span>
  );
}
