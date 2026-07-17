'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion as m, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Droplet, Sparkles, Award, CheckCircle2, 
  Smartphone, Wallet, ArrowRight, Activity, Flame, ShieldCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface PlantState {
  name: string
  scientificName: string
  health: number
  color: string
  effect: string
}

export default function JardinPage() {
  const router = useRouter()
  const { toast } = useToast()

  // Points wallet state
  const [points, setPoints] = useState(750)
  
  // Plant metrics
  const [moringaHealth, setMoringaHealth] = useState(65)  // Hydration
  const [baobabHealth, setBaobabHealth] = useState(80)    // Elasticity
  const [kariteHealth, setKariteHealth] = useState(70)    // Skin barrier
  const [bissapHealth, setBissapHealth] = useState(55)    // Acne/Purity

  // Routine task states
  const [cleanseDone, setCleanseDone] = useState(false)
  const [serumDone, setSerumDone] = useState(false)
  const [moisturizeDone, setMoisturizeDone] = useState(false)

  // Momo payout modal
  const [showPayoutModal, setShowPayoutModal] = useState(false)
  const [payoutStep, setPayoutStep] = useState<'input' | 'processing' | 'success'>('input')
  const [momoNumber, setMomoNumber] = useState('')
  const [momoProvider, setMomoProvider] = useState<'wave' | 'orange'>('wave')

  const handleAction = (type: 'cleanse' | 'serum' | 'moisturize') => {
    if (type === 'cleanse' && !cleanseDone) {
      setCleanseDone(true)
      setBissapHealth((prev) => Math.min(prev + 20, 100))
      setPoints((prev) => prev + 150)
      toast({
        title: "✨ Étape complétée",
        description: "Nettoyant sur mesure appliqué. Votre plant de Bissap est purifié ! (+150 pts)",
      })
    } else if (type === 'serum' && !serumDone) {
      setSerumDone(true)
      setMoringaHealth((prev) => Math.min(prev + 25, 100))
      setPoints((prev) => prev + 150)
      toast({
        title: "💧 Étape complétée",
        description: "Sérum hydratant appliqué. Votre plant de Moringa grandit ! (+150 pts)",
      })
    } else if (type === 'moisturize' && !moisturizeDone) {
      setMoisturizeDone(true)
      setKariteHealth((prev) => Math.min(prev + 15, 100))
      setBaobabHealth((prev) => Math.min(prev + 15, 100))
      setPoints((prev) => prev + 150)
      toast({
        title: "🛡️ Étape complétée",
        description: "Soin protecteur Karité & Baobab appliqué ! (+150 pts)",
      })
    }
  }

  const handleMomoPayout = () => {
    if (!momoNumber) {
      toast({
        title: "⚠️ Numéro requis",
        description: "Veuillez entrer votre numéro Mobile Money.",
        variant: "destructive",
      })
      return
    }
    setPayoutStep('processing')
    setTimeout(() => {
      setPayoutStep('success')
      setPoints(0)
    }, 2500)
  }

  return (
    <div className="flex-1 flex flex-col justify-between p-6 min-h-[85vh] text-white">
      {/* Header bar */}
      <header className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.push('/')}
          className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white hover:bg-white/10 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-display font-bold text-lg text-gold-kene">Jardin du Glow</span>
        <div className="w-10 h-10" /> {/* Spacer */}
      </header>

      <div className="flex-1 space-y-6">
        {/* Wallet Component */}
        <div className="bg-[#241C16]/50 border border-white/5 p-5 rounded-3xl flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold-kene/10 flex items-center justify-center text-gold-kene">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-white/40 block">Cagnotte de soins sur mesure</span>
              <span className="font-mono font-bold text-lg text-white">{points.toLocaleString()} FCFA</span>
            </div>
          </div>

          {points > 0 ? (
            <Button
              onClick={() => {
                setPayoutStep('input')
                setShowPayoutModal(true)
              }}
              className="bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410] text-[10px] font-bold rounded-xl py-1.5 px-3 cursor-pointer shadow-lg shadow-gold-kene/10"
            >
              Retirer Cash
            </Button>
          ) : (
            <span className="text-[10px] text-white/30 italic">Vide</span>
          )}
        </div>

        {/* Visual Ecosystem Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Moringa Card (Hydratation) */}
          <div className="bg-[#1A1410] border border-white/5 p-4 rounded-3xl space-y-3 relative overflow-hidden">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-white/40 font-semibold font-sans">Moringa (Hydr.)</span>
              <Droplet className={`w-3.5 h-3.5 ${moringaHealth > 80 ? 'text-emerald-400' : 'text-orange-400'}`} />
            </div>
            
            {/* SVG Visualizer */}
            <div className="h-16 flex items-center justify-center relative">
              <m.svg
                viewBox="0 0 100 100"
                className="w-12 h-12"
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                {/* Stem */}
                <path d="M50,90 Q50,40 55,20" stroke="#C8951E" strokeWidth="4" fill="none" />
                {/* Leaves */}
                <m.path 
                  d="M52,30 Q35,20 40,40" 
                  fill="#5A7D42" 
                  animate={{ scale: moringaHealth / 100, rotate: moringaHealth < 70 ? -10 : 0 }} 
                />
                <m.path 
                  d="M54,45 Q70,35 65,55" 
                  fill="#5A7D42" 
                  animate={{ scale: moringaHealth / 100, rotate: moringaHealth < 70 ? 10 : 0 }} 
                />
                <m.path 
                  d="M51,22 Q50,5 55,10" 
                  fill="#7FA962" 
                  animate={{ scale: (moringaHealth + 10) / 100 }} 
                />
              </m.svg>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[9px] text-white/50">
                <span>Vitalité</span>
                <span>{moringaHealth}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <m.div 
                  className="h-full bg-emerald-500" 
                  animate={{ width: `${moringaHealth}%` }}
                />
              </div>
            </div>
          </div>

          {/* Baobab Card (Fermeté) */}
          <div className="bg-[#1A1410] border border-white/5 p-4 rounded-3xl space-y-3 relative overflow-hidden">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-white/40 font-semibold font-sans">Baobab (Elastic.)</span>
              <Activity className="w-3.5 h-3.5 text-yellow-400" />
            </div>

            {/* SVG Visualizer */}
            <div className="h-16 flex items-center justify-center relative">
              <m.svg
                viewBox="0 0 100 100"
                className="w-12 h-12"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                {/* Robust Trunk */}
                <m.path 
                  d="M45,90 L48,45 L52,45 L55,90 Z" 
                  fill="#8B6F57" 
                  animate={{ strokeWidth: baobabHealth > 80 ? 3 : 1 }}
                />
                {/* Branches and Foliage */}
                <circle cx="43" cy="40" r="14" fill="#4B693A" />
                <circle cx="57" cy="38" r="12" fill="#5A7D42" />
                <circle cx="50" cy="32" r="10" fill="#7FA962" />
              </m.svg>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[9px] text-white/50">
                <span>Vitalité</span>
                <span>{baobabHealth}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <m.div 
                  className="h-full bg-emerald-500" 
                  animate={{ width: `${baobabHealth}%` }}
                />
              </div>
            </div>
          </div>

          {/* Karité Card (Protection Barrière) */}
          <div className="bg-[#1A1410] border border-white/5 p-4 rounded-3xl space-y-3 relative overflow-hidden">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-white/40 font-semibold font-sans">Karité (Barrière)</span>
              <ShieldCheck className="w-3.5 h-3.5 text-[#C8951E]" />
            </div>

            {/* SVG Visualizer */}
            <div className="h-16 flex items-center justify-center relative">
              <m.svg
                viewBox="0 0 100 100"
                className="w-12 h-12"
              >
                {/* Leaves layout */}
                <m.path 
                  d="M50,90 Q50,50 50,30" 
                  stroke="#63452D" 
                  strokeWidth="3" 
                  fill="none" 
                />
                <m.path 
                  d="M50,35 C30,35 32,55 50,55" 
                  fill="#4D6B3C" 
                  animate={{ scale: kariteHealth / 100 }} 
                />
                <m.path 
                  d="M50,45 C70,45 68,65 50,65" 
                  fill="#60864C" 
                  animate={{ scale: kariteHealth / 100 }} 
                />
              </m.svg>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[9px] text-white/50">
                <span>Vitalité</span>
                <span>{kariteHealth}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <m.div 
                  className="h-full bg-emerald-500" 
                  animate={{ width: `${kariteHealth}%` }}
                />
              </div>
            </div>
          </div>

          {/* Bissap Card (Pureté) */}
          <div className="bg-[#1A1410] border border-white/5 p-4 rounded-3xl space-y-3 relative overflow-hidden">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-white/40 font-semibold font-sans">Bissap (Teint)</span>
              <Flame className="w-3.5 h-3.5 text-[#A52A2A]" />
            </div>

            {/* SVG Visualizer */}
            <div className="h-16 flex items-center justify-center relative">
              <m.svg
                viewBox="0 0 100 100"
                className="w-12 h-12"
              >
                <path d="M50,90 Q48,55 50,35" stroke="#C8951E" strokeWidth="2" fill="none" />
                {/* Hibiscus flowers showing state - more redness if skin is inflamed/low health */}
                <circle cx="50" cy="35" r="8" fill="#8A1C14" />
                <circle cx="38" cy="55" r="6" fill="#8A1C14" />
                <circle cx="62" cy="50" r="7" fill="#8A1C14" />
                {/* Green centers if health is high */}
                {bissapHealth > 70 && (
                  <>
                    <circle cx="50" cy="35" r="3" fill="#D4AF37" />
                    <circle cx="38" cy="55" r="2" fill="#D4AF37" />
                    <circle cx="62" cy="50" r="2.5" fill="#D4AF37" />
                  </>
                )}
              </m.svg>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[9px] text-white/50">
                <span>Vitalité</span>
                <span>{bissapHealth}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <m.div 
                  className="h-full bg-emerald-500" 
                  animate={{ width: `${bissapHealth}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Daily Routine checklist */}
        <div className="bg-[#1A1410] border border-white/5 p-5 rounded-3xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gold-kene font-display flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Routine Sur-Mesure du Jour
          </h3>

          <div className="space-y-3">
            {/* Nettoyer */}
            <div className="flex justify-between items-center bg-[#241C16]/30 border border-white/5 p-3 rounded-2xl">
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-white/90">Nettoyage Purifiant</h4>
                <p className="text-[10px] text-white/40 font-sans">Formule florale équilibrante</p>
              </div>
              <Button
                onClick={() => handleAction('cleanse')}
                disabled={cleanseDone}
                className={`text-[10px] font-bold rounded-xl py-1.5 px-3 cursor-pointer ${
                  cleanseDone 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410]'
                }`}
              >
                {cleanseDone ? 'Fait (+150 pts)' : 'Appliquer'}
              </Button>
            </div>

            {/* Sérum */}
            <div className="flex justify-between items-center bg-[#241C16]/30 border border-white/5 p-3 rounded-2xl">
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-white/90">Sérum Actif Moringa</h4>
                <p className="text-[10px] text-white/40 font-sans">Hydratation profonde de la peau</p>
              </div>
              <Button
                onClick={() => handleAction('serum')}
                disabled={serumDone}
                className={`text-[10px] font-bold rounded-xl py-1.5 px-3 cursor-pointer ${
                  serumDone 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410]'
                }`}
              >
                {serumDone ? 'Fait (+150 pts)' : 'Appliquer'}
              </Button>
            </div>

            {/* Protéger */}
            <div className="flex justify-between items-center bg-[#241C16]/30 border border-white/5 p-3 rounded-2xl">
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-white/90">Crème Barrière Karité</h4>
                <p className="text-[10px] text-white/40 font-sans">Protection et nutrition intensive</p>
              </div>
              <Button
                onClick={() => handleAction('moisturize')}
                disabled={moisturizeDone}
                className={`text-[10px] font-bold rounded-xl py-1.5 px-3 cursor-pointer ${
                  moisturizeDone 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410]'
                }`}
              >
                {moisturizeDone ? 'Fait (+150 pts)' : 'Appliquer'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Payout Modal */}
      <AnimatePresence>
        {showPayoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <m.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1A1410] border border-white/10 p-6 rounded-3xl w-full max-w-sm text-center space-y-6"
            >
              {payoutStep === 'input' && (
                <div className="space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gold-kene/10 flex items-center justify-center text-gold-kene">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-sm uppercase text-gold-kene">Retrait Mobile Money</h3>
                    <p className="text-[11px] text-white/50">Convertissez vos points en argent réel envoyé sur votre compte mobile.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => setMomoProvider('wave')}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                          momoProvider === 'wave' 
                            ? 'border-blue-400 bg-blue-500/10 text-blue-400' 
                            : 'border-white/5 bg-white/[0.02] text-white/50'
                        }`}
                      >
                        Wave
                      </button>
                      <button
                        onClick={() => setMomoProvider('orange')}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                          momoProvider === 'orange' 
                            ? 'border-orange-400 bg-orange-500/10 text-orange-400' 
                            : 'border-white/5 bg-white/[0.02] text-white/50'
                        }`}
                      >
                        Orange
                      </button>
                    </div>

                    <input
                      type="tel"
                      placeholder="Numéro (ex: 07080910)"
                      value={momoNumber}
                      onChange={(e) => setMomoNumber(e.target.value)}
                      className="w-full bg-[#241C16] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-gold-kene text-center font-mono"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowPayoutModal(false)}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs py-2 rounded-xl cursor-pointer"
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleMomoPayout}
                      className="flex-1 bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410] text-xs font-semibold py-2 rounded-xl cursor-pointer"
                    >
                      Transférer {points} F
                    </Button>
                  </div>
                </div>
              )}

              {payoutStep === 'processing' && (
                <div className="space-y-4 py-6">
                  <div className="w-10 h-10 border-4 border-gold-kene border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">Transfert en cours...</h4>
                    <p className="text-[10px] text-white/40">Communication sécurisée avec la passerelle Mobile Money.</p>
                  </div>
                </div>
              )}

              {payoutStep === 'success' && (
                <div className="space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-sm uppercase text-emerald-400">Paiement effectué !</h3>
                    <p className="text-[11px] text-white/50 leading-relaxed">
                      Félicitations ! Votre transfert de **{points} FCFA** vers votre compte mobile a été effectué avec succès.
                    </p>
                  </div>

                  <Button
                    onClick={() => setShowPayoutModal(false)}
                    className="w-full bg-white/5 hover:bg-white/10 text-white text-xs py-2 rounded-xl cursor-pointer"
                  >
                    Fermer
                  </Button>
                </div>
              )}
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
