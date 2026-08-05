'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Search, Receipt, CreditCard, Banknote, Smartphone, Printer, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { DigitalReceiptModal } from '@/components/pos/DigitalReceiptModal';
import { OfflineSyncBanner } from '@/components/pos/OfflineSyncBanner';

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Espèces', icon: '💵', color: '#4CAF6E', badge: 'bg-emerald-500/10 text-emerald-400' },
  { value: 'wave', label: 'Wave', icon: '🌊', color: '#00B4D8', badge: 'bg-blue-500/10 text-blue-400' },
  { value: 'orange', label: 'Orange Money', icon: '🟠', color: '#FF6B00', badge: 'bg-orange-500/10 text-orange-400' },
  { value: 'mtn', label: 'MTN MoMo', icon: '📁±', color: '#FFCB00', badge: 'bg-yellow-500/10 text-yellow-400' },
  { value: 'card', label: 'Carte Bancaire', icon: '💳', color: '#8B5CF6', badge: 'bg-purple-500/10 text-purple-400' },
]

export default function ProPOSPage() {
  const { toast } = useToast();
  const [sales, setSales] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search, setSearch] = useState('');

  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isZReportOpen, setIsZReportOpen] = useState(false);

  const [formData, setFormData] = useState({ clientId: '', appointmentId: '', subtotal: '', method: 'cash' });

  const fetchData = async () => {
    try {
      const [salesRes, clientsRes, apptsRes] = await Promise.all([
        fetch('/api/tenant/sales'), fetch('/api/tenant/clients'), fetch('/api/tenant/appointments')
      ]);
      const [salesData, clientsData, apptsData] = await Promise.all([salesRes.json(), clientsRes.json(), apptsRes.json()]);
      if (salesData.success) setSales(salesData.sales);
      if (clientsData.success) setClients(clientsData.clients);
      if (apptsData.success) setAppointments(apptsData.appointments.filter((a: any) => a.status === 'pending' || a.status === 'confirmed'));
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger les données.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateSale = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/tenant/sales', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "✨… Vente enregistrée", description: "Reçu numérique généré." });
        setIsDialogOpen(false);
        const total = parseFloat(formData.subtotal || '0');
        const vat = Math.round(total * 0.18);
        const clientObj = clients.find(c => c.id === formData.clientId);
        setSelectedReceipt({
          invoiceNumber: data.sale?.invoiceNumber || `FAC-${Date.now().toString().slice(-4)}`,
          createdAt: new Date(),
          clientName: clientObj ? `${clientObj.firstName} ${clientObj.lastName}` : 'Client de passage',
          clientPhone: clientObj?.phone,
          items: [{ name: 'Prestation Soin & Cosmétiques', price: total, qty: 1 }],
          subtotalHT: total - vat, vatAmount: vat, totalTTC: total, paymentMethod: formData.method
        });
        setIsReceiptOpen(true);
        setFormData({ clientId: '', appointmentId: '', subtotal: '', method: 'cash' });
        fetchData();
      } else throw new Error(data.error);
    } catch {
      toast({ title: "Erreur", description: "Impossible d'enregistrer la vente.", variant: "destructive" });
    }
  };

  const openReceiptForSale = (sale: any) => {
    const total = sale.total;
    const vat = Math.round(total * 0.18);
    setSelectedReceipt({
      invoiceNumber: sale.invoiceNumber, createdAt: sale.createdAt,
      clientName: sale.client ? `${sale.client.firstName} ${sale.client.lastName}` : 'Client de passage',
      clientPhone: sale.client?.phone,
      items: sale.items?.map((i: any) => ({ name: i.service?.name || i.product?.name || 'Prestation', price: i.unitPrice, qty: i.quantity })) || [{ name: 'Prestation / Vente Caisse', price: total, qty: 1 }],
      subtotalHT: total - vat, vatAmount: vat, totalTTC: total, paymentMethod: sale.payments[0]?.method || 'cash'
    });
    setIsReceiptOpen(true);
  };

  const handleAppointmentChange = (val: string) => {
    const appt = appointments.find(a => a.id === val);
    if (appt) setFormData({ ...formData, appointmentId: val, clientId: appt.clientId, subtotal: appt.amount.toString() });
  };

  const getMethodMeta = (method: string) => PAYMENT_METHODS.find(m => m.value === method) || PAYMENT_METHODS[0];

  const filteredSales = sales.filter(s =>
    s.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    (s.client && `${s.client.firstName} ${s.client.lastName}`.toLowerCase().includes(search.toLowerCase()))
  );

  const todayRevenue = sales.filter(s => {
    const d = new Date(s.createdAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="space-y-6 text-white min-h-full max-w-5xl mx-auto">

      <OfflineSyncBanner />

      {/* ── HEADER ── */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-[#C8951E] to-[#8A5C0A] flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-[#0F0A05]" />
            </div>
            <h1 className="text-2xl font-display font-black text-white tracking-tight">
              Point de <span className="bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] bg-clip-text text-transparent">Vente</span>
            </h1>
          </div>
          <p className="text-white/40 text-xs">Encaissez les prestations, gérez les acomptes MoMo et émettez des reçus certifiés.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsZReportOpen(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-xs bg-white/5 hover:bg-white/10 text-white border border-white/10 cursor-pointer transition"
          >
            <Receipt className="w-4 h-4 text-[#C8951E]" /> Rapport Z Clôture
          </button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm text-[#0F0A05] cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #F3E5AB, #C8951E)', boxShadow: '0 4px 20px rgba(200,149,30,0.3)' }}
              >
                <Zap className="w-4 h-4" /> Encaisser une Vente
              </motion.button>
            </DialogTrigger>
          <DialogContent className="bg-[#0F0A05] border border-[#C8951E]/20 text-white rounded-3xl max-w-md" style={{ boxShadow: '0 32px 64px rgba(0,0,0,0.7)' }}>
            <div className="h-0.5 bg-gradient-to-r from-transparent via-[#C8951E] to-transparent -mt-[1px] mx-6 rounded-full" />
            <DialogHeader className="pt-2">
              <DialogTitle className="font-display text-xl text-white flex items-center gap-2">
                <span className="text-2xl">💰</span> Encaisser une prestation
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSale} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label className="text-white/50 text-xs">Lier à un RDV (Optionnel)</Label>
                <Select value={formData.appointmentId} onValueChange={handleAppointmentChange}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl">
                    <SelectValue placeholder="Sélectionner un RDV en attente..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1410] border-[#362A21] text-white">
                    <SelectItem value="none">Aucun (Vente directe)</SelectItem>
                    {appointments.map((a: any) => (
                      <SelectItem key={a.id} value={a.id}>
                        {format(new Date(a.startAt), 'dd/MM HH:mm')} · {a.client?.firstName} · {a.amount.toLocaleString()} F
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-white/50 text-xs">Recherche Client Rapide (CRM)</Label>
                <Input
                  placeholder="Rechercher nom, téléphone..."
                  className="bg-white/5 border-white/10 text-white rounded-xl focus:border-[#C8951E] mb-2 h-10"
                />
                <select 
                  value={formData.clientId} 
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full bg-[#1A1410] border border-white/10 text-white rounded-xl p-3 text-xs font-bold cursor-pointer focus:border-[#C8951E] outline-none"
                >
                  <option value="none" className="bg-[#0F0A05] text-white/50">-- Client de passage --</option>
                  {clients.map((c: any) => (
                    <option key={c.id} value={c.id} className="bg-[#0F0A05] text-white font-bold py-1">
                      👤 {c.firstName} {c.lastName} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <Label className="text-white/50 text-xs">Montant (FCFA)</Label>
                  <Input
                    type="number" required min="0"
                    className="bg-white/5 border-white/10 text-white text-lg font-bold rounded-xl h-12 focus:border-[#C8951E]"
                    value={formData.subtotal}
                    onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })}
                    placeholder="0"
                  />
                  <div className="flex gap-1.5 mt-2">
                    {['-5%', '-10%', '-15%', '-2000'].map((discount) => (
                      <button
                        key={discount}
                        type="button"
                        onClick={() => {
                          if (!formData.subtotal) return;
                          let total = parseFloat(formData.subtotal);
                          if (discount.includes('%')) {
                            const pct = parseFloat(discount.replace('%', '').replace('-', ''));
                            total = total * (1 - (pct / 100));
                          } else {
                            const amt = parseFloat(discount.replace('-', ''));
                            total = Math.max(0, total - amt);
                          }
                          setFormData({ ...formData, subtotal: total.toFixed(0) });
                        }}
                        className="flex-1 bg-white/5 hover:bg-[#C8951E]/20 text-white/70 hover:text-[#C8951E] border border-white/10 hover:border-[#C8951E]/40 rounded-lg py-1 text-[10px] font-mono transition-colors"
                      >
                        {discount}{discount.includes('%') ? '' : 'F'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <Label className="text-white/50 text-xs">Moyen de paiement</Label>
                  <Select value={formData.method} onValueChange={(v) => setFormData({ ...formData, method: v })} required>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1410] border-[#362A21] text-white">
                      {PAYMENT_METHODS.map(m => (
                        <SelectItem key={m.value} value={m.value}>{m.icon} {m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <AnimatePresence>
                {(formData.method === 'wave' || formData.method === 'orange' || formData.method === 'mtn') && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="bg-[#1A1410] rounded-2xl p-4 flex flex-col items-center justify-center border border-white/5 mt-2">
                      <div className="w-32 h-32 bg-white rounded-xl flex flex-wrap content-start items-start justify-start p-1">
                        {Array.from({ length: 49 }).map((_, i) => (
                          <div key={i} className={`w-[13.5px] h-[13.5px] ${Math.random() > 0.4 ? 'bg-black' : 'bg-transparent'} rounded-[1px]`} />
                        ))}
                      </div>
                      <p className="text-xs text-white/50 mt-3 text-center">
                        Demandez au client de scanner ce code <br />
                        <strong style={{ color: PAYMENT_METHODS.find(m => m.value === formData.method)?.color }}>
                          {PAYMENT_METHODS.find(m => m.value === formData.method)?.label}
                        </strong>
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {formData.subtotal && parseFloat(formData.subtotal) > 0 && (
                <div className="bg-[#C8951E]/10 border border-[#C8951E]/20 rounded-2xl p-3 space-y-1 text-xs font-mono mt-2">
                  <div className="flex justify-between text-white/50">
                    <span>HT</span><span>{(parseFloat(formData.subtotal) / 1.18).toFixed(0)} F</span>
                  </div>
                  <div className="flex justify-between text-white/50">
                    <span>TVA (18%)</span><span>{(parseFloat(formData.subtotal) - parseFloat(formData.subtotal) / 1.18).toFixed(0)} F</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#C8951E] border-t border-white/10 pt-1">
                    <span>Total TTC</span><span>{parseFloat(formData.subtotal).toLocaleString()} FCFA</span>
                  </div>
                </div>
              )}

              <DialogFooter className="mt-4 flex gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-white/40 hover:text-white rounded-xl">Annuler</Button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="flex-1 h-11 rounded-xl font-bold text-sm text-[#0F0A05] cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #F3E5AB, #C8951E)' }}
                >
                  ✨… Enregistrer & Émettre Reçu
                </motion.button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </motion.div>

      {/* ── KPI TOP BAR ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {[
          { label: "Ventes Aujourd'hui", value: sales.filter(s => new Date(s.createdAt).toDateString() === new Date().toDateString()).length, suffix: 'ventes', accent: '#C8951E' },
          { label: 'CA Aujourd\'hui', value: todayRevenue.toLocaleString('fr-FR'), suffix: 'FCFA', accent: '#4CAF6E' },
          { label: 'CA Total (Mois)', value: sales.reduce((s, v) => s + v.total, 0).toLocaleString('fr-FR'), suffix: 'FCFA', accent: '#4E9FD1' },
          { label: 'Factures Émises', value: sales.length, suffix: 'total', accent: '#E07A2B' },
        ].map((kpi, i) => (
          <div key={i} className="relative overflow-hidden rounded-2xl bg-[#1A1410] border border-white/5 p-4">
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-xl opacity-15" style={{ background: kpi.accent }} />
            <div className="text-[9px] text-white/30 uppercase tracking-widest font-mono mb-1">{kpi.label}</div>
            <div className="text-xl font-display font-black text-white">{kpi.value}</div>
            <div className="text-[9px] font-mono mt-0.5" style={{ color: kpi.accent }}>{kpi.suffix}</div>
          </div>
        ))}
      </motion.div>

      {/* ── SALES TABLE ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="rounded-3xl border border-white/5 bg-[#1A1410] overflow-hidden">
          {/* Table header bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-5 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-[#C8951E]/15 flex items-center justify-center">
                <Receipt className="w-3.5 h-3.5 text-[#C8951E]" />
              </div>
              <span className="font-display font-bold text-sm text-white">Historique des Ventes & Reçus</span>
              <span className="text-[10px] bg-[#C8951E]/10 text-[#C8951E] px-2 py-0.5 rounded-full font-mono">{sales.length}</span>
            </div>
            <div className="relative w-full md:w-56">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-white/30" />
              <Input
                placeholder="Chercher facture ou client..."
                className="pl-8 bg-white/5 border-white/10 text-white text-xs h-9 rounded-xl placeholder:text-white/20 focus:border-[#C8951E]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin h-6 w-6 border-2 border-[#C8951E] border-t-transparent rounded-full" />
            </div>
          ) : filteredSales.length === 0 ? (
            <div className="text-center py-16 text-white/20 text-xs font-sans">
              <div className="text-4xl mb-3">🛒</div>
              Aucune vente enregistrée.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredSales.map((sale) => {
                const pm = getMethodMeta(sale.payments[0]?.method || 'cash');
                return (
                  <div
                    key={sale.id}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                    onClick={() => openReceiptForSale(sale)}
                  >
                    <div className="w-9 h-9 rounded-2xl bg-[#C8951E]/10 border border-[#C8951E]/20 flex items-center justify-center shrink-0">
                      <Receipt className="w-4 h-4 text-[#C8951E]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#C8951E] font-mono">{sale.invoiceNumber}</span>
                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${pm.badge}`}>
                          {pm.icon} {pm.label}
                        </span>
                      </div>
                      <div className="text-[11px] text-white/60 mt-0.5">
                        {sale.client ? `${sale.client.firstName} ${sale.client.lastName}` : 'Client de passage'} · {format(new Date(sale.createdAt), 'dd/MM/yyyy HH:mm')}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-display font-black text-white text-sm">{sale.total.toLocaleString('fr-FR')} <span className="text-white/30 text-[10px] font-mono">FCFA</span></div>
                      <button
                        className="text-[10px] text-white/20 group-hover:text-[#C8951E] transition-colors flex items-center gap-1 ml-auto mt-0.5"
                        onClick={(e) => { e.stopPropagation(); openReceiptForSale(sale); }}
                      >
                        <Printer className="w-3 h-3" /> Imprimer
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </motion.div>

      <DigitalReceiptModal isOpen={isReceiptOpen} onClose={() => setIsReceiptOpen(false)} sale={selectedReceipt} />

      {/* 🧾 MODAL RAPPORT Z FIN DE JOURNÉE & CLÔTURE CAISSE */}
      <Dialog open={isZReportOpen} onOpenChange={setIsZReportOpen}>
        <DialogContent className="bg-[#0F0A05] border border-[#C8951E]/40 text-white rounded-3xl max-w-md p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#C8951E]" /> Rapport Z — Clôture Caisse
              </span>
              <Badge className="bg-[#C8951E]/15 text-[#F3E5AB] border border-[#C8951E]/30 text-[10px] font-mono font-bold">
                {format(new Date(), 'dd/MM/yyyy')}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 my-2 text-xs">
            {/* Total Today */}
            <div className="bg-gradient-to-br from-[#1A1410] to-[#0A0603] border border-[#C8951E]/30 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-white/50 text-[10px] font-mono uppercase block">Chiffre d'Affaires Encaissé Aujourd'hui</span>
                <span className="font-display font-black text-2xl text-[#F3E5AB]">{todayRevenue.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {sales.filter(s => new Date(s.createdAt).toDateString() === new Date().toDateString()).length} Vente(s)
                </span>
              </div>
            </div>

            {/* Breakdown by Payment Method */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-white/50 uppercase tracking-wider font-mono">Ventilation par Mode de Paiement</h4>
              <div className="space-y-1.5">
                {PAYMENT_METHODS.map(m => {
                  const mTotal = sales.filter(s => {
                    const d = new Date(s.createdAt);
                    const now = new Date();
                    const sMethod = s.payments?.[0]?.method || 'cash';
                    return d.toDateString() === now.toDateString() && sMethod === m.value;
                  }).reduce((sum, s) => sum + s.total, 0);

                  return (
                    <div key={m.value} className="flex justify-between items-center bg-[#1A1410] p-2.5 rounded-xl border border-white/5">
                      <span className="flex items-center gap-2 font-bold text-white">
                        <span>{m.icon}</span> {m.label}
                      </span>
                      <span className="font-mono font-bold text-white">{mTotal.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fiscal VAT Summary */}
            <div className="bg-[#1A1410] border border-white/10 p-3 rounded-xl flex justify-between items-center text-xs">
              <span className="text-white/60 font-sans">TVA Collectée (Taux 18% UEMOA) :</span>
              <span className="font-mono font-bold text-[#C8951E]">{Math.round(todayRevenue * 0.18).toLocaleString('fr-FR')} FCFA</span>
            </div>

            <Button
              onClick={() => {
                toast({ title: "🖨️ï¸ Rapport Z Généré !", description: "Impression du ticket de clôture caisse en cours..." });
                setTimeout(() => window.print(), 500);
              }}
              className="w-full h-11 bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] font-black text-xs rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <Printer className="w-4 h-4" /> Imprimer & Valider le Rapport Z du Jour
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
