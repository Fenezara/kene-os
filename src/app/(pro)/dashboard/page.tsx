'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarCheck, Users, TrendingUp, Scissors,
  ArrowUpRight, Zap, ShoppingCart, Package, Star,
  ArrowRight, Activity, FlaskConical, ScanFace, Plus,
  BarChart3, PieChart, Clock, Award, ShieldCheck, Sparkles,
  ChevronRight, Filter, Info, Layers, RefreshCw, Building2
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { KENE_PRICING_PLANS } from '@/config/pricing';
import { OnboardingChecklist } from '@/components/OnboardingChecklist';
import { SimpleModeSwitcher } from '@/components/SimpleModeSwitcher';

interface TenantStats {
  appointmentsToday: number;
  totalClients: number;
  revenue: number;
  activeEmployees: number;
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } }
};

const quickActions = [
  { label: 'Encaisser POS', href: '/pos', icon: ShoppingCart, color: 'from-[#2E5A36] to-[#1A3820]', textColor: 'text-emerald-200' },
  { label: 'Nouveau RDV', href: '/agenda', icon: CalendarCheck, color: 'from-[#C8951E] to-[#8A5C0A]', textColor: 'text-[#0F0A05]' },
  { label: 'Ajouter Cliente', href: '/clients', icon: Users, color: 'from-[#1E3A5F] to-[#0E1E35]', textColor: 'text-blue-200' },
  { label: 'Services & Tarifs', href: '/services', icon: Scissors, color: 'from-[#8A3B14] to-[#4A1B07]', textColor: 'text-amber-200' },
];

// Data for Weekly Revenue Chart (FCFA)
const WEEKLY_DATA = [
  { day: 'Lun', val: 180000, rdv: 6 },
  { day: 'Mar', val: 240000, rdv: 8 },
  { day: 'Mer', val: 310000, rdv: 11 },
  { day: 'Jeu', val: 290000, rdv: 9 },
  { day: 'Ven', val: 420000, rdv: 14 },
  { day: 'Sam', val: 580000, rdv: 19 },
  { day: 'Dim', val: 390000, rdv: 12 },
];

// Category Revenue Distribution
const CATEGORY_DISTRIBUTION = [
  { label: 'Soins Botaniques Karité & Baobab', pct: 42, amount: 777000, color: '#C8951E', icon: '🌿' },
  { label: 'Diagnostics Dermo-IA & Bilans', pct: 28, amount: 518000, color: '#4E9FD1', icon: '🔬' },
  { label: 'Coiffures & Tresses Spéciales', pct: 18, amount: 333000, color: '#4CAF6E', icon: '💇' },
  { label: 'Labo & Sérums Sur-Mesure', pct: 12, amount: 222000, color: '#E07A2B', icon: '🧪' },
];

// Peak Hours Heatmap
const PEAK_HOURS = [
  { time: '09h-11h', occupancy: 65, status: 'Normal' },
  { time: '11h-13h', occupancy: 92, status: 'Complet' },
  { time: '14h-16h', occupancy: 78, status: 'Élevé' },
  { time: '16h-18h', occupancy: 100, status: 'Pic de Charge' },
  { time: '18h-20h', occupancy: 84, status: 'Élevé' },
];

function sanitizeName(raw?: string): string {
  if (!raw || !raw.trim()) return 'Institut Beauté Kènè';
  let clean = raw.trim();

  // Strip raw phone numbers in parentheses like (0748894270)
  clean = clean.replace(/\s*\([\+\d\s\-\.]+\)/g, '').trim();

  // Replace auto-generated client names with elegant salon commercial name
  if (clean.toLowerCase().includes('cliente kènè') || clean.toLowerCase().includes('cliente kene')) {
    clean = 'Institut Beauté Kènè';
  }

  if (/^[\+\d\s\-\.\(\)]+$/.test(clean)) {
    return 'Institut Beauté Kènè';
  }
  if (clean.includes('+225') || clean.includes('+221') || clean.includes('+223')) {
    const stripped = clean.replace(/[\+\d\s]{8,}/g, '').trim();
    if (stripped.length > 2) return stripped;
  }
  return clean || 'Institut Beauté Kènè';
}

