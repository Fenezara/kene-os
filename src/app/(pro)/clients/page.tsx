'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Search, UserCircle, PenTool, ChevronRight, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
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
import { AvatarUpload } from '@/components/AvatarUpload';
const FITZPATRICK_COLORS: Record<string, string> = {
  I: '#FDDBB4', II: '#F5CBA7', III: '#E59866', IV: '#CA9B5C', V: '#A0522D', VI: '#6B3A2A'
};
const SKIN_TYPE_EMOJI: Record<string, string> = {
  grasse: '💧', seche: '🌵', mixte: '🌗', normale: '✨', sensible: '🌸'
};

export default function ProClientsPage() {
  const { toast } = useToast();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getLoyaltyTier = (clientId: string) => {
    // Mock spent based on ID length or char codes
    const spent = clientId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * 1500;
    if (spent > 200000) return { name: 'Platine', icon: '💎', color: '#E5E4E2' };
    if (spent > 100000) return { name: 'Or', icon: '🥇', color: '#FFD700' };
    if (spent > 50000) return { name: 'Argent', icon: '🥈', color: '#C0C0C0' };
    return { name: 'Bronze', icon: '🥉', color: '#CD7F32' };
  };

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    skinType: 'normale', fitzpatrickType: 'V', allergies: '', avatar: ''
  });

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/tenant/clients');
      const data = await res.json();
      if (data.success) setClients(data.clients);
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger les clients.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClients(); }, []);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        allergies: formData.allergies ? JSON.stringify(formData.allergies.split(',').map(a => a.trim())) : '[]'
      };
      const res = await fetch('/api/tenant/clients', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "✅ Profil créé", description: "Nouvelle cliente enregistrée dans le CRM." });
        setIsDialogOpen(false);
        setFormData({ firstName: '', lastName: '', phone: '', email: '', skinType: 'normale', fitzpatrickType: 'V', allergies: '', avatar: '' });
        fetchClients();
      } else throw new Error(data.error);
    } catch {
      toast({ title: "Erreur", description: "Impossible de créer le client.", variant: "destructive" });
    }
  };

  const filtered = clients.filter(c =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="space-y-6 text-white max-w-5xl mx-auto">

      {/* ── HEADER ── */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-[#4E9FD1] to-[#1E3A5F] flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-display font-black text-white tracking-tight">
              Base <span className="bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] bg-clip-text text-transparent">Clientes CRM</span>
            </h1>
          </div>
          <p className="text-white/40 text-xs ml-10">{clients.length} clientes enregistrées · Profils dermatologiques OHADA</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <a href="/clients/signature">
            <Button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 cursor-pointer h-auto">
              <PenTool className="w-3.5 h-3.5" /> Consentement Tactile
            </Button>
          </a>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm text-[#0F0A05] cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #F3E5AB, #C8951E)', boxShadow: '0 4px 20px rgba(200,149,30,0.3)' }}
              >
                <Plus className="w-4 h-4" /> Nouvelle Cliente
              </motion.button>
            </DialogTrigger>
            <DialogContent className="bg-[#0F0A05] border border-[#C8951E]/20 text-white rounded-3xl max-w-md" style={{ boxShadow: '0 32px 64px rgba(0,0,0,0.7)' }}>
              <div className="h-0.5 bg-gradient-to-r from-transparent via-[#C8951E] to-transparent -mt-[1px] mx-6 rounded-full" />
              <DialogHeader className="pt-2">
                <DialogTitle className="font-display text-xl text-white flex items-center gap-2">
                  <span className="text-2xl">👤</span> Nouveau profil cliente
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateClient} className="space-y-4 mt-2">
                <div className="flex justify-center mb-4">
                  <AvatarUpload
                    value={formData.avatar}
                    initials={(formData.firstName?.[0] || '') + (formData.lastName?.[0] || '') || '??'}
                    onChange={(base64) => setFormData({ ...formData, avatar: base64 })}
                    size={80}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-white/50 text-xs">Prénom</Label>
                    <Input required className="bg-white/5 border-white/10 text-white rounded-xl focus:border-[#C8951E]" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white/50 text-xs">Nom</Label>
                    <Input required className="bg-white/5 border-white/10 text-white rounded-xl focus:border-[#C8951E]" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-white/50 text-xs">Téléphone</Label>
                    <Input required className="bg-white/5 border-white/10 text-white rounded-xl focus:border-[#C8951E]" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white/50 text-xs">Email (optionnel)</Label>
                    <Input type="email" className="bg-white/5 border-white/10 text-white rounded-xl focus:border-[#C8951E]" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                </div>

                <div className="bg-[#C8951E]/5 border border-[#C8951E]/15 rounded-2xl p-4 space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#C8951E]">Profil Dermatologique</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-white/50 text-xs">Type de peau</Label>
                      <Select value={formData.skinType} onValueChange={(v) => setFormData({ ...formData, skinType: v })}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-[#1A1410] border-[#362A21] text-white">
                          {['grasse', 'seche', 'mixte', 'normale', 'sensible'].map(t => <SelectItem key={t} value={t} className="capitalize">{SKIN_TYPE_EMOJI[t]} {t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/50 text-xs">Phototype (Fitzpatrick)</Label>
                      <Select value={formData.fitzpatrickType} onValueChange={(v) => setFormData({ ...formData, fitzpatrickType: v })}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-[#1A1410] border-[#362A21] text-white">
                          {['I', 'II', 'III', 'IV', 'V', 'VI'].map(t => (
                            <SelectItem key={t} value={t}>
                              <span className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full inline-block" style={{ background: FITZPATRICK_COLORS[t] }} />
                                Type {t}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white/50 text-xs">Allergies connues (séparées par virgules)</Label>
                    <Input className="bg-white/5 border-white/10 text-white rounded-xl focus:border-[#C8951E]" placeholder="ex: Noix, Latex, Parfums..." value={formData.allergies} onChange={(e) => setFormData({ ...formData, allergies: e.target.value })} />
                  </div>
                </div>

                <DialogFooter className="flex gap-2">
                  <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-white/40 rounded-xl">Annuler</Button>
                  <motion.button whileTap={{ scale: 0.97 }} type="submit" className="flex-1 h-11 rounded-xl font-bold text-sm text-[#0F0A05] cursor-pointer" style={{ background: 'linear-gradient(135deg, #F3E5AB, #C8951E)' }}>
                    Enregistrer le profil
                  </motion.button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* ── SEARCH BAR + STATS ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-white/30" />
          <Input
            placeholder="Rechercher par nom, téléphone..."
            className="pl-10 bg-[#1A1410] border-white/10 text-white rounded-2xl h-11 placeholder:text-white/20 focus:border-[#C8951E]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {[
            { label: 'Toutes clientes', value: clients.length, color: '#C8951E' },
            { label: 'Phototype V-VI', value: clients.filter(c => ['V', 'VI'].includes(c.fitzpatrickType)).length, color: '#8A3B14' },
          ].map((s, i) => (
            <div key={i} className="px-4 py-2 rounded-2xl bg-[#1A1410] border border-white/5 text-center">
              <div className="font-display font-black text-lg" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[9px] text-white/30">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── CLIENT CARDS GRID ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin h-6 w-6 border-2 border-[#C8951E] border-t-transparent rounded-full" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-white/20 text-xs">
            <div className="text-4xl mb-3">👥</div>
            Aucune cliente trouvée.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((client, i) => {
              const allergies = JSON.parse(client.allergies || '[]');
              const fitzColor = FITZPATRICK_COLORS[client.fitzpatrickType] || '#A0522D';
              const skinEmoji = SKIN_TYPE_EMOJI[client.skinType] || '✨';
              return (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative rounded-3xl border border-white/5 bg-[#1A1410] hover:border-[#C8951E]/30 transition-all duration-300 overflow-hidden"
                >
                  <div className="p-5 cursor-pointer" onClick={() => setExpandedId(expandedId === client.id ? null : client.id)}>
                    {/* Phototype color accent top line */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-3xl opacity-60" style={{ background: fitzColor }} />
                  {/* Hover glow */}
                  <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity" style={{ background: fitzColor }} />

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar with phototype ring */}
                      <div className="relative">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center font-display font-black text-base text-[#0F0A05] overflow-hidden"
                          style={{ background: `linear-gradient(135deg, ${fitzColor}, ${fitzColor}99)` }}
                        >
                          {client.avatar ? (
                            <img src={client.avatar} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            <>{client.firstName?.charAt(0)}{client.lastName?.charAt(0)}</>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="font-display font-bold text-sm text-white">{client.firstName} {client.lastName}</div>
                        <div className="text-[10px] text-white/40 font-mono">{client.phone}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {(() => {
                        const tier = getLoyaltyTier(client.id);
                        return (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10" style={{ color: tier.color }}>
                            {tier.icon} {tier.name}
                          </span>
                        );
                      })()}
                      {expandedId === client.id ? (
                        <ChevronUp className="w-4 h-4 text-[#C8951E]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-white/20 group-hover:text-[#C8951E] transition-colors" />
                      )}
                    </div>
                  </div>

                  {/* Skin profile row */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/5 text-white/60 capitalize">
                      {skinEmoji} Peau {client.skinType}
                    </span>
                    <span
                      className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: `${fitzColor}20`, color: fitzColor }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ background: fitzColor }} />
                      Type {client.fitzpatrickType}
                    </span>
                  </div>

                  {/* Allergies */}
                  {allergies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {allergies.slice(0, 3).map((a: string, idx: number) => (
                        <span key={idx} className="text-[9px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 font-bold">⚠️ {a}</span>
                      ))}
                      {allergies.length > 3 && <span className="text-[9px] text-white/30">+{allergies.length - 3}</span>}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[9px] text-white/20 font-mono border-t border-white/5 pt-3">
                    <span>Inscrite le {format(new Date(client.createdAt), 'dd/MM/yyyy')}</span>
                    <a
                      href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2 py-1 bg-[#25D366]/10 text-[#25D366] rounded-full hover:bg-[#25D366]/20 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MessageCircle className="w-3 h-3" /> WhatsApp
                    </a>
                  </div>
                  </div>

                  {/* Expandable History */}
                  {expandedId === client.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="bg-[#0A0603] p-4 border-t border-white/5 text-xs text-white/60 space-y-3"
                    >
                      <h4 className="font-bold text-[#C8951E] text-[10px] uppercase tracking-widest flex items-center justify-between">
                        <span>Dossier Dermo-Clinique & Historique</span>
                        <a 
                          href="/diagnostic/results/demo-diagnosis-01" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:underline flex items-center gap-1 font-sans"
                        >
                          🔬 Voir Bilan Diagnostic IA 360°
                        </a>
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span>Dernier soin: Hydratation Karité & Massage Baobab</span>
                          <span className="font-mono text-white/30">Il y a 2 sem.</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span>Motif Consultation: Soin Dermo-Cosmétique & Hyperpigmentation</span>
                          <span className="font-mono text-emerald-400">Confirmé</span>
                        </div>
                        <div className="pt-1 bg-white/5 p-2.5 rounded-xl border border-white/5 space-y-2">
                          <span className="text-[#C8951E] font-bold block">Prescription & Recommandations Praticienne :</span>
                          <p className="text-[11px] text-white/70 leading-relaxed font-sans">
                            Phototype {client.fitzpatrickType} · Tendance hyperpigmentation (PIH). Appliquer 3 gouttes de sérum Niacinamide & Baobab le soir. Écran solaire minéral SPF 50 obligatoire.
                          </p>
                        </div>

                        {/* --- GALERIE AVANT / APRÈS & ÉVOLUTION DU TEINT --- */}
                        <div className="pt-2 border-t border-white/5 space-y-2.5">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-[#C8951E] uppercase tracking-wider font-display flex items-center gap-1">
                              📸 Évolution du Teint & Traitement (Avant / Après)
                            </span>
                            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                              Éclat +42% · Taches -65%
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {/* Photo J-0 (Avant) */}
                            <div className="bg-[#1A1410] border border-white/10 rounded-xl p-2 text-center space-y-1 relative overflow-hidden">
                              <span className="absolute top-1 left-1 text-[8px] font-bold bg-black/80 text-[#C8951E] px-1.5 py-0.5 rounded">
                                J-0 (Avant)
                              </span>
                              <div className="w-full h-24 rounded-lg bg-gradient-to-br from-[#362A21] to-[#1A1410] flex items-center justify-center border border-white/5">
                                <div className="text-center space-y-0.5">
                                  <span className="text-xl">🔍</span>
                                  <p className="text-[9px] text-white/50 font-sans">Taches PIH Marquées</p>
                                </div>
                              </div>
                              <p className="text-[9px] text-white/40 font-mono">15/06/2026 · Initial</p>
                            </div>

                            {/* Photo J-30 (Après) */}
                            <div className="bg-[#1A1410] border border-emerald-500/30 rounded-xl p-2 text-center space-y-1 relative overflow-hidden">
                              <span className="absolute top-1 left-1 text-[8px] font-bold bg-emerald-500 text-[#0F0A05] px-1.5 py-0.5 rounded font-display">
                                J-30 (Après)
                              </span>
                              <div className="w-full h-24 rounded-lg bg-gradient-to-br from-[#241C16] to-[#0A0603] flex items-center justify-center border border-emerald-500/20">
                                <div className="text-center space-y-0.5">
                                  <span className="text-xl">✨</span>
                                  <p className="text-[9px] text-emerald-400 font-bold font-display">Teint Nourri & Unifié</p>
                                </div>
                              </div>
                              <p className="text-[9px] text-emerald-400/80 font-mono">15/07/2026 · Post-Soin</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
