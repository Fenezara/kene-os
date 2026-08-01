'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Sparkles, CheckCircle2, ShieldCheck, MapPin, Store, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { BackButton } from '@/components/ui/back-button';

interface Product {
  id: string;
  name: string;
  salePrice: number;
  description: string | null;
  category: string;
  botanical: string | null;
  image?: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const SALONS_STORES = [
  { id: 's_1', name: 'Kènè Institut Cocody', city: 'Abidjan 🇨🇮', active: true, badge: 'Click & Collect 1h' },
  { id: 's_2', name: 'Kènè Afro Beauty Almadies', city: 'Dakar 🇸🇳', active: true, badge: 'Livraison Express' },
  { id: 's_3', name: 'Kènè Botanique Bamako Coura', city: 'Bamako 🇲🇱', active: true, badge: 'Click & Collect 2h' },
  { id: 's_4', name: 'Kènè Dermo Spa Ouagadougou', city: 'Ouagadougou 🇧🇫', active: false, badge: 'Boutique Désactivée' },
];

const CATEGORIES = ['Tous', 'Visage', 'Corps', 'Cheveux', 'Soins'];
const BOTANICALS = [
  { label: 'Karité 🌰', value: 'karité' },
  { label: 'Moringa 🌿', value: 'moringa' },
  { label: 'Baobab 🌳', value: 'baobab' },
  { label: 'Bissap 🌺', value: 'bissap' },
  { label: 'Chébé ✨', value: 'chebe' },
];

export default function BoutiquePage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [salonsList, setSalonsList] = useState<any[]>(SALONS_STORES);
  const [selectedSalon, setSelectedSalon] = useState<any>(SALONS_STORES[0]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [activeBotanical, setActiveBotanical] = useState<string | null>(null);
  
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    // Scan all registered enterprises from localStorage (Cabinet La Dermo, etc.)
    const localStores: any[] = [];
    const savedTenant = localStorage.getItem('kene_tenant_settings');
    if (savedTenant) {
      try {
        const tenantObj = JSON.parse(savedTenant);
        const name = tenantObj?.identity?.commercialName || tenantObj?.identity?.legalName;
        if (name) {
          localStores.push({
            id: 'local-store-registered',
            name: `${name} (Votre Entreprise)`,
            city: tenantObj.address?.street || 'Abidjan 🇨🇮',
            active: true,
            badge: 'Boutique Officielle'
          });
        }
      } catch (e) {}
    }

    const savedUser = localStorage.getItem('kene_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        const sName = u.salonName || (u.role === 'gerant' ? u.name : null);
        if (sName && !localStores.some(s => s.name.toLowerCase().includes(sName.toLowerCase()))) {
          localStores.push({
            id: 'local-user-salon-store',
            name: sName,
            city: 'Abidjan 🇨🇮',
            active: true,
            badge: 'Boutique Inscrite'
          });
        }
      } catch (e) {}
    }

    if (localStores.length > 0) {
      const merged = [...localStores, ...SALONS_STORES];
      setSalonsList(merged);
      setSelectedSalon(merged[0]);
    }
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem('kene_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('kene_cart', JSON.stringify(newCart));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedSalon.active) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeCategory !== 'Tous') {
          params.append('category', activeCategory);
        }
        if (activeBotanical) {
          params.append('botanical', activeBotanical);
        }
        
        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        let fetchedProducts = data.success ? data.products : [];

        const savedLocal = localStorage.getItem('kene_tenant_products');
        if (savedLocal) {
          try {
            const parsed = JSON.parse(savedLocal);
            parsed.forEach((localItem: any) => {
              if (!fetchedProducts.some((p: any) => p.id === localItem.id)) {
                fetchedProducts = [localItem, ...fetchedProducts];
              }
            });
          } catch (e) {}
        }

