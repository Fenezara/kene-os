'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Sparkles, Scissors, Check, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function HairDiagnosticPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [step, setStep] = useState<'capture' | 'analyzing' | 'results'>('capture');
  const [hairType, setHairType] = useState<'4A' | '4B' | '4C'>('4C');
  const [porosity, setPorosity] = useState<'Faible' | 'Moyenne' | 'Forte'>('Faible');

  const startScan = () => {
    setScanning(true);
    setStep('analyzing');

    setTimeout(() => {
      setStep('results');
      setScanning(false);
      toast({
        title: "✨ Analyse Capillaire Terminée !",
        description: "Votre profil de cheveux et votre porosité ont été calculés avec succès.",
      });
    }, 2500);
  };

  return (
    <div className="p-4 space-y-6 text-white min-h-screen bg-[#1A1410] max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Scissors className="w-6 h-6 text-[var(--gold-kene)]" />
            Scanner de Texture Capillaire 4A / 4B / 4C
          </h1>
          <p className="text-white/60 text-xs mt-1">Analyse IA de la porosité & santé du cuir chevelu crépu/frisé.</p>
        </div>
        <Badge className="bg-[var(--gold-kene)]/20 text-[var(--gold-kene)] border border-[var(--gold-kene)]/30 font-mono text-xs">
          v2.4 Afro-Hair AI
        </Badge>
      </motion.div>

      {/* Step 1: Capture */}
      {step === 'capture' && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="bg-[#241C16] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-28 h-28 mx-auto rounded-full bg-[var(--gold-kene)]/10 border-2 border-[var(--gold-kene)]/30 flex items-center justify-center relative group cursor-pointer" onClick={startScan}>
                <Camera className="w-12 h-12 text-[var(--gold-kene)] group-hover:scale-110 transition" />
                <div className="absolute inset-0 rounded-full border border-[var(--gold-kene)] animate-ping opacity-25" />
              </div>

              <div>
                <h3 className="text-lg font-display font-bold text-white">Prenez une photo de vos cheveux ou boucles</h3>
                <p className="text-xs text-white/50 max-w-md mx-auto mt-2">
                  Assurez-vous d'avoir un éclairage naturel et de montrer la racine ou les pointes de vos cheveux pour détecter la densité et la porosité.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-center text-xs text-white/70 max-w-lg mx-auto pt-2">
                <div className="p-3 bg-[#1A1410] border border-white/5 rounded-2xl">
                  <span className="text-lg block mb-1">➰</span>
                  <strong>Type 4A</strong>
                  <p className="text-[10px] text-white/40 mt-0.5">Boucles resserrées en S</p>
                </div>
                <div className="p-3 bg-[#1A1410] border border-white/5 rounded-2xl">
                  <span className="text-lg block mb-1">⚡</span>
                  <strong>Type 4B</strong>
                  <p className="text-[10px] text-white/40 mt-0.5">Motif en Z anguleux</p>
                </div>
                <div className="p-3 bg-[#1A1410] border border-white/5 rounded-2xl">
                  <span className="text-lg block mb-1">👑</span>
                  <strong>Type 4C</strong>
                  <p className="text-[10px] text-white/40 mt-0.5">Spirales très compactes</p>
                </div>
              </div>

              <Button
                onClick={startScan}
                className="w-full max-w-sm bg-[var(--gold-kene)] text-[#1A1410] hover:bg-[var(--gold-kene)]/90 font-bold py-3.5 rounded-2xl text-sm font-display cursor-pointer shadow-lg shadow-[var(--gold-kene)]/10"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Lancer le Scan Capillaire IA
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 2: Analyzing */}
      {step === 'analyzing' && (
        <Card className="bg-[#241C16] border border-white/10 rounded-3xl p-12 text-center space-y-6">
          <div className="w-16 h-16 border-4 border-[var(--gold-kene)] border-t-transparent rounded-full animate-spin mx-auto" />
          <div>
            <h3 className="text-xl font-display font-bold text-white">Analyse de la porosité & des boucles...</h3>
            <p className="text-xs text-white/50 mt-2 font-mono">Calcul des taux d'absorption d'eau & sérums botaniques</p>
          </div>
        </Card>
      )}

      {/* Step 3: Results */}
      {step === 'results' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Card className="bg-[#241C16] border border-[var(--gold-kene)]/30 rounded-3xl p-6 space-y-6 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[var(--gold-kene)] uppercase tracking-wider font-display">Votre Profil Capillaire</span>
                <h2 className="text-2xl font-display font-bold text-white mt-1">Cheveux Type {hairType} · Porosité {porosity}</h2>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-3 py-1 font-bold">
                Cuir Chevelu Sain (89/100)
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#1A1410] border border-white/5 p-4 rounded-2xl space-y-1">
                <span className="text-xs text-white/50">Porosité du Cheveu</span>
                <div className="text-lg font-bold text-[var(--gold-kene)] font-display">{porosity}</div>
                <p className="text-[10px] text-white/40">Nécessite des huiles scellantes riches (Karité & Baobab)</p>
              </div>

              <div className="bg-[#1A1410] border border-white/5 p-4 rounded-2xl space-y-1">
                <span className="text-xs text-white/50">Densité Capillaire</span>
                <div className="text-lg font-bold text-emerald-400 font-display">Forte / Forte</div>
                <p className="text-[10px] text-white/40">Idéal pour tresses Knotless & Fulani Braids</p>
              </div>

              <div className="bg-[#1A1410] border border-white/5 p-4 rounded-2xl space-y-1">
                <span className="text-xs text-white/50">Niveau d'Élasticité</span>
                <div className="text-lg font-bold text-amber-400 font-display">Optimal (84%)</div>
                <p className="text-[10px] text-white/40">Excellente résistance à la casse</p>
              </div>
            </div>

            {/* Recette Botanique Recommandée */}
            <div className="bg-[#1A1410] border border-[var(--gold-kene)]/20 p-5 rounded-2xl space-y-3">
              <h4 className="text-sm font-bold text-[var(--gold-kene)] font-display flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Recette Botanique Capillaire Recommandée
              </h4>
              <div className="flex flex-wrap gap-2 text-xs">
                {['Beurre de Karité brut', 'Huile de Baobab vierge', 'Gel d\'Aloe Vera pur', 'Poudre de Chebe traditionnelle'].map((ing, i) => (
                  <span key={i} className="bg-[var(--gold-kene)]/10 text-[var(--gold-kene)] border border-[var(--gold-kene)]/20 px-3 py-1 rounded-xl font-medium">
                    🌿 {ing}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => router.push('/customizer')}
                className="flex-1 bg-[var(--gold-kene)] text-[#1A1410] hover:bg-[var(--gold-kene)]/90 font-bold py-3 rounded-2xl text-xs font-display"
              >
                Formuler Mon Soin Sur-Mesure
              </Button>
              <Button
                onClick={() => setStep('capture')}
                className="border border-white/10 bg-transparent hover:bg-white/5 text-white text-xs font-bold py-3 rounded-2xl px-4"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
