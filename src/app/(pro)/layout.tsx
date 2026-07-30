'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Calendar, ShoppingCart, Users, Scissors,
  UserCheck, Package, ScanFace, FileText, Calculator,
  MessageSquare, Star, LogOut, ChevronRight, Sparkles, Menu, X, Search, ArrowLeft, FlaskConical, Building2, User
} from 'lucide-react'

import { NotificationBell } from '@/components/NotificationBell'
import { GlobalSearch } from '@/components/GlobalSearch'
import { BranchSwitcher } from '@/components/BranchSwitcher'
import { RoleSwitcher } from '@/components/RoleSwitcher'
import { BackButton } from '@/components/ui/back-button'
import { KeneLogo } from '@/components/ui/logo'
import { handleLogout } from '@/lib/logout'

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
  { name: 'Bilan Cutané', href: '/diagnoses', icon: ScanFace, group: 'ia' },
  { name: 'Labo Sur-Mesure', href: '/lab', icon: FlaskConical, group: 'ia' },
  { name: 'Paie & CNPS', href: '/rh', icon: FileText, group: 'finance' },
  { name: 'Comptabilité SYSCOHADA', href: '/compta', icon: Calculator, group: 'finance' },
]

const groupLabels: Record<string, string> = {
  principal: 'Principal',
  crm: 'Clients & Marketing',
  salon: 'Gestion Salon',
  ia: 'Expertise Cutanée & Labo',
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
      <div className="p-3 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
        <span className="text-[10px] font-mono">v2.4 • PRO</span>
        <button
          onClick={handleLogout}
          className="p-1.5 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          title="Déconnexion"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default function ProLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [companyName, setCompanyName] = useState<string>('Espace Salon Pro')
  const [userName, setUserName] = useState<string>('Gérant(e)')
  const [userRole, setUserRole] = useState<string>('Gérante Salon')

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('kene_user');
      const hasCookie = document.cookie.split(';').some(c => c.trim().startsWith('kene-session='));

      // If no session exists at all, auto-create a clean pro session
      if (!savedUser && !hasCookie) {
        const guestProUser = {
          name: 'Partenaire Salon Kènè',
          email: '',
          role: 'gerant',
          salonName: 'Partenaire Salon Kènè',
        };
        localStorage.setItem('kene_user', JSON.stringify(guestProUser));
        document.cookie = `kene-session=gerant-${Date.now()}; path=/; max-age=31536000; SameSite=Lax`;
      }

      const savedTenant = localStorage.getItem('kene_tenant_settings')
      const savedAllTenants = localStorage.getItem('kene_all_tenants')
      let name = ''

      if (savedUser) {
        try {
          const u = JSON.parse(savedUser)
          if (u.salonName) name = u.salonName
          else if (u.name && (u.role === 'gerant' || u.role === 'salon')) name = u.name

          if (u.name && !/^[\+\d\s\-\.\(\)]+$/.test(u.name)) {
            setUserName(u.name)
          } else if (u.email) {
            setUserName(u.email.split('@')[0])
          } else if (u.phone) {
            setUserName(`Gérant (${u.phone})`)
          }

          if (u.role) setUserRole(u.role === 'admin' ? 'Super-Admin' : u.role === 'client' ? 'Cliente' : 'Gérante Salon')
        } catch (e) {}
      }

      if (!name && savedTenant) {
        try {
          const parsed = JSON.parse(savedTenant)
          if (parsed.identity?.commercialName) name = parsed.identity.commercialName
        } catch (e) {}
      }

      if (!name && savedAllTenants) {
        try {
          const list = JSON.parse(savedAllTenants)
          if (Array.isArray(list) && list.length > 0 && list[0].name) name = list[0].name
        } catch (e) {}
      }

      if (name) setCompanyName(name)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#0F0A05] flex flex-col md:flex-row font-sans w-full overflow-x-hidden">
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

      {/* ─── DESKTOP SIDEBAR (FIXED STICKY LEFT) ─── */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 sticky top-0 h-screen z-20 border-r border-white/5">
        {/* Glass bg */}
        <div className="absolute inset-0 bg-[#110D09]/90 backdrop-blur-xl" />
        <div className="relative z-10 h-full overflow-hidden">
          <SidebarContent pathname={pathname} />
        </div>
      </aside>

      {/* ─── MOBILE HEADER + DRAWER (SCROLLS NATURALLY WITH INTERFACE) ─── */}
      <div className="md:hidden flex items-center justify-between px-4 h-14 bg-[#110D09]/95 backdrop-blur-xl border-b border-white/5 w-full shrink-0 z-30 sticky top-0">
        <div className="flex items-center gap-2 min-w-0">
          {pathname !== '/dashboard' && (
            <button
              onClick={() => router.push('/dashboard')}
              className="p-1.5 text-white/60 hover:text-white flex items-center gap-1 text-xs shrink-0"
              title="Retour au Tableau de Bord"
            >
              <ArrowLeft className="w-4 h-4 text-[#C8951E]" />
            </button>
          )}
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#F3E5AB] to-[#C8951E] flex items-center justify-center font-display font-black text-[#0F0A05] text-sm shrink-0">K</div>
          <div className="min-w-0">
            <span className="font-display font-bold text-[#C8951E] text-xs block leading-tight truncate">{companyName}</span>
            <span className="text-[9px] text-white/40 block truncate">Session : {userName}</span>
          </div>
        </div>
        <button onClick={() => setMobileOpen(true)} className="p-2 text-white/60 hover:text-white shrink-0">
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

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <main className="relative z-10 flex-1 flex flex-col min-h-screen w-full min-w-0">
        {/* Top Navigation Header (FIXED STICKY TOP) with Universal Back Button, Company Name Badge, Logged-in User Badge & Role Switcher */}
        <div className="hidden md:flex items-center justify-between px-8 py-3.5 border-b border-white/10 bg-[#110D09]/90 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {pathname !== '/dashboard' && <BackButton fallbackUrl="/dashboard" />}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#C8951E]/15 border border-[#C8951E]/30 text-white text-xs font-bold font-display shadow-sm">
              <Building2 className="w-4 h-4 text-[#C8951E]" />
              <span className="text-white/70 font-sans font-normal text-[11px]">Entreprise :</span>
              <span className="text-[#F3E5AB] font-bold">{companyName}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium shadow-sm">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-white/60 text-[11px]">Connecté(e) :</span>
              <span className="text-white font-bold">{userName}</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-mono font-bold px-1.5 py-0.5 rounded-md border border-emerald-500/30">
                {userRole}
              </span>
            </div>
          </div>

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

        <div className="flex-1 p-4 sm:p-6 md:p-8 w-full max-w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
