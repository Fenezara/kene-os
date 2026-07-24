'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarCheck, Users, TrendingUp, Scissors,
  ArrowUpRight, Zap, ShoppingCart, Package, Star,
  ArrowRight, Activity, FlaskConical, ScanFace, Plus, PlusCircle
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
  show: { transition: { staggerChildren: 0.06 } }
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

export default function ProDashboardPage() {
  const { toast } = useToast();
  const [stats, setStats] = useState<TenantStats | null>(null);
  const [tenantName, setTenantName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let customSalonName = '';
    if (typeof window !== 'undefined') {
      const savedTenant = localStorage.getItem('kene_tenant_settings');
      const savedUser = localStorage.getItem('kene_user');

      if (savedTenant) {
        try {
          const parsed = JSON.parse(savedTenant);
          if (parsed.identity?.commercialName) customSalonName = parsed.identity.commercialName;
        } catch (e) {}
      }
      if (!customSalonName && savedUser) {
        try {
          const u = JSON.parse(savedUser);
          if (u.salonName) customSalonName = u.salonName;
          else if (u.name && u.role === 'salon') customSalonName = u.name;
        } catch (e) {}
      }
    }

    if (customSalonName) {
      setTenantName(customSalonName);
    }

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/tenant/stats');
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          if (!customSalonName && data.tenantName) {
            setTenantName(data.tenantName);
          }
        }
      } catch {
        toast({ title: "Erreur", description: "Impossible de charger les statistiques.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [toast]);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  const statCards = [
    {
      title: "RDV Aujourd'hui",
      value: stats?.appointmentsToday ?? '—',
      icon: CalendarCheck,
      accent: '#C8951E',
      change: '+2 vs hier',
      href: '/agenda',
    },
    {
      title: 'Clients Totaux',
      value: stats?.totalClients ?? '—',
      icon: Users,
      accent: '#4E9FD1',
      change: '+5 ce mois',
      href: '/clients',
    },
    {
      title: 'Revenus (Mois)',
      value: stats?.revenue ? `${stats.revenue.toLocaleString('fr-FR')} F` : '— F',
      icon: TrendingUp,
      accent: '#4CAF6E',
      change: '+18% vs M-1',
      href: '/compta',
    },
    {
      title: 'Employées Actives',
      value: stats?.activeEmployees ?? '—',
      icon: Scissors,
      accent: '#E07A2B',
      change: 'Équipe au complet',
      href: '/employees',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto pb-24 md:pb-8">

      {/* ── HERO GREETING (RESPONSIVE MOBILE & DESKTOP) ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative overflow-hidden rounded-3xl p-4 sm:p-7 border border-[#C8951E]/20"
        style={{
          background: 'linear-gradient(135deg, #1A1008 0%, #241808 40%, #1A1208 100%)',
        }}
      >
        {/* Decorative gold glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none bg-[#C8951E]" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10 blur-2xl pointer-events-none bg-[#8A3B14]" />

        {/* Kente strip top */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#C8951E] via-[#8A3B14] via-[#2E5A36] via-[#1E3A5F] to-[#C8951E]" />
        </div>

        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="text-[10px] sm:text-xs font-mono tracking-[0.2em] uppercase text-[#C8951E]/70 font-bold">
              {now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight leading-tight">
              {greeting}, <br />
              <span className="bg-gradient-to-r from-[#F3E5AB] via-[#C8951E] to-[#D4AF37] bg-clip-text text-transparent">
                {tenantName || 'Salon Kènè'}
              </span> ✨
            </h1>
            <p className="text-xs sm:text-sm text-white/50 font-sans">
              Votre OS Afro-Beauté & Dermo-Cosmétique — Tout sous contrôle.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-2 sm:px-3 sm:py-1.5 backdrop-blur-md max-w-full">
              <span className="text-sm shrink-0">💡</span>
              <span className="text-[10px] sm:text-[11px] font-medium text-white/80 leading-tight">
                <strong className="text-[#C8951E]">Humidité 85% à Abidjan</strong> — Recommandez les Soins Scellants au Karité aujourd'hui !
              </span>
            </div>
          </div>

          {/* Quick Actions Touch Grid (Responsive Desktop & Mobile) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-2 shrink-0 pt-2 lg:pt-0">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-gradient-to-br ${action.color} cursor-pointer transition-all shadow-md`}
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

      {/* ── KPI STATS (GRID RESPONSIVE 2X2 MOBILE / 4 COLS DESKTOP) ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.title} variants={itemVariants}>
              <Link href={card.href}>
                <div className="relative group overflow-hidden rounded-3xl p-4 sm:p-5 border border-white/5 bg-[#1A1410] hover:border-[#C8951E]/40 transition-all duration-300 cursor-pointer h-full shadow-lg">
                  {/* Colored corner glow */}
                  <div
                    className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"
                    style={{ background: card.accent }}
                  />

                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: `${card.accent}20`, border: `1px solid ${card.accent}30` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: card.accent }} />
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white transition-colors" />
                  </div>

                  {loading ? (
                    <div className="h-7 w-16 rounded-lg bg-white/5 animate-pulse mb-1" />
                  ) : (
                    <div className="text-xl sm:text-2xl font-display font-black text-white mb-1 truncate">{card.value}</div>
                  )}
                  <div className="text-[10px] sm:text-xs text-white/40 font-sans mb-2 truncate">{card.title}</div>
                  <div
                    className="text-[9px] font-mono px-2 py-0.5 rounded-full w-fit font-bold"
                    style={{ background: `${card.accent}15`, color: card.accent }}
                  >
                    {card.change}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── HIGHLIGHTS (OBJECTIF & PRATICIENNE RESPONSIVE) ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
      >
        {/* Objectif du Mois */}
        <motion.div variants={itemVariants} className="rounded-3xl border border-white/5 bg-[#1A1410] p-5 sm:p-6 relative overflow-hidden flex flex-col justify-center shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-[10px] font-mono text-[#C8951E] uppercase tracking-wider mb-1 font-bold">Objectif Mensuel Salon</div>
              <div className="text-lg sm:text-xl font-display font-black text-white">14.8M <span className="text-xs sm:text-sm text-white/40">/ 18.0M FCFA</span></div>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#C8951E]/10 flex items-center justify-center border border-[#C8951E]/20">
              <Star className="w-4 h-4 text-[#C8951E]" />
            </div>
          </div>
          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '82%' }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.4 }}
              className="absolute top-0 left-0 h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #8A3B14, #C8951E, #F3E5AB)' }}
            />
          </div>
          <div className="flex justify-between mt-3 text-[10px] font-bold">
            <span className="text-[#C8951E]">En cours (82%)</span>
            <span className="text-white/40">+3.2M restants</span>
          </div>
        </motion.div>

        {/* Top Praticienne */}
        <motion.div variants={itemVariants} className="rounded-3xl border border-white/5 bg-[#1A1410] p-5 sm:p-6 flex items-center gap-4 sm:gap-5 shadow-lg">
          <div className="relative shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#C8951E] to-[#8A3B14] p-[2px]">
              <div className="w-full h-full rounded-2xl bg-[#1A1410] flex items-center justify-center overflow-hidden relative">
                <span className="text-xl sm:text-2xl font-display font-bold text-[#C8951E]">F</span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              </div>
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg border border-[#0F0A05]">
              TOP 1
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-mono text-[#C8951E] uppercase tracking-wider mb-1 truncate font-bold">Praticienne du mois</div>
            <div className="text-base sm:text-lg font-display font-black text-white leading-tight truncate">Fatou Sylla</div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 text-[10px] sm:text-[11px] text-white/60">
              <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-[#4CAF6E]" /> 2.4M FCFA</span>
              <span className="flex items-center gap-1"><Scissors className="w-3.5 h-3.5 text-[#4E9FD1]" /> 124 Soins</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── BOTTOM ROW (PROCHAINS RDV & ACTIVITÉ) ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
      >
        {/* Prochains RDV */}
        <motion.div variants={itemVariants} className="rounded-3xl border border-white/5 bg-[#1A1410] overflow-hidden shadow-lg">
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-[#C8951E]/15 flex items-center justify-center">
                <CalendarCheck className="w-3.5 h-3.5 text-[#C8951E]" />
              </div>
              <span className="font-display font-bold text-sm text-white">Prochains RDV Cabine</span>
            </div>
            <Link href="/agenda">
              <button className="flex items-center gap-1 text-[10px] font-semibold text-[#C8951E] hover:text-[#D4AF37] transition-colors cursor-pointer">
                Agenda <ArrowRight className="w-3 h-3" />
              </button>
            </Link>
          </div>
          <div className="p-3 sm:p-5 space-y-2">
            {[
              { time: '09:00', client: 'Fatoumata K.', service: 'Soin Karité Profond', phototype: 'V' },
              { time: '10:30', client: 'Aminata D.', service: 'Peeling Doux AHA', phototype: 'VI' },
              { time: '14:00', client: 'Mariama B.', service: 'Massage Baobab', phototype: 'V' },
            ].map((rdv, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl hover:bg-white/5 transition-colors">
                <div className="text-[10px] font-mono text-[#C8951E] w-10 shrink-0 font-bold">{rdv.time}</div>
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#C8951E]/20 to-[#8A3B14]/20 flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-[#C8951E]">{rdv.client.charAt(0)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-white truncate">{rdv.client}</div>
                  <div className="text-[10px] text-white/40 truncate">{rdv.service}</div>
                </div>
                <div className="text-[8px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full shrink-0 font-mono font-bold">
                  Phototype {rdv.phototype}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activity feed */}
        <motion.div variants={itemVariants} className="rounded-3xl border border-white/5 bg-[#1A1410] overflow-hidden shadow-lg">
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-[#4CAF6E]/15 flex items-center justify-center">
                <Activity className="w-3.5 h-3.5 text-[#4CAF6E]" />
              </div>
              <span className="font-display font-bold text-sm text-white">Activité Récente</span>
            </div>
            <Link href="/pos">
              <button className="flex items-center gap-1 text-[10px] font-semibold text-[#C8951E] hover:text-[#D4AF37] transition-colors cursor-pointer">
                Ouvrir POS <ArrowRight className="w-3 h-3" />
              </button>
            </Link>
          </div>
          <div className="p-3 sm:p-5 space-y-2">
            {[
              { label: 'Encaissement Soin Visage', amount: '18 500 FCFA (Wave)', time: '12 min', icon: '💰' },
              { label: 'Nouveau client inscrit', amount: 'Awa S. — Type VI', time: '35 min', icon: '👤' },
              { label: 'Ordre Labo Préparé', amount: 'LOT-2024-ABJ-042', time: '1h', icon: '🧪' },
              { label: 'Avis 5 étoiles reçu', amount: '"Service exceptionnel"', time: '3h', icon: '⭐' },
            ].map((event, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl hover:bg-white/5 transition-colors">
                <div className="w-7 h-7 rounded-xl bg-white/5 flex items-center justify-center shrink-0 text-sm">
                  {event.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-white/90 truncate">{event.label}</div>
                  <div className="text-[10px] text-white/40 truncate">{event.amount}</div>
                </div>
                <div className="text-[9px] text-white/30 shrink-0 font-mono">{event.time}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* ── QUICK LINKS MODULE GRID ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className="mb-3">
          <h2 className="font-display font-bold text-white/50 text-[10px] sm:text-xs uppercase tracking-[0.2em]">
            Tous les Modules Actifs
          </h2>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { label: 'Labo Sur-Mesure', href: '/lab', icon: '🧪', desc: 'Formulation en institut', color: '#C8951E' },
            { label: 'Diagnostic IA Peau', href: '/diagnoses', icon: '🔬', desc: 'Analyse phototype IA', color: '#4E9FD1' },
            { label: 'Marketing WhatsApp', href: '/marketing', icon: '💬', desc: 'Campagnes & fidélité', color: '#4CAF6E' },
            { label: 'Paie & CNPS', href: '/rh', icon: '📋', desc: 'Fiches de paie OHADA', color: '#E07A2B' },
            { label: 'Avis & Réputation', href: '/reviews', icon: '⭐', desc: 'Google & Tripadvisor', color: '#F3E5AB' },
            { label: 'Comptabilité', href: '/compta', icon: '📊', desc: 'SYSCOHADA · UEMOA', color: '#8A3B14' },
            { label: 'Signature Tactile', href: '/clients/signature', icon: '✍️', desc: 'Consentement client', color: '#6B46C1' },
            { label: 'Services & Tarifs', href: '/services', icon: '✂️', desc: 'Catalogue de soins', color: '#5A1E2E' },
          ].map((mod, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Link href={mod.href}>
                <div className="group p-3.5 sm:p-4 rounded-2xl border border-white/5 bg-[#1A1410] hover:border-[#C8951E]/40 hover:bg-[#1F1810] transition-all duration-200 cursor-pointer h-full shadow-md">
                  <div className="text-xl sm:text-2xl mb-2 sm:mb-3">{mod.icon}</div>
                  <div className="text-[11px] font-bold text-white mb-0.5 leading-tight truncate">{mod.label}</div>
                  <div className="text-[9px] text-white/40 truncate">{mod.desc}</div>
                  <div
                    className="mt-2.5 h-0.5 rounded-full w-6 transition-all duration-300 group-hover:w-full"
                    style={{ background: mod.color }}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── MOBILE STICKY FLOATING ACTION BAR (ONLY VISIBLE ON PHONES < 768px) ── */}
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
