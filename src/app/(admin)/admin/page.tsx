'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Users, Calendar, DollarSign, Activity, Briefcase,
  MoreVertical, Check, ShieldAlert
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, 
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface Stats {
  tenants: number;
  users: number;
  appointments: number;
  revenue: number;
  diagnoses: number;
  employees: number;
}

interface Tenant {
  id: string;
  name: string;
  type: string;
  country: { code: string; name: string };
  subscriptionTier: string;
  subscriptionStatus: string;
  active: boolean;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const [stats, setStats] = useState<Stats | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, tenantsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/tenants')
      ]);
      const statsData = await statsRes.json();
      const tenantsData = await tenantsRes.json();
      
      if (statsData.success) setStats(statsData.stats);
      if (tenantsData.success) setTenants(tenantsData.tenants);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateTenant = async (tenantId: string, updates: any) => {
    try {
      const res = await fetch('/api/admin/tenants', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, ...updates })
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Succès", description: "Tenant mis à jour avec succès." });
        fetchData();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le tenant.",
        variant: "destructive"
      });
    }
  };

  const statCards = [
    { title: 'Tenants Actifs', value: stats?.tenants || 0, icon: Building2 },
    { title: 'MRR (Mensuel)', value: '4 500 000', icon: DollarSign },
    { title: 'ARR (Annuel)', value: '54 000 000', icon: DollarSign },
    { title: 'Churn Rate', value: '1.2%', icon: Activity },
    { title: 'NRR', value: '114%', icon: Activity },
    { title: 'LTV Moyen', value: '1 800 000', icon: Briefcase },
  ];

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Activity className="h-8 w-8 animate-spin text-[var(--gold-kene)]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8 text-white min-h-screen bg-[#1A1410]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">
            Administration <span className="text-[var(--gold-kene)]">Kènè</span>
          </h1>
          <p className="text-karite/80 mt-2">Vue globale de la plateforme et gestion des tenants.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/admin/marketplace">
            <motion.button 
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-4 py-2 rounded-xl border border-[#C8951E]/50 text-[#C8951E] hover:bg-[#C8951E]/10"
            >
              App Store
            </motion.button>
          </Link>
          <Link href="/admin/security">
            <motion.button 
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-4 py-2 rounded-xl border border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10"
            >
              Sécurité & Audit
            </motion.button>
          </Link>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-[#241C16] border-[#362A21] overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold-kene)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-karite/80">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-[var(--gold-kene)]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-[#1A1410] border border-[#8A1C14]/20">
          <CardHeader>
            <CardTitle className="text-[#8A1C14] flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" />
              Alerte Risque d'Attrition (Churn Warnings)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-[#8A1C14]/5 p-4 rounded-xl border border-[#8A1C14]/10">
                <div>
                  <p className="font-bold text-white">Salon Belle Dame (Dakar)</p>
                  <p className="text-sm text-karite/80">Activité en baisse de 40% sur les 30 derniers jours</p>
                </div>
                <Button variant="outline" className="border-[#8A1C14]/50 text-[#8A1C14] hover:bg-[#8A1C14]/10">
                  Contacter
                </Button>
              </div>
              <div className="flex justify-between items-center bg-[#E07A2B]/5 p-4 rounded-xl border border-[#E07A2B]/10">
                <div>
                  <p className="font-bold text-white">Espace Beauté (Abidjan)</p>
                  <p className="text-sm text-karite/80">Aucune connexion admin depuis 14 jours</p>
                </div>
                <Button variant="outline" className="border-[#E07A2B]/50 text-[#E07A2B] hover:bg-[#E07A2B]/10">
                  Vérifier
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-[#241C16] border-[#362A21]">
          <CardHeader>
            <CardTitle className="text-xl font-display">Liste des Tenants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-[#362A21]">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#362A21] hover:bg-transparent">
                    <TableHead className="text-karite/80">Nom</TableHead>
                    <TableHead className="text-karite/80">Type</TableHead>
                    <TableHead className="text-karite/80">Pays</TableHead>
                    <TableHead className="text-karite/80">Abonnement</TableHead>
                    <TableHead className="text-karite/80">Statut</TableHead>
                    <TableHead className="text-right text-karite/80">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenants.map((tenant) => (
                    <TableRow key={tenant.id} className="border-[#362A21] hover:bg-[#2A211A] transition-colors">
                      <TableCell className="font-medium text-white">{tenant.name}</TableCell>
                      <TableCell className="capitalize text-karite">{tenant.type}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-[#362A21] text-karite">
                          {tenant.country?.code || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-[var(--gold-kene)]/10 text-[var(--gold-kene)] hover:bg-[var(--gold-kene)]/20 capitalize">
                          {tenant.subscriptionTier}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={tenant.active ? "default" : "destructive"}
                          className={tenant.active ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" : ""}
                        >
                          {tenant.active ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-karite hover:text-white hover:bg-[#362A21]">
                              <span className="sr-only">Ouvrir le menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#241C16] border-[#362A21] text-white">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-[#362A21]" />
                            <DropdownMenuItem 
                              onClick={() => updateTenant(tenant.id, { active: !tenant.active })}
                              className="cursor-pointer hover:bg-[#362A21] focus:bg-[#362A21]"
                            >
                              {tenant.active ? 'Désactiver' : 'Activer'} le tenant
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[#362A21]" />
                            <DropdownMenuLabel className="text-xs text-karite/80">Changer l'abonnement</DropdownMenuLabel>
                            {['essentiel', 'pro', 'chaine'].map(tier => (
                              <DropdownMenuItem 
                                key={tier}
                                onClick={() => updateTenant(tenant.id, { subscriptionTier: tier })}
                                className="cursor-pointer capitalize hover:bg-[#362A21] focus:bg-[#362A21] flex items-center justify-between"
                              >
                                {tier}
                                {tenant.subscriptionTier === tier && <Check className="h-3 w-3 text-[var(--gold-kene)]" />}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {tenants.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-karite/60">
                        Aucun tenant trouvé
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
