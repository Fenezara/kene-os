'use client'

import React, { useState } from 'react'
import { motion as m, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, Trash2, Plus, Minus, CreditCard, Sparkles, 
  Smartphone, Wallet, Receipt, CheckCircle, ShieldAlert 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

interface ProductItem {
  id: string
  name: string
  price: number
  category: 'soin' | 'produit'
}

interface CartItem extends ProductItem {
  quantity: number
}

export default function CaissePage() {
  const { toast } = useToast()
  
  const parseJsonField = (field: string, fallback: any = []) => {
    try {
      return JSON.parse(field)
    } catch (e) {
      return fallback
    }
  }
  
  // Static catalog items
  const catalog: ProductItem[] = [
    { id: '1', name: 'Soin Botanique Clarifiant Moringa', price: 25000, category: 'soin' },
    { id: '2', name: 'Soin Gommage Nourrissant Karité', price: 18000, category: 'soin' },
    { id: '3', name: 'Massages Huile de Baobab & Néroli', price: 30000, category: 'soin' },
    { id: '4', name: 'Crème Hydratante au Baobab (50ml)', price: 12000, category: 'produit' },
    { id: '5', name: 'Sérum Éclat à l\'Hibiscus (30ml)', price: 15000, category: 'produit' },
    { id: '6', name: 'Savon Purifiant Moringa Bio', price: 4500, category: 'produit' },
  ]

  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState<'wave' | 'orange' | 'cash' | null>(null)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [isSimulatingPush, setIsSimulatingPush] = useState(false)
  const [completedInvoice, setCompletedInvoice] = useState<any>(null)
  const [phoneNumber, setPhoneNumber] = useState('')

  // Add to cart
  const addToCart = (product: ProductItem) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id)
      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  // Update quantity
  const updateQuantity = (id: string, amount: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + amount
            return nextQty > 0 ? { ...item, quantity: nextQty } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    )
  }

  // Calculate totals
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const vatAmount = Math.round(subtotal * 0.18) // 18% standard UEMOA VAT
  const total = subtotal + vatAmount

  const handleCheckout = () => {
    if (cart.length === 0) return
    setShowCheckoutModal(true)
  }

  const triggerMoMoPayment = () => {
    if (!phoneNumber) {
      toast({
        title: "⚠️ Erreur",
        description: "Veuillez entrer le numéro Mobile Money du client.",
        variant: "destructive",
      })
      return
    }
    setIsSimulatingPush(true)
  }

  const handleConfirmPushSimulation = async () => {
    setIsSimulatingPush(false)
    setShowCheckoutModal(false)
    setLoading(true)

    // Call sales API to log transaction in database
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((c) => ({
            id: c.id,
            name: c.name,
            price: c.price,
            qty: c.quantity,
            category: c.category,
          })),
          subtotal,
          vatAmount,
          total,
          method: paymentMethod,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setCompletedInvoice(data.sale)
        setCart([])
        setPhoneNumber('')
        setPaymentMethod(null)
      } else {
        throw new Error(data.error?.message || "Erreur d'encaissement.")
      }
    } catch (err: any) {
      toast({
        title: "❌ Échec de facturation",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const [loading, setLoading] = useState(false)

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-white">
      {/* Header */}
      <div className="bg-[#1A1410] border border-white/5 p-6 rounded-3xl shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-display text-gold-kene">Caisse Enregistreuse (POS)</h1>
          <p className="text-xs text-white/50 font-sans mt-1">
            Enregistrez les prestations et vendez les cosmétiques botaniques aux clientes.
          </p>
        </div>
        <ShoppingBag className="w-8 h-8 text-gold-kene" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left catalog panel (3 columns) */}
        <div className="lg:col-span-3 bg-[#1A1410] border border-white/5 p-6 rounded-3xl space-y-6">
          <h3 className="font-display font-semibold text-sm uppercase text-gold-kene tracking-wider border-b border-white/5 pb-3">Catalogue Produits & Soins</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {catalog.map((item) => (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                className="bg-[#241C16]/40 hover:bg-[#241C16]/60 border border-white/5 hover:border-gold-kene/20 p-4 rounded-2xl text-left transition flex flex-col justify-between h-28 cursor-pointer group"
              >
                <div className="flex justify-between items-start w-full">
                  <span className="text-xs font-bold font-sans line-clamp-2 pr-2 text-white group-hover:text-gold-kene transition">{item.name}</span>
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                    item.category === 'soin' ? 'bg-sunset/10 text-sunset' : 'bg-baobab/10 text-baobab'
                  }`}>
                    {item.category === 'soin' ? 'Soin' : 'Produit'}
                  </span>
                </div>
                <span className="font-mono text-sm font-bold text-white/90">{item.price.toLocaleString()} FCFA</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right cart panel (2 columns) */}
        <div className="lg:col-span-2 bg-[#1A1410] border border-white/5 p-6 rounded-3xl flex flex-col justify-between min-h-[50vh] shadow-lg">
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-sm uppercase text-gold-kene tracking-wider border-b border-white/5 pb-3">Panier Actuel</h3>

            {cart.length === 0 ? (
              <div className="text-center py-16 text-white/30 text-xs italic">
                Panier vide. Cliquez sur un article du catalogue pour l'ajouter.
              </div>
            ) : (
              <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1 scrollbar-none">
                {cart.map((item) => (
                  <div key={item.id} className="bg-[#241C16]/30 border border-white/5 p-3 rounded-xl flex justify-between items-center text-xs">
                    <div className="space-y-0.5 max-w-[65%]">
                      <span className="font-bold text-white block line-clamp-1">{item.name}</span>
                      <span className="text-[10px] text-white/40 block font-mono">{item.price.toLocaleString()} FCFA</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer text-white">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-white text-xs w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer text-white">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart totals */}
          {cart.length > 0 && (
            <div className="border-t border-white/5 pt-4 mt-4 space-y-3">
              <div className="space-y-1.5 text-xs text-white/50 font-sans">
                <div className="flex justify-between">
                  <span>Sous-total HT</span>
                  <span className="font-mono text-white">{subtotal.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span>TVA (18% OHADA)</span>
                  <span className="font-mono text-white">{vatAmount.toLocaleString()} FCFA</span>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-3">
                <span className="font-display font-bold text-sm text-gold-kene uppercase">Total à payer</span>
                <span className="font-mono text-lg font-bold text-white">{total.toLocaleString()} FCFA</span>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410] font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer font-display shadow-lg shadow-gold-kene/10"
              >
                Procéder à l'Encaissement
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Invoice receipt printout dialog */}
      {completedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <m.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white text-black font-mono p-6 rounded-3xl w-full max-w-xs shadow-2xl relative border-t-8 border-gold-kene flex flex-col items-center"
          >
            <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
            <h4 className="font-bold text-sm tracking-wider uppercase">REÇU DE VENTE KÈNÈ</h4>
            <span className="text-[10px] text-gray-500">Institut Cocody, Abidjan</span>
            
            <div className="w-full border-t border-dashed border-gray-300 my-4"></div>
            
            <div className="w-full text-xs space-y-1.5">
              <div className="flex justify-between">
                <span>Facture N°:</span>
                <span className="font-bold">{completedInvoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{new Date(completedInvoice.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Statut:</span>
                <span className="text-green-600 font-bold uppercase">Payé</span>
              </div>
            </div>

            <div className="w-full border-t border-dashed border-gray-300 my-4"></div>

            {/* List of items */}
            <div className="w-full text-xs space-y-2">
              {parseJsonField(completedInvoice.items).map((it: any, idx: number) => (
                <div key={idx} className="flex justify-between items-start">
                  <div className="max-w-[70%]">
                    <span className="block font-bold text-gray-800">{it.name}</span>
                    <span className="text-[10px] text-gray-500">Qty {it.qty} x {it.price.toLocaleString()}</span>
                  </div>
                  <span className="font-mono text-gray-700 font-semibold">{(it.price * it.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="w-full border-t border-dashed border-gray-300 my-4"></div>

            <div className="w-full text-xs space-y-1">
              <div className="flex justify-between">
                <span>Total HT</span>
                <span className="font-mono">{completedInvoice.subtotal.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span>TVA (18% UEMOA)</span>
                <span className="font-mono">{completedInvoice.vatAmount.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-dashed border-gray-300 pt-2 mt-2">
                <span>TOTAL TTC</span>
                <span className="font-mono text-gold-kene">{completedInvoice.total.toLocaleString()} FCFA</span>
              </div>
            </div>

            <Button
              onClick={() => setCompletedInvoice(null)}
              className="mt-6 w-full bg-black hover:bg-black/90 text-white font-semibold py-2.5 rounded-xl cursor-pointer"
            >
              Fermer & Imprimer
            </Button>
          </m.div>
        </div>
      )}

      {/* Checkout Payment Modal */}
      <AnimatePresence>
        {showCheckoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <m.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1A1410] border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative text-white"
            >
              <h3 className="font-display font-bold text-lg text-gold-kene mb-2">Choisir le Paiement</h3>
              <p className="text-xs text-white/40 mb-4">Montant total à encaisser : <strong className="text-white font-mono text-sm">{total.toLocaleString()} FCFA</strong></p>

              {!isSimulatingPush ? (
                /* Select Payment Mode */
                <div className="space-y-3">
                  <button
                    onClick={() => { setPaymentMethod('wave'); setPhoneNumber('+22507000000') }}
                    className={`w-full p-4 rounded-2xl text-left border flex items-center gap-3 transition cursor-pointer ${
                      paymentMethod === 'wave'
                        ? 'bg-gold-kene/10 border-gold-kene/30 text-white'
                        : 'bg-[#241C16]/20 border-white/5 hover:bg-[#241C16]/40 hover:border-white/10'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-sky-400" />
                    <div>
                      <span className="font-bold text-sm block">Wave Money</span>
                      <span className="text-[10px] text-white/40 block">Mobile Money Côte d'Ivoire / Sénégal</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setPaymentMethod('orange'); setPhoneNumber('+22507000000') }}
                    className={`w-full p-4 rounded-2xl text-left border flex items-center gap-3 transition cursor-pointer ${
                      paymentMethod === 'orange'
                        ? 'bg-gold-kene/10 border-gold-kene/30 text-white'
                        : 'bg-[#241C16]/20 border-white/5 hover:bg-[#241C16]/40 hover:border-white/10'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-orange-400" />
                    <div>
                      <span className="font-bold text-sm block">Orange Money</span>
                      <span className="text-[10px] text-white/40 block">Paiement Mobile National</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setPaymentMethod('cash'); triggerMoMoPayment() }} // Cash directly triggers confirmation
                    className={`w-full p-4 rounded-2xl text-left border flex items-center gap-3 transition cursor-pointer ${
                      paymentMethod === 'cash'
                        ? 'bg-gold-kene/10 border-gold-kene/30 text-white'
                        : 'bg-[#241C16]/20 border-white/5 hover:bg-[#241C16]/40 hover:border-white/10'
                    }`}
                  >
                    <Wallet className="w-5 h-5 text-green-400" />
                    <div>
                      <span className="font-bold text-sm block">Espèces</span>
                      <span className="text-[10px] text-white/40 block">Caisse physique du salon</span>
                    </div>
                  </button>

                  {/* MoMo credentials entry panel */}
                  {paymentMethod && paymentMethod !== 'cash' && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="space-y-3 pt-3 border-t border-white/5"
                    >
                      <div className="space-y-1.5">
                        <label className="text-xs text-white/50">Numéro Mobile Money du client</label>
                        <Input
                          type="tel"
                          placeholder="+225 07 00 00 00"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="bg-[#241C16] border-white/10 text-white rounded-xl text-xs"
                        />
                      </div>
                      <Button
                        onClick={triggerMoMoPayment}
                        className="w-full bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410] font-semibold py-2.5 rounded-xl text-xs cursor-pointer"
                      >
                        Lancer le Push USSD
                      </Button>
                    </m.div>
                  )}

                  <Button
                    onClick={() => { setShowCheckoutModal(false); setPaymentMethod(null) }}
                    className="w-full bg-transparent hover:bg-white/5 border border-white/10 text-white py-2 rounded-xl text-xs mt-4 cursor-pointer"
                  >
                    Annuler
                  </Button>
                </div>
              ) : (
                /* Immersive MoMo simulation */
                <m.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-5 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto animate-pulse">
                    <Smartphone className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-bold text-sm uppercase text-sky-400">Push USSD envoyé</h4>
                    <p className="text-xs text-white/70 leading-relaxed font-sans max-w-[250px] mx-auto">
                      Une demande de débit de <strong className="text-white font-mono">{total.toLocaleString()} FCFA</strong> a été poussée sur le numéro client <strong className="text-white">{phoneNumber}</strong> via {paymentMethod === 'wave' ? 'Wave' : 'Orange'}.
                    </p>
                  </div>

                  <div className="bg-[#241C16] border border-white/5 rounded-2xl p-4 text-xs font-mono text-left space-y-1">
                    <span className="text-gold-kene block border-b border-white/5 pb-1 mb-1 font-bold">📲 SIMULATION OPERATEUR</span>
                    <span className="text-white/60 block">1. Saisissez le code PIN sur le mobile du client.</span>
                    <span className="text-white/60 block">2. Validez la transaction de {total.toLocaleString()} FCFA.</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setIsSimulatingPush(false)}
                      className="flex-1 bg-transparent hover:bg-white/5 border border-white/10 text-white py-2 rounded-xl text-xs cursor-pointer"
                    >
                      Retour
                    </Button>
                    <Button
                      onClick={handleConfirmPushSimulation}
                      className="flex-1 bg-sky-500 hover:bg-sky-400 text-[#1A1410] font-semibold py-2 rounded-xl text-xs cursor-pointer"
                    >
                      Confirmer le paiement
                    </Button>
                  </div>
                </m.div>
              )}
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