export default function ProDashboardPage() {
  const { toast } = useToast();
  const [stats, setStats] = useState<TenantStats | null>(null);
  const [tenantName, setTenantName] = useState<string>('Institut Beauté Kènè');
  const [employeeName, setEmployeeName] = useState<string>('Fatou Koné');
  const [loading, setLoading] = useState(true);
  const [activeChartPoint, setActiveChartPoint] = useState<number | null>(5); // Default to Saturday
  const [activePlan, setActivePlan] = useState<'essentiel' | 'pro' | 'elite'>('pro');
  const [isSimpleMode, setIsSimpleMode] = useState(true);

  useEffect(() => {
    const updatePlan = () => {
      try {
        const stored = localStorage.getItem('kene_active_plan');
        if (stored && (stored === 'essentiel' || stored === 'pro' || stored === 'elite')) {
          setActivePlan(stored);
        }
        const simple = localStorage.getItem('kene_simple_mode');
        if (simple !== null) {
          setIsSimpleMode(simple === 'true');
        }
      } catch (e) {}
    };

    updatePlan();
    window.addEventListener('kene_plan_changed', updatePlan);
    window.addEventListener('kene_simple_mode_changed', updatePlan);
    return () => {
      window.removeEventListener('kene_plan_changed', updatePlan);
      window.removeEventListener('kene_simple_mode_changed', updatePlan);
    };
  }, []);

  const isEssentiel = activePlan === 'essentiel';
  const isPro = activePlan === 'pro';
  const isElite = activePlan === 'elite';

  useEffect(() => {
    let customSalonName = '';
    let customEmployeeName = '';

    if (typeof window !== 'undefined') {
      const savedTenant = localStorage.getItem('kene_tenant_settings');
      const savedUser = localStorage.getItem('kene_user');
      const savedAllTenants = localStorage.getItem('kene_all_tenants');

      if (savedTenant) {
        try {
          const parsed = JSON.parse(savedTenant);
          if (parsed.identity?.commercialName) customSalonName = parsed.identity.commercialName;
        } catch (e) {}
      }
      if (savedUser) {
        try {
          const u = JSON.parse(savedUser);
          if (u.salonName) customSalonName = u.salonName;
          
          // Check for human employee name (skip salon/company names)
          const rawName = u.employeeName || u.name || '';
          if (rawName && !/^[\+\d\s\-\.\(\)]+$/.test(rawName)) {
            const isSalonName = /institut|salon|spa|centre|cabinet|kènè|kene/i.test(rawName);
            if (!isSalonName) {
              customEmployeeName = rawName;
            }
          }
        } catch (e) {}
      }
      if (!customSalonName && savedAllTenants) {
        try {
          const list = JSON.parse(savedAllTenants);
          if (Array.isArray(list) && list.length > 0 && list[0].name) {
            customSalonName = list[0].name;
          }
        } catch (e) {}
      }
    }

    if (customSalonName) setTenantName(sanitizeName(customSalonName));
    setEmployeeName(customEmployeeName ? sanitizeName(customEmployeeName) : 'Fatou Koné');

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/tenant/stats');
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          if (data.tenantName && !customSalonName) {
            setTenantName(sanitizeName(data.tenantName));
          }
        }
      } catch {
        toast({ title: "Notification", description: "Stats synchronisées en mode démonstration.", variant: "default" });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [toast]);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  const maxVal = Math.max(...WEEKLY_DATA.map(d => d.val));

  const activeQuickActions = isSimpleMode
    ? [
        { label: '💵 Faire un Encaissement (Caisse)', href: '/pos', icon: ShoppingCart, color: 'from-[#2E5A36] to-[#1A3820]', textColor: 'text-emerald-200' },
        { label: '📅 Prendre un RDV (Agenda)', href: '/agenda', icon: CalendarCheck, color: 'from-[#C8951E] to-[#8A5C0A]', textColor: 'text-[#0F0A05]' },
        { label: '👥 Mon Carnet Clientes', href: '/clients', icon: Users, color: 'from-[#1E3A5F] to-[#0E1E35]', textColor: 'text-blue-200' },
        { label: '✂️ Mes Services & Tarifs', href: '/services', icon: Scissors, color: 'from-[#8A3B14] to-[#4A1B07]', textColor: 'text-amber-200' },
      ]
    : isEssentiel
    ? [
        { label: '📅 Prendre un RDV', href: '/agenda', icon: CalendarCheck, color: 'from-emerald-600 to-emerald-900', textColor: 'text-white' },
        { label: '💵 Faire un Encaissement (Caisse)', href: '/pos', icon: ShoppingCart, color: 'from-emerald-700 to-teal-950', textColor: 'text-emerald-200' },
        { label: '👥 Mon Carnet Clientes', href: '/clients', icon: Users, color: 'from-slate-700 to-slate-900', textColor: 'text-slate-200' },
        { label: '✂️ Mes Services & Tarifs', href: '/services', icon: Scissors, color: 'from-slate-800 to-slate-950', textColor: 'text-slate-300' },
      ]
    : isPro
    ? [
        { label: '📅 Prendre un RDV', href: '/agenda', icon: CalendarCheck, color: 'from-[#C8951E] to-[#8A5C0A]', textColor: 'text-[#0F0A05]' },
        { label: '💵 Faire un Encaissement (Caisse)', href: '/pos', icon: ShoppingCart, color: 'from-[#2E5A36] to-[#1A3820]', textColor: 'text-emerald-200' },
        { label: '🔬 Bilan Dermo-IA 3D', href: '/diagnoses', icon: ScanFace, color: 'from-[#C8951E]/80 to-[#D4AF37]', textColor: 'text-black' },
        { label: '📦 Stocks & Produits', href: '/inventory', icon: Package, color: 'from-[#8A3B14] to-[#4A1B07]', textColor: 'text-amber-200' },
      ]
    : [
        { label: '🧪 Labo Sur-Mesure 👑', href: '/lab', icon: FlaskConical, color: 'from-[#FFD700] via-[#C8951E] to-[#8A1C14]', textColor: 'text-black font-black' },
        { label: '📊 Compta SYSCOHADA 👑', href: '/compta', icon: BarChart3, color: 'from-[#1E3A5F] to-[#0E1E35]', textColor: 'text-blue-200' },
        { label: '🔬 Bilan Dermo-IA 3D', href: '/diagnoses', icon: ScanFace, color: 'from-[#C8951E] to-[#8A5C0A]', textColor: 'text-[#0F0A05]' },
        { label: '👥 Paie & CNPS 👑', href: '/rh', icon: ShieldCheck, color: 'from-[#8A1C14] to-[#4A0A05]', textColor: 'text-red-200' },
      ];

  const statCards = [
    {
      title: "RDV Aujourd'hui",
      value: stats?.appointmentsToday ?? 8,
      icon: CalendarCheck,
      accent: isEssentiel ? '#4CAF6E' : '#C8951E',
      change: '+2 vs hier',
      subtitle: '8 cabines configurées',
      href: '/agenda',
    },
    {
      title: 'Clients Totaux',
      value: stats?.totalClients ?? 142,
      icon: Users,
      accent: isEssentiel ? '#4CAF6E' : '#4E9FD1',
      change: '+14 ce mois',
      subtitle: 'Taux fidélité 84%',
      href: '/clients',
    },
    {
      title: isEssentiel ? 'Ventes Caisse (Mois)' : isPro ? 'Revenus (Mois)' : 'Journal SYSCOHADA (Acc. 5711)',
      value: stats?.revenue ? `${(stats.revenue).toLocaleString('fr-FR')} F` : '1 850 000 F',
      icon: TrendingUp,
      accent: isEssentiel ? '#4CAF6E' : isPro ? '#C8951E' : '#FFD700',
      change: '+18.4% vs M-1',
      subtitle: isElite ? 'Certifié UEMOA 👑' : 'Objectif atteint 82.5%',
      href: isElite ? '/compta' : '/pos',
    },
    {
      title: isEssentiel ? 'Équipe Salon' : isPro ? 'Scan 3D IA Réalisés' : 'Formulations Labo 👑',
      value: isEssentiel ? '6 Praticiennes' : isPro ? '48 Diagnostics' : '24 Sérums Sur-Mesure',
      icon: isEssentiel ? Scissors : isPro ? ScanFace : FlaskConical,
      accent: isEssentiel ? '#4CAF6E' : isPro ? '#C8951E' : '#FFD700',
      change: isEssentiel ? 'Actives' : isPro ? '+12 cette semaine' : 'Actifs botaniques 100%',
      subtitle: isEssentiel ? 'Caisse active' : isPro ? 'Phototypes IV-VI' : 'Laboratoire Kènè',
      href: isEssentiel ? '/employees' : isPro ? '/diagnoses' : '/lab',
    },
  ];

  const cardBgClass = isEssentiel
    ? 'bg-[#101512] border-emerald-500/30 hover:border-emerald-500/60 shadow-lg shadow-emerald-950/20'
    : isPro
    ? 'bg-gradient-to-b from-[#1C150F] to-[#120D08] border-[#C8951E]/40 hover:border-[#C8951E] shadow-xl shadow-[#C8951E]/10'
    : 'bg-[#1D1007]/90 border-2 border-[#FFD700]/70 hover:border-[#FFD700] shadow-2xl shadow-[#FFD700]/25 backdrop-blur-xl';

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-24 md:pb-8 font-sans">

      {/* ── 0. CONTROL BAR & SIMPLE MODE SWITCHER ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#16100B] border border-[#C8951E]/30 p-3.5 rounded-3xl shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#F3E5AB]">Expérience Salon :</span>
          <SimpleModeSwitcher />
        </div>
        
        <div className="flex items-center gap-2 text-xs font-mono text-white/50">
          <span>Plan Actif : <strong className="text-white font-bold">{isEssentiel ? 'Essentiel 🟢' : isPro ? 'Pro ⭐' : 'Élite 👑'}</strong></span>
        </div>
      </div>

      {/* ── 0.1 ONBOARDING CHECKLIST GUIDÉE EN 3 ÉTAPES ── */}
      <OnboardingChecklist />

      {/* ── 1. HERO GREETING BANNER ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative overflow-hidden rounded-3xl p-5 sm:p-7 border border-[#C8951E]/30 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #1A1008 0%, #281B0C 50%, #150C06 100%)',
        }}
      >
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-25 blur-3xl pointer-events-none bg-[#C8951E]" />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-15 blur-2xl pointer-events-none bg-[#8A3B14]" />

        {/* Kente Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#C8951E] via-[#8A3B14] via-[#2E5A36] via-[#1E3A5F] to-[#C8951E]" />
        </div>

        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="text-[10px] sm:text-xs font-mono tracking-[0.2em] uppercase text-[#C8951E] font-bold flex items-center gap-2">
              <span className={`border px-2.5 py-0.5 rounded-full ${
                isEssentiel ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : isPro ? 'bg-[#C8951E]/15 border-[#C8951E]/30 text-[#F3E5AB]' : 'bg-[#FFD700]/20 border-[#FFD700]/40 text-[#FFD700]'
              }`}>
                {now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
              <span>•</span>
              <span className={`font-bold flex items-center gap-1 ${isEssentiel ? 'text-emerald-400' : isPro ? 'text-[#C8951E]' : 'text-[#FFD700]'}`}>
                <span className={`w-2 h-2 rounded-full animate-pulse ${isEssentiel ? 'bg-emerald-400' : isPro ? 'bg-[#C8951E]' : 'bg-[#FFD700]'}`} />
                {isEssentiel ? '🟢 Mode Carnet Caisse Solo' : isPro ? '⭐ Mode Institut & Spa Dermo-Botanique' : '👑 Mode Executive Multi-Salons UEMOA'}
              </span>
            </div>

            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border text-xs font-bold font-display shadow-md ${
              isEssentiel ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' : isPro ? 'bg-[#C8951E]/15 border-[#C8951E]/30 text-[#F3E5AB]' : 'bg-[#FFD700]/20 border-[#FFD700]/40 text-[#FFD700]'
            }`}>
              <Building2 className="w-4 h-4" />
              <span>Établissement : <strong className="text-white font-black">{tenantName}</strong></span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight leading-tight">
              {greeting}, <span className={isEssentiel ? 'text-emerald-300' : isPro ? 'text-[#F3E5AB]' : 'text-[#FFD700]'}>{employeeName}</span> 👋
            </h1>
            <p className="text-xs sm:text-sm text-white/70 font-sans max-w-xl">
              {isEssentiel 
                ? '🟢 Votre tableau de bord simplifié : encaissements caisse, rendez-vous du jour et rappels WhatsApp.' 
                : isPro 
                ? '⭐ Votre cockpit opérationnel : taux d’occupation des cabines, diagnostics 3D IA et recettes par soin.' 
                : '👑 Votre centre de contrôle exécutif : supervision multi-salons, prédictions Machine Learning 90j et comptabilité SYSCOHADA.'}
            </p>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-3 shrink-0 pt-2 lg:pt-0">
            {activeQuickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl bg-gradient-to-br ${action.color} cursor-pointer transition-all shadow-xl border border-white/20 hover:scale-105 active:scale-95`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${action.textColor}`} />
                  <span className={`text-xs font-black ${action.textColor} truncate`}>{action.label}</span>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      {/* ── 2. KPI METRICS (4 CARDS GRID) ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5"
      >
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.title} variants={itemVariants}>
              <Link href={card.href}>
                <div className={`relative group overflow-hidden rounded-3xl p-4 sm:p-5 border transition-all duration-500 cursor-pointer h-full ${cardBgClass}`}>
                  <div
                    className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"
                    style={{ background: card.accent }}
                  />

                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: `${card.accent}20`, border: `1px solid ${card.accent}40` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: card.accent }} />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
                  </div>

                  {loading ? (
                    <div className="h-7 w-20 rounded-lg bg-white/5 animate-pulse mb-1" />
                  ) : (
                    <div className="text-xl sm:text-2xl font-display font-black text-white mb-1 truncate">{card.value}</div>
                  )}
                  <div className="text-[11px] sm:text-xs font-bold text-white/50 mb-2 truncate">{card.title}</div>
                  <div className="flex items-center justify-between text-[9px] font-mono pt-2 border-t border-white/5">
                    <span className="font-bold px-2 py-0.5 rounded-full" style={{ background: `${card.accent}15`, color: card.accent }}>
                      {card.change}
                    </span>
                    <span className="text-white/30 truncate">{card.subtitle}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── 2.5 CREATIVE EXCLUSIVE PLAN-SPECIFIC MODULE ── */}
      {isEssentiel && (
        <motion.div variants={itemVariants} className="rounded-3xl border border-emerald-500/30 bg-[#0A120D] p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                🟢 Mode Carnet Caisse Express (Plan Essentiel)
              </span>
            </div>
            <span className="text-[10px] font-mono text-white/40">Conçu pour Solo & TPE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-white/40 text-[10px] uppercase font-bold">Encaissements Espèces & Mobile</span>
              <div className="text-xl font-bold text-emerald-400 font-mono">180 000 FCFA</div>
              <div className="text-[10px] text-white/50">6 ventes effectuées aujourd'hui</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-white/40 text-[10px] uppercase font-bold">Rappel Cliente Automatique</span>
              <div className="text-sm font-bold text-white">Aminata Diallo (14h00)</div>
              <button className="text-[10px] font-bold text-emerald-400 hover:underline flex items-center gap-1">
                <span>Rappeler par WhatsApp</span> →
              </button>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1 flex flex-col justify-between">
              <span className="text-emerald-300 font-bold text-[11px]">💡 Débloquez l'IA Dermo-Botanique</span>
              <span className="text-[10px] text-white/60">Passez au Plan Pro (15 000 F) pour activer les diagnostics 3D.</span>
              <button 
                onClick={() => { setActivePlan('pro'); localStorage.setItem('kene_active_plan', 'pro'); }}
                className="text-[10px] font-black bg-emerald-400 text-black px-3 py-1 rounded-xl w-fit"
              >
                Tester le Plan Pro ⭐
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {isPro && (
        <motion.div variants={itemVariants} className="rounded-3xl border border-[#C8951E]/40 bg-[#160E08] p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#C8951E]/20 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C8951E] animate-spin" />
              <span className="text-xs font-mono font-bold text-[#F3E5AB] uppercase tracking-widest">
                ⭐ Cockpit Dermo-Botanique (Plan Pro)
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              💡 Humidité 85% à Abidjan — Recommandez les Soins Scellants
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[#C8951E] text-[10px] uppercase font-bold">Dernier Diagnostic Cutané 3D</span>
              <div className="text-sm font-bold text-white">Phototype V — Hydratation 48%</div>
              <div className="text-[10px] text-white/50">Formule : Masque Beurre de Karité & Moringa</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[#C8951E] text-[10px] uppercase font-bold">Affluence Cabine (Pic 16h-18h)</span>
              <div className="text-sm font-bold text-emerald-400">Occupation 88% (4 Cabines)</div>
              <div className="text-[10px] text-white/50">2 créneaux libres ce soir</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#C8951E]/10 border border-[#C8951E]/30 space-y-1 flex flex-col justify-between">
              <span className="text-[#F3E5AB] font-bold text-[11px]">👑 Besoin du Multi-Salons & SYSCOHADA ?</span>
              <span className="text-[10px] text-white/60">Passez au Plan Élite (30 000 F) pour superviser plusieurs instituts.</span>
              <button 
                onClick={() => { setActivePlan('elite'); localStorage.setItem('kene_active_plan', 'elite'); }}
                className="text-[10px] font-black bg-[#C8951E] text-black px-3 py-1 rounded-xl w-fit"
              >
                Tester le Plan Élite 👑
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {isElite && (
        <motion.div variants={itemVariants} className="rounded-3xl border-2 border-[#FFD700]/60 bg-[#1F1106] p-5 shadow-2xl space-y-4 backdrop-blur-2xl">
          <div className="flex items-center justify-between border-b border-[#FFD700]/30 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#FFD700] animate-bounce" />
              <span className="text-xs font-mono font-black text-[#FFD700] uppercase tracking-widest">
                👑 Executive Control Center — Multi-Salons & Machine Learning (Plan Élite)
              </span>
            </div>
            <span className="text-[10px] font-mono text-black font-black bg-[#FFD700] px-2.5 py-0.5 rounded-full shadow-md">
              CONSOLIDATION UEMOA / OHADA ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-[#FFD700]/30 space-y-1">
              <span className="text-[#FFD700] text-[10px] uppercase font-bold flex items-center gap-1">
                <span>📍</span> Abidjan · Cocody Riviera
              </span>
              <div className="text-base font-black text-white font-mono">11 250 000 FCFA</div>
              <div className="text-[10px] text-emerald-400 font-bold">142 clientes · Santé 98%</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-[#FFD700]/30 space-y-1">
              <span className="text-[#FFD700] text-[10px] uppercase font-bold flex items-center gap-1">
                <span>📍</span> Dakar · Almadies
              </span>
              <div className="text-base font-black text-white font-mono">4 850 000 FCFA</div>
              <div className="text-[10px] text-emerald-400 font-bold">89 clientes · Santé 94%</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-[#FFD700]/30 space-y-1">
              <span className="text-[#FFD700] text-[10px] uppercase font-bold flex items-center gap-1">
                <span>📍</span> Bamako · ACI 2000
              </span>
              <div className="text-base font-black text-white font-mono">2 400 000 FCFA</div>
              <div className="text-[10px] text-amber-400 font-bold">46 clientes · En expansion</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── 3. INTERACTIVE DIAGRAMS & ANALYTICS SECTION (ADAPTS DYNAMICALLY TO PLAN) ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* DIAGRAMME 1 : Adapté selon le Plan (2 COLS) */}
        <motion.div variants={itemVariants} className="lg:col-span-2 rounded-3xl border border-white/10 bg-[#1A1410] p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
            <div>
              <div className="text-[10px] font-mono text-[#C8951E] uppercase tracking-wider font-bold flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" /> {isEssentiel ? 'Diagramme Ventes Caisse Simplifiées (Plan Essentiel)' : isPro ? 'Diagramme Analytique Hebdomadaire (Plan Pro ⭐)' : '👑 Diagramme Prédictif IA & Multi-Salons (Plan Élite 👑)'}
              </div>
              <h3 className="text-lg font-display font-black text-white">
                {isEssentiel ? "Suivi Hebdomadaire des Recettes Caisse" : isPro ? "Évolution du Chiffre d'Affaires & RDV" : "Prévisions IA 90j & Comparatif Multi-Salons"}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono border px-2.5 py-1 rounded-full font-bold ${
                isEssentiel ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : isPro ? 'bg-[#C8951E]/15 text-[#F3E5AB] border-[#C8951E]/30' : 'bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/40'
              }`}>
                {isEssentiel ? 'Vue Simplifiée 1 Cabine' : isPro ? '+18.4% cette semaine' : '👑 Machine Learning 90j Active'}
              </span>
            </div>
          </div>

          {/* SVG Curved Area Chart */}
          <div className="relative h-48 w-full my-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 700 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C8951E" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#C8951E" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 45, 90, 135, 180].map((y, idx) => (
                <line key={idx} x1="0" y1={y} x2="700" y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              ))}

              {/* Area Fill */}
              <polygon
                points={`0,180 ${WEEKLY_DATA.map((d, i) => `${(i / (WEEKLY_DATA.length - 1)) * 700},${180 - (d.val / maxVal) * 150}`).join(' ')} 700,180`}
                fill="url(#chartGradient)"
              />

              {/* Polyline Path */}
              <polyline
                fill="none"
                stroke="#C8951E"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={WEEKLY_DATA.map((d, i) => `${(i / (WEEKLY_DATA.length - 1)) * 700},${180 - (d.val / maxVal) * 150}`).join(' ')}
              />

              {/* Data Interactive Nodes */}
              {WEEKLY_DATA.map((d, i) => {
                const cx = (i / (WEEKLY_DATA.length - 1)) * 700;
                const cy = 180 - (d.val / maxVal) * 150;
                const isSelected = activeChartPoint === i;
                return (
                  <g key={i} className="cursor-pointer" onClick={() => setActiveChartPoint(i)}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? "7" : "4.5"}
                      fill={isSelected ? "#FFD700" : "#C8951E"}
                      stroke="#0F0A05"
                      strokeWidth="2.5"
                    />
                    {isSelected && (
                      <circle cx={cx} cy={cy} r="12" fill="none" stroke="#FFD700" strokeWidth="1.5" opacity="0.6" />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Chart Days Legend */}
          <div className="grid grid-cols-7 gap-1 text-center pt-3 border-t border-white/5">
            {WEEKLY_DATA.map((d, i) => (
              <button
                key={i}
                onClick={() => setActiveChartPoint(i)}
                className={`py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeChartPoint === i
                    ? 'bg-[#C8951E] text-black font-black shadow-md'
                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div>{d.day}</div>
                <div className="text-[9px] opacity-80">{Math.round(d.val / 1000)}k</div>
              </button>
            ))}
          </div>

          {/* Active Node Detail Card */}
          {activeChartPoint !== null && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-2xl bg-[#0F0A05] border border-[#C8951E]/40 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#C8951E]/20 flex items-center justify-center font-bold text-[#C8951E]">
                  {WEEKLY_DATA[activeChartPoint].day}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    Revenu : {WEEKLY_DATA[activeChartPoint].val.toLocaleString('fr-FR')} FCFA
                  </div>
                  <div className="text-[10px] text-white/50 font-mono">
                    {WEEKLY_DATA[activeChartPoint].rdv} rendez-vous honorés
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Performance Optimale
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* DIAGRAMME 2 : Répartition par Catégorie de Soins (1 COL) */}
        <motion.div variants={itemVariants} className="rounded-3xl border border-white/10 bg-[#1A1410] p-5 sm:p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
              <div className="text-[10px] font-mono text-[#C8951E] uppercase tracking-wider font-bold flex items-center gap-1.5">
                <PieChart className="w-3.5 h-3.5" /> Diagramme de Répartition
              </div>
              <span className="text-[10px] font-mono text-white/40">Par Catégorie</span>
            </div>
            <h3 className="text-base font-display font-black text-white mb-4">Ventes par Type de Prestation</h3>

            <div className="space-y-4">
              {CATEGORY_DISTRIBUTION.map((cat, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-2 font-semibold text-white/90 truncate">
                      <span>{cat.icon}</span> {cat.label}
                    </span>
                    <span className="font-mono font-bold text-white shrink-0 ml-2">{cat.pct}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.pct}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ background: cat.color }}
                    />
                  </div>
                  <div className="text-[9px] text-white/40 font-mono text-right">
                    {cat.amount.toLocaleString('fr-FR')} FCFA
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 bg-[#0F0A05]/60 rounded-2xl p-3 flex items-center justify-between">
            <span className="text-[10px] text-white/50 font-mono">Service n°1 : Soins Karité</span>
            <Link href="/services">
              <button className="text-[10px] font-bold text-[#C8951E] hover:underline flex items-center gap-1">
                Catalogue <ChevronRight className="w-3 h-3" />
              </button>
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* ── 3. INTERACTIVE DIAGRAMS & ANALYTICS SECTION (STRICT PLAN ISOLATION) ── */}
      {/* 🟢 PLAN ESSENTIEL DIAGRAMS & CARDS */}
      {isEssentiel && (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={itemVariants} className="rounded-3xl border border-emerald-500/30 bg-[#0C1510] p-5 sm:p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-500/20">
                <div className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" /> Recettes Caisse du Jour & Semaine (Plan Essentiel)
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">1 Cabine Solo</span>
              </div>
              <h3 className="text-base font-display font-black text-white mb-4">Total Encaissé : 180 000 FCFA</h3>
              <div className="space-y-3">
                {WEEKLY_DATA.slice(0, 5).map((d, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-white/70 w-10">{d.day}</span>
                    <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(d.val / 580000) * 100}%` }} />
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400 w-24 text-right">{d.val.toLocaleString('fr-FR')} F</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="rounded-3xl border border-emerald-500/30 bg-[#0C1510] p-5 sm:p-6 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-500/20">
                  <div className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-emerald-400" /> RDV du Jour (Plan Essentiel)
                  </div>
                  <span className="text-[10px] text-white/50">4 clientes inscrites</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    { time: '09h00', client: 'Awa Koné', service: 'Soin Karité Express', phone: '+225 07 00 11 22' },
                    { time: '11h30', client: 'Fatou Sarr', service: 'Tresses Afro Naturelles', phone: '+225 05 44 33 22' },
                    { time: '14h30', client: 'Mariam Coulibaly', service: 'Bain d\'Huile Baobab', phone: '+225 01 99 88 77' },
                  ].map((rdv, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 text-xs">
                      <div>
                        <span className="font-mono text-emerald-400 font-bold mr-2">{rdv.time}</span>
                        <strong className="text-white">{rdv.client}</strong>
                        <div className="text-[10px] text-white/50">{rdv.service}</div>
                      </div>
                      <a href={`https://wa.me/${rdv.phone.replace(/[\s\+]/g, '')}`} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-xl hover:bg-emerald-500/20">
                        WhatsApp →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-500/20 text-[10px] text-emerald-300/80 font-mono text-center">
                🟢 Plan Essentiel actif · Caisse & Agenda simplifiés
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* ⭐ PLAN PRO DIAGRAMS & CARDS */}
      {isPro && (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* DIAGRAMME 1 PRO */}
            <motion.div variants={itemVariants} className="lg:col-span-2 rounded-3xl border border-[#C8951E]/40 bg-[#1A1410] p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div>
                  <div className="text-[10px] font-mono text-[#C8951E] uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5" /> Diagramme Analytique Hebdomadaire (Plan Pro ⭐)
                  </div>
                  <h3 className="text-lg font-display font-black text-white">Évolution du Chiffre d'Affaires & RDV</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold">
                    +18.4% cette semaine
                  </span>
                </div>
              </div>

              {/* SVG Curved Area Chart */}
              <div className="relative h-48 w-full my-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 700 180" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C8951E" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#C8951E" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {[0, 45, 90, 135, 180].map((y, idx) => (
                    <line key={idx} x1="0" y1={y} x2="700" y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                  ))}
                  <polygon
                    points={`0,180 ${WEEKLY_DATA.map((d, i) => `${(i / (WEEKLY_DATA.length - 1)) * 700},${180 - (d.val / maxVal) * 150}`).join(' ')} 700,180`}
                    fill="url(#chartGradient)"
                  />
                  <polyline
                    fill="none" stroke="#C8951E" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                    points={WEEKLY_DATA.map((d, i) => `${(i / (WEEKLY_DATA.length - 1)) * 700},${180 - (d.val / maxVal) * 150}`).join(' ')}
                  />
                  {WEEKLY_DATA.map((d, i) => {
                    const cx = (i / (WEEKLY_DATA.length - 1)) * 700;
                    const cy = 180 - (d.val / maxVal) * 150;
                    const isSelected = activeChartPoint === i;
                    return (
                      <g key={i} className="cursor-pointer" onClick={() => setActiveChartPoint(i)}>
                        <circle cx={cx} cy={cy} r={isSelected ? "7" : "4.5"} fill={isSelected ? "#FFD700" : "#C8951E"} stroke="#0F0A05" strokeWidth="2.5" />
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center pt-3 border-t border-white/5">
                {WEEKLY_DATA.map((d, i) => (
                  <button key={i} onClick={() => setActiveChartPoint(i)} className={`py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${activeChartPoint === i ? 'bg-[#C8951E] text-black font-black' : 'text-white/50 hover:bg-white/5'}`}>
                    <div>{d.day}</div>
                    <div className="text-[9px] opacity-80">{Math.round(d.val / 1000)}k</div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* DIAGRAMME 2 PRO */}
            <motion.div variants={itemVariants} className="rounded-3xl border border-[#C8951E]/40 bg-[#1A1410] p-5 sm:p-6 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                  <div className="text-[10px] font-mono text-[#C8951E] uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <PieChart className="w-3.5 h-3.5" /> Répartition par Soins (Plan Pro ⭐)
                  </div>
                  <span className="text-[10px] font-mono text-white/40">Par Catégorie</span>
                </div>
                <h3 className="text-base font-display font-black text-white mb-4">Ventes par Type de Prestation</h3>
                <div className="space-y-4">
                  {CATEGORY_DISTRIBUTION.map((cat, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="flex items-center gap-2 font-semibold text-white/90 truncate"><span>{cat.icon}</span> {cat.label}</span>
                        <span className="font-mono font-bold text-white shrink-0 ml-2">{cat.pct}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${cat.pct}%`, background: cat.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={itemVariants} className="rounded-3xl border border-white/10 bg-[#1A1410] p-5 sm:p-6 shadow-2xl flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-[10px] font-mono text-[#C8951E] uppercase tracking-wider mb-1 font-bold">Objectif Financier Mensuel</div>
                  <div className="text-xl sm:text-2xl font-display font-black text-white">14.85M <span className="text-xs text-white/40">/ 18.0M FCFA</span></div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#C8951E]/15 flex items-center justify-center border border-[#C8951E]/30">
                  <Award className="w-5 h-5 text-[#C8951E]" />
                </div>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden relative mb-2">
                <div className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-[#8A3B14] via-[#C8951E] to-[#F3E5AB]" style={{ width: '82.5%' }} />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="rounded-3xl border border-white/10 bg-[#1A1410] p-5 sm:p-6 shadow-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                <div className="text-[10px] font-mono text-[#C8951E] uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Taux d'Occupation Cabines (Plan Pro ⭐)
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">88% Moyen</span>
              </div>
              <div className="space-y-2.5">
                {PEAK_HOURS.slice(0, 3).map((slot, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-2xl bg-white/5 border border-white/5 text-xs">
                    <span className="font-mono text-white/70 w-16">{slot.time}</span>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${slot.occupancy}%`, background: slot.occupancy === 100 ? '#8A1C14' : '#C8951E' }} />
                    </div>
                    <span className="font-mono text-[9px] font-bold text-[#C8951E]">{slot.status}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* 👑 PLAN ÉLITE DIAGRAMS & CARDS */}
      {isElite && (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* DIAGRAMME PREDICTIF MACHINE LEARNING 90J */}
            <motion.div variants={itemVariants} className="lg:col-span-2 rounded-3xl border-2 border-[#FFD700]/70 bg-[#1F1106] p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between backdrop-blur-2xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#FFD700]/30">
                <div>
                  <div className="text-[10px] font-mono text-[#FFD700] uppercase tracking-wider font-black flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-[#FFD700] animate-bounce" /> 👑 Machine Learning & Prédictions IA à 90 jours (Plan Élite 👑)
                  </div>
                  <h3 className="text-lg font-display font-black text-white">Prévision du Chiffre d'Affaires Trimestriel Consolidé</h3>
                </div>
                <span className="text-[10px] font-mono bg-[#FFD700] text-black font-black px-3 py-1 rounded-full shadow-lg">
                  Précision IA 96.4%
                </span>
              </div>

              {/* Machine Learning Curve */}
              <div className="relative h-48 w-full my-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 700 180" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="eliteGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FFD700" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#8A1C14" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <polygon points="0,180 0,120 150,90 300,110 450,50 600,30 700,10 700,180" fill="url(#eliteGradient)" />
                  <polyline fill="none" stroke="#FFD700" strokeWidth="4" strokeLinecap="round" points="0,120 150,90 300,110 450,50 600,30 700,10" />
                  {[0, 150, 300, 450, 600, 700].map((cx, i) => (
                    <circle key={i} cx={cx} cy={[120, 90, 110, 50, 30, 10][i]} r="6" fill="#FFD700" stroke="#000" strokeWidth="2" />
                  ))}
                </svg>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center pt-3 border-t border-[#FFD700]/20 text-xs font-mono font-bold">
                <div className="p-2 rounded-xl bg-white/5"><div className="text-white/50 text-[9px]">Mois M</div><div className="text-[#FFD700]">18.5M FCFA</div></div>
                <div className="p-2 rounded-xl bg-white/5"><div className="text-white/50 text-[9px]">Mois M+1 (IA)</div><div className="text-emerald-400">21.2M FCFA</div></div>
                <div className="p-2 rounded-xl bg-white/5"><div className="text-white/50 text-[9px]">Mois M+2 (IA)</div><div className="text-emerald-400">24.8M FCFA</div></div>
                <div className="p-2 rounded-xl bg-white/5"><div className="text-white/50 text-[9px]">Mois M+3 (IA)</div><div className="text-[#FFD700]">28.5M FCFA</div></div>
              </div>
            </motion.div>

            {/* SUPERVISION DE LA MASSE SALARIALE & CNPS SYSCOHADA */}
            <motion.div variants={itemVariants} className="rounded-3xl border-2 border-[#FFD700]/70 bg-[#1F1106] p-5 sm:p-6 shadow-2xl flex flex-col justify-between backdrop-blur-2xl">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#FFD700]/30">
                  <div className="text-[10px] font-mono text-[#FFD700] uppercase tracking-wider font-black flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#FFD700]" /> 👑 Paie CNPS & Comptabilité SYSCOHADA
                  </div>
                  <span className="text-[9px] bg-red-500/20 text-red-300 font-bold px-2 py-0.5 rounded-full border border-red-500/40">UEMOA Certifié</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center">
                    <span className="text-white/70">Compte 5711 (Caisse Principale Abidjan)</span>
                    <strong className="text-[#FFD700] font-mono">18 500 000 F</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center">
                    <span className="text-white/70">Masse Salariale Nette (12 Praticiennes)</span>
                    <strong className="text-white font-mono">4 250 000 F</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center">
                    <span className="text-white/70">Cotisations CNPS Patronales (7.7%)</span>
                    <strong className="text-emerald-400 font-mono">327 250 F</strong>
                  </div>
                </div>
              </div>

              <Link href="/compta" className="mt-4">
                <button className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#FFD700] to-[#C8951E] text-black font-black text-xs uppercase tracking-wider shadow-xl hover:scale-[1.02] transition-transform">
                  Ouvrir le Journal SYSCOHADA 👑 →
                </button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* ── 6. CATALOGUE DES MODULES ACTIFS ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display font-black text-white text-sm uppercase tracking-[0.15em] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#C8951E]" /> Modules & Extensions du Plan
          </h2>
          <span className="text-[10px] font-mono text-[#C8951E] font-bold border border-[#C8951E]/30 bg-[#C8951E]/10 px-2.5 py-0.5 rounded-full">
            Plan {activePlan.toUpperCase()} Actif
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {[
            { id: 'lab', label: 'Labo Sur-Mesure', href: '/lab', icon: '🧪', desc: 'Formulation botaniques', color: '#C8951E' },
            { id: 'diagnoses', label: 'Diagnostic IA Peau', href: '/diagnoses', icon: '🔬', desc: 'Phototypes Fitzpatrick', color: '#4E9FD1' },
            { id: 'marketing', label: 'Marketing WhatsApp', href: '/marketing', icon: '💬', desc: 'Campagnes & relances', color: '#4CAF6E' },
            { id: 'rh', label: 'Paie & CNPS OHADA', href: '/rh', icon: '📋', desc: 'Bulletins conformes', color: '#E07A2B' },
            { id: 'reviews', label: 'Avis & Réputation', href: '/reviews', icon: '⭐', desc: 'Gestion des retours', color: '#F3E5AB' },
            { id: 'compta', label: 'Comptabilité', href: '/compta', icon: '📊', desc: 'SYSCOHADA UEMOA', color: '#8A3B14' },
            { id: 'clients', label: 'Signature Tactile', href: '/clients', icon: '✍️', desc: 'Consentements dématérialisés', color: '#6B46C1' },
            { id: 'services', label: 'Services & Tarifs', href: '/services', icon: '✂️', desc: 'Catalogue & commissions', color: '#5A1E2E' },
          ].map((mod, i) => {
            const allowed = KENE_PRICING_PLANS[activePlan]?.allowedModules.includes(mod.id);

            if (!allowed) {
              return (
                <motion.div key={i} variants={itemVariants}>
                  <div 
                    onClick={() => {
                      toast({
                        title: `🔒 Module "${mod.label}" Verrouillé`,
                        description: `Le module "${mod.label}" nécessite la mise à niveau vers un plan supérieur.`,
                        variant: "destructive"
                      });
                    }}
                    className="group p-4 rounded-2xl border border-white/5 bg-[#120D09]/60 opacity-60 hover:opacity-100 hover:border-[#C8951E]/40 transition-all duration-200 cursor-pointer h-full relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">{mod.icon}</span>
                      <span className="text-[9px] font-mono font-bold bg-[#C8951E]/20 text-[#F3E5AB] px-1.5 py-0.5 rounded-md border border-[#C8951E]/30 flex items-center gap-1">
                        🔒 Lock
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white/50 group-hover:text-white mb-0.5 truncate">{mod.label}</div>
                    <div className="text-[10px] text-white/30 truncate">Inclus dans Plan Supérieur</div>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div key={i} variants={itemVariants}>
                <Link href={mod.href}>
                  <div className={`group p-4 rounded-2xl border transition-all duration-200 cursor-pointer h-full shadow-lg ${cardBgClass}`}>
                    <div className="text-2xl mb-2">{mod.icon}</div>
                    <div className="text-xs font-bold text-white mb-0.5 truncate">{mod.label}</div>
                    <div className="text-[10px] text-white/50 truncate">{mod.desc}</div>
                    <div
                      className="mt-3 h-0.5 rounded-full w-8 transition-all duration-300 group-hover:w-full"
                      style={{ background: mod.color }}
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── MOBILE & TABLET STICKY BOTTOM NAV BAR (RESPONSIVE PER PLAN) ── */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-40 bg-[#150F0A]/95 border border-[#C8951E]/50 p-2 rounded-2xl backdrop-blur-2xl shadow-2xl flex items-center justify-around">
        <Link href="/agenda" className="flex flex-col items-center text-white/70 hover:text-[#C8951E]">
          <CalendarCheck className="w-5 h-5 text-[#C8951E]" />
          <span className="text-[9px] font-bold font-display mt-0.5">RDV</span>
        </Link>
        <Link href="/pos" className="flex flex-col items-center text-white/70 hover:text-emerald-400">
          <ShoppingCart className="w-5 h-5 text-emerald-400" />
          <span className="text-[9px] font-bold font-display mt-0.5">Caisse POS</span>
        </Link>
        
        {isElite ? (
          <Link href="/lab" className="flex flex-col items-center text-white/70 hover:text-[#FFD700]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FFD700] to-[#C8951E] text-[#0F0A05] flex items-center justify-center font-bold shadow-lg -mt-3 border-2 border-[#150F0A]">
              🧪
            </div>
            <span className="text-[9px] font-bold font-display mt-0.5 text-[#FFD700]">Labo 👑</span>
          </Link>
        ) : isPro ? (
          <Link href="/diagnoses" className="flex flex-col items-center text-white/70 hover:text-[#C8951E]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] flex items-center justify-center font-bold shadow-lg -mt-3 border-2 border-[#150F0A]">
              🔬
            </div>
            <span className="text-[9px] font-bold font-display mt-0.5 text-[#C8951E]">Scan 3D ⭐</span>
          </Link>
        ) : (
          <Link href="/services" className="flex flex-col items-center text-white/70 hover:text-emerald-400">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-teal-600 text-black flex items-center justify-center font-bold shadow-lg -mt-3 border-2 border-[#150F0A]">
              ✂️
            </div>
            <span className="text-[9px] font-bold font-display mt-0.5 text-emerald-400">Tarifs 🟢</span>
          </Link>
        )}

        <Link href={isElite ? '/compta' : isPro ? '/inventory' : '/clients'} className="flex flex-col items-center text-white/70 hover:text-blue-400">
          {isElite ? <BarChart3 className="w-5 h-5 text-[#FFD700]" /> : isPro ? <Package className="w-5 h-5 text-amber-400" /> : <Users className="w-5 h-5 text-emerald-400" />}
          <span className="text-[9px] font-bold font-display mt-0.5">{isElite ? 'Compta 👑' : isPro ? 'Stocks ⭐' : 'Clientes 🟢'}</span>
        </Link>

        <Link href="/clients" className="flex flex-col items-center text-white/70 hover:text-white">
          <Users className="w-5 h-5 text-white/60" />
          <span className="text-[9px] font-bold font-display mt-0.5">Fiches</span>
        </Link>
      </div>

    </div>
  );
}