        if (fetchedProducts.length === 0) {
          fetchedProducts = [
            { id: 'p1', name: 'Beurre de Karité Brut de Korhogo', category: 'Karité', botanical: 'karité', description: 'Nourrit & répare les peaux très sèches', salePrice: 9500, image: '/images/kene_botanical_lab_serum.jpg' },
            { id: 'p2', name: 'Sérum Niacinamide 10% & Zinc Dermo', category: 'Visage', botanical: 'moringa', description: 'Anti-taches PIH & régulation sébum', salePrice: 16500, image: '/images/afro_skin_spectral_scanner.jpg' },
            { id: 'p3', name: 'Masque Frais Avocat & Chébé (Salon)', category: 'Cheveux', botanical: 'chebe', description: 'Préparation fraîche faite au salon le jour-même', salePrice: 8500, image: '/images/kene_custom_botanical_bottle.png' },
            { id: 'p4', name: 'Lait Hydratant Solaire L’Oréal SPF50+', category: 'Corps', botanical: 'baobab', description: 'Protection solaire incolore haute défense', salePrice: 19500, image: '/images/botanical_ingredients_flatlay.jpg' },
            { id: 'p5', name: 'Formulation Dermo-Awa Sur-Mesure #402', category: 'Soins', botanical: 'bissap', description: 'Sérum personnalisé préparé sur recommandation Dermo-IA', salePrice: 28500, image: '/images/kene_official_logo.jpg' },
          ];
        }

        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Failed to fetch products', error);
        setProducts([
          { id: 'p1', name: 'Beurre de Karité Brut de Korhogo', category: 'Karité', botanical: 'karité', description: 'Nourrit & répare les peaux très sèches', salePrice: 9500, image: '/images/kene_botanical_lab_serum.jpg' },
          { id: 'p2', name: 'Sérum Niacinamide 10% & Zinc Dermo', category: 'Visage', botanical: 'moringa', description: 'Anti-taches PIH & régulation sébum', salePrice: 16500, image: '/images/afro_skin_spectral_scanner.jpg' },
          { id: 'p3', name: 'Masque Frais Avocat & Chébé (Salon)', category: 'Cheveux', botanical: 'chebe', description: 'Préparation fraîche faite au salon le jour-même', salePrice: 8500, image: '/images/kene_custom_botanical_bottle.png' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, activeBotanical, selectedSalon]);

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id);
    let newCart;
    
