'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Camera, RefreshCw, Scissors, Sparkle, ShoppingBag,
  Sliders, Check, Heart, Shield, ArrowRight, ArrowLeft, Play, Layers, Eye
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// Modern African Hairstyles Catalog 2026/2027 (Women & Men)
const HAIRSTYLES_CATALOG = [
  {
    id: 'fulani_gold',
    gender: 'femme',
    name: 'Fulani Braids Royales avec Perles d\'Or & Cauris',
    category: 'Tresses & Braids',
    price: '25 000 FCFA',
    duration: '2h30',
    image: '/images/african_young_girl_hair.jpg',
    tags: ['Best-Seller 👑', 'Tresses Royales', 'Accessoires Cauris'],
    desc: 'Tresses peulh sculptées sur-mesure avec perles dorées d\'or 24K et cauris naturels. Protection des tempes.',
    filterStyle: 'brightness(1.05) contrast(1.08) saturate(1.15)',
  },
  {
    id: 'knotless_honey',
    gender: 'femme',
    name: 'Knotless Braids Jumbo Miel & Karité',
    category: 'Tresses & Braids',
    price: '20 000 FCFA',
    duration: '2h00',
    image: '/images/afro_beauty_hero_woman.jpg',
    tags: ['Tendance 2026 ⭐', 'Zéro Tension', 'Fini Miel'],
    desc: 'Tresses sans nœuds hyper légères scellées à l\'huile de Baobab pour zéro traction sur le cuir chevelu.',
    filterStyle: 'sepia(0.25) saturate(1.2) contrast(1.05)',
  },
  {
    id: 'bantu_knots',
    gender: 'femme',
    name: 'Bantu Knots Sculpturaux Dermo-Protégés',
    category: 'Locks & Knots',
    price: '18 000 FCFA',
    duration: '1h30',
    image: '/images/african_spa_ritual_hero.jpg',
    tags: ['Tradition Futuriste', 'Soin Cuir Chevelu'],
    desc: 'Nœuds bantous traditionnels remis au goût du jour, hydratés au beurre de Karité brut de Korhogo.',
    filterStyle: 'contrast(1.1) brightness(1.02)',
  },
  {
    id: 'waves_360',
    gender: 'homme',
    name: 'Waves 360° & Barbe Sculptée au Baobab',
    category: 'Homme & Contour',
    price: '15 000 FCFA',
    duration: '1h00',
    image: '/images/afro_man_dermo_care.jpg',
    tags: ['Homme VIP 🦁', 'Waves 360°', 'Barbe Sculpteur'],
    desc: 'Ondulations 360° définies avec pommade naturelle au beurre de Mangue & contours laser de barbe.',
    filterStyle: 'contrast(1.12) saturate(1.05)',
  },
  {
    id: 'taper_dreadlocks',
    gender: 'homme',
    name: 'Taper Fade & Dreadlocks Courtes Sculptées',
    category: 'Homme & Contour',
    price: '18 000 FCFA',
    duration: '1h15',
    image: '/images/botanical_laboratory_africa.jpg',
    tags: ['Style Afro-Futuriste', 'Taper Gradient'],
    desc: 'Dégradé à blanc américain combiné avec vanilles courtes sculptées et scellées au gel d\'Aloe Vera.',
    filterStyle: 'sepia(0.15) brightness(1.05)',
  },
];

// Melanated Skin Foundations (Fitzpatrick IV to VI)
const SKIN_FOUNDATIONS = [
  { id: 'sikasso_miel', name: 'Sikasso Miel Doré', hex: '#C8951E', phototype: 'Phototype IV', tone: 'Chaud & Ambré' },
  { id: 'korhogo_cacao', name: 'Korhogo Cacao Intense', hex: '#5A3617', phototype: 'Phototype V', tone: 'Neutre Profond' },
  { id: 'abidjan_ebene', name: 'Abidjan Ébène Majestueux', hex: '#2A170A', phototype: 'Phototype VI', tone: 'Riche & Sombre' },
  { id: 'dakar_cannelle', name: 'Dakar Cannelle Solaire', hex: '#8A5C0A', phototype: 'Phototype IV', tone: 'Doré Brillant' },
  { id: 'bamako_bronze', name: 'Bamako Bronze Impérial', hex: '#7A481B', phototype: 'Phototype V', tone: 'Warm Golden' },
];

