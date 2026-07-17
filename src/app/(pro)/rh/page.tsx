'use client'

import React, { useState, useEffect } from 'react'
import { motion as m, AnimatePresence } from 'framer-motion'
import { 
  Users, DollarSign, ShieldCheck, Printer, Calendar, 
  Download, Eye, CheckCircle2, ChevronRight 
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
  const [selectedMonth, setSelectedMonth] = useState('7') // July by default
  const [selectedYear, setSelectedYear] = useState('2026')
  const [country, setCountry] = useState('CI') // CI or SN
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
          title: "✅ Bulletins de paie clôturés",
          description: `Les bulletins de salaire pour ${getMonthLabel(selectedMonth)} ${selectedYear} ont été enregistrés avec succès.`,
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

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-white">
      {/* Header bar */}
      <div className="bg-[#1A1410] border border-white/5 p-6 rounded-3xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display text-gold-kene">Ressources Humaines & Paie</h1>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 font-sans">
              <ShieldCheck className="w-3 h-3" /> 
              {country === 'SN' ? 'Conforme IPRES & IPM (Sénégal)' : 'Conforme CNPS & IGR (Côte d\'Ivoire)'}
            </span>
          </div>
          <p className="text-xs text-white/50 font-sans mt-1">
            Gérez les salaires, cotisations patronales/salariales et impôts sur salaires ({country === 'SN' ? 'Sénégal' : 'Côte d\'Ivoire'}).
          </p>
        </div>

        <div className="flex gap-2">
          {payrolls.some((p) => p.isSaved) && (
            <div className="flex gap-2">
              <Button
                onClick={() => window.open(`/api/rh/declarations?month=${selectedMonth}&year=${selectedYear}&country=${country}`, '_blank')}
                className="bg-transparent hover:bg-white/5 border border-white/10 text-white rounded-xl text-xs py-2.5 px-4 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-gold-kene" />
                Déclaration {country === 'SN' ? 'IPRES/IPM' : 'e-CNPS (CSV)'}
              </Button>
              {country === 'CI' && (
                <Button
                  onClick={() => window.open(`/api/rh/declarations?month=${selectedMonth}&year=${selectedYear}&country=CI&format=xml`, '_blank')}
                  className="bg-transparent hover:bg-white/5 border border-white/10 text-white rounded-xl text-xs py-2.5 px-4 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-orange-400" />
                  e-CNPS (XML)
                </Button>
              )}
            </div>
          )}

          {payrolls.some((p) => !p.isSaved) && payrolls.length > 0 && (
            <Button
              onClick={handleSavePayslips}
              disabled={saving}
              className="bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410] font-semibold rounded-xl text-xs py-2.5 px-4 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-gold-kene/10"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {saving ? 'Clôture...' : 'Clôturer la Période'}
            </Button>
          )}
        </div>
      </div>

      {/* Period Selector Panel */}
      <div className="bg-[#1A1410] border border-white/5 p-5 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-gold-kene">
          <Calendar className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider font-display">Période & Pays de Calcul</span>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          {/* Country Switcher */}
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="bg-[#241C16] border border-white/10 text-white text-xs rounded-xl px-4 py-2 outline-none focus:border-gold-kene transition flex-1 md:flex-none cursor-pointer"
          >
            <option value="CI">Côte d'Ivoire (XOF)</option>
            <option value="SN">Sénégal (XOF)</option>
          </select>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-[#241C16] border border-white/10 text-white text-xs rounded-xl px-4 py-2 outline-none focus:border-gold-kene transition w-32 cursor-pointer"
          >
            {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((mVal) => (
              <option key={mVal} value={mVal}>{getMonthLabel(mVal)}</option>
            ))}
          </select>
          
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-[#241C16] border border-white/10 text-white text-xs rounded-xl px-4 py-2 outline-none focus:border-gold-kene transition w-24 cursor-pointer"
          >
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>
        </div>
      </div>

      {/* Employee payroll lines */}
      <div className="bg-[#1A1410] border border-white/5 rounded-3xl overflow-hidden shadow-lg">
        <div className="p-5 border-b border-white/5">
          <h3 className="font-display font-semibold text-sm uppercase text-gold-kene tracking-wider">État nominatif des salaires</h3>
        </div>

        {loading ? (
          <div className="text-center py-16 text-white/40 text-xs">Calcul des fiches en cours...</div>
        ) : payrolls.length === 0 ? (
          <div className="text-center py-16 text-white/30 text-xs italic">
            Aucun salarié enregistré dans votre institut.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {payrolls.map((pr) => (
              <div key={pr.employee.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/[0.01] transition">
                <div className="space-y-1">
                  <span className="text-xs text-white/40 font-semibold uppercase">{pr.employee.position}</span>
                  <h4 className="font-bold text-sm text-white">{pr.employee.firstName} {pr.employee.lastName}</h4>
                  <span className="text-[10px] text-white/30 font-mono block">Embauche : {new Date(pr.employee.hireDate).toLocaleDateString()}</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs w-full md:w-auto">
                  <div>
                    <span className="text-[10px] text-white/40 block">Salaire Base</span>
                    <span className="font-mono font-bold text-white block mt-0.5">{pr.employee.baseSalary.toLocaleString()} F</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block">{country === 'SN' ? 'IPRES/IPM (Sal.)' : 'CNPS (Sal.)'}</span>
                    <span className="font-mono text-red-400 block mt-0.5">-{pr.cnpsEmployee.toLocaleString()} F</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block">{country === 'SN' ? 'Impôt IR' : 'Impôt IGR'}</span>
                    <span className="font-mono text-red-400 block mt-0.5">-{pr.igrTax.toLocaleString()} F</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block">Net à Payer</span>
                    <span className="font-mono font-bold text-emerald-400 block mt-0.5">{pr.netPay.toLocaleString()} FCFA</span>
                  </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto justify-end border-t md:border-t-0 border-white/5 pt-3 md:pt-0 shrink-0">
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg flex items-center ${
                    pr.isSaved ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                  }`}>
                    {pr.isSaved ? 'Clôturé' : 'Brouillon'}
                  </span>
                  
                  <Button
                    onClick={() => setShowSlipModal(pr)}
                    className="bg-[#241C16]/50 hover:bg-[#241C16]/80 border border-white/10 text-white rounded-xl text-xs py-1 px-3 flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-gold-kene" />
                    Bulletin
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payslip preview print modal */}
      <AnimatePresence>
        {showSlipModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <m.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white text-black p-8 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl relative border-t-8 border-gold-kene"
            >
              {/* Header Slip info */}
              <div className="flex justify-between items-start border-b border-gray-200 pb-4">
                <div className="space-y-0.5">
                  <h3 className="font-display font-bold text-base uppercase tracking-wide">KÈNÈ BEAUTÉ SAS</h3>
                  <span className="text-[10px] text-gray-500 block">Abidjan, Cocody Mermoz</span>
                  <span className="text-[10px] text-gray-500 block">
                    {country === 'SN' ? 'Agrément IPM/IPRES N° 458-92831' : 'Agrément CNPS N° 349-10293'}
                  </span>
                </div>
                <div className="text-right">
                  <h4 className="font-bold text-sm tracking-wider uppercase">BULLETIN DE PAIE</h4>
                  <span className="text-[10px] text-gray-500 font-mono block">Période : {getMonthLabel(selectedMonth)} {selectedYear}</span>
                </div>
              </div>

              {/* Employee & salary details */}
              <div className="grid grid-cols-2 gap-4 py-4 text-[11px] border-b border-gray-100">
                <div className="space-y-1">
                  <span className="text-[9px] text-gray-400 uppercase font-semibold block">SALARIÉ</span>
                  <span className="font-bold block text-gray-800">{showSlipModal.employee.firstName} {showSlipModal.employee.lastName}</span>
                  <span className="text-gray-500 block">Poste : {showSlipModal.employee.position}</span>
                  <span className="text-gray-500 block">Tél : {showSlipModal.employee.phone}</span>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-[9px] text-gray-400 uppercase font-semibold block">CONTRAT</span>
                  <span className="font-bold block text-gray-800">CDI (Temps plein)</span>
                  <span className="text-gray-500 block font-mono">Embauche : {new Date(showSlipModal.employee.hireDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Payslip Lines Table */}
              <table className="w-full text-left border-collapse text-[11px] font-sans mt-4">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 uppercase text-[9px] tracking-wider border-b border-gray-200">
                    <th className="py-2.5 px-2">Rubrique</th>
                    <th className="py-2.5 px-2 text-right">Base / Gain</th>
                    <th className="py-2.5 px-2 text-right">Part Salariale</th>
                    <th className="py-2.5 px-2 text-right">Part Patronale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {/* Base salary */}
                  <tr>
                    <td className="py-2.5 px-2 font-bold text-gray-900">Salaire de base</td>
                    <td className="py-2.5 px-2 text-right font-mono">{showSlipModal.employee.baseSalary.toLocaleString()}</td>
                    <td className="py-2.5 px-2 text-right font-mono">-</td>
                    <td className="py-2.5 px-2 text-right font-mono">-</td>
                  </tr>
                  
                  {/* Bonuses */}
                  {showSlipModal.bonuses.map((b, i) => (
                    <tr key={i}>
                      <td className="py-2.5 px-2 text-gray-600">{b.name}</td>
                      <td className="py-2.5 px-2 text-right font-mono text-emerald-600">+{b.amount.toLocaleString()}</td>
                      <td className="py-2.5 px-2 text-right font-mono">-</td>
                      <td className="py-2.5 px-2 text-right font-mono">-</td>
                    </tr>
                  ))}

                  {/* CNPS deductions */}
                  <tr>
                    <td className="py-2.5 px-2 text-gray-600">
                      {country === 'SN' ? 'Charges Sociales (IPRES Retraite & IPM)' : 'Cotisation Sociale CNPS (5.5% / 10.9%)'}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono">-</td>
                    <td className="py-2.5 px-2 text-right font-mono text-red-500">-{showSlipModal.cnpsEmployee.toLocaleString()}</td>
                    <td className="py-2.5 px-2 text-right font-mono text-gray-500">+{showSlipModal.cnpsEmployer.toLocaleString()}</td>
                  </tr>

                  {/* IGR taxes */}
                  {showSlipModal.igrTax > 0 && (
                    <tr>
                      <td className="py-2.5 px-2 text-gray-600">
                        {country === 'SN' ? 'Impôt sur le Revenu (IR Sénégal)' : 'Impôt Général sur le Revenu (IGR)'}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono">-</td>
                      <td className="py-2.5 px-2 text-right font-mono text-red-500">-{showSlipModal.igrTax.toLocaleString()}</td>
                      <td className="py-2.5 px-2 text-right font-mono">-</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Total boxes */}
              <div className="border-t border-gray-200 mt-6 pt-4 grid grid-cols-2 gap-4 text-xs font-sans">
                <div className="space-y-1.5 text-gray-500">
                  <div className="flex justify-between">
                    <span>Brut Total :</span>
                    <span className="font-mono text-gray-800 font-bold">{showSlipModal.grossSalary.toLocaleString()} F</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cotisations patronales :</span>
                    <span className="font-mono text-gray-800">{showSlipModal.cnpsEmployer.toLocaleString()} F</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl flex flex-col justify-center items-end border border-gray-100">
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Net à percevoir</span>
                  <span className="text-base font-mono font-bold text-emerald-600 mt-0.5">{showSlipModal.netPay.toLocaleString()} FCFA</span>
                </div>
              </div>

              {/* Legal notification */}
              <p className="text-[9px] text-gray-400 mt-6 leading-relaxed font-sans border-t border-gray-100 pt-4">
                Pour vous aider à faire valoir ce que de droit, ce bulletin de salaire est édité par la plateforme Kènè Pro et tient lieu de justificatif de paiement et de déclaration sociale simplifiée CNPS UEMOA.
              </p>

              {/* Action buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-100 mt-6">
                <Button
                  onClick={() => setShowSlipModal(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2.5 rounded-xl cursor-pointer"
                >
                  Fermer
                </Button>
                <Button
                  onClick={() => window.print()}
                  className="flex-1 bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410] font-semibold py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  Imprimer
                </Button>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
