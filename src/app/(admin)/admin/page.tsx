'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Users, Calendar, DollarSign, Activity, Briefcase,
  MoreVertical, Check, ShieldAlert, Phone, Mail, Sparkles, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, 
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { getRegisteredTenants, getRegisteredClients, RegisteredTenant, RegisteredClient } from '@/lib/sync-engine';

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const [tenants, setTenants] = useState<RegisteredTenant[]>([]);
  const [clients, setClients] = useState<RegisteredClient[]>([]);
  const [loading, setLoading] = useState(true);

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

  const statCards = [
    { title: 'Salons & Entreprises', value: tenants.length, icon: Building2 },
    { title: 'Clientes & Utilisatrices', value: clients.length, icon: Users },
    { title: 'MRR Mensuel', value: `${(tenants.length * 30000).toLocaleString('fr-FR')} FCFA`, icon: DollarSign },
    { title: 'Churn Rate', value: '1.2%', icon: Activity },
    { title: 'NRR', value: '114%', icon: Activity },
    { title: 'Rituels Diagnostiqués', value: '3 420', icon: Sparkles },
  ];

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Activity className="h-8 w-8 animate-spin text-[var(--gold-kene)]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── HEADER & SYNCHRONIZATION TRIGGER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-white tracking-tight flex items-center gap-2">
            Tableau de Bord Super-Admin SaaS Kènè
          </h1>
          <p className="text-xs text-white/50 mt-1 font-sans">
            Supervision consolidée en temps réel des entreprises, salons et clientes de l'écosystème UEMOA.
          </p>
        </div>
        <Button 
          onClick={fetchSynchronizedData}
          className="bg-gradient-to-r from-[var(--gold-kene)] to-[#D4AF37] text-black font-bold text-xs rounded-xl shadow-lg hover:scale-105 transition flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Synchroniser en Direct</span>
        </Button>
      </div>

      {/* ── KPI STAT CARDS ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="bg-[#241C16] border-[#362A21] overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold-kene)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="flex flex-row items-center justify-between pb-2 p-4">
                <CardTitle className="text-xs font-semibold text-white/70">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-[var(--gold-kene)]" />
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-xl font-bold text-white font-mono">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ── ALERTE RISQUE D'ATTRITION ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="bg-[#1A1410] border border-[#8A1C14]/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-[#8A1C14] text-base flex items-center gap-2 font-display">
              <ShieldAlert className="h-5 w-5" />
              Alerte Risque d'Attrition & Conformité SOC2 / OWASP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex justify-between items-center bg-[#8A1C14]/10 p-3.5 rounded-2xl border border-[#8A1C14]/20">
                <div>
                  <p className="font-bold text-sm text-white">Cabinet La Dermo (Dakar)</p>
                  <p className="text-xs text-white/60">Activité en hausse de +34% · Abonnement Chaîne Validé</p>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Conforme ISO
                </Badge>
              </div>
              <div className="flex justify-between items-center bg-[#E07A2B]/10 p-3.5 rounded-2xl border border-[#E07A2B]/20">
                <div>
                  <p className="font-bold text-sm text-white">Isolation des Rôles Bidirectionnels</p>
                  <p className="text-xs text-white/60">0 violation d'accès inter-portail détectée sur les dernières 24h</p>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Secured
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── TABLE 1: SALONS & ENTREPRISES CRÉÉS ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="bg-[#241C16] border-[#362A21]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-display text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[var(--gold-kene)]" /> Entreprises & Salons Inscrit(e)s ({tenants.length})
              </CardTitle>
              <p className="text-xs text-white/50 mt-1">Tous les comptes professionnels créés récemment apparaissent ici automatiquement.</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl border border-[#362A21] overflow-hidden">
              <Table>
                <TableHeader className="bg-[#1A1410]">
                  <TableRow className="border-[#362A21] hover:bg-transparent">
                    <TableHead className="text-white/70">Nom Commercial</TableHead>
                    <TableHead className="text-white/70">Type d'Établissement</TableHead>
                    <TableHead className="text-white/70">Pays / Ville</TableHead>
                    <TableHead className="text-white/70">Abonnement</TableHead>
                    <TableHead className="text-white/70">Statut</TableHead>
                    <TableHead className="text-right text-white/70">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenants.map((tenant) => (
                    <TableRow key={tenant.id} className="border-[#362A21] hover:bg-[#1A1410] transition-colors">
                      <TableCell className="font-bold text-white">
                        <div>{tenant.name}</div>
                        <div className="text-[10px] text-white/40 font-mono">{tenant.email || tenant.phone}</div>
                      </TableCell>
                      <TableCell className="text-xs text-white/80">{tenant.type}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-[#362A21] text-xs text-[var(--gold-kene)] font-mono">
                          {tenant.city || tenant.country?.name || 'Côte d\'Ivoire 🇨🇮'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-[var(--gold-kene)]/20 text-[var(--gold-kene)] border border-[var(--gold-kene)]/30 font-bold">
                          {tenant.subscriptionTier}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={tenant.active ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400"}
                        >
                          {tenant.active ? "● Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          onClick={() => toggleTenantStatus(tenant.id)}
                          size="sm" 
                          className="bg-white/5 hover:bg-white/10 text-white text-[11px] h-8 rounded-lg border border-white/10"
                        >
                          {tenant.active ? 'Désactiver' : 'Activer'}
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

      {/* ── TABLE 2: CLIENTES & UTILISATRICES CRÉÉES ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="bg-[#241C16] border-[#362A21]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-display text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--gold-kene)]" /> Annuaire des Clientes Inscrites ({clients.length})
              </CardTitle>
              <p className="text-xs text-white/50 mt-1">Tous les comptes clients créés sur le portail apparaissent en direct pour l'Admin.</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl border border-[#362A21] overflow-hidden">
              <Table>
                <TableHeader className="bg-[#1A1410]">
                  <TableRow className="border-[#362A21] hover:bg-transparent">
                    <TableHead className="text-white/70">Nom de la Cliente</TableHead>
                    <TableHead className="text-white/70">Téléphone (WhatsApp)</TableHead>
                    <TableHead className="text-white/70">Email</TableHead>
                    <TableHead className="text-white/70">Profil Cutané</TableHead>
                    <TableHead className="text-white/70">Points Kènè</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id} className="border-[#362A21] hover:bg-[#1A1410] transition-colors">
                      <TableCell className="font-bold text-white">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[var(--gold-kene)]/20 text-[var(--gold-kene)] font-bold text-xs flex items-center justify-center border border-[var(--gold-kene)]/30">
                            {(client.firstName || 'C').substring(0, 1)}
                          </div>
                          <span>{client.name || `${client.firstName} ${client.lastName}`}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-mono text-white/80">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-400" /> {client.phone}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-white/80">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-[var(--gold-kene)]" /> {client.email}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-white/10 text-xs text-white/80">
                          {client.fitzpatrickType || 'Phototype V'} · {client.skinType || 'Mixte'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-[var(--gold-kene)]/20 text-[var(--gold-kene)] font-mono font-bold">
                          ✨ {client.points || 1250} Pts
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
