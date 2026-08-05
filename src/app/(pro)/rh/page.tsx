'use client'

import React, { useState, useEffect } from 'react'
import { motion as m, AnimatePresence } from 'framer-motion'
import { 
  Users, DollarSign, ShieldCheck, Printer, Calendar, 
  Download, Eye, CheckCircle2, ChevronRight, FileText, Gift 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface Employee {
  id: string
  tenantId: string
  firstName: string
  lastName: string
  phone: string
  position: string
  baseSalary: number
  hireDate: string
}

interface PayrollDetail {
  employee: Employee
  isSaved: boolean
  payslipId: string | null
  grossSalary: number
  cnpsEmployee: number
  cnpsEmployer: number
  igrTax: number
  netPay: number
  bonuses: Array<{ name: string; amount: number }>
  deductions: Array<{ name: string; amount: number }>
}

export default function RhPage() {
  const { toast } = useToast()
  const [payrolls, setPayrolls] = useState<PayrollDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState('7')
  const [selectedYear, setSelectedYear] = useState('2026')
  const [country, setCountry] = useState('CI')
  const [showSlipModal, setShowSlipModal] = useState<PayrollDetail | null>(null)
  const [saving, setSaving] = useState(false)

  const fetchPayroll = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/rh/payslips?month=${selectedMonth}&year=${selectedYear}&country=${country}`)
      const json = await res.json()
      if (json.success) {
        setPayrolls(json.payrolls)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayroll()
  }, [selectedMonth, selectedYear, country])

  const handleSavePayslips = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/rh/payslips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payPeriodId: payrolls[0]?.employee.tenantId + '-' + selectedMonth + '-' + selectedYear,
          payslips: payrolls.map((p) => ({
            tenantId: p.employee.tenantId,
            employeeId: p.employee.id,
            grossSalary: p.grossSalary,
            cnpsEmployee: p.cnpsEmployee,
            cnpsEmployer: p.cnpsEmployer,
            igrTax: p.igrTax,
            netPay: p.netPay,
            bonuses: p.bonuses,
            deductions: p.deductions,
          })),
        }),
      })

      const data = await res.json()
      if (data.success) {
        toast({
          title: "✨… Bulletins clôturés",
          description: `Paie validée avec succès.`,
        })
        fetchPayroll()
      } else {
        throw new Error(data.error?.message || 'Erreur lors de la sauvegarde.')
      }
    } catch (e: any) {
      toast({
        title: "❌ Erreur",
        description: e.message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const getMonthLabel = (mVal: string) => {
    const months: Record<string, string> = {
      '1': 'Janvier', '2': 'Février', '3': 'Mars', '4': 'Avril',
      '5': 'Mai', '6': 'Juin', '7': 'Juillet', '8': 'Août',
      '9': 'Septembre', '10': 'Octobre', '11': 'Novembre', '12': 'Décembre'
    }
    return months[mVal] || ''
  }

  const totalMasseSalariale = payrolls.reduce((sum, p) => sum + p.grossSalary, 0)
  const totalCnpsEmployer = payrolls.reduce((sum, p) => sum + p.cnpsEmployer, 0)
  const totalIgr = payrolls.reduce((sum, p) => sum + p.igrTax, 0)

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-white">
      {/* Header bar */}
      <m.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-[#8A1C14] to-[#C8951E] flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-display font-black text-white tracking-tight">
              Paie <span className="bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] bg-clip-text text-transparent">& RH Premium</span>
            </h1>
          </div>
          <p className="text-white/40 text-xs ml-10">Conforme {country === 'SN' ? 'Sénégal (IPRES/IPM)' : 'Côte d\'Ivoire (CNPS/IGR)'}</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <m.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => window.open(`/api/rh/declarations?month=${selectedMonth}&year=${selectedYear}&country=${country}`, '_blank')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> CSV Déclaration
          </m.button>

          {payrolls.some((p) => !p.isSaved) && payrolls.length > 0 && (
            <m.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleSavePayslips}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm text-[#0F0A05] cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #F3E5AB, #C8951E)', boxShadow: '0 4px 20px rgba(200,149,30,0.3)' }}
            >
              <CheckCircle2 className="w-4 h-4" /> {saving ? 'Clôture...' : 'Clôturer Période'}
            </m.button>
          )}
        </div>
      </m.div>

      {/* Stats Bar */}
      <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1A1410] border border-white/5 rounded-3xl p-5 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-[#C8951E]/10 rounded-full blur-2xl" />
          <h4 className="text-xs text-white/40 font-bold uppercase tracking-wider mb-1">Masse Salariale</h4>
          <div className="text-2xl font-display font-black text-[#C8951E]">{totalMasseSalariale.toLocaleString()} <span className="text-sm">FCFA</span></div>
        </div>
        <div className="bg-[#1A1410] border border-white/5 rounded-3xl p-5 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl" />
          <h4 className="text-xs text-white/40 font-bold uppercase tracking-wider mb-1">CNPS Patronal</h4>
          <div className="text-2xl font-display font-black text-blue-400">{totalCnpsEmployer.toLocaleString()} <span className="text-sm">FCFA</span></div>
        </div>
        <div className="bg-[#1A1410] border border-white/5 rounded-3xl p-5 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-red-500/10 rounded-full blur-2xl" />
          <h4 className="text-xs text-white/40 font-bold uppercase tracking-wider mb-1">Total IGR (Impôts)</h4>
          <div className="text-2xl font-display font-black text-red-400">{totalIgr.toLocaleString()} <span className="text-sm">FCFA</span></div>
        </div>
      </m.div>

      {/* Period Selector Tabs */}
      <m.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-col md:flex-row gap-3">
        <div className="flex bg-[#1A1410] border border-white/5 p-1 rounded-2xl w-full md:w-auto">
          {['CI', 'SN'].map(c => (
            <button
              key={c}
              onClick={() => setCountry(c)}
              className={`flex-1 md:w-24 py-2 text-xs font-bold rounded-xl transition-all ${country === c ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}
            >
              {c === 'CI' ? '🇨🇮 Côte d\'Ivoire' : '🇸🇳 Sénégal'}
            </button>
          ))}
        </div>
        
        <div className="flex-1 flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {Array.from({ length: 12 }, (_, i) => String(i + 1)).map(mVal => (
            <button
              key={mVal}
              onClick={() => setSelectedMonth(mVal)}
              className={`px-4 py-2 text-xs font-bold rounded-2xl transition-all whitespace-nowrap border ${selectedMonth === mVal ? 'bg-[#C8951E]/20 border-[#C8951E]/50 text-[#F3E5AB]' : 'bg-[#1A1410] border-white/5 text-white/40 hover:text-white'}`}
            >
              {getMonthLabel(mVal)}
            </button>
          ))}
        </div>
      </m.div>

      {/* Payslips Grid */}
      <m.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        {loading ? (
          <div className="flex justify-center py-16"><div className="animate-spin h-6 w-6 border-2 border-[#C8951E] border-t-transparent rounded-full" /></div>
        ) : payrolls.length === 0 ? (
          <div className="text-center py-16 text-white/20 text-xs"><div className="text-4xl mb-3">📁„</div>Aucun salarié.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {payrolls.map((pr, i) => (
              <m.div
                key={pr.employee.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="group bg-[#1A1410] border border-white/5 rounded-3xl p-5 hover:border-[#C8951E]/30 transition-all cursor-pointer relative overflow-hidden"
              >
                {pr.isSaved && <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full" />}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-xl">
                      👩🏽‍💼
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-base text-white">{pr.employee.firstName} {pr.employee.lastName}</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider">{pr.employee.position}</p>
                    </div>
                  </div>
                  {pr.isSaved ? (
                    <span className="text-[10px] font-bold px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg">Validé</span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-1 bg-orange-500/10 text-orange-400 rounded-lg">Brouillon</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-[10px] text-white/40">Brut</span>
                    <div className="font-mono text-sm text-white">{pr.grossSalary.toLocaleString()} F</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40">Net à payer</span>
                    <div className="font-mono text-lg font-bold text-emerald-400">{pr.netPay.toLocaleString()} F</div>
                  </div>
                </div>

                <div className="flex gap-2 border-t border-white/5 pt-4">
                  <span className="text-[9px] px-2 py-1 bg-white/5 rounded text-white/60">CNPS: -{pr.cnpsEmployee.toLocaleString()}</span>
                  {pr.igrTax > 0 && <span className="text-[9px] px-2 py-1 bg-red-500/10 text-red-400 rounded">IGR: -{pr.igrTax.toLocaleString()}</span>}
                  <div className="flex-1" />
                  <m.button 
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSlipModal(pr)}
                    className="text-[10px] font-bold px-3 py-1.5 bg-[#C8951E]/10 text-[#F3E5AB] rounded-xl hover:bg-[#C8951E]/20 transition"
                  >
                    Voir Bulletin
                  </m.button>
                </div>
              </m.div>
            ))}
          </div>
        )}
      </m.div>

      {/* Payslip Modal */}
      <AnimatePresence>
        {showSlipModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <m.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white text-black p-8 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              <div className="print-area">
                <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
                  <div>
                    <h3 className="font-display font-black text-xl uppercase">KÈNÈ BEAUTÉ</h3>
                    <p className="text-xs text-gray-600">Abidjan, Cocody Mermoz</p>
                    <p className="text-xs text-gray-600 font-mono">N° Employeur: 458-92831</p>
                  </div>
                  <div className="text-right">
                    <h2 className="font-bold text-lg">BULLETIN DE PAIE</h2>
                    <p className="text-sm font-mono text-gray-500">{getMonthLabel(selectedMonth)} {selectedYear}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-6">
                  <div className="border border-gray-200 p-3 rounded-xl">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Employé</p>
                    <p className="font-bold">{showSlipModal.employee.firstName} {showSlipModal.employee.lastName}</p>
                    <p className="text-xs text-gray-600">Poste: {showSlipModal.employee.position}</p>
                    <p className="text-xs text-gray-600">Embauche: {new Date(showSlipModal.employee.hireDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <table className="w-full text-sm mb-6 border-collapse">
                  <thead>
                    <tr className="border-b-2 border-black text-left">
                      <th className="py-2">Désignation</th>
                      <th className="py-2 text-right">Base</th>
                      <th className="py-2 text-right text-red-600">Retenues</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-medium">Salaire de Base</td>
                      <td className="py-2 text-right font-mono">{showSlipModal.employee.baseSalary.toLocaleString()}</td>
                      <td className="py-2 text-right font-mono">-</td>
                    </tr>
                    {showSlipModal.bonuses.map((b, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="py-2">{b.name}</td>
                        <td className="py-2 text-right font-mono">{b.amount.toLocaleString()}</td>
                        <td className="py-2 text-right font-mono">-</td>
                      </tr>
                    ))}
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-600">Cotisation CNPS</td>
                      <td className="py-2 text-right font-mono">-</td>
                      <td className="py-2 text-right font-mono text-red-600">{showSlipModal.cnpsEmployee.toLocaleString()}</td>
                    </tr>
                    {showSlipModal.igrTax > 0 && (
                      <tr className="border-b border-gray-100">
                        <td className="py-2 text-gray-600">Impôt IGR</td>
                        <td className="py-2 text-right font-mono">-</td>
                        <td className="py-2 text-right font-mono text-red-600">{showSlipModal.igrTax.toLocaleString()}</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <div className="flex justify-end mt-8">
                  <div className="border-2 border-black rounded-xl p-4 w-64">
                    <p className="text-xs uppercase font-bold text-gray-500 mb-1">Net à Payer</p>
                    <p className="text-2xl font-mono font-black">{showSlipModal.netPay.toLocaleString()} <span className="text-sm">XOF</span></p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8 no-print">
                <Button onClick={() => setShowSlipModal(null)} className="flex-1 bg-gray-100 text-black hover:bg-gray-200">Fermer</Button>
                <Button onClick={() => window.print()} className="flex-1 bg-black text-white hover:bg-gray-800">
                  <Printer className="w-4 h-4 mr-2" /> Imprimer / PDF
                </Button>
              </div>

              <style dangerouslySetInnerHTML={{__html: `
                @media print {
                  body * { visibility: hidden; }
                  .print-area, .print-area * { visibility: visible; }
                  .print-area { position: absolute; left: 0; top: 0; width: 100%; }
                  .no-print { display: none; }
                }
              `}} />
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
