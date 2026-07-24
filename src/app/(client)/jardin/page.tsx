'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, ArrowLeft, CheckCircle2, Sprout, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function JardinDuGlowPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [points, setPoints] = useState(450);
  const [redeemed, setRedeemed] = useState<string[]>([]);

  useEffect(() => {
    const storedPoints = localStorage.getItem('kene_points');
    if (storedPoints) {
      setPoints(parseInt(storedPoints));
    }
  }, []);

  const rewards = [
    { id: 'reward-1', title: 'Sérum Moringa Bio 30ml Offert', cost: 300, desc: 'Flacon sur-mesure détoxifiant et sébo-régulateur.' },
    { id: 'reward-2', title: 'Bon d’Achat 5 000 FCFA', cost: 500, desc: 'Valable sur l’ensemble des soins en salon et boutique.' },
    { id: 'reward-3', title: 'Soin Peeling Doux Hibiscus Offert', cost: 800, desc: 'Séance de 45min avec gommage aux acides AHA.' },
  ];

  const handleRedeem = (reward: any) => {
    if (points < reward.cost) {
      toast({
        title: "⚠️ Points insuffisants",
        description: `Il vous manque ${reward.cost - points} graines de Baobab.`,
        variant: "destructive"
      });
      return;
    }

    const newPoints = points - reward.cost;
    setPoints(newPoints);
    localStorage.setItem('kene_points', String(newPoints));
    setRedeemed([...redeemed, reward.id]);

    toast({
      title: "🎉 Récompense Débloquée !",
      description: `Vous avez obtenu "${reward.title}". Code QR ajouté à vos bons.`,
    });
  };

  const treeStage = points < 300 ? 1 : points < 700 ? 2 : 3;

  return (
    <div className="p-6 space-y-8 text-white min-h-screen bg-[#0F0A05]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/portal')}
          className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white hover:bg-white/10 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-display font-bold text-[var(--gold-kene)]">Jardin du Glow</h1>
        <div className="w-10 h-10" />
      </div>

      {/* Baobab Tree Interactive Stage Visualizer */}
      <Card className="bg-[#1A1410] border border-[var(--gold-kene)]/30 text-white rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--gold-kene)]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col items-center text-center space-y-4">
          <Badge className="bg-[var(--gold-kene)]/10 text-[var(--gold-kene)] border border-[var(--gold-kene)]/20 px-3 py-1 font-mono">
            {points} Graines de Baobab Collectées
          </Badge>

          {/* Animated Baobab Illustration */}
          <div className="relative w-40 h-44 my-2 flex items-center justify-center">
            <motion.div
              key={treeStage}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center"
            >
              {treeStage === 1 && (
                <div className="flex flex-col items-center space-y-2">
                  <Sprout className="w-20 h-20 text-emerald-400 animate-pulse" />
                  <span className="text-xs text-karite/60 font-sans">Stade 1 : Pousse de Baobab</span>
                </div>
              )}

              {treeStage === 2 && (
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-24 h-24 rounded-full bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center relative">
                    <Sprout className="w-16 h-16 text-[var(--gold-kene)]" />
                    <Sparkles className="w-5 h-5 text-amber-300 absolute top-2 right-2 animate-bounce" />
                  </div>
                  <span className="text-xs text-[var(--gold-kene)] font-semibold font-sans">Stade 2 : Jeune Baobab Fort</span>
                </div>
              )}

              {treeStage === 3 && (
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[var(--gold-kene)]/20 to-amber-500/10 border-2 border-[var(--gold-kene)] flex items-center justify-center relative shadow-xl">
                    <Award className="w-16 h-16 text-[var(--gold-kene)] animate-spin-slow" />
                    <Sparkles className="w-6 h-6 text-amber-200 absolute top-1 right-1 animate-ping" />
                  </div>
                  <span className="text-xs text-amber-300 font-bold font-sans">Stade 3 : Baobab Majestueux en Fleurs</span>
                </div>
              )}
            </motion.div>
          </div>

          <p className="text-xs text-karite/80 max-w-sm leading-relaxed">
            Chaque soin effectué et chaque achat de cosmétique fait grandir votre Baobab personnel et débloque des cadeaux exclusifs Kènè.
          </p>
        </div>
      </Card>

      {/* Rewards Catalog */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--gold-kene)] font-display flex items-center gap-2">
          <Gift className="w-4 h-4" /> Catalogue des Récompenses Kènè
        </h3>

        <div className="space-y-3">
          {rewards.map((rw) => {
            const isClaimed = redeemed.includes(rw.id);
            const canClaim = points >= rw.cost;

            return (
              <Card key={rw.id} className="bg-[#1A1410] border-[#362A21] text-white p-4 rounded-2xl flex justify-between items-center">
                <div className="space-y-1 pr-4">
                  <h4 className="font-bold text-sm text-white">{rw.title}</h4>
                  <p className="text-xs text-karite/60 leading-tight">{rw.desc}</p>
                  <span className="text-[10px] font-mono text-[var(--gold-kene)] block font-semibold pt-1">
                    Coût : {rw.cost} graines
                  </span>
                </div>

                {isClaimed ? (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 flex items-center gap-1 text-[10px] shrink-0">
                    <CheckCircle2 className="w-3 h-3" /> Obtenu
                  </Badge>
                ) : (
                  <Button
                    onClick={() => handleRedeem(rw)}
                    disabled={!canClaim}
                    className={`text-xs font-bold shrink-0 ${
                      canClaim
                        ? 'bg-[var(--gold-kene)] text-[#1A1410] hover:bg-[#D4AF37]/90'
                        : 'bg-white/5 text-white/40 border border-white/10'
                    }`}
                  >
                    Échanger
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
