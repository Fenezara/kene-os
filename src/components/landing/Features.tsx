"use client";

import { motion } from "framer-motion";
import { Calendar, Users, Package, CreditCard, Activity, Bot, FlaskConical, ShieldCheck, MapPin } from "lucide-react";
import { SankofaIcon, BogolanPatternDivider } from "@/components/ui/adinkra-icons";

const features = [
  {
    icon: FlaskConical,
    title: "Laboratoire Cosmétique Sur-Mesure",
    description: "Ordres de confection en institut, dosages au gramme/goutte, formules dermo-botaniques et étiquettes flacons personnalisées."
  },
  {
    icon: Bot,
    title: "Diagnostic IA Peau & Cheveux",
    description: "Analyse dermatologique par IA pour peaux mélanodermes (Phototypes IV à VI), bilans cutanés et ordonnances QR Code."
  },
  {
    icon: CreditCard,
    title: "Caisse POS & Mobile Money",
    description: "Encaissements instantanés Wave & Orange Money, QR Code dynamique, tickets WhatsApp et comptabilité certifiée SYSCOHADA."
  },
  {
    icon: Calendar,
    title: "Agenda & Réservation Praticiennes",
    description: "Gestion des créneaux cabines, affectation des esthéticiennes, rappels WhatsApp et prise de rendez-vous en 1-click."
  },
  {
    icon: ShieldCheck,
    title: "Comptabilité & Paie OHADA",
    description: "Gestion de la TVA 18%, journaux de recettes, bulletins de paie CNPS / IPRES et calcul des charges sociales."
  },
  {
    icon: Users,
    title: "CRM & Fidélité Clientèle",
    description: "Historique des rituels, carnets de bilans de peau, système de cashback parrainage et cartes Apple/Google Wallet."
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-[#0F0A05] relative overflow-hidden">
      <div className="container mx-auto px-4">
        
        <div className="flex justify-center mb-4">
          <SankofaIcon className="w-10 h-10 text-[#C8951E] animate-pulse" />
        </div>

        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-display">
            Tout ce dont votre Salon a besoin, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#C8951E] to-[#D4AF37]">
              sublimé par le savoir-faire africain.
            </span>
          </h2>
          <p className="text-white/60 text-base md:text-lg font-sans">
            Une suite logicielle SaaS complète pensée spécifiquement pour les exigences des salons de beauté, instituts et dermo-spas en Afrique Subsaharienne.
          </p>
        </div>

        <BogolanPatternDivider className="max-w-xl mx-auto mb-16 opacity-40 text-[#C8951E]" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-3xl bg-[#1A1410] border border-white/10 hover:border-[#C8951E]/50 transition-all group shadow-xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#241C16] border border-[#C8951E]/20 flex items-center justify-center mb-6 group-hover:bg-[#C8951E]/20 transition-colors">
                <feature.icon className="w-6 h-6 text-[#C8951E]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-display group-hover:text-[#F3E5AB] transition-colors">
                {feature.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed font-sans">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
