'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, DollarSign, Clock, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Link from 'next/link';

export default function SalonSimulatorPage() {
  const [appointmentsPerDay, setAppointmentsPerDay] = useState<number>(8);
  const [averageTicketPrice, setAverageTicketPrice] = useState<number>(15000);
  const [employeeCount, setEmployeeCount] = useState<number>(3);
  const [workingDays, setWorkingDays] = useState<number>(26);

  // Financial calculations
  const monthlyGrossRevenue = appointmentsPerDay * averageTicketPrice * workingDays;
  const timeSavedHoursPerMonth = employeeCount * 12; // 12h économisées par employé / mois grâce à l'agenda auto
  const noShowReductionRevenueGain = Math.round(monthlyGrossRevenue * 0.15); // +15% de revenus récupérés via acomptes MoMo
  const projectedMonthlyProfitBoost = noShowReductionRevenueGain + (timeSavedHoursPerMonth * 2500);
  const annualTotalGain = projectedMonthlyProfitBoost * 12;

  return (
    <div className="min-h-screen bg-[#0F0A05] text-[#F8F1E4] py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 bg-[var(--gold-kene)]/10 text-[var(--gold-kene)] border border-[var(--gold-kene)]/30 px-3 py-1 rounded-full text-xs font-semibold">
            <Calculator className="w-3.5 h-3.5" /> Simulateur Financier B2B
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">
            Calculez le <span className="text-[var(--gold-kene)]">ROI de votre Salon</span> avec Kènè
          </h1>
          <p className="text-karite/80 text-sm md:text-base max-w-2xl mx-auto">
            Estimez le gain de chiffre d'affaires généré par la réduction des RDV manqués (No-Show) et le temps gagné sur la gestion.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sliders Control Panel */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-6 space-y-6">
            <Card className="bg-[#1A1410] border-[#362A21] text-white shadow-xl">
              <CardHeader>
                <CardTitle className="font-display text-xl text-[var(--gold-kene)] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" /> Variables d'Activité
                </CardTitle>
                <CardDescription className="text-karite/60">Ajustez les curseurs selon votre institut.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Slider 1: RDV par jour */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-karite font-medium">Rendez-vous par jour</span>
                    <span className="font-mono font-bold text-[var(--gold-kene)] text-base">{appointmentsPerDay} RDV/jour</span>
                  </div>
                  <Slider 
                    value={[appointmentsPerDay]} 
                    min={2} 
                    max={40} 
                    step={1} 
                    onValueChange={(val) => setAppointmentsPerDay(val[0])}
                    className="cursor-pointer"
                  />
                </div>

                {/* Slider 2: Panier moyen */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-karite font-medium">Panier Moyen par prestation</span>
                    <span className="font-mono font-bold text-[var(--gold-kene)] text-base">{averageTicketPrice.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <Slider 
                    value={[averageTicketPrice]} 
                    min={3000} 
                    max={100000} 
                    step={1000} 
                    onValueChange={(val) => setAverageTicketPrice(val[0])}
                    className="cursor-pointer"
                  />
                </div>

                {/* Slider 3: Nombre d'employés */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-karite font-medium">Nombre de Praticiennes / Employés</span>
                    <span className="font-mono font-bold text-[var(--gold-kene)] text-base">{employeeCount} employé(s)</span>
                  </div>
                  <Slider 
                    value={[employeeCount]} 
                    min={1} 
                    max={25} 
                    step={1} 
                    onValueChange={(val) => setEmployeeCount(val[0])}
                    className="cursor-pointer"
                  />
                </div>

                {/* Slider 4: Jours d'ouverture */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-karite font-medium">Jours d'ouverture par mois</span>
                    <span className="font-mono font-bold text-[var(--gold-kene)] text-base">{workingDays} jours</span>
                  </div>
                  <Slider 
                    value={[workingDays]} 
                    min={15} 
                    max={30} 
                    step={1} 
                    onValueChange={(val) => setWorkingDays(val[0])}
                    className="cursor-pointer"
                  />
                </div>

              </CardContent>
            </Card>
          </motion.div>

          {/* Results Display */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-6 space-y-6">
            <Card className="bg-[#1A1410] border-[var(--gold-kene)]/40 text-white shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Sparkles className="w-48 h-48 text-[var(--gold-kene)]" />
              </div>
              <CardHeader className="border-b border-[#362A21] pb-4">
                <CardTitle className="font-display text-xl text-white">Résultats Estimés de Rentabilité</CardTitle>
                <CardDescription className="text-karite/60">Impact financier direct mesuré avec Kènè OS.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                
                <div className="bg-[#241C16] p-4 rounded-xl border border-[#362A21] space-y-1">
                  <span className="text-xs text-karite/70 uppercase tracking-wider font-semibold">Chiffre d'Affaires Mensuel Brut</span>
                  <div className="text-2xl font-bold font-mono text-white">
                    {monthlyGrossRevenue.toLocaleString('fr-FR')} FCFA
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#241C16] p-4 rounded-xl border border-[#362A21] space-y-1">
                    <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                      <DollarSign className="w-3.5 h-3.5" /> Gain Anti-NoShow (+15%)
                    </div>
                    <div className="text-lg font-bold font-mono text-white">
                      +{noShowReductionRevenueGain.toLocaleString('fr-FR')} F
                    </div>
                    <span className="text-[10px] text-karite/50 block">Grâce aux acomptes MoMo</span>
                  </div>

                  <div className="bg-[#241C16] p-4 rounded-xl border border-[#362A21] space-y-1">
                    <div className="flex items-center gap-1 text-xs text-blue-400 font-semibold">
                      <Clock className="w-3.5 h-3.5" /> Temps Économisé
                    </div>
                    <div className="text-lg font-bold font-mono text-white">
                      {timeSavedHoursPerMonth}h / mois
                    </div>
                    <span className="text-[10px] text-karite/50 block">Rappels WhatsApp automatiques</span>
                  </div>
                </div>

                {/* Total Annual Gain Highlight */}
                <div className="bg-gradient-to-tr from-[#C8951E]/20 via-[#1A1410] to-[#241C16] p-6 rounded-2xl border border-[var(--gold-kene)]/50 space-y-2">
                  <span className="text-xs text-[var(--gold-kene)] uppercase tracking-wider font-bold block">
                    Impact Financier Annuel Estimé
                  </span>
                  <div className="text-3xl md:text-4xl font-display font-black text-white">
                    +{annualTotalGain.toLocaleString('fr-FR')} FCFA
                  </div>
                  <p className="text-xs text-karite/80 leading-relaxed pt-1">
                    En automatisant vos réservations avec acomptes Mobile Money et la relance automatique des clients inactivés.
                  </p>
                </div>

                <Link href="/dashboard" className="block pt-2">
                  <Button className="w-full bg-[var(--gold-kene)] text-[#1A1410] hover:bg-[#D4AF37]/90 font-bold py-6 text-base shadow-lg flex justify-center items-center gap-2">
                    <span>Activer Kènè Pro pour mon Salon</span>
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>

              </CardContent>
            </Card>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
