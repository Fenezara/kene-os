'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Plus, MessageSquare, Sparkles, Search, TrendingUp, Users, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

const CHANNEL_META: Record<string, { color: string; bg: string; icon: string }> = {
  WhatsApp: { color: '#25D366', bg: 'bg-emerald-500/10 text-emerald-400', icon: 'ðŸ’¬' },
  SMS:      { color: '#4E9FD1', bg: 'bg-blue-500/10 text-blue-400',    icon: 'ðŸ“±' },
};
const SEGMENT_META: Record<string, { label: string; color: string; emoji: string }> = {
  inactifs: { label: 'Clients Inactifs +30j', color: 'text-orange-400', emoji: 'ðŸ˜´' },
  vip:      { label: 'Clients VIP / FidÃ¨les',  color: 'text-[#C8951E]',  emoji: 'ðŸ‘‘' },
  tous:     { label: 'Toute la base',          color: 'text-white/70',   emoji: 'ðŸŒ' },
};

const WHATSAPP_TEMPLATES = [
  { id: 'relance', label: 'Relance RDV', msg: 'Bonjour {prenom} ! Ã‡a fait un moment qu\'on ne vous a pas vue au salon KÃ¨nÃ¨. Prenez soin de vous et rÃ©servez votre prochain instant beautÃ© : https://kene.app/rdv' },
  { id: 'karite', label: 'Promotion Soin KaritÃ©', msg: 'Bonjour {prenom} ! Votre peau mÃ©rite le meilleur ðŸŒ¿. Profitez de -20% sur votre prochain Soin KaritÃ© ce jeudi au salon KÃ¨nÃ¨. RÃ©servez ici : https://kene.app/rdv' },
  { id: 'anniv', label: 'Anniversaire Cliente', msg: 'Joyeux anniversaire {prenom} ðŸŽ‚ ! Le salon KÃ¨nÃ¨ vous offre un soin visage Ã©clat pour cÃ©lÃ©brer cette journÃ©e spÃ©ciale. Venez en profiter ce mois-ci !' },
  { id: 'parrainage', label: 'Programme Parrainage', msg: 'Coucou {prenom} âœ¨ ! Parrainez une amie au salon KÃ¨nÃ¨ et recevez chacune -15% sur votre prochaine prestation. Partagez votre code : {nom}15 !' }
];

