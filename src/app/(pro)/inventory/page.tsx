'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, Search, AlertTriangle, Edit2, Trash2, RefreshCw, Filter, Store, Eye, EyeOff, Sparkles, Leaf, Stethoscope, Utensils, Crown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

// Mappage des 5 Origines & Genres de Produits Cosmétiques
const COSMETIC_ORIGINS: Record<string, { label: string; shortLabel: string; emoji: string; badgeStyle: string }> = {
  'tradipraticien': { label: '🌿 Tradipraticien / Botanique Ancestral', shortLabel: 'Tradipraticien 🌿', emoji: '🌿', badgeStyle: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  'pharmaceutique': { label: '💊 Dermo-Pharmaceutique', shortLabel: 'Dermo-Pharmacie 💊', emoji: '💊', badgeStyle: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
  'artisanal': { label: '🥣 Fait Maison / Artisanal (Salon)', shortLabel: 'Fait Maison 🥣', emoji: '🥣', badgeStyle: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  'marque': { label: '👑 Produit de Marque / International', shortLabel: 'Grande Marque 👑', emoji: '👑', badgeStyle: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
  'sur_mesure': { label: '✨ Formulation Sur-Mesure Kènè', shortLabel: 'Sur-Mesure ✨', emoji: '✨', badgeStyle: 'bg-[var(--gold-kene)]/20 text-[#F3E5AB] border-[var(--gold-kene)]/50' },
};

const getOriginMeta = (origin?: string) => {
  return COSMETIC_ORIGINS[origin || 'tradipraticien'] || COSMETIC_ORIGINS['tradipraticien'];
};

// African botanical product categories with emojis
const CATEGORY_META: Record<string, { emoji: string; color: string }> = {
  'Cosmétiques': { emoji: '🌿', color: '#2E5A36' },
  'Huiles': { emoji: '🫗', color: '#C8951E' },
  'Soins': { emoji: '💎', color: '#4E9FD1' },
  'Équipements': { emoji: '⚙️', color: '#8A3B14' },
  'Karité': { emoji: '🥜', color: '#A0522D' },
  'Baobab': { emoji: '🌳', color: '#3F7D3F' },
  'Parfums': { emoji: '🌸', color: '#8A1C14' },
  'Visage': { emoji: '✨', color: '#C8951E' },
  'Cheveux': { emoji: '💇', color: '#8A3B14' },
  'Corps': { emoji: '💆', color: '#2E5A36' },
};
const getCategoryMeta = (cat: string) => CATEGORY_META[cat] || { emoji: '📁¦', color: '#C8951E' };

export default function ProInventoryPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [activeOrigin, setActiveOrigin] = useState('Toutes');
  
  // Boutique Status per Salon
  const [isBoutiqueActive, setIsBoutiqueActive] = useState(true);

  // Facebook-Style "Voir en tant que Visiteur" Mode State
  const [isVisitorViewMode, setIsVisitorViewMode] = useState(false);

  // Form states for Create & Edit
  const [formData, setFormData] = useState({ 
    id: '', 
    name: '', 
    category: 'Visage', 
    origin: 'tradipraticien',
    botanical: 'karité',
    description: '',
    purchasePrice: '', 
    salePrice: '', 
    quantity: '0',
    image: ''
  });

  const syncProductsToLocalStorage = (updatedProducts: any[]) => {
    try {
      localStorage.setItem('kene_tenant_products', JSON.stringify(updatedProducts));
    } catch (e) {}
  };

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/tenant/inventory');
      const data = await res.json();
      let list = data.success ? data.products : [];
      
      const savedLocal = localStorage.getItem('kene_tenant_products');
      if (savedLocal) {
        try {
          const parsed = JSON.parse(savedLocal);
          parsed.forEach((localItem: any) => {
            if (!list.some((p: any) => p.id === localItem.id)) {
              list = [localItem, ...list];
            }
          });
        } catch (e) {}
      }

      if (list.length === 0) {
        list = [
          { id: 'p1', name: 'Beurre de Karité Brut de Korhogo', category: 'Karité', origin: 'tradipraticien', botanical: 'karité', description: 'Nourrit & répare les peaux très sèches', purchasePrice: 4000, salePrice: 9500, inventoryItems: [{ quantity: 18 }], image: '/images/kene_botanical_lab_serum.jpg' },
          { id: 'p2', name: 'Sérum Niacinamide 10% & Zinc Dermo', category: 'Visage', origin: 'pharmaceutique', botanical: 'moringa', description: 'Anti-taches PIH & régulation sébum', purchasePrice: 8500, salePrice: 16500, inventoryItems: [{ quantity: 12 }], image: '/images/afro_skin_spectral_scanner.jpg' },
          { id: 'p3', name: 'Masque Frais Avocat & Chébé (Salon)', category: 'Cheveux', origin: 'artisanal', botanical: 'chebe', description: 'Préparation fraîche faite au salon le jour-même', purchasePrice: 3000, salePrice: 8500, inventoryItems: [{ quantity: 8 }], image: '/images/kene_custom_botanical_bottle.png' },
          { id: 'p4', name: 'Lait Hydratant Solaire L’Oréal SPF50+', category: 'Corps', origin: 'marque', botanical: 'baobab', description: 'Protection solaire incolore haute défense', purchasePrice: 12000, salePrice: 19500, inventoryItems: [{ quantity: 15 }], image: '/images/botanical_ingredients_flatlay.jpg' },
          { id: 'p5', name: 'Formulation Dermo-Awa Sur-Mesure #402', category: 'Soins', origin: 'sur_mesure', botanical: 'bissap', description: 'Sérum personnalisé préparé sur recommandation Dermo-IA', purchasePrice: 10000, salePrice: 28500, inventoryItems: [{ quantity: 5 }], image: '/images/kene_official_logo.jpg' },
        ];
      }

      setProducts(list);
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
      const newProduct = {
        id: `prod_${Date.now()}`,
        name: formData.name,
        category: formData.category,
        origin: formData.origin,
        botanical: formData.botanical,
        description: formData.description,
        purchasePrice: Number(formData.purchasePrice),
        salePrice: Number(formData.salePrice),
        inventoryItems: [{ quantity: Number(formData.quantity) }],
        image: formData.image || '/images/kene_botanical_lab_serum.jpg'
      };

      const updated = [newProduct, ...products];
      setProducts(updated);
      syncProductsToLocalStorage(updated);

      await fetch('/api/tenant/inventory', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(formData)
      });

      toast({ title: "✨… Produit Ajouté à la Boutique !", description: `Produit référencé en catégorie "${getOriginMeta(formData.origin).shortLabel}".` });
      setIsDialogOpen(false);
      setFormData({ id: '', name: '', category: 'Visage', origin: 'tradipraticien', botanical: 'karité', description: '', purchasePrice: '', salePrice: '', quantity: '0', image: '' });
    } catch {
      toast({ title: "Erreur", description: "Impossible de créer le produit.", variant: "destructive" });
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = products.map(p => p.id === formData.id ? {
        ...p,
        name: formData.name,
        category: formData.category,
        origin: formData.origin,
        botanical: formData.botanical,
        description: formData.description,
        purchasePrice: Number(formData.purchasePrice),
        salePrice: Number(formData.salePrice),
        inventoryItems: [{ quantity: Number(formData.quantity) }],
        image: formData.image || p.image
      } : p);

      setProducts(updated);
      syncProductsToLocalStorage(updated);

      toast({ title: "✨… Produit Mis à Jour !", description: "Modifications enregistrées avec succès." });
      setIsEditDialogOpen(false);
    } catch (err: any) {
      toast({ title: "Erreur Modification", description: err.message, variant: "destructive" });
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Voulez-vous vraiment supprimer "${name}" du catalogue ?`)) return;
    try {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      syncProductsToLocalStorage(updated);
      toast({ title: "🗑️ï¸ Produit Supprimé", description: `"${name}" a été retiré des stocks.` });
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
      origin: product.origin || 'tradipraticien',
      botanical: product.botanical || 'karité',
      description: product.description || '',
      purchasePrice: String(product.purchasePrice || 0),
      salePrice: String(product.salePrice || 0),
      quantity: String(qty),
      image: product.image || '',
    });
    setIsEditDialogOpen(true);
  };

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'Tous' || p.category === activeCategory;
    const matchesOrigin = activeOrigin === 'Toutes' || (p.origin || 'tradipraticien') === activeOrigin;
    return matchesSearch && matchesCat && matchesOrigin;
  });

  const totalValue = products.reduce((acc, p) => {
    const qty = p.inventoryItems?.reduce((s: number, i: any) => s + i.quantity, 0) || 0;
    return acc + (qty * p.salePrice);
  }, 0);
  const lowStockCount = products.filter(p => (p.inventoryItems?.reduce((s: number, i: any) => s + i.quantity, 0) || 0) <= 5).length;

  // ── MODE FACEBOOK : "VOIR EN TANT QUE VISITEUR PUBLIC" ──
  if (isVisitorViewMode) {
    return (
      <div className="min-h-screen bg-[#0A0603] text-white p-4 md:p-6 space-y-6 font-sans">
        {/* BANNIÈRE FACEBOOK "VOIR EN TANT QUE VISITEUR" */}
        <div className="sticky top-0 z-50 bg-gradient-to-r from-[#F3E5AB] via-[#C8951E] to-[#8A3B14] text-[#0F0A05] p-3.5 rounded-2xl shadow-2xl flex items-center justify-between font-display font-black text-xs">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#0F0A05]" />
            <span className="text-[#0F0A05] font-black tracking-wide">
              👁️ MODE FACEBOOK : VOUS CONSULTEZ VOTRE BOUTIQUE EN TANT QUE VISITEUR PUBLIC (SANS COMPTE CLIENT)
            </span>
          </div>
          <button
            onClick={() => setIsVisitorViewMode(false)}
            className="bg-[#0F0A05] text-[#F3E5AB] hover:text-white hover:bg-black px-4 py-2 rounded-xl font-black text-xs cursor-pointer flex items-center gap-1.5 shadow-md border border-[#F3E5AB]/40 transition"
          >
            <X className="w-4 h-4 text-[#F3E5AB]" /> Quitter le Mode Visiteur
          </button>
        </div>

        {/* VITRINE CLIENTE RÉELLE (LECTURE SEULE - HIGH CONTRAST) */}
        <div className="bg-[#1A1410] border border-[var(--gold-kene)]/30 rounded-3xl p-6 space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#F3E5AB] bg-[#C8951E]/20 border border-[#C8951E]/40 px-3 py-1 rounded-full">
                Boutique Officielle de l'Établissement Partner
              </span>
              <h2 className="font-display font-black text-2xl text-white mt-2">
                Soins Botaniques Africains & Prescriptions Dermo-Cosmétiques
              </h2>
              <p className="text-xs text-white/60 font-sans mt-1">
                Commandez directement vos soins certifiés en Click & Collect 1h ou livraison sécurisée Mobile Money.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                🟢 Boutique Active en Ligne
              </span>
            </div>
          </div>

          {/* FILTRES CATEGORIES (HIGH CONTRAST CLICKABLE STATES) */}
          <div className="flex flex-wrap gap-2">
            {['Tous', 'Visage', 'Cheveux', 'Corps', 'Soins', 'Karité'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                  activeCategory === cat 
                    ? 'bg-[#C8951E] text-[#0F0A05] hover:text-[#0F0A05] focus:text-[#0F0A05] shadow-lg border border-[#F3E5AB]' 
                    : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* GRILLE PRODUITS (CÔTÉ VISITEUR - ZÉRO EDITEUR PRO) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(product => {
              const originMeta = getOriginMeta(product.origin);
              return (
                <div key={product.id} className="bg-[#0A0603] border border-white/10 rounded-3xl p-4 flex flex-col justify-between hover:border-[var(--gold-kene)]/40 transition shadow-lg">
                  <div>
                    <div className="h-44 w-full rounded-2xl overflow-hidden bg-black mb-3 relative">
                      <img src={product.image || '/images/kene_botanical_lab_serum.jpg'} alt={product.name} className="w-full h-full object-cover" />
                      <span className={`absolute top-3 right-3 text-[9px] font-bold px-2.5 py-1 rounded-full font-mono border backdrop-blur-md ${originMeta.badgeStyle}`}>
                        {originMeta.shortLabel}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-sm text-white">{product.name}</h4>
                    <p className="text-xs text-white/50 line-clamp-2 mt-1">{product.description}</p>
                  </div>
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between mt-3">
                    <div>
                      <span className="text-[10px] text-white/40 block font-mono">PRIX PUBLIC</span>
                      <span className="font-mono font-black text-sm text-[#F3E5AB]">
                        {product.salePrice.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                    <button
                      onClick={() => toast({ title: "🛒 Panier Client", description: "Simulation de commande client enregistrée." })}
                      className="bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] hover:text-[#0F0A05] focus:text-[#0F0A05] text-xs font-black px-3.5 py-2 rounded-xl cursor-pointer shadow-md"
                    >
                      + Ajouter
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── VUE DE GESTION PRO HABITUELLE ──
  return (
    <div className="space-y-6 text-[#F8F1E4] max-w-6xl mx-auto font-sans">

      {/* ── HEADER & BOUTIQUE CONTROL BAR ── */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1A1410] border border-white/10 p-5 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#2E5A36] to-[#1A3820] flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-200" />
            </div>
            <h1 className="text-2xl font-display font-black text-white tracking-tight">
              Stocks & <span className="bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] bg-clip-text text-transparent">Multi-Origines Cosmétiques</span>
            </h1>
          </div>
          <p className="text-white/50 text-xs ml-11">Gestion intégrée des soins Tradipraticien, Dermo-Pharmacie, Fait Maison, Marques & Sur-Mesure</p>
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

          {/* BOUTON SEUL & UNIQUE DE CONSULTATION FACEBOOK MODE (ULTRA HIGH CONTRAST) */}
          <Button
            onClick={() => setIsVisitorViewMode(true)}
            className="bg-gradient-to-r from-[#F3E5AB] via-[#C8951E] to-[#D4AF37] text-[#0F0A05] hover:text-[#0F0A05] focus:text-[#0F0A05] active:text-[#0F0A05] text-xs font-black rounded-2xl px-4 py-2.5 flex items-center gap-1.5 shadow-md cursor-pointer hover:opacity-95"
          >
            <Eye className="w-4 h-4 text-[#0F0A05]" /> Voir en tant que Visiteur (Mode FB) 👁️
          </Button>

          {/* Modal NOUVEAU PRODUIT */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-xs text-[#0F0A05] hover:text-[#0F0A05] focus:text-[#0F0A05] active:text-[#0F0A05] cursor-pointer shadow-lg"
                style={{ background: 'linear-gradient(135deg, #F3E5AB, #C8951E)' }}
              >
                <Plus className="w-4 h-4 text-[#0F0A05]" /> Nouveau Produit
              </motion.button>
            </DialogTrigger>
            <DialogContent className="bg-[#0F0A05] border border-[#C8951E]/30 text-white rounded-3xl shadow-2xl">
              <DialogHeader>
                <DialogTitle className="font-display text-xl text-white flex items-center gap-2">
                  <span>📁¦</span> Référencer un Produit Cosmétique
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateProduct} className="space-y-4 mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1 col-span-2">
                    <Label className="text-white/60 text-xs">Nom du produit</Label>
                    <Input required className="bg-white/5 border-white/10 text-white rounded-xl" placeholder="ex: Sérum Niacinamide ou Macérat Karité Neem" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>

                  <div className="space-y-1 col-span-2">
                    <Label className="text-[#F3E5AB] font-bold text-xs">Origine / Genre du Produit Cosmétique</Label>
                    <select 
                      className="w-full bg-[#1A1410] border border-[#C8951E]/50 text-white rounded-xl p-2.5 text-xs font-bold"
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    >
                      <option value="tradipraticien">🌿 Tradipraticien / Recette Botanique Ancestrale</option>
                      <option value="pharmaceutique">💊 Dermo-Pharmaceutique / Prescription Dermatologue</option>
                      <option value="artisanal">🥣 Fait Maison / Préparation Artisanale au Salon</option>
                      <option value="marque">👑 Produit de Grande Marque / International</option>
                      <option value="sur_mesure">✨ Formulation Sur-Mesure Dermo-IA Kènè</option>
                    </select>
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
                    <Label className="text-white/60 text-xs">Actif Botanique Clé</Label>
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
                    <Input className="bg-white/5 border-white/10 text-white rounded-xl" placeholder="ex: Anti-taches PIH & régénération..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
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
                  <Button type="submit" className="bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] hover:text-[#0F0A05] focus:text-[#0F0A05] font-black rounded-xl h-11">
                    Ajouter au Catalogue & Stock
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* ── MODAL EDIT PRODUIT ── */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-[#0F0A05] border border-[#C8951E]/30 text-white rounded-3xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-white flex items-center gap-2">
              <span>✨ï¸</span> Modifier le Produit & Origine
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateProduct} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1 col-span-2">
                <Label className="text-white/60 text-xs">Nom du produit</Label>
                <Input required className="bg-white/5 border-white/10 text-white rounded-xl" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-1 col-span-2">
                <Label className="text-[#F3E5AB] font-bold text-xs">Origine / Genre Produit</Label>
                <select 
                  className="w-full bg-[#1A1410] border border-[#C8951E]/50 text-white rounded-xl p-2.5 text-xs font-bold"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                >
                  <option value="tradipraticien">🌿 Tradipraticien / Recette Botanique Ancestrale</option>
                  <option value="pharmaceutique">💊 Dermo-Pharmaceutique / Prescription Dermatologue</option>
                  <option value="artisanal">🥣 Fait Maison / Préparation Artisanale au Salon</option>
                  <option value="marque">👑 Produit de Grande Marque / International</option>
                  <option value="sur_mesure">✨ Formulation Sur-Mesure Dermo-IA Kènè</option>
                </select>
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
              <Button type="submit" className="bg-[#C8951E] text-[#0F0A05] hover:text-[#0F0A05] focus:text-[#0F0A05] font-black rounded-xl h-11">
                Enregistrer la Modification
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── KPI BANNER ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: 'Produits Référencés', value: products.length, color: '#C8951E', icon: '📁¦' },
          { label: 'Valeur Totale Stock', value: `${totalValue.toLocaleString('fr-FR')} F`, color: '#4CAF6E', icon: '💰' },
          { label: 'Alertes Stock Bas', value: lowStockCount, color: lowStockCount > 0 ? '#E07A2B' : '#4CAF6E', icon: lowStockCount > 0 ? '⚠️ï¸' : '✨…' },
        ].map((kpi, i) => (
          <div key={i} className="relative overflow-hidden rounded-2xl bg-[#1A1410] border border-white/5 p-4 shadow-md">
            <div className="text-xl mb-1">{kpi.icon}</div>
            <div className="font-display font-black text-base text-white">{kpi.value}</div>
            <div className="text-[10px] text-white/40 mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </motion.div>

      {/* ── ORIGINES COSMÉTIQUES FILTER BAR (ULTRA HIGH CONTRAST CLICKABLE STATES) ── */}
      <div className="bg-[#1A1410] border border-white/10 p-3.5 rounded-2xl space-y-2">
        <span className="text-[10px] font-mono text-[#F3E5AB] font-bold uppercase tracking-wider block">
          🔍 Filtrer par Genre & Origine du Produit :
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'Toutes', label: 'Toutes Origines' },
            { id: 'tradipraticien', label: '🌿 Tradipraticien' },
            { id: 'pharmaceutique', label: '💊 Dermo-Pharmacie' },
            { id: 'artisanal', label: '🥣 Fait Maison (Salon)' },
            { id: 'marque', label: '👑 Grandes Marques' },
            { id: 'sur_mesure', label: '✨ Sur-Mesure' },
          ].map((orig) => (
            <button
              key={orig.id}
              onClick={() => setActiveOrigin(orig.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition cursor-pointer ${
                activeOrigin === orig.id
                  ? 'bg-[#C8951E] text-[#0F0A05] hover:text-[#0F0A05] focus:text-[#0F0A05] shadow-lg border border-[#F3E5AB]'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {orig.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES & SEARCH (ULTRA HIGH CONTRAST CLICKABLE STATES) ── */}
      <div className="space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['Tous', 'Visage', 'Cheveux', 'Corps', 'Soins', 'Karité'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#C8951E] text-[#0F0A05] hover:text-[#0F0A05] focus:text-[#0F0A05] shadow-lg border border-[#F3E5AB]'
                  : 'bg-[#1A1410] border border-white/10 text-white/70 hover:text-white hover:bg-white/10'
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

      {/* ── PRODUCTS GRID WITH ORIGIN BADGES ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((product) => {
          const qty = product.inventoryItems?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
          const isLow = qty <= 5;
          const isOut = qty === 0;
          const meta = getCategoryMeta(product.category);
          const originMeta = getOriginMeta(product.origin);

          return (
            <div
              key={product.id}
              className="relative bg-[#1A1410] border border-white/5 rounded-3xl overflow-hidden hover:border-[#C8951E]/40 transition group flex flex-col justify-between"
            >
              <div>
                {/* Product Image */}
                <div className="relative h-40 w-full overflow-hidden bg-black/60">
                  <img
                    src={product.image || '/images/kene_botanical_lab_serum.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/kene_botanical_lab_serum.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1410] via-transparent to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/70 text-white backdrop-blur-md border border-white/10">
                    {meta.emoji} {product.category}
                  </span>

                  {/* ORIGINE COSMÉTIQUE BADGE */}
                  <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[9px] font-bold font-mono border backdrop-blur-md ${originMeta.badgeStyle}`}>
                    {originMeta.shortLabel}
                  </span>
                </div>

                {/* Info Content */}
                <div className="p-4 space-y-2">
                  <h3 className="font-display font-bold text-sm text-white group-hover:text-[#F3E5AB] transition">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-[11px] text-white/50 line-clamp-2">{product.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[10px] text-white/40 block uppercase">Prix Vente</span>
                      <span className="font-mono font-bold text-sm text-[#C8951E]">
                        {product.salePrice.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-white/40 block uppercase">Stock</span>
                      <span className={`font-mono font-bold text-xs ${isOut ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {qty} unité{qty > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-3 bg-white/5 border-t border-white/5 flex gap-2 justify-end">
                <button
                  onClick={() => openEditModal(product)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
                  title="Modifier"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id, product.name)}
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition cursor-pointer"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
