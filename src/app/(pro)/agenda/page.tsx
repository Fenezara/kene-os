'use client'

import React, { useState, useEffect } from 'react'
import { motion as m, AnimatePresence } from 'framer-motion'
import { 
  Calendar as CalendarIcon, Clock, User, Sparkles, Plus, 
  ChevronLeft, ChevronRight, Check, AlertCircle, Eye 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

interface Appointment {
  id: string
  startAt: string
  endAt: string
  amount: number
  status: string
  notes: string | null
  client: {
    firstName: string
    lastName: string
    phone: string
  }
  service: {
    name: string
    category: string
    price: number
  }
  employee: {
    firstName: string
    lastName: string
    position: string
  }
}

export default function AgendaPage() {
  const { toast } = useToast()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Form states
  const [clientPhone, setClientPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [appointmentTime, setAppointmentTime] = useState('10:00')
  const [submitting, setSubmitting] = useState(false)

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments')
      const json = await res.json()
      if (json.success) {
        setAppointments(json.appointments)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Build ISO Date from selected date and time
    const [hours, minutes] = appointmentTime.split(':')
    const startAt = new Date(selectedDate)
    startAt.setHours(parseInt(hours), parseInt(minutes), 0, 0)

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startAt: startAt.toISOString(),
          notes,
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: "🗓️ Rendez-vous programmé",
          description: "Le rendez-vous a été enregistré dans le planning de l'institut.",
        })
        setShowAddModal(false)
        setNotes('')
        fetchAppointments()
      } else {
        throw new Error(data.error?.message || 'Erreur lors de la programmation.')
      }
    } catch (err: any) {
      toast({
        title: "❌ Erreur",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const hoursList = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']

  // Filter appointments for the selected date
  const dailyAppointments = appointments.filter((app) => {
    const appDate = new Date(app.startAt)
    return (
      appDate.getDate() === selectedDate.getDate() &&
      appDate.getMonth() === selectedDate.getMonth() &&
      appDate.getFullYear() === selectedDate.getFullYear()
    )
  })

  // Format date header
  const formatDateHeader = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const changeDate = (days: number) => {
    const nextDate = new Date(selectedDate)
    nextDate.setDate(selectedDate.getDate() + days)
    setSelectedDate(nextDate)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header bar */}
      <div className="flex justify-between items-center bg-[#1A1410] border border-white/5 p-6 rounded-3xl shadow-lg">
        <div>
          <h1 className="text-2xl font-bold font-display text-gold-kene">Agenda Interactif</h1>
          <p className="text-xs text-white/50 font-sans mt-1">
            Gérez le planning et attribuez les rendez-vous aux cabines de soins.
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410] font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Nouveau rendez-vous
        </Button>
      </div>

      {/* Calendar navigation & display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation panel */}
        <div className="lg:col-span-1 bg-[#1A1410] border border-white/5 p-6 rounded-3xl space-y-6 h-fit">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <h3 className="font-display font-semibold text-sm uppercase text-gold-kene tracking-wider">Sélection Date</h3>
            <div className="flex gap-1">
              <button 
                onClick={() => changeDate(-1)} 
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition cursor-pointer text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => changeDate(1)} 
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition cursor-pointer text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="text-center py-4 bg-[#241C16]/50 rounded-2xl border border-white/5">
            <CalendarIcon className="w-8 h-8 text-gold-kene mx-auto mb-2" />
            <span className="text-sm font-semibold capitalize block text-white">{formatDateHeader(selectedDate)}</span>
          </div>

          {/* Quick list of daily clients */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase text-white/40 tracking-wider">Rendez-vous du jour</h4>
            {loading ? (
              <div className="text-center py-4 text-white/40 text-xs">Chargement...</div>
            ) : dailyAppointments.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-white/5 rounded-2xl text-white/30 text-xs">
                Aucune prestation aujourd'hui.
              </div>
            ) : (
              <div className="space-y-2">
                {dailyAppointments.map((app) => (
                  <div key={app.id} className="bg-[#241C16]/30 border border-white/5 rounded-xl p-3 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold block text-white">{app.client.firstName} {app.client.lastName}</span>
                      <span className="text-[10px] text-white/50">{app.service.name}</span>
                    </div>
                    <span className="font-mono text-gold-kene">{new Date(app.startAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Daily Schedule Grid */}
        <div className="lg:col-span-2 bg-[#1A1410] border border-white/5 p-6 rounded-3xl space-y-4">
          <div className="border-b border-white/5 pb-4">
            <h2 className="font-display font-bold text-lg text-white">Grille des Soins</h2>
            <span className="text-xs text-white/40 font-sans">Aperçu chronologique de la journée</span>
          </div>

          <div className="space-y-1 divide-y divide-white/5 max-h-[60vh] overflow-y-auto pr-2 scrollbar-none">
            {hoursList.map((hour) => {
              // Find matching appointment for this hour block
              const matchingApp = dailyAppointments.find((app) => {
                const appHour = new Date(app.startAt).getHours()
                return `${appHour < 10 ? '0' : ''}${appHour}:00` === hour
              })

              return (
                <div key={hour} className="flex gap-4 py-4 items-start relative group">
                  {/* Time column */}
                  <div className="w-12 font-mono text-xs text-white/40 pt-1 shrink-0">
                    {hour}
                  </div>

                  {/* Slot Column */}
                  <div className="flex-1 min-h-[4rem]">
                    {matchingApp ? (
                      <m.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gradient-to-r from-[#241C16] to-[#1A1410] border border-gold-kene/20 border-l-4 border-l-gold-kene rounded-2xl p-4 flex justify-between items-start shadow-md hover:border-gold-kene/40 transition"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{matchingApp.client.firstName} {matchingApp.client.lastName}</span>
                            <span className="text-[10px] bg-gold-kene/10 text-gold-kene px-2 py-0.5 rounded-full font-medium">
                              {matchingApp.service.category}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-white/70">{matchingApp.service.name}</p>
                          {matchingApp.notes && (
                            <p className="text-[10px] text-white/40 italic font-sans">{matchingApp.notes}</p>
                          )}
                        </div>

                        <div className="text-right space-y-1 shrink-0">
                          <span className="font-mono text-xs font-bold text-white block">{matchingApp.amount.toLocaleString()} FCFA</span>
                          <span className="text-[10px] text-white/40 block flex items-center gap-1 justify-end">
                            <Clock className="w-3 h-3 text-gold-kene" /> {matchingApp.employee.firstName}
                          </span>
                        </div>
                      </m.div>
                    ) : (
                      /* Empty slot trigger */
                      <button
                        onClick={() => {
                          setAppointmentTime(hour)
                          setShowAddModal(true)
                        }}
                        className="w-full h-12 border border-dashed border-white/5 hover:border-gold-kene/20 hover:bg-white/[0.01] rounded-2xl transition flex items-center justify-center text-white/20 hover:text-gold-kene/60 text-xs gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Libre - Cliquer pour planifier
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Appointment Creator Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <m.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1A1410] border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl relative text-white"
            >
              <div className="mb-6">
                <h3 className="font-display font-bold text-lg text-gold-kene">Planifier un Soin</h3>
                <p className="text-xs text-white/40">Saisissez les détails pour réserver le créneau.</p>
              </div>

              <form onSubmit={handleAddAppointment} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/60">Numéro de téléphone du client (facultatif)</label>
                  <Input
                    type="tel"
                    placeholder="+225 07 12 34 56"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="bg-[#241C16] border-white/10 text-white rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/60">Date sélectionnée</label>
                    <Input
                      type="text"
                      value={selectedDate.toLocaleDateString('fr-FR')}
                      disabled
                      className="bg-[#241C16]/50 border-white/10 text-white/60 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/60">Heure de début</label>
                    <select
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full bg-[#241C16] border border-white/10 rounded-xl text-white text-sm px-3 py-2 outline-none focus:border-gold-kene transition"
                    >
                      {hoursList.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/60">Notes / Précisions</label>
                  <textarea
                    placeholder="Détails du soin ou demandes spéciales..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full h-24 bg-[#241C16] border border-white/10 rounded-xl text-white text-sm p-3 outline-none focus:border-gold-kene transition font-sans resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <Button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-transparent hover:bg-white/5 border border-white/10 text-white py-2.5 rounded-xl cursor-pointer"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410] font-semibold py-2.5 rounded-xl cursor-pointer"
                  >
                    {submitting ? 'Enregistrement...' : 'Confirmer'}
                  </Button>
                </div>
              </form>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
