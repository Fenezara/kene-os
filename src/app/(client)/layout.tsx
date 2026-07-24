'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Calendar, ScanFace, Wallet, ShoppingBag, Sprout, Bell, User, Sparkles, ArrowLeft, LogOut, MapPin } from 'lucide-react';

import { RoleSwitcher } from '@/components/RoleSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BackButton } from '@/components/ui/back-button';
import { KeneLogo } from '@/components/ui/logo';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    // Ensure active client session cookie is set for smooth portal navigation
    if (!document.cookie.includes('kene-session')) {
      document.cookie = 'kene-session=client-active; path=/; max-age=86400; SameSite=Lax';
    }
  }, []);

  const navLinks = [
    { href: '/portal', label: 'Accueil', icon: Home },
    { href: '/salons', label: 'Salons & Carte', icon: MapPin },
    { href: '/portfolio', label: 'Résultats IA', icon: Sparkles },
    { href: '/appointments', label: 'Mes RDV', icon: Calendar },
    { href: '/diagnostic', label: 'Diagnostic IA', icon: ScanFace },
    { href: '/jardin', label: 'Jardin du Glow', icon: Sprout },
    { href: '/boutique', label: 'Boutique', icon: ShoppingBag },
    { href: '/client-wallet', label: 'Wallet', icon: Wallet },
  ];

  return (
    <div className="min-h-screen bg-[#0F0A05] text-white flex flex-col font-sans selection:bg-[var(--gold-kene)] selection:text-[#0F0A05]">
      
      {/* --- RESPONSIVE HEADER --- */}
      <header className="h-16 bg-[#1A1410]/95 border-b border-white/10 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md w-full shadow-lg">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          
          {/* Left Logo & Back Button */}
          <div className="flex items-center gap-3">
            <BackButton fallbackUrl="/portal" />
            <KeneLogo href="/portal" subtitle="CLIENT" size="sm" />
          </div>

          {/* Desktop & Tablet Navigation Links (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[var(--gold-kene)] text-[#0F0A05] shadow-md font-bold'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons (Notifications & Profile & Logout & RoleSwitcher & ThemeToggle) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <RoleSwitcher />

            <Link
              href="/client-notifications"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--gold-kene)] animate-pulse" />
            </Link>

            <button
              onClick={() => {
                document.cookie = 'kene-session=; path=/; max-age=0; SameSite=Lax';
                localStorage.removeItem('kene_user');
                window.location.href = '/login';
              }}
              className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 transition cursor-pointer flex items-center gap-1 text-xs font-bold"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Déconnexion</span>
            </button>

            <Link
              href="/portal"
              className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-[var(--gold-kene)]/10 border border-[var(--gold-kene)]/30 hover:bg-[var(--gold-kene)]/20 transition"
            >
              <div className="w-6 h-6 rounded-full bg-[var(--gold-kene)] text-[#0F0A05] flex items-center justify-center text-xs font-bold font-display">
                A
              </div>
              <span className="text-xs font-bold text-[var(--gold-kene)]">Mon Espace</span>
            </Link>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT AREA (RESPONSIVE CONTAINER) --- */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 text-white">
        {children}
      </main>

      {/* --- MOBILE BOTTOM NAVIGATION (Only visible on screens < 768px) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1A1410]/95 border-t border-white/10 h-16 flex items-center justify-around z-50 backdrop-blur-lg shadow-2xl px-2">
        {navLinks.slice(0, 5).map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition ${
                isActive ? 'text-[var(--gold-kene)]' : 'text-white/50 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
              <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* --- DESKTOP FOOTER --- */}
      <footer className="hidden md:block border-t border-white/5 bg-[#1A1410] py-6 text-center text-xs text-white/40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Kènè Pro · La Plateforme Beauté & Bien-être Africaine.</p>
          <div className="flex gap-4">
            <Link href="/portal" className="hover:text-white transition">Accueil</Link>
            <Link href="/diagnostic" className="hover:text-white transition">Diagnostic IA</Link>
            <Link href="/boutique" className="hover:text-white transition">Boutique</Link>
            <Link href="/client-wallet" className="hover:text-white transition">Wallet</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
