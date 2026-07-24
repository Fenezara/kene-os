'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, AlertTriangle, CheckCircle, Clock, ArrowLeft, Activity, Fingerprint } from 'lucide-react';
import Link from 'next/link';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function SecurityAuditPage() {
  const auditLogs = [
    { id: 1, timestamp: '2026-07-19 22:45', salon: 'Belle Dame Dakar', action: 'Export Données Clients', user: 'admin@belledame.sn', ip: '197.210.x.x', risk: 'Medium' },
    { id: 2, timestamp: '2026-07-19 21:10', salon: 'Espace Beauté', action: 'Connexion Réussie', user: 'gerant@espacebeaute.ci', ip: '154.120.x.x', risk: 'Low' },
    { id: 3, timestamp: '2026-07-19 18:30', salon: 'Système Kènè', action: 'Mise à jour Plan', user: 'superadmin@kene.pro', ip: '10.0.x.x', risk: 'High' },
    { id: 4, timestamp: '2026-07-19 15:22', salon: 'Onglerie Abidjan', action: 'Échec Connexion (x5)', user: 'inconnu', ip: '45.22.x.x', risk: 'High' },
    { id: 5, timestamp: '2026-07-19 14:05', salon: 'Afro Hair', action: 'Suppression Employé', user: 'rh@afrohair.sn', ip: '197.210.x.x', risk: 'Medium' },
  ];

  const posAnomalies = [
    { id: 1, salon: 'Belle Dame Dakar', type: 'Remise Manuelle Importante (>50%)', amount: '45 000 FCFA', user: 'Caissier 1', time: 'Aujourd\'hui 16:30' },
    { id: 2, salon: 'Afro Hair', type: 'Annulation Ticket après Encaissement', amount: '12 500 FCFA', user: 'Admin', time: 'Hier 19:45' },
  ];

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Low': return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">Faible</Badge>;
      case 'Medium': return <Badge className="bg-[#E07A2B]/10 text-[#E07A2B] hover:bg-[#E07A2B]/20">Moyen</Badge>;
      case 'High': return <Badge className="bg-[#8A1C14]/10 text-[#8A1C14] hover:bg-[#8A1C14]/20">Élevé</Badge>;
      default: return <Badge variant="outline">{risk}</Badge>;
    }
  };

  return (
    <div className="space-y-8 p-8 text-white min-h-screen bg-[#1A1410] max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link href="/admin" className="inline-flex items-center text-sm text-white/60 hover:text-emerald-500 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Retour au tableau de bord
        </Link>
        <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
          <Shield className="text-emerald-500" />
          Sécurité & <span className="text-emerald-500">Audit Log</span>
        </h1>
        <p className="text-karite/80 mt-2">Surveillance des activités, détection de fraude et conformité.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-[#241C16] border-[#362A21] h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="text-emerald-500 h-5 w-5" />
                Conformité & Data (SOC2 / UEMOA)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium">Chiffrement en Transit & Repos</span>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-500">Conforme</Badge>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <Fingerprint className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium">Loi CDP Sénégal (Données Personnelles)</span>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-500">Conforme</Badge>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-[#E07A2B]" />
                  <span className="text-sm font-medium">Audit Annuel SOC 2 Type II</span>
                </div>
                <Badge className="bg-[#E07A2B]/10 text-[#E07A2B]">En cours</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-[#1A1410] border border-[#8A1C14]/30 h-full">
            <CardHeader>
              <CardTitle className="text-lg text-[#8A1C14] flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Détection d'Anomalies Caisse (POS)
              </CardTitle>
              <CardDescription className="text-white/60">Flags automatiques pour fraude potentielle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {posAnomalies.map((anomaly) => (
                <div key={anomaly.id} className="p-3 rounded-lg bg-[#8A1C14]/5 border border-[#8A1C14]/20">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-bold text-white">{anomaly.type}</span>
                    <span className="text-sm font-bold text-[#8A1C14]">{anomaly.amount}</span>
                  </div>
                  <div className="flex justify-between text-xs text-white/60">
                    <span>{anomaly.salon} • {anomaly.user}</span>
                    <span>{anomaly.time}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="bg-[#241C16] border-[#362A21]">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-500" />
              Journal d'Audit Global
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-[#362A21] overflow-hidden">
              <Table>
                <TableHeader className="bg-[#1A1410]">
                  <TableRow className="border-[#362A21] hover:bg-transparent">
                    <TableHead className="text-karite/80">Date & Heure</TableHead>
                    <TableHead className="text-karite/80">Salon</TableHead>
                    <TableHead className="text-karite/80">Action</TableHead>
                    <TableHead className="text-karite/80">Utilisateur</TableHead>
                    <TableHead className="text-karite/80">Adresse IP</TableHead>
                    <TableHead className="text-right text-karite/80">Risque</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id} className="border-[#362A21] hover:bg-[#2A211A]">
                      <TableCell className="text-sm text-white/80 whitespace-nowrap">{log.timestamp}</TableCell>
                      <TableCell className="text-sm font-medium">{log.salon}</TableCell>
                      <TableCell className="text-sm text-white/80">{log.action}</TableCell>
                      <TableCell className="text-sm text-white/60">{log.user}</TableCell>
                      <TableCell className="text-sm text-white/60 font-mono text-xs">{log.ip}</TableCell>
                      <TableCell className="text-right">{getRiskBadge(log.risk)}</TableCell>
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
