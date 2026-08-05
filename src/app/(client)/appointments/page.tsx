'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion as m, AnimatePresence } from 'framer-motion'
import { 
  Calendar as CalendarIcon, ArrowLeft, Plus, RefreshCw, Clock, 
  User as UserIcon, Sparkles, AlertTriangle, ShieldCheck, XCircle, 
  Coins, Wallet, Smartphone, Landmark, CheckCircle, Info 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface Service {
  id: string
  name: string
  price: number
  durationMin: number
  category: string
}

interface Employee {
  id: string
  firstName: string
  lastName: string
  position: string
}

interface Appointment {
  id: string
  startAt: string
  endAt: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  amount: number
  depositAmount: number
  notes: string | null
  service: Service
  employee: Employee
}

export default function AppointmentsPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [walletBalance, setWalletBalance] = useState<number | null>(null)
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [clientId, setClientId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  // Wizard States
  const [showWizard, setShowWizard] = useState(false)
  const [wizardStep, setWizardStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details')
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedEmployee, setSelectedEmployee] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('09:00')
  const [paymentMethod, setPaymentMethod] = useState<'wave' | 'orange' | 'wallet'>('wave')
  const [momoNumber, setMomoNumber] = useState('')

  // Cancel Confirmation States
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null)
  const [cancelling, setCancelling] = useState(false)

  const fetchData = async (uid: string) => {
    setLoading(true)
    try {
      // 1. Fetch all clients to find our clientId matching user.id
      const cRes = await fetch('/api/clients')
      const cJson = await cRes.json()
      let clientRecord: any = null
      if (cJson.success) {
        clientRecord = cJson.clients.find((c: any) => c.userId === uid)
      }

      if (clientRecord) {
        setClientId(clientRecord.id)
        
        // 2. Fetch appointments for this client
        const aRes = await fetch(`/api/appointments?clientId=${clientRecord.id}`)
        const aJson = await aRes.json()
        if (aJson.success) {
          setAppointments(aJson.appointments)
        }
      }

      // 3. Fetch catalog metadata (services and employees)
      const mRes = await fetch('/api/appointments?metadata=true')
      const mJson = await mRes.json()
      if (mJson.success) {
        setServices(mJson.services)
        setEmployees(mJson.employees)
        if (mJson.services.length > 0) setSelectedService(mJson.services[0].id)
        if (mJson.employees.length > 0) setSelectedEmployee(mJson.employees[0].id)
      }

      // 4. Fetch Wallet
      const wRes = await fetch(`/api/wallet?userId=${uid}`)
      const wJson = await wRes.json()
      if (wJson.success) {
        setWalletBalance(wJson.wallet.balance)
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
        fetchData(parsed.id)
        return
      } catch (e) {}
    }
    
    // Smooth fallback for client browsing: use demo user ID
    const defaultUid = 'user-demo-01'
    setUserId(defaultUid)
    fetchData(defaultUid)
  }, [])

  // Calculate cancel refund estimation
  const getRefundEstimation = (app: Appointment) => {
    const start = new Date(app.startAt)
    const now = new Date()
    const diffMs = start.getTime() - now.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)

    if (diffHours > 72) {
      return { rate: 1.0, refund: app.depositAmount, text: 'Remboursement Intégral (100%)', style: 'text-emerald-400' }
    } else if (diffHours > 24) {
      return { rate: 0.8, refund: Math.round(app.depositAmount * 0.8), text: 'Remboursement Standard (80%)', style: 'text-green-400' }
    } else if (diffHours > 2) {
      return { rate: 0.3, refund: Math.round(app.depositAmount * 0.3), text: 'Pénalité Appliquée (30% remboursé)', style: 'text-orange-400' }
    }
    return { rate: 0.0, refund: 0, text: 'Non Remboursable (0%)', style: 'text-red-400' }
  }

  const handleCancelAppointment = async () => {
    if (!cancelTarget) return
    setCancelling(true)
    try {
      const res = await fetch(`/api/appointments/${cancelTarget.id}/cancel`, {
        method: 'POST'
      })
      const json = await res.json()

      if (json.success) {
        toast({
          title: "âŒ Rendez-vous Annulé",
          description: `Votre rendez-vous a été annulé. ${
            json.refundAmount > 0 
              ? `${json.refundAmount.toLocaleString()} F ont été recrédités sur votre portefeuille.` 
              : "L'acompte a été conservé selon la politique horaire."
          }`,
        })
        setCancelTarget(null)
        if (userId) fetchData(userId)
      } else {
        throw new Error(json.error?.message || "Erreur lors de l'annulation.")
      }
    } catch (e: any) {
      toast({
        title: "âŒ Échec de l'annulation",
        description: e.message,
        variant: "destructive"
      })
    } finally {
      setCancelling(false)
    }
  }

  const handleCreateAppointment = async () => {
    if (!selectedService || !selectedEmployee || !selectedDate || !selectedTime || !clientId) {
      toast({
        title: "⚠️ï¸ Formulaire incomplet",
        description: "Veuillez renseigner la date, l'heure et les intervenants.",
        variant: "destructive"
      })
      return
    }

    const startAt = `${selectedDate}T${selectedTime}:00`
    const depositAmount = 5000 // Standard fixed booking deposit policy
    
    if (paymentMethod === 'wallet' && walletBalance !== null && walletBalance < depositAmount) {
      toast({
        title: "⚠️ï¸ Solde insuffisant",
        description: "Votre portefeuille Kènè n'a pas assez de fonds pour payer l'acompte (5 000 F).",
        variant: "destructive"
      })
      return
    }

    if (paymentMethod !== 'wallet' && !momoNumber) {
      toast({
        title: "⚠️ï¸ Numéro requis",
        description: "Veuillez entrer votre numéro Mobile Money pour valider la transaction.",
        variant: "destructive"
      })
      return
    }

    setWizardStep('processing')

    try {
      // Simulate MoMo push delay if not wallet
      if (paymentMethod !== 'wallet') {
        await new Promise((resolve) => setTimeout(resolve, 2500))
      }

      const selectedServ = services.find((s) => s.id === selectedService)

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          serviceId: selectedService,
          employeeId: selectedEmployee,
          startAt,
          amount: selectedServ?.price,
          depositAmount,
          paymentMethod,
          notes: 'Réservé via le portail client Kènè'
        })
      })

      const json = await res.json()

      if (json.success) {
        setWizardStep('success')
        if (userId) fetchData(userId)
      } else {
        throw new Error(json.error?.message || "Erreur de réservation.")
      }
    } catch (e: any) {
      toast({
        title: "âŒ Échec de la réservation",
        description: e.message,
        variant: "destructive"
      })
      setWizardStep('details')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return { label: 'Confirmé', style: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' }
      case 'completed': return { label: 'Effectué', style: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' }
      case 'cancelled': return { label: 'Annulé', style: 'bg-red-500/10 text-red-400 border border-red-500/20' }
      default: return { label: 'En attente', style: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' }
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-start min-h-[85vh] text-karite max-w-lg mx-auto p-4 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/portal')}
            className="text-karite/60 hover:text-karite transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display font-bold text-lg text-gold-kene">Mes Rendez-vous</h1>
        </div>

        <Button
          onClick={() => {
            setWizardStep('details')
            setShowWizard(true)
          }}
          className="bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410] font-semibold rounded-xl text-xs py-1 px-3 flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Nouveau RDV
        </Button>
      </header>

      {/* Info on cancellation policy */}
      <div className="bg-[#241C16]/50 border border-white/5 p-4 rounded-2xl flex items-start gap-3 text-[10px]">
        <Info className="w-4 h-4 text-gold-kene shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-white uppercase tracking-wider">Politique d'Annulation Kènè</h4>
          <p className="text-karite/60 leading-relaxed font-sans">
            Annulation libre et remboursée à  **100%** à  plus de 72h. Remboursement à  **80%** entre 24h et 72h, et **30%** à  moins de 24h. Aucun remboursement à  moins de 2h. Les remboursements sont crédités instantanément sur votre portefeuille.
          </p>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3 flex-1">
        <h3 className="font-display font-bold text-xs uppercase tracking-wider text-gold-kene">Planning des soins</h3>

        {loading ? (
          <div className="space-y-2 py-4">
            <div className="h-16 bg-[#241C16]/30 animate-pulse rounded-2xl"></div>
            <div className="h-16 bg-[#241C16]/30 animate-pulse rounded-2xl"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-16 bg-[#1A1410]/40 border border-white/5 rounded-2xl text-karite/40 text-xs italic font-sans">
            Aucun rendez-vous planifié.
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((app) => {
              const statusInfo = getStatusBadge(app.status)
              const upcoming = new Date(app.startAt) > new Date() && app.status !== 'cancelled'
              
              return (
                <div 
                  key={app.id}
                  className="bg-[#1A1410] border border-white/5 p-5 rounded-2xl space-y-4 transition hover:border-white/10"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] text-white/40 font-semibold uppercase">{app.service.category}</span>
                      <h4 className="font-bold text-sm text-white font-display">{app.service.name}</h4>
                      <div className="flex items-center gap-1 text-[10px] text-karite/50 font-sans">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(app.startAt).toLocaleString()} ({app.service.durationMin} min)</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-karite/50 font-sans">
                        <UserIcon className="w-3.5 h-3.5" />
                        <span>Praticienne : {app.employee.firstName} {app.employee.lastName}</span>
                      </div>
                    </div>
                    
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${statusInfo.style}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-t border-white/5 pt-3.5 text-[10px]">
                    <div className="font-mono text-karite/50">
                      Acompte payé : <span className="text-white font-bold">{app.depositAmount.toLocaleString()} F</span>
                    </div>

                    {upcoming && (
                      <button
                        onClick={() => setCancelTarget(app)}
                        className="text-red-400 hover:text-red-300 font-semibold uppercase tracking-wider cursor-pointer"
                      >
                        Annuler
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Appointment Booking Wizard Modal */}
      <AnimatePresence>
        {showWizard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <m.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1A1410] border border-white/10 p-6 rounded-3xl w-full max-w-sm space-y-5 text-left shadow-2xl relative"
            >
              {wizardStep === 'details' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-sm text-gold-kene uppercase tracking-wider flex items-center gap-1.5">
                      <CalendarIcon className="w-4 h-4" /> Réserver un Soin Kènè
                    </h3>
                    <p className="text-[10px] text-karite/50 font-sans">
                      Choisissez la prestation, la praticienne et le créneau idéal.
                    </p>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    {/* Prestation selection */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider font-semibold text-karite/40 font-display">Soin Botanique</label>
                      <select
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-full bg-[#241C16] border border-white/10 text-white rounded-xl px-4 py-2.5 outline-none focus:border-gold-kene transition cursor-pointer"
                      >
                        {services.map((s) => (
                          <option key={s.id} value={s.id}>{s.name} ({s.price.toLocaleString()} F)</option>
                        ))}
                      </select>
                    </div>

                    {/* Practitioner selection */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider font-semibold text-karite/40 font-display">Praticienne / Esthéticienne</label>
                      <select
                        value={selectedEmployee}
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                        className="w-full bg-[#241C16] border border-white/10 text-white rounded-xl px-4 py-2.5 outline-none focus:border-gold-kene transition cursor-pointer"
                      >
                        {employees.map((emp) => (
                          <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.position})</option>
                        ))}
                      </select>
                    </div>

                    {/* Date and Time slots */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider font-semibold text-karite/40 font-display">Date</label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full bg-[#241C16] border border-white/10 text-white rounded-xl px-4 py-2.5 outline-none focus:border-gold-kene transition font-mono text-center"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider font-semibold text-karite/40 font-display">Heure</label>
                        <select
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full bg-[#241C16] border border-white/10 text-white rounded-xl px-4 py-2.5 outline-none focus:border-gold-kene transition font-mono text-center cursor-pointer"
                        >
                          {['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'].map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setShowWizard(false)}
                      className="flex-1 bg-transparent hover:bg-white/5 border border-white/10 text-white rounded-xl text-xs py-2.5 cursor-pointer font-semibold transition"
                    >
                      Annuler
                    </button>
                    <Button
                      onClick={() => setWizardStep('payment')}
                      className="flex-1 bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410] rounded-xl text-xs py-2.5 font-semibold cursor-pointer"
                    >
                      Suivant (Acompte)
                    </Button>
                  </div>
                </div>
              )}

              {wizardStep === 'payment' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-sm text-gold-kene uppercase tracking-wider flex items-center gap-1.5">
                      <Coins className="w-4 h-4" /> Acompte de Réservation
                    </h3>
                    <p className="text-[10px] text-karite/50 font-sans">
                      Pour valider votre créneau, un acompte de **5 000 FCFA** est requis.
                    </p>
                  </div>

                  {/* Payment selector */}
                  <div className="space-y-3.5">
                    <div className="flex gap-2 justify-center">
                      {(['wave', 'orange', 'wallet'] as const).map((method) => (
                        <button
                          key={method}
                          onClick={() => setPaymentMethod(method)}
                          className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition cursor-pointer ${
                            paymentMethod === method 
                              ? 'border-gold-kene bg-gold-kene/10 text-gold-kene' 
                              : 'border-white/5 bg-[#241C16]/50 text-white/50'
                          }`}
                        >
                          {method === 'wallet' ? 'Wallet' : method}
                        </button>
                      ))}
                    </div>

                    {paymentMethod === 'wallet' ? (
                      <div className="bg-[#241C16] border border-white/5 p-4 rounded-xl space-y-1 text-center">
                        <span className="text-[9px] text-white/40 block uppercase tracking-wider font-semibold">Solde portefeuille client</span>
                        <span className="text-base font-bold font-mono text-gold-kene block">
                          {walletBalance !== null ? `${walletBalance.toLocaleString()} F` : 'Chargement...'}
                        </span>
                        {walletBalance !== null && walletBalance < 5000 && (
                          <span className="text-[9px] text-red-400 block font-semibold leading-tight pt-1">
                            Solde insuffisant pour l'acompte.
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider font-semibold text-karite/40 font-display block">Numéro Mobile Money</label>
                        <input
                          type="tel"
                          placeholder="Ex: 07080910"
                          value={momoNumber}
                          onChange={(e) => setMomoNumber(e.target.value)}
                          className="w-full bg-[#241C16] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-gold-kene text-center font-mono"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setWizardStep('details')}
                      className="flex-1 bg-transparent hover:bg-white/5 border border-white/10 text-white rounded-xl text-xs py-2.5 cursor-pointer font-semibold transition"
                    >
                      Retour
                    </button>
                    <Button
                      onClick={handleCreateAppointment}
                      disabled={paymentMethod === 'wallet' && walletBalance !== null && walletBalance < 5000}
                      className="flex-1 bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410] rounded-xl text-xs py-2.5 font-semibold cursor-pointer shadow-lg shadow-gold-kene/10"
                    >
                      Confirmer (5 000 F)
                    </Button>
                  </div>
                </div>
              )}

              {wizardStep === 'processing' && (
                <div className="space-y-4 py-6 text-center">
                  <div className="w-10 h-10 border-4 border-gold-kene border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">Création du rendez-vous...</h4>
                    {paymentMethod !== 'wallet' && (
                      <p className="text-[10px] text-white/40">Veuillez approuver la transaction Mobile Money sur votre appareil.</p>
                    )}
                  </div>
                </div>
              )}

              {wizardStep === 'success' && (
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                    <CheckCircle className="w-6 h-6 animate-bounce" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-sm uppercase text-emerald-400">Rendez-vous Confirmé !</h3>
                    <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                      Votre acompte de **5 000 F** a été validé. La cabine et votre esthéticienne vous sont réservées.
                    </p>
                  </div>

                  <Button
                    onClick={() => setShowWizard(false)}
                    className="w-full bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410] text-xs font-semibold py-2.5 rounded-xl cursor-pointer"
                  >
                    Fermer
                  </Button>
                </div>
              )}
            </m.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cancellation Confirmation Dialog */}
      <AnimatePresence>
        {cancelTarget && (() => {
          const refundInfo = getRefundEstimation(cancelTarget)
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
              <m.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#1A1410] border border-white/10 p-6 rounded-3xl w-full max-w-sm space-y-4 text-left shadow-2xl relative"
              >
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-sm text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Confirmer l'Annulation
                  </h3>
                  <p className="text-[10px] text-karite/50 font-sans">
                    Vous êtes sur le point d'annuler votre soin : **{cancelTarget.service.name}**.
                  </p>
                </div>

                <div className="bg-[#241C16] border border-white/5 p-4 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between text-karite/50">
                    <span>Acompte Versé :</span>
                    <span className="font-mono text-white">{cancelTarget.depositAmount.toLocaleString()} F</span>
                  </div>
                  <div className="flex justify-between text-karite/50">
                    <span>Règle horaire :</span>
                    <span className={`font-semibold ${refundInfo.style}`}>{refundInfo.text}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-white/5 pt-2 mt-2 text-white">
                    <span>Montant Remboursé :</span>
                    <span className="font-mono text-gold-kene">{refundInfo.refund.toLocaleString()} FCFA</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setCancelTarget(null)}
                    className="flex-1 bg-transparent hover:bg-white/5 border border-white/10 text-white rounded-xl text-xs py-2.5 cursor-pointer font-semibold transition"
                  >
                    Retour
                  </button>
                  <Button
                    onClick={handleCancelAppointment}
                    disabled={cancelling}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs py-2.5 font-semibold cursor-pointer shadow-lg shadow-red-600/10"
                  >
                    {cancelling ? 'Traitement...' : 'Confirmer'}
                  </Button>
                </div>
              </m.div>
            </div>
          )
        })()}
      </AnimatePresence>
    </div>
  )
}
