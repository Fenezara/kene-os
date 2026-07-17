'use client'

import React, { useState, useEffect } from 'react'
import { motion as m, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Wallet as WalletIcon, ArrowLeft, Plus, RefreshCw, 
  ArrowDownLeft, ArrowUpRight, Percent, Coins, CreditCard, Check 
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

export default function WalletPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [loading, setLoading] = useState(true)
  const [recharging, setRecharging] = useState(false)
  const [showTopupModal, setShowTopupModal] = useState(false)
  const [topupAmount, setTopupAmount] = useState('')
  const [momoProvider, setMomoProvider] = useState<'wave' | 'orange' | 'mtn'>('wave')
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
      const parsed = JSON.parse(userStr)
      setUserId(parsed.id)
      fetchWallet(parsed.id)
    } else {
      toast({
        title: "🔑 Identification Requise",
        description: "Veuillez vous identifier depuis la page d'accueil.",
        variant: "destructive"
      })
      router.push('/')
    }
  }, [])

  const handleTopup = async () => {
    if (!userId || !topupAmount || parseFloat(topupAmount) <= 0) return
    
    setRecharging(true)
    try {
      const res = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          amount: parseFloat(topupAmount)
        })
      })
      const json = await res.json()

      if (json.success) {
        toast({
          title: "💸 Rechargement Réussi",
          description: `Votre compte a été crédité de ${parseFloat(topupAmount).toLocaleString()} F par Mobile Money.`,
        })
        setShowTopupModal(false)
        setTopupAmount('')
        fetchWallet(userId)
      } else {
        throw new Error(json.error?.message || "Erreur de recharge.")
      }
    } catch (e: any) {
      toast({
        title: "❌ Échec de la recharge",
        description: e.message,
        variant: "destructive"
      })
    } finally {
      setRecharging(false)
    }
  }

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case 'cashback': return 'Cashback 1%'
      case 'topup': return 'Dépôt Mobile Money'
      case 'payment': return 'Achat de Formules / Soins'
      case 'referral': return 'Bonus Parrainage'
      default: return 'Ajustement Solde'
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-start min-h-[85vh] text-karite max-w-lg mx-auto p-4 space-y-6">
      {/* Header */}
      <header className="flex items-center gap-3">
        <button
          onClick={() => router.push('/')}
          className="text-karite/60 hover:text-karite transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display font-bold text-lg text-gold-kene">Mon Portefeuille Kènè</h1>
      </header>

      {/* Credit Card Graphic Card */}
      <m.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full relative h-48 rounded-2xl p-6 overflow-hidden flex flex-col justify-between shadow-2xl bg-gradient-to-br from-[#241C16] via-[#2F241C] to-[#1A1410] border border-white/10"
      >
        {/* Decorative backdrop elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-kene/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none"></div>

        <div className="flex justify-between items-start z-10">
          <div className="flex items-center gap-1.5 text-gold-kene">
            <Coins className="w-5 h-5 animate-pulse" />
            <span className="text-[10px] font-bold font-display uppercase tracking-widest">Kènè Pay</span>
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
          <span>MEMBRE PRIVILÈGE</span>
          <span>VALIDE (XOF)</span>
        </div>
      </m.div>

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
            Bénéficiez de 1% de cashback crédité immédiatement sur votre portefeuille Kènè à chaque achat de cosmétiques ou soins.
          </p>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-xs uppercase tracking-wider text-gold-kene">Historique des transactions</h3>

        {loading ? (
          <div className="space-y-2 py-4">
            <div className="h-12 bg-[#241C16]/30 animate-pulse rounded-xl"></div>
            <div className="h-12 bg-[#241C16]/30 animate-pulse rounded-xl"></div>
          </div>
        ) : !wallet || wallet.transactions.length === 0 ? (
          <div className="text-center py-12 bg-[#1A1410]/40 border border-white/5 rounded-2xl text-karite/40 text-xs italic font-sans">
            Aucune transaction enregistrée.
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
              className="bg-[#1A1410] border border-white/10 p-6 rounded-3xl w-full max-w-sm space-y-5 text-left shadow-2xl relative"
            >
              <div className="space-y-1">
                <h3 className="font-display font-bold text-sm text-gold-kene uppercase tracking-wider">Recharge Portefeuille</h3>
                <p className="text-[10px] text-karite/60 font-sans">
                  Saisissez le montant et le fournisseur Mobile Money pour le débit.
                </p>
              </div>

              {/* Provider choosing */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'wave', label: 'Wave' },
                  { id: 'orange', label: 'Orange' },
                  { id: 'mtn', label: 'MTN' }
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setMomoProvider(p.id as any)}
                    className={`py-2 px-3 rounded-xl border text-[10px] font-bold font-display uppercase tracking-wider transition cursor-pointer ${
                      momoProvider === p.id 
                        ? 'bg-gold-kene border-gold-kene text-[#1A1410]' 
                        : 'bg-[#241C16]/50 border-white/5 text-karite/60'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Input amount */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider font-semibold text-karite/40 font-display block">Montant à recharger (FCFA)</label>
                <input
                  type="number"
                  placeholder="Ex: 10000"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  className="w-full bg-[#241C16] border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs font-mono outline-none focus:border-gold-kene transition"
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowTopupModal(false)}
                  className="flex-1 bg-transparent hover:bg-white/5 border border-white/10 text-white rounded-xl text-xs py-2 cursor-pointer font-semibold transition"
                >
                  Annuler
                </button>
                <Button
                  onClick={handleTopup}
                  disabled={recharging}
                  className="flex-1 bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410] rounded-xl text-xs py-2 font-semibold cursor-pointer shadow-lg shadow-gold-kene/10"
                >
                  {recharging ? 'Simuler Dépôt...' : 'Confirmer'}
                </Button>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