// WhatsApp preview bubble
function WaPreview({ message, channel }: { message: string; channel: string }) {
  const preview = message.replace('{prenom}', 'Awa').replace('{nom}', 'Diallo');
  const channelMeta = CHANNEL_META[channel] || CHANNEL_META.WhatsApp;
  return (
    <div className="bg-[#0F0A05] rounded-2xl p-4 border border-white/5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm">{channelMeta.icon}</span>
        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">AperÃ§u Â· {channel}</span>
        <div className="ml-auto flex gap-0.5">
          {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full" style={{ background: channelMeta.color, opacity: 0.3 + i * 0.25 }} />)}
        </div>
      </div>
      <div className="flex gap-2">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C8951E] to-[#8A3B14] flex items-center justify-center text-xs shrink-0">K</div>
        <div className="max-w-[85%] bg-white/8 rounded-2xl rounded-tl-sm px-3 py-2.5">
          <p className="text-[11px] text-white/80 leading-relaxed">{preview}</p>
          <div className="flex justify-end mt-1">
            <span className="text-[8px] text-white/20 font-mono">{new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} âœ“âœ“</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProMarketingPage() {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    channel: 'WhatsApp',
    targetSegment: 'inactifs',
    message: 'Bonjour {prenom} ! Votre peau mÃ©rite le meilleur ðŸŒ¿. Profitez de -20% sur votre prochain Soin KaritÃ© ce jeudi au salon KÃ¨nÃ¨. RÃ©servez ici : https://kene.app/rdv',
  });

  const fetchData = async () => {
    try {
      const res = await fetch('/api/tenant/marketing');
      const data = await res.json();
      if (data.success) { setCampaigns(data.campaigns); setStats(data.stats); }
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger les campagnes.", variant: "destructive" });
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSentCount(0);
    
    const totalDest = formData.targetSegment === 'vip' ? 28 : formData.targetSegment === 'inactifs' ? 45 : 120;
    
    for (let i = 0; i <= totalDest; i += Math.max(1, Math.floor(totalDest / 10))) {
      await new Promise(r => setTimeout(r, 150));
      setSentCount(Math.min(i, totalDest));
    }
    setSentCount(totalDest);

    try {
      const res = await fetch('/api/tenant/marketing', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "ðŸš€ Campagne envoyÃ©e !", description: `Messages transmis via ${formData.channel}.` });
        setIsDialogOpen(false);
        fetchData();
      } else throw new Error(data.error);
    } catch {
      toast({ title: "Erreur", description: "Impossible d'envoyer la campagne.", variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  const filtered = campaigns.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.targetSegment.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-white max-w-5xl mx-auto">

      {/* â”€â”€ HEADER â”€â”€ */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-display font-black text-white tracking-tight">
              Marketing <span className="bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] bg-clip-text text-transparent">WhatsApp & SMS</span>
            </h1>
          </div>
          <p className="text-white/40 text-xs ml-10">Relancez vos clientes inactives Â· Comblez les crÃ©neaux vides automatiquement</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm text-[#0F0A05] cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #F3E5AB, #C8951E)', boxShadow: '0 4px 20px rgba(200,149,30,0.3)' }}
            >
              <Zap className="w-4 h-4" /> CrÃ©er une Campagne
            </motion.button>
          </DialogTrigger>
          <DialogContent className="bg-[#0F0A05] border border-[#C8951E]/20 text-white rounded-3xl max-w-lg" style={{ boxShadow: '0 32px 64px rgba(0,0,0,0.7)' }}>
            <div className="h-0.5 bg-gradient-to-r from-transparent via-[#C8951E] to-transparent -mt-[1px] mx-6 rounded-full" />
            <DialogHeader className="pt-2">
              <DialogTitle className="font-display text-xl text-white flex items-center gap-2"><span className="text-2xl">ðŸ“£</span> Nouvelle campagne</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label className="text-white/50 text-xs">Nom de la campagne</Label>
                <Input required placeholder="ex: Relance Jeudi Creux -20%" className="bg-white/5 border-white/10 text-white rounded-xl focus:border-[#C8951E]" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-white/50 text-xs">Canal</Label>
                  <Select value={formData.channel} onValueChange={(v) => setFormData({ ...formData, channel: v })}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#1A1410] border-[#362A21] text-white">
                      <SelectItem value="WhatsApp">ðŸ’¬ WhatsApp Business</SelectItem>
                      <SelectItem value="SMS">ðŸ“± SMS Direct</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/50 text-xs">Segment</Label>
                  <Select value={formData.targetSegment} onValueChange={(v) => setFormData({ ...formData, targetSegment: v })}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#1A1410] border-[#362A21] text-white">
                      <SelectItem value="inactifs">ðŸ˜´ Inactifs +30j</SelectItem>
                      <SelectItem value="vip">ðŸ‘‘ VIP / FidÃ¨les</SelectItem>
                      <SelectItem value="tous">ðŸŒ Toute la base</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white/50 text-xs">ModÃ¨les Rapides</Label>
                <div className="flex gap-2 flex-wrap">
                  {WHATSAPP_TEMPLATES.map(t => (
                    <button
                      key={t.id} type="button"
                      onClick={() => setFormData({ ...formData, message: t.msg })}
                      className="text-[10px] bg-white/5 hover:bg-white/10 text-white/70 px-2 py-1.5 rounded-lg border border-white/10 transition"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-white/50 text-xs">Message Â· Variables : {'{prenom}'} {'{nom}'}</Label>
                  <span className="text-[9px] font-mono text-white/20">{formData.message.length} car.</span>
                </div>
                <Textarea
                  required rows={4}
                  className="bg-white/5 border-white/10 text-white text-xs rounded-xl focus:border-[#C8951E] resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              {/* Live Preview */}
              <WaPreview message={formData.message} channel={formData.channel} />

              <DialogFooter className="flex gap-2 pt-1">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSending} className="text-white/40 rounded-xl">Annuler</Button>
                <motion.button 
                  whileTap={!isSending ? { scale: 0.97 } : {}} 
                  type="submit" 
                  disabled={isSending}
                  className="flex-1 h-11 rounded-xl font-bold text-sm text-[#0F0A05] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80" 
                  style={{ background: 'linear-gradient(135deg, #F3E5AB, #C8951E)' }}
                >
                  {isSending ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-[#0F0A05] border-t-transparent rounded-full" />
                      Envoi en cours ({sentCount}/{formData.targetSegment === 'vip' ? 28 : formData.targetSegment === 'inactifs' ? 45 : 120})...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Lancer la Diffusion
                    </>
                  )}
                </motion.button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* â”€â”€ KPI HERO BAND â”€â”€ */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <div className="relative rounded-3xl overflow-hidden border border-[#25D366]/15 p-5" style={{ background: 'linear-gradient(135deg, #040D07 0%, #0A1F10 100%)' }}>
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#25D366] to-transparent" />
          <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-[#25D366] blur-3xl opacity-5" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Ouverture WhatsApp', value: stats?.averageOpenRate || '94.2%', icon: 'ðŸ“¬', color: '#25D366' },
              { label: 'Clients Inactifs',    value: `${stats?.inactiveClientsCount || 45}`, suffix: 'clients', icon: 'ðŸ˜´', color: '#F97316' },
              { label: 'Clientes VIP',        value: `${stats?.vipClientsCount || 28}`, suffix: 'VIP', icon: 'ðŸ‘‘', color: '#C8951E' },
              { label: 'Campagnes EnvoyÃ©es',  value: campaigns.length, suffix: 'total', icon: 'ðŸ“£', color: '#4E9FD1' },
            ].map((kpi, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl mb-1">{kpi.icon}</div>
                <div className="font-display font-black text-xl" style={{ color: kpi.color }}>{kpi.value}</div>
                <div className="text-[9px] text-white/30">{kpi.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* â”€â”€ ðŸ¤– KÃˆNÃˆ AUTOPILOT ENGINE â”€â”€ */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
        <div className="rounded-3xl border border-[#C8951E]/30 bg-gradient-to-br from-[#1A1410] via-[#241C16] to-[#0F0A05] p-5 shadow-2xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#FFD700] via-[#C8951E] to-[#D4AF37]" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pl-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-5 h-5 text-[var(--gold-kene)] animate-pulse" />
                <h3 className="font-display font-black text-lg text-white">KÃ¨nÃ¨ Autopilot Engine 1.0</h3>
                <span className="text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  â— Mode Autopilote Actif
                </span>
              </div>
              <p className="text-xs text-white/50">Automatisez la fidÃ©lisation, les rappels de RDV et la clÃ´ture comptable sans intervention humaine.</p>
            </div>

            <Button
              onClick={async () => {
                try {
                  toast({ title: "âš¡ Autopilote en cours...", description: "ExÃ©cution des tÃ¢ches automatisÃ©es..." });
                  const res = await fetch('/api/cron/autopilot', { method: 'POST' });
                  const json = await res.json();
                  if (json.success) {
                    toast({
                      title: "ðŸš€ Autopilote ExÃ©cutÃ© avec SuccÃ¨s !",
                      description: `${json.summary.remindersSent} rappels WhatsApp envoyÃ©s, ${json.summary.marketingOffersSent} offres transmises, caisse clÃ´turÃ©e (${json.summary.totalRevenueClosed}).`,
                    });
                  }
                } catch (e) {
                  toast({ title: "Erreur Autopilote", description: "Ã‰chec de l'exÃ©cution automatique.", variant: "destructive" });
                }
              }}
              className="bg-gradient-to-r from-[var(--gold-kene)] to-[#D4AF37] text-black font-bold text-xs rounded-xl shadow-xl hover:scale-105 transition h-10 px-4 shrink-0 cursor-pointer"
            >
              <Zap className="w-4 h-4 mr-1.5" /> ExÃ©cuter l'Autopilote Maintenant
            </Button>
          </div>

          {/* Autopilot Modules Toggles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {[
              { title: 'ðŸ“² Rappels RDV WhatsApp', desc: 'Rappels automatiques 24h & 2h avant le soin', status: 'Actif (24/7)', color: 'border-emerald-500/30 text-emerald-400' },
              { title: 'ðŸŽ‚ Offres & Relances 45j', desc: 'Anniversaires & relance des clientes inactives', status: 'Actif (9h00)', color: 'border-amber-500/30 text-amber-400' },
              { title: 'ðŸ“‘ ClÃ´ture Caisse SYSCOHADA', desc: 'Rapport quotidien & Ã©critures de caisse Ã  21h', status: 'Actif (21h00)', color: 'border-blue-500/30 text-blue-400' },
            ].map((mod, idx) => (
              <div key={idx} className="bg-[#140E09] border border-white/10 rounded-2xl p-3 space-y-1 relative">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white leading-tight">{mod.title}</span>
                  <span className={`text-[9px] font-mono font-bold border px-1.5 py-0.5 rounded-md ${mod.color}`}>
                    {mod.status}
                  </span>
                </div>
                <p className="text-[10px] text-white/40 leading-tight">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="rounded-3xl border border-white/5 bg-[#1A1410] overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-5 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-[#25D366]/10 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-[#25D366]" />
              </div>
              <span className="font-display font-bold text-sm text-white">Historique des Campagnes</span>
              <span className="text-[10px] bg-white/5 text-white/30 px-2 py-0.5 rounded-full font-mono">{campaigns.length}</span>
            </div>
            <div className="relative w-full md:w-52">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-white/30" />
              <Input placeholder="Rechercher..." className="pl-8 bg-white/5 border-white/10 text-white text-xs h-9 rounded-xl placeholder:text-white/20 focus:border-[#C8951E]" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><div className="animate-spin h-6 w-6 border-2 border-[#C8951E] border-t-transparent rounded-full" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-white/20 text-xs"><div className="text-4xl mb-3">ðŸ“£</div>Aucune campagne envoyÃ©e.</div>
          ) : (
            <div className="divide-y divide-white/5">
              {filtered.map((camp, i) => {
                const ch = CHANNEL_META[camp.channel] || CHANNEL_META.WhatsApp;
                const seg = SEGMENT_META[camp.targetSegment] || SEGMENT_META.tous;
                return (
                  <motion.div
                    key={camp.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-lg shrink-0 bg-white/5">{ch.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white">{camp.title}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${ch.bg}`}>{camp.channel}</span>
                        <span className={`text-[9px] font-semibold ${seg.color}`}>{seg.emoji} {seg.label}</span>
                      </div>
                      <div className="text-[10px] text-white/30 mt-0.5 font-mono">{format(new Date(camp.sentAt), 'dd/MM/yyyy HH:mm')}</div>
                    </div>
                    <div className="text-right shrink-0 space-y-0.5">
                      <div className="font-display font-black text-white text-sm">{camp.audienceSize} <span className="text-[9px] text-white/30">dest.</span></div>
                      <div className="text-[10px] font-bold text-[#C8951E]">{camp.conversionRate} conv.</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
