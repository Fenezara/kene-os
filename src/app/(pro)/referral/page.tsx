'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Users, HandCoins, Activity, Share2, UserPlus, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ReferralStats {
  totalReferred: number;
  totalEarned: number;
  activeClients: number;
}

interface Referral {
  id: string;
  clientName: string;
  date: string;
  status: 'active' | 'pending';
  cashback: number;
}

export default function ReferralPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/tenant/referral');
        const data = await res.json();
        if (data.success) {
          setReferralCode(data.referralCode);
          setStats(data.stats);
          setReferrals(data.referrals);
        }
      } catch (error) {
        toast({ title: "❌ Erreur", description: "Impossible de charger les données de parrainage.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast({ title: "✅ Copié", description: "Code de parrainage copié dans le presse-papier." });
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-2 border-[#C8951E] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-white min-h-full max-w-5xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-display font-bold text-white tracking-tight">
          Programme de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] to-[#C8951E]">Parrainage</span>
        </h1>
        <p className="text-white/60 mt-2">Développez votre clientèle grâce au bouche-à-oreille récompensé.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Code de Parrainage Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 relative overflow-hidden bg-[#0F0A05] rounded-3xl border border-[#C8951E]/30 p-8 shadow-2xl flex flex-col justify-center items-center text-center"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#C8951E]/20 to-transparent blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#C8951E]/10 to-transparent blur-3xl rounded-full" />
          
          <h2 className="text-xl font-display font-semibold text-white/80 z-10 mb-6">Votre Code de Parrainage</h2>
          
          <div className="relative z-10 w-full max-w-md">
            <div className="flex items-center justify-between bg-white/5 border border-[#C8951E]/50 rounded-2xl p-4 pl-6 overflow-hidden group">
              <span className="font-mono text-3xl font-bold tracking-widest text-[#F3E5AB]">
                {referralCode}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="p-3 rounded-xl bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] flex-shrink-0 ml-4 shadow-lg"
              >
                {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
          <p className="mt-6 text-sm text-white/50 z-10 max-w-sm">
            Partagez ce code avec vos clientes. Lorsqu'une amie s'inscrit, vous gagnez toutes les deux du cashback !
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          <Card className="bg-[#1A1410] border-white/5 rounded-3xl overflow-hidden flex-1 flex flex-col justify-center">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#4E9FD1]/10 flex items-center justify-center text-[#4E9FD1]">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-white/60">Clients parrainés</p>
                <p className="text-2xl font-bold text-white">{stats?.totalReferred}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1A1410] border-white/5 rounded-3xl overflow-hidden flex-1 flex flex-col justify-center">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#C8951E]/10 flex items-center justify-center text-[#C8951E]">
                <HandCoins className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-white/60">Générés (FCFA)</p>
                <p className="text-2xl font-bold text-white">{stats?.totalEarned.toLocaleString('fr-FR')}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1410] border-white/5 rounded-3xl overflow-hidden flex-1 flex flex-col justify-center">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#4CAF6E]/10 flex items-center justify-center text-[#4CAF6E]">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-white/60">Clientes actives</p>
                <p className="text-2xl font-bold text-white">{stats?.activeClients}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Comment ça marche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12"
      >
        <h2 className="text-2xl font-display font-semibold text-white mb-6">Comment ça marche ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-white/5 -translate-y-1/2 z-0" />
          
          <div className="bg-[#1A1410] border border-white/5 rounded-3xl p-6 relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#0F0A05] border border-white/10 flex items-center justify-center mb-4 shadow-lg">
              <Share2 className="w-8 h-8 text-[#C8951E]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">1. Partagez le code</h3>
            <p className="text-sm text-white/60">Donnez votre code unique à vos clientes actuelles.</p>
          </div>

          <div className="bg-[#1A1410] border border-white/5 rounded-3xl p-6 relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#0F0A05] border border-white/10 flex items-center justify-center mb-4 shadow-lg">
              <UserPlus className="w-8 h-8 text-[#C8951E]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">2. Inscription</h3>
            <p className="text-sm text-white/60">Leur amie s'inscrit ou réserve avec le code Kènè.</p>
          </div>

          <div className="bg-[#1A1410] border border-white/5 rounded-3xl p-6 relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#0F0A05] border border-white/10 flex items-center justify-center mb-4 shadow-lg">
              <Gift className="w-8 h-8 text-[#C8951E]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">3. Récompense</h3>
            <p className="text-sm text-white/60">Vous recevez toutes les deux du cashback crédité !</p>
          </div>
        </div>
      </motion.div>

      {/* Liste des parrainages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12"
      >
        <h2 className="text-2xl font-display font-semibold text-white mb-6">Liste des parrainages</h2>
        <div className="bg-[#1A1410] border border-white/5 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-white/60 text-sm">
                  <th className="py-4 px-6 font-medium">Cliente</th>
                  <th className="py-4 px-6 font-medium">Date</th>
                  <th className="py-4 px-6 font-medium">Statut</th>
                  <th className="py-4 px-6 font-medium text-right">Cashback</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((ref) => (
                  <tr key={ref.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 font-medium text-white">{ref.clientName}</td>
                    <td className="py-4 px-6 text-white/60">
                      {new Date(ref.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    <td className="py-4 px-6">
                      <Badge className={ref.status === 'active' ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" : "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"}>
                        {ref.status === 'active' ? 'Actif' : 'En attente'}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right font-semibold text-[#C8951E]">
                      {ref.cashback > 0 ? `+${ref.cashback.toLocaleString('fr-FR')} FCFA` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
