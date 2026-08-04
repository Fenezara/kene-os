'use client'

import React, { useState, useEffect } from 'react'
import { motion as m, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Wallet as WalletIcon, ArrowLeft, Plus, RefreshCw, 
  ArrowDownLeft, ArrowUpRight, Percent, Coins, CreditCard, Check,
  Smartphone, Loader2, QrCode, Bell, Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface WalletTransaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
  reason: 'cashback' | 'referral' | 'topup' | 'payment' | 'refund'
  createdAt: string
}

interface Wallet {
  id: string
  balance: number
  currencyCode: string
  transactions: WalletTransaction[]
}

const PROVIDERS = {
  wave: { label: 'Wave', color: '#1BA4FB' },
  orange: { label: 'Orange', color: '#FF7900' },
  mtn: { label: 'MTN', color: '#FFCC00' }
}

export default function WalletPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [loading, setLoading] = useState(true)
  
  const [showTopupModal, setShowTopupModal] = useState(false)
  const [topupAmount, setTopupAmount] = useState('')
  const [momoProvider, setMomoProvider] = useState<'wave' | 'orange' | 'mtn'>('wave')
  
  // States for the USSD simulation
  const [recharging, setRecharging] = useState(false)
  const [rechargeSuccess, setRechargeSuccess] = useState(false)
  
  const [showPassModal, setShowPassModal] = useState(false)
  const [geofencingEnabled, setGeofencingEnabled] = useState(true)

  const [userId, setUserId] = useState<string | null>(null)

  const fetchWallet = async (uid: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/wallet?userId=${uid}`)
      const json = await res.json()
      if (json.success) {
        setWallet(json.wallet)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const userStr = localStorage.getItem('kene_user')
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr)
        setUserId(parsed.id)
        fetchWallet(parsed.id)
        return
      } catch (e) {}
    }
    
    // Smooth fallback for client browsing: use demo client ID
    const defaultUid = 'client-ndeye-konate'
    setUserId(defaultUid)
    fetchWallet(defaultUid)
  }, [])

  const handleTopup = async () => {
    if (!userId || !topupAmount || parseFloat(topupAmount) <= 0) return
    
    setRecharging(true)
    setRechargeSuccess(false)
    
    try {
      // Appeler la nouvelle passerelle Mobile Money qui simule un dÃ©lai USSD
      const res = await fetch('/api/payments/momo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          amount: parseFloat(topupAmount),
          provider: momoProvider,
          type: 'topup'
        })
      })
      const json = await res.json()

      if (json.success) {
        setRechargeSuccess(true)
        setTimeout(() => {
          setShowTopupModal(false)
          setTopupAmount('')
          setRechargeSuccess(false)
          setRecharging(false)
          fetchWallet(userId) // refresh balance
          toast({
            title: "ðŸ’¸ DÃ©pÃ´t RÃ©ussi",
            description: `Votre compte KÃ¨nÃ¨ a Ã©tÃ© crÃ©ditÃ© de ${parseFloat(topupAmount).toLocaleString()} F via ${PROVIDERS[momoProvider].label}.`,
          })
        }, 1500)
      } else {
        throw new Error(json.error?.message || "Erreur lors du dÃ©pÃ´t.")
      }
    } catch (e: any) {
      setRecharging(false)
      toast({
        title: "âŒ Ã‰chec de la transaction",
        description: e.message,
        variant: "destructive"
      })
    }
  }

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case 'cashback': return 'Cashback 1%'
      case 'topup': return 'DÃ©pÃ´t Mobile Money'
      case 'payment': return 'Achat de Formules / Soins'
      case 'referral': return 'Bonus Parrainage'
      default: return 'Ajustement Solde'
    }
  }

  const activeProviderColor = PROVIDERS[momoProvider].color

  return (
    <div className="flex-1 flex flex-col justify-start min-h-[85vh] text-karite max-w-lg mx-auto p-4 space-y-6">
      {/* Header */}
      <header className="flex items-center gap-3">
        <button
          onClick={() => router.push('/portal')}
          className="text-karite/60 hover:text-karite transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display font-bold text-lg text-gold-kene">Mon Portefeuille KÃ¨nÃ¨</h1>
      </header>

      {/* Credit Card Graphic Card */}
      <m.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full relative h-48 rounded-2xl p-6 overflow-hidden flex flex-col justify-between shadow-2xl bg-gradient-to-br from-[#241C16] via-[#2F241C] to-[#1A1410] border border-white/10"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-kene/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none"></div>

        <div className="flex justify-between items-start z-10">
          <div className="flex items-center gap-1.5 text-gold-kene">
            <Coins className="w-5 h-5 animate-pulse" />
            <span className="text-[10px] font-bold font-display uppercase tracking-widest">KÃ¨nÃ¨ Pay</span>
          </div>
          <CreditCard className="w-8 h-8 text-white/20" />
        </div>

        <div className="z-10 space-y-1">
          <span className="text-[10px] text-karite/50 font-sans uppercase tracking-wider block">Solde Disponible</span>
          <h2 className="text-3xl font-bold font-display text-white tracking-wide">
            {loading ? (
              <span className="h-8 w-32 bg-white/10 animate-pulse rounded-lg inline-block"></span>
            ) : (
              `${(wallet?.balance || 0).toLocaleString()} F`
            )}
          </h2>
        </div>

        <div className="flex justify-between items-end z-10 text-[9px] font-mono text-white/50">
          <span>MEMBRE PRIVILÃˆGE</span>
          <span>VALIDE (XOF)</span>
        </div>
      </m.div>

      {/* Apple / Google Wallet Buttons */}
      <div className="flex gap-2">
        <button 
          onClick={() => setShowPassModal(true)}
          className="flex-1 bg-black border border-white/20 rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-white/5 transition"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="w-4 h-4 invert" />
          <span className="text-xs font-semibold">Ajouter Ã  Apple Wallet</span>
        </button>
        <button 
          onClick={() => setShowPassModal(true)}
          className="flex-1 bg-black border border-white/20 rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-white/5 transition"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-4 h-4" />
          <span className="text-xs font-semibold">Google Wallet</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={() => setShowTopupModal(true)}
          className="flex-1 bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410] font-semibold py-5 rounded-2xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-gold-kene/10"
        >
          <Plus className="w-4 h-4" />
          Recharger par Mobile Money
        </Button>
        <button
          onClick={() => userId && fetchWallet(userId)}
          className="p-3 bg-[#241C16]/60 border border-white/5 rounded-2xl text-white/60 hover:text-white transition cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Info strip about 1% cashback */}
      <div className="bg-gradient-to-r from-gold-kene/10 to-transparent border border-gold-kene/20 p-4 rounded-2xl flex items-start gap-3">
        <Percent className="w-5 h-5 text-gold-kene shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider">Avantage Cashback Automatique</h4>
          <p className="text-[10px] text-karite/60 leading-relaxed font-sans">
            BÃ©nÃ©ficiez de 1% de cashback crÃ©ditÃ© immÃ©diatement sur votre portefeuille KÃ¨nÃ¨ Ã  chaque achat de cosmÃ©tiques ou soins.
          </p>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-3 pb-20">
        <h3 className="font-display font-bold text-xs uppercase tracking-wider text-gold-kene">Historique des transactions</h3>

        {loading ? (
          <div className="space-y-2 py-4">
            <div className="h-12 bg-[#241C16]/30 animate-pulse rounded-xl"></div>
            <div className="h-12 bg-[#241C16]/30 animate-pulse rounded-xl"></div>
          </div>
        ) : !wallet || wallet.transactions.length === 0 ? (
          <div className="text-center py-12 bg-[#1A1410]/40 border border-white/5 rounded-2xl text-karite/40 text-xs italic font-sans">
            Aucune transaction enregistrÃ©e.
          </div>
        ) : (
          <div className="space-y-2.5">
            {wallet.transactions.map((tx) => {
              const isCredit = tx.type === 'credit'
              return (
                <div 
                  key={tx.id} 
                  className="bg-[#1A1410] border border-white/5 p-4 rounded-2xl flex justify-between items-center transition hover:border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl shrink-0 ${
                      isCredit ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div className="space-y-0.5">
                      <span className="font-semibold text-xs text-white block">{getReasonLabel(tx.reason)}</span>
                      <span className="text-[9px] text-karite/40 font-mono block">
                        {new Date(tx.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <span className={`font-mono text-xs font-bold ${
                    isCredit ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {isCredit ? '+' : '-'}{tx.amount.toLocaleString()} F
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Mobile Money Topup Modal */}
      <AnimatePresence>
        {showTopupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <m.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1A1410] border border-white/10 p-6 rounded-3xl w-full max-w-sm space-y-5 text-left shadow-2xl relative overflow-hidden"
            >
              {/* Animated Background Gradient reflecting the chosen provider */}
              <m.div 
                animate={{ backgroundColor: activeProviderColor }}
                className="absolute inset-0 opacity-[0.03] pointer-events-none" 
              />

              {recharging ? (
                // LOADING USSD STATE
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                  {rechargeSuccess ? (
                    <m.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500"
                    >
                      <Check className="w-8 h-8" />
                    </m.div>
                  ) : (
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center relative z-10" style={{ backgroundColor: `${activeProviderColor}20`, color: activeProviderColor }}>
                        <Smartphone className="w-8 h-8 animate-bounce" />
                      </div>
                      <m.div 
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} 
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: activeProviderColor }}
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-white text-sm">
                      {rechargeSuccess ? 'Paiement ValidÃ© !' : 'En attente de validation'}
                    </h3>
                    <p className="text-xs text-karite/60">
                      {rechargeSuccess 
                        ? 'Votre compte a Ã©tÃ© crÃ©ditÃ©.' 
                        : 'Veuillez confirmer la transaction sur votre tÃ©lÃ©phone.'}
                    </p>
                  </div>
                  
                  {!rechargeSuccess && (
                    <div className="flex items-center gap-2 text-[10px] text-karite/40 bg-white/5 px-3 py-1.5 rounded-full mt-4">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Ne fermez pas cette fenÃªtre...</span>
                    </div>
                  )}
                </div>
              ) : (
                // INPUT STATE
                <>
                  <div className="space-y-1 relative z-10">
                    <h3 className="font-display font-bold text-sm text-gold-kene uppercase tracking-wider">Recharge Mobile Money</h3>
                    <p className="text-[10px] text-karite/60 font-sans">
                      SÃ©lectionnez votre opÃ©rateur et le montant Ã  dÃ©poser.
                    </p>
                  </div>

                  {/* Provider choosing */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 relative z-10">
                    {(Object.keys(PROVIDERS) as Array<keyof typeof PROVIDERS>).map((pid) => (
                      <button
                        key={pid}
                        onClick={() => setMomoProvider(pid)}
                        className={`py-3 px-2 rounded-xl border text-[10px] font-bold font-display uppercase tracking-wider transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          momoProvider === pid 
                            ? 'bg-white/10 text-white shadow-lg' 
                            : 'bg-[#241C16]/50 border-white/5 text-karite/60'
                        }`}
                        style={{ borderColor: momoProvider === pid ? PROVIDERS[pid].color : 'transparent' }}
                      >
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: PROVIDERS[pid].color, opacity: momoProvider === pid ? 1 : 0.3 }}
                        />
                        {PROVIDERS[pid].label}
                      </button>
                    ))}
                  </div>

                  {/* Input amount */}
                  <div className="space-y-1 relative z-10">
                    <label className="text-[9px] uppercase tracking-wider font-semibold text-karite/40 font-display block">Montant Ã  recharger (FCFA)</label>
                    <input
                      type="number"
                      placeholder="Ex: 10000"
                      value={topupAmount}
                      onChange={(e) => setTopupAmount(e.target.value)}
                      className="w-full bg-[#241C16] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono outline-none transition focus:ring-1"
                      style={{ borderColor: topupAmount ? activeProviderColor : '' }}
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 pt-2 relative z-10">
                    <button
                      onClick={() => setShowTopupModal(false)}
                      className="flex-1 bg-transparent hover:bg-white/5 border border-white/10 text-white rounded-xl text-xs py-3 cursor-pointer font-semibold transition"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleTopup}
                      disabled={!topupAmount || parseFloat(topupAmount) <= 0}
                      className="flex-1 rounded-xl text-[#1A1410] text-xs py-3 font-semibold cursor-pointer shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: activeProviderColor }}
                    >
                      Confirmer
                    </button>
                  </div>
                </>
              )}
            </m.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pass Card Modal */}
      <AnimatePresence>
        {showPassModal && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="w-full max-w-sm flex justify-end mb-4">
              <button onClick={() => setShowPassModal(false)} className="text-white/60 hover:text-white text-sm">
                Fermer
              </button>
            </div>
            
            <m.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="w-full max-w-sm bg-gradient-to-b from-[#C8951E] to-[#8c6710] rounded-3xl overflow-hidden shadow-2xl relative"
            >
              {/* Header Pass */}
              <div className="p-5 flex justify-between items-center text-[#1A1410]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#1A1410] rounded-full flex items-center justify-center">
                    <span className="text-[#C8951E] font-bold text-xs font-display">K</span>
                  </div>
                  <span className="font-display font-bold text-sm tracking-widest uppercase">KÃ¨nÃ¨ Pro</span>
                </div>
                <Download className="w-5 h-5 opacity-50" />
              </div>

              {/* Pass Content */}
              <div className="px-5 pb-5 text-[#1A1410]">
                <div className="flex justify-between items-end border-b border-[#1A1410]/10 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-semibold opacity-70 block">Membre</span>
                    <span className="text-xl font-bold font-display">Platinum</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-semibold opacity-70 block">Points</span>
                    <span className="text-xl font-bold font-mono">2,450</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center mb-4">
                  <QrCode className="w-32 h-32 text-black" />
                  <span className="text-[10px] font-mono text-black/50 mt-2">ID: {userId || 'KN-8472910'}</span>
                </div>

                <div className="flex items-center justify-between bg-[#1A1410]/10 p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    <span className="text-xs font-semibold">Notifications GÃ©olocalisÃ©es</span>
                  </div>
                  <button 
                    onClick={() => setGeofencingEnabled(!geofencingEnabled)}
                    className={`w-10 h-6 rounded-full flex items-center p-1 transition-colors ${geofencingEnabled ? 'bg-[#1A1410]' : 'bg-[#1A1410]/20'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${geofencingEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
                <p className="text-[9px] text-[#1A1410]/60 mt-2 text-center">
                  Recevez une alerte lorsque vous passez prÃ¨s de l'institut.
                </p>
              </div>
            </m.div>

            <Button className="mt-6 bg-white text-black font-semibold rounded-full px-8 py-2">
              Ajouter au portefeuille
            </Button>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
