'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, Phone, Clock, Calendar, Search, ShieldCheck, ChevronRight, Sparkles, Navigation, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

const SALONS = [
  {
    id: 'salon_1',
    name: 'Kènè Dermo-Spa & Institut Cocody',
    city: 'Abidjan 🇨🇮',
    address: 'Avenue Jean Mermoz, Cocody Rue des Jardins',
    phone: '+225 07 08 09 10 11',
    rating: 4.9,
    reviewsCount: 128,
    specialties: ['Dermo-Cosmétique', 'Soins Karité', 'Acne PIH'],
    practitioners: [
      { name: 'Fatou Koné', role: 'Esthéticienne Experte', avatar: '👩🏾‍⚕️' },
      { name: 'Dr. Diallo', role: 'Dermatologue IA & Partenaire', avatar: '🩺' },
    ],
    openingHours: '08:30 - 19:30',
    distance: '1.2 km',
    certified: true,
  },
  {
    id: 'salon_2',
    name: 'Kènè Afro Beauty Almadies',
    city: 'Dakar 🇸🇳',
    address: 'Route des Almadies, en face du Ngor Diarama',
    phone: '+221 77 123 45 67',
    rating: 4.8,
    reviewsCount: 94,
    specialties: ['Tresses & Braids', 'Cuir Chevelu', 'Baobab Scellement'],
    practitioners: [
      { name: 'Aminata Diallo', role: 'Spécialiste Capillaire Nappy', avatar: '💇🏾‍♀️' },
    ],
    openingHours: '09:00 - 20:00',
    distance: '3.5 km',
    certified: true,
  },
  {
    id: 'salon_3',
    name: 'Kènè Botanique Bamako Coura',
    city: 'Bamako 🇲🇱',
    address: 'Quartier du Fleuve, Rue 312',
    phone: '+223 66 77 88 99',
    rating: 4.9,
    reviewsCount: 76,
    specialties: ['Soin Anti-Harmattan', 'Neem Purifiant', 'Bissap Éclat'],
    practitioners: [
      { name: 'Kady Coulibaly', role: 'Praticienne Botanique', avatar: '🌿' },
    ],
    openingHours: '08:00 - 19:00',
    distance: '4.8 km',
    certified: true,
  },
  {
    id: 'salon_4',
    name: 'Kènè Beauty Lounge Ouaga 2000',
    city: 'Ouagadougou 🇧🇫',
    address: 'Zone Ambassades, Ouaga 2000',
    phone: '+226 70 00 11 22',
    rating: 4.7,
    reviewsCount: 52,
    specialties: ['Massage Karité Brut', 'Soin Éclat Visage'],
    practitioners: [
      { name: 'Mariam Sawadogo', role: 'Esthéticienne Dermo', avatar: '💆🏾‍♀️' },
    ],
    openingHours: '09:00 - 19:00',
    distance: '6.1 km',
    certified: true,
  },
];

export default function SalonsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('Tous');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('Toutes');

  const filteredSalons = SALONS.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'Tous' || s.city.includes(selectedCity);
    const matchesSpecialty = selectedSpecialty === 'Toutes' || s.specialties.includes(selectedSpecialty);
    return matchesSearch && matchesCity && matchesSpecialty;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#241C16] via-[#1A1410] to-[#0A0603] border border-[#C8951E]/30 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#C8951E] uppercase tracking-widest font-display flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#C8951E]" /> Carte & Annuaire Certifié Kènè
            </span>
          </div>
          <h1 className="font-display font-black text-2xl text-white">
            Trouvez votre Salon Partenaire le Plus Proche
          </h1>
          <p className="text-xs text-white/60 font-sans max-w-xl">
            Géolocalisez les instituts certifiés Kènè en Côte d'Ivoire, Sénégal, Mali & Burkina Faso pour réaliser vos rituels botaniques et rencontrer nos praticiennes expertes.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-white/40" />
          <Input
            placeholder="Rechercher un salon, un quartier ou une ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#1A1410] border-white/10 text-white text-xs pl-10 rounded-2xl h-11 focus:border-[#C8951E]"
          />
        </div>

        {/* City Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['Tous', 'Abidjan', 'Dakar', 'Bamako', 'Ouagadougou'].map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold font-display shrink-0 transition cursor-pointer ${
                selectedCity === city
                  ? 'bg-[#C8951E] text-[#0F0A05] shadow-md shadow-[#C8951E]/20'
                  : 'bg-[#1A1410] border border-white/10 text-white/60 hover:text-white'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Map Visual Simulation */}
      <div className="bg-[#1A1410] border border-white/10 rounded-3xl p-4 relative overflow-hidden h-48 flex items-center justify-center shadow-lg">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#C8951E 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
        <div className="text-center space-y-2 relative z-10">
          <div className="w-12 h-12 rounded-full bg-[#C8951E]/20 border border-[#C8951E]/50 flex items-center justify-center text-[#C8951E] mx-auto animate-bounce">
            <Navigation className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-white font-display">
            {filteredSalons.length} Salons Partenaires Géolocalisés dans votre Périmètre
          </p>
          <span className="text-[10px] text-white/40 block font-sans">
            Itinéraire en 1-clic via Google Maps / Yango
          </span>
        </div>
      </div>

      {/* Salons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSalons.map((salon) => (
          <motion.div
            key={salon.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1A1410]/80 border border-white/10 hover:border-[#C8951E]/50 transition-all rounded-3xl p-5 space-y-4 shadow-xl relative group"
          >
            {/* Top row */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#C8951E] font-mono bg-[#C8951E]/10 px-2.5 py-0.5 rounded-full border border-[#C8951E]/20">
                  {salon.city}
                </span>
                <h3 className="font-display font-bold text-base text-white group-hover:text-[#C8951E] transition-colors mt-1">
                  {salon.name}
                </h3>
              </div>
              <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-xl text-amber-400 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{salon.rating}</span>
                <span className="text-[9px] text-white/40">({salon.reviewsCount})</span>
              </div>
            </div>

            {/* Address & distance */}
            <div className="space-y-1.5 text-xs text-white/70 font-sans">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C8951E] shrink-0" />
                <span className="truncate">{salon.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-white/40 shrink-0" />
                <span>{salon.openingHours} · Distance : {salon.distance}</span>
              </p>
            </div>

            {/* Practitioners Bar */}
            <div className="border-t border-white/5 pt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/40 font-semibold uppercase">Praticiennes :</span>
                <div className="flex items-center gap-1.5">
                  {salon.practitioners.map((p, i) => (
                    <span key={i} className="text-xs bg-white/5 px-2 py-0.5 rounded-lg border border-white/5 text-white/80 flex items-center gap-1" title={`${p.name} - ${p.role}`}>
                      <span>{p.avatar}</span>
                      <span className="text-[10px] font-bold">{p.name.split(' ')[0]}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Button
                onClick={() => router.push(`/appointments?salonId=${salon.id}`)}
                className="flex-1 bg-[#C8951E] hover:bg-[#C8951E]/90 text-[#0F0A05] font-bold text-xs py-2.5 rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#C8951E]/10"
              >
                <Calendar className="w-3.5 h-3.5" />
                Réserver en Cabine
              </Button>
              <Button
                onClick={() => router.push(`/boutique?clickAndCollect=${salon.id}`)}
                className="border border-white/10 bg-transparent hover:bg-white/5 text-white text-xs font-semibold py-2.5 rounded-2xl cursor-pointer transition flex items-center justify-center gap-1.5"
              >
                🛍️ Click & Collect
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
