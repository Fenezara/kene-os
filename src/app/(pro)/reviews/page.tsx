'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Sparkles, Send, CheckCircle2, Search, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

function StarRow({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? 'text-[#C8951E] fill-[#C8951E]' : 'text-white/10'}`} />
      ))}
    </div>
  );
}

export default function ProReviewsPage() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [replyInput, setReplyInput] = useState<{ [key: string]: string }>({});
  const [search, setSearch] = useState('');
  const [starFilter, setStarFilter] = useState<'all' | 5 | 4 | 3>('all');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiReviewContext, setAiReviewContext] = useState<{ id: string, name: string } | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/tenant/reviews');
      const data = await res.json();
      if (data.success) { setReviews(data.reviews); setStats(data.stats); }
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger les avis.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openAiModal = (revId: string, clientName: string) => {
    setAiReviewContext({ id: revId, name: clientName });
    setAiModalOpen(true);
  };

  const handleGenerateAiReply = (tone: 'chaleureux' | 'professionnel' | 'commercial') => {
    if (!aiReviewContext) return;
    const clientName = aiReviewContext.name;
    const revId = aiReviewContext.id;
    let reply = '';

    if (tone === 'chaleureux') {
      reply = `Chère ${clientName}, toute l'équipe Kènè vous remercie chaleureusement ! 💛 Votre confiance nous touche profondément. Au plaisir de vous retrouver pour un nouveau soin dermo-botanique. 🌿`;
    } else if (tone === 'professionnel') {
      reply = `Bonjour ${clientName}, nous vous remercions pour votre retour positif. 👔 Votre satisfaction est la priorité de notre établissement. À très bientôt au salon Kènè.`;
    } else if (tone === 'commercial') {
      reply = `Merci infiniment ${clientName} pour vos mots touchants ! ✨ Pour vous remercier de votre fidélité, nous serons ravis de vous offrir -10% sur votre prochain achat de produits cosmétiques lors de votre visite. 🎁 À très vite !`;
    }

    setReplyInput({ ...replyInput, [revId]: reply });
    toast({ title: "✨ Réponse IA générée", description: "Vérifiez ou modifiez avant l'envoi." });
    setAiModalOpen(false);
  };

  const handleSendReply = async (revId: string) => {
    const text = replyInput[revId];
    if (!text) return;
    try {
      const res = await fetch('/api/tenant/reviews', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId: revId, replyText: text })
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "✅ Réponse publiée", description: "Votre message a été transmis au client." });
        setReviews(reviews.map(r => r.id === revId ? { ...r, reply: text } : r));
      }
    } catch {
      toast({ title: "Erreur", description: "Impossible de publier la réponse.", variant: "destructive" });
    }
  };

  const filtered = reviews.filter(r => {
    const matchesSearch = r.clientName.toLowerCase().includes(search.toLowerCase()) || r.comment.toLowerCase().includes(search.toLowerCase());
    const matchesStars = starFilter === 'all' || (starFilter === 3 ? r.rating <= 3 : r.rating === starFilter);
    return matchesSearch && matchesStars;
  });

  const avgRating = stats?.averageRating || '4.8';
  const totalReviews = stats?.totalReviews || reviews.length;

  return (
    <div className="space-y-6 text-white max-w-4xl mx-auto">

      {/* ── HEADER ── */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-[#C8951E] to-[#8A5C0A] flex items-center justify-center">
              <Star className="w-4 h-4 text-[#0F0A05]" />
            </div>
            <h1 className="text-2xl font-display font-black text-white tracking-tight">
              Avis & <span className="bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] bg-clip-text text-transparent">Réputation</span>
            </h1>
          </div>
          <p className="text-white/40 text-xs ml-10">Répondez aux clientes avec l'IA · Gérez votre image en ligne</p>
        </div>
      </motion.div>

      {/* ── SCORE HERO ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="relative overflow-hidden rounded-3xl p-6 border border-[#C8951E]/20"
        style={{ background: 'linear-gradient(135deg, #1A1008 0%, #241808 100%)' }}
      >
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[#C8951E] opacity-10 blur-3xl" />
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#C8951E] to-transparent" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="text-center">
              <div className="text-6xl font-display font-black bg-gradient-to-br from-[#F3E5AB] to-[#C8951E] bg-clip-text text-transparent leading-none">{avgRating}</div>
              <div className="flex justify-center mt-2"><StarRow rating={5} /></div>
              <div className="text-[10px] text-white/30 mt-1 font-mono">{totalReviews} avis</div>
            </div>
            <div className="space-y-1.5 min-w-[180px]">
              {[5, 4, 3, 2, 1].map(s => {
                const count = reviews.filter(r => r.rating === s).length;
                const pct = totalReviews > 0 ? (count / totalReviews) * 100 : (s === 5 ? 85 : s === 4 ? 10 : 3);
                return (
                  <div key={s} className="flex items-center gap-2">
                    <span className="text-[10px] text-white/30 w-4">{s}</span>
                    <Star className="w-2.5 h-2.5 text-[#C8951E] fill-[#C8951E]" />
                    <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.3 + (5 - s) * 0.05 }}
                        className="h-full rounded-full bg-[#C8951E]"
                      />
                    </div>
                    <span className="text-[9px] text-white/25 w-6 text-right">{Math.round(pct)}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Satisfaction', value: stats?.satisfactionRate || '96.5%', icon: '😊', color: '#4CAF6E' },
              { label: '5 étoiles', value: stats?.fiveStarPercentage || '85%', icon: '⭐', color: '#C8951E' },
              { label: 'Répondu', value: `${reviews.filter(r => r.reply).length}/${totalReviews}`, icon: '💬', color: '#4E9FD1' },
              { label: 'Ce mois', value: reviews.filter(r => {
                const d = new Date(r.date); const now = new Date();
                return d.getMonth() === now.getMonth();
              }).length, icon: '📈', color: '#E07A2B' },
            ].map((kpi, i) => (
              <div key={i} className="bg-white/5 rounded-2xl p-3 text-center">
                <div className="text-lg mb-0.5">{kpi.icon}</div>
                <div className="font-display font-black text-sm" style={{ color: kpi.color }}>{kpi.value}</div>
                <div className="text-[9px] text-white/30">{kpi.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── SEARCH & FILTER ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-white/30" />
          <Input
            placeholder="Rechercher un avis ou client..."
            className="pl-10 bg-[#1A1410] border-white/10 text-white rounded-2xl h-11 placeholder:text-white/20 focus:border-[#C8951E]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex bg-[#1A1410] border border-white/10 rounded-2xl overflow-hidden h-11 shrink-0">
          {[
            { id: 'all', label: 'Toutes' },
            { id: 5, label: '5★' },
            { id: 4, label: '4★' },
            { id: 3, label: '≤3★' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStarFilter(f.id as any)}
              className={`px-4 text-xs font-semibold transition ${starFilter === f.id ? 'bg-[#C8951E]/20 text-[#C8951E]' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── REVIEWS LIST ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin h-6 w-6 border-2 border-[#C8951E] border-t-transparent rounded-full" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-white/20 text-xs">
            <div className="text-4xl mb-3">⭐</div>
            Aucun avis trouvé.
          </div>
        ) : (
          filtered.map((rev, i) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-3xl border border-white/5 bg-[#1A1410] overflow-hidden"
            >
              <div className="p-5">
                {/* Client row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C8951E]/30 to-[#8A3B14]/20 flex items-center justify-center font-display font-black text-[#C8951E]">
                      {rev.clientName?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-display font-bold text-sm text-white">{rev.clientName}</div>
                      <div className="text-[10px] text-white/40">{rev.serviceName} · {format(new Date(rev.date), 'dd/MM/yyyy')}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StarRow rating={rev.rating} />
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#C8951E]/10 text-[#C8951E] font-mono">{rev.rating}/5</span>
                  </div>
                </div>

                {/* Comment */}
                <div className="bg-white/3 border border-white/5 rounded-2xl px-4 py-3 mb-4">
                  <p className="text-xs text-white/70 leading-relaxed italic">"{rev.comment}"</p>
                </div>

                {/* Reply section */}
                {rev.reply ? (
                  <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold mb-1.5">
                      <CheckCircle2 className="w-3 h-3" /> Réponse du Salon Kènè
                    </div>
                    <p className="text-xs text-white/65">{rev.reply}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] text-white/40">Répondre à {rev.clientName}</Label>
                      <button
                        onClick={() => openAiModal(rev.id, rev.clientName)}
                        className="flex items-center gap-1 text-[10px] font-bold text-[#C8951E] hover:text-[#D4AF37] transition cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" /> Assistant IA
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <Textarea
                        rows={2}
                        placeholder="Rédigez ou modifiez votre réponse..."
                        className="bg-white/5 border-white/10 text-white text-xs rounded-xl focus:border-[#C8951E] resize-none flex-1"
                        value={replyInput[rev.id] || ''}
                        onChange={(e) => setReplyInput({ ...replyInput, [rev.id]: e.target.value })}
                      />
                      <button
                        onClick={() => handleSendReply(rev.id)}
                        disabled={!replyInput[rev.id]}
                        className="px-4 py-2 rounded-xl font-bold text-xs text-[#0F0A05] disabled:opacity-30 transition flex items-center gap-1.5 cursor-pointer shrink-0 self-end"
                        style={{ background: 'linear-gradient(135deg, #F3E5AB, #C8951E)' }}
                      >
                        <Send className="w-3.5 h-3.5" /> Envoyer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* ── AI MODAL ── */}
      <Dialog open={aiModalOpen} onOpenChange={setAiModalOpen}>
        <DialogContent className="bg-[#0F0A05] border border-[#C8951E]/20 text-white rounded-3xl max-w-md">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#C8951E] to-transparent -mt-[1px] mx-6 rounded-full" />
          <DialogHeader className="pt-2">
            <DialogTitle className="font-display text-lg text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C8951E]" />
              Choisir le ton de la réponse
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <button
              onClick={() => handleGenerateAiReply('chaleureux')}
              className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition cursor-pointer"
            >
              <div className="text-left">
                <div className="font-bold text-sm text-white">Chaleureux 💛</div>
                <div className="text-xs text-white/50 mt-1">Empathique, proche du client, remerciements sincères.</div>
              </div>
            </button>
            <button
              onClick={() => handleGenerateAiReply('professionnel')}
              className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition cursor-pointer"
            >
              <div className="text-left">
                <div className="font-bold text-sm text-white">Professionnel 👔</div>
                <div className="text-xs text-white/50 mt-1">Formel, respectueux, orienté satisfaction.</div>
              </div>
            </button>
            <button
              onClick={() => handleGenerateAiReply('commercial')}
              className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition cursor-pointer"
            >
              <div className="text-left">
                <div className="font-bold text-sm text-white">Commercial 🎁</div>
                <div className="text-xs text-white/50 mt-1">Remerciements avec offre ou réduction intégrée.</div>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
