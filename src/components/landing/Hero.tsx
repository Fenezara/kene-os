"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  ArrowRight, Sparkles, ShoppingCart, ScanFace, Calculator, 
  LayoutDashboard, CheckCircle2, ShieldCheck, Zap, Star, FlaskConical, MapPin, UserCheck, Heart
} from "lucide-react";
import { SankofaIcon, GyeNyameIcon, BogolanPatternDivider } from "@/components/ui/adinkra-icons";

export function Hero() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pos' | 'ia' | 'lab' | 'compta'>('dashboard');

  return (
    <section className="relative pt-24 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-[#0A0603] text-white">
      {/* Background Glowing Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] opacity-25 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C8951E] via-[#8A3B14] to-transparent blur-[140px] rounded-full" />
      </div>

      {/* Subtle Adinkra Watermark */}
      <div className="absolute top-12 right-10 opacity-[0.03] pointer-events-none">
        <GyeNyameIcon className="w-96 h-96 text-[#C8951E]" />
      </div>

      <div className="container relative mx-auto px-4 text-center z-10 max-w-6xl">
        {/* Top Announcement Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A1410] border border-[#C8951E]/30 text-[#F3E5AB] text-xs md:text-sm font-semibold mb-8 shadow-lg shadow-[#C8951E]/10"
        >
          <SankofaIcon className="w-4 h-4 text-[#C8951E] animate-pulse" />
          <span>Le N°1 de la Beauté Afro-Contemporaine & Dermo-Cosmétique</span>
          <span className="bg-[#C8951E] text-[#0F0A05] text-[10px] px-2 py-0.5 rounded-full font-black ml-1 uppercase">UEMOA / OHADA</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold text-white mb-6 tracking-tight leading-[1.1]"
        >
          Sublimez le Savoir-Faire Africain avec <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#C8951E] to-[#D4AF37]">
            Luxe, Culture & Intelligence IA
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-white/70 mb-10 max-w-3xl mx-auto font-sans leading-relaxed"
        >
          Diagnostic IA Peau Mélanoderme, Caisse Mobile Money (*Wave, Orange Money*), Laboratoire de Confection Botanique et Comptabilité SYSCOHADA réunis dans une suite SaaS d'exception.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
        >
          <Link href="/register" className="w-full sm:w-auto">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button size="lg" className="h-14 px-8 text-base font-bold bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] hover:opacity-95 shadow-xl shadow-[#C8951E]/20 w-full sm:w-auto rounded-2xl cursor-pointer">
                Démarrer Essai Gratuit 14 Jours
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </Link>

          <Link href="/portfolio" className="w-full sm:w-auto">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button size="lg" variant="outline" className="h-14 px-8 text-base border-white/10 text-white bg-white/5 hover:bg-white/10 w-full sm:w-auto rounded-2xl backdrop-blur-md cursor-pointer flex items-center gap-2">
                <span>Résultats Avant / Après</span>
                <Sparkles className="w-4 h-4 text-[#C8951E]" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* High-Impact Modern African Beauty Showcase Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16"
        >
          <div className="relative rounded-3xl overflow-hidden border border-[#C8951E]/30 group h-64 shadow-2xl">
            <img 
              src="/images/afro_beauty_hero_woman.jpg" 
              alt="Femme Africaine Beauté Dermo" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A05] via-[#0F0A05]/40 to-transparent p-5 flex flex-col justify-end text-left">
              <span className="text-[10px] font-mono font-bold text-[#F3E5AB] uppercase tracking-widest bg-[#C8951E]/30 px-2.5 py-0.5 rounded-full w-fit backdrop-blur-md mb-1 border border-[#C8951E]/50">
                Espace Femmes & Dermo
              </span>
              <h3 className="font-display font-black text-lg text-white leading-tight">Soins Peaux Mélanodermes</h3>
              <p className="text-xs text-white/70 font-sans mt-0.5">Dermatologie & Rituels Karité Éclat</p>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-[#C8951E]/30 group h-64 shadow-2xl">
            <img 
              src="/images/afro_man_dermo_care.jpg" 
              alt="Homme Africain Soin Visage" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A05] via-[#0F0A05]/40 to-transparent p-5 flex flex-col justify-end text-left">
              <span className="text-[10px] font-mono font-bold text-[#F3E5AB] uppercase tracking-widest bg-[#C8951E]/30 px-2.5 py-0.5 rounded-full w-fit backdrop-blur-md mb-1 border border-[#C8951E]/50">
                Espace Hommes & Grooming
              </span>
              <h3 className="font-display font-black text-lg text-white leading-tight">Soins Barbe & Visage Homme</h3>
              <p className="text-xs text-white/70 font-sans mt-0.5">Hydratation & Anti-Boutons de Rasage</p>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-[#C8951E]/30 group h-64 shadow-2xl">
            <img 
              src="/images/african_young_girl_hair.jpg" 
              alt="Jeune Fille Tresses Braids" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A05] via-[#0F0A05]/40 to-transparent p-5 flex flex-col justify-end text-left">
              <span className="text-[10px] font-mono font-bold text-[#F3E5AB] uppercase tracking-widest bg-[#C8951E]/30 px-2.5 py-0.5 rounded-full w-fit backdrop-blur-md mb-1 border border-[#C8951E]/50">
                Coiffure & Braids Nappy
              </span>
              <h3 className="font-display font-black text-lg text-white leading-tight">Tresses & Cuir Chevelu</h3>
              <p className="text-xs text-white/70 font-sans mt-0.5">Knotless Braids & Soins Baobab Chébé</p>
            </div>
          </div>
        </motion.div>

        {/* Social Proof Strip */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-white/60 mb-14 border-y border-white/5 py-4 font-sans"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Comptabilité <strong>SYSCOHADA</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#C8951E]" />
            <span>Paiements <strong>Wave & Orange Money</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-[#F3E5AB] fill-[#F3E5AB]" />
            <span><strong>4.9/5</strong> par 120+ Salons à Abidjan, Dakar, Bamako & Ouaga</span>
          </div>
        </motion.div>

        {/* Interactive Live Product Showcase Window */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Outer Glass Card Window */}
          <div className="relative rounded-3xl border border-[#C8951E]/30 bg-[#1A1410]/90 shadow-2xl shadow-[#C8951E]/15 overflow-hidden backdrop-blur-2xl p-4 md:p-6 text-left">
            {/* Header / Tabs bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-4 mb-6 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs font-mono text-white/40">app.kene.africa/dashboard</span>
              </div>

              {/* Tab Navigation Buttons */}
              <div className="flex bg-[#0A0603] p-1 rounded-xl border border-white/10 w-full sm:w-auto overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${activeTab === 'dashboard' ? 'bg-[#C8951E] text-[#0F0A05]' : 'text-white/50 hover:text-white'}`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('pos')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${activeTab === 'pos' ? 'bg-[#C8951E] text-[#0F0A05]' : 'text-white/50 hover:text-white'}`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> Caisse POS
                </button>
                <button
                  onClick={() => setActiveTab('ia')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${activeTab === 'ia' ? 'bg-[#C8951E] text-[#0F0A05]' : 'text-white/50 hover:text-white'}`}
                >
                  <ScanFace className="w-3.5 h-3.5" /> Diagnostic IA
                </button>
                <button
                  onClick={() => setActiveTab('lab')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${activeTab === 'lab' ? 'bg-[#C8951E] text-[#0F0A05]' : 'text-white/50 hover:text-white'}`}
                >
                  <FlaskConical className="w-3.5 h-3.5" /> Labo Sur-Mesure
                </button>
                <button
                  onClick={() => setActiveTab('compta')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${activeTab === 'compta' ? 'bg-[#C8951E] text-[#0F0A05]' : 'text-white/50 hover:text-white'}`}
                >
                  <Calculator className="w-3.5 h-3.5" /> Compta OHADA
                </button>
              </div>
            </div>

            {/* Interactive Showcase Content Panel */}
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#0A0603] border border-white/10 rounded-2xl p-4">
                      <p className="text-xs text-white/50 uppercase font-semibold mb-1">Chiffre d'Affaires du Mois</p>
                      <div className="text-2xl font-display font-black text-[#F3E5AB]">14 850 000 <span className="text-sm">FCFA</span></div>
                      <span className="text-[10px] text-emerald-400 font-bold mt-1 block">↑ +24.8% vs mois dernier</span>
                    </div>
                    <div className="bg-[#0A0603] border border-white/10 rounded-2xl p-4">
                      <p className="text-xs text-white/50 uppercase font-semibold mb-1">Rendez-vous Validés</p>
                      <div className="text-2xl font-display font-black text-white">184 RDV</div>
                      <span className="text-[10px] text-[#C8951E] font-bold mt-1 block">Taux d'occupation : 92%</span>
                    </div>
                    <div className="bg-[#0A0603] border border-white/10 rounded-2xl p-4">
                      <p className="text-xs text-white/50 uppercase font-semibold mb-1">Clientes Récurrentes</p>
                      <div className="text-2xl font-display font-black text-emerald-400">78.4%</div>
                      <span className="text-[10px] text-white/40 font-bold mt-1 block">Programme Fidélité Or</span>
                    </div>
                  </div>

                  <div className="bg-[#0A0603] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C8951E]/30 to-[#8A3B14]/20 flex items-center justify-center font-bold text-[#F3E5AB]">
                        ✨
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">Dernier Soin Botanique : Massage Relaxant au Karité</h4>
                        <p className="text-xs text-white/50">Cliente: Aminata Diallo · Praticienne: Fatou</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs rounded-full font-bold">Encaisse 25 000 F (Wave)</span>
                  </div>
                </motion.div>
              )}

              {activeTab === 'pos' && (
                <motion.div
                  key="pos"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="bg-[#0A0603] border border-white/10 rounded-2xl p-4 space-y-3">
                    <h4 className="font-display font-bold text-sm text-[#F3E5AB] uppercase tracking-wider">Panier d'Encaissement</h4>
                    <div className="flex justify-between border-b border-white/5 pb-2 text-xs">
                      <span>Soin Capillaire Baobab & Karité</span>
                      <span className="font-mono text-white">35 000 FCFA</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2 text-xs">
                      <span>Beurre Pur de Karité (250g)</span>
                      <span className="font-mono text-white">12 000 FCFA</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold border-t border-white/10 pt-2">
                      <span>Total à Encaisser</span>
                      <span className="font-mono text-emerald-400">47 000 FCFA</span>
                    </div>
                  </div>

                  <div className="bg-[#0A0603] border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                      <h4 className="font-display font-bold text-sm text-white mb-3">Mode de Paiement</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs font-bold mb-4">
                        <div className="p-3 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-xl text-center cursor-pointer">🌊 Wave Mobile</div>
                        <div className="p-3 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-xl text-center cursor-pointer">🟠 Orange Money</div>
                      </div>
                    </div>
                    <button className="w-full py-3 bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] font-bold rounded-xl text-sm flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Valider & Imprimer Ticket
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'ia' && (
                <motion.div
                  key="ia"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-[#0A0603] border border-white/10 rounded-2xl p-5 space-y-4"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <div>
                      <h4 className="font-display font-bold text-base text-white">Diagnostic IA — Phototype VI (Peau Noire)</h4>
                      <p className="text-xs text-white/50">Analyse de déshydratation et recommandation botanique</p>
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-[#C8951E] flex items-center justify-center font-display font-black text-[#F3E5AB]">
                      84%
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="bg-white/5 p-3 rounded-xl">
                      <span className="text-white/40 block mb-1">Hydratation</span>
                      <span className="font-bold text-emerald-400">Excellente (88%)</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl">
                      <span className="text-white/40 block mb-1">Sébum</span>
                      <span className="font-bold text-[#C8951E]">Équilibré (74%)</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl">
                      <span className="text-white/40 block mb-1">Éclat / Pigment</span>
                      <span className="font-bold text-emerald-400">Uniforme (90%)</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'lab' && (
                <motion.div
                  key="lab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-[#0A0603] border border-white/10 rounded-2xl p-5 space-y-3"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <div>
                      <h4 className="font-display font-bold text-sm text-[#F3E5AB]">Laboratoire : Formulation Sur-Mesure #LAB-2024-001</h4>
                      <p className="text-xs text-white/50">Sérum Magistral Éclat Bissap & Niacinamide (Flacon 30ml)</p>
                    </div>
                    <span className="text-[10px] font-mono text-[#C8951E] bg-[#C8951E]/10 border border-[#C8951E]/30 px-2 py-0.5 rounded-md font-bold">LOT-2024-ABJ-042</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-sans">
                    <div className="bg-white/5 p-2 rounded-lg">
                      <span className="text-white/40 text-[10px] block">Base Hydratante</span>
                      <span className="font-semibold text-white">Gel Aloe Vera (25 ml)</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg">
                      <span className="text-white/40 text-[10px] block">Actif AHA Éclat</span>
                      <span className="font-semibold text-[#C8951E]">Bissap Concentré (3.5 ml)</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg">
                      <span className="text-white/40 text-[10px] block">Anti-Taches PIH</span>
                      <span className="font-semibold text-emerald-400">Niacinamide 5% (1.5 g)</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg">
                      <span className="text-white/40 text-[10px] block">Lipide Protecteur</span>
                      <span className="font-semibold text-white">Huile Baobab (4 ml)</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'compta' && (
                <motion.div
                  key="compta"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-[#0A0603] border border-white/10 rounded-2xl p-5 space-y-3 text-xs font-mono"
                >
                  <div className="flex justify-between border-b border-white/5 pb-2 font-bold text-[#F3E5AB]">
                    <span>ÉCRITURE COMPTABLE #ECR-2026-0842</span>
                    <span>Journal des Ventes (706)</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>5711 — Caisse Principale (Débit)</span>
                    <span className="text-emerald-400 font-bold">29 500 FCFA</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>706 — Prestations Soins HT (Crédit)</span>
                    <span>25 000 FCFA</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>4431 — État, TVA Collectée 18% (Crédit)</span>
                    <span>4 500 FCFA</span>
                  </div>
                  <div className="pt-2 border-t border-white/10 text-[10px] font-sans text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Partie double équilibrée — Conforme SYSCOHADA UEMOA
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
