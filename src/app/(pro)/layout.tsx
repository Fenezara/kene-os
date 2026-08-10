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

import { PlanSwitcher } from '@/components/PlanSwitcher'
import { KENE_PRICING_PLANS } from '@/config/pricing'
import { Lock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const navItems = [
  { id: 'dashboard', name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard, group: 'principal' },
  { id: 'agenda', name: 'Agenda & RDV', href: '/agenda', icon: Calendar, group: 'principal' },
  { id: 'pos', name: 'Caisse / POS', href: '/pos', icon: ShoppingCart, group: 'principal' },
  { id: 'clients', name: 'Clients CRM', href: '/clients', icon: Users, group: 'crm' },
  { id: 'marketing', name: 'Marketing WhatsApp', href: '/marketing', icon: MessageSquare, group: 'crm' },
  { id: 'reviews', name: 'Avis & Réputation', href: '/reviews', icon: Star, group: 'crm' },
  { id: 'services', name: 'Services & Tarifs', href: '/services', icon: Scissors, group: 'salon' },
  { id: 'employees', name: 'Équipe & Permissions', href: '/employees', icon: UserCheck, group: 'salon' },
  { id: 'inventory', name: 'Stocks & Produits', href: '/inventory', icon: Package, group: 'salon' },
  { id: 'diagnoses', name: 'Bilan Cutané 3D IA', href: '/diagnoses', icon: ScanFace, group: 'ia' },
  { id: 'lab', name: 'Labo Sur-Mesure', href: '/lab', icon: FlaskConical, group: 'ia' },
  { id: 'rh', name: 'Paie & CNPS', href: '/rh', icon: FileText, group: 'finance' },
  { id: 'compta', name: 'Comptabilité SYSCOHADA', href: '/compta', icon: Calculator, group: 'finance' },
]

const groupLabels: Record<string, string> = {
  principal: 'Principal',
  crm: 'Clients & Marketing',
  salon: 'Gestion Salon',
  ia: 'Expertise Cutanée & Labo',
  finance: 'Finance & Paie',
}

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const { toast } = useToast();
  const [activePlan, setActivePlan] = useState<'essentiel' | 'pro' | 'elite'>('pro');

  React.useEffect(() => {
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

  const allowedModules = KENE_PRICING_PLANS[activePlan]?.allowedModules || KENE_PRICING_PLANS.pro.allowedModules;
  const groups = Array.from(new Set(navItems.map(i => i.group)))

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
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

        {/* Plan Switcher Feature Flag */}
        <PlanSwitcher />

        <Link
          href="/welcome"
          onClick={onNavigate}
          className="mt-2.5 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C8951E]/15 border border-[#C8951E]/40 hover:bg-[#C8951E]/30 text-[#F3E5AB] text-xs font-bold font-mono transition shadow-sm w-full"
          title="Revoir la page d'accueil 3D & le Micro-Quiz"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C8951E]" />
          <span>Voir l'Accueil 3D</span>
        </Link>
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
                  const isAllowed = allowedModules.includes(item.id)
                  const Icon = item.icon

                  if (!isAllowed) {
                    return (
                      <div
                        key={item.href}
                        onClick={() => {
                          toast({
                            title: `🔒 Module "${item.name}" Verrouillé`,
                            description: `Le module "${item.name}" nécessite la mise à niveau vers un plan supérieur.`,
                            variant: "destructive"
                          });
                        }}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-[11px] tracking-wide transition-all duration-200 cursor-pointer text-white/25 hover:text-white/40 hover:bg-white/5 font-medium border border-transparent"
                        title={`Module ${item.name} verrouillé en Plan ${activePlan.toUpperCase()}`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0 text-white/20" />
                        <span className="truncate">{item.name}</span>
                        <div className="ml-auto flex items-center gap-1 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-md text-[8px] font-mono text-[#C8951E]">
                          <Lock className="w-2.5 h-2.5" />
                          <span>Passer au Plan Supérieur</span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <Link key={item.href} href={item.href} onClick={onNavigate}>
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
  const [activePlan, setActivePlan] = useState<'essentiel' | 'pro' | 'elite'>('pro')

  React.useEffect(() => {
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

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('kene_user');
      const hasCookie = document.cookie.split(';').some(c => c.trim().startsWith('kene-session='));

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

  // Visual Tiering Styling Variables
  const isEssentiel = activePlan === 'essentiel';
  const isPro = activePlan === 'pro';
  const isElite = activePlan === 'elite';

  const containerBg = isEssentiel
    ? 'bg-[#0A0D0B] text-slate-100'
    : isPro
    ? 'bg-[#150F0A] text-amber-50'
    : 'bg-[#1C1008] text-amber-100';

  const auraGradient = isEssentiel
    ? `radial-gradient(ellipse 90% 70% at 80% 0%, rgba(76,175,110,0.22) 0%, transparent 70%), radial-gradient(ellipse 60% 60% at 0% 100%, rgba(16,185,129,0.12) 0%, transparent 60%)`
    : isPro
    ? `radial-gradient(ellipse 100% 80% at 80% 0%, rgba(200,149,30,0.35) 0%, transparent 70%), radial-gradient(ellipse 70% 70% at 0% 100%, rgba(224,122,43,0.20) 0%, transparent 60%)`
    : `radial-gradient(ellipse 100% 90% at 50% 0%, rgba(255,215,0,0.45) 0%, transparent 70%), radial-gradient(ellipse 80% 80% at 0% 100%, rgba(138,28,20,0.35) 0%, transparent 60%)`;

  return (
    <div className={`min-h-screen ${containerBg} flex flex-col md:flex-row font-sans w-full overflow-x-hidden transition-all duration-700`}>
      <GlobalSearch />

      {/* Dynamic Global Visual Aura */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-all duration-700"
        style={{ backgroundImage: auraGradient }}
      />

      {/* Visual Filigree Watermark according to activePlan */}
      <div className="fixed bottom-6 right-6 pointer-events-none z-0 opacity-10 text-9xl font-display select-none transition-all duration-500">
        {isEssentiel ? '🟢' : isPro ? '⚜️' : '👑'}
      </div>

      {/* ─── DESKTOP SIDEBAR (FIXED STICKY LEFT AT 1024px+) ─── */}
      <aside className={`hidden lg:flex flex-col w-60 shrink-0 sticky top-0 h-screen z-20 transition-all duration-500 ${
        isEssentiel ? 'border-r border-emerald-500/20' : isPro ? 'border-r border-[#C8951E]/40 shadow-xl shadow-[#C8951E]/10' : 'border-r-2 border-[#FFD700]/60 shadow-2xl shadow-[#FFD700]/20'
      }`}>
        <div className={`absolute inset-0 transition-colors duration-500 ${
          isEssentiel ? 'bg-[#0B0E0C]/95' : isPro ? 'bg-[#150F09]/95 backdrop-blur-xl' : 'bg-[#1D1007]/95 backdrop-blur-2xl'
        }`} />
        <div className="relative z-10 h-full overflow-hidden">
          <SidebarContent pathname={pathname} />
        </div>
      </aside>

      {/* ─── MOBILE & TABLET PORTRAIT HEADER + DRAWER (UP TO 1023px) ─── */}
      <div className="lg:hidden flex items-center justify-between px-4 h-14 bg-[#110D09]/95 backdrop-blur-xl border-b border-white/5 w-full shrink-0 z-30 sticky top-0">
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
        <button onClick={() => setMobileOpen(true)} className="p-2 text-white/60 hover:text-white shrink-0 flex items-center gap-1.5 bg-[#C8951E]/10 border border-[#C8951E]/30 rounded-xl">
          <Menu className="w-5 h-5 text-[#C8951E]" />
          <span className="text-xs font-bold font-display text-[#F3E5AB] hidden sm:inline">Menu</span>
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
              className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 w-80 z-50 lg:hidden bg-[#110D09] border-r border-[#C8951E]/30 flex flex-col shadow-2xl"
            >
              <div className="absolute top-3 right-3">
                <button onClick={() => setMobileOpen(false)} className="p-2 text-white/40 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── MAIN CONTENT CONTAINER WITH DYNAMIC TIER BANNER ─── */}
      <main className="relative z-10 flex-1 flex flex-col min-h-screen w-full min-w-0">
        {/* Top Navigation Header (FIXED STICKY TOP AT 1024px+) */}
        <div className="hidden lg:flex items-center justify-between px-8 py-3.5 border-b border-white/10 bg-[#110D09]/90 backdrop-blur-xl sticky top-0 z-30">
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

        {/* Dynamic Tier Visual Status Banner */}
        <div className="p-4 lg:px-8 lg:pt-6 lg:pb-0">
          <motion.div 
            key={activePlan}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-mono border backdrop-blur-md shadow-lg ${
              isEssentiel
                ? 'bg-[#4CAF6E]/10 border-[#4CAF6E]/30 text-[#4CAF6E]'
                : isPro
                ? 'bg-gradient-to-r from-[#C8951E]/20 via-[#1A1410] to-[#C8951E]/10 border-[#C8951E]/50 text-[#F3E5AB] shadow-[#C8951E]/10'
                : 'bg-gradient-to-r from-[#FFD700]/25 via-[#8A1C14]/30 to-[#FFD700]/15 border-[#FFD700]/60 text-[#FFD700] shadow-[#FFD700]/20'
            }`}
          >
            <div className="flex items-center gap-2.5 font-bold">
              <span className="text-lg">{isEssentiel ? '🟢' : isPro ? '⭐' : '👑'}</span>
              <span>
                {isEssentiel 
                  ? 'Mode V1 : Plan Essentiel (7 500 FCFA/mois — Sobriété Tactile & Caisse)' 
                  : isPro 
                  ? 'Mode V2 : Plan Pro Dermo-Cosmétique (15 000 FCFA/mois — Scan 3D IA & Gold Glow)' 
                  : 'Mode V3 : Plan Élite Royal (30 000 FCFA/mois — Marque Blanche 24K & Labo)'}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Thème Visuel Actif</span>
            </div>
          </motion.div>
        </div>

        <div className="flex-1 p-4 sm:p-6 md:p-8 w-full max-w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
