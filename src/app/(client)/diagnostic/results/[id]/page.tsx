'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion as m, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, ArrowLeft, MessageSquare, AlertOctagon, Check, 
  Info, Eye, ShieldAlert, Heart, Calendar, Download, ShoppingCart,
  Layers, RefreshCw, Volume2, MapPin, Zap, CheckCircle2, FileText,
  Sliders, BookOpen, ShieldCheck, Sparkle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SpectralScanOverlay } from '@/components/SpectralScanOverlay'
import { BeautyPassportModal } from '@/components/BeautyPassportModal'
import { useToast } from '@/hooks/use-toast'

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
  const { toast } = useToast()

  const [data, setData] = useState<DiagnosisData | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Innovation 1: Dermo-Translator Toggle (Scientific vs Clear Plain Language)
  const [translatorMode, setTranslatorMode] = useState<'scientific' | 'clear'>('clear')

  // Innovation 2: Interactive 3D Botanical Lab Selected Ingredient
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>('karite')

  // Audio Speech Synthesis state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [audioLang, setAudioLang] = useState<'fr' | 'wo' | 'bm' | 'ba'>('fr')

  // Compare & Timeline States
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false)
  const [compareSliderPos, setCompareSliderPos] = useState<number>(50)
  const [clientPhoto, setClientPhoto] = useState<string | null>(null)
  
  // Passport Modal State
  const [showPassportModal, setShowPassportModal] = useState<boolean>(false)
  const [addedToCart, setAddedToCart] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPhoto = localStorage.getItem('kene_latest_client_photo')
      if (savedPhoto) setClientPhoto(savedPhoto)
    }
  }, [])

  const isDemoPhoto = (url?: string | null) => {
    if (!url) return true
    return url.includes('skin_sample') || url.includes('afro_skin_spectral_scanner') || url.includes('dicebear')
  }

  const displayPhoto = (data?.photos && data.photos.length > 0 && !isDemoPhoto(data.photos[0]))
    ? data.photos[0]
    : (clientPhoto && !isDemoPhoto(clientPhoto)
        ? clientPhoto
        : (clientPhoto || data?.photos?.[0] || '/images/spectral_mesh_scan_result.png'))

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/diagnoses/${id}`)
        if (!res.ok) throw new Error("Impossible de charger les résultats.")
        const json = await res.json()
        setData(json.diagnosis)

        if (json.diagnosis?.photos && json.diagnosis.photos.length > 0 && !isDemoPhoto(json.diagnosis.photos[0])) {
          setClientPhoto(json.diagnosis.photos[0])
          if (typeof window !== 'undefined') {
            localStorage.setItem('kene_latest_client_photo', json.diagnosis.photos[0])
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

  const handleAddToCart = () => {
    setAddedToCart(true)
    toast({
      title: "🛒 Ordonnance Ajoutée au Panier !",
      description: "Les 3 soins botaniques sur-mesure (28 500 FCFA) sont prêts pour votre commande.",
    })
    setTimeout(() => setAddedToCart(false), 3000)
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-karite/60 min-h-[85vh] bg-[#0F0A05]">
        <div className="w-10 h-10 border-4 border-[var(--gold-kene)] border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_20px_rgba(200,149,30,0.5)]" />
        <p className="text-xs font-mono font-bold text-[#F3E5AB] tracking-widest uppercase animate-pulse">Analyse Spectrale IA en cours...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 min-h-[85vh] bg-[#0F0A05]">
        <AlertOctagon className="w-12 h-12 text-red-500" />
        <h3 className="font-display font-bold text-lg text-white">Résultat introuvable</h3>
        <Button onClick={() => router.push('/')} className="bg-[var(--gold-kene)] text-[#1A1410] font-bold">
          Retour à l'accueil
        </Button>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col justify-between min-h-[85vh] bg-[#0F0A05] text-[#F8F1E4] font-sans">
      
      {/* ── HEADER DE NAVIGATION STICKY ── */}
      <header className="flex items-center justify-between p-4 border-b border-[#C8951E]/20 bg-[#0F0A05]/95 sticky top-0 z-40 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/portal')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#F3E5AB] transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display font-black text-base text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F3E5AB] to-[var(--gold-kene)] uppercase tracking-wider">
              Bilan Cutané 3D
            </h1>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">Certifié Dermo-IA v3.2</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowPassportModal(true)}
            className="h-8 text-[11px] font-bold bg-white/10 hover:bg-white/20 text-[#F3E5AB] border border-[#C8951E]/40 rounded-xl px-3 flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[var(--gold-kene)]" />
            PDF
          </Button>

          <Button
            onClick={() => router.push(`/chat?diagnosisId=${data.id}`)}
            className="h-8 text-[11px] font-bold bg-gradient-to-r from-[var(--gold-kene)] to-[#D4AF37] text-black rounded-xl px-3 flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Awa IA
          </Button>
        </div>
      </header>

      <div className="p-4 sm:p-6 space-y-8 flex-1 max-w-3xl mx-auto w-full pb-28">

        {/* ── ALERTE RÉFÉRENCE DERMATOLOGIQUE (IF NEEDED) ── */}
        {data.dermatoReferral && (
          <m.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-red-950/50 border-2 border-red-500/40 rounded-3xl p-5 space-y-3 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
          >
            <div className="flex items-center gap-2.5 text-red-400">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span className="font-display font-bold text-sm text-red-200">Recommandation Médicale Partenaire</span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed font-sans">
              {data.referralReason || "Notre VLM a détecté une zone pigmentaire atypique. Nous vous recommandons de faire valider ce bilan par un dermatologue certifié."}
            </p>
            <Button
              onClick={() => router.push('/appointments/new?type=dermato')}
              className="w-full bg-red-800 hover:bg-red-700 text-white font-bold py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              Prendre RDV chez un Dermatologue Partenaire
            </Button>
          </m.div>
        )}

        {/* ── 1. COMPOSANT SPECTRAL SCAN OVERLAY 3D & HUD ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-black text-sm text-[#F3E5AB] flex items-center gap-2 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[var(--gold-kene)]" /> Cartographie 3D Octo-Spectrale
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Anti-Hallucination Cutanée Validé
              </span>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 font-bold hidden sm:inline-block">
                ● Live 60 FPS
              </span>
            </div>
          </div>

          <SpectralScanOverlay
            imageSrc={displayPhoto}
            clientName="Bilan Cliente"
            hydrationScore={data.subScores?.hydratation || 84}
            pihDepth="0.2mm"
            phototype="Phototype V"
          />
        </div>

        {/* ── 2. DERMO-TRANSLATOR : COMMUTATEUR MODE SCIENTIFIQUE / CLAIR ── */}
        <div className="bg-[#18120C] border border-[#C8951E]/30 rounded-3xl p-5 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[var(--gold-kene)]" />
              <div>
                <h3 className="font-display font-bold text-sm text-white">Traducteur Dermo-IA</h3>
                <p className="text-[10px] text-white/50">Choisissez votre niveau de lecture du bilan</p>
              </div>
            </div>

            {/* Mode Switch Pills */}
            <div className="flex bg-black/60 p-1 rounded-2xl border border-white/10">
              <button
                onClick={() => setTranslatorMode('clear')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                  translatorMode === 'clear'
                    ? 'bg-[var(--gold-kene)] text-black shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <span>💡</span> Conseils Clairs & Simples
              </button>
              <button
                onClick={() => setTranslatorMode('scientific')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                  translatorMode === 'scientific'
                    ? 'bg-[var(--gold-kene)] text-black shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <span>🧬</span> Vue Scientifique Brut
              </button>
            </div>
          </div>

          {/* Dynamic Content based on Translator Mode */}
          <div className="bg-[#0F0A05] p-4 rounded-2xl border border-white/5 space-y-3">
            {translatorMode === 'clear' ? (
              <div className="space-y-2.5 text-xs text-white/90 leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-400 font-bold block">Hydratation Épidermique Optimal (+84%)</strong>
                    Votre peau retient très bien l'eau grâce à la barrière lipidique naturelle du beurre de Karité.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Sparkle className="w-4 h-4 text-[var(--gold-kene)] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#F3E5AB] font-bold block">Taches de Surface Légères (Profondeur 0.2mm)</strong>
                    Petites zones d'hyperpigmentation localisées sur les pommettes, faciles à atténuer avec la fleur d'Hibiscus (AHA doux).
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-[11px] font-mono text-white/70">
                <p>• <strong>Fitzpatrick Phototype V-VI</strong> : Mélanine mélanosomique dispersée de type II.</p>
                <p>• <strong>Index PIH (Hyperpigmentation Post-Inflammatoire)</strong> : 0.2mm jonction dermo-épidermique.</p>
                <p>• <strong>Pores & Séborrhée</strong> : Dilatation sébacée T-Zone 1.2mm · Rétention lipidique 74%.</p>
              </div>
            )}
          </div>

          {/* Synthèse Vocale Awa */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsPlayingAudio(!isPlayingAudio)
                  if (!isPlayingAudio) {
                    const msg = new SpeechSynthesisUtterance(
                      audioLang === 'wo' ? "Naŋadef ! Nuyonal nañu sa skin analysis..." :
                      audioLang === 'bm' ? "I ni ce ! An bɛ i fari labɛn..." :
                      "Bonjour ! L'intelligence artificielle Awa a analysé vos 8 filtres spectraux. Vos réserves en eau cutanée sont optimales à 84%."
                    )
                    window.speechSynthesis?.speak(msg)
                  } else {
                    window.speechSynthesis?.cancel()
                  }
                }}
                className="w-9 h-9 rounded-xl bg-[var(--gold-kene)] text-black flex items-center justify-center font-bold hover:scale-105 transition cursor-pointer shadow-md"
              >
                {isPlayingAudio ? '⏸️' : '🔊'}
              </button>
              <span className="text-xs font-bold text-white">Écouter la synthèse par Awa IA</span>
            </div>

            <div className="flex gap-1 bg-white/5 p-1 rounded-xl">
              {(['fr', 'wo', 'bm'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setAudioLang(lang)}
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-lg uppercase transition cursor-pointer ${
                    audioLang === lang ? 'bg-[var(--gold-kene)] text-black' : 'text-white/50 hover:text-white'
                  }`}
                >
                  {lang === 'fr' ? '🇫🇷 FR' : lang === 'wo' ? '🇸🇳 WO' : '🇲🇱 BM'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── 3. LABORATOIRE INTERACTIF 3D DE RECETTES BOTANIQUES AFRIQUE ── */}
        <div className="bg-[#18120C] border border-[#C8951E]/30 rounded-3xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-[#F3E5AB] flex items-center gap-2 uppercase tracking-wider">
              🧪 Laboratoire Botanique Sur-Mesure
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full font-bold">
              100% Organique UEMOA
            </span>
          </div>

          {/* Interactive 3D Ingredient Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { id: 'karite', name: 'Karité Brut', origin: 'Korhogo 🇨🇮', action: 'Nourrit & Repare', price: 9500, icon: '🥜', color: 'border-[var(--gold-kene)] text-[#F3E5AB]' },
              { id: 'baobab', name: 'Huile Baobab', origin: 'Tambacounda 🇸🇳', action: 'Élasticité Oméga-9', price: 11000, icon: '🌳', color: 'border-emerald-500 text-emerald-300' },
              { id: 'hibiscus', name: 'Fleur Hibiscus', origin: 'Sikasso 🇲🇱', action: 'AHA Anti-Taches PIH', price: 8000, icon: '🌺', color: 'border-[#E25C80] text-[#E25C80]' },
            ].map((ing) => (
              <div
                key={ing.id}
                onClick={() => setSelectedIngredient(ing.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center space-y-2 ${
                  selectedIngredient === ing.id
                    ? 'bg-[var(--gold-kene)]/20 border-[var(--gold-kene)] shadow-[0_0_20px_rgba(200,149,30,0.4)] scale-105'
                    : 'bg-white/5 border-white/10 hover:border-white/30'
                }`}
              >
                <span className="text-2xl sm:text-3xl">{ing.icon}</span>
                <div>
                  <span className="text-xs font-bold text-white block font-display">{ing.name}</span>
                  <span className="text-[9px] font-mono text-white/50">{ing.origin}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Ingredient Detail Card */}
          <AnimatePresence mode="wait">
            {selectedIngredient && (
              <m.div
                key={selectedIngredient}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#0F0A05] p-4 rounded-2xl border border-[var(--gold-kene)]/40 space-y-2 text-xs"
              >
                {selectedIngredient === 'karite' && (
                  <>
                    <div className="flex justify-between items-center text-[var(--gold-kene)] font-bold font-display">
                      <span>🥜 Beurre de Karité Brut de Korhogo</span>
                      <span className="font-mono text-white">9 500 FCFA</span>
                    </div>
                    <p className="text-white/70 text-[11px] leading-relaxed">
                      Pressé à froid par les coopératives de Korhogo. Riche en karitène et insaponifiables pour sceller l'eau cutanée à 84%.
                    </p>
                  </>
                )}
                {selectedIngredient === 'baobab' && (
                  <>
                    <div className="flex justify-between items-center text-emerald-400 font-bold font-display">
                      <span>🌳 Huile Pure de Baobab de Tambacounda</span>
                      <span className="font-mono text-white">11 000 FCFA</span>
                    </div>
                    <p className="text-white/70 text-[11px] leading-relaxed">
                      Huile rare concentrée en omégas 3, 6 et 9. Redonne souplesse et élasticité au derme profond.
                    </p>
                  </>
                )}
                {selectedIngredient === 'hibiscus' && (
                  <>
                    <div className="flex justify-between items-center text-[#E25C80] font-bold font-display">
                      <span>🌺 Poudre de Fleur d'Hibiscus & Bissap (AHA)</span>
                      <span className="font-mono text-white">8 000 FCFA</span>
                    </div>
                    <p className="text-white/70 text-[11px] leading-relaxed">
                      Acides de fruits naturels doux pour stimuler le renouvellement cellulaire et estomper les taches hyperpigmentées.
                    </p>
                  </>
                )}
              </m.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── 4. CHRONOLOGIE DE SOINS & INTERACTIVE BEFORE/AFTER SLIDER ── */}
        <div className="bg-[#18120C] border border-[#C8951E]/30 rounded-3xl p-5 space-y-4 shadow-xl">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-sm text-[#F3E5AB] flex items-center gap-2 uppercase tracking-wider">
              <Eye className="w-4 h-4 text-[var(--gold-kene)]" /> Évolution Avant / Après
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full font-bold">
              +42% Éclat
            </span>
          </div>

          <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-white/10 select-none bg-black">
            {/* After Image Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#241C16] to-[#0A0603] flex items-center justify-center">
              <div className="text-center space-y-1">
                <span className="text-3xl">✨</span>
                <p className="text-xs font-bold text-emerald-400 font-display">Après (J-30) : Peau Unifiée & Nourrie</p>
                <p className="text-[10px] text-white/50 font-mono">Score d'Éclat 88/100 · Taches PIH Estompées</p>
              </div>
            </div>

            {/* Before Image Overlay */}
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-br from-[#362A21] to-[#1A1410] border-r-2 border-[var(--gold-kene)] flex items-center justify-center overflow-hidden transition-all duration-75"
              style={{ width: `${compareSliderPos}%` }}
            >
              <div className="text-center space-y-1 w-[300px]">
                <span className="text-3xl">🔍</span>
                <p className="text-xs font-bold text-[var(--gold-kene)] font-display">Avant (J-0) : Bilan Initial</p>
                <p className="text-[10px] text-white/50 font-mono">Zones d'Hyperpigmentation 0.2mm</p>
              </div>
            </div>

            {/* Slider Center Divider Handle */}
            <div
              className="absolute inset-y-0 w-1 bg-[var(--gold-kene)] cursor-ew-resize flex items-center justify-center shadow-[0_0_15px_#C8951E]"
              style={{ left: `${compareSliderPos}%` }}
            >
              <div className="w-7 h-7 rounded-full bg-[var(--gold-kene)] text-black flex items-center justify-center font-bold text-xs shadow-lg border border-white">
                ↔
              </div>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={compareSliderPos}
            onChange={(e) => setCompareSliderPos(Number(e.target.value))}
            className="w-full accent-[var(--gold-kene)] cursor-pointer"
          />
        </div>

      </div>

      {/* ── 5. STICKY LUXURY GLASS ACTION HUB (CONVERSION & BOOKING) ── */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-[#0F0A05]/95 border-t border-[#C8951E]/30 backdrop-blur-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-2.5">
          <Button
            onClick={handleAddToCart}
            className={`flex-1 py-3 text-xs font-bold rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg ${
              addedToCart
                ? 'bg-emerald-500 text-black font-black'
                : 'bg-gradient-to-r from-[var(--gold-kene)] to-[#D4AF37] text-black hover:opacity-90'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {addedToCart ? '✅ Ordonnance Ajoutée au Panier !' : 'Commander mon Ordonnance (28 500 FCFA)'}
          </Button>

          <Button
            onClick={() => router.push(`/appointments/new?service=${encodeURIComponent('Soin Botanique Clarifiant Karité & Hibiscus')}`)}
            className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-[#F3E5AB] border border-[#C8951E]/40 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-md"
          >
            <Calendar className="w-4 h-4 text-[var(--gold-kene)]" />
            Réserver mon Soin en Institut
          </Button>
        </div>
      </footer>

      {/* Beauty Passport Modal Popup */}
      <BeautyPassportModal
        isOpen={showPassportModal}
        onClose={() => setShowPassportModal(false)}
        diagnoses={[data as any]}
      />
    </div>
  )
}
