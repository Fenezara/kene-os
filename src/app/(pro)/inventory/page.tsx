'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Search, AlertTriangle, Edit2, Trash2, RefreshCw, Filter, Store, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

// African botanical product categories with emojis
const CATEGORY_META: Record<string, { emoji: string; color: string }> = {
  'Cosmétiques': { emoji: '🌿', color: '#2E5A36' },
  'Huiles': { emoji: '🫙', color: '#C8951E' },
  'Soins': { emoji: '💎', color: '#4E9FD1' },
  'Équipements': { emoji: '⚙️', color: '#8A3B14' },
  'Karité': { emoji: '🥜', color: '#A0522D' },
  'Baobab': { emoji: '🌳', color: '#3F7D3F' },
  'Parfums': { emoji: '🌸', color: '#8A1C14' },
  'Visage': { emoji: '✨', color: '#C8951E' },
  'Cheveux': { emoji: '💇', color: '#8A3B14' },
  'Corps': { emoji: '💆', color: '#2E5A36' },
};
const getCategoryMeta = (cat: string) => CATEGORY_META[cat] || { emoji: '📦', color: '#C8951E' };

export default function ProInventoryPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  
  // Boutique Status per Salon
  const [isBoutiqueActive, setIsBoutiqueActive] = useState(true);

  // Form states for Create & Edit
  const [formData, setFormData] = useState({ 
    id: '', 
    name: '', 
    category: 'Visage', 
    botanical: 'karité',
    description: '',
    purchasePrice: '', 
    salePrice: '', 
    quantity: '0' 
  });

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/tenant/inventory');
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger l'inventaire.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/tenant/inventory', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "✅ Produit Ajouté", description: "Nouveau produit au catalogue de stock et boutique." });
        setIsDialogOpen(false);
        setFormData({ id: '', name: '', category: 'Visage', botanical: 'karité', description: '', purchasePrice: '', salePrice: '', quantity: '0' });
        fetchInventory();
      } else throw new Error(data.error);
    } catch {
      toast({ title: "Erreur", description: "Impossible de créer le produit.", variant: "destructive" });
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/tenant/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "✅ Produit Modifié", description: "Toutes les informations ont été mises à jour avec succès." });
        setIsEditDialogOpen(false);
        fetchInventory();
      } else throw new Error(data.error);
    } catch (err: any) {
      toast({ title: "Erreur Modification", description: err.message, variant: "destructive" });
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Voulez-vous vraiment supprimer "${name}" du catalogue ?`)) return;
    try {
      const res = await fetch(`/api/tenant/inventory?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast({ title: "🗑️ Produit Supprimé", description: `"${name}" a été retiré des stocks.` });
        fetchInventory();
      } else throw new Error(data.error);
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    }
  };

  const openEditModal = (product: any) => {
    const qty = product.inventoryItems?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
    setFormData({
      id: product.id,
      name: product.name || '',
      category: product.category || 'Visage',
      botanical: product.botanical || 'karité',
      description: product.description || '',
      purchasePrice: String(product.purchasePrice || 0),
      salePrice: String(product.salePrice || 0),
      quantity: String(qty),
    });
    setIsEditDialogOpen(true);
  };

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'Tous' || p.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const totalValue = products.reduce((acc, p) => {
    const qty = p.inventoryItems?.reduce((s: number, i: any) => s + i.quantity, 0) || 0;
    return acc + (qty * p.salePrice);
  }, 0);
  const lowStockCount = products.filter(p => (p.inventoryItems?.reduce((s: number, i: any) => s + i.quantity, 0) || 0) <= 5).length;

  return (
    <div className="space-y-6 text-white max-w-6xl mx-auto font-sans">

      {/* ── HEADER & BOUTIQUE CONTROL BAR ── */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1A1410] border border-white/10 p-5 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#2E5A36] to-[#1A3820] flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-200" />
            </div>
            <h1 className="text-2xl font-display font-black text-white tracking-tight">
              Gestion Stocks & <span className="bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] bg-clip-text text-transparent">Boutique Salon</span>
            </h1>
          </div>
          <p className="text-white/50 text-xs ml-11">Catalogue produits, prix client, formules botaniques & boutique en ligne</p>
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          {/* Boutique Status Toggle */}
          <button
            onClick={() => {
              setIsBoutiqueActive(!isBoutiqueActive);
              toast({
                title: isBoutiqueActive ? '🔒 Boutique Désactivée' : '🌐 Boutique en Ligne Activée',
                description: isBoutiqueActive ? 'Votre boutique est masquée côté client.' : 'Votre boutique est maintenant visible par vos clientes.',
              });
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-bold text-xs border transition cursor-pointer ${
              isBoutiqueActive 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}
          >
            {isBoutiqueActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Boutique: {isBoutiqueActive ? 'Active' : 'Désactivée'}</span>
          </button>

          <Link href="/boutique">
            <Button variant="outline" className="border-[#C8951E]/40 text-[#C8951E] hover:bg-[#C8951E]/10 text-xs font-bold rounded-2xl cursor-pointer">
              🌸 Voir ma Boutique Clientèle
            </Button>
          </Link>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs text-[#0F0A05] cursor-pointer shadow-lg"
                style={{ background: 'linear-gradient(135deg, #F3E5AB, #C8951E)' }}
              >
                <Plus className="w-4 h-4" /> Nouveau Produit
              </motion.button>
            </DialogTrigger>
            <DialogContent className="bg-[#0F0A05] border border-[#C8951E]/30 text-white rounded-3xl shadow-2xl">
              <DialogHeader>
                <DialogTitle className="font-display text-xl text-white flex items-center gap-2">
                  <span>📦</span> Nouveau Produit Cosmétique
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateProduct} className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 col-span-2">
                    <Label className="text-white/60 text-xs">Nom du produit</Label>
                    <Input required className="bg-white/5 border-white/10 text-white rounded-xl" placeholder="ex: Sérum Magistral Bissap" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-white/60 text-xs">Catégorie</Label>
                    <select 
                      className="w-full bg-[#1A1410] border border-white/10 text-white rounded-xl p-2.5 text-xs font-bold"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Visage">Visage</option>
                      <option value="Cheveux">Cheveux</option>
                      <option value="Corps">Corps</option>
                      <option value="Soins">Soins</option>
                      <option value="Karité">Karité</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-white/60 text-xs">Actif Botanique</Label>
                    <select 
                      className="w-full bg-[#1A1410] border border-white/10 text-white rounded-xl p-2.5 text-xs font-bold"
                      value={formData.botanical}
                      onChange={(e) => setFormData({ ...formData, botanical: e.target.value })}
                    >
                      <option value="karité">Karité 🌰</option>
                      <option value="baobab">Baobab 🌳</option>
                      <option value="bissap">Bissap 🌺</option>
                      <option value="moringa">Moringa 🌿</option>
                      <option value="chebe">Chébé ✨</option>
                    </select>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-white/60 text-xs">Description & Bienfaits</Label>
                    <Input className="bg-white/5 border-white/10 text-white rounded-xl" placeholder="ex: Anti-taches PIH & hydratation..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-white/60 text-xs">Prix Achat (FCFA)</Label>
                    <Input type="number" required min="0" className="bg-white/5 border-white/10 text-white rounded-xl" value={formData.purchasePrice} onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-white/60 text-xs">Prix Vente Client (FCFA)</Label>
                    <Input type="number" required min="0" className="bg-white/5 border-white/10 text-white rounded-xl" value={formData.salePrice} onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })} />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-white/60 text-xs">Quantité en Stock Initial</Label>
                    <Input type="number" required min="0" className="bg-white/5 border-white/10 text-white rounded-xl" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />
                  </div>
                </div>
                <DialogFooter className="flex gap-2">
                  <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-white/50 rounded-xl">Annuler</Button>
                  <Button type="submit" className="bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] font-bold rounded-xl h-11">
                    Ajouter au Catalogue & Stock
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* ── EDIT PRODUCT DIALOG ── */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-[#0F0A05] border border-[#C8951E]/30 text-white rounded-3xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-white flex items-center gap-2">
              <span>✏️</span> Modifier le Produit & Prix
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateProduct} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 col-span-2">
                <Label className="text-white/60 text-xs">Nom du produit</Label>
                <Input required className="bg-white/5 border-white/10 text-white rounded-xl" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-white/60 text-xs">Catégorie</Label>
                <select 
                  className="w-full bg-[#1A1410] border border-white/10 text-white rounded-xl p-2.5 text-xs font-bold"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Visage">Visage</option>
                  <option value="Cheveux">Cheveux</option>
                  <option value="Corps">Corps</option>
                  <option value="Soins">Soins</option>
                  <option value="Karité">Karité</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-white/60 text-xs">Actif Botanique</Label>
                <select 
                  className="w-full bg-[#1A1410] border border-white/10 text-white rounded-xl p-2.5 text-xs font-bold"
                  value={formData.botanical}
                  onChange={(e) => setFormData({ ...formData, botanical: e.target.value })}
                >
                  <option value="karité">Karité 🌰</option>
                  <option value="baobab">Baobab 🌳</option>
                  <option value="bissap">Bissap 🌺</option>
                  <option value="moringa">Moringa 🌿</option>
                  <option value="chebe">Chébé ✨</option>
                </select>
              </div>
              <div className="space-y-1 col-span-2">
                <Label className="text-white/60 text-xs">Description Produit</Label>
                <Input className="bg-white/5 border-white/10 text-white rounded-xl" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-white/60 text-xs">Prix Achat (FCFA)</Label>
                <Input type="number" required min="0" className="bg-white/5 border-white/10 text-white rounded-xl" value={formData.purchasePrice} onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-white/60 text-xs">Prix Vente Client (FCFA)</Label>
                <Input type="number" required min="0" className="bg-white/5 border-white/10 text-white rounded-xl" value={formData.salePrice} onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })} />
              </div>
              <div className="space-y-1 col-span-2">
                <Label className="text-white/60 text-xs">Quantité en Stock Actuelle</Label>
                <Input type="number" required min="0" className="bg-white/5 border-white/10 text-white rounded-xl" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsEditDialogOpen(false)} className="text-white/50 rounded-xl">Annuler</Button>
              <Button type="submit" className="bg-[#C8951E] text-[#0F0A05] font-bold rounded-xl h-11">
                Enregistrer la Modification
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── KPI BANNER ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }} className="grid grid-cols-3 gap-3">
        {[
          { label: 'Produits Référencés', value: products.length, color: '#C8951E', icon: '📦' },
          { label: 'Valeur Totale Stock', value: `${totalValue.toLocaleString('fr-FR')} F`, color: '#4CAF6E', icon: '💰' },
          { label: 'Alertes Stock Bas', value: lowStockCount, color: lowStockCount > 0 ? '#E07A2B' : '#4CAF6E', icon: lowStockCount > 0 ? '⚠️' : '✅' },
        ].map((kpi, i) => (
          <div key={i} className="relative overflow-hidden rounded-2xl bg-[#1A1410] border border-white/5 p-4 shadow-md">
            <div className="text-xl mb-1">{kpi.icon}</div>
            <div className="font-display font-black text-base text-white">{kpi.value}</div>
            <div className="text-[10px] text-white/40 mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </motion.div>

      {/* ── SEARCH & FILTER TABS ── */}
      <div className="space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['Tous', 'Visage', 'Cheveux', 'Corps', 'Soins', 'Karité'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeCategory === cat
                  ? 'bg-[#C8951E] text-[#0A0603]'
                  : 'bg-[#1A1410] border border-white/10 text-white/50 hover:text-white'
              }`}
            >
              {cat === 'Tous' ? <Filter className="w-3 h-3 inline-block mr-1" /> : getCategoryMeta(cat).emoji + ' '}
              {cat}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-white/30" />
          <Input
            placeholder="Rechercher un produit dans l'inventaire..."
            className="pl-10 bg-[#1A1410] border-white/10 text-white rounded-2xl h-11 placeholder:text-white/30 focus:border-[#C8951E]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── PRODUCTS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((product, i) => {
          const qty = product.inventoryItems?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
          const isLow = qty <= 5;
          const isOut = qty === 0;
          const meta = getCategoryMeta(product.category);

          return (
            <div
              key={product.id}
              className="group relative rounded-3xl border border-white/10 bg-[#1A1410] p-5 hover:border-[#C8951E]/50 transition shadow-xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 border border-white/10" style={{ background: `${meta.color}25` }}>
                      {meta.emoji}
                    </div>
                    <div>
                      <div className="font-display font-bold text-sm text-white leading-tight">{product.name}</div>
                      <span className="text-[10px] text-[#C8951E] font-mono font-bold bg-[#C8951E]/10 px-2 py-0.5 rounded-md inline-block mt-0.5">
                        {product.category} · {product.botanical || 'Karité'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stock meter */}
                <div className="my-3 bg-[#0A0603] p-3 rounded-2xl border border-white/5">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-white/40">Stock Disponible</span>
                    <span className={`font-bold font-mono ${isOut ? 'text-red-400' : isLow ? 'text-orange-400' : 'text-emerald-400'}`}>{qty} unités</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (qty / 40) * 100)}%`,
                        background: isOut ? '#EF4444' : isLow ? '#F97316' : '#2E5A36'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions & Prices */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-[9px] text-white/40 font-mono">Prix Vente Client</div>
                  <div className="font-display font-black text-sm text-[#F3E5AB]">
                    {product.salePrice?.toLocaleString('fr-FR')} <span className="text-[9px] font-normal">FCFA</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => openEditModal(product)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-[#C8951E]/20 text-white/60 hover:text-[#C8951E] transition cursor-pointer"
                    title="Modifier le produit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product.id, product.name)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 transition cursor-pointer"
                    title="Supprimer le produit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
