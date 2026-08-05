'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Star, ShieldCheck, CheckCircle2, Eye, ArrowRight, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const TRANSFORMATIONS = [
  {
    id: 't_1',
    title: 'Traitement Hyperpigmentation PIH (Taches d\'Acné)',
    category: 'Visage & Dermo',
    duration: '30 Jours de Soin',
    practitioner: 'Fatou Koné',
    salon: 'Kènè Institut Cocody (Abidjan 🇨🇮)',
    phototype: 'Phototype V (Afro-Subsaharien)',
    activeIngredients: ['Bissap AHA (Hibiscus)', 'Niacinamide 5%', 'Baume Karité Brut'],
    scoreGain: '+48% d\'Éclat Cutané',
    beforeDesc: 'Hyperpigmentation marquée sur les joues suite à  des lésions d\'acné rétentionnelle.',
    afterDesc: 'Atténuation nette des macules pigmentaires et teint unifié sans hydroquinone.',
    certified: true,
    likes: 245,
    image: '/images/afro_beauty_hero_woman.jpg',
  },
  {
    id: 't_2',
    title: 'Régénération Cuir Chevelu & Alopécie de Traction',
    category: 'Capillaire & Nappy',
    duration: '45 Jours de Soin',
    practitioner: 'Aminata Diallo',
    salon: 'Kènè Afro Beauty Almadies (Dakar 🇸🇳)',
    phototype: 'Cheveux 4C Très Crépus',
    activeIngredients: ['Huile de Baobab Purifiée', 'Poudre de Chébé', 'Massage Stimulant Moringa'],
    scoreGain: '+62% de Densité Capillaire',
    beforeDesc: 'Recul de la ligne frontale suite à  des tresses trop serrées répétées.',
    afterDesc: 'Repousse visible des follicules sur la zone temporale et cuir chevelu apaisé.',
    certified: true,
    likes: 312,
    image: '/images/african_young_girl_hair.jpg',
  },
  {
    id: 't_3',
    title: 'Soin Hydratation & Grooming Barbe Homme Anti-Boutons',
    category: 'Visage & Homme',
    duration: '14 Jours de Soin',
    practitioner: 'Kady Coulibaly',
    salon: 'Kènè Botanique Bamako Coura (Bamako 🇲🇱)',
    phototype: 'Phototype VI (Peau Mélanoderme Sèche)',
    activeIngredients: ['Beurre de Karité Brut Filtré', 'Aloe Vera Pur', 'Gel Neem'],
    scoreGain: '+85% d\'Hydratation & Barbe Apaisée',
    beforeDesc: 'Desquamation sous la barbe et récurrence de boutons de rasage.',
    afterDesc: 'Barbe souple, peau sous-jacente saine et absence d\'inflammation.',
    certified: true,
    likes: 189,
    image: '/images/afro_man_dermo_care.jpg',
  },
];

export default function PortfolioPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [likes, setLikes] = useState<Record<string, number>>({
    t_1: 245,
    t_2: 312,
    t_3: 189,
  });

  const categories = ['Tous', 'Visage & Dermo', 'Capillaire & Nappy', 'Visage & Homme'];

  const filtered = selectedCategory === 'Tous'
    ? TRANSFORMATIONS
    : TRANSFORMATIONS.filter(t => t.category === selectedCategory);

  const toggleLike = (id: string) => {
    setLikes(prev => ({
      ...prev,
      [id]: prev[id] + 1
    }));
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#241C16] via-[#1A1410] to-[#0A0603] border border-[#C8951E]/30 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-bold text-[#C8951E] uppercase tracking-widest font-display flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#C8951E]" /> Portfolio & Résultats Certifiés par l'IA
          </span>
          <h1 className="font-display font-black text-2xl text-white">
            Galerie Avant / Après des Praticiennes Kènè
          </h1>
          <p className="text-xs text-white/60 font-sans max-w-xl">
            Découvrez les résultats réels obtenus par nos esthéticiennes et dermatologues partenaires en Afrique de l'Ouest. Photos certifiées non-retouchées.
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-display shrink-0 transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#C8951E] text-[#0F0A05] shadow-md shadow-[#C8951E]/20'
                : 'bg-[#1A1410] border border-white/10 text-white/60 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Transformations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1A1410] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-[#C8951E]/50 transition-all"
          >
            {/* Visual Photo Card */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={t.image} 
                alt={t.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1410] via-transparent to-black/30 p-3 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#C8951E] bg-[#0A0603]/80 border border-[#C8951E]/30 px-2.5 py-0.5 rounded-full font-mono backdrop-blur-md">
                    {t.duration}
                  </span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 backdrop-blur-md">
                    <CheckCircle2 className="w-3 h-3" /> Certifié IA
                  </span>
                </div>
              </div>
            </div>

            {/* Split Comparison Text Box */}
            <div className="p-4 bg-[#241C16]/50 border-b border-white/5 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-sans">
                <div className="bg-[#0A0603] p-2.5 rounded-xl border border-white/5">
                  <span className="font-mono text-[#C8951E] font-bold block text-[9px]">AVANT (J-0)</span>
                  <p className="text-white/60 mt-0.5 leading-tight">{t.beforeDesc}</p>
                </div>
                <div className="bg-[#0A0603] p-2.5 rounded-xl border border-emerald-500/20">
                  <span className="font-mono text-emerald-400 font-bold block text-[9px]">APRÈS ({t.duration})</span>
                  <p className="text-emerald-200/80 mt-0.5 leading-tight">{t.afterDesc}</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-5 space-y-3 flex-1">
              <div>
                <h3 className="font-display font-bold text-sm text-white group-hover:text-[#C8951E] transition-colors">
                  {t.title}
                </h3>
                <p className="text-[11px] text-white/40 font-sans mt-0.5">
                  Par <strong className="text-white/80">{t.practitioner}</strong> Â· {t.salon}
                </p>
              </div>

              {/* Gain Badge */}
              <div className="bg-[#C8951E]/10 border border-[#C8951E]/20 p-2.5 rounded-xl text-center">
                <span className="text-xs font-bold text-[#C8951E] font-display">
                  ✨ Résultat Obtenu : {t.scoreGain}
                </span>
              </div>

              {/* Ingredients Pills */}
              <div className="space-y-1">
                <span className="text-[9px] text-white/30 font-semibold uppercase">Actifs Botaniques Utilisés :</span>
                <div className="flex flex-wrap gap-1">
                  {t.activeIngredients.map((ing, idx) => (
                    <span key={idx} className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-white/70">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-4 border-t border-white/5 bg-[#140E0A] flex items-center justify-between gap-2">
              <button
                onClick={() => toggleLike(t.id)}
                className="flex items-center gap-1 text-xs text-white/60 hover:text-red-400 transition cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-red-500/20 text-red-400" />
                <span>{likes[t.id]}</span>
              </button>

              <Button
                onClick={() => router.push(`/appointments?service=${encodeURIComponent(t.title)}`)}
                className="bg-[#C8951E] hover:bg-[#C8951E]/90 text-[#0F0A05] font-bold text-xs py-2 px-3 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#C8951E]/10"
              >
                <span>Réserver ce Soin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
