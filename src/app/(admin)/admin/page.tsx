'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Users, Calendar, DollarSign, Activity, Briefcase,
  MoreVertical, Check, ShieldAlert, Phone, Mail, Award, RefreshCw,
  TrendingUp, Globe, Store, FileText, Download, Printer, Search,
  Filter, ShieldCheck, Zap, AlertCircle, Eye, ArrowUpRight, Cpu, Sprout, ShoppingBag, Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, 
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog';

import { getRegisteredTenants, getRegisteredClients, deleteTenant, deleteClient, RegisteredTenant, RegisteredClient } from '@/lib/sync-engine';

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const [tenants, setTenants] = useState<RegisteredTenant[]>([]);
  const [clients, setClients] = useState<RegisteredClient[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('ALL');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'tenants' | 'clients' | 'analytics' | 'security'>('tenants');

  // AI MRR Projection Slider State
  const [projectedSalons, setProjectedSalons] = useState(25);

  // Impersonate / Support Modal State
  const [selectedImpersonateTenant, setSelectedImpersonateTenant] = useState<RegisteredTenant | null>(null);

  const fetchSynchronizedData = () => {
    setLoading(true);
    try {
      const liveTenants = getRegisteredTenants();
      const liveClients = getRegisteredClients();

      setTenants(liveTenants);
      setClients(liveClients);
    } catch {
      toast({
        title: "Erreur de synchronisation",
        description: "Impossible de charger les données synchronisées.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSynchronizedData();
  }, []);

  const toggleTenantStatus = (tenantId: string) => {
    const updated = tenants.map(t => t.id === tenantId ? { ...t, active: !t.active } : t);
    setTenants(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kene_all_tenants', JSON.stringify(updated));
    }
    toast({ title: "Succès", description: "Statut de l'entreprise mis à jour avec succès." });
  };

  const updateTenantTier = (tenantId: string, newTier: string) => {
    const updated = tenants.map(t => t.id === tenantId ? { ...t, subscriptionTier: newTier } : t);
    setTenants(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kene_all_tenants', JSON.stringify(updated));
    }
    toast({ title: "Formule mise à jour", description: `Abonnement passé en formule "${newTier}".` });
  };

  const handleDeleteTenant = (tenantId: string, tenantName: string) => {
    if (confirm(`⚠️ ATTENTION SUPER-ADMIN :\n\nVoulez-vous vraiment SUPPRIMER DÉFINITIVEMENT le salon "${tenantName}" ?\nCette action supprimera toutes ses données et accès.`)) {
      const updated = deleteTenant(tenantId);
      setTenants(updated);
      toast({
        title: "🗑️ Salon Supprimé",
        description: `Le salon "${tenantName}" a été définitivement supprimé.`,
        variant: "destructive"
      });
    }
  };

  const handleDeleteClient = (clientId: string, clientName: string) => {
    if (confirm(`⚠️ ATTENTION SUPER-ADMIN :\n\nVoulez-vous vraiment SUPPRIMER le compte de la cliente "${clientName}" ?`)) {
      const updated = deleteClient(clientId);
      setClients(updated);
      toast({
        title: "🗑️ Compte Client Supprimé",
        description: `Le compte de "${clientName}" a été supprimé.`,
        variant: "destructive"
      });
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Nom Commercial', 'Type', 'Ville/Pays', 'Abonnement', 'Statut', 'Email'];
    const rows = tenants.map(t => [t.id, t.name, t.type, t.city || 'UEMOA', t.subscriptionTier, t.active ? 'Actif' : 'Inactif', t.email || 'N/A']);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kene_rapport_super_admin_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "📥 Export CSV Réussi",
      description: "Le rapport consolidé des entreprises Kènè OS a été téléchargé.",
    });
  };

  // Filtered lists
  const filteredTenants = tenants.filter(t => {
    const matchesSearch = (t.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (t.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (t.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = countryFilter === 'ALL' || (t.city || '').includes(countryFilter) || (t.country?.code === countryFilter);
    const matchesTier = tierFilter === 'ALL' || t.subscriptionTier.toLowerCase() === tierFilter.toLowerCase();
    return matchesSearch && matchesCountry && matchesTier;
  });

  const filteredClients = clients.filter(c => {
    const matchesSearch = (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.phone || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Calculate MRR Metrics
  const currentMRR = tenants.reduce((acc, t) => {
    if (!t.active) return acc;
    if (t.subscriptionTier === 'Chaîne') return acc + 75000;
    if (t.subscriptionTier === 'Pro') return acc + 30000;
    return acc + 15000;
  }, 0);

  const projectedMRR = projectedSalons * 35000;
  const projectedARR = projectedMRR * 12;

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Activity className="h-8 w-8 animate-spin text-[var(--gold-kene)]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* ── TOP EXECUTIVE BANNER & GLOBAL CONTROLS ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-gradient-to-r from-[#1A1410] via-[#241C16] to-[#1A1410] p-6 rounded-3xl border border-[var(--gold-kene)]/30 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[var(--gold-kene)]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-[var(--gold-kene)] text-black font-black text-[10px] uppercase tracking-widest px-2.5 py-0.5">
              👑 PC de Commandement Super-Admin Kènè OS
            </Badge>
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-[10px] font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Nœuds UEMOA En Ligne (CI 🇨🇮 · SN 🇸🇳 · ML 🇲🇱 · BF 🇧🇫 · TG 🇹🇬 · BJ 🇧🇯)
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
            Gouvernance SaaS & Intelligence Beauté Africaine
          </h1>
          <p className="text-xs text-white/60 max-w-2xl">
            Supervision consolidée des abonnements salons, annuaire des clientes, rituels botaniques et conformité fiscale SYSCOHADA.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap relative z-10 shrink-0">
          <Link href="/admin/marketplace">
            <Button className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/10 flex items-center gap-1.5 cursor-pointer">
              <ShoppingBag className="w-3.5 h-3.5 text-[var(--gold-kene)]" />
              <span>App Store Addons</span>
            </Button>
          </Link>

          <Link href="/admin/security">
            <Button className="bg-red-950/40 hover:bg-red-900/60 text-red-200 font-bold text-xs rounded-xl border border-red-500/30 flex items-center gap-1.5 cursor-pointer">
              <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
              <span>Audit OWASP</span>
            </Button>
          </Link>

          <Button 
            onClick={handleExportCSV}
            className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/10 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </Button>

          <Button 
            onClick={fetchSynchronizedData}
            className="bg-gradient-to-r from-[var(--gold-kene)] via-[#D4AF37] to-[#FFD700] text-black font-black text-xs rounded-xl shadow-xl hover:scale-105 transition flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Direct</span>
          </Button>
        </div>
      </div>

      {/* ── KPI EXECUTIVE METRICS STRIP ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { title: 'Salons & Entreprises', val: tenants.length, icon: Building2, color: '#C8951E', subtitle: '100% Validés' },
          { title: 'Clientes Inscrites', val: clients.length, icon: Users, color: '#4E9FD1', subtitle: 'Base Synchronisée' },
          { title: 'MRR Recurrent', val: `${currentMRR.toLocaleString('fr-FR')} F`, icon: DollarSign, color: '#4CAF6E', subtitle: 'Abidjan & Dakar' },
          { title: 'Taux Rétention NRR', val: '114%', icon: TrendingUp, color: '#E07A2B', subtitle: 'Expansion Nette' },
          { title: 'Taux Churn Mensuel', val: '1.2%', icon: Activity, color: '#8A1C14', subtitle: 'Objectif < 2%' },
          { title: 'Prescriptions Botaniques', val: '3 420', icon: Sprout, color: '#F3E5AB', subtitle: 'Karité, Baobab, Bissap' },
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="bg-[#241C16] border-[#362A21] overflow-hidden relative group hover:border-[var(--gold-kene)]/40 transition-all">
              <CardContent className="p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">{stat.title}</span>
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
                <div className="text-xl font-display font-black text-white font-mono">{stat.val}</div>
                <div className="text-[9px] text-white/40 font-mono">{stat.subtitle}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ── INNOVATION 1: IA SENTINEL SIMULATEUR DE CROISSANCE & COHORTE ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="bg-[#1A1410] border border-[var(--gold-kene)]/30 overflow-hidden relative rounded-3xl shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-[var(--gold-kene)] to-purple-600" />
          <CardContent className="p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono mb-1">
                  🤖 Kènè Sentinel IA · Moteur de Simulation Cohorte
                </Badge>
                <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[var(--gold-kene)]" />
                  Simulateur d'Expansion MRR & Empreinte UEMOA
                </h3>
                <p className="text-xs text-white/60">
                  Ajustez le nombre de salons cibles pour calculer la projection de revenus récurrents et les volumes fiscaux collectés.
                </p>
              </div>
              <div className="bg-[#241C16] border border-white/10 p-3 rounded-2xl text-right shrink-0">
                <div className="text-[10px] text-white/50 uppercase font-mono">Projection MRR Estimée</div>
                <div className="text-xl font-mono font-bold text-[var(--gold-kene)]">
                  {projectedMRR.toLocaleString('fr-FR')} FCFA /mois
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">
                  ARR : {projectedARR.toLocaleString('fr-FR')} FCFA
                </div>
              </div>
            </div>

            {/* SLIDER CONTROL */}
            <div className="bg-[#241C16] p-4 rounded-2xl border border-white/10 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/80 font-bold flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-[var(--gold-kene)]" /> Nombre de Salons Partenaires Actifs :
                </span>
                <span className="font-mono text-base font-black text-[var(--gold-kene)] bg-[var(--gold-kene)]/10 px-3 py-1 rounded-xl border border-[var(--gold-kene)]/30">
                  {projectedSalons} Salons
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="250"
                step="5"
                value={projectedSalons}
                onChange={(e) => setProjectedSalons(Number(e.target.value))}
                className="w-full h-2 bg-[#0F0A05] rounded-lg appearance-none cursor-pointer accent-[var(--gold-kene)]"
              />
              <div className="flex justify-between text-[10px] text-white/40 font-mono">
                <span>5 Salons (Démarrage)</span>
                <span>50 Salons (Maturité CI/SN)</span>
                <span>150 Salons (Régional UEMOA)</span>
                <span>250 Salons (Scale Pan-Africain)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── SEARCH, FILTER & TAB CONTROLS ── */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#1A1410] p-4 rounded-2xl border border-white/10">
          
          {/* SEARCH INPUT */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-white/40" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, ville, téléphone, email..."
              className="pl-10 bg-[#241C16] border-white/10 text-white text-xs rounded-xl h-10 placeholder:text-white/30 focus:border-[var(--gold-kene)]"
            />
          </div>

          {/* FILTERS */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-xs text-white/60">
              <Filter className="w-3.5 h-3.5 text-[var(--gold-kene)]" />
              <span>Pays :</span>
            </div>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="bg-[#241C16] border border-white/10 text-white text-xs rounded-xl px-3 py-2 cursor-pointer outline-none focus:border-[var(--gold-kene)]"
            >
              <option value="ALL" className="bg-[#1A1410] text-white py-1">Tous les Pays UEMOA</option>
              <option value="CI" className="bg-[#1A1410] text-white py-1">🇨🇮 Côte d'Ivoire (Abidjan / Korhogo)</option>
              <option value="SN" className="bg-[#1A1410] text-white py-1">🇸🇳 Sénégal (Dakar / Saint-Louis)</option>
              <option value="ML" className="bg-[#1A1410] text-white py-1">🇲🇱 Mali (Bamako / Sikasso)</option>
            </select>

            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="bg-[#241C16] border border-white/10 text-white text-xs rounded-xl px-3 py-2 cursor-pointer outline-none focus:border-[var(--gold-kene)]"
            >
              <option value="ALL" className="bg-[#1A1410] text-white py-1">Toutes Formules</option>
              <option value="Essentiel" className="bg-[#1A1410] text-white py-1">Formule Essentiel</option>
              <option value="Pro" className="bg-[#1A1410] text-white py-1">Formule Pro</option>
              <option value="Chaîne" className="bg-[#1A1410] text-white py-1">Formule Chaîne Multi-Salons</option>
            </select>
          </div>
        </div>

        {/* TAB BUTTONS */}
        <div className="flex gap-2 border-b border-white/10 pb-2 overflow-x-auto">
          {[
            { id: 'tenants', label: `🏢 Salons & Entreprises (${filteredTenants.length})` },
            { id: 'clients', label: `👥 Annuaire Clientes (${filteredClients.length})` },
            { id: 'analytics', label: `📊 Répartition Rituels Botaniques` },
            { id: 'security', label: `🛡️ Journal de Sécurité SOC2 / OWASP` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[var(--gold-kene)] to-[#D4AF37] text-black shadow-lg font-black'
                  : 'bg-[#1A1410] text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB CONTENT 1: SALONS & ENTREPRISES ── */}
      {activeTab === 'tenants' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-[#241C16] border-[#362A21] overflow-hidden rounded-3xl shadow-xl">
            <CardHeader className="p-5 border-b border-white/5 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-display text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[var(--gold-kene)]" />
                  Répertoire Consolidé des Salons et Établissements BEAUTÉ ({filteredTenants.length})
                </CardTitle>
                <p className="text-xs text-white/50">
                  Tous les salons enregistrés sur Kènè OS. Vous pouvez gérer leur statut, mettre à niveau leur abonnement ou vous connecter en mode support.
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#1A1410]">
                    <TableRow className="border-[#362A21] hover:bg-transparent">
                      <TableHead className="text-white/70">Nom Commercial</TableHead>
                      <TableHead className="text-white/70">Type d'Établissement</TableHead>
                      <TableHead className="text-white/70">Ville & Pays</TableHead>
                      <TableHead className="text-white/70">Formule Abonnement</TableHead>
                      <TableHead className="text-white/70">Statut</TableHead>
                      <TableHead className="text-right text-white/70">Actions Super-Admin</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTenants.map((tenant) => (
                      <TableRow key={tenant.id} className="border-[#362A21] hover:bg-[#1A1410] transition-colors">
                        <TableCell className="font-bold text-white">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-[var(--gold-kene)]/10 border border-[var(--gold-kene)]/30 flex items-center justify-center text-sm font-display text-[var(--gold-kene)] shrink-0">
                              {tenant.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-white">{tenant.name}</div>
                              <div className="text-[10px] text-white/40 font-mono">{tenant.email || tenant.phone}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-white/80">{tenant.type}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-white/10 text-xs text-[var(--gold-kene)] font-mono">
                            {tenant.city || tenant.country?.name || 'Abidjan 🇨🇮'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-[var(--gold-kene)]/20 text-[var(--gold-kene)] border border-[var(--gold-kene)]/30 font-bold text-xs">
                            {tenant.subscriptionTier}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={tenant.active ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400"}>
                            {tenant.active ? "● Actif" : "Inactif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              onClick={() => setSelectedImpersonateTenant(tenant)}
                              size="sm"
                              className="bg-white/5 hover:bg-white/10 text-white text-[11px] h-8 rounded-lg border border-white/10 flex items-center gap-1 cursor-pointer"
                              title="Simuler la connexion gérant pour support technique"
                            >
                              <Eye className="w-3 h-3 text-[var(--gold-kene)]" />
                              <span>Support</span>
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 text-white/70 hover:text-white">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-[#1A1410] border-white/10 text-white rounded-2xl p-2">
                                <DropdownMenuLabel className="text-xs">Gouvernance Salon</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem onClick={() => toggleTenantStatus(tenant.id)} className="cursor-pointer">
                                  {tenant.active ? '🚫 Désactiver le Salon' : '✅ Activer le Salon'}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuLabel className="text-[10px] text-white/50">Mettre à jour Abonnement</DropdownMenuLabel>
                                {['Essentiel', 'Pro', 'Chaîne'].map(tier => (
                                  <DropdownMenuItem key={tier} onClick={() => updateTenantTier(tenant.id, tier)} className="cursor-pointer">
                                    Mettre en formule {tier}
                                  </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem onClick={() => handleDeleteTenant(tenant.id, tenant.name)} className="cursor-pointer text-red-400 hover:bg-red-950/40 focus:bg-red-950/40 font-bold flex items-center gap-1.5">
                                  <Trash2 className="w-3.5 h-3.5" /> Supprimer le Salon
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredTenants.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-white/40">
                          Aucun salon ne correspond à vos critères de recherche.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ── TAB CONTENT 2: ANNUAIRE CLIENTES ── */}
      {activeTab === 'clients' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-[#241C16] border-[#362A21] overflow-hidden rounded-3xl shadow-xl">
            <CardHeader className="p-5 border-b border-white/5">
              <CardTitle className="text-lg font-display text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--gold-kene)]" />
                Annuaire Global des Clientes & Utilisatrices du Portail ({filteredClients.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#1A1410]">
                    <TableRow className="border-[#362A21] hover:bg-transparent">
                      <TableHead className="text-white/70">Nom & Prénom</TableHead>
                      <TableHead className="text-white/70">Téléphone (WhatsApp)</TableHead>
                      <TableHead className="text-white/70">Adresse Email</TableHead>
                      <TableHead className="text-white/70">Profil Cutané Fitzpatrick</TableHead>
                      <TableHead className="text-white/70">Points Kènè</TableHead>
                      <TableHead className="text-right text-white/70">Action Admin</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id} className="border-[#362A21] hover:bg-[#1A1410] transition-colors">
                        <TableCell className="font-bold text-white">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[var(--gold-kene)]/20 text-[var(--gold-kene)] font-bold text-xs flex items-center justify-center border border-[var(--gold-kene)]/30">
                              {(client.firstName || 'C').substring(0, 1)}
                            </div>
                            <span>{client.name || `${client.firstName} ${client.lastName}`}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-mono text-white/80">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-emerald-400" /> {client.phone}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-white/80">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-[var(--gold-kene)]" /> {client.email}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-white/10 text-xs text-white/80">
                            {client.fitzpatrickType || 'Phototype V'} · {client.skinType || 'Mixte'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-[var(--gold-kene)]/20 text-[var(--gold-kene)] font-mono font-bold text-xs">
                            🌿 {client.points || 1250} Pts
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            onClick={() => handleDeleteClient(client.id, client.name || `${client.firstName} ${client.lastName}`)}
                            size="sm"
                            className="bg-red-950/40 hover:bg-red-900/60 text-red-300 text-[11px] h-7 rounded-lg border border-red-500/30 flex items-center gap-1 cursor-pointer ml-auto"
                          >
                            <Trash2 className="w-3 h-3 text-red-400" />
                            <span>Supprimer</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ── TAB CONTENT 3: RÉPARTITION RITUELS BOTANIQUES ── */}
      {activeTab === 'analytics' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-[#241C16] border-[#362A21] rounded-3xl p-5 space-y-4">
            <CardTitle className="text-base font-display text-white flex items-center gap-2">
              <Sprout className="w-5 h-5 text-[var(--gold-kene)]" />
              Top Ingrédients Prescrits par l'IA Kènè
            </CardTitle>
            <div className="space-y-3">
              {[
                { name: 'Beurre de Karité Brut (Korhogo 🇨🇮)', percent: 88, count: '1 240 prescriptions' },
                { name: 'Huile Pure de Baobab (Tambacounda 🇸🇳)', percent: 74, count: '980 prescriptions' },
                { name: 'Fleurs d\'Hibiscus / Bissap (Sikasso 🇲🇱)', percent: 62, count: '750 prescriptions' },
                { name: 'Poudre de Chébé Fortifiante (Sahel 🇹🇩)', percent: 55, count: '610 prescriptions' },
                { name: 'Gel d\'Aloe Vera Pur (Dakar 🇸🇳)', percent: 48, count: '420 prescriptions' },
              ].map((ing, i) => (
                <div key={i} className="space-y-1 bg-[#1A1410] p-3 rounded-2xl border border-white/5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-white">{ing.name}</span>
                    <span className="font-mono text-[var(--gold-kene)] font-bold">{ing.count}</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[var(--gold-kene)] to-[#D4AF37] rounded-full" style={{ width: `${ing.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-[#241C16] border-[#362A21] rounded-3xl p-5 space-y-4">
            <CardTitle className="text-base font-display text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-[var(--gold-kene)]" />
              Répartition des Phototypes Fitzpatrick
            </CardTitle>
            <div className="space-y-3">
              {[
                { type: 'Phototype V (Peau Noire Foncée)', share: '58%', desc: 'Sensibilité Hyperpigmentation PIH & Barrière Lipide' },
                { type: 'Phototype VI (Peau Profondément Mélanée)', share: '32%', desc: 'Besoin Nutrition Karité & Scellage Sécheresse' },
                { type: 'Phototype IV (Peau Métissée / Mate)', share: '10%', desc: 'Protection Solaire UV & Équilibre Sébum' },
              ].map((item, i) => (
                <div key={i} className="bg-[#1A1410] p-3.5 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-white">{item.type}</div>
                    <div className="text-[10px] text-white/50">{item.desc}</div>
                  </div>
                  <Badge className="bg-[var(--gold-kene)]/20 text-[var(--gold-kene)] font-mono font-bold text-xs">
                    {item.share}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* ── IMPERSONATE / SUPPORT MODAL ── */}
      <Dialog open={!!selectedImpersonateTenant} onOpenChange={(open) => !open && setSelectedImpersonateTenant(null)}>
        <DialogContent className="bg-[#0F0A05] border border-[var(--gold-kene)]/40 text-white rounded-3xl max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-lg text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-[var(--gold-kene)]" /> Mode Support Administrateur
            </DialogTitle>
            <DialogDescription className="text-xs text-white/60">
              Vous allez accéder à l'espace de gestion du salon <span className="font-bold text-white">{selectedImpersonateTenant?.name}</span> en mode diagnostic technique.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-[#1A1410] p-4 rounded-2xl border border-white/10 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-white/50">Nom Commercial :</span>
              <span className="font-bold text-white">{selectedImpersonateTenant?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Formule Abonnement :</span>
              <span className="font-mono text-[var(--gold-kene)] font-bold">{selectedImpersonateTenant?.subscriptionTier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Localisation :</span>
              <span className="font-mono text-white">{selectedImpersonateTenant?.city || 'Abidjan 🇨🇮'}</span>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button variant="outline" onClick={() => setSelectedImpersonateTenant(null)} className="border-white/10 text-white text-xs rounded-xl">
              Annuler
            </Button>
            <Button 
              onClick={() => {
                document.cookie = `kene-session=gerant-${Date.now()}; path=/; max-age=86400; SameSite=Lax`;
                toast({ title: "🔑 Connexion Support Activée", description: `Accès au tableau de bord de ${selectedImpersonateTenant?.name}` });
                window.location.href = '/dashboard';
              }}
              className="bg-gradient-to-r from-[var(--gold-kene)] to-[#D4AF37] text-black font-bold text-xs rounded-xl cursor-pointer"
            >
              Lancer la Session Support
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
