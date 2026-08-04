'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Plus, Clock, User, Scissors, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  pending:   { label: 'En attente',  bg: 'bg-yellow-500/10', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  confirmed: { label: 'ConfirmÃ©',    bg: 'bg-blue-500/10',   text: 'text-blue-400',   dot: 'bg-blue-400' },
  in_progress: { label: 'En Soin',   bg: 'bg-purple-500/10', text: 'text-purple-400', dot: 'bg-purple-400' },
  completed: { label: 'TerminÃ©',     bg: 'bg-emerald-500/10',text: 'text-emerald-400',dot: 'bg-emerald-400' },
  cancelled: { label: 'AnnulÃ©',      bg: 'bg-red-500/10',    text: 'text-red-400',    dot: 'bg-red-400' },
};

export default function ProAgendaPage() {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [metadata, setMetadata] = useState<any>({ employees: [], services: [], clients: [] });
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeEmployee, setActiveEmployee] = useState<string>('all');

  const [formData, setFormData] = useState({ clientId: '', serviceId: '', employeeId: '', startAt: '', time: '10:00' });

  const fetchData = async () => {
    try {
      const [apptRes, metaRes] = await Promise.all([fetch('/api/tenant/appointments'), fetch('/api/tenant/agenda/metadata')]);
      const [apptData, metaData] = await Promise.all([apptRes.json(), metaRes.json()]);
      if (apptData.success) setAppointments(apptData.appointments);
      if (metaData.success) setMetadata(metaData.data);
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger l'agenda.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dateTimeString = `${formData.startAt}T${formData.time}:00`;
      const res = await fetch('/api/tenant/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, startAt: new Date(dateTimeString).toISOString() })
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "âœ… RDV confirmÃ©", description: "Rendez-vous ajoutÃ© Ã  l'agenda." });
        setIsDialogOpen(false);
        fetchData();
      } else throw new Error(data.error);
    } catch {
      toast({ title: "Erreur", description: "Impossible de crÃ©er le RDV.", variant: "destructive" });
    }
  };

  const todayAppts = appointments.filter(a => new Date(a.startAt).toDateString() === new Date().toDateString());
  const pendingCount = appointments.filter(a => a.status === 'pending').length;

  const filtered = appointments.filter(a => {
    if (activeFilter !== 'all' && a.status !== activeFilter) return false;
    if (activeEmployee !== 'all' && a.employeeId !== activeEmployee) return false;
    return true;
  });

  const sortedFiltered = [...filtered].sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

  return (
    <div className="space-y-6 text-white max-w-4xl mx-auto">

      {/* â”€â”€ HEADER â”€â”€ */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-[#C8951E] to-[#8A5C0A] flex items-center justify-center">
              <CalendarIcon className="w-4 h-4 text-[#0F0A05]" />
            </div>
            <h1 className="text-2xl font-display font-black text-white tracking-tight">
              Agenda & <span className="bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] bg-clip-text text-transparent">RÃ©servations</span>
            </h1>
          </div>
          <p className="text-white/40 text-xs ml-10">{appointments.length} RDV total Â· {todayAppts.length} aujourd'hui Â· {pendingCount} en attente</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm text-[#0F0A05] cursor-pointer shrink-0"
              style={{ background: 'linear-gradient(135deg, #F3E5AB, #C8951E)', boxShadow: '0 4px 20px rgba(200,149,30,0.3)' }}
            >
              <Plus className="w-4 h-4" /> Nouveau Rendez-vous
            </motion.button>
          </DialogTrigger>
          <DialogContent className="bg-[#0F0A05] border border-[#C8951E]/20 text-white rounded-3xl" style={{ boxShadow: '0 32px 64px rgba(0,0,0,0.7)' }}>
            <div className="h-0.5 bg-gradient-to-r from-transparent via-[#C8951E] to-transparent -mt-[1px] mx-6 rounded-full" />
            <DialogHeader className="pt-2">
              <DialogTitle className="font-display text-xl text-white flex items-center gap-2">
                <span className="text-2xl">ðŸ“…</span> Nouveau Rendez-vous
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateAppointment} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label className="text-white/50 text-xs">Cliente</Label>
                <Select value={formData.clientId} onValueChange={(v) => setFormData({ ...formData, clientId: v })} required>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl"><SelectValue placeholder="Choisir une cliente..." /></SelectTrigger>
                  <SelectContent className="bg-[#1A1410] border-[#362A21] text-white max-h-52">
                    {metadata.clients.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.firstName} {c.lastName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/50 text-xs">Prestation</Label>
                <Select value={formData.serviceId} onValueChange={(v) => setFormData({ ...formData, serviceId: v })} required>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl"><SelectValue placeholder="Choisir un service..." /></SelectTrigger>
                  <SelectContent className="bg-[#1A1410] border-[#362A21] text-white max-h-52">
                    {metadata.services.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name} Â· {s.price?.toLocaleString()} FCFA</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-white/50 text-xs">Praticienne</Label>
                <Select value={formData.employeeId} onValueChange={(v) => setFormData({ ...formData, employeeId: v })} required>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl"><SelectValue placeholder="Choisir une praticienne..." /></SelectTrigger>
                  <SelectContent className="bg-[#1A1410] border-[#362A21] text-white">
                    {metadata.employees.map((e: any) => <SelectItem key={e.id} value={e.id}>{e.firstName} {e.lastName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-white/50 text-xs">Date</Label>
                  <Input type="date" required className="bg-white/5 border-white/10 text-white rounded-xl h-11 focus:border-[#C8951E]" value={formData.startAt} onChange={(e) => setFormData({ ...formData, startAt: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/50 text-xs">Heure</Label>
                  <Input type="time" required className="bg-white/5 border-white/10 text-white rounded-xl h-11 focus:border-[#C8951E]" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
                </div>
              </div>
              <DialogFooter className="mt-4 flex gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-white/40 hover:text-white rounded-xl">Annuler</Button>
                <motion.button whileTap={{ scale: 0.97 }} type="submit" className="flex-1 h-11 rounded-xl font-bold text-sm text-[#0F0A05] cursor-pointer" style={{ background: 'linear-gradient(135deg, #F3E5AB, #C8951E)' }}>
                  âœ… Confirmer le RDV
                </motion.button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* â”€â”€ STATUS FILTER PILLS & TABS â”€â”€ */}
      <div className="space-y-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex gap-2 flex-wrap">
          {[
            { key: 'all', label: 'Tous', count: appointments.length },
            { key: 'pending', label: 'En attente', count: appointments.filter(a => a.status === 'pending').length },
            { key: 'confirmed', label: 'ConfirmÃ©s', count: appointments.filter(a => a.status === 'confirmed').length },
            { key: 'in_progress', label: 'En Soin', count: appointments.filter(a => a.status === 'in_progress').length },
            { key: 'completed', label: 'TerminÃ©s', count: appointments.filter(a => a.status === 'completed').length },
            { key: 'cancelled', label: 'AnnulÃ©s', count: appointments.filter(a => a.status === 'cancelled').length },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                activeFilter === f.key
                  ? 'bg-[#C8951E] text-[#0F0A05]'
                  : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              {f.label}
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${activeFilter === f.key ? 'bg-[#0F0A05]/20' : 'bg-white/10'}`}>{f.count}</span>
            </button>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }} className="flex gap-4 overflow-x-auto pb-2 border-b border-white/5 no-scrollbar">
          <button
            onClick={() => setActiveEmployee('all')}
            className={`text-[11px] font-bold pb-2 border-b-2 whitespace-nowrap transition-colors ${
              activeEmployee === 'all' ? 'border-[#C8951E] text-[#C8951E]' : 'border-transparent text-white/40 hover:text-white'
            }`}
          >
            Toutes les praticiennes
          </button>
          {metadata.employees.map((e: any) => (
            <button
              key={e.id}
              onClick={() => setActiveEmployee(e.id)}
              className={`text-[11px] font-bold pb-2 border-b-2 whitespace-nowrap transition-colors ${
                activeEmployee === e.id ? 'border-[#C8951E] text-[#C8951E]' : 'border-transparent text-white/40 hover:text-white'
              }`}
            >
              {e.firstName} {e.lastName}
            </button>
          ))}
        </motion.div>
      </div>

      {/* â”€â”€ APPOINTMENTS LIST â”€â”€ */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="rounded-3xl border border-white/5 bg-[#1A1410] overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin h-6 w-6 border-2 border-[#C8951E] border-t-transparent rounded-full" />
            </div>
          ) : sortedFiltered.length === 0 ? (
            <div className="text-center py-16 text-white/20 text-xs">
              <div className="text-4xl mb-3">ðŸ“…</div>
              Aucun rendez-vous dans cette catÃ©gorie.
            </div>
          ) : (
            <div className="divide-y divide-white/5 relative">
              {sortedFiltered.map((appt, i) => {
                const s = STATUS_CONFIG[appt.status] || STATUS_CONFIG.pending;
                const apptDate = new Date(appt.startAt);
                const isToday = apptDate.toDateString() === new Date().toDateString();
                
                const now = new Date();
                const isCurrent = isToday && now >= apptDate && now <= new Date(appt.endAt || apptDate.getTime() + 60 * 60 * 1000);

                return (
                  <motion.div
                    key={appt.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`relative flex items-center gap-4 px-5 py-4 transition-colors ${isCurrent ? 'bg-[#C8951E]/5' : 'hover:bg-white/[0.02]'}`}
                  >
                    {/* Current Time Line Indicator */}
                    {isCurrent && (
                      <div className="absolute left-0 top-1/2 w-full h-[1px] bg-gradient-to-r from-[#C8951E] to-transparent pointer-events-none z-10 flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C8951E] shadow-[0_0_8px_#C8951E] animate-pulse ml-0.5" />
                        <span className="text-[#C8951E] text-[8px] font-bold font-mono ml-1 mt-3">MAINTENANT</span>
                      </div>
                    )}

                    {/* Date block */}
                    <div className={`flex flex-col items-center justify-center w-14 h-16 rounded-2xl shrink-0 border ${isToday ? 'border-[#C8951E]/40 bg-[#C8951E]/10' : 'border-white/10 bg-white/5'}`}>
                      <span className={`text-[9px] uppercase font-bold tracking-wider ${isToday ? 'text-[#C8951E]' : 'text-white/40'}`}>
                        {format(apptDate, 'MMM', { locale: fr })}
                      </span>
                      <span className={`text-xl font-display font-black ${isToday ? 'text-[#C8951E]' : 'text-white'}`}>
                        {format(apptDate, 'dd')}
                      </span>
                      {isToday && <span className="text-[8px] text-[#C8951E] font-bold">AUJOURD'HUI</span>}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white font-mono">
                          {format(apptDate, 'HH:mm')} â€“ {appt.endAt ? format(new Date(appt.endAt), 'HH:mm') : 'â€”'}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>
                          <span className={`w-1 h-1 rounded-full ${s.dot}`} />
                          {s.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-white/70">
                        <Scissors className="w-3 h-3 text-[#C8951E]" />
                        <span className="font-semibold">{appt.service?.name}</span>
                        {appt.service?.durationMin && <span className="text-white/30">({appt.service.durationMin} min)</span>}
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-white/40">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" />{appt.client?.firstName} {appt.client?.lastName}</span>
                        {appt.employee && <span className="flex items-center gap-1">âœ‚ï¸ {appt.employee.firstName}</span>}
                      </div>
                    </div>

                    {/* Amount + actions */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="font-display font-black text-white text-sm">{appt.amount?.toLocaleString('fr-FR')} <span className="text-[9px] text-white/30 font-mono">FCFA</span></span>
                      
                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        {/* WhatsApp 2H Pre-Appointment Reminder Button */}
                        <button
                          onClick={() => {
                            const clientPhone = (appt.client?.phone || '+22507000000').replace(/\D/g, '');
                            const msg = encodeURIComponent(`Bonjour ${appt.client?.firstName || 'ChÃ¨re Cliente'}, votre rendez-vous chez Institut BeautÃ© KÃ¨nÃ¨ pour "${appt.service?.name}" est prÃ©vu Ã  ${format(apptDate, 'HH:mm')}. Merci de rÃ©pondre OUI pour me confirmer votre prÃ©sence ! ðŸŒ¿`);
                            if (typeof window !== 'undefined') {
                              window.open(`https://wa.me/${clientPhone}?text=${msg}`, '_blank');
                              toast({ title: "ðŸ“² Rappel WhatsApp EnvoyÃ© !", description: `Message de confirmation 2h avant transmis Ã  ${appt.client?.firstName || 'la cliente'}.` });
                            }
                          }}
                          className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2 py-1 rounded-xl hover:bg-emerald-500/30 transition cursor-pointer shadow-sm"
                          title="Envoyer un rappel de confirmation WhatsApp 2h avant le RDV"
                        >
                          <span>ðŸ“² Rappel 2H</span>
                        </button>

                        {appt.status === 'pending' && (
                          <>
                            <button className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-xl hover:bg-emerald-500/20 transition cursor-pointer">
                              <Check className="w-3 h-3" /> OK
                            </button>
                            <button className="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded-xl hover:bg-red-500/20 transition cursor-pointer">
                              <X className="w-3 h-3" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