    if (existing) {
      newCart = cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { 
        id: product.id, 
        name: product.name, 
        price: product.salePrice, 
        quantity: 1 
      }];
    }
    
    saveCart(newCart);
    
    toast({
      title: "🛒 Produit Ajouté au Panier",
      description: `${product.name} a été ajouté à votre commande auprès de l'établissement ${selectedSalon.name}.`,
    });
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0A0603] text-white pb-28 font-sans">
      {/* Header (Client Storefront - No Vendor Admin Links) */}
      <header className="sticky top-0 z-40 bg-[#1A1410]/95 backdrop-blur-md border-b border-white/10 p-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <BackButton fallbackUrl="/portal" />
          <div>
            <h1 className="text-lg font-display text-white font-black flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C8951E]" /> Boutiques des Instituts & Salons Partners
            </h1>
            <p className="text-[10px] text-white/50 font-mono">Achetez vos soins certifiés directement auprès des entreprises partenaires</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* Salon Selector Bar */}
        <div className="bg-[#1A1410] border border-white/10 p-4 rounded-3xl space-y-2 shadow-xl">
          <label className="text-xs font-bold text-[#C8951E] font-display flex items-center gap-1.5 uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-[#C8951E]" /> Choisir la Boutique d'un Établissement Partner :
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {salonsList.map((salon) => (
              <button
                key={salon.id}
                onClick={() => setSelectedSalon(salon)}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  selectedSalon.id === salon.id
                    ? 'bg-[#C8951E]/20 border-[#C8951E] text-white shadow-lg'
                    : 'bg-[#0A0603] border-white/10 text-white/60 hover:border-white/30'
                }`}
              >
                <div>
                  <h4 className="font-bold text-xs font-display text-white leading-tight">{salon.name}</h4>
                  <span className="text-[10px] text-white/40 block mt-0.5">{salon.city}</span>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md mt-2 w-fit font-mono ${
                  salon.active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {salon.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Disabled Store State Notice */}
        {!selectedSalon.active ? (
          <div className="bg-gradient-to-r from-red-950/40 via-[#1A1410] to-[#0A0603] border border-red-500/30 rounded-3xl p-8 text-center space-y-3">
            <Lock className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="font-display font-bold text-lg text-white">Boutique en Ligne Désactivée par cet Établissement</h3>
            <p className="text-xs text-white/60 font-sans max-w-md mx-auto">
              L'établissement <strong>{selectedSalon.name} ({selectedSalon.city})</strong> ne propose pas la vente en ligne actuellement. Les soins sont disponibles uniquement sur place au salon.
            </p>
          </div>
        ) : (
          <>
            {/* Banner */}
            <div className="relative rounded-3xl p-6 overflow-hidden bg-[#1A1410] border border-[#C8951E]/30 shadow-2xl">
              <div className="relative z-10 space-y-2 max-w-xl">
                <span className="text-xs font-bold text-[#C8951E] uppercase tracking-widest font-display flex items-center gap-1.5 bg-[#C8951E]/10 border border-[#C8951E]/30 px-3 py-0.5 rounded-full w-fit">
                  <Sparkles className="w-3.5 h-3.5 text-[#C8951E]" /> Boutique Officielle : {selectedSalon.name}
                </span>
                <h2 className="font-display font-black text-2xl text-white">
                  Soins Botaniques & Formules Sur-Mesure
                </h2>
                <p className="text-xs text-white/60 font-sans">
                  Retrait Click & Collect express sous 1 heure en salon ou livraison sécurisée Mobile Money.
                </p>
              </div>
            </div>

            {/* Categories */}
            <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold font-display transition cursor-pointer ${
                    activeCategory === cat 
                      ? 'bg-[#C8951E] text-[#0F0A05] shadow-md shadow-[#C8951E]/20' 
                      : 'bg-[#1A1410] border border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Botanicals Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {BOTANICALS.map(bot => (
                <button
                  key={bot.value}
                  onClick={() => setActiveBotanical(activeBotanical === bot.value ? null : bot.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    activeBotanical === bot.value
                      ? 'border-[#C8951E] bg-[#C8951E]/20 text-[#F3E5AB]'
                      : 'border-white/10 bg-[#1A1410] text-white/60 hover:border-white/30'
                  }`}
                >
                  {bot.label}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {!loading && products.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="col-span-full py-12 text-center text-white/40 font-sans"
                  >
                    Aucun produit cosmétique disponible pour ce filtre.
                  </motion.div>
                )}

                {!loading && products.map((product, index) => (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-[#1A1410] rounded-3xl p-4 flex flex-col border border-white/10 hover:border-[#C8951E]/50 transition-all shadow-xl group"
                  >
                    <div className="aspect-square bg-[#0A0603] rounded-2xl mb-3 overflow-hidden border border-white/5 relative">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#C8951E]/30">
                          <ShoppingBag size={48} />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#F3E5AB] bg-[#0A0603]/80 border border-[#C8951E]/40 px-2 py-0.5 rounded-md backdrop-blur-md">
                          {product.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="text-white font-display font-bold text-sm group-hover:text-[#C8951E] transition-colors leading-snug">
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="text-xs text-white/50 font-sans mt-1 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-xs text-white/40 block font-mono">Prix Client</span>
                          <span className="text-[#F3E5AB] font-display font-black text-base">
                            {product.salePrice.toLocaleString('fr-FR')} <span className="text-xs font-normal">FCFA</span>
                          </span>
                        </div>

                        <Button 
                          onClick={() => addToCart(product)}
                          className="bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] hover:opacity-95 font-bold rounded-xl h-9 text-xs px-3 shadow-md cursor-pointer"
                        >
                          + Ajouter
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </main>

      {/* Floating Cart Badge Bar */}
      <AnimatePresence>
        {cartItemCount > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50"
          >
            <div className="bg-gradient-to-r from-[#F3E5AB] via-[#C8951E] to-[#D4AF37] rounded-3xl p-4 shadow-2xl shadow-[#C8951E]/30 flex items-center justify-between text-[#0F0A05]">
              <div className="flex items-center gap-3">
                <div className="relative bg-[#0F0A05] text-white p-2.5 rounded-2xl">
                  <ShoppingBag className="w-5 h-5 text-[#C8951E]" />
                  <span className="absolute -top-1.5 -right-1.5 bg-[#8A1C14] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-[#0F0A05]">
                    {cartItemCount}
                  </span>
                </div>
                <div>
                  <p className="font-display font-black text-sm text-[#0F0A05]">Mon Panier chez {selectedSalon.name}</p>
                  <p className="text-xs font-mono font-bold text-[#0F0A05]/80">
                    Total: {cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('fr-FR')} FCFA
                  </p>
                </div>
              </div>
              <Link href="/checkout">
                <Button className="bg-[#0F0A05] text-white hover:bg-[#0F0A05]/90 rounded-xl text-xs font-bold h-10 px-4 cursor-pointer">
                  Commander (Wave / OM)
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
