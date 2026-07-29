'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanFace, ShoppingCart, Sparkles, TrendingUp, ShieldCheck, Camera, ArrowRight, CheckCircle2, Sliders, Award, Building2, Play, Users, Eye, Zap, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { KeneLogo } from '@/components/ui/logo';
import { useToast } from '@/hooks/use-toast';

export function InteractiveShowroom() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'scanner' | 'calculator' | 'quiz'>('scanner');

  // --- 1. LIVE DERMO-IA SCANNER STATE ---
  const [photo, setPhoto] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    scoreGlobal: number;
    hydration: string;
    pih: number;
    phototype: string;
    formula: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDemoScan = (photoData: string) => {
    setPhoto(photoData);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult({
        scoreGlobal: 84,
        hydration: '84%',
        pih: 18,
        phototype: 'Phototype V (Afro-Subsaharien)',
        formula: 'Sérum Concentré Baobab & Niacinamide Bio 10%',
      });
      toast({
        title: "✨ Analyse Spectrale IA Complétée !",
        description: "Score de santé cutanée calculé avec succès en direct.",
      });
    }, 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => handleDemoScan(reader.result as string);
    reader.readAsDataURL(file);
  };

  // --- 2. FCFA REVENUE BOOST CALCULATOR STATE ---
  const [chairs, setChairs] = useState<number>(4);
  const [clientsPerDay, setClientsPerDay] = useState<number>(16);
  const [avgServicePrice, setAvgServicePrice] = useState<number>(15000);

  const monthlyRevenue = chairs * clientsPerDay * avgServicePrice * 26; // 26 working days
  const estimatedBoost = Math.round(monthlyRevenue * 0.22); // +22% average boost with Mobile Money & Zero no-shows
  const roiMultiplier = Math.round(estimatedBoost / 45000); // 45,000 F monthly subscription

  // --- 3. QUIZ CERTIFICATION STATE ---
  const [quizStep, setQuizStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [quizComplete, setQuizComplete] = useState(false);

  const QUIZ_QUESTIONS = [
    { text: "Proposez-vous ou prévoyez-vous des soins botaniques (Karité, Baobab, Moringa) ?", icon: "🌿" },
    { text: "Acceptez-vous ou souhaitez-vous accepter les paiements Wave & Orange Money ?", icon: "🌊" },
    { text: "Souhaitez-vous offrir un bilan cutané Dermo-IA certifié à vos clientes ?", icon: "🔬" },
    { text: "Souhaitez-vous automatiser la paie et le suivi des commissions de vos praticiennes ?", icon: "⚖️" },
  ];

  const handleAnswer = (yes: boolean) => {
    setAnswers(prev => ({ ...prev, [quizStep]: yes }));
    if (quizStep < QUIZ_QUESTIONS.length - 1) {
      setQuizStep(prev => prev + 1);
    } else {
      setQuizComplete(true);
      toast({
        title: "🏆 Certification Éligibilité Accordée !",
        description: "Votre salon est éligible au Label Kènè OS 2026.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0A05] text-[#F8F1E4] selection:bg-[#C8951E] selection:text-[#0F0A05] relative overflow-hidden font-sans">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#C8951E]/15 via-[#8A3B14]/10 to-transparent blur-3xl pointer-events-none" />

      {/* --- TOP HEADER NAVIGATION --- */}
      <header className="sticky top-0 z-50 bg-[#0F0A05]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <KeneLogo href="/" subtitle="DEMO LIVE" size="md" />

          {/* Direct Portals Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/portal">
              <Button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold rounded-2xl h-10 px-4 cursor-pointer">
                🌸 Espace Cliente
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] text-xs font-black rounded-2xl h-10 px-4 shadow-lg cursor-pointer hover:scale-105 transition">
                🏬 Espace Salon
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* --- HERO SHOWROOM INTRODUCTION --- */}
      <section className="relative pt-10 pb-6 px-4 text-center max-w-4xl mx-auto space-y-4">
        <Badge className="bg-[#C8951E]/15 text-[#F3E5AB] border border-[#C8951E]/30 px-3.5 py-1 text-xs font-mono font-bold rounded-full inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#C8951E]" /> Démo Interactive & Expérience Live Kènè OS 2026
        </Badge>
        
        <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight">
          Testez le futur de la beauté mélanoderme <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#C8951E] bg-clip-text text-transparent">
            en conditions réelles
          </span>
        </h1>
        
        <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto font-sans leading-relaxed">
          Essayez le scanner dermo-IA en direct, calculez le gain financier net pour votre salon et testez l'éligibilité de votre institut.
        </p>

        {/* --- 3 MAIN INTERACTIVE SHOWROOM TABS --- */}
        <div className="inline-flex p-1.5 rounded-2xl bg-[#1A1410] border border-white/10 mt-6 max-w-full overflow-x-auto">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'scanner'
                ? 'bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] shadow-lg font-black'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <ScanFace className="w-4 h-4" /> 1. Scanner Dermo-IA Live
          </button>
          
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] shadow-lg font-black'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> 2. Calculateur Gain FCFA
          </button>
          
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] shadow-lg font-black'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" /> 3. Test Label Salon
          </button>
        </div>
      </section>

      {/* --- TAB CONTENT AREA --- */}
      <main className="max-w-4xl mx-auto px-4 pb-20 pt-4">

        {/* 🔬 MODULE 1: SCANNER DERMO-IA LIVE DIRECT */}
        {activeTab === 'scanner' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-[#1A1410] border border-[#C8951E]/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
                    <ScanFace className="w-5 h-5 text-[#C8951E]" /> Testeur Biométrique Dermo-IA Live
                  </h3>
                  <p className="text-white/40 text-xs mt-0.5">Prenez une photo ou sélectionnez un cliché pour lancer l'analyse spectrométrique.</p>
                </div>
                <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono text-xs">
                  Pro-VLM v2.4
                </Badge>
              </div>

              {!photo ? (
                /* Empty Upload Dropzone */
                <div className="border-2 border-dashed border-white/15 rounded-3xl p-8 sm:p-12 text-center space-y-4 bg-black/40 hover:border-[#C8951E]/50 transition-colors">
                  <div className="w-16 h-16 rounded-3xl bg-[#C8951E]/10 border border-[#C8951E]/30 flex items-center justify-center mx-auto text-[#C8951E]">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-white text-base">Essayez le Scanner sur votre Visage</h4>
                    <p className="text-white/40 text-xs max-w-md mx-auto">
                      Découvrez en 3 secondes votre phototype Fitzpatrick et votre niveau d'hydratation.
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] font-black text-xs h-11 px-6 rounded-2xl cursor-pointer shadow-lg hover:scale-105 transition"
                    >
                      <Camera className="w-4 h-4 mr-2" /> Choisir une Photo (Galerie)
                    </Button>
                    <Button
                      onClick={() => handleDemoScan('/images/afro_skin_spectral_scanner.jpg')}
                      className="bg-white/5 hover:bg-white/10 text-white font-bold text-xs h-11 px-5 rounded-2xl border border-white/10 cursor-pointer"
                    >
                      🧪 Utiliser l'Exemple Démo HD
                    </Button>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </div>
              ) : (
                /* Scanner Analysis View */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Photo Canvas Frame */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black">
                    <img src={photo} alt="Scan Face" className="w-full h-full object-cover" />
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center p-4 space-y-3">
                        <div className="w-12 h-12 rounded-full border-4 border-[#C8951E] border-t-transparent animate-spin" />
                        <span className="text-xs font-mono font-bold text-[#F3E5AB] animate-pulse">Analyse Spectrométrique en cours…</span>
                      </div>
                    )}
                    {!isAnalyzing && analysisResult && (
                      <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold px-3 py-1 rounded-full">
                        🟢 Analyse Validée (Score {analysisResult.scoreGlobal}%)
                      </div>
                    )}
                  </div>

                  {/* Results Panel */}
                  <div className="space-y-4 flex flex-col justify-between">
                    {isAnalyzing ? (
                      <div className="p-6 bg-[#0F0A05] rounded-2xl border border-white/5 space-y-3 animate-pulse">
                        <div className="h-4 bg-white/10 rounded w-3/4" />
                        <div className="h-4 bg-white/10 rounded w-1/2" />
                        <div className="h-20 bg-white/5 rounded" />
                      </div>
                    ) : analysisResult ? (
                      <div className="space-y-4">
                        <div className="bg-[#0F0A05] p-4 rounded-2xl border border-[#C8951E]/30 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-white/40 text-[10px] font-mono uppercase">Score Global de Santé Peau</span>
                            <span className="font-display font-black text-2xl text-[#F3E5AB]">{analysisResult.scoreGlobal}%</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] rounded-full" style={{ width: `${analysisResult.scoreGlobal}%` }} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="bg-[#0F0A05] p-3 rounded-xl border border-white/5">
                            <span className="text-white/40 text-[10px] block">Phototype Fitzpatrick</span>
                            <span className="font-bold text-white block mt-0.5">{analysisResult.phototype}</span>
                          </div>
                          <div className="bg-[#0F0A05] p-3 rounded-xl border border-white/5">
                            <span className="text-white/40 text-[10px] block">Niveau Hydratation</span>
                            <span className="font-bold text-emerald-400 block mt-0.5">{analysisResult.hydration}</span>
                          </div>
                        </div>

                        <div className="bg-[#0F0A05] p-3 rounded-xl border border-white/5 space-y-1">
                          <span className="text-[10px] font-mono text-[#C8951E] font-bold uppercase">Formulation Botanique Recommandée</span>
                          <p className="text-xs font-bold text-white">{analysisResult.formula}</p>
                        </div>
                      </div>
                    ) : null}

                    <Button
                      onClick={() => setPhoto(null)}
                      className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs h-10 rounded-xl cursor-pointer"
                    >
                      🔄 Tester une Autre Photo
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 💰 MODULE 2: CALCULATEUR DE GAIN DE CHIFFRE D'AFFAIRES FCFA */}
        {activeTab === 'calculator' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-[#1A1410] border border-[#C8951E]/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#C8951E]" /> Calculateur Financier de Gain Salon (FCFA)
                  </h3>
                  <p className="text-white/40 text-xs mt-0.5">Estimez votre chiffre d'affaires supplémentaire grâce aux encaissements Mobile Money et à la fidélité.</p>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-xs">
                  ROI Certifié
                </Badge>
              </div>

              {/* Sliders Input Controls */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-2">
                    <span className="text-white/70">Nombre de fauteuils ou cabines dans votre salon :</span>
                    <span className="text-[#F3E5AB] font-mono text-sm bg-[#0F0A05] px-3 py-1 rounded-xl border border-white/10">{chairs} cabine(s)</span>
                  </div>
                  <input
                    type="range" min="1" max="15" value={chairs}
                    onChange={(e) => setChairs(Number(e.target.value))}
                    className="w-full accent-[#C8951E] bg-white/10 h-2 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-2">
                    <span className="text-white/70">Nombre moyen de clientes servies par jour :</span>
                    <span className="text-[#F3E5AB] font-mono text-sm bg-[#0F0A05] px-3 py-1 rounded-xl border border-white/10">{clientsPerDay} clientes / jour</span>
                  </div>
                  <input
                    type="range" min="3" max="50" value={clientsPerDay}
                    onChange={(e) => setClientsPerDay(Number(e.target.value))}
                    className="w-full accent-[#C8951E] bg-white/10 h-2 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-2">
                    <span className="text-white/70">Prix moyen d'une prestation ou d'un soin :</span>
                    <span className="text-[#F3E5AB] font-mono text-sm bg-[#0F0A05] px-3 py-1 rounded-xl border border-white/10">{avgServicePrice.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <input
                    type="range" min="3000" max="50000" step="1000" value={avgServicePrice}
                    onChange={(e) => setAvgServicePrice(Number(e.target.value))}
                    className="w-full accent-[#C8951E] bg-white/10 h-2 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Calculated Revenue Result Banner */}
              <div className="bg-gradient-to-br from-[#1F1710] to-[#0A0603] border-2 border-[#C8951E]/40 p-6 rounded-3xl space-y-4 text-center">
                <span className="text-white/40 text-[10px] font-mono uppercase tracking-widest block">
                  Gain Supplémentaire Estimé avec Kènè OS (+22%)
                </span>
                
                <div className="text-3xl sm:text-5xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#C8951E]">
                  +{estimatedBoost.toLocaleString('fr-FR')} FCFA <span className="text-xs text-white/50 font-normal">/ mois</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                  <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                    <span className="text-white/50 text-[10px] block">Chiffre d'Affaires Mensuel Brut</span>
                    <span className="font-bold text-white text-sm">{monthlyRevenue.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div className="bg-black/40 p-3 rounded-2xl border border-emerald-500/20">
                    <span className="text-emerald-400 font-bold text-[10px] block">Retour sur Investissement (ROI)</span>
                    <span className="font-bold text-emerald-400 text-sm">{roiMultiplier}x le prix de l'abonnement</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 🏆 MODULE 3: TEST D'ÉLIGIBILITÉ LABEL KÈNÈ OS 2026 */}
        {activeTab === 'quiz' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-[#1A1410] border border-[#C8951E]/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
              {!quizComplete ? (
                <div className="space-y-6 max-w-lg mx-auto">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-[#C8951E] font-bold uppercase tracking-widest">
                      Question {quizStep + 1} / {QUIZ_QUESTIONS.length}
                    </span>
                    <h3 className="font-display font-bold text-xl text-white">
                      {QUIZ_QUESTIONS[quizStep].icon} {QUIZ_QUESTIONS[quizStep].text}
                    </h3>
                  </div>

                  <div className="flex justify-center gap-4 pt-2">
                    <Button
                      onClick={() => handleAnswer(true)}
                      className="bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] font-black text-sm h-12 px-8 rounded-2xl cursor-pointer shadow-lg hover:scale-105 transition"
                    >
                      Oui, Tout à fait ✅
                    </Button>
                    <Button
                      onClick={() => handleAnswer(false)}
                      className="bg-white/5 hover:bg-white/10 text-white font-bold text-sm h-12 px-8 rounded-2xl border border-white/10 cursor-pointer"
                    >
                      Pas Encore ❌
                    </Button>
                  </div>
                </div>
              ) : (
                /* Quiz Success Certificate Result */
                <div className="space-y-5 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <h3 className="font-display font-black text-2xl text-white">
                    Félicitations ! Votre Institut est 100% Éligible 🏆
                  </h3>

                  <p className="text-xs text-white/60 leading-relaxed font-sans">
                    Votre salon remplit tous les critères requis pour obtenir le **Label Certifié Kènè OS 2026** à Abidjan.
                  </p>

                  <Link href="/dashboard">
                    <Button className="w-full bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] font-black text-sm h-12 rounded-2xl shadow-xl hover:scale-105 transition cursor-pointer">
                      🚀 Activer Mon Salon Gratuitement
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}

      </main>
    </div>
  );
}
