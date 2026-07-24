'use client'

import React, { useState, useEffect } from 'react'
import { motion as m, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, Calculator, Landmark, ShieldCheck, ChevronDown, 
  ChevronUp, Calendar, Download, RefreshCw, FileText 
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AccountingLine {
  accountNumber: string
  accountName: string
  debit: number
  credit: number
}

interface AccountingEntry {
  id: string
  entryNumber: string
  journal: 'ventes' | 'achats' | 'banque' | 'caisse' | 'od'
  entryDate: string
  reference: string | null
  description: string
  lines: string
  status: string
}

export default function ComptaPage() {
  const [entries, setEntries] = useState<AccountingEntry[]>([])
  const [payslips, setPayslips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'journal' | 'grandLivre' | 'tva' | 'bilan' | 'compteResultat'>('journal')
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null)
  
  const [selectedAccount, setSelectedAccount] = useState<string>('all')
  const [accountSearch, setAccountSearch] = useState<string>('')

  const fetchEntries = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/accounting')
      const json = await res.json()
      if (json.success) {
        setEntries(json.entries)
      }

      const pRes = await fetch('/api/rh/payslips?month=7&year=2026')
      const pJson = await pRes.json()
      if (pJson.success) {
        setPayslips(pJson.payrolls)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEntries()
  }, [])

  const parseLines = (linesStr: string): AccountingLine[] => {
    try {
      return JSON.parse(linesStr)
    } catch (e) {
      return []
    }
  }

  const totalDebit = entries.reduce((acc, entry) => {
    const lines = parseLines(entry.lines)
    return acc + lines.reduce((lAcc, line) => lAcc + line.debit, 0)
  }, 0)

  const totalCredit = entries.reduce((acc, entry) => {
    const lines = parseLines(entry.lines)
    return acc + lines.reduce((lAcc, line) => lAcc + line.credit, 0)
  }, 0)

  const availableAccounts = Array.from(
    new Set(
      entries.flatMap((entry) => 
        parseLines(entry.lines).map((l) => l.accountNumber)
      )
    )
  ).sort()

  const getAccountLabel = (accNum: string) => {
    switch (accNum) {
      case '5711': return 'Caisse Principale'
      case '5212': return 'Banque Mobile Money'
      case '706': return 'Prestations de Services (Soins)'
      case '701': return 'Ventes de Produits Cosmétiques'
      case '4431': return 'État, TVA Facturée sur Ventes'
      default: return 'Autre Compte'
    }
  }

  const grandLivreLines = entries.flatMap((entry) => {
    const lines = parseLines(entry.lines)
    return lines
      .filter((line) => {
        const matchesSelect = selectedAccount === 'all' || line.accountNumber === selectedAccount;
        const matchesSearch = accountSearch === '' || line.accountNumber.includes(accountSearch);
        return matchesSelect && matchesSearch;
      })
      .map((line) => ({
        ...line,
        entryNumber: entry.entryNumber,
        entryDate: entry.entryDate,
        reference: entry.reference,
        description: entry.description,
      }))
  })

  const handleExportCSV = () => {
    if (grandLivreLines.length === 0) return;
    const header = ['Date', 'Ecriture', 'Compte', 'Libelle', 'Reference', 'Debit', 'Credit'].join(',');
    const csvLines = grandLivreLines.map(l => 
      [
        new Date(l.entryDate).toLocaleDateString(),
        l.entryNumber,
        l.accountNumber,
        `"${l.description}"`,
        `"${l.reference || ''}"`,
        l.debit,
        l.credit
      ].join(',')
    );
    const csvContent = [header, ...csvLines].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Grand_Livre_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tvaSummary = entries.reduce((summary, entry) => {
    const lines = parseLines(entry.lines)
    const vatLine = lines.find((l) => l.accountNumber === '4431')
    const soinLine = lines.find((l) => l.accountNumber === '706')
    const prodLine = lines.find((l) => l.accountNumber === '701')
    const debitLine = lines.find((l) => l.accountNumber === '5711' || l.accountNumber === '5212')

    if (vatLine) summary.vatCollected += vatLine.credit
    if (soinLine) summary.soinsHT += soinLine.credit
    if (prodLine) summary.produitsHT += prodLine.credit
    if (debitLine) summary.totalTTC += debitLine.debit

    return summary
  }, { soinsHT: 0, produitsHT: 0, vatCollected: 0, totalTTC: 0 })

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-white">
      {/* Header bar */}
      <div className="bg-[#1A1410] border border-white/5 p-6 rounded-3xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display text-gold-kene">Comptabilité SYSCOHADA</h1>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Conforme UEMOA
            </span>
          </div>
          <p className="text-xs text-white/50 font-sans mt-1">
            Visualisez les écritures de ventes générées automatiquement en partie double.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <a href="/compta/export">
            <Button
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              Liasse Fiscale SYSCOHADA
            </Button>
          </a>

          <Button
            onClick={fetchEntries}
            className="bg-[#241C16]/50 hover:bg-[#241C16]/80 border border-white/10 text-white rounded-xl text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          
          <Button
            onClick={() => window.open('/api/accounting/export?year=2026', '_blank')}
            className="bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410] font-semibold rounded-xl text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Exporter FEC
          </Button>
        </div>
      </div>

      {/* Tabs selector */}
      <div className="flex border-b border-white/5 gap-4 overflow-x-auto no-scrollbar shrink-0 pb-1">
        <button
          onClick={() => setActiveTab('journal')}
          className={`pb-3 text-sm font-semibold tracking-wide border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'journal' ? 'border-gold-kene text-gold-kene' : 'border-transparent text-white/40 hover:text-white/70'
          }`}
        >
          Journal Général
        </button>
        <button
          onClick={() => setActiveTab('grandLivre')}
          className={`pb-3 text-sm font-semibold tracking-wide border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'grandLivre' ? 'border-gold-kene text-gold-kene' : 'border-transparent text-white/40 hover:text-white/70'
          }`}
        >
          Grand Livre
        </button>
        <button
          onClick={() => setActiveTab('tva')}
          className={`pb-3 text-sm font-semibold tracking-wide border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'tva' ? 'border-gold-kene text-gold-kene' : 'border-transparent text-white/40 hover:text-white/70'
          }`}
        >
          Déclaration de TVA
        </button>
        <button
          onClick={() => setActiveTab('bilan')}
          className={`pb-3 text-sm font-semibold tracking-wide border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'bilan' ? 'border-gold-kene text-gold-kene' : 'border-transparent text-white/40 hover:text-white/70'
          }`}
        >
          Bilan Actif/Passif
        </button>
        <button
          onClick={() => setActiveTab('compteResultat')}
          className={`pb-3 text-sm font-semibold tracking-wide border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'compteResultat' ? 'border-gold-kene text-gold-kene' : 'border-transparent text-white/40 hover:text-white/70'
          }`}
        >
          Compte de Résultat
        </button>
      </div>

      {/* Tab contents */}
      <AnimatePresence mode="wait">
        {activeTab === 'journal' && (
          <m.div
            key="journal"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-[#1A1410] border border-white/5 rounded-2xl p-4">
                <span className="text-[10px] text-white/40 uppercase font-semibold">Total Écritures</span>
                <span className="text-lg font-bold block mt-1 text-white">{entries.length}</span>
              </div>
              <div className="bg-[#1A1410] border border-white/5 rounded-2xl p-4">
                <span className="text-[10px] text-white/40 uppercase font-semibold">Débits Cumulés</span>
                <span className="text-lg font-bold block mt-1 text-emerald-400 font-mono">{totalDebit.toLocaleString()} FCFA</span>
              </div>
              <div className="bg-[#1A1410] border border-white/5 rounded-2xl p-4 col-span-2 md:col-span-1">
                <span className="text-[10px] text-white/40 uppercase font-semibold">Crédits Cumulés</span>
                <span className="text-lg font-bold block mt-1 text-emerald-400 font-mono">{totalCredit.toLocaleString()} FCFA</span>
              </div>
            </div>

            <div className="bg-[#1A1410] border border-white/5 rounded-3xl overflow-hidden">
              <div className="p-5 border-b border-white/5">
                <h3 className="font-display font-semibold text-sm uppercase text-gold-kene tracking-wider">Journal des ventes & caisse</h3>
              </div>

              {loading ? (
                <div className="text-center py-16 text-white/40 text-xs">Chargement du journal...</div>
              ) : entries.length === 0 ? (
                <div className="text-center py-16 text-white/30 text-xs italic">
                  Aucune écriture comptable enregistrée. Effectuez un encaissement à la caisse pour l'alimenter.
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {entries.map((entry) => {
                    const isExpanded = expandedEntry === entry.id
                    const lines = parseLines(entry.lines)
                    return (
                      <div key={entry.id} className="p-5 space-y-3 transition hover:bg-white/[0.01]">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-white">{entry.entryNumber}</span>
                              <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                                entry.journal === 'caisse' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'
                              }`}>
                                Journal {entry.journal}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-white/80">{entry.description}</p>
                            <span className="text-[10px] text-white/40 font-mono block">Référence : {entry.reference || 'Aucune'}</span>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right space-y-0.5">
                              <span className="text-[10px] text-white/30 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-gold-kene" /> {new Date(entry.entryDate).toLocaleDateString()}
                              </span>
                              <span className="font-mono text-xs font-bold text-white block">
                                {lines.reduce((s, l) => s + l.debit, 0).toLocaleString()} FCFA
                              </span>
                            </div>

                            <button
                              onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                              className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition cursor-pointer"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <m.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden border-t border-white/5 pt-3"
                            >
                              <table className="w-full text-left border-collapse text-[11px] font-sans">
                                <thead>
                                  <tr className="text-white/40 uppercase text-[9px] tracking-wider border-b border-white/5">
                                    <th className="py-2">Compte</th>
                                    <th className="py-2">Libellé Compte</th>
                                    <th className="py-2 text-right">Débit</th>
                                    <th className="py-2 text-right">Crédit</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                  {lines.map((line, idx) => (
                                    <tr key={idx} className="hover:bg-white/[0.01]">
                                      <td className="py-2 font-mono font-bold text-gold-kene">{line.accountNumber}</td>
                                      <td className="py-2 text-white/70">{line.accountName}</td>
                                      <td className="py-2 text-right font-mono text-white">{line.debit > 0 ? line.debit.toLocaleString() : '-'}</td>
                                      <td className="py-2 text-right font-mono text-white">{line.credit > 0 ? line.credit.toLocaleString() : '-'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </m.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </m.div>
        )}

        {activeTab === 'grandLivre' && (
          <m.div
            key="grandLivre"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="bg-[#1A1410] border border-white/5 p-5 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-display font-semibold text-sm uppercase text-gold-kene tracking-wider">Sélection Compte</h3>
                <p className="text-[10px] text-white/40 mt-0.5">Filtrez le grand livre par compte du plan SYSCOHADA.</p>
              </div>

              <div className="flex gap-3 flex-wrap w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Recherche rapide (ex: 5711, 706)"
                  value={accountSearch}
                  onChange={(e) => setAccountSearch(e.target.value)}
                  className="bg-[#241C16] border border-white/10 text-white text-xs rounded-xl px-4 py-2 outline-none focus:border-gold-kene transition w-full md:w-48 placeholder:text-white/30"
                />
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="bg-[#241C16] border border-white/10 text-white text-xs rounded-xl px-4 py-2 outline-none focus:border-gold-kene transition w-full md:w-64 cursor-pointer"
                >
                  <option value="all">Tous les comptes</option>
                  {availableAccounts.map((acc) => (
                    <option key={acc} value={acc}>
                      {acc} - {getAccountLabel(acc)}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={handleExportCSV}
                  className="bg-[#241C16]/50 hover:bg-[#241C16] border border-white/10 text-white rounded-xl text-xs py-2 px-4 flex items-center gap-2 cursor-pointer w-full md:w-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  Exporter CSV
                </Button>
              </div>
            </div>

            <div className="bg-[#1A1410] border border-white/5 rounded-3xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="bg-[#241C16]/50 text-white/40 uppercase text-[10px] tracking-wider border-b border-white/5">
                    <th className="p-4">Date</th>
                    <th className="p-4">Écriture</th>
                    <th className="p-4">Compte</th>
                    <th className="p-4">Libellé</th>
                    <th className="p-4 text-right">Débit</th>
                    <th className="p-4 text-right">Crédit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/80">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16 text-white/40 text-xs">Chargement...</td>
                    </tr>
                  ) : grandLivreLines.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16 text-white/30 text-xs italic">Aucune ligne trouvée.</td>
                    </tr>
                  ) : (
                    grandLivreLines.map((line, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.01]">
                        <td className="p-4 font-mono text-[10px] text-white/50">{new Date(line.entryDate).toLocaleDateString()}</td>
                        <td className="p-4 font-mono font-bold text-white">{line.entryNumber}</td>
                        <td className="p-4 font-mono font-bold text-gold-kene">{line.accountNumber}</td>
                        <td className="p-4">
                          <span className="block font-semibold text-white/90">{line.description}</span>
                          <span className="text-[10px] text-white/40 font-mono">Réf: {line.reference || '-'}</span>
                        </td>
                        <td className="p-4 text-right font-mono text-white font-bold">{line.debit > 0 ? line.debit.toLocaleString() + ' FCFA' : '-'}</td>
                        <td className="p-4 text-right font-mono text-white font-bold">{line.credit > 0 ? line.credit.toLocaleString() + ' FCFA' : '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </m.div>
        )}

        {activeTab === 'tva' && (
          <m.div
            key="tva"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#1A1410] border border-white/5 rounded-3xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="font-display font-semibold text-xs uppercase text-gold-kene tracking-wider">Chiffre d'Affaires HT</span>
                  <Landmark className="w-5 h-5 text-gold-kene" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="text-white/40">Prestations de Soins (706)</span>
                    <span className="font-mono text-white font-semibold">{tvaSummary.soinsHT.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-xs font-sans">
                    <span className="text-white/40">Ventes Cosmétiques (701)</span>
                    <span className="font-mono text-white font-semibold">{tvaSummary.produitsHT.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t border-white/5 pt-2 mt-2">
                    <span>Total Assiette HT</span>
                    <span className="font-mono text-white">{(tvaSummary.soinsHT + tvaSummary.produitsHT).toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#1A1410] border border-white/5 rounded-3xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="font-display font-semibold text-xs uppercase text-orange-400 tracking-wider">TVA Facturée (18%)</span>
                  <Calculator className="w-5 h-5 text-orange-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="text-white/40">Assiette Soumise</span>
                    <span className="font-mono text-white font-semibold">{(tvaSummary.soinsHT + tvaSummary.produitsHT).toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-xs font-sans">
                    <span className="text-white/40">Taux Standard UEMOA</span>
                    <span className="text-white font-semibold">18%</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t border-white/5 pt-2 mt-2">
                    <span className="text-orange-400">TVA Collectée (4431)</span>
                    <span className="font-mono text-orange-400">{tvaSummary.vatCollected.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#1A1410] border border-white/5 rounded-3xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="font-display font-semibold text-xs uppercase text-emerald-400 tracking-wider">Chiffre d'Affaires TTC</span>
                  <FileText className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="text-white/40">Total HT</span>
                    <span className="font-mono text-white font-semibold">{(tvaSummary.soinsHT + tvaSummary.produitsHT).toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-xs font-sans">
                    <span className="text-white/40">TVA Facturée</span>
                    <span className="font-mono text-white font-semibold">{tvaSummary.vatCollected.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t border-white/5 pt-2 mt-2">
                    <span className="text-emerald-400">Total TTC Encaissé</span>
                    <span className="font-mono text-emerald-400">{tvaSummary.totalTTC.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#241C16] border border-white/5 rounded-3xl p-5 flex items-start gap-4">
              <BookOpen className="w-6 h-6 text-gold-kene shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white">Régime de Déclaration Simplifié</h4>
                <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                  Ces états comptables sont calculés conformément aux dispositions fiscales de l'article 39 du code de la TVA en vigueur au sein de l'espace harmonisé **OHADA**. La TVA collectée sur les prestations de soins et la revente de cosmétiques est déclarable mensuellement à un taux fixe de 18% pour les entreprises au régime du bénéfice réel.
                </p>
              </div>
            </div>
          </m.div>
        )}

        {/* BILAN TAB */}
        {activeTab === 'bilan' && (() => {
          const caisseDebit = entries.reduce((sum, entry) => {
            const lines = parseLines(entry.lines)
            return sum + lines.filter(l => l.accountNumber === '5711').reduce((acc, l) => acc + l.debit - l.credit, 0)
          }, 0)

          const banqueDebit = entries.reduce((sum, entry) => {
            const lines = parseLines(entry.lines)
            return sum + lines.filter(l => l.accountNumber === '5212').reduce((acc, l) => acc + l.debit - l.credit, 0)
          }, 0)

          const tvaCollectee = entries.reduce((sum, entry) => {
            const lines = parseLines(entry.lines)
            return sum + lines.filter(l => l.accountNumber === '4431').reduce((acc, l) => acc + l.credit - l.debit, 0)
          }, 0)

          const prestationsSoins = entries.reduce((sum, entry) => {
            const lines = parseLines(entry.lines)
            return sum + lines.filter(l => l.accountNumber === '706').reduce((acc, l) => acc + l.credit - l.debit, 0)
          }, 0)

          const ventesProduits = entries.reduce((sum, entry) => {
            const lines = parseLines(entry.lines)
            return sum + lines.filter(l => l.accountNumber === '701').reduce((acc, l) => acc + l.credit - l.debit, 0)
          }, 0)

          const salairesBruts = payslips.reduce((sum, ps) => sum + ps.grossSalary, 0)
          const chargesSocialesPatronales = payslips.reduce((sum, ps) => sum + ps.cnpsEmployer, 0)
          const organismesSociauxDette = payslips.reduce((sum, ps) => sum + ps.cnpsEmployee + ps.cnpsEmployer, 0)
          const etatIGRDette = payslips.reduce((sum, ps) => sum + ps.igrTax, 0)
          const personnelNetDette = payslips.reduce((sum, ps) => sum + ps.netPay, 0)

          const totalRevenues = prestationsSoins + ventesProduits
          const totalExpenses = salairesBruts + chargesSocialesPatronales
          const netResult = totalRevenues - totalExpenses

          const totalActif = caisseDebit + banqueDebit
          const totalPassif = netResult + organismesSociauxDette + etatIGRDette + tvaCollectee + personnelNetDette

          return (
            <m.div
              key="bilan"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1A1410] border border-white/5 rounded-3xl p-6 space-y-4">
                  <h3 className="font-display font-bold text-sm uppercase text-gold-kene tracking-wider border-b border-white/5 pb-2">ACTIF (Emplois)</h3>
                  
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/70">ACTIF CIRCULANT & TRÉSORERIE</span>
                      <span className="text-white/40">Code OHADA</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-white/70 font-sans">Trésorerie Caisse (espèces)</span>
                      <div className="flex gap-4">
                        <span className="text-white/30 font-mono">5711</span>
                        <span className="font-mono font-bold text-white">{caisseDebit.toLocaleString()} F</span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-white/70 font-sans">Trésorerie Banque (Mobile Money)</span>
                      <div className="flex gap-4">
                        <span className="text-white/30 font-mono">5212</span>
                        <span className="font-mono font-bold text-white">{banqueDebit.toLocaleString()} F</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-3 flex justify-between items-center text-sm font-bold text-emerald-400">
                    <span>TOTAL ACTIF</span>
                    <span className="font-mono">{totalActif.toLocaleString()} FCFA</span>
                  </div>
                </div>

                <div className="bg-[#1A1410] border border-white/5 rounded-3xl p-6 space-y-4">
                  <h3 className="font-display font-bold text-sm uppercase text-gold-kene tracking-wider border-b border-white/5 pb-2">PASSIF & CAPITAUX PROPRES</h3>
                  
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/70">CAPITAUX PROPRES & DETTES</span>
                      <span className="text-white/40">Code OHADA</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-white/75 font-bold font-sans">Résultat Net de l'Exercice (Bénéfice)</span>
                      <div className="flex gap-4">
                        <span className="text-white/30 font-mono">13</span>
                        <span className={`font-mono font-bold ${netResult >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {netResult.toLocaleString()} F
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-white/70 font-sans">Dettes Organismes Sociaux (CNPS / IPRES / IPM)</span>
                      <div className="flex gap-4">
                        <span className="text-white/30 font-mono">43</span>
                        <span className="font-mono font-bold text-white">{organismesSociauxDette.toLocaleString()} F</span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-white/70 font-sans">Dettes Fiscales (Retenues IGR / IR)</span>
                      <div className="flex gap-4">
                        <span className="text-white/30 font-mono">442</span>
                        <span className="font-mono font-bold text-white">{etatIGRDette.toLocaleString()} F</span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-white/70 font-sans">Dettes de TVA Collectée</span>
                      <div className="flex gap-4">
                        <span className="text-white/30 font-mono">443</span>
                        <span className="font-mono font-bold text-white">{tvaCollectee.toLocaleString()} F</span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-white/70 font-sans">Dettes Salariales (Rémunérations dues)</span>
                      <div className="flex gap-4">
                        <span className="text-white/30 font-mono">422</span>
                        <span className="font-mono font-bold text-white">{personnelNetDette.toLocaleString()} F</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-3 flex justify-between items-center text-sm font-bold text-emerald-400">
                    <span>TOTAL PASSIF & CAPITAUX</span>
                    <span className="font-mono">{totalPassif.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#241C16] border border-white/5 rounded-2xl p-4 flex justify-between items-center text-xs font-sans">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-white/70 font-semibold">Équilibre Comptable Vérifié (SYSCOHADA)</span>
                </div>
                <span className="font-mono text-emerald-400 font-bold">Actif = Passif ({totalActif.toLocaleString()} F)</span>
              </div>
            </m.div>
          )
        })()}

        {/* COMPTE DE RESULTAT TAB */}
        {activeTab === 'compteResultat' && (() => {
          const prestationsSoins = entries.reduce((sum, entry) => {
            const lines = parseLines(entry.lines)
            return sum + lines.filter(l => l.accountNumber === '706').reduce((acc, l) => acc + l.credit - l.debit, 0)
          }, 0)

          const ventesProduits = entries.reduce((sum, entry) => {
            const lines = parseLines(entry.lines)
            return sum + lines.filter(l => l.accountNumber === '701').reduce((acc, l) => acc + l.credit - l.debit, 0)
          }, 0)

          const salairesBruts = payslips.reduce((sum, ps) => sum + ps.grossSalary, 0)
          const chargesSocialesPatronales = payslips.reduce((sum, ps) => sum + ps.cnpsEmployer, 0)

          const totalRevenues = prestationsSoins + ventesProduits
          const totalExpenses = salairesBruts + chargesSocialesPatronales
          const netResult = totalRevenues - totalExpenses

          return (
            <m.div
              key="compteResultat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-[#1A1410] border border-white/5 rounded-3xl p-6 space-y-6">
                <h3 className="font-display font-bold text-sm uppercase text-gold-kene tracking-wider border-b border-white/5 pb-2">
                  Compte de Résultat Consolidé (SYSCOHADA)
                </h3>

                <div className="space-y-4 text-xs font-sans">
                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-white/5 pb-1 text-gold-kene font-semibold uppercase tracking-wider text-[10px]">
                      <span>I. PRODUITS D'EXPLOITATION (Classe 7)</span>
                      <span>Montant HT</span>
                    </div>
                    <div className="flex justify-between pl-3 text-white/70">
                      <span>Ventes de Prestations de Soins (Compte 706)</span>
                      <span className="font-mono">{prestationsSoins.toLocaleString()} F</span>
                    </div>
                    <div className="flex justify-between pl-3 text-white/70">
                      <span>Ventes de Cosmétiques Sur Mesure (Compte 701)</span>
                      <span className="font-mono">{ventesProduits.toLocaleString()} F</span>
                    </div>
                    <div className="flex justify-between border-t border-white/5 pt-1 font-bold text-white pl-3 text-right">
                      <span>TOTAL PRODUITS D'EXPLOITATION</span>
                      <span className="font-mono">{totalRevenues.toLocaleString()} F</span>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between border-b border-white/5 pb-1 text-gold-kene font-semibold uppercase tracking-wider text-[10px]">
                      <span>II. CHARGES D'EXPLOITATION (Classe 6)</span>
                      <span>Montant</span>
                    </div>
                    <div className="flex justify-between pl-3 text-white/70">
                      <span>Charges de Personnel - Salaires (Compte 641)</span>
                      <span className="font-mono">{salairesBruts.toLocaleString()} F</span>
                    </div>
                    <div className="flex justify-between pl-3 text-white/70">
                      <span>Charges Sociales Patronales (Compte 644)</span>
                      <span className="font-mono">{chargesSocialesPatronales.toLocaleString()} F</span>
                    </div>
                    <div className="flex justify-between border-t border-white/5 pt-1 font-bold text-white pl-3 text-right">
                      <span>TOTAL CHARGES D'EXPLOITATION</span>
                      <span className="font-mono">{totalExpenses.toLocaleString()} F</span>
                    </div>
                  </div>

                  <div className="border-t-2 border-white/10 pt-4 flex justify-between items-center text-sm font-bold">
                    <span className="text-gold-kene">RÉSULTAT NET COMPTABLE (Bénéfice)</span>
                    <span className={`font-mono text-base ${netResult >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {netResult.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              </div>
            </m.div>
          )
        })()}
      </AnimatePresence>
    </div>
  )
}
