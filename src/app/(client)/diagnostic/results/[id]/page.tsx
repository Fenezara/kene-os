'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion as m } from 'framer-motion'
import { 
  Sparkles, ArrowLeft, MessageSquare, AlertOctagon, Check, 
  Info, Eye, ShieldAlert, Heart, Calendar 
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
  const [spectralMode, setSpectralMode] = useState<'standard' | 'melanin' | 'vascular'>('standard')

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/diagnoses/${id}`)
        if (!res.ok) throw new Error("Impossible de charger les résultats.")
        const json = await res.json()
        setData(json.diagnosis)
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
      return 'contrast-[1.8] saturate-0 brightness-90 invert hue-rotate-180'
    }
    if (spectralMode === 'vascular') {
      return 'sepia-100 hue-rotate-[310deg] saturate-[3.5] contrast-[1.4] brightness-75'
    }
    return ''
  }

  return (
    <div className="flex-1 flex flex-col justify-between min-h-[85vh] text-karite font-sans">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-white/5 bg-[#1A1410]/90 sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
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
                src={data.photos[0]}
                alt="Capture Diagnostic"
                className={`w-full h-full object-cover transition-all duration-300 ${getSpectralFilter()}`}
              />
              
              {/* Filter labels overlays */}
              {spectralMode === 'melanin' && (
                <div className="absolute inset-0 bg-gold-kene/5 pointer-events-none mix-blend-color-dodge"></div>
              )}
            </div>

            {/* Filter controls tabs */}
            <div className="grid grid-cols-3 gap-1 bg-[#1A1410] p-1 rounded-xl text-center">
              {(['standard', 'melanin', 'vascular'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSpectralMode(mode)}
                  className={`text-[10px] py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                    spectralMode === mode 
                      ? 'bg-gold-kene text-[#1A1410]' 
                      : 'text-karite/50 hover:text-karite'
                  }`}
                >
                  {mode === 'standard' ? 'Standard' : mode === 'melanin' ? 'Mélanine' : 'Vasculaire'}
                </button>
              ))}
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
                  className="bg-[#241C16]/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between space-y-2"
                >
                  <span className="text-xs font-medium text-karite/80 font-sans block leading-tight">
                    {indicator.name}
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
      <footer className="p-6 bg-[#1A1410]/90 border-t border-white/5 sticky bottom-0 z-30 backdrop-blur-md flex flex-col gap-2.5">
        <Button
          onClick={() => router.push(`/customizer?diagnosisId=${data.id}`)}
          className="w-full bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410] font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 font-display cursor-pointer shadow-lg shadow-gold-kene/10"
        >
          <Sparkles className="w-4 h-4" />
          Formuler mon Soin Sur Mesure
        </Button>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push(`/chat?diagnosisId=${data.id}`)}
            className="flex-1 border border-white/10 bg-transparent hover:bg-white/5 text-karite text-xs font-semibold py-2.5 rounded-2xl cursor-pointer transition flex items-center justify-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Mama Kènè AI
          </Button>
          <Button
            onClick={() => router.push('/')}
            className="flex-1 border border-white/10 bg-transparent hover:bg-white/5 text-karite/80 text-xs font-semibold py-2.5 rounded-2xl cursor-pointer transition"
          >
            Accueil
          </Button>
        </div>
      </footer>
    </div>
  )
}
