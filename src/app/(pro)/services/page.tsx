'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string;
  durationMin: number;
  price: number;
  vatRate: number;
  commissionRate: number;
  active: boolean;
}

const CATEGORIES = [
  { name: 'Coiffure', emoji: '💇', color: 'from-pink-500/20 to-pink-500/5', border: 'border-pink-500/20' },
  { name: 'Soin Visage', emoji: '💆', color: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/20' },
  { name: 'Massage', emoji: '🌿', color: 'from-emerald-500/20 to-emerald-500/5', border: 'border-emerald-500/20' },
  { name: 'Maquillage', emoji: '💄', color: 'from-red-500/20 to-red-500/5', border: 'border-red-500/20' },
  { name: 'Onglerie', emoji: '💅', color: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/20' },
  { name: 'Épilation', emoji: '🌸', color: 'from-fuchsia-500/20 to-fuchsia-500/5', border: 'border-fuchsia-500/20' },
  { name: 'Karité', emoji: '🥜', color: 'from-[var(--gold-kene)]/20 to-[var(--gold-kene)]/5', border: 'border-[var(--gold-kene)]/20' },
  { name: 'Baobab', emoji: '🌳', color: 'from-green-500/20 to-green-500/5', border: 'border-green-500/20' },
];

const getCategoryStyle = (catName: string) => {
  const cat = CATEGORIES.find(c => c.name === catName) || CATEGORIES.find(c => c.name === 'Coiffure');
  return cat;
};

export default function ProServicesPage() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: 'Coiffure',
    durationMin: '30',
    price: '',
    vatRate: '0.18',
    commissionRate: '0',
    description: ''
  });

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/tenant/services');
      const data = await res.json();
      let list = data.success ? data.services : [];

      const savedLocal = localStorage.getItem('kene_tenant_services');
      if (savedLocal) {
        try {
          const parsed = JSON.parse(savedLocal);
          parsed.forEach((localItem: any) => {
            if (!list.some((s: any) => s.id === localItem.id)) {
              list = [localItem, ...list];
            }
          });
        } catch (e) {}
      }

      setServices(list);
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de charger les services.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newService: Service = {
        id: `srv_${Date.now()}`,
        name: formData.name,
        category: formData.category,
        durationMin: Number(formData.durationMin) || 30,
        price: Number(formData.price) || 0,
        vatRate: Number(formData.vatRate) || 0.18,
        commissionRate: Number(formData.commissionRate) || 0,
        description: formData.description || '',
        active: true
      };

      const updated = [newService, ...services];
      setServices(updated);
      try {
        localStorage.setItem('kene_tenant_services', JSON.stringify(updated));
      } catch (e) {}

      await fetch('/api/tenant/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      toast({ title: "✨… Prestation Enregistrée & Publiée !", description: "Ce soin est désormais disponible à la réservation en ligne pour les clientes." });
      setIsDialogOpen(false);
      setFormData({ name: '', category: 'Coiffure', durationMin: '30', price: '', vatRate: '0.18', commissionRate: '0', description: '' });
    } catch (error) {
      toast({ title: "❌ Erreur", description: "Impossible de créer le service.", variant: "destructive" });
    }
  };

  const toggleActive = (id: string) => {
    // Dans une vraie app, appel API
    setServices(services.map(s => s.id === id ? { ...s, active: !s.active } : s));
    toast({ title: "✨… Succès", description: "Statut du service mis à jour." });
  };

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 text-white min-h-full max-w-5xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight">
            Catalogue de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] to-[#C8951E]">Services</span>
          </h1>
          <p className="text-white/60 mt-2">Gérez vos prestations premium, durées et commissions.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <motion.button 
              whileHover={{ scale: 1.03 }} 
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] font-semibold flex items-center shadow-lg shadow-[#C8951E]/20"
            >
              <Plus className="w-5 h-5 mr-2" /> Ajouter un Service
            </motion.button>
          </DialogTrigger>
          <DialogContent className="bg-[#0F0A05]/95 backdrop-blur-xl border border-[#C8951E]/20 rounded-3xl text-white shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#C8951E] to-transparent" />
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] to-[#C8951E]">
                Ajouter une prestation
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateService} className="space-y-5 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white/80">Nom du service</Label>
                <Input 
                  id="name" 
                  required 
                  className="bg-white/5 border-white/10 text-white rounded-xl focus:border-[#C8951E] transition-colors"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="ex: Massage relaxant"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-white/80">Catégorie</Label>
                <select 
                  id="category" 
                  required 
                  className="w-full h-10 px-3 py-2 bg-[#1A1410] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C8951E] transition-colors"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.emoji} {cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-white/80">Durée (min)</Label>
                  <Input 
                    id="duration" 
                    type="number" 
                    required 
                    min="5"
                    className="bg-white/5 border-white/10 text-white rounded-xl focus:border-[#C8951E]"
                    value={formData.durationMin}
                    onChange={(e) => setFormData({...formData, durationMin: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-white/80">Prix (FCFA)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    required 
                    min="0"
                    className="bg-white/5 border-white/10 text-white rounded-xl focus:border-[#C8951E]"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vatRate" className="text-white/80">TVA</Label>
                  <select 
                    id="vatRate" 
                    className="w-full h-10 px-3 py-2 bg-[#1A1410] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C8951E]"
                    value={formData.vatRate}
                    onChange={(e) => setFormData({...formData, vatRate: e.target.value})}
                  >
                    <option value="0">0%</option>
                    <option value="0.18">18%</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commission" className="text-white/80">Commission (%)</Label>
                  <Input 
                    id="commission" 
                    type="number" 
                    min="0"
                    max="100"
                    step="0.1"
                    className="bg-white/5 border-white/10 text-white rounded-xl focus:border-[#C8951E]"
                    value={formData.commissionRate}
                    onChange={(e) => setFormData({...formData, commissionRate: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc" className="text-white/80">Description (Optionnel)</Label>
                <Input 
                  id="desc" 
                  className="bg-white/5 border-white/10 text-white rounded-xl focus:border-[#C8951E]"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <DialogFooter className="mt-6 border-t border-white/5 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-white/60 hover:text-white rounded-xl">Annuler</Button>
                <motion.button 
                  whileHover={{ scale: 1.03 }} 
                  whileTap={{ scale: 0.97 }}
                  type="submit" 
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] font-semibold"
                >
                  Enregistrer
                </motion.button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-3 h-5 w-5 text-white/40" />
        <Input 
          placeholder="Rechercher un service..." 
          className="pl-10 bg-[#1A1410] border-white/10 text-white rounded-xl h-11 focus:border-[#C8951E] transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-8 w-8 border-2 border-[#C8951E] border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredServices.map((service, idx) => {
              const catStyle = getCategoryStyle(service.category);
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`relative overflow-hidden bg-[#1A1410] rounded-3xl border ${service.active ? catStyle?.border : 'border-white/5'} p-6 flex flex-col group`}
                >
                  {/* Background gradient hint */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${catStyle?.color} blur-3xl opacity-50 group-hover:opacity-100 transition-opacity`} />
                  
                  <div className="flex justify-between items-start z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#0A0603] flex items-center justify-center text-2xl shadow-inner border border-white/5">
                        {catStyle?.emoji}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-[#C8951E] transition-colors line-clamp-1">{service.name}</h3>
                        <p className="text-sm text-white/50">{service.category}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleActive(service.id)}
                      className={`p-1.5 rounded-full transition-colors ${service.active ? 'text-[#4CAF6E] bg-[#4CAF6E]/10' : 'text-white/30 bg-white/5'}`}
                    >
                      {service.active ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </button>
                  </div>

                  {service.description && (
                    <p className="mt-4 text-sm text-white/60 line-clamp-2 z-10 flex-grow">
                      {service.description}
                    </p>
                  )}
                  {!service.description && <div className="mt-4 flex-grow" />}

                  <div className="mt-6 flex items-center justify-between z-10">
                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/80 font-medium">
                      ⏱ {service.durationMin} min
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/80 font-medium">
                      🤝 {service.commissionRate}%
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between z-10">
                    <span className="text-2xl font-display font-bold text-white tracking-tight">
                      {service.price.toLocaleString('fr-FR')} <span className="text-[#C8951E] text-lg">FCFA</span>
                    </span>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
          {filteredServices.length === 0 && (
            <div className="col-span-full py-20 text-center text-white/40">
              Aucun service ne correspond à votre recherche.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
