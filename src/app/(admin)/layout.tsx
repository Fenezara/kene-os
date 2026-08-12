'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, ShoppingBag, ShieldCheck, UserPlus, Crown, Menu, X, ArrowLeft,
  Activity, Search, Globe, Shield, RefreshCw, Cpu, Layers, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KeneLogo } from '@/components/ui/logo';
import { Badge } from '@/components/ui/badge';
import { RoleSwitcher } from '@/components/RoleSwitcher';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [systemUptime, setSystemUptime] = useState('99.98%');

  // Don't render admin header/sidebar on isolated admin login
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const adminNav = [
    { href: '/admin', label: 'Vue Globale (Salons & Kènè OS)', icon: Building2, badge: '47 Salons' },
    { href: '/admin/marketplace', label: 'Marketplace Addons', icon: ShoppingBag, badge: 'SaaS' },
    { href: '/admin/security', label: 'Audit & Sécurité OWASP', icon: ShieldCheck, badge: 'SOC2' },
    { href: '/onboarding', label: 'Nouveau Salon (Wizard)', icon: UserPlus, badge: '1-Click' },
  ];

  return (
    <div className="min-h-screen bg-[#070402] text-[#F8F1E4] flex flex-col font-sans selection:bg-[#FFD700] selection:text-black">
      
      {/* ── 👑 HOLOGRAPHIC COMMAND CENTER TOP HEADER ── */}
      <header className="h-16 bg-[#120B06]/95 border-b-2 border-[#FFD700]/40 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-white/80 hover:text-white bg-white/5 border border-white/15"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#FFD700]" /> : <Menu className="w-5 h-5 text-[#FFD700]" />}
          </button>

          <KeneLogo href="/admin" subtitle="SUPER-ADMIN" size="md" />
        </div>

        {/* Live System Nodes Status (Abidjan / Dakar / SOC2) */}
        <div className="hidden lg:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Serveurs Abidjan & Dakar : Online ({systemUptime})</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FFD700]/15 border border-[#FFD700]/40 text-[#FFD700] font-mono font-bold">
            <Cpu className="w-3.5 h-3.5" />
            <span>SOC2 / OWASP Security 2026</span>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          <Link href="/portal">
            <Button size="sm" className="bg-[#2A1D13] border border-[#FFD700]/40 text-[#FFD700] hover:bg-[#3E2B1D] text-xs font-bold h-9 rounded-xl">
              <ArrowLeft className="w-3.5 h-3.5 mr-1 text-[#FFD700]" /> Vue Cliente
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button size="sm" className="bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black text-xs h-9 rounded-xl shadow-lg border border-[#FFD700] hover:scale-105 transition">
              <Building2 className="w-3.5 h-3.5 mr-1" /> Vue Salon Pro
            </Button>
          </Link>
        </div>
      </header>

      {/* ── MOBILE DROPDOWN MENU ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-[#140C06] border-b-2 border-[#FFD700]/40 p-4 space-y-2 z-40 shadow-2xl"
          >
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FFD700] mb-2 px-2 flex items-center justify-between">
              <span>COMMAND CENTER SUPER-ADMIN</span>
              <Badge className="bg-emerald-500/20 text-emerald-400 text-[9px]">SOC2 ACTIVE</Badge>
            </div>
            {adminNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black shadow-xl font-black border border-[#FFD700]'
                      : 'text-white/80 hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10">
                    {item.badge}
                  </span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTAINER WITH HOLOGRAPHIC SIDEBAR ── */}
      <div className="flex-1 flex">
        
        {/* Desktop Holographic Sidebar */}
        <aside className="hidden md:block w-72 bg-gradient-to-b from-[#140C06] via-[#0E0703] to-[#070402] border-r-2 border-[#FFD700]/40 p-6 space-y-3 shrink-0 shadow-2xl relative">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FFD700] mb-4 px-2 flex items-center justify-between border-b border-white/10 pb-2">
            <span>PILOTAGE SYSTEME ADMIN</span>
            <Sparkles className="w-3 h-3 text-[#FFD700] animate-pulse" />
          </div>

          {adminNav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black shadow-xl font-black border border-[#FFD700] scale-102'
                    : 'text-white/70 hover:text-white hover:bg-white/10 border border-white/10 hover:border-[#FFD700]/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black font-bold' : 'text-[#FFD700]'}`} />
                  <span>{item.label}</span>
                </div>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-[#FFD700]'
                }`}>
                  {item.badge}
                </span>
              </Link>
            );
          })}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-[#0C0603]">
          {children}
        </main>
      </div>
    </div>
  );
}
