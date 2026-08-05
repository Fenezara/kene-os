'use client'

import React, { useState, useEffect } from 'react'
import { motion as m, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ShoppingBag, Wallet as WalletIcon, Smartphone, Check, Loader2, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

const PROVIDERS = {
  wallet: { label: 'Kènè Pay (Solde)', color: '#C8951E', icon: WalletIcon },
  wave: { label: 'Wave', color: '#1BA4FB', icon: Smartphone },
  orange: { label: 'Orange Money', color: '#FF7900', icon: Smartphone },
  mtn: { label: 'MTN Mobile Money', color: '#FFCC00', icon: Smartphone }
}

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [userId, setUserId] = useState<string | null>(null)
  const [walletBalance, setWalletBalance] = useState<number>(0)
  const [selectedPayment, setSelectedPayment] = useState<keyof typeof PROVIDERS>('wallet')
  
  const [processing, setProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const [cartItems, setCartItems] = useState<any[]>([])

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  useEffect(() => {
    const userStr = localStorage.getItem('kene_user')
    if (userStr) {
      const parsed = JSON.parse(userStr)
      setUserId(parsed.id)
      
      // Fetch balance to see if they can pay with wallet
      fetch(`/api/wallet?userId=${parsed.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.wallet) {
            setWalletBalance(data.wallet.balance)
          }
        })
    } else {
      router.push('/')
    }

    const storedCart = localStorage.getItem('kene_cart')
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart))
      } catch (e) {
        console.error('Failed to parse cart', e)
      }
    }
  }, [])

  const handleCheckout = async () => {
    if (!userId) return

    setProcessing(true)
    setPaymentSuccess(false)

    try {
      // 1. Initier le Checkout
      const checkoutRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          items: cartItems,
          paymentMethod: selectedPayment
        })
      })
      const checkoutJson = await checkoutRes.json()

      if (!checkoutJson.success) {
        throw new Error(checkoutJson.error?.message || "Erreur de création de commande.")
      }

      if (checkoutJson.status === 'paid') {
        // Paiement par Wallet réussi immédiatement
        setPaymentSuccess(true)
        localStorage.removeItem('kene_cart')
        setCartItems([])
        setTimeout(() => {
           setProcessing(false)
           router.push('/wallet') // Redirect back to wallet to see the debit
        }, 2500)
      } else if (checkoutJson.status === 'pending') {
        // 2. Paiement par Mobile Money : déclencher la simulation USSD
        const momoRes = await fetch('/api/payments/momo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            amount: totalAmount,
            provider: selectedPayment,
            type: 'checkout',
            referenceId: checkoutJson.sale.id
          })
        })
        const momoJson = await momoRes.json()

        if (momoJson.success) {
          setPaymentSuccess(true)
          localStorage.removeItem('kene_cart')
          setCartItems([])
          setTimeout(() => {
            setProcessing(false)
            router.push('/wallet')
          }, 2500)
        } else {
          throw new Error(momoJson.error?.message || "Erreur validation Mobile Money.")
        }
      }
    } catch (e: any) {
      setProcessing(false)
      toast({
        title: "❌ Échec du paiement",
        description: e.message,
        variant: "destructive"
      })
    }
  }

  const activeColor = PROVIDERS[selectedPayment].color

  return (
    <div className="flex-1 flex flex-col min-h-screen text-karite max-w-lg mx-auto p-4 space-y-6 pb-32">
      {/* Header */}
      <header className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-karite/60 hover:text-karite transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display font-bold text-lg text-gold-kene">Finaliser la Commande</h1>
      </header>

      {cartItems.length === 0 ? (
        <div className="py-20 text-center text-karite/60 flex flex-col items-center justify-center space-y-4">
          <ShoppingBag className="w-16 h-16 opacity-20 mb-2" />
          <p>Votre panier est vide.</p>
          <Button onClick={() => router.push('/boutique')} variant="secondary" className="bg-[#C8951E]/10 text-[#C8951E] hover:bg-[#C8951E]/20 mt-4 h-10 rounded-xl">
            Aller à la boutique
          </Button>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-5 h-5 text-karite/60" />
              <h2 className="font-display font-bold text-sm uppercase tracking-wider text-white">Votre Panier</h2>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className="bg-[#1A1410] border border-white/5 p-4 rounded-2xl flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-semibold text-xs text-white block">{item.name}</span>
                  <span className="text-[10px] text-karite/50 font-sans block">Qté: {item.quantity} • {item.type === 'service' ? 'Soin' : 'Produit'}</span>
                </div>
                <span className="font-mono text-sm font-bold text-gold-kene">
                  {(item.price * item.quantity).toLocaleString()} F
                </span>
              </div>
            ))}

            <div className="bg-[#241C16]/50 border border-gold-kene/20 p-4 rounded-2xl flex justify-between items-center mt-4">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-white">Total à payer</span>
              <span className="font-display text-xl font-bold text-white tracking-wide">
                {totalAmount.toLocaleString()} F
              </span>
            </div>
          </div>

          {/* Payment Selection */}
          <div className="space-y-4 pt-4">
            <h2 className="font-display font-bold text-sm uppercase tracking-wider text-white mb-2">Méthode de Paiement</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.keys(PROVIDERS) as Array<keyof typeof PROVIDERS>).map((pid) => {
                const isSelected = selectedPayment === pid
                const Icon = PROVIDERS[pid].icon
                
                const disabled = pid === 'wallet' && walletBalance < totalAmount

                return (
                  <button
                    key={pid}
                    onClick={() => setSelectedPayment(pid)}
                    disabled={disabled}
                    className={`p-4 rounded-2xl border text-left flex flex-col gap-3 transition cursor-pointer relative overflow-hidden ${
                      isSelected 
                        ? 'bg-white/10 text-white shadow-lg' 
                        : 'bg-[#1A1410] border-white/5 text-karite/60 hover:border-white/10'
                    } ${disabled ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
                    style={{ borderColor: isSelected ? PROVIDERS[pid].color : '' }}
                  >
                    {isSelected && (
                      <m.div 
                        layoutId="activePaymentBg"
                        className="absolute inset-0 opacity-[0.05]"
                        style={{ backgroundColor: PROVIDERS[pid].color }}
                      />
                    )}
                    <div className="flex justify-between items-start relative z-10">
                      <Icon className="w-5 h-5" style={{ color: isSelected ? PROVIDERS[pid].color : '' }} />
                      {pid === 'wallet' && (
                        <span className="text-[9px] font-mono border px-1.5 py-0.5 rounded-full border-karite/20">
                          Solde: {walletBalance.toLocaleString()} F
                        </span>
                      )}
                    </div>
                    <span className="font-display font-bold text-[11px] uppercase tracking-wider relative z-10">
                      {PROVIDERS[pid].label}
                    </span>
                    
                    {disabled && pid === 'wallet' && (
                      <span className="text-[9px] text-red-400 absolute bottom-1 right-2">Solde insuffisant</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Checkout Sticky Bar */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex justify-center z-40">
            <Button
              onClick={handleCheckout}
              disabled={processing || (selectedPayment === 'wallet' && walletBalance < totalAmount)}
              className="w-full max-w-lg h-14 rounded-2xl font-bold font-display uppercase tracking-widest text-xs cursor-pointer shadow-2xl transition disabled:opacity-50"
              style={{ backgroundColor: activeColor, color: '#1A1410' }}
            >
              {processing ? 'Traitement...' : `Payer ${totalAmount.toLocaleString()} F`}
            </Button>
          </div>
        </>
      )}

      {/* USSD Processing Modal */}
      <AnimatePresence>
        {processing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <m.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1A1410] border border-white/10 p-6 rounded-3xl w-full max-w-sm space-y-5 text-center shadow-2xl relative overflow-hidden"
            >
              <m.div 
                animate={{ backgroundColor: activeColor }}
                className="absolute inset-0 opacity-[0.03] pointer-events-none" 
              />
              
              <div className="py-8 flex flex-col items-center justify-center space-y-4">
                  {paymentSuccess ? (
                    <m.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500"
                    >
                      <Check className="w-10 h-10" />
                    </m.div>
                  ) : (
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full flex items-center justify-center relative z-10" style={{ backgroundColor: `${activeColor}20`, color: activeColor }}>
                        {selectedPayment === 'wallet' ? <WalletIcon className="w-10 h-10 animate-pulse" /> : <Smartphone className="w-10 h-10 animate-bounce" />}
                      </div>
                      <m.div 
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} 
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: activeColor }}
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-white text-base">
                      {paymentSuccess ? 'Paiement Confirmé !' : 
                        (selectedPayment === 'wallet' ? 'Débit de votre solde en cours...' : 'En attente de validation USSD')
                      }
                    </h3>
                    <p className="text-xs text-karite/60">
                      {paymentSuccess 
                        ? 'Redirection vers votre portefeuille...' 
                        : (selectedPayment === 'wallet' ? 'Veuillez patienter.' : 'Veuillez confirmer la transaction sur votre téléphone.')}
                    </p>
                  </div>
                  
                  {!paymentSuccess && selectedPayment !== 'wallet' && (
                    <div className="flex items-center gap-2 text-[10px] text-karite/40 bg-white/5 px-3 py-1.5 rounded-full mt-4">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Ne fermez pas cette fenêtre...</span>
                    </div>
                  )}
                </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