// AR Glow & Botanicals Filters
const AR_FILTERS = [
  { id: 'glow_24k', name: '🌟 Glow Or Solaire 24K', desc: 'Illuminateur poussière d\'or & éclat dermo-mélanique', style: 'drop-shadow(0 0 15px rgba(255,215,0,0.4)) saturate(1.2)' },
  { id: 'karite_mat', name: '🌿 Fini Mat Karité-Baobab', desc: 'Grain lissé, anti-brillance & pores resserrés', style: 'brightness(1.04) contrast(1.06) saturate(0.95)' },
  { id: 'bissap_rosy', name: '🌺 Éclat Bissap & Niacinamide', desc: 'Effet bonne mine rafraîchissant & hydratant', style: 'sepia(0.2) saturate(1.3) hue-rotate(-10deg)' },
  { id: 'bogolan_sculpt', name: '🤎 Contouring Bogolan Bronze', desc: 'Pommettes sculptées & teints chaleureux d\'Afrique', style: 'contrast(1.15) saturate(1.1)' },
];

export default function ARMirrorPage() {
  const { toast } = useToast();
  const [selectedGender, setSelectedGender] = useState<'all' | 'femme' | 'homme'>('all');
  const [selectedHairstyle, setSelectedHairstyle] = useState<any>(HAIRSTYLES_CATALOG[0]);
  const [selectedFoundation, setSelectedFoundation] = useState<any>(SKIN_FOUNDATIONS[1]);
  const [selectedFilter, setSelectedFilter] = useState<any>(AR_FILTERS[0]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'coiffures' | 'makeup' | 'filtres'>('coiffures');
  const [compareSlider, setCompareSlider] = useState(50);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load photo from local storage if available
  useEffect(() => {
    const photo = localStorage.getItem('kene_latest_client_photo');
    if (photo) setUserPhoto(photo);
  }, []);

  const toggleCamera = async () => {
    if (isCameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
        toast({
          title: "📹 Caméra AR Activée !",
          description: "Le miroir virtuel analyse votre visage en direct.",
        });
      } catch (err) {
        toast({
          title: "Mode Démo Photo",
          description: "Utilisation du cliché haute définition dermo-mélanique.",
        });
      }
    }
  };

  const handleCustomPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setUserPhoto(base64);
      localStorage.setItem('kene_latest_client_photo', base64);
      toast({
        title: "📸 Cliché Personnalisé Chargé !",
        description: "L'essayage AR s'applique sur votre propre photo.",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleBookLook = () => {
    toast({
      title: `✨ Réservation pour "${selectedHairstyle.name}" !`,
      description: "Le style sélectionné a été ajouté à votre panier avec les recommandations dermo-cosmétiques.",
    });
    setTimeout(() => {
      window.location.href = `/checkout?service=${encodeURIComponent(selectedHairstyle.name)}`;
    }, 1200);
  };

  const filteredHairstyles = HAIRSTYLES_CATALOG.filter(
    h => selectedGender === 'all' || h.gender === selectedGender
  );

  return (
    <div className="min-h-screen bg-[#110C07] text-white p-4 sm:p-6 lg:p-8 font-sans space-y-6 max-w-7xl mx-auto pb-24">
      
      {/* ── HEADER NAVIGATION & TITLE ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/portal">
              <Button variant="outline" size="sm" className="h-8 border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl text-xs gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Portail Cliente
              </Button>
            </Link>
            <Badge className="bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/40 text-[10px] font-mono font-bold">
              👑 Exclusivité Plan Élite Royal
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-white flex items-center gap-2.5 tracking-tight">
            <span>🪞 Miroir Virtuel AR & Essayage 3D Afro-Beauty</span>
          </h1>
          <p className="text-xs sm:text-sm text-white/60 font-sans max-w-2xl">
            Simulez en Réalité Augmentée les coiffures africaines 2026/2027 (Femme & Homme), les teints dermo-mélaniques et les finis botaniques Karité & Baobab.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            onClick={toggleCamera}
            className={`rounded-2xl text-xs font-bold gap-2 shadow-xl border cursor-pointer ${
              isCameraActive
                ? 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30'
                : 'bg-gradient-to-r from-[#FFD700] to-[#C8951E] text-black font-black border-[#FFD700]'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>{isCameraActive ? 'Désactiver Caméra' : 'Activer Ma Caméra AR'}</span>
          </Button>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleCustomPhotoUpload}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-2xl text-xs font-bold gap-1.5"
          >
            <span>📸 Charger ma photo</span>
          </Button>
        </div>
      </div>

      {/* ── AR MIRROR SIMULATION MAIN CONTAINER ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT COLUMN: LIVE AR VIEWPORT & BEFORE/AFTER SLIDER (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="bg-[#181109] border-2 border-[#FFD700]/50 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="relative aspect-[4/3] w-full bg-[#0F0A05] overflow-hidden flex items-center justify-center">
              
              {/* LIVE CAMERA FEED OR HIGH-RES PHOTO SIMULATION */}
              {isCameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100 transition-all duration-300"
                  style={{ filter: `${selectedFilter.style} ${selectedHairstyle.filterStyle}` }}
                />
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={userPhoto || selectedHairstyle.image}
                    alt="Visage Client AR"
                    className="w-full h-full object-cover transition-all duration-500"
                    style={{ filter: `${selectedFilter.style} ${selectedHairstyle.filterStyle}` }}
                  />

                  {/* Dynamic Mesh & Keypoint Overlay Grid */}
                  <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.15)_0%,transparent_70%)]" />
                  
                  {/* Simulated AR Keypoints */}
                  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-[#FFD700]/30 rounded-full animate-pulse pointer-events-none flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFD700] shadow-lg shadow-[#FFD700]" />
                  </div>
                </div>
              )}

              {/* OVERLAY BADGES ON AR VIEWPORT */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                <Badge className="bg-black/70 text-[#FFD700] backdrop-blur-md border border-[#FFD700]/40 font-mono text-[11px] px-3 py-1 flex items-center gap-1.5 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Tracking Facial AR Active</span>
                </Badge>

                <div className="flex items-center gap-2">
                  <Badge className="bg-black/70 text-white backdrop-blur-md border border-white/20 font-mono text-[10px]">
                    Phototype V · Abidjan 🇨🇮
                  </Badge>
                </div>
              </div>

              {/* OVERLAY BOTTOM TIER DETAILS */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-between text-xs z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FFD700]/20 border border-[#FFD700]/40 flex items-center justify-center text-lg shrink-0">
                    👑
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{selectedHairstyle.name}</span>
                      <span className="text-[#FFD700] font-mono text-[11px]">{selectedHairstyle.price}</span>
                    </div>
                    <div className="text-[10px] text-white/60 font-mono flex items-center gap-2">
                      <span>Teint : <strong style={{ color: selectedFoundation.hex }}>{selectedFoundation.name}</strong></span>
                      <span>•</span>
                      <span>Filtre : {selectedFilter.name}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleBookLook}
                  size="sm"
                  className="bg-gradient-to-r from-[#FFD700] to-[#C8951E] text-black font-black text-xs rounded-xl shadow-lg hover:scale-105 transition cursor-pointer"
                >
                  Prendre RDV 💇‍♀️
                </Button>
              </div>
            </div>
          </Card>

          {/* SLIDER COMPARATIF AVANT / APRÈS AR */}
          <Card className="bg-[#181109] border border-white/10 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono font-bold text-white/70 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#FFD700]" /> Curseurs de Comparaison AR
              </span>
              <span className="font-mono text-[10px] text-[#FFD700]">Avant ({100 - compareSlider}%) vs Après ({compareSlider}%)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={compareSlider}
              onChange={(e) => setCompareSlider(Number(e.target.value))}
              className="w-full accent-[#FFD700] cursor-pointer"
            />
          </Card>
        </div>

        {/* RIGHT COLUMN: CATALOG & AR SELECTION PANEL (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* CATEGORY TAB SELECTOR */}
          <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-[#181109] border border-white/10 rounded-2xl text-xs font-bold font-mono">
            <button
              onClick={() => setActiveTab('coiffures')}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'coiffures'
                  ? 'bg-gradient-to-r from-[#FFD700] to-[#C8951E] text-black font-black shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" /> Coiffures 2026
            </button>
            <button
              onClick={() => setActiveTab('makeup')}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'makeup'
                  ? 'bg-gradient-to-r from-[#FFD700] to-[#C8951E] text-black font-black shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Teints & Makeup
            </button>
            <button
              onClick={() => setActiveTab('filtres')}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'filtres'
                  ? 'bg-gradient-to-r from-[#FFD700] to-[#C8951E] text-black font-black shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Finis Botaniques
            </button>
          </div>

          {/* TAB 1: COIFFURES AFRICAINES 2026/2027 (FEMME & HOMME) */}
          {activeTab === 'coiffures' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white/50">Filtrer par genre :</span>
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-[10px] font-mono">
                  {(['all', 'femme', 'homme'] as const).map(g => (
                    <button
                      key={g}
                      onClick={() => setSelectedGender(g)}
                      className={`px-2.5 py-1 rounded-lg capitalize transition cursor-pointer ${
                        selectedGender === g ? 'bg-[#FFD700] text-black font-bold' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {g === 'all' ? 'Tous' : g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1 scrollbar-none">
                {filteredHairstyles.map((hair) => {
                  const isSelected = selectedHairstyle.id === hair.id;
                  return (
                    <div
                      key={hair.id}
                      onClick={() => setSelectedHairstyle(hair)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? 'bg-[#24170D] border-2 border-[#FFD700] shadow-lg shadow-[#FFD700]/15'
                          : 'bg-[#181109] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10 relative">
                        <img src={hair.image} alt={hair.name} className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#FFD700]/20 flex items-center justify-center">
                            <Check className="w-5 h-5 text-white font-bold" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="text-xs font-bold text-white truncate font-display">{hair.name}</span>
                          <span className="text-xs font-mono font-bold text-[#FFD700] shrink-0">{hair.price}</span>
                        </div>
                        <p className="text-[10px] text-white/50 leading-tight line-clamp-2">{hair.desc}</p>
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          {hair.tags.map((t, idx) => (
                            <span key={idx} className="text-[8px] font-mono font-bold bg-white/5 border border-white/10 px-1.5 py-0.2 rounded-md text-[#F3E5AB]">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: TEINTS & MAKEUP DERMO-MÉLANIQUE */}
          {activeTab === 'makeup' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#181109] border border-white/10 space-y-3">
                <div className="text-xs font-mono font-bold text-[#FFD700] uppercase tracking-wider">
                  Nuancier Fond de Teint Hydratant Karité-Niacinamide
                </div>
                <div className="space-y-2">
                  {SKIN_FOUNDATIONS.map((found) => {
                    const isSelected = selectedFoundation.id === found.id;
                    return (
                      <div
                        key={found.id}
                        onClick={() => setSelectedFoundation(found)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected ? 'border-[#FFD700] bg-[#FFD700]/10' : 'border-white/5 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-6 h-6 rounded-full border border-white/20 shadow-md shrink-0"
                            style={{ backgroundColor: found.hex }}
                          />
                          <div>
                            <div className="text-xs font-bold text-white">{found.name}</div>
                            <div className="text-[9px] text-white/40 font-mono">{found.tone}</div>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono bg-white/10 px-2 py-0.5 rounded-full text-[#F3E5AB]">
                          {found.phototype}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ROUGES À LÈVRES & GLOSS HIBISCUS */}
              <div className="p-4 rounded-2xl bg-[#181109] border border-white/10 space-y-2">
                <div className="text-xs font-mono font-bold text-[#FFD700] uppercase tracking-wider">
                  Gloss Botanique & Rouges Dermo-Protecteurs
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: 'Gloss Bissap 🌺', color: '#8A1C14' },
                    { name: 'Nude Karité 🥜', color: '#8A5C0A' },
                    { name: 'Rouge Bogolan 🤎', color: '#4A1B07' },
                  ].map((lip, i) => (
                    <button
                      key={i}
                      onClick={() => toast({ title: `💄 Teinte "${lip.name}" appliquée`, description: "Appliquée sur l'overlay AR." })}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#FFD700] flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <span className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: lip.color }} />
                      <span className="text-[9px] font-bold text-white/80 truncate w-full text-center">{lip.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FINIS BOTANIQUES & FILTRES AR */}
          {activeTab === 'filtres' && (
            <div className="space-y-2.5">
              {AR_FILTERS.map((filt) => {
                const isSelected = selectedFilter.id === filt.id;
                return (
                  <div
                    key={filt.id}
                    onClick={() => setSelectedFilter(filt)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                      isSelected
                        ? 'bg-[#24170D] border-2 border-[#FFD700] shadow-lg'
                        : 'bg-[#181109] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white font-display">{filt.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#FFD700]" />}
                    </div>
                    <p className="text-[10px] text-white/60 font-sans">{filt.desc}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* BOOKING ACTION BOX */}
          <Card className="bg-gradient-to-br from-[#24170D] to-[#150D06] border-2 border-[#FFD700]/60 rounded-3xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFD700]/20 border border-[#FFD700]/40 flex items-center justify-center text-xl shrink-0">
                👑
              </div>
              <div>
                <div className="text-xs font-bold text-white font-display">Prise de RDV Cabine en 1-Clic</div>
                <div className="text-[10px] text-white/60">Coiffure & Soin Dermo-Botanique Assorti</div>
              </div>
            </div>
            <Button
              onClick={handleBookLook}
              className="w-full h-11 bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black text-sm rounded-2xl shadow-xl hover:scale-[1.02] transition cursor-pointer"
            >
              Réserver ce Look en Institut ({selectedHairstyle.price})
            </Button>
          </Card>

        </div>
      </div>
    </div>
  );
}
