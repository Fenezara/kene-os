'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, User, Phone, Sparkles, AlertTriangle, ShieldCheck, 
  ChevronRight, ClipboardList, Info, Heart, ArrowRight 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Diagnosis {
  id: string
  scoreGlobal: number
  photos: string // Stringified array
  subScores: string // Stringified JSON
  indicators: string // Stringified JSON
  recommendations: string // Stringified JSON
  createdAt: string
}

interface Client {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string | null
  fitzpatrickType: string
  skinType: string
  allergies: string // Stringified JSON array
  treatments: string // Stringified JSON array
  notes: string | null
  rfm?: {
    recencyDays: number
    frequency: number
    monetary: number
    segment: string
  }
  user: {
    diagnoses: Diagnosis[]
  } | null
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [search, setSearch] = useState('')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)

  const getSegmentStyle = (segment: string) => {
    switch (segment) {
      case 'Champion':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
      case 'Fidèle':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
      case 'Potentiel':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
      case 'Nouveau':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
      case 'À risque':
        return 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
      case 'Perdu':
        return 'bg-red-500/10 text-red-400 border border-red-500/20'
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
    }
  }

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch('/api/clients')
        const json = await res.json()
        if (json.success) {
          setClients(json.clients)
          if (json.clients.length > 0) {
            setSelectedClient(json.clients[0]) // Select first client by default
          }
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchClients()
  }, [])

  const filteredClients = clients.filter((c) => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase()
    return fullName.includes(search.toLowerCase()) || c.phone.includes(search)
  })

  // Parse JSON fields safely
  const parseJsonField = (field: string, fallback: any = []) => {
    try {
      return JSON.parse(field)
    } catch (e) {
      return fallback
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-white">
      {/* Header bar */}
      <div className="bg-[#1A1410] border border-white/5 p-6 rounded-3xl shadow-lg">
        <h1 className="text-2xl font-bold font-display text-gold-kene">Clients CRM & Diagnostics Partagés</h1>
        <p className="text-xs text-white/50 font-sans mt-1">
          Consultez les profils de peau, les allergies et les bilans VLM partagés par vos clientes.
        </p>
      </div>

      {/* Main split dashboard layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left client list (2 columns) */}
        <div className="lg:col-span-2 bg-[#1A1410] border border-white/5 p-5 rounded-3xl flex flex-col space-y-4">
          <div className="relative">
            <span className="absolute left-3 top-3 text-white/40">
              <Search className="w-4 h-4" />
            </span>
            <Input
              type="text"
              placeholder="Rechercher par nom ou téléphone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-[#241C16] border-white/10 text-white placeholder-white/20 rounded-xl"
            />
          </div>

          <div className="space-y-1.5 flex-1 max-h-[60vh] overflow-y-auto pr-1 scrollbar-none">
            {loading ? (
              <div className="text-center py-6 text-white/40 text-xs">Chargement des clients...</div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-6 text-white/40 text-xs">Aucun client trouvé.</div>
            ) : (
              filteredClients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className={`w-full p-4 rounded-2xl text-left border flex justify-between items-center transition cursor-pointer ${
                    selectedClient?.id === client.id
                      ? 'bg-gradient-to-r from-gold-kene/10 to-[#1A1410] border-gold-kene/30 text-white'
                      : 'bg-[#241C16]/20 border-white/5 hover:bg-[#241C16]/40 hover:border-white/10'
                  }`}
                >
                  <div>
                    <span className="font-bold text-sm block">{client.firstName} {client.lastName}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-white/40">{client.phone}</span>
                      {client.rfm && (
                        <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded ${getSegmentStyle(client.rfm.segment)}`}>
                          {client.rfm.segment}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition ${selectedClient?.id === client.id ? 'text-gold-kene translate-x-0.5' : 'text-white/20'}`} />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right client profile panel (3 columns) */}
        <div className="lg:col-span-3 bg-[#1A1410] border border-white/5 p-6 rounded-3xl h-fit">
          <AnimatePresence mode="wait">
            {selectedClient ? (
              <motion.div
                key={selectedClient.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Profile Overview */}
                <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gold-kene/10 border border-gold-kene/20 flex items-center justify-center text-gold-kene">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-lg">{selectedClient.firstName} {selectedClient.lastName}</h2>
                    <span className="text-xs text-white/40 flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-gold-kene" /> {selectedClient.phone}
                    </span>
                  </div>
                </div>

                {/* Skin Info & Fitzpatrick */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#241C16]/40 border border-white/5 rounded-2xl p-4">
                    <span className="text-[10px] text-white/40 uppercase font-semibold block">Type de Peau</span>
                    <span className="text-sm font-semibold capitalize mt-1 block text-white">{selectedClient.skinType}</span>
                  </div>
                  <div className="bg-[#241C16]/40 border border-white/5 rounded-2xl p-4">
                    <span className="text-[10px] text-white/40 uppercase font-semibold block">Classification Fitzpatrick</span>
                    <span className="text-sm font-semibold mt-1 block text-gold-kene">Phototype {selectedClient.fitzpatrickType}</span>
                  </div>
                </div>

                {/* RFM Segmentation details */}
                {selectedClient.rfm && (
                  <div className="bg-[#241C16]/20 border border-white/5 p-5 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-white/40 uppercase font-semibold block">Indice de Fidélité B2B</span>
                        <span className="text-xs font-bold text-white font-sans">Segmentation Clientèle (RFM)</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getSegmentStyle(selectedClient.rfm.segment)}`}>
                        {selectedClient.rfm.segment}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-[#1A1410]/50 border border-white/5 rounded-xl p-2.5">
                        <span className="text-[9px] text-white/40 uppercase block">Récence</span>
                        <span className="text-xs font-mono font-bold text-white block mt-0.5">
                          {selectedClient.rfm.recencyDays === 999 ? 'Aucune visite' : `${selectedClient.rfm.recencyDays} j`}
                        </span>
                      </div>
                      <div className="bg-[#1A1410]/50 border border-white/5 rounded-xl p-2.5">
                        <span className="text-[9px] text-white/40 uppercase block">Fréquence</span>
                        <span className="text-xs font-mono font-bold text-white block mt-0.5">
                          {selectedClient.rfm.frequency} visit{selectedClient.rfm.frequency > 1 ? 'es' : 'e'}
                        </span>
                      </div>
                      <div className="bg-[#1A1410]/50 border border-white/5 rounded-xl p-2.5">
                        <span className="text-[9px] text-white/40 uppercase block">Montant</span>
                        <span className="text-xs font-mono font-bold text-emerald-400 block mt-0.5">
                          {selectedClient.rfm.monetary.toLocaleString()} F
                        </span>
                      </div>
                    </div>

                    {/* Marketing recommendation based on segment */}
                    <div className="text-[10px] text-white/60 bg-[#1A1410]/30 border border-white/5 p-3 rounded-xl leading-relaxed font-sans">
                      <span className="font-semibold text-gold-kene block mb-0.5">💡 Recommandation Mama Kènè :</span>
                      {selectedClient.rfm.segment === 'Champion' && "Cliente privilégiée et hautement engagée. Offrez-lui un cadeau exclusif ou une invitation en avant-première pour les nouveaux soins."}
                      {selectedClient.rfm.segment === 'Fidèle' && "Fidélité solide. Maintenez l'engagement avec des points de fidélité ou du cashback ciblé."}
                      {selectedClient.rfm.segment === 'Potentiel' && "Cliente régulière en devenir. Encouragez un prochain achat avec une offre ciblée sur son phototype."}
                      {selectedClient.rfm.segment === 'Nouveau' && "Nouvelle cliente récemment acquise. Assurez un suivi post-soin chaleureux par WhatsApp."}
                      {selectedClient.rfm.segment === 'Prospect' && "Prospect inscrit mais sans premier achat. Proposez-lui un diagnostic de peau gratuit."}
                      {selectedClient.rfm.segment === 'À risque' && "Inactivité constatée depuis plus de 60 jours. Envoyez un rappel SMS automatique avec un code promo de réactivation."}
                      {selectedClient.rfm.segment === 'Perdu' && "Perdue de vue depuis plus de 4 mois. Tentez une campagne de reconquête par WhatsApp."}
                    </div>
                  </div>
                )}

                {/* Allergies & Treatments */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase text-white/40 tracking-wider">Alergie & Contre-indications</h4>
                  {parseJsonField(selectedClient.allergies).length === 0 ? (
                    <div className="text-xs bg-green-950/20 border border-green-500/10 text-green-400 p-3 rounded-xl flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span>Aucune allergie signalée.</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {parseJsonField(selectedClient.allergies).map((all: string, idx: number) => (
                        <span key={idx} className="bg-red-950/40 text-red-400 border border-red-500/20 text-xs px-2.5 py-1 rounded-lg">
                          {all}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Latest VLM Skin Diagnostic History */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase text-white/40 tracking-wider">Dernier Bilan de Peau VLM</h4>
                  {selectedClient.user?.diagnoses && selectedClient.user.diagnoses.length > 0 ? (
                    (() => {
                      const latestDiag = selectedClient.user.diagnoses[0]
                      const subScores = parseJsonField(latestDiag.subScores, {})
                      const recs = parseJsonField(latestDiag.recommendations, { routine: [], ingredients: [] })
                      return (
                        <div className="bg-[#241C16]/40 border border-gold-kene/10 rounded-2xl p-5 space-y-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-gold-kene">
                              <Sparkles className="w-4 h-4" />
                              <span className="text-xs font-bold font-display uppercase tracking-wider">Analyse Clinique Kènè</span>
                            </div>
                            <span className="text-xs font-mono font-bold text-white bg-gold-kene/20 px-2.5 py-1 rounded-lg">
                              Score : {latestDiag.scoreGlobal}%
                            </span>
                          </div>

                          {/* Subscores percentages */}
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="flex justify-between border-b border-white/5 pb-1">
                              <span className="text-white/40">Hydratation</span>
                              <span className="font-semibold text-white">{subScores.hydratation || 0}%</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-1">
                              <span className="text-white/40">Éclat</span>
                              <span className="font-semibold text-white">{subScores.eclat || 0}%</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-1">
                              <span className="text-white/40">Sébum</span>
                              <span className="font-semibold text-white">{subScores.sebum || 0}%</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-1">
                              <span className="text-white/40">Élasticité</span>
                              <span className="font-semibold text-white">{subScores.elasticite || 0}%</span>
                            </div>
                          </div>

                          {/* Botanical Routine suggested */}
                          {recs.routine.length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-white/5">
                              <span className="text-[10px] text-white/40 font-semibold uppercase block">Ingrédients Actifs à privilégier</span>
                              <div className="flex flex-wrap gap-1.5">
                                {recs.ingredients.map((ing: string, i: number) => (
                                  <span key={i} className="bg-baobab/10 text-baobab text-[10px] px-2 py-0.5 rounded-md font-semibold">
                                    {ing}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })()
                  ) : (
                    <div className="text-xs text-white/30 italic py-4 border border-dashed border-white/5 rounded-2xl text-center">
                      Aucun scan diagnostic VLM enregistré pour le moment.
                    </div>
                  )}
                </div>

                {/* Notes section */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-white/40 tracking-wider">Notes & Observations</h4>
                  <p className="text-xs text-white/70 leading-relaxed bg-[#241C16]/20 p-4 border border-white/5 rounded-2xl">
                    {selectedClient.notes || "Aucune note consignée. Praticienne : vous pouvez ajouter des notes post-soin lors de la facturation."}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-20 text-white/30 text-xs">
                Sélectionnez une cliente dans le menu de gauche pour afficher son profil.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
