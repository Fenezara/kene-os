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
  { label: 'Nouveau RDV', href: '/agenda', icon: CalendarCheck, color: 'from-[#C8951E] to-[#8A5C0A]', textColor: 'text-[#0F0A05]' },
  { label: 'Encaisser POS', href: '/pos', icon: ShoppingCart, color: 'from-[#2E5A36] to-[#1A3820]', textColor: 'text-emerald-200' },
  { label: 'Labo Sur-Mesure', href: '/lab', icon: FlaskConical, color: 'from-[#8A3B14] to-[#4A1B07]', textColor: 'text-amber-200' },
  { label: 'Diagnostic IA', href: '/diagnoses', icon: ScanFace, color: 'from-[#1E3A5F] to-[#0E1E35]', textColor: 'text-blue-200' },
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

  const activeQuickActions = isEssentiel
    ? [
        { label: 'Nouveau RDV', href: '/agenda', icon: CalendarCheck, color: 'from-emerald-600 to-emerald-900', textColor: 'text-white' },
        { label: 'Encaisser POS', href: '/pos', icon: ShoppingCart, color: 'from-emerald-700 to-teal-950', textColor: 'text-emerald-200' },
        { label: 'Ajouter Cliente', href: '/clients', icon: Users, color: 'from-slate-700 to-slate-900', textColor: 'text-slate-200' },
        { label: 'Services & Tarifs', href: '/services', icon: Scissors, color: 'from-slate-800 to-slate-950', textColor: 'text-slate-300' },
      ]
    : isPro
    ? [
        { label: 'Nouveau RDV', href: '/agenda', icon: CalendarCheck, color: 'from-[#C8951E] to-[#8A5C0A]', textColor: 'text-[#0F0A05]' },
        { label: 'Encaisser POS', href: '/pos', icon: ShoppingCart, color: 'from-[#2E5A36] to-[#1A3820]', textColor: 'text-emerald-200' },
        { label: 'Diagnostic 3D IA', href: '/diagnoses', icon: ScanFace, color: 'from-[#C8951E]/80 to-[#D4AF37]', textColor: 'text-black' },
        { label: 'Stocks Produits', href: '/inventory', icon: Package, color: 'from-[#8A3B14] to-[#4A1B07]', textColor: 'text-amber-200' },
      ]
    : [
        { label: 'Labo Sur-Mesure 👑', href: '/lab', icon: FlaskConical, color: 'from-[#FFD700] via-[#C8951E] to-[#8A1C14]', textColor: 'text-black font-black' },
        { label: 'Compta SYSCOHADA 👑', href: '/compta', icon: BarChart3, color: 'from-[#1E3A5F] to-[#0E1E35]', textColor: 'text-blue-200' },
        { label: 'Diagnostic 3D IA', href: '/diagnoses', icon: ScanFace, color: 'from-[#C8951E] to-[#8A5C0A]', textColor: 'text-[#0F0A05]' },
        { label: 'Paie & CNPS 👑', href: '/rh', icon: ShieldCheck, color: 'from-[#8A1C14] to-[#4A0A05]', textColor: 'text-red-200' },
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

      {/* ── 0. INTERACTIVE PLAN SWITCHER CONTROL BAR ── */}
      <div className={`p-4 rounded-3xl border shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-500 ${
        isEssentiel ? 'bg-[#0E1511]/90 border-emerald-500/30' : isPro ? 'bg-[#18110B]/90 border-[#C8951E]/40' : 'bg-[#1E1108]/90 border-2 border-[#FFD700]/70'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#C8951E]/20 border border-[#C8951E]/40 flex items-center justify-center text-xl shrink-0">
            {isEssentiel ? '🟢' : isPro ? '⭐' : '👑'}
          </div>
          <div>
            <div className="text-[10px] font-mono text-[#C8951E] uppercase tracking-wider font-bold flex items-center gap-2">
              <span>Sélecteur de Plan en Direct</span>
              <span className="text-[9px] bg-white/10 px-2 py-0.2 rounded-full text-white/70">Cliquez pour tester</span>
            </div>
            <div className="text-sm font-bold text-white">
              Plan Actif : <span className="text-[#F3E5AB] font-black">{isEssentiel ? 'Plan 1 — Essentiel (7 500 F)' : isPro ? 'Plan 2 — Pro ⭐ (15 000 F)' : 'Plan 3 — Élite 👑 (30 000 F)'}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 w-full md:w-auto">
          {[
            { id: 'essentiel', label: 'Plan 1: Essentiel', price: '7 500 F', color: 'border-emerald-500 bg-emerald-500/20 text-emerald-300' },
            { id: 'pro', label: 'Plan 2: Pro ⭐', price: '15 000 F', color: 'border-[#C8951E] bg-[#C8951E]/25 text-[#F3E5AB]' },
            { id: 'elite', label: 'Plan 3: Élite 👑', price: '30 000 F', color: 'border-[#FFD700] bg-[#FFD700]/30 text-[#FFD700]' },
          ].map((plan) => {
            const isSelected = activePlan === plan.id;
            return (
              <button
                key={plan.id}
                onClick={() => {
                  setActivePlan(plan.id as any);
                  localStorage.setItem('kene_active_plan', plan.id);
                  window.dispatchEvent(new Event('kene_plan_changed'));
                  toast({
                    title: `✨ Plan basculé sur "${plan.label}" !`,
                    description: `Le tableau de bord et les cartes visuelles ont été adaptés au ${plan.label}.`,
                  });
                }}
                className={`px-3 py-2 rounded-2xl text-xs font-bold font-mono transition-all duration-300 border cursor-pointer ${
                  isSelected
                    ? `${plan.color} shadow-lg scale-105 font-black ring-2 ring-white/20`
                    : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="truncate">{plan.label}</div>
                <div className="text-[9px] opacity-75">{plan.price}/mois</div>
              </button>
            );
          })}
        </div>
      </div>

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
              <span className="bg-[#C8951E]/15 border border-[#C8951E]/30 px-2.5 py-0.5 rounded-full">
                {now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Certifié OHADA & UEMOA
              </span>
            </div>

            {/* Clean Professional Establishment Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#C8951E]/15 border border-[#C8951E]/30 text-[#F3E5AB] text-xs font-bold font-display shadow-md">
              <Building2 className="w-4 h-4 text-[#C8951E]" />
              <span>Établissement : <strong className="text-white font-black">{tenantName}</strong> • Abidjan 🇨🇮</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight leading-tight">
              {greeting}, <span className="text-[#F3E5AB]">{employeeName}</span> 👋
            </h1>
            <p className="text-xs sm:text-sm text-white/60 font-sans max-w-xl">
              Bienvenue sur votre espace de travail professionnel chez <strong className="text-white">{tenantName}</strong>.
            </p>

            <div className="mt-3 inline-flex items-center gap-2 bg-[#0F0A05]/80 border border-[#C8951E]/30 rounded-2xl p-2 sm:px-3 sm:py-1.5 backdrop-blur-md max-w-full">
              <span className="text-base shrink-0">💡</span>
              <span className="text-[10px] sm:text-[11px] font-medium text-white/80 leading-tight">
                <strong className="text-[#C8951E]">Météo Abidjan (85% Humidité)</strong> — Période idéale pour proposer le <span className="underline decoration-[#C8951E]">Soin Scellant Karité-Baobab</span>.
              </span>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-2.5 shrink-0 pt-2 lg:pt-0">
            {activeQuickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-2.5 px-3.5 py-3 rounded-2xl bg-gradient-to-br ${action.color} cursor-pointer transition-all shadow-lg border border-white/10`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${action.textColor}`} />
                    <span className={`text-xs font-bold ${action.textColor} truncate`}>{action.label}</span>
                  </motion.div>
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

      {/* ── 3. INTERACTIVE DIAGRAMS & ANALYTICS SECTION ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* DIAGRAMME 1 : Courbe d'Évolution des Revenus (2 COLS) */}
        <motion.div variants={itemVariants} className="lg:col-span-2 rounded-3xl border border-white/10 bg-[#1A1410] p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
            <div>
              <div className="text-[10px] font-mono text-[#C8951E] uppercase tracking-wider font-bold flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" /> Diagramme Analytique Hebdomadaire
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

      {/* ── 4. HEURES DE POINTE & OBJECTIFS (2 COLS) ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Objectif Mensuel + Top Praticienne */}
        <motion.div variants={itemVariants} className="rounded-3xl border border-white/10 bg-[#1A1410] p-5 sm:p-6 shadow-2xl flex flex-col justify-between">
          <div>
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
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '82.5%' }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="absolute top-0 left-0 h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #8A3B14, #C8951E, #F3E5AB)' }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold">
              <span className="text-[#C8951E]">Avancement (82.5%)</span>
              <span className="text-white/40">+3.15M FCFA restants</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C8951E] to-[#8A3B14] p-[2px]">
                <div className="w-full h-full rounded-2xl bg-[#1A1410] flex items-center justify-center">
                  <span className="text-lg font-bold text-[#C8951E]">F</span>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#C8951E] text-[#0F0A05] text-[8px] font-black px-1.5 rounded-full">
                #1
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-mono text-[#C8951E] uppercase font-bold">Top Praticienne du mois</div>
              <div className="text-sm font-bold text-white truncate">Fatou Sylla</div>
              <div className="text-[10px] text-white/50">2.4M FCFA de CA · 124 prestations</div>
            </div>
          </div>
        </motion.div>

        {/* Heatmap des Heures de Pointe Cabines */}
        <motion.div variants={itemVariants} className="rounded-3xl border border-white/10 bg-[#1A1410] p-5 sm:p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
              <div className="text-[10px] font-mono text-[#C8951E] uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Taux d'Occupation Cabines
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">88% Moyen</span>
            </div>
            <h3 className="text-base font-display font-black text-white mb-4">Planning des Heures de Pointe</h3>

            <div className="space-y-2.5">
              {PEAK_HOURS.map((slot, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-xs font-mono font-bold text-white/70 w-16 shrink-0">{slot.time}</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${slot.occupancy}%`,
                        background: slot.occupancy === 100 ? '#8A1C14' : slot.occupancy > 80 ? '#C8951E' : '#4CAF6E'
                      }}
                    />
                  </div>
                  <span
                    className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0"
                    style={{
                      background: slot.occupancy === 100 ? '#8A1C1430' : '#C8951E20',
                      color: slot.occupancy === 100 ? '#FF6B6B' : '#C8951E'
                    }}
                  >
                    {slot.status} ({slot.occupancy}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-white/40 font-mono flex items-center justify-between">
            <span>💡 AI Tip: Ouvrez des créneaux supplémentaires de 16h à 18h</span>
          </div>
        </motion.div>
      </motion.div>

      {/* ── 5. PROCHAINS RDV & ACTIVITÉ RÉCENTE (2 COLS) ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Prochains RDV */}
        <motion.div variants={itemVariants} className="rounded-3xl border border-white/10 bg-[#1A1410] overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#C8951E]/15 flex items-center justify-center">
                <CalendarCheck className="w-4 h-4 text-[#C8951E]" />
              </div>
              <span className="font-display font-bold text-sm text-white">Prochains RDV Cabine Aujourd'hui</span>
            </div>
            <Link href="/agenda">
              <button className="flex items-center gap-1 text-xs font-bold text-[#C8951E] hover:underline cursor-pointer">
                Agenda complet <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
          <div className="p-4 space-y-2.5">
            {[
              { time: '09:00', client: 'Awa Koné', service: 'Soin Karité Profond', phototype: 'Phototype V' },
              { time: '10:30', client: 'Fatoumata Diallo', service: 'Peeling Enzymatique Papaye', phototype: 'Phototype VI' },
              { time: '14:00', client: 'Mariama Traoré', service: 'Hydratation Intensive Baobab', phototype: 'Phototype IV' },
            ].map((rdv, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                <div className="text-xs font-mono text-[#C8951E] w-12 shrink-0 font-bold">{rdv.time}</div>
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C8951E]/20 to-[#8A3B14]/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-[#C8951E]">{rdv.client.charAt(0)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">{rdv.client}</div>
                  <div className="text-[10px] text-white/50 truncate">{rdv.service}</div>
                </div>
                <div className="text-[9px] bg-blue-500/10 text-blue-400 px-2.5 py-0.5 rounded-full shrink-0 font-mono font-bold border border-blue-500/20">
                  {rdv.phototype}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activité Récente */}
        <motion.div variants={itemVariants} className="rounded-3xl border border-white/10 bg-[#1A1410] overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#4CAF6E]/15 flex items-center justify-center">
                <Activity className="w-4 h-4 text-[#4CAF6E]" />
              </div>
              <span className="font-display font-bold text-sm text-white">Activité & Ventes Récentes</span>
            </div>
            <Link href="/pos">
              <button className="flex items-center gap-1 text-xs font-bold text-[#C8951E] hover:underline cursor-pointer">
                Ouvrir POS <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
          <div className="p-4 space-y-2.5">
            {[
              { label: 'Encaissement Vente POS', amount: '25 000 FCFA (Wave)', time: '12 min', icon: '💰' },
              { label: 'Nouvelle cliente enregistrée', amount: 'Adjoua A. — Phototype V', time: '35 min', icon: '👤' },
              { label: 'Sérum Sur-Mesure Préparé', amount: 'Formule Karité LOT-042', time: '1h', icon: '🧪' },
              { label: 'Avis 5 Étoiles Reçu', amount: '"Soin exceptionnel et apaisant"', time: '3h', icon: '⭐' },
            ].map((event, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0 text-base">
                  {event.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">{event.label}</div>
                  <div className="text-[10px] text-white/50 truncate">{event.amount}</div>
                </div>
                <div className="text-[9px] text-white/40 shrink-0 font-mono">{event.time}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* ── 6. CATALOGUE DES MODULES ACTIFS ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display font-black text-white text-sm uppercase tracking-[0.15em] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#C8951E]" /> Modules & Extensions Actives
          </h2>
          <span className="text-[10px] font-mono text-white/40">100% Fonctionnel</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {[
            { label: 'Labo Sur-Mesure', href: '/lab', icon: '🧪', desc: 'Formulation botaniques', color: '#C8951E' },
            { label: 'Diagnostic IA Peau', href: '/diagnoses', icon: '🔬', desc: 'Phototypes Fitzpatrick', color: '#4E9FD1' },
            { label: 'Marketing WhatsApp', href: '/marketing', icon: '💬', desc: 'Campagnes & relances', color: '#4CAF6E' },
            { label: 'Paie & CNPS OHADA', href: '/rh', icon: '📋', desc: 'Bulletins conformes', color: '#E07A2B' },
            { label: 'Avis & Réputation', href: '/reviews', icon: '⭐', desc: 'Gestion des retours', color: '#F3E5AB' },
            { label: 'Comptabilité', href: '/compta', icon: '📊', desc: 'SYSCOHADA UEMOA', color: '#8A3B14' },
            { label: 'Signature Tactile', href: '/clients/signature', icon: '✍️', desc: 'Consentements dématérialisés', color: '#6B46C1' },
            { label: 'Services & Tarifs', href: '/services', icon: '✂️', desc: 'Catalogue & commissions', color: '#5A1E2E' },
          ].map((mod, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Link href={mod.href}>
                <div className="group p-4 rounded-2xl border border-white/10 bg-[#1A1410] hover:border-[#C8951E]/50 hover:bg-[#201812] transition-all duration-200 cursor-pointer h-full shadow-lg">
                  <div className="text-2xl mb-2">{mod.icon}</div>
                  <div className="text-xs font-bold text-white mb-0.5 truncate">{mod.label}</div>
                  <div className="text-[10px] text-white/40 truncate">{mod.desc}</div>
                  <div
                    className="mt-3 h-0.5 rounded-full w-8 transition-all duration-300 group-hover:w-full"
                    style={{ background: mod.color }}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── MOBILE STICKY BOTTOM NAV BAR ── */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-40 bg-[#1A1410]/95 border border-[#C8951E]/40 p-2 rounded-2xl backdrop-blur-2xl shadow-2xl flex items-center justify-around">
        <Link href="/agenda" className="flex flex-col items-center text-white/70 hover:text-[#C8951E]">
          <CalendarCheck className="w-5 h-5 text-[#C8951E]" />
          <span className="text-[9px] font-bold font-display mt-0.5">RDV</span>
        </Link>
        <Link href="/pos" className="flex flex-col items-center text-white/70 hover:text-emerald-400">
          <ShoppingCart className="w-5 h-5 text-emerald-400" />
          <span className="text-[9px] font-bold font-display mt-0.5">Caisse POS</span>
        </Link>
        <Link href="/lab" className="flex flex-col items-center text-white/70 hover:text-[#C8951E]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] flex items-center justify-center font-bold shadow-lg -mt-3 border-2 border-[#1A1410]">
            🧪
          </div>
          <span className="text-[9px] font-bold font-display mt-0.5 text-[#C8951E]">Labo</span>
        </Link>
        <Link href="/diagnoses" className="flex flex-col items-center text-white/70 hover:text-blue-400">
          <ScanFace className="w-5 h-5 text-blue-400" />
          <span className="text-[9px] font-bold font-display mt-0.5">Diag IA</span>
        </Link>
        <Link href="/clients" className="flex flex-col items-center text-white/70 hover:text-white">
          <Users className="w-5 h-5 text-white/60" />
          <span className="text-[9px] font-bold font-display mt-0.5">Clients</span>
        </Link>
      </div>

    </div>
  );
}
