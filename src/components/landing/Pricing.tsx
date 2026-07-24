"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Currency = 'XOF' | 'EUR' | 'USD';

const PRICING_DATA: Record<Currency, { symbol: string; essential: string; premium: string; prestige: string }> = {
  XOF: { symbol: "FCFA", essential: "49 000", premium: "99 000", prestige: "Sur mesure" },
  EUR: { symbol: "€", essential: "75", premium: "150", prestige: "Sur mesure" },
  USD: { symbol: "$", essential: "80", premium: "160", prestige: "Sur mesure" },
};

export function Pricing() {
  const [currency, setCurrency] = useState<Currency>('XOF');
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Essentiel",
      price: PRICING_DATA[currency].essential,
      period: "/mois",
      description: "Parfait pour les instituts et salons indépendants.",
      features: [
        "Agenda jusqu'à 3 employés",
        "CRM Client & Phototypes Fitzpatrick",
        "Caisse POS & Reçus Mobile Money",
        "Rapports d'activité mensuels",
        "50 Diagnostics IA Peau/mois",
        "Support client 6j/7"
      ],
      highlighted: false,
      cta: "Démarrer l'essai gratuit"
    },
    {
      name: "Premium (SaaS Pro)",
      price: PRICING_DATA[currency].premium,
      period: "/mois",
      description: "L'outil complet pour les salons en pleine croissance.",
      features: [
        "Agenda & Employés illimités",
        "Comptabilité partie double SYSCOHADA",
        "Gestion RH & Bulletins CNPS / IPRES",
        "Campagnes Marketing WhatsApp & SMS",
        "Diagnostic IA Peau & Cheveux illimité",
        "Export Liasse Fiscale & CSV",
        "Manager dédié & Support 7j/7"
      ],
      highlighted: true,
      cta: "Essai gratuit 14 jours"
    },
    {
      name: "Prestige & Chaînes",
      price: PRICING_DATA[currency].prestige,
      period: "",
      description: "Pour les réseaux de salons, spas et franchises multi-sites.",
      features: [
        "Multi-établissements & Multi-pays",
        "Intégration API & ERP sur-mesure",
        "Marque Blanche Portail Client",
        "Sauvegardes garanties H24",
        "Accompagnement & Formation sur site",
        "SLA 99.9% de disponibilité"
      ],
      highlighted: false,
      cta: "Contacter l'équipe Ventes"
    }
  ];

  return (
    <section id="pricing" className="py-28 bg-[#1A1410] relative overflow-hidden text-white">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#C8951E]/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="container relative mx-auto px-4 max-w-6xl z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#F3E5AB] text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#C8951E]" /> Tarification Claire & Sans Surprise
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white mb-6">
            Des formules adaptées à votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] to-[#C8951E]">croissance</span>
          </h2>
          <p className="text-white/60 text-lg">
            Aucun frais d'activation caché. Annulez ou modifiez votre formule à tout moment.
          </p>

          {/* Controls: Currency & Billing Cycle */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            {/* Annual/Monthly Toggle */}
            <div className="flex items-center bg-[#0A0603] p-1 rounded-2xl border border-white/10 text-xs font-bold">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-2 rounded-xl transition ${!isAnnual ? 'bg-white/10 text-white' : 'text-white/40'}`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-4 py-2 rounded-xl transition flex items-center gap-1 ${isAnnual ? 'bg-[#C8951E] text-[#0F0A05]' : 'text-white/40'}`}
              >
                Annuel <span className="text-[9px] bg-[#0A0603] text-[#F3E5AB] px-1.5 py-0.5 rounded-md">-20%</span>
              </button>
            </div>

            {/* Currency Switcher */}
            <div className="flex items-center bg-[#0A0603] p-1 rounded-2xl border border-white/10 text-xs font-bold">
              {(['XOF', 'EUR', 'USD'] as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-3 py-2 rounded-xl transition ${currency === c ? 'bg-[#C8951E] text-[#0F0A05]' : 'text-white/40 hover:text-white'}`}
                >
                  {c === 'XOF' ? 'FCFA (XOF/XAF)' : c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative p-8 rounded-3xl border ${
                plan.highlighted 
                  ? "bg-gradient-to-b from-[#241C16] to-[#0A0603] border-[#C8951E] shadow-2xl shadow-[#C8951E]/20" 
                  : "bg-[#0A0603] border-white/10"
              } flex flex-col justify-between`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] text-xs font-black rounded-full uppercase tracking-wider shadow-md">
                  Le plus populaire
                </div>
              )}
              
              <div>
                <div className="mb-6">
                  <h3 className="text-2xl font-display font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-white/50 text-xs leading-relaxed min-h-[36px]">{plan.description}</p>
                </div>

                <div className="mb-8 border-y border-white/5 py-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] to-[#C8951E]">
                      {plan.price}
                    </span>
                    <span className="text-white/60 text-sm font-bold">{PRICING_DATA[currency].symbol} {plan.period}</span>
                  </div>
                  {isAnnual && plan.price !== "Sur mesure" && (
                    <span className="text-[10px] text-emerald-400 font-bold block mt-1">Facturé annuellement (Économisez 20%)</span>
                  )}
                </div>

                <ul className="space-y-3.5 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-3 text-white/80 text-xs">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${plan.highlighted ? "bg-[#C8951E] text-[#0F0A05]" : "bg-white/10 text-white"}`}>
                        <Check className="w-2.5 h-2.5 font-bold" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/login" className="w-full">
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-2xl font-bold text-sm transition-all shadow-lg ${
                    plan.highlighted 
                      ? "bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] shadow-[#C8951E]/20" 
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  {plan.cta}
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Security badge at bottom */}
        <div className="mt-16 text-center text-xs text-white/40 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Données hébergées en environnement sécurisé conforme RGPD & UEMOA.</span>
        </div>
      </div>
    </section>
  );
}
