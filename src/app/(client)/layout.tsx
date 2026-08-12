'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Calendar, ScanFace, Wallet, ShoppingBag, Sprout, Bell, User, Sparkles, ArrowLeft, LogOut, MapPin, Menu, X, MessageSquare, Stethoscope, FileText, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { PlanSwitcher } from '@/components/PlanSwitcher';
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
  const [activePlan, setActivePlan] = useState<'essentiel' | 'pro' | 'elite'>('essentiel');
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const isExplicitlyLoggedOut = localStorage.getItem('kene_logged_out') === 'true';
      const savedUser = localStorage.getItem('kene_user');
      const hasCookie = document.cookie.split(';').some(c => c.trim().startsWith('kene-session='));

      if (!savedUser && !hasCookie && !isExplicitlyLoggedOut) {
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

  useEffect(() => {
    const updatePlan = () => {
      try {
        const stored = localStorage.getItem('kene_active_plan');
        if (stored && (stored === 'essentiel' || stored === 'pro' || stored === 'elite')) {
          setActivePlan(stored);
        }
      } catch (e) {}
    };

    updatePlan();
    window.addEventListener('kene_plan_changed', updatePlan);
    return () => window.removeEventListener('kene_plan_changed', updatePlan);
  }, []);

  // Filter navigation buttons dynamically depending on activePlan selection
  const allNavLinks = [
    { href: '/portal', label: 'Accueil', icon: Home, plan: 'essentiel' },
    { href: '/salons', label: 'Salons & Carte', icon: MapPin, plan: 'essentiel' },
    { href: '/appointments', label: 'Mes RDV', icon: Calendar, plan: 'essentiel' },
    { href: '/diagnostic', label: 'Bilan Cutané', icon: ScanFace, plan: 'pro' },
    { href: '/chat', label: 'Dr. Mama Kènè IA 🩺🎙️', icon: Stethoscope, plan: 'essentiel' },
  ];

  const navLinks = allNavLinks.filter((link) => {
    if (link.plan === 'essentiel') return true;
    if (link.plan === 'pro') return activePlan === 'pro' || activePlan === 'elite';
    if (link.plan === 'elite') return activePlan === 'elite';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0F0A05] text-white flex flex-col font-sans selection:bg-[#FFD700] selection:text-black">
      
      {/* ── 🌸 TOP SUSPENDED GLASS HEADER (DESKTOP / PC & TABLET) ── */}
      <header className="h-16 bg-[#160E08]/90 border-b-2 border-[#FFD700]/40 px-4 md:px-8 flex items-center justify-between w-full shadow-2xl z-40 backdrop-blur-2xl sticky top-0">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          
          {/* Left Logo & Back Button */}
          <div className="flex items-center gap-2">
            {pathname !== '/portal' && <BackButton fallbackUrl="/portal" />}
            <KeneLogo href="/portal" subtitle="CLIENT" size="sm" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
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
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black shadow-xl border border-[#FFD700] scale-102'
                      : 'text-white/80 hover:text-white hover:bg-white/10 font-semibold'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black font-bold' : 'text-[#FFD700]'}`} />
                  <span className={isActive ? 'text-black font-black' : ''}>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions & Plan Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block w-48">
              <PlanSwitcher />
            </div>

            <Link
              href="/client-notifications"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition relative border border-white/10"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-[#FFD700]" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
            </Link>

            {/* Hamburger Button for Mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white"
              title="Menu Navigation"
            >
              <Menu className="w-5 h-5 text-[#FFD700]" />
            </button>
          </div>
        </div>
      </header>

      {/* ── 📱 FLOATING GLASS CAPSULE NAVIGATION BAR (MOBILE & TABLET BOTTOM - HIDDEN ON CHAT PAGE) ── */}
      {!pathname.includes('/chat') && (
        <div className="md:hidden fixed bottom-3 left-3 right-3 z-50">
          <div className="bg-[#140C06]/90 border-2 border-[#FFD700] rounded-full p-2 shadow-2xl backdrop-blur-2xl flex items-center justify-around">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href.includes('chat') && pathname.includes('chat'));
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black shadow-lg scale-105'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black font-bold' : 'text-[#FFD700]'}`} />
                  <span className="text-[9px] font-bold truncate max-w-[64px]">{link.label.split(' ')[0]}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 z-50 md:hidden backdrop-blur-md"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 w-72 z-50 md:hidden bg-[#160E08] border-l-2 border-[#FFD700] p-5 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <KeneLogo href="/portal" subtitle="CLIENT" size="sm" />
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-white/60 hover:text-white">
                  <X className="w-5 h-5 text-[#FFD700]" />
                </button>
              </div>

              <div className="mb-4">
                <PlanSwitcher />
              </div>

              <div className="space-y-2 flex-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black shadow-lg'
                          : 'text-white/80 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Page Children */}
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>

      {/* Voice Assistant Modal */}
      <MamaKeneVoiceAssistant
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
      />

    </div>
  );
}
