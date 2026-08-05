'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion as m, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, FlaskConical, Plus, Minus, 
  Smartphone, CheckCircle2, ShoppingBag, 
  Camera, Sparkles, Video, Eye, Palette
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface Ingredient {
  id: string
  name: string
  scientificName: string
  description: string
  color: string
  rgb: [number, number, number]
}

const INGREDIENTS: Ingredient[] = [
  { id: 'moringa', name: 'Moringa Bio', scientificName: 'Moringa oleifera', description: 'Détoxifiant & Régulateur de sébum', color: 'text-emerald-400', rgb: [90, 125, 66] },
  { id: 'baobab', name: 'Huile de Baobab', scientificName: 'Adansonia digitata', description: 'Tenseur naturel & Booster de collagène', color: 'text-[#C8951E]', rgb: [200, 149, 30] },
  { id: 'karite', name: 'Karité Soluble', scientificName: 'Vitellaria paradoxa', description: 'Restructurant & Protecteur barrière', color: 'text-amber-600', rgb: [217, 119, 6] },
  { id: 'bissap', name: 'Acide de Fleur de Bissap', scientificName: 'Hibiscus sabdariffa', description: 'Éclat & Peeling doux AHA', color: 'text-[#8A1C14]', rgb: [138, 28, 20] },
]

function CustomizerContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [selectedBase, setSelectedBase] = useState<'serum' | 'cream' | 'oil'>('serum')
  
  const [concentrations, setConcentrations] = useState<Record<string, number>>({
    moringa: 1,
    baobab: 1,
    karite: 1,
    bissap: 1,
  })

  const [showCheckout, setShowCheckout] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<'input' | 'processing' | 'success'>('input')
  const [momoNumber, setMomoNumber] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'wave' | 'orange' | 'wallet'>('wave')
  const [walletBalance, setWalletBalance] = useState<number | null>(null)

  useEffect(() => {
    const userStr = localStorage.getItem('kene_user')
    if (userStr && showCheckout) {
      const parsed = JSON.parse(userStr)
      fetch(`/api/wallet?userId=${parsed.id}`)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            setWalletBalance(json.wallet.balance)
          }
        })
        .catch(console.error)
    }
  }, [showCheckout])

  useEffect(() => {
    const diagId = searchParams.get('diagnosisId')
    if (diagId) {
      setConcentrations({
        moringa: 3,
        baobab: 2,
        karite: 4,
        bissap: 1,
      })
      toast({
        title: "🧪 Actifs recommandés pré-chargés",
        description: "Les dosages ont été optimisés en fonction de votre dernier diagnostic de peau Kènè.",
      })
    }
  }, [searchParams])

  const totalActives = Object.values(concentrations).reduce((sum, v) => sum + v, 0)

  const handleConcentrationChange = (id: string, delta: number) => {
    setConcentrations((prev) => {
      const current = prev[id] || 0
      const nextValue = Math.max(0, current + delta)
      const currentTotalWithoutTarget = Object.entries(prev)
        .filter(([key]) => key !== id)
        .reduce((sum, [, val]) => sum + val, 0)

      if (currentTotalWithoutTarget + nextValue > 10) {
        toast({
          title: "⚠️ï¸ Seuil de sécurité atteint",
          description: "La concentration cumulée des actifs ne doit pas dépasser 10% pour préserver l'épiderme.",
          variant: "destructive",
        })
        return prev
      }

      return { ...prev, [id]: nextValue }
    })
  }

  const basePrice = 15000
  const activePrice = totalActives * 1500
  const totalTTC = basePrice + activePrice
  const subtotal = Math.round(totalTTC / 1.18)
  const vatAmount = totalTTC - subtotal

  const getMixedColor = () => {
    let rSum = 240, gSum = 230, bSum = 210
    let totalWeight = 5

    INGREDIENTS.forEach((ing) => {
      const pct = concentrations[ing.id] || 0
      if (pct > 0) {
        rSum += ing.rgb[0] * pct
        gSum += ing.rgb[1] * pct
        bSum += ing.rgb[2] * pct
        totalWeight += pct
      }
    })

    const r = Math.round(rSum / totalWeight)
    const g = Math.round(gSum / totalWeight)
    const b = Math.round(bSum / totalWeight)

    return `rgb(${r}, ${g}, ${b})`
  }

  const handleOrderSubmit = async () => {
    if (paymentMethod !== 'wallet' && !momoNumber) {
      toast({
        title: "⚠️ï¸ Informations requises",
        description: "Veuillez entrer votre numéro Mobile Money.",
        variant: "destructive",
      })
      return
    }

    if (paymentMethod === 'wallet' && walletBalance !== null && walletBalance < totalTTC) {
      toast({
        title: "⚠️ï¸ Solde insuffisant",
        description: "Votre portefeuille Kènè n'a pas assez de fonds.",
        variant: "destructive",
      })
      return
    }

    setCheckoutStep('processing')

    try {
      const storedUser = localStorage.getItem('kene_user')
      const user = storedUser ? JSON.parse(storedUser) : null

      const items = [{
        id: `formule-custom-${selectedBase}`,
        name: `Formule Custom : ${selectedBase === 'serum' ? 'Sérum' : selectedBase === 'cream' ? 'Émulsion' : 'Huile'} Kènè`,
        price: totalTTC,
        qty: 1,
        category: 'produit',
      }]

      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: user ? user.id : null,
          items,
          subtotal,
          vatAmount,
          total: totalTTC,
          method: paymentMethod,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setCheckoutStep('success')
        const storedPoints = localStorage.getItem('kene_points')
        const currentPoints = storedPoints ? parseInt(storedPoints) : 0
        localStorage.setItem('kene_points', String(currentPoints + 300))
      } else {
        throw new Error(data.error?.message || 'Erreur passerelle.')
      }
    } catch (err: any) {
      toast({
        title: "âŒ Échec de la transaction",
        description: err.message,
        variant: "destructive",
      })
      setCheckoutStep('input')
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-between p-6 min-h-[85vh] text-white">
      <header className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.push('/')}
            className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white hover:bg-white/10 transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-display font-bold text-lg text-gold-kene">Kènè Customizer</span>
          <div className="w-10 h-10" />
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row gap-6">
        <div className="flex flex-col items-center justify-center bg-[#1A1410] border border-white/5 rounded-3xl p-6 md:flex-1 relative min-h-[250px]">
          <div className="absolute top-4 left-4 text-left">
            <span className="text-[10px] text-white/40 block font-sans">Formulation unique</span>
            <span className="text-xs font-bold text-white capitalize">{selectedBase} personnalisé</span>
          </div>

          <div className="relative w-32 h-44 mt-4">
            <m.svg
              viewBox="0 0 100 120"
              className="w-full h-full drop-shadow-2xl"
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <rect x="42" y="2" width="16" height="15" rx="2" fill="#241C16" />
              <rect x="47" y="17" width="6" height="8" fill="#555" />
              <rect x="40" y="25" width="20" height="8" rx="1" fill="#888" opacity="0.3" />
              <rect x="25" y="33" width="50" height="70" rx="8" fill="none" stroke="#fff" strokeWidth="2.5" opacity="0.4" />
              
              <m.rect
                x="28"
                y={100 - (33 + (totalActives * 3))}
                width="44"
                height={33 + (totalActives * 3)}
                rx="4"
                fill={getMixedColor()}
                opacity="0.85"
                transition={{ fill: { duration: 0.8 }, y: { duration: 0.5 }, height: { duration: 0.5 } }}
              />

              <path d="M29,38 Q32,60 29,95" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.3" />
              <path d="M71,45 Q68,70 71,90" stroke="#fff" strokeWidth="1" fill="none" opacity="0.15" />
            </m.svg>

            {totalActives > 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <m.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-20 h-28 rounded-full bg-gold-kene/5 blur-xl"
                />
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <span className="text-[10px] bg-gold-kene/10 text-gold-kene border border-gold-kene/20 px-2.5 py-1 rounded-full font-mono font-bold">
              Concentration : {totalActives.toFixed(1)}% / 10%
            </span>
          </div>
        </div>

        <div className="space-y-6 md:flex-1">
          <div className="bg-[#1A1410] border border-white/5 p-5 rounded-3xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gold-kene font-display">1. Choisissez votre Base</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { id: 'serum', label: 'Sérum', desc: 'Fluide léger' },
                { id: 'cream', label: 'Émulsion', desc: 'Crème douce' },
                { id: 'oil', label: 'Huile', desc: 'Fini soyeux' },
              ].map((base) => (
                <button
                  key={base.id}
                  onClick={() => setSelectedBase(base.id as any)}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                    selectedBase === base.id 
                      ? 'border-gold-kene bg-gold-kene/10 text-gold-kene' 
                      : 'border-white/5 bg-white/[0.01] text-white/50 hover:bg-white/5'
                  }`}
                >
                  <span className="text-xs font-bold block">{base.label}</span>
                  <span className="text-[9px] font-sans block opacity-60 mt-0.5">{base.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#1A1410] border border-white/5 p-5 rounded-3xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gold-kene font-display">2. Dosez vos Actifs Sur Mesure</h3>
              <span className="text-[10px] text-white/40 font-mono">Max 10%</span>
            </div>

            <div className="space-y-3.5">
              {INGREDIENTS.map((ing) => {
                const val = concentrations[ing.id] || 0
                return (
                  <div key={ing.id} className="flex justify-between items-center bg-white/[0.01] border border-white/5 p-3 rounded-2xl">
                    <div className="space-y-0.5 text-left flex-1 pr-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white/95">{ing.name}</span>
                        <span className="text-[9px] text-white/40 italic font-mono">({ing.scientificName})</span>
                      </div>
                      <p className="text-[10px] text-white/50 font-sans leading-tight">{ing.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleConcentrationChange(ing.id, -0.5)}
                        disabled={val <= 0}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/80 disabled:opacity-30 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-mono text-xs font-bold text-gold-kene">{val.toFixed(1)}%</span>
                      <button
                        onClick={() => handleConcentrationChange(ing.id, 0.5)}
                        disabled={totalActives >= 10}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/80 disabled:opacity-30 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-6 bg-[#1A1410] border border-white/5 p-5 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
        <div className="text-center md:text-left">
          <span className="text-[10px] text-white/40 uppercase font-semibold block">Tarif de votre formule unique</span>
          <span className="font-mono text-xl font-bold text-emerald-400 mt-0.5">
            {totalTTC.toLocaleString()} FCFA
          </span>
          <span className="text-[9px] text-white/30 block font-sans">
            Base : {basePrice.toLocaleString()} F | Suppléments : {activePrice.toLocaleString()} F
          </span>
        </div>

        <Button
          onClick={() => setShowCheckout(true)}
          className="w-full md:w-auto bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410] font-semibold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 font-display cursor-pointer shadow-lg shadow-gold-kene/10 shrink-0"
        >
          <ShoppingBag className="w-4.5 h-4.5" />
          Commander ma Formule
        </Button>
      </footer>

      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <m.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1A1410] border border-white/10 p-6 rounded-3xl w-full max-w-sm text-center space-y-6"
            >
              {checkoutStep === 'input' && (
                <div className="space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gold-kene/10 flex items-center justify-center text-gold-kene">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-sm uppercase text-gold-kene">Mode de Paiement</h3>
                    <p className="text-[11px] text-white/50">Sélectionnez le moyen de règlement de votre commande.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => setPaymentMethod('wave')}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition cursor-pointer ${
                          paymentMethod === 'wave' 
                            ? 'border-blue-400 bg-blue-500/10 text-blue-400' 
                            : 'border-white/5 bg-white/[0.02] text-white/50'
                        }`}
                      >
                        Wave
                      </button>
                      <button
                        onClick={() => setPaymentMethod('orange')}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition cursor-pointer ${
                          paymentMethod === 'orange' 
                            ? 'border-orange-400 bg-orange-500/10 text-orange-400' 
                            : 'border-white/5 bg-white/[0.02] text-white/50'
                        }`}
                      >
                        Orange
                      </button>
                      <button
                        onClick={() => setPaymentMethod('wallet')}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition cursor-pointer ${
                          paymentMethod === 'wallet' 
                            ? 'border-gold-kene bg-gold-kene/10 text-gold-kene' 
                            : 'border-white/5 bg-white/[0.02] text-white/50'
                        }`}
                      >
                        Wallet
                      </button>
                    </div>

                    {paymentMethod === 'wallet' ? (
                      <div className="bg-[#241C16] border border-white/5 p-3 rounded-xl space-y-1 text-center">
                        <span className="text-[9px] text-white/40 block uppercase tracking-wider font-semibold">Solde de votre portefeuille</span>
                        <span className="text-sm font-bold font-mono text-gold-kene block">
                          {walletBalance !== null ? `${walletBalance.toLocaleString()} F` : 'Chargement...'}
                        </span>
                        {walletBalance !== null && walletBalance < totalTTC && (
                          <span className="text-[9px] text-red-400 block font-semibold leading-tight pt-1">
                            Solde insuffisant.
                          </span>
                        )}
                      </div>
                    ) : (
                      <input
                        type="tel"
                        placeholder="Votre numéro Mobile Money"
                        value={momoNumber}
                        onChange={(e) => setMomoNumber(e.target.value)}
                        className="w-full bg-[#241C16] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-gold-kene text-center font-mono"
                      />
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowCheckout(false)}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs py-2 rounded-xl cursor-pointer"
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleOrderSubmit}
                      className="flex-1 bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410] text-xs font-semibold py-2 rounded-xl cursor-pointer"
                    >
                      Payer {totalTTC.toLocaleString()} F
                    </Button>
                  </div>
                </div>
              )}

              {checkoutStep === 'processing' && (
                <div className="space-y-4 py-6">
                  <div className="w-10 h-10 border-4 border-gold-kene border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">Validation en cours...</h4>
                    <p className="text-[10px] text-white/40">Veuillez approuver la notification push MoMo sur votre téléphone.</p>
                  </div>
                </div>
              )}

              {checkoutStep === 'success' && (
                <div className="space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-sm uppercase text-emerald-400">Formule Commandée !</h3>
                    <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                      Votre paiement de **{totalTTC.toLocaleString()} FCFA** a été reçu. Notre laboratoire prépare votre formule sur mesure.
                    </p>
                  </div>

                  <Button
                    onClick={() => {
                      setShowCheckout(false)
                      router.push('/')
                    }}
                    className="w-full bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410] text-xs font-semibold py-2 rounded-xl cursor-pointer"
                  >
                    Retour à  l'Accueil
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

function ARMirrorContent() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState<'hair' | 'makeup'>('hair')
  
  const [hairColor, setHairColor] = useState('#1B1B1B') // Default 1B
  const [makeupColor, setMakeupColor] = useState('#8A1C14') // Default Bissap/Bordeaux
  const { toast } = useToast()
  const router = useRouter()

  const HAIR_SHADES = [
    { id: '1b', name: 'Knotless #1B', color: '#1B1B1B' },
    { id: '30', name: '#30 Miel', color: '#B37D4E' },
    { id: '27', name: '#27 Doré', color: '#D4AF37' },
    { id: 'bug', name: '#BUG Bordeaux', color: '#5D1916' },
  ]

  const MAKEUP_SHADES = [
    { id: 'nude_v', name: 'Nude (Photo V)', color: '#A0522D' },
    { id: 'nude_vi', name: 'Nude (Photo VI)', color: '#5C3317' },
    { id: 'bissap', name: 'Bissap Glow', color: '#8A1C14' },
    { id: 'karite', name: 'Karité Éclat', color: '#D97706' },
  ]

  useEffect(() => {
    if (cameraActive && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        })
        .catch(() => {
          toast({
            title: "📸 Erreur Caméra",
            description: "Impossible d'accéder à  la caméra. Utilisation du modèle par défaut.",
            variant: "destructive"
          })
        })
    } else {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
        videoRef.current.srcObject = null
      }
    }
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [cameraActive])

  const handleBook = () => {
    const serviceName = selectedStyle === 'hair' 
      ? `Tresses Africaines (${HAIR_SHADES.find(s => s.color === hairColor)?.name})` 
      : `Mise en Beauté (${MAKEUP_SHADES.find(s => s.color === makeupColor)?.name})`
      
    toast({
      title: "✨… Style sélectionné",
      description: "Redirection vers la réservation...",
    })
    
    // Simulate pre-filling checkout
    setTimeout(() => {
      router.push(`/checkout?service=${encodeURIComponent(serviceName)}`)
    }, 1000)
  }

  return (
    <div className="flex-1 flex flex-col p-4 text-white">
      <div className="relative w-full aspect-[3/4] md:aspect-square bg-[#1A1410] rounded-3xl overflow-hidden border border-white/10 shadow-2xl mb-6">
        {cameraActive ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover transform -scale-x-100"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#241C16] to-[#1A1410]">
            <Camera className="w-16 h-16 text-white/20 mb-4" />
            <p className="text-white/40 text-sm font-sans mb-4">Miroir Virtuel Désactivé</p>
            <Button 
              onClick={() => setCameraActive(true)}
              className="bg-gold-kene text-[#1A1410] font-semibold rounded-full px-6"
            >
              Activer la Caméra
            </Button>
          </div>
        )}

        {/* AR Overlay Simulation */}
        {cameraActive && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
            {selectedStyle === 'hair' && (
              <m.div 
                animate={{ backgroundColor: hairColor }}
                className="w-48 h-64 border-4 border-dashed rounded-t-full opacity-50 mix-blend-overlay transition-colors duration-500"
              />
            )}
            {selectedStyle === 'makeup' && (
              <div className="flex gap-4 mt-20">
                <m.div 
                  animate={{ backgroundColor: makeupColor }}
                  className="w-12 h-6 rounded-full opacity-40 mix-blend-multiply blur-sm transition-colors duration-500"
                />
              </div>
            )}
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-mono text-white/80">AR ACTIVE</span>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-[#1A1410] border border-white/5 rounded-3xl p-5 mb-20 space-y-5">
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
          <button 
            onClick={() => setSelectedStyle('hair')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${selectedStyle === 'hair' ? 'bg-white/10 text-white shadow-md' : 'text-white/50 hover:text-white'}`}
          >
            Tresses & Coiffures
          </button>
          <button 
            onClick={() => setSelectedStyle('makeup')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${selectedStyle === 'makeup' ? 'bg-white/10 text-white shadow-md' : 'text-white/50 hover:text-white'}`}
          >
            Maquillage (V & VI)
          </button>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gold-kene font-display">
            Sélectionnez votre teinte
          </h3>
          <div className="flex flex-wrap gap-3">
            {(selectedStyle === 'hair' ? HAIR_SHADES : MAKEUP_SHADES).map((shade) => (
              <button
                key={shade.id}
                onClick={() => selectedStyle === 'hair' ? setHairColor(shade.color) : setMakeupColor(shade.color)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition ${
                  (selectedStyle === 'hair' ? hairColor : makeupColor) === shade.color 
                    ? 'border-gold-kene bg-white/10' 
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <div className="w-5 h-5 rounded-full shadow-inner border border-white/20" style={{ backgroundColor: shade.color }} />
                <span className="text-[10px] font-semibold">{shade.name}</span>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleBook}
          className="w-full bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410] font-semibold py-6 rounded-2xl flex items-center justify-center gap-2 font-display cursor-pointer shadow-lg shadow-gold-kene/10"
        >
          <Sparkles className="w-4.5 h-4.5" />
          Réserver ce Style
        </Button>
      </div>
    </div>
  )
}

export default function CustomizerPage() {
  const [activeTab, setActiveTab] = useState<'lab' | 'ar'>('lab')

  return (
    <Suspense fallback={<div className="flex justify-center py-20 text-gold-kene">Chargement du laboratoire...</div>}>
      <div className="min-h-[85vh] flex flex-col bg-[#0A0603]">
        {/* Tab Switcher */}
        <div className="px-6 pt-4 flex gap-2">
          <button 
            onClick={() => setActiveTab('lab')}
            className={`flex-1 py-3 text-xs font-display font-bold uppercase tracking-wider rounded-t-2xl transition border-b-2 ${
              activeTab === 'lab' 
                ? 'border-gold-kene text-gold-kene bg-gold-kene/5' 
                : 'border-transparent text-white/40 hover:text-white/80'
            }`}
          >
            Lab Sur Mesure
          </button>
          <button 
            onClick={() => setActiveTab('ar')}
            className={`flex-1 py-3 text-xs font-display font-bold uppercase tracking-wider rounded-t-2xl transition border-b-2 ${
              activeTab === 'ar' 
                ? 'border-gold-kene text-gold-kene bg-gold-kene/5' 
                : 'border-transparent text-white/40 hover:text-white/80'
            }`}
          >
            Miroir AR
          </button>
        </div>

        {activeTab === 'lab' ? <CustomizerContent /> : <ARMirrorContent />}
      </div>
    </Suspense>
  )
}
