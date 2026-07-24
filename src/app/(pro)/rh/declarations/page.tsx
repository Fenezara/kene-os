'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, CheckCircle2, AlertCircle, ShieldCheck, ArrowLeft, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function CnpsDeclarationsPage() {
  const { toast } = useToast();
  const [declarations, setDeclarations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeclarations = async () => {
    try {
      const res = await fetch('/api/rh/declarations');
      const data = await res.json();
      if (data.success) {
        setDeclarations(data.declarations);
      }
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de charger les déclarations CNPS.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeclarations();
  }, []);

  const handlePayDeclaration = async (quarterId: string) => {
    try {
      const res = await fetch('/api/rh/declarations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quarterId }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Déclaration Transmise", description: data.message });
        setDeclarations(declarations.map(d => d.id === quarterId ? { ...d, status: 'PAYE', paidAt: new Date().toISOString() } : d));
      }
    } catch (error) {
      toast({ title: "Erreur", description: "Échec du règlement de la cotisation.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8 text-white min-h-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <a href="/rh" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition">
              <ArrowLeft className="w-4 h-4" />
            </a>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">
              Déclarations <span className="text-[var(--gold-kene)]">e-CNPS / Sécurité Sociale</span>
            </h1>
          </div>
          <p className="text-karite/80 mt-2">Gestion des déclarations trimestrielles de cotisations sociales (UEMOA / OHADA).</p>
        </div>
      </motion.div>

      {/* Declarations Grid */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-[var(--gold-kene)] border-t-transparent rounded-full" />
          </div>
        ) : (
          declarations.map((dec) => (
            <motion.div key={dec.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="bg-[#241C16] border-[#362A21]">
                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-[#362A21]">
                  <div>
                    <CardTitle className="text-lg font-display text-white flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[var(--gold-kene)]" /> {dec.quarter}
                    </CardTitle>
                    <span className="text-xs text-karite/60 font-mono">Effectif : {dec.totalEmployees} salariés déclarés</span>
                  </div>
                  <Badge className={dec.status === 'PAYE' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}>
                    {dec.status === 'PAYE' ? 'RÉGLÉ & TRANSMIS' : 'À RÉGLER'}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Detailed Breakdown Table */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className="bg-[#1A1410] p-3 rounded-xl border border-[#362A21]">
                      <span className="text-karite/60 block">Masse Salariale Brute</span>
                      <span className="text-base font-bold font-mono text-white">{dec.grossSalaries.toLocaleString()} FCFA</span>
                    </div>
                    <div className="bg-[#1A1410] p-3 rounded-xl border border-[#362A21]">
                      <span className="text-karite/60 block">Part Patronale (7.75%)</span>
                      <span className="text-base font-bold font-mono text-[var(--gold-kene)]">{dec.cnpsPatronal.toLocaleString()} FCFA</span>
                    </div>
                    <div className="bg-[#1A1410] p-3 rounded-xl border border-[#362A21]">
                      <span className="text-karite/60 block">Part Salariale (3.6%)</span>
                      <span className="text-base font-bold font-mono text-white">{dec.cnpsSalarial.toLocaleString()} FCFA</span>
                    </div>
                    <div className="bg-[#1A1410] p-3 rounded-xl border border-[#362A21]">
                      <span className="text-karite/60 block">Prestations & Acc. Travail</span>
                      <span className="text-base font-bold font-mono text-white">{(dec.workAccident + dec.familyAllowance).toLocaleString()} FCFA</span>
                    </div>
                  </div>

                  {/* Summary & Action Bar */}
                  <div className="flex justify-between items-center bg-[#1A1410] p-4 rounded-xl border border-[#362A21]">
                    <div>
                      <span className="text-xs text-karite/60 block">Total Cotisations Sociales À Régler</span>
                      <span className="text-xl font-bold font-mono text-emerald-400">{dec.totalDue.toLocaleString()} FCFA</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button variant="outline" className="border-[#362A21] bg-transparent text-white hover:bg-[#362A21] text-xs">
                        <Download className="w-3.5 h-3.5 mr-2" /> Telecharger Fichier DSN/CNPS
                      </Button>
                      {dec.status === 'EN_ATTENTE' && (
                        <Button 
                          onClick={() => handlePayDeclaration(dec.id)}
                          className="bg-[var(--gold-kene)] text-[#1A1410] hover:bg-[#D4AF37]/90 font-bold text-xs"
                        >
                          <Send className="w-3.5 h-3.5 mr-2" /> Régler via Mobile Money
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
