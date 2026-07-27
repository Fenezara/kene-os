'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion as m } from 'framer-motion'
import { 
  Sparkles, ArrowLeft, MessageSquare, AlertOctagon, Check, 
  Info, Eye, ShieldAlert, Heart, Calendar, Download 
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Indicator {
  severity: number
  name: string
}

interface DiagnosisData {
  id: string
  photos: string[]
  scoreGlobal: number
  zone?: 'visage' | 'dos' | 'cuir_chevelu' | 'mains' | 'barbe' | 'naevi'
  subScores: {
    hydratation: number
    eclat: number
    sebum: number
    elasticite: number
  }
  indicators: Record<string, Indicator>
  recommendations: {
    routine: string[]
    ingredients: string[]
    lifestyle: string[]
  }
  dermatoReferral: boolean
  referralReason: string | null
}

export default function ResultsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [data, setData] = useState<DiagnosisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [spectralMode, setSpectralMode] = useState<'standard' | 'melanin' | 'vascular' | 'wood_uv' | 'cross_polarized'>('standard')
  const [sliderPos, setSliderPos] = useState(50)
  const [dermalDepth, setDermalDepth] = useState(50)

  // Octo-Spectral 2.0 States
  const [selectedPin, setSelectedPin] = useState<{ name: string; depth: string; severity: string; active: string; price: number; x: string; y: string } | null>(null)
  const [pinFilter, setPinFilter] = useState<'all' | 'pih' | 'pores' | 'vascular'>('all')
  const [audioLang, setAudioLang] = useState<'fr' | 'wo' | 'bm' | 'ba'>('fr')
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeTargetPos, setActiveTargetPos] = useState<{ x: string; y: string; title: string; color: string }>({
    x: '48%',
    y: '65%',
    title: 'Zone Hyperpigmentée PIH (27%)',
    color: '#C8951E'
  })

  const [clientPhoto, setClientPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPhoto = localStorage.getItem('kene_latest_client_photo');
      if (savedPhoto) setClientPhoto(savedPhoto);
    }
  }, []);

  const isDemoPhoto = (url?: string | null) => {
    if (!url) return true;
    return url.includes('skin_sample') || url.includes('afro_skin_spectral_scanner') || url.includes('dicebear');
  };

  const displayPhoto = (data?.photos && data.photos.length > 0 && !isDemoPhoto(data.photos[0]))
    ? data.photos[0]
    : (clientPhoto && !isDemoPhoto(clientPhoto)
        ? clientPhoto
        : (clientPhoto || data?.photos?.[0] || '/images/afro_skin_spectral_scanner.jpg'));

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/diagnoses/${id}`)
        if (!res.ok) throw new Error("Impossible de charger les résultats.")
        const json = await res.json()
        setData(json.diagnosis)

        if (json.diagnosis?.photos && json.diagnosis.photos.length > 0 && !isDemoPhoto(json.diagnosis.photos[0])) {
          setClientPhoto(json.diagnosis.photos[0]);
          if (typeof window !== 'undefined') {
            localStorage.setItem('kene_latest_client_photo', json.diagnosis.photos[0]);
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [id])

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-karite/60 min-h-[85vh]">
        <div className="w-8 h-8 border-4 border-gold-kene border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-sans">Chargement de votre bilan de peau...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 min-h-[85vh]">
        <AlertOctagon className="w-12 h-12 text-red-500" />
        <h3 className="font-display font-bold text-lg text-karite">Résultat introuvable</h3>
        <Button onClick={() => router.push('/')} className="bg-gold-kene text-[#1A1410]">
          Retour à l'accueil
        </Button>
      </div>
    )
  }

  // Helper for severity color
  const getSeverityBadge = (level: number) => {
    if (level === 0) return { label: 'Optimal', style: 'bg-green-500/10 text-green-400 border-green-500/20' }
    if (level === 1) return { label: 'Léger', style: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' }
    return { label: 'Marqué', style: 'bg-red-500/10 text-red-400 border-red-500/20' }
  }

  // Spectral View Filter CSS
  const getSpectralFilter = () => {
    if (spectralMode === 'melanin') {
      return 'contrast-[2.2] saturate-0 brightness-90 invert hue-rotate-180 drop-shadow-[0_0_8px_rgba(200,149,30,0.5)]'
    }
    if (spectralMode === 'vascular') {
      return 'sepia-100 hue-rotate-[310deg] saturate-[4.0] contrast-[1.6] brightness-75'
    }
    if (spectralMode === 'wood_uv') {
      return 'invert saturate-[3.0] hue-rotate-[220deg] contrast-[2.5] brightness-90'
    }
    if (spectralMode === 'cross_polarized') {
      return 'contrast-[2.8] saturate-[1.8] brightness-105 grayscale-[40%]'
    }
    return ''
  }

  return (
    <div className="flex-1 flex flex-col justify-between min-h-[85vh] text-karite font-sans">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-white/5 bg-[#1A1410]/90 sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/portal')}
            className="text-karite/60 hover:text-karite transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display font-bold text-lg text-gold-kene">Bilan Cutané</h1>
        </div>
        <button
          onClick={() => router.push(`/chat?diagnosisId=${data.id}`)}
          className="bg-gold-kene/10 border border-gold-kene/20 text-gold-kene text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 hover:bg-gold-kene/20 transition cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Mama Kènè AI
        </button>
      </header>

      <div className="p-6 space-y-8 flex-1">
        {/* Medical Referral Alert */}
        {data.dermatoReferral && (
          <m.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-red-950/40 border border-red-500/20 rounded-3xl p-5 space-y-3"
          >
            <div className="flex items-center gap-2.5 text-red-400">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span className="font-display font-bold text-sm">Vigilance Cutanée Requise</span>
            </div>
            <p className="text-xs text-karite/70 leading-relaxed">
              {data.referralReason || "Notre VLM a détecté une anomalie pigmentaire ou un grain de beauté asymétrique atypique. Nous vous recommandons vivement de consulter un dermatologue professionnel pour un examen clinique complet."}
            </p>
            <Button
              onClick={() => router.push('/appointments/new?type=dermato')}
              className="w-full bg-red-800 hover:bg-red-700 text-white font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Trouver un Dermatologue Partenaire
            </Button>
          </m.div>
        )}

        {/* Global Score & Spectral views */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Circular Score Gauge */}
          <div className="bg-[#241C16]/40 border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4">
            <h3 className="text-xs font-semibold text-karite/40 tracking-wider uppercase">Score Global de Santé</h3>
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#1A1410" strokeWidth="8" fill="transparent" />
                <m.circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#C8951E"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="251.2"
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - (251.2 * data.scoreGlobal) / 100 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-display font-bold text-gold-kene">{data.scoreGlobal}%</span>
                <span className="text-[10px] text-karite/40">Fitzpatrick V</span>
              </div>
            </div>
            <p className="text-xs text-karite/60 max-w-[200px] leading-relaxed">
              Barrière cutanée saine avec quelques zones d'attention pigmentaires.
            </p>
          </div>

          {/* VISIA-like Spectral Photo View */}
          <div className="bg-[#241C16]/40 border border-white/5 rounded-3xl p-5 space-y-4 flex flex-col justify-between">
            <h3 className="text-xs font-semibold text-karite/40 tracking-wider uppercase flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> Analyse Spectrale Clinique
            </h3>
            
            <div className="w-full aspect-square rounded-2xl overflow-hidden border border-white/5 bg-black relative">
              <img
                src={displayPhoto}
                alt="Capture Diagnostic"
                className={`w-full h-full object-cover transition-all duration-300 ${getSpectralFilter()}`}
              />

              {/* Filter labels overlays */}
              {spectralMode === 'melanin' && (
                <div className="absolute inset-0 bg-gold-kene/5 pointer-events-none mix-blend-color-dodge"></div>
              )}
            </div>

            {/* Filter controls tabs */}
            <div className="grid grid-cols-5 gap-1 bg-[#1A1410] p-1.5 rounded-xl text-center">
              {(['standard', 'melanin', 'vascular', 'wood_uv', 'cross_polarized'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setSpectralMode(mode);
                    if (mode === 'melanin') {
                      setActiveTargetPos({ x: '48%', y: '65%', title: 'Hyperpigmentation PIH (27%)', color: '#C8951E' });
                    } else if (mode === 'wood_uv') {
                      setActiveTargetPos({ x: '45%', y: '45%', title: 'Dilatation Sébacée Zone-T', color: '#00F0FF' });
                    } else if (mode === 'vascular') {
                      setActiveTargetPos({ x: '42%', y: '55%', title: 'Érythème & Congestion', color: '#FF3333' });
                    } else if (mode === 'cross_polarized') {
                      setActiveTargetPos({ x: '68%', y: '32%', title: 'Ridule Péri-Orbitaire', color: '#00FF66' });
                    } else {
                      setActiveTargetPos({ x: '50%', y: '50%', title: 'Vue Globale Derme', color: '#FFFFFF' });
                    }
                  }}
                  className={`text-[9px] py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                    spectralMode === mode 
                      ? 'bg-gold-kene text-[#1A1410] shadow-md font-bold' 
                      : 'text-karite/50 hover:text-karite bg-white/5'
                  }`}
                >
                  {mode === 'standard' ? 'Naturel' : mode === 'melanin' ? 'Mélanine' : mode === 'vascular' ? 'Vasculaire' : mode === 'wood_uv' ? 'Lumière UV' : '3D Relief'}
                </button>
              ))}
            </div>
          </div>

          {/* --- 1. HORLOGE BIO-MÉLANIQUE & ÂGE CUTANÉ SPECTRAL --- */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-gold-kene/10 via-[#241C16] to-[#1A1410] border border-gold-kene/30 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gold-kene/20 border border-gold-kene/40 flex items-center justify-center font-display font-black text-gold-kene text-xl shadow-inner">
                -6 ans
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-gold-kene uppercase tracking-wider block font-display">
                  ✨ Horloge Cutanée AI & Indice Bio-Mélanique
                </span>
                <p className="text-xs text-white font-bold font-sans">
                  Âge Civil : <span className="text-karite/60">34 ans</span> · Âge Cutané Spectral : <span className="text-emerald-400">28 ans</span>
                </p>
                <p className="text-[9px] text-karite/50 font-sans">
                  Peau régénérée grâce aux polyphénols du Moringa et aux rituels d'hydratation au Karité.
                </p>
              </div>
            </div>
            <button 
              onClick={() => window.print()} 
              className="px-3 py-2 bg-gold-kene text-[#1A1410] font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-gold-kene/90 transition cursor-pointer shrink-0 shadow-md"
            >
              <Download className="w-3.5 h-3.5" /> PDF
            </button>
          </div>

          {/* --- 2. CURSEUR INTERACTIF DE PROFONDEUR DERMIQUE 3D --- */}
          <div className="bg-[#1A1410] border border-white/10 p-4 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gold-kene uppercase tracking-wider font-display flex items-center gap-1.5">
                🗺️ Curseur de Profondeur Dermique 3D (Épiderme ➔ Derme Profond)
              </span>
              <span className="text-[10px] text-karite/60 font-mono">
                {dermalDepth < 35 ? 'Surface (Épiderme)' : dermalDepth < 70 ? 'Derme Moyen (Sébum & Pores)' : 'Derme Profond (Mélanine & UV)'}
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={dermalDepth} 
              onChange={(e) => setDermalDepth(parseInt(e.target.value))}
              className="w-full accent-[#C8951E] bg-white/10 rounded-lg h-2 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-karite/40 font-mono">
              <span>0% · Lumière Blanche</span>
              <span>50% · Zones Rouges & Pores</span>
              <span>100% · Taches UV & PIH</span>
            </div>
          </div>

          {/* --- 3. SYNTHÈSE VOCALE AUDIO IA "AWA" (4 LANGUES AFRIQUE) --- */}
          <div className="bg-[#1A1410] border border-gold-kene/30 p-4 rounded-2xl flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  setIsPlayingAudio(!isPlayingAudio);
                  if (!isPlayingAudio) {
                    const msg = new SpeechSynthesisUtterance(
                      audioLang === 'wo' ? "Naŋadef ! Nuyonal nañu sa skin analysis..." :
                      audioLang === 'bm' ? "I ni ce ! An bɛ i fari labɛn..." :
                      audioLang === 'ba' ? "Mo nian ! Kènè analyse wo su..." :
                      "Bonjour ! L'intelligence artificielle Awa a analysé vos 8 filtres spectraux. Nous avons détecté 2 zones d'hyperpigmentation localisées sur les pommettes et une sécheresse épidermique."
                    );
                    window.speechSynthesis?.speak(msg);
                  } else {
                    window.speechSynthesis?.cancel();
                  }
                }}
                className="w-12 h-12 rounded-2xl bg-gold-kene text-[#1A1410] flex items-center justify-center font-bold shadow-md hover:scale-105 transition cursor-pointer"
              >
                {isPlayingAudio ? '⏸️' : '🔊'}
              </button>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-gold-kene uppercase tracking-wider block font-display">
                  🎙️ Synthèse Vocale IA "Awa" (Explication Audio)
                </span>
                <p className="text-xs text-white font-semibold">
                  {isPlayingAudio ? 'Lecture audio en cours...' : 'Écouter l\'explication clinique de votre bilan'}
                </p>
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex gap-1 bg-white/5 p-1 rounded-xl">
              {(['fr', 'wo', 'bm', 'ba'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setAudioLang(lang)}
                  className={`text-[9px] font-bold px-2 py-1 rounded-lg uppercase transition cursor-pointer ${
                    audioLang === lang ? 'bg-gold-kene text-[#1A1410]' : 'text-karite/60 hover:text-white'
                  }`}
                >
                  {lang === 'fr' ? '🇫🇷 FR' : lang === 'wo' ? '🇸🇳 WO' : lang === 'bm' ? '🇲🇱 BM' : '🇨🇮 BA'}
                </button>
              ))}
            </div>
          </div>

          {/* --- 4. ANAMNÈSE OCTO-SPECTRALE 8 VUES (AVEC LOUPE 10X & FILTRES SÉLECTIFS) --- */}
          <div className="pt-2 space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-xs font-bold text-gold-kene uppercase tracking-wider font-display">
                🔬 Galerie Octo-Spectrale & Loupe Médicale 10x
              </span>

              {/* Layer Selector Chips */}
              <div className="flex gap-1 bg-white/5 p-1 rounded-xl text-[9px] font-bold">
                {[
                  { id: 'all', label: 'Tout' },
                  { id: 'pih', label: 'Taches PIH' },
                  { id: 'pores', label: 'Pores' },
                  { id: 'vascular', label: 'Vasculaire' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setPinFilter(f.id as any)}
                    className={`px-2 py-0.5 rounded-lg transition cursor-pointer ${
                      pinFilter === f.id ? 'bg-gold-kene text-[#1A1410]' : 'text-karite/50 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { name: 'Taches (27%)', type: 'pih', filter: '', label: 'Cyan', color: '#00F0FF', pins: data.zone === 'dos' ? [{ name: 'Acné Papuleuse Dorsale', depth: '0.4mm', severity: '2.9/3', active: 'Gel Moringa & Neem', price: 12500, x: '50%', y: '35%' }] : data.zone === 'cuir_chevelu' ? [{ name: 'Desquamation Vertex', depth: '0.2mm', severity: '2.6/3', active: 'Bain Huile Baobab', price: 14000, x: '50%', y: '30%' }] : data.zone === 'barbe' ? [{ name: 'Pseudofolliculite Menton', depth: '0.5mm', severity: '2.8/3', active: 'Sérum Niacinamide', price: 13500, x: '50%', y: '72%' }] : data.zone === 'mains' ? [{ name: 'Lentigines Solaires', depth: '0.3mm', severity: '2.3/3', active: 'Crème Mains Bissap', price: 14500, x: '50%', y: '50%' }] : data.zone === 'naevi' ? [{ name: 'Nævus Suspect ABCDE', depth: '0.8mm', severity: '3.0/3', active: 'Rendez-vous Dermatologue', price: 0, x: '50%', y: '50%' }] : [{ name: 'Comédon Ouvert #1', depth: '0.2mm - Épiderme', severity: '2.4/3', active: 'Moringa & Neem', price: 12000, x: '35%', y: '40%' }] },
                { name: 'Rides (87%)', type: 'all', filter: 'hue-rotate-90 brightness-110', label: 'Vert', color: '#00FF66', pins: data.zone === 'cuir_chevelu' ? [{ name: 'Traction Ligne Frontale', depth: '0.6mm', severity: '3.0/3', active: 'Sérum Chebe', price: 18500, x: '50%', y: '15%' }] : [{ name: 'Ride Péri-Orbitaire', depth: '0.6mm - Derme', severity: '1.8/3', active: 'Beurre de Karité Brut', price: 15000, x: '70%', y: '30%' }] },
                { name: 'Texture (60%)', type: 'all', filter: 'contrast-150 saturate-150', label: 'Or', color: '#FFD700', pins: [{ name: 'Zone Desquamation', depth: '0.1mm - Surface', severity: '2.1/3', active: 'Huile de Baobab', price: 14000, x: '45%', y: '50%' }] },
                { name: 'Pores (21%)', type: 'pores', filter: 'hue-rotate-[280deg]', label: 'Violet', color: '#9D00FF', pins: [{ name: 'Pore Dilaté Zone-T', depth: '0.4mm - Sébacé', severity: '2.9/3', active: 'Gel Nettoyant Neem', price: 9500, x: '40%', y: '45%' }] },
                { name: 'Taches UV', type: 'pih', filter: 'contrast-[2.5] saturate-0 invert', label: 'UV', color: '#FFFFFF', pins: [{ name: 'Dommage Solaire Profond', depth: '0.8mm - Derme Profond', severity: '3.0/3', active: 'Écran Minéral SPF50', price: 18000, x: '30%', y: '35%' }] },
                { name: 'Taches Brunes', type: 'pih', filter: 'sepia(100%) contrast(200%)', label: 'PIH', color: '#8A3B14', pins: [{ name: 'Tache Hyperpigmentée PIH', depth: '0.3mm - Jonction', severity: '2.8/3', active: 'Sérum Bissap (AHA)', price: 16500, x: '50%', y: '65%' }] },
                { name: 'Zones Rouges', type: 'vascular', filter: 'sepia(100%) hue-rotate(310deg) saturate(300%)', label: 'Vasculaire', color: '#FF3333', pins: [{ name: 'Capillaire Dilaté Erythème', depth: '0.5mm - Vasculaire', severity: '2.2/3', active: 'Baume Apaisant Aloe', price: 13500, x: '42%', y: '55%' }] },
                { name: 'Porphyrines', type: 'pores', filter: 'invert saturate(300%) hue-rotate(220deg)', label: 'Bactéries', color: '#FF00CC', pins: [{ name: 'Fluorescence C. acnes', depth: '0.3mm - Pilo-Sébacé', severity: '2.7/3', active: 'Poudre Moringa Détox', price: 11000, x: '48%', y: '40%' }] },
              ].filter(item => pinFilter === 'all' || item.type === pinFilter).map((item, idx) => (
                <div key={idx} className="bg-[#1A1410] border border-white/5 p-2 rounded-xl text-center space-y-1 group hover:border-gold-kene/40 transition relative">
                  <div className="relative w-full h-20 rounded-lg overflow-hidden bg-black/60 flex items-center justify-center">
                    <img 
                      src={displayPhoto} 
                      alt={item.name} 
                      className={`w-full h-full object-cover transition-all duration-300 ${item.filter}`}
                      style={{ opacity: 0.4 + (dermalDepth / 160) }}
                    />



                    <span className="absolute bottom-1 right-1 text-[8px] font-bold px-1.5 py-0.5 rounded bg-black/80 text-white font-mono" style={{ borderLeft: `2px solid ${item.color}` }}>
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-white block font-display truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* --- 5. LOUPE MÉDICALE 10X & POPOVER PRESCRIPTION 1-CLICK --- */}
          {selectedPin && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <div className="bg-[#1A1410] border border-gold-kene/40 p-6 rounded-3xl w-full max-w-sm space-y-4 shadow-2xl relative">
                <button 
                  onClick={() => setSelectedPin(null)}
                  className="absolute top-4 right-4 text-karite/40 hover:text-white text-xs font-mono"
                >
                  ✕ Fermer
                </button>

                <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                  <div className="w-12 h-12 rounded-2xl bg-gold-kene/20 border border-gold-kene/40 flex items-center justify-center text-xl">
                    🔍
                  </div>
                  <div>
                    <span className="text-[9px] text-gold-kene font-mono uppercase font-bold block">Zoom Médical 10x</span>
                    <h3 className="font-display font-bold text-sm text-white">{selectedPin.name}</h3>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-sans">
                  <div className="flex justify-between bg-white/5 p-2 rounded-xl">
                    <span className="text-karite/60">Profondeur Derme:</span>
                    <span className="font-mono text-gold-kene font-bold">{selectedPin.depth}</span>
                  </div>
                  <div className="flex justify-between bg-white/5 p-2 rounded-xl">
                    <span className="text-karite/60">Indice de Sévérité:</span>
                    <span className="font-mono text-emerald-400 font-bold">{selectedPin.severity}</span>
                  </div>
                  <div className="bg-gradient-to-r from-gold-kene/10 to-transparent p-3 rounded-xl border border-gold-kene/20 space-y-1">
                    <span className="text-[10px] font-bold text-gold-kene uppercase block">Actif Botanique Recommandé:</span>
                    <span className="font-bold text-white text-xs block">{selectedPin.active}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setAddedToCart(true);
                    setTimeout(() => setAddedToCart(false), 2000);
                  }}
                  className="w-full py-3 bg-gold-kene text-[#1A1410] font-bold rounded-2xl text-xs flex items-center justify-center gap-2 hover:bg-gold-kene/90 transition shadow-lg cursor-pointer"
                >
                  {addedToCart ? '✅ Ordonnance Ajoutée au Panier !' : `🛒 Prescription 1-Click (${selectedPin.price.toLocaleString()} FCFA)`}
                </button>
              </div>
            </div>
          )}

          {/* --- 4. MATCHING PRÉDICTIF & FORMULES BOTANIQUES AFRIQUE --- */}
          <div className="bg-[#1A1410] border border-gold-kene/20 p-4 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gold-kene uppercase tracking-wider font-display flex items-center gap-1.5">
                🧪 Prescription Sur-Mesure d'Actifs Botaniques Africains
              </span>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                100% Naturel & Équitable
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                <span className="text-gold-kene font-bold block">🌺 Hibiscus / Bissap (AHA) + Niacinamide</span>
                <p className="text-[10px] text-karite/60 font-sans">
                  Action ciblée sur l'Hyperpigmentation (PIH 27%) : exfolie les cellules pigmentées en douceur.
                </p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                <span className="text-emerald-400 font-bold block">🌳 Huile de Baobab de Tambacounda</span>
                <p className="text-[10px] text-karite/60 font-sans">
                  Action ciblée sur la Sécheresse & Barrière (82%) : relipide le derme profond en omégas 3, 6 et 9.
                </p>
              </div>
            </div>
          </div>

          {/* --- 5. SIMULATEUR PRÉDICTIF À 90 JOURS --- */}
          <div className="bg-[#241C16]/50 border border-white/5 p-4 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-display flex items-center gap-1.5">
                🔮 Simulateur d'Évolution Cutanée à 90 Jours
              </span>
              <span className="text-[10px] text-gold-kene font-mono">IA Prédictive</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#1A1410] border border-red-500/20 p-3 rounded-xl space-y-1">
                <span className="text-red-400 font-bold text-[11px] block">❌ Sans Soin Adapté</span>
                <p className="text-[10px] text-karite/50 font-sans">Accentuation des taches PIH (+24%) et accentuation des ridules solaires.</p>
              </div>
              <div className="bg-[#1A1410] border border-emerald-500/30 p-3 rounded-xl space-y-1">
                <span className="text-emerald-400 font-bold text-[11px] block">✅ Protocole Kènè Pro</span>
                <p className="text-[10px] text-karite/70 font-sans">Atténuation des taches de -78%, grain de peau lissé et hydratation optimale.</p>
              </div>
            </div>
          </div>
        </div>

        {/* The Glow Garden Metaphor */}
        <div className="bg-[#241C16]/30 border border-white/5 rounded-3xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-display font-bold text-base text-gold-kene">Le Jardin du Glow</h3>
              <p className="text-[11px] text-karite/40">Métaphore botanique de votre état cutané</p>
            </div>
            <Heart className="w-5 h-5 text-sunset" />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2">
            {/* Moringa Plant (Hydration) */}
            <div className="bg-[#1A1410]/50 border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center space-y-3">
              <svg className={`w-10 h-10 transition-transform duration-500 ${data.subScores.hydratation < 60 ? 'rotate-12' : ''}`} viewBox="0 0 100 100">
                {/* Stem */}
                <path d="M 50,90 Q 48,50 50,15" stroke="#4A6B3D" strokeWidth="4" fill="none" />
                {/* Leaves */}
                <path d="M 50,40 Q 20,30 20,40 Q 35,45 50,45" fill={data.subScores.hydratation > 60 ? "#8FAB76" : "#7A8C63"} />
                <path d="M 50,40 Q 80,30 80,40 Q 65,45 50,45" fill={data.subScores.hydratation > 60 ? "#8FAB76" : "#7A8C63"} />
                <path d="M 50,60 Q 30,50 30,60 Q 40,65 50,65" fill={data.subScores.hydratation > 60 ? "#8FAB76" : "#7A8C63"} />
                <path d="M 50,60 Q 70,50 70,60 Q 60,65 50,65" fill={data.subScores.hydratation > 60 ? "#8FAB76" : "#7A8C63"} />
              </svg>
              <div className="space-y-0.5">
                <span className="text-[10px] text-karite/40 block">Moringa</span>
                <span className="text-xs font-semibold text-karite block">Hydratation</span>
                <span className="text-[10px] text-gold-kene">{data.subScores.hydratation}%</span>
              </div>
            </div>

            {/* Baobab Plant (Fermete/Elasticity) */}
            <div className="bg-[#1A1410]/50 border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center space-y-3">
              <svg className="w-10 h-10" viewBox="0 0 100 100">
                {/* Thick trunk */}
                <path d="M 40,90 L 45,35 Q 50,30 55,35 L 60,90 Z" fill="#6E5041" />
                {/* Lush crown */}
                <circle cx="50" cy="30" r={data.subScores.elasticite > 70 ? "16" : "11"} fill="#3D5A34" />
                <circle cx="40" cy="35" r={data.subScores.elasticite > 70 ? "12" : "9"} fill="#3D5A34" />
                <circle cx="60" cy="35" r={data.subScores.elasticite > 70 ? "12" : "9"} fill="#3D5A34" />
              </svg>
              <div className="space-y-0.5">
                <span className="text-[10px] text-karite/40 block">Baobab</span>
                <span className="text-xs font-semibold text-karite block">Élasticité</span>
                <span className="text-[10px] text-gold-kene">{data.subScores.elasticite}%</span>
              </div>
            </div>

            {/* Hibiscus Plant (Eclat) */}
            <div className="bg-[#1A1410]/50 border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center space-y-3">
              <svg className="w-10 h-10" viewBox="0 0 100 100">
                {/* Thin curved stem */}
                <path d="M 50,90 Q 55,60 48,35" stroke="#4A6B3D" strokeWidth="2.5" fill="none" />
                {/* Hibiscus Bloom */}
                {data.subScores.eclat > 65 ? (
                  <>
                    <circle cx="48" cy="30" r="10" fill="#E25C80" />
                    <circle cx="40" cy="30" r="8" fill="#E25C80" />
                    <circle cx="56" cy="30" r="8" fill="#E25C80" />
                    <circle cx="48" cy="22" r="8" fill="#E25C80" />
                    <circle cx="48" cy="38" r="8" fill="#E25C80" />
                    <circle cx="48" cy="30" r="3" fill="#FFD700" />
                  </>
                ) : (
                  // Closed bud
                  <ellipse cx="48" cy="32" rx="5" ry="8" fill="#E25C80" />
                )}
              </svg>
              <div className="space-y-0.5">
                <span className="text-[10px] text-karite/40 block">Hibiscus</span>
                <span className="text-xs font-semibold text-karite block">Éclat</span>
                <span className="text-[10px] text-gold-kene">{data.subScores.eclat}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2x4 Indicators severity grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-karite/40 tracking-wider uppercase">Fiche Cutanée (10 Marqueurs)</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(data.indicators).map(([key, indicator]) => {
              const badge = getSeverityBadge(indicator.severity)
              return (
                <div
                  key={key}
                  onClick={() => {
                    if (key.toLowerCase().includes('pih') || key.toLowerCase().includes('melasma') || key.toLowerCase().includes('tache')) {
                      setSpectralMode('melanin');
                      setPinFilter('pih');
                    } else if (key.toLowerCase().includes('pore') || key.toLowerCase().includes('acne') || key.toLowerCase().includes('seborrhee')) {
                      setSpectralMode('wood_uv');
                      setPinFilter('pores');
                    } else if (key.toLowerCase().includes('rouge') || key.toLowerCase().includes('erytheme')) {
                      setSpectralMode('vascular');
                      setPinFilter('vascular');
                    } else {
                      setSpectralMode('standard');
                      setPinFilter('all');
                    }
                    window.scrollTo({ top: 180, behavior: 'smooth' });
                  }}
                  className="bg-[#241C16]/40 border border-white/5 hover:border-gold-kene/50 transition-all cursor-pointer rounded-2xl p-4 flex flex-col justify-between space-y-2 group"
                >
                  <span className="text-xs font-medium text-karite/80 group-hover:text-gold-kene transition-colors font-sans block leading-tight flex items-center justify-between">
                    <span>{indicator.name}</span>
                    <span className="text-[10px] text-gold-kene font-mono opacity-0 group-hover:opacity-100 transition-opacity">🎯 Cibler</span>
                  </span>
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] border px-2 py-0.5 rounded-full font-semibold ${badge.style}`}>
                      {badge.label}
                    </span>
                    <span className="text-[10px] text-karite/30">Niveau {indicator.severity}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* --- COMPARATIF AVANT / APRÈS INTERACTIF --- */}
        <div className="bg-[#241C16]/40 border border-white/5 rounded-3xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-base text-gold-kene flex items-center gap-2">
              <Eye className="w-5 h-5 text-gold-kene" /> Évolution Avant / Après (Soin & Routine)
            </h3>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-semibold">
              +42% d'amélioration globale
            </span>
          </div>

          {/* Interactive Slider Container */}
          <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-white/10 select-none bg-black/40">
            {/* After Image (Full width background) */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#241C16] to-[#0A0603] flex items-center justify-center">
              <div className="text-center space-y-1">
                <span className="text-3xl">✨</span>
                <p className="text-xs font-bold text-emerald-400 font-display">Après : Peau Nourrie & Unifiée (J-30)</p>
                <p className="text-[10px] text-karite/40 font-sans">Score d'Éclat : 88/100 · Hydratation : 82%</p>
              </div>
            </div>

            {/* Before Image (Clipped overlay based on slider) */}
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-br from-[#362A21] to-[#1A1410] border-r-2 border-gold-kene flex items-center justify-center overflow-hidden transition-all duration-75"
              style={{ width: `${sliderPos}%` }}
            >
              <div className="text-center space-y-1 w-[320px]">
                <span className="text-3xl">🔍</span>
                <p className="text-xs font-bold text-gold-kene font-display">Avant : Diagnostic Initial (J-0)</p>
                <p className="text-[10px] text-karite/40 font-sans">Score d'Éclat : {data.scoreGlobal}/100 · Hyperpigmentation marquée</p>
              </div>
            </div>

            {/* Center Slider Divider Bar */}
            <div 
              className="absolute inset-y-0 w-1 bg-gold-kene cursor-ew-resize flex items-center justify-center"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-7 h-7 rounded-full bg-gold-kene text-[#1A1410] flex items-center justify-center shadow-lg font-bold text-xs font-mono">
                ↔
              </div>
            </div>

            {/* Labels */}
            <span className="absolute bottom-2 left-2 text-[9px] font-bold bg-black/70 text-gold-kene px-2 py-0.5 rounded-md backdrop-blur-sm">
              J-0 (Avant)
            </span>
            <span className="absolute bottom-2 right-2 text-[9px] font-bold bg-black/70 text-emerald-400 px-2 py-0.5 rounded-md backdrop-blur-sm">
              J-30 (Après)
            </span>
          </div>

          {/* Slider Range Control */}
          <div className="space-y-1">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="w-full accent-gold-kene cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-karite/40 font-sans">
              <span>Glissez pour comparer l'évolution du grain de peau</span>
              <span>Position : {sliderPos}%</span>
            </div>
          </div>
        </div>

        {/* --- HISTORIQUE & SUIVI CHRONOLOGIQUE (TIMELINE) --- */}
        <div className="bg-[#241C16]/40 border border-white/5 rounded-3xl p-6 space-y-4">
          <h3 className="font-display font-bold text-base text-gold-kene flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold-kene" /> Chronologie des Soins & Progrès
          </h3>
          <div className="space-y-3">
            {[
              { date: '15 Juillet 2026', title: 'Soin Visage Hydratant Karité (Salon)', change: 'Hydratation +24%', icon: '🌿', status: 'Complété' },
              { date: '01 Juillet 2026', title: 'Diagnostic IA Initial & Routine Sérum Baobab', change: 'Hyperpigmentation -15%', icon: '🔬', status: 'Complété' },
              { date: 'Aujourd\'hui', title: 'Bilan d\'Évolution Cutanée 30 Jours', change: 'Score Éclat 88/100', icon: '✨', status: 'Actif' },
            ].map((step, idx) => (
              <div key={idx} className="flex gap-3 items-start p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-xl">{step.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-white font-display">{step.title}</p>
                    <span className="text-[9px] font-mono text-gold-kene bg-gold-kene/10 px-2 py-0.5 rounded-full">{step.change}</span>
                  </div>
                  <p className="text-[10px] text-karite/50 font-sans mt-0.5">{step.date} · Statut : {step.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- INNOVATION 1: PROTOCOLE DE SÈVRE BOTANIQUE ("WEANING PROTOCOL") --- */}
        <div className="bg-gradient-to-r from-amber-950/40 to-[#1A1410] border border-amber-500/30 rounded-3xl p-6 space-y-3 shadow-lg">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-sm text-amber-400 flex items-center gap-2">
              🛡️ Protocole de Sèvre Cutanée & Réparation Barrière
            </h3>
            <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
              Post-Dépigmentation & Peaux Fragilisées
            </span>
          </div>
          <p className="text-xs text-karite/70 leading-relaxed font-sans">
            Pour les épidermes ayant subi des nettoyants décapants ou crèmes éclaircissantes antérieures, notre VLM a calibré un **protocole de sèvre progressive** à base de Beurre de Karité brut purifié et de Niacinamide afin de reconstruire le film hydrolipidique sans rebond de mélanine.
          </p>
          <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
            <div className="bg-black/30 p-2.5 rounded-xl border border-amber-500/20">
              <span className="text-amber-400 font-bold block">Phase 1 (Jours 1 à 14)</span>
              <span className="text-white/60 font-sans">Stop total des actifs décapants · Karité pur 100% bio</span>
            </div>
            <div className="bg-black/30 p-2.5 rounded-xl border border-amber-500/20">
              <span className="text-amber-400 font-bold block">Phase 2 (Jours 15 à 30)</span>
              <span className="text-white/60 font-sans">Introduction douce du Sérum Bissap AHA 2x par semaine</span>
            </div>
          </div>
        </div>

        {/* --- INNOVATION 2: CALCULATEUR DE POSOLOGIE & MICRO-DOSAGE BOTANIQUE --- */}
        <div className="bg-[#241C16]/50 border border-gold-kene/30 rounded-3xl p-6 space-y-4 shadow-lg">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-base text-gold-kene flex items-center gap-2">
              🧪 Posologie & Micro-Dosage Botanique Quotidien
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-0.5 rounded-full font-bold">
              Dosage sur-mesure
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-[#1A1410] p-4 rounded-2xl border border-white/5 space-y-2">
              <span className="text-gold-kene font-bold flex items-center gap-1.5 font-display">
                ☀️ Routine du Matin (Protection & Sébum)
              </span>
              <ul className="space-y-1.5 text-karite/70 text-[11px] font-sans">
                <li>• <strong>1 Noisette (2g)</strong> : Gel Nettoyant Doux Moringa & Neem</li>
                <li>• <strong>2 Gouttes</strong> : Huile de Baobab de Tambacounda (Scellement)</li>
                <li>• <strong>1 Noisette (1.5g)</strong> : Écran Minéral SPF 50+ Incolore</li>
              </ul>
            </div>
            <div className="bg-[#1A1410] p-4 rounded-2xl border border-white/5 space-y-2">
              <span className="text-[#E25C80] font-bold flex items-center gap-1.5 font-display">
                🌙 Routine du Soir (Régénération & Éclat)
              </span>
              <ul className="space-y-1.5 text-karite/70 text-[11px] font-sans">
                <li>• <strong>3 Gouttes</strong> : Sérum Concentré Bissap AHA (Taches PIH)</li>
                <li>• <strong>1 Noisette (3g)</strong> : Baume Réparateur Karité & Aloe Vera</li>
              </ul>
            </div>
          </div>
        </div>

        {/* --- INNOVATION 3: GÉOLOCALISATION CLIMATIQUE & MÉTEO CUTANÉE --- */}
        <div className="bg-gradient-to-r from-cyan-950/40 via-[#1A1410] to-[#241C16] border border-cyan-500/30 rounded-3xl p-5 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-xs text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              🌤️ Adaptateur Climat & Humidité UEMOA en Temps Réel
            </h3>
            <span className="text-[9px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded-full font-bold">
              Abidjan · 85% Humidité
            </span>
          </div>
          <p className="text-xs text-white/80 leading-relaxed font-sans">
            💡 <strong>Conseil Climatologue Kènè</strong> : En zone côtière chaude et humide (Abidjan, Cotonou, Douala), privilégiez la texture fluide du Gel Moringa le matin pour éviter l'obstruction des pores, et appliquez le Baume Karité uniquement le soir.
          </p>
        </div>

        {/* --- INNOVATION 4 & 5: ORDONNANCE BOTANIQUE OFFICIELLE AVEC QR CODE --- */}
        <div className="bg-[#1A1410] border-2 border-dashed border-gold-kene/40 rounded-3xl p-6 space-y-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-gold-kene uppercase tracking-widest block font-display">
                📜 Ordonnance Clinique Botanique Kènè Pro
              </span>
              <h4 className="font-display font-bold text-white text-base mt-0.5">
                Prescription N° KENE-2026-{data.id.substring(0, 6).toUpperCase()}
              </h4>
            </div>
            <div className="w-14 h-14 bg-white p-1 rounded-xl flex items-center justify-center shadow-lg">
              {/* QR Code SVG */}
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="#FFFFFF" />
                <path d="M 10,10 L 40,10 L 40,40 L 10,40 Z M 20,20 L 30,20 L 30,30 L 20,30 Z" fill="#000000" />
                <path d="M 60,10 L 90,10 L 90,40 L 60,40 Z M 70,20 L 80,20 L 80,30 L 70,30 Z" fill="#000000" />
                <path d="M 10,60 L 40,60 L 40,90 L 10,90 Z M 20,70 L 30,70 L 30,80 L 20,80 Z" fill="#000000" />
                <rect x="50" y="50" width="15" height="15" fill="#000000" />
                <rect x="70" y="65" width="20" height="10" fill="#000000" />
              </svg>
            </div>
          </div>

          <div className="text-xs text-white/70 space-y-1 font-sans border-t border-white/10 pt-3">
            <p><strong>Bénéficiaire :</strong> Client Kènè Pro · Phototype V (Afro-Subsaharien)</p>
            <p><strong>Institut Partenaire :</strong> Kènè Dermo-Aesthetic Spa & Institut</p>
            <p><strong>Validité Mobile Money :</strong> Retrait immédiat ou livraison express via Wave / Orange Money</p>
          </div>
        </div>

        {/* Recommendations Routine block */}
        <div className="bg-[#241C16]/40 border border-white/5 rounded-3xl p-6 space-y-5">
          <h3 className="font-display font-bold text-base text-gold-kene flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-kene" /> Routine Botanique Recommandée
          </h3>
          
          <div className="space-y-4 text-sm">
            {data.recommendations.routine.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-gold-kene/10 border border-gold-kene/20 flex items-center justify-center text-gold-kene shrink-0 text-xs font-bold font-display mt-0.5">
                  {i + 1}
                </div>
                <p className="text-xs text-karite/80 leading-relaxed font-sans">{step}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-4 space-y-2.5">
            <span className="text-[11px] text-karite/40 font-semibold uppercase block">Ingrédients Actifs</span>
            <div className="flex flex-wrap gap-2">
              {data.recommendations.ingredients.map((ing, i) => (
                <span key={i} className="bg-baobab/10 text-baobab border border-baobab/10 text-[10px] px-2.5 py-1 rounded-lg font-medium">
                  {ing}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <footer className="p-6 bg-[#1A1410]/90 border-t border-white/5 sticky bottom-0 z-30 backdrop-blur-md flex flex-col gap-2.5 print:hidden">
        <Button
          onClick={() => router.push(`/appointments?diagnosisId=${data.id}&service=${encodeURIComponent(data.recommendations.routine[0] || 'Soin Botanique Clarifiant Moringa')}`)}
          className="w-full bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410] font-bold py-3 rounded-2xl flex items-center justify-center gap-2 font-display cursor-pointer shadow-lg shadow-gold-kene/20 text-xs"
        >
          <Calendar className="w-4 h-4" />
          📅 Réserver mon Soin avec une Praticienne (Basé sur ce Bilan)
        </Button>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push(`/customizer?diagnosisId=${data.id}`)}
            className="flex-1 border border-gold-kene/30 bg-gold-kene/10 hover:bg-gold-kene/20 text-gold-kene text-xs font-semibold py-2.5 rounded-2xl cursor-pointer transition flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Formuler Soin Sur-Mesure
          </Button>
          <Button
            onClick={() => router.push(`/chat?diagnosisId=${data.id}&mode=dr_diallo`)}
            className="flex-1 border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold py-2.5 rounded-2xl cursor-pointer transition flex items-center justify-center gap-1.5"
          >
            🩺 Dr. Dermatologue IA
          </Button>
        </div>
      </footer>
    </div>
  )
}
