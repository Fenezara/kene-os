'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, Printer, Download, ArrowLeft, ShieldCheck, Calculator, CheckCircle2, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function SyscohadaExportPage() {
  const { toast } = useToast();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState('2026');

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/accounting/export?year=${year}`);
      const data = await res.json();
      if (data.success) {
        setReport(data.report);
      }
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de charger les états financiers.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [year]);

  return (
    <div className="space-y-8 text-white min-h-full max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <a href="/compta" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition">
              <ArrowLeft className="w-4 h-4" />
            </a>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">
              États Financiers Officiels <span className="text-[var(--gold-kene)]">SYSCOHADA</span>
            </h1>
          </div>
          <p className="text-karite/80 mt-2">Bilan Actif/Passif, Compte de Résultat (SIG) et Liasse Fiscale certifiés OHADA.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="bg-[#241C16] border border-[#362A21] text-white text-xs rounded-xl px-3 py-2 outline-none focus:border-[var(--gold-kene)] font-mono"
          >
            <option value="2026">Exercice 2026</option>
            <option value="2025">Exercice 2025</option>
          </select>

          <Button onClick={() => window.print()} className="bg-[var(--gold-kene)] text-[#1A1410] hover:bg-[#D4AF37]/90 font-bold text-xs">
            <Printer className="w-4 h-4 mr-1.5" /> Imprimer Liasse Fiscale
          </Button>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-[var(--gold-kene)] border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Company Legal Banner */}
          <Card className="bg-[#241C16] border-[#362A21] p-6 rounded-3xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[var(--gold-kene)]" />
                  <h3 className="font-bold text-lg text-white font-display">{report.entity}</h3>
                </div>
                <p className="text-xs text-karite/60 font-mono">NIF : {report.nif} • RCCM : {report.rccm}</p>
                <p className="text-xs text-karite/60 font-sans">{report.regime} • Monnaie : {report.currency}</p>
              </div>

              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 flex items-center gap-1.5 px-3 py-1 text-xs">
                <ShieldCheck className="w-4 h-4" /> Certifié Conforme OHADA
              </Badge>
            </div>
          </Card>

          {/* BILAN ACTIF / PASSIF */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ACTIF */}
            <Card className="bg-[#241C16] border-[#362A21]">
              <CardHeader className="border-b border-[#362A21]">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-[var(--gold-kene)] font-display flex justify-between items-center">
                  <span>BILAN ACTIF (Immobilisations & Stocks)</span>
                  <span className="text-xs text-karite/60 font-mono">Devise : FCFA</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#362A21] text-karite/60 font-mono">
                      <th className="pb-2">Code</th>
                      <th className="pb-2">Poste Actif</th>
                      <th className="pb-2 text-right">Net</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#362A21] font-mono">
                    {report.balanceSheet.assets.map((item: any) => (
                      <tr key={item.code} className="hover:bg-[#1A1410]">
                        <td className="py-2.5 text-[var(--gold-kene)]">{item.code}</td>
                        <td className="py-2.5 text-white font-sans">{item.label}</td>
                        <td className="py-2.5 text-right font-bold text-emerald-400">{item.net.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 pt-3 border-t-2 border-[var(--gold-kene)]/40 flex justify-between font-mono font-bold text-sm">
                  <span>TOTAL GENERAL ACTIF (NET) :</span>
                  <span className="text-emerald-400">{report.balanceSheet.totalAssetsNet.toLocaleString()} FCFA</span>
                </div>
              </CardContent>
            </Card>

            {/* PASSIF */}
            <Card className="bg-[#241C16] border-[#362A21]">
              <CardHeader className="border-b border-[#362A21]">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-[var(--gold-kene)] font-display flex justify-between items-center">
                  <span>BILAN PASSIF (Capitaux & Dettes)</span>
                  <span className="text-xs text-karite/60 font-mono">Devise : FCFA</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#362A21] text-karite/60 font-mono">
                      <th className="pb-2">Code</th>
                      <th className="pb-2">Poste Passif</th>
                      <th className="pb-2 text-right">Net</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#362A21] font-mono">
                    {report.balanceSheet.liabilities.map((item: any) => (
                      <tr key={item.code} className="hover:bg-[#1A1410]">
                        <td className="py-2.5 text-[var(--gold-kene)]">{item.code}</td>
                        <td className="py-2.5 text-white font-sans">{item.label}</td>
                        <td className="py-2.5 text-right font-bold text-white">{item.net.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 pt-3 border-t-2 border-[var(--gold-kene)]/40 flex justify-between font-mono font-bold text-sm">
                  <span>TOTAL GENERAL PASSIF (NET) :</span>
                  <span className="text-emerald-400">{report.balanceSheet.totalLiabilitiesNet.toLocaleString()} FCFA</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* COMPTE DE RESULTAT (SIG) */}
          <Card className="bg-[#241C16] border-[#362A21]">
            <CardHeader className="border-b border-[#362A21]">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-[var(--gold-kene)] font-display flex items-center gap-2">
                <Calculator className="w-4 h-4" /> COMPTE DE RÉSULTAT (Produits vs Charges - Soldes Intermédiaires de Gestion)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">Produits & Chiffre d'Affaires (+)</h4>
                  <div className="space-y-2 font-mono text-xs">
                    {report.incomeStatement.revenues.map((r: any) => (
                      <div key={r.code} className="flex justify-between p-2.5 bg-[#1A1410] rounded-xl border border-[#362A21]">
                        <span className="text-white font-sans">{r.label}</span>
                        <span className="text-emerald-400 font-bold">+{r.amount.toLocaleString()} FCFA</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-right font-mono text-sm font-bold text-emerald-400">
                    Total Produits : {report.incomeStatement.totalRevenues.toLocaleString()} FCFA
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3">Charges d'Exploitation & Taxes (-)</h4>
                  <div className="space-y-2 font-mono text-xs">
                    {report.incomeStatement.expenses.map((e: any) => (
                      <div key={e.code} className="flex justify-between p-2.5 bg-[#1A1410] rounded-xl border border-[#362A21]">
                        <span className="text-white font-sans">{e.label}</span>
                        <span className="text-red-400 font-bold">-{e.amount.toLocaleString()} FCFA</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-right font-mono text-sm font-bold text-red-400">
                    Total Charges : {report.incomeStatement.totalExpenses.toLocaleString()} FCFA
                  </div>
                </div>
              </div>

              {/* Net Result Highlight */}
              <div className="p-5 bg-gradient-to-r from-emerald-950/40 to-[#1A1410] border border-emerald-500/30 rounded-2xl flex justify-between items-center">
                <div>
                  <span className="text-xs text-karite/60 font-semibold uppercase tracking-wider block">RÉSULTAT NET COMPTABLE (BÉNÉFICE)</span>
                  <span className="text-2xl font-bold font-mono text-emerald-400">{report.incomeStatement.netProfit.toLocaleString()} FCFA</span>
                </div>
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
