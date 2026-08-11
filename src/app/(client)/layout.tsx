'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Calendar, ScanFace, Wallet, ShoppingBag, Sprout, Bell, User, Sparkles, ArrowLeft, LogOut, MapPin, Menu, X, MessageSquare, Stethoscope, FileText, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { RoleSwitcher } from '@/components/RoleSwitcher';
import { BackButton } from '@/components/ui/back-button';
import { KeneLogo } from '@/components/ui/logo';
import { handleLogout } from '@/lib/logout';
import { MamaKeneVoiceAssistant } from '@/components/MamaKeneVoiceAssistant';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('kene_user');
      const hasCookie = document.cookie.split(';').some(c => c.trim().startsWith('kene-session='));

      // If no session exists at all, auto-create a guest/demo client session for instant exploration
      if (!savedUser && !hasCookie) {
        const guestUser = {
          firstName: 'Cliente',
          lastName: '',
          name: 'Cliente Privilège',
          phone: '',
          email: '',
          role: 'client',
          skinType: 'Peau Mélanoderme',
          fitzpatrickType: 'Phototype IV - VI',
          memberSince: '2026',
          points: 500,
        };
        localStorage.setItem('kene_user', JSON.stringify(guestUser));
        document.cookie = `kene-session=client-${Date.now()}; path=/; max-age=31536000; SameSite=Lax`;
      }
    }
  }, []);

  const navLinks = [
    { href: '/portal', label: 'Accueil', icon: Home },
    { href: '/salons', label: 'Salons & Carte Boutique', icon: MapPin },
    { href: '/chat?mode=dr_diallo', label: 'Dr. Dermatologie', icon: Stethoscope },
    { href: '/diagnostic', label: 'Bilan Cutané', icon: ScanFace },
    { href: '/appointments', label: 'Mes RDV', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-[#0F0A05] text-white flex flex-col font-sans selection:bg-[var(--gold-kene)] selection:text-[#0F0A05]">
      
      {/* --- RESPONSIVE HEADER (SCROLLS NATURALLY WITH PAGE INTERFACE) --- */}
      <header className="h-16 bg-[#1A1410] border-b border-white/10 px-4 md:px-8 flex items-center justify-between w-full shadow-lg z-30">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          
          {/* Left Logo & Back Button */}
          <div className="flex items-center gap-2">
            {pathname !== '/portal' && <BackButton fallbackUrl="/portal" />}
            <KeneLogo href="/portal" subtitle="CLIENT" size="sm" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href.includes('chat') && pathname.includes('chat'));
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    if (link.href === '/portal' && pathname === '/portal') {
                      e.preventDefault();
                      window.location.href = '/portal';
                    }
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black shadow-md border border-[#FFD700]'
                      : 'text-white/80 hover:text-white hover:bg-white/10 font-semibold'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black font-bold' : ''}`} />
                  <span className={isActive ? 'text-black font-black' : ''}>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/welcome"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C8951E]/15 border border-[#C8951E]/40 hover:bg-[#C8951E]/30 text-[#F3E5AB] text-xs font-bold font-mono transition shadow-sm"
              title="Revoir la page d'accueil 3D & le Micro-Quiz"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C8951E]" />
              <span className="hidden sm:inline">Accueil 3D</span>
            </Link>

            <button
              onClick={() => setIsVoiceAssistantOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black text-xs transition shadow-lg hover:scale-105 border border-[#FFD700] cursor-pointer"
              title="Assistante Vocale Mama Kènè TAARU AI"
            >
              <Mic className="w-4 h-4 text-black animate-pulse" />
              <span className="hidden sm:inline font-black">Mama Kènè AI 🎙️</span>
            </button>

            <Link
              href="/client-notifications"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--gold-kene)] animate-pulse" />
            </Link>

            {/* Hamburger Button for Mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white"
              title="Menu Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={handleLogout}
              className="hidden md:flex p-2 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 transition cursor-pointer items-center gap-1 text-xs font-bold"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* --- MOBILE NAVIGATION DRAWER OVERLAY --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 w-80 bg-[#140E09] border-l border-[var(--gold-kene)]/30 z-50 p-6 flex flex-col justify-between md:hidden shadow-2xl overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                  <KeneLogo href="/portal" subtitle="MENU CLIENT" size="sm" />
                  <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-white/50 hover:text-white rounded-xl bg-white/5">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-[var(--gold-kene)] uppercase tracking-widest mb-2 px-2">Navigation Complète Kènè</div>
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href || (link.href.includes('chat') && pathname.includes('chat'));
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-[var(--gold-kene)] to-[#D4AF37] text-black font-bold shadow-md'
                            : 'text-white/80 hover:text-white hover:bg-white/5 border border-white/5'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6">
                <button
                  onClick={handleLogout}
                  className="w-full py-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Se Déconnecter</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 text-white">
        {children}
      </main>

      {/* --- MOBILE BOTTOM NAVIGATION --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1A1410]/95 border-t border-white/10 h-16 flex items-center justify-around z-40 backdrop-blur-lg shadow-2xl px-2">
        {navLinks.slice(0, 4).map((link) => {
          const isActive = pathname === link.href || (link.href.includes('chat') && pathname.includes('chat'));
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
                isActive
                  ? 'bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black shadow-lg scale-105 border border-[#FFD700]'
                  : 'text-white/70 hover:text-white font-semibold'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'scale-110 text-black font-black' : ''}`} />
              <span className={`text-[10px] ${isActive ? 'font-black text-black' : 'font-semibold'}`}>
                {link.label}
              </span>
            </Link>
          );
        })}
        
        {/* Mobile "Plus" Menu Trigger */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 px-2 py-1 rounded-xl text-white/50 hover:text-white"
        >
          <Menu className="w-5 h-5 text-[var(--gold-kene)]" />
          <span className="text-[10px] font-medium text-[var(--gold-kene)]">Plus</span>
        </button>
      </nav>

      {/* Floating Voice Assistant Quick Trigger Button (Bottom Right) */}
      <button
        onClick={() => setIsVoiceAssistantOpen(true)}
        className="fixed bottom-20 right-5 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-[#FFD700] via-[#C8951E] to-[#8A3B14] p-0.5 shadow-2xl border-2 border-[#FFD700] flex items-center justify-center hover:scale-110 active:scale-95 transition cursor-pointer group"
        title="Ouvrir l'Assistante Vocale Mama Kènè"
      >
        <div className="w-full h-full rounded-full bg-[#140B05] flex items-center justify-center text-[#FFD700] group-hover:bg-[#FFD700] group-hover:text-black transition-colors">
          <Mic className="w-6 h-6 animate-pulse" />
        </div>
      </button>

      {/* --- MAMA KÈNÈ VOICE ASSISTANT MODAL --- */}
      <MamaKeneVoiceAssistant
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
      />

      {/* --- DESKTOP FOOTER --- */}
      <footer className="hidden md:block border-t border-white/5 bg-[#1A1410] py-6 text-center text-xs text-white/40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Kènè Pro · La Plateforme Beauté & Bien-être Africaine.</p>
          <div className="flex gap-4">
            <Link href="/portal" className="hover:text-white transition">Accueil</Link>
            <Link href="/diagnostic" className="hover:text-white transition">Diagnostic IA</Link>
            <Link href="/chat?mode=dr_diallo" className="hover:text-white transition">Dr. Dermatologue IA</Link>
            <Link href="/boutique" className="hover:text-white transition">Boutique</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
