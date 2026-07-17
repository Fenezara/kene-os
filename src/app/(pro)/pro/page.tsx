'use client'

import React, { useState, useEffect } from 'react'
import { motion as m, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, Users, Percent, DollarSign, RefreshCw, 
  BrainCircuit, AlertTriangle, CheckCircle, Lightbulb, ShieldAlert
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Insight {
  type: 'success' | 'warning' | 'info'
  title: string
  message: string
}

interface CommissionItem {
  name: string
  position: string
  totalCommissions: number
  count: number
}

interface ClientNotification {
  id: string
  to: string
  channel: string
  message: string
  createdAt: string
}

interface Metrics {
  salesTotal: number
  salesCount: number
  clientsCount: number
  cashTotal: number
  momoTotal: number
  soinsHT: number
  produitsHT: number
  vatAmount: number
  payrollCost: number
  insights: Insight[]
  commissionsList?: CommissionItem[]
}

export default function ProDashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [notifications, setNotifications] = useState<ClientNotification[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMetrics = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/pro/metrics')
      const json = await res.json()
      if (json.success) {
        setMetrics(json)
      }

      // Fetch client notifications feed
      const nRes = await fetch('/api/pro/notifications')
      const nJson = await nRes.json()
      if (nJson.success) {
        setNotifications(nJson.notifications)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [])

  if (loading || !metrics) {
    return (
      <div className="text-center py-20 text-white/40 text-xs flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-4 border-gold-kene border-t-transparent rounded-full animate-spin"></div>
        <span>Consolidation des données financières de l'institut...</span>
      </div>
    )
  }

  const averageBasket = metrics.salesCount > 0 ? Math.round(metrics.salesTotal / metrics.salesCount) : 0

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-white">
      {/* Header */}
      <div className="bg-[#1A1410] border border-white/5 p-6 rounded-3xl shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-display text-gold-kene">Tableau de Bord Exécutif</h1>
          <p className="text-xs text-white/50 font-sans mt-1">
            Indicateurs financiers consolidés en temps réel de votre institut de soins sur mesure.
          </p>
        </div>
        <Button
          onClick={fetchMetrics}
          className="bg-[#241C16]/50 hover:bg-[#241C16]/80 border border-white/10 text-white rounded-xl text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Actualiser
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Chiffre d'Affaires */}
        <div className="bg-[#1A1410] border border-white/5 rounded-3xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-center text-white/40">
            <span className="text-[10px] uppercase font-bold tracking-wider font-sans">Chiffre d'Affaires</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-xl font-bold block font-mono text-emerald-400">
            {metrics.salesTotal.toLocaleString()} F
          </span>
          <span className="text-[9px] text-white/30 block font-sans">
            Espèces : {metrics.cashTotal.toLocaleString()} F | MoMo : {metrics.momoTotal.toLocaleString()} F
          </span>
        </div>

        {/* Panier Moyen */}
        <div className="bg-[#1A1410] border border-white/5 rounded-3xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-center text-white/40">
            <span className="text-[10px] uppercase font-bold tracking-wider font-sans">Panier Moyen</span>
            <Percent className="w-4 h-4 text-gold-kene" />
          </div>
          <span className="text-xl font-bold block font-mono text-white">
            {averageBasket.toLocaleString()} F
          </span>
          <span className="text-[9px] text-white/30 block font-sans">
            Sur {metrics.salesCount} encaissement{metrics.salesCount > 1 ? 's' : ''}
          </span>
        </div>

        {/* TVA Collectée */}
        <div className="bg-[#1A1410] border border-white/5 rounded-3xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-center text-white/40">
            <span className="text-[10px] uppercase font-bold tracking-wider font-sans">TVA Facturée (18%)</span>
            <Percent className="w-4 h-4 text-orange-400" />
          </div>
          <span className="text-xl font-bold block font-mono text-orange-400">
            {metrics.vatAmount.toLocaleString()} F
          </span>
          <span className="text-[9px] text-white/30 block font-sans">
            Assiette HT : {(metrics.soinsHT + metrics.produitsHT).toLocaleString()} F
          </span>
        </div>

        {/* Coût de Paie */}
        <div className="bg-[#1A1410] border border-white/5 rounded-3xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-center text-white/40">
            <span className="text-[10px] uppercase font-bold tracking-wider font-sans">Charges de Personnel</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-xl font-bold block font-mono text-indigo-400">
            {metrics.payrollCost.toLocaleString()} F
          </span>
          <span className="text-[9px] text-white/30 block font-sans">
            Salaires bruts & part CNPS patronale
          </span>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Payment Channels and Client Statistics */}
        <div className="md:col-span-1 space-y-6">
          {/* Revenue distribution */}
          <div className="bg-[#1A1410] border border-white/5 p-6 rounded-3xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gold-kene font-display">Canaux d'encaissement</h3>
            
            <div className="space-y-3">
              {/* Mobile Money */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-sans text-white/70">
                  <span>Mobile Money (Wave/Orange)</span>
                  <span className="font-mono font-semibold">{metrics.momoTotal.toLocaleString()} F</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${metrics.salesTotal > 0 ? (metrics.momoTotal / metrics.salesTotal) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Cash */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-sans text-white/70">
                  <span>Espèces (Caisse principale)</span>
                  <span className="font-mono font-semibold">{metrics.cashTotal.toLocaleString()} F</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 rounded-full" 
                    style={{ width: `${metrics.salesTotal > 0 ? (metrics.cashTotal / metrics.salesTotal) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* CRM Summary card */}
          <div className="bg-[#1A1410] border border-white/5 p-6 rounded-3xl flex justify-between items-center">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gold-kene font-display">Fidélité CRM</h3>
              <p className="text-xs text-white/40 mt-1 font-sans">Membres enregistrées</p>
              <span className="text-2xl font-bold block mt-1 font-display">{metrics.clientsCount} clientes</span>
            </div>
            <Users className="w-8 h-8 text-gold-kene/20" />
          </div>

          {/* Commissions Card */}
          <div className="bg-[#1A1410] border border-white/5 p-6 rounded-3xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gold-kene font-display">Commissions praticiennes</h3>
            
            {(!metrics.commissionsList || metrics.commissionsList.length === 0) ? (
              <p className="text-[10px] text-white/40 italic font-sans">Aucune commission enregistrée sur cette période.</p>
            ) : (
              <div className="space-y-3.5">
                {metrics.commissionsList.map((c, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-white block font-sans">{c.name}</span>
                      <span className="text-[9px] text-white/40 block font-sans">{c.position} ({c.count} soin{c.count > 1 ? 's' : ''})</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400">{c.totalCommissions.toLocaleString()} F</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Insight Engine Section (Mama Kènè AI Insights) */}
        <div className="md:col-span-2 bg-[#1A1410] border border-white/5 p-6 rounded-3xl space-y-4 relative overflow-hidden shadow-2xl">
          {/* Subtle gold glow behind header */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-kene/5 blur-3xl rounded-full"></div>

          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <div className="w-8 h-8 rounded-xl bg-gold-kene/10 flex items-center justify-center text-gold-kene">
              <BrainCircuit className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gold-kene font-display">Recommandations IA — Mama Kènè Insights</h3>
              <p className="text-[10px] text-white/40 font-sans">Analyse prédictive des stocks, des rendez-vous et des flux financiers.</p>
            </div>
          </div>

          {metrics.insights.length === 0 ? (
            <p className="text-xs text-white/40 italic py-10 text-center">
              L'IA consolide actuellement vos données de ventes pour générer des recommandations personnalisées.
            </p>
          ) : (
            <div className="space-y-3">
              {metrics.insights.map((insight, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-2xl flex items-start gap-3 border ${
                    insight.type === 'warning' 
                      ? 'bg-red-950/20 border-red-500/10 text-white/90'
                      : insight.type === 'success'
                        ? 'bg-emerald-950/20 border-emerald-500/10 text-white/90'
                        : 'bg-[#241C16]/40 border-white/5 text-white/90'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {insight.type === 'warning' ? (
                      <ShieldAlert className="w-4.5 h-4.5 text-red-400" />
                    ) : insight.type === 'success' ? (
                      <CheckCircle className="w-4.5 h-4.5 text-emerald-400" />
                    ) : (
                      <Lightbulb className="w-4.5 h-4.5 text-gold-kene" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-white font-display">{insight.title}</h4>
                    <p className="text-[11px] text-white/50 leading-relaxed font-sans">{insight.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Centre de Communications Client */}
        <div className="bg-[#1A1410] border border-white/5 p-6 rounded-3xl space-y-4 relative overflow-hidden shadow-2xl">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gold-kene font-display">Centre de Communications Client</h3>
              <p className="text-[10px] text-white/40 font-sans">Journaux en temps réel des SMS et WhatsApp automatiques.</p>
            </div>
            <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full animate-pulse">
              Passerelle Active
            </span>
          </div>

          {notifications.length === 0 ? (
            <p className="text-xs text-white/40 italic py-10 text-center font-sans">
              Aucun message envoyé récemment. Créez ou annulez un rendez-vous pour voir le flux.
            </p>
          ) : (
            <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1 scrollbar-none">
              {notifications.map((n) => (
                <div key={n.id} className="bg-[#241C16]/30 border border-white/5 p-4 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        n.channel === 'WhatsApp' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {n.channel === 'WhatsApp' ? '💬 WhatsApp' : '📱 SMS'}
                      </span>
                      <span className="text-[10px] font-mono text-white/60">Dest. : {n.to}</span>
                    </div>
                    <span className="text-[9px] text-white/30 font-mono">
                      {new Date(n.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed font-sans font-medium">{n.message}</p>
                  <div className="flex justify-end">
                    <span className="text-[8px] text-emerald-400 font-semibold uppercase tracking-wider">✔ Envoyé</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
