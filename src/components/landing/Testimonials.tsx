"use client";

import { motion } from "framer-motion";
import { Star, Quote, Building2, MapPin } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Awa Konaté",
    role: "Fondatrice & Master Hairstylist",
    salon: "Awa's Hair & Beauty Spa",
    location: "Cocody Mermoz, Abidjan (Côte d'Ivoire)",
    avatar: "https://i.pravatar.cc/150?u=awa",
    quote: "Avant Kènè Pro, les encaissements et la paie me prenaient 3 jours par mois. Désormais, les paiements Wave et la télédéclaration e-CNPS se font en 1 clic. Mes clientes adorent aussi leur espace fidélité !",
    rating: 5,
    tag: "Chiffre d'affaires +35%"
  },
  {
    name: "Ndeye Fatou Diop",
    role: "Directrice Générale",
    salon: "Dakar Prestige Spa",
    location: "Almadies, Dakar (Sénégal)",
    avatar: "https://i.pravatar.cc/150?u=ndeye",
    quote: "Le module de Diagnostic IA Peau pour les phototypes V et VI est une révolution. Nous avons augmenté la vente de nos sérums et soins au beurre de Karité sur-mesure de 60%. Un produit exceptionnel.",
    rating: 5,
    tag: "Ventes Soins +60%"
  },
  {
    name: "Mariam Traoré",
    role: "Gérante de Réseau",
    salon: "Maison de la Beauté Africaine",
    location: "ACI 2000, Bamako (Mali)",
    avatar: "https://i.pravatar.cc/150?u=mariam",
    quote: "La comptabilité SYSCOHADA intégrée nous a évité les erreurs lors de notre contrôle fiscal. Tout est automatique : du ticket de caisse au Grand Livre.",
    rating: 5,
    tag: "100% Conforme SYSCOHADA"
  }
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-[#0A0603] text-white relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#F3E5AB] text-xs font-semibold mb-4">
            <Quote className="w-3.5 h-3.5 text-[#C8951E]" /> Retours d'Expérience Salons
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white mb-6">
            Adopté par les plus grands <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] to-[#C8951E]">
              Salons & Spas d'Afrique de l'Ouest
            </span>
          </h2>
          <p className="text-white/60 text-lg">
            Découvrez comment Kènè Pro transforme la gestion quotidienne et la rentabilité de nos salons partenaires.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#1A1410] border border-white/10 rounded-3xl p-8 flex flex-col justify-between hover:border-[#C8951E]/40 transition-colors relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#C8951E] fill-[#C8951E]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#C8951E]/10 text-[#F3E5AB] border border-[#C8951E]/20">
                    {t.tag}
                  </span>
                </div>

                <p className="text-white/80 text-sm leading-relaxed mb-8 italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-4 border-t border-white/5 pt-6 mt-auto">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#C8951E]/40" />
                <div>
                  <h4 className="font-bold text-white text-sm font-display">{t.name}</h4>
                  <p className="text-xs text-[#C8951E] font-medium">{t.role}</p>
                  <p className="text-[10px] text-white/40 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-white/30" /> {t.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
