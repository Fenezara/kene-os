'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Calendar, ShoppingCart, Users, Scissors,
  UserCheck, Package, ScanFace, FileText, Calculator,
  MessageSquare, Star, LogOut, ChevronRight, Sparkles, Menu, X, Search, ArrowLeft, FlaskConical
} from 'lucide-react'

import { NotificationBell } from '@/components/NotificationBell'
import { GlobalSearch } from '@/components/GlobalSearch'
import { BranchSwitcher } from '@/components/BranchSwitcher'
import { RoleSwitcher } from '@/components/RoleSwitcher'
import { BackButton } from '@/components/ui/back-button'
import { KeneLogo } from '@/components/ui/logo'

const navItems = [
  { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard, group: 'principal' },
  { name: 'Agenda & RDV', href: '/agenda', icon: Calendar, group: 'principal' },
  { name: 'Caisse / POS', href: '/pos', icon: ShoppingCart, group: 'principal' },
  { name: 'Clients CRM', href: '/clients', icon: Users, group: 'crm' },
  { name: 'Marketing WhatsApp', href: '/marketing', icon: MessageSquare, group: 'crm' },
  { name: 'Avis & Réputation', href: '/reviews', icon: Star, group: 'crm' },
  { name: 'Services & Tarifs', href: '/services', icon: Scissors, group: 'salon' },
  { name: 'Équipe & RH', href: '/employees', icon: UserCheck, group: 'salon' },
  { name: 'Stocks & Produits', href: '/inventory', icon: Package, group: 'salon' },
  { name: 'Diagnostic IA Peau', href: '/diagnoses', icon: ScanFace, group: 'ia' },
  { name: 'Labo Sur-Mesure', href: '/lab', icon: FlaskConical, group: 'ia' },
  { name: 'Paie & CNPS', href: '/rh', icon: FileText, group: 'finance' },
  { name: 'Comptabilité SYSCOHADA', href: '/compta', icon: Calculator, group: 'finance' },
]

const groupLabels: Record<string, string> = {
  principal: 'Principal',
  crm: 'Clients & Marketing',
  salon: 'Gestion Salon',
  ia: 'Intelligence Artificielle',
  finance: 'Finance & Paie',
}

function SidebarContent({ pathname }: { pathname: string }) {
  const groups = Array.from(new Set(navItems.map(i => i.group)))

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <KeneLogo href="/dashboard" subtitle="PRO" size="md" />

        {/* Action buttons */}
        <div className="mt-4 flex items-center gap-2">
          <button 
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
            className="flex-1 flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/40 transition-colors"
          >
            <Search className="w-4 h-4 shrink-0" />
            <span className="text-xs font-medium truncate">Rechercher...</span>
            <span className="ml-auto text-[9px] font-mono bg-[#0F0A05] px-1.5 py-0.5 rounded-md border border-white/10">Ctrl+K</span>
          </button>
          <NotificationBell />
        </div>

        {/* Multi-Salon Branch Switcher */}
        <BranchSwitcher />
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-5 scrollbar-none">
        {groups.map((group) => {
          const items = navItems.filter(i => i.group === group)
          return (
            <div key={group}>
              <div className="px-2 mb-1.5 text-[9px] font-bold tracking-[0.15em] uppercase text-white/20">
                {groupLabels[group]}
              </div>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  return (
                    <Link key={item.href} href={item.href}>
                      <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] tracking-wide transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black shadow-lg shadow-[#C8951E]/30 border border-[#FFD700]'
                          : 'text-white/70 hover:text-white hover:bg-white/10 font-semibold'
                      }`}>
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-black font-bold' : 'text-white/40'}`} />
                        <span className={`truncate ${isActive ? 'text-black font-black' : ''}`}>{item.name}</span>
                        {isActive && (
                          <ChevronRight className="w-3 h-3 ml-auto text-black font-bold shrink-0" />
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 pb-6 pt-4 border-t border-white/5">
        {/* Motif Kente decorative strip */}
        <div className="h-1 rounded-full mb-4 overflow-hidden bg-[#241C16]">
          <div className="h-full w-full bg-gradient-to-r from-[#C8951E] via-[#8A3B14] to-[#2E5A36] opacity-60" />
        </div>

        <button
          onClick={() => {
            document.cookie = 'kene-session=; path=/; max-age=0; SameSite=Lax';
            localStorage.removeItem('kene_user');
            window.location.href = '/login';
          }}
          className="flex items-center gap-2 text-[11px] text-red-400/80 hover:text-red-400 transition-colors cursor-pointer w-full text-left font-semibold"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Se Déconnecter</span>
        </button>
        <div className="mt-2 text-[9px] text-white/15 font-mono">
          Kènè OS v2.0 · OHADA · UEMOA · CNPS
        </div>
      </div>
    </div>
  )
}

export default function ProLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  React.useEffect(() => {
    // Ensure active pro session cookie is set for smooth pro navigation
    if (!document.cookie.includes('kene-session')) {
      document.cookie = 'kene-session=gerant-active; path=/; max-age=86400; SameSite=Lax';
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0F0A05] flex font-sans">
      <GlobalSearch />
      {/* Subtle global bg pattern */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 80% 0%, rgba(200,149,30,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 0% 100%, rgba(138,59,20,0.07) 0%, transparent 50%)
          `
        }}
      />

      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 relative z-10 border-r border-white/5">
        {/* Glass bg */}
        <div className="absolute inset-0 bg-[#110D09]/80 backdrop-blur-xl" />
        <div className="relative z-10 h-full">
          <SidebarContent pathname={pathname} />
        </div>
      </aside>

      {/* ─── MOBILE HEADER + DRAWER (SCROLLS NATURALLY WITH INTERFACE) ─── */}
      <div className="md:hidden flex items-center justify-between px-4 h-14 bg-[#110D09] border-b border-white/5 w-full shrink-0 z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="p-1.5 text-white/60 hover:text-white flex items-center gap-1 text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#F3E5AB] to-[#C8951E] flex items-center justify-center font-display font-black text-[#0F0A05] text-sm">K</div>
          <span className="font-display font-bold text-[#C8951E] text-base">Kènè Pro</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="p-2 text-white/60 hover:text-white">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 w-72 z-50 md:hidden bg-[#110D09] border-r border-white/5 flex flex-col"
            >
              <div className="absolute top-3 right-3">
                <button onClick={() => setMobileOpen(false)} className="p-2 text-white/40 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <SidebarContent pathname={pathname} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── MAIN CONTENT CONTAINER (SYNCHRONIZED SCROLL) ─── */}
      <main className="relative z-10 flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Top Navigation Header with Universal Back Button & Role Switcher */}
        <div className="hidden md:flex items-center justify-between px-8 py-3.5 border-b border-white/5 bg-[#110D09]/40 backdrop-blur-md">
          <BackButton fallbackUrl="/dashboard" />

          <div className="flex items-center gap-3">
            <RoleSwitcher />
            <div className="flex items-center gap-2 text-[10px] text-white/30 font-mono uppercase tracking-wider">
              <span>Espace Salon Pro</span>
              <span>/</span>
              <span className="text-[#C8951E] font-bold">
                {navItems.find(i => i.href === pathname)?.name || 'Tableau de bord'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 p-5 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
