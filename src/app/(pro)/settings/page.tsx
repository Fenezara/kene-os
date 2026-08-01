'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Building2, MapPin, FileText, CreditCard, Shield, Camera, Save, LogOut, ShoppingBag, Globe, Wifi, Check, MessageSquare, Smartphone, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const SECTIONS = [
  { id: 'identity', label: 'Identité du Salon', icon: Building2, color: '#C8951E' },
  { id: 'address', label: 'Coordonnées & Horaires', icon: MapPin, color: '#4E9FD1' },
  { id: 'fiscal', label: 'Conformité Fiscale SYSCOHADA', icon: FileText, color: '#4CAF6E' },
  { id: 'portal_client', label: 'Vitrine & Portail Client', icon: ShoppingBag, color: '#D4AF37' },
  { id: 'portal_admin', label: 'Infrastructure & Multi-Tenants', icon: Globe, color: '#9B51E0' },
  { id: 'subscription', label: 'Abonnement Kènè', icon: CreditCard, color: '#8A1C14' },
  { id: 'security', label: 'Sécurité & Accès', icon: Shield, color: '#E07A2B' },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('identity');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [settings, setSettings] = useState({
    identity: { commercialName: 'Kènè Afro Beauty & Dermo Spa', legalName: 'Kènè Cosmetics SARL', type: 'Institut', logoUrl: '' },
    address: { street: 'Boulevard Latrille, Cocody Deux-Plateaux, Abidjan', phone: '+225 07 08 09 10 11', email: 'contact@kene-beauty.ci' },
    fiscal: { rccm: 'CI-ABJ-2024-B-12345', nif: '2409182Z', vatRate: 18, country: 'CI', currency: 'XOF' },
    portal_client: {
      isBoutiqueOnline: true,
      showPricesInBoutique: true,
      allowClickAndCollect: true,
      acceptMobileMoney: true,
      loyaltyPointsRate: 10, // 10 points per 10,000 FCFA
      autoWelcomeWhatsapp: "Bonjour ! Bienvenue chez Kènè Beauty. Votre soin personnalisée est prêt !",
    },
    portal_admin: {
      tenantId: 'KENE-ABIDJAN-402',
      offlineSyncInterval: 30, // seconds
      platformCommission: 2.5,
      autoBackup: true,
    },
    subscription: { plan: 'Pro Multi-Salons', renewalDate: '2027-01-01' }
  });

  useEffect(() => {
    const savedTenant = localStorage.getItem('kene_tenant_settings');
    if (savedTenant) {
      try {
        const parsed = JSON.parse(savedTenant);
        const savedLogo = localStorage.getItem('kene_custom_salon_logo');
        if (savedLogo && parsed.identity) parsed.identity.logoUrl = savedLogo;
        setSettings(prev => ({ ...prev, ...parsed }));
        setLoading(false);
        return;
      } catch (e) {}
    }

    fetch('/api/tenant/settings')
      .then(res => res.json())
      .then(data => {
        if (data.identity) {
          const savedLogo = localStorage.getItem('kene_custom_salon_logo');
          if (savedLogo) data.identity.logoUrl = savedLogo;
          setSettings(prev => ({ ...prev, ...data }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      handleChange('identity', 'logoUrl', base64);
      localStorage.setItem('kene_custom_salon_logo', base64);
      toast({
        title: '✨ Logo du Salon Imprimé & Sauvegardé !',
        description: 'Le logo de votre établissement s\'affichera sur votre espace pro, tickets POS et étiquettes.',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...(prev as any)[section], [field]: value }
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      localStorage.setItem('kene_tenant_settings', JSON.stringify(settings));
      await fetch('/api/tenant/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      toast({
        title: '✅ Tous les Paramètres Multi-Portails Enregistrés !',
        description: `La configuration globale de "${settings.identity.commercialName || 'Votre Établissement'}" est à jour.`,
      });
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de sauvegarder.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    document.cookie = "kene-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-2 border-[#C8951E] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-8 font-sans">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#1A1410] border border-white/10 p-6 rounded-3xl shadow-xl">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl font-display font-black text-white flex items-center gap-3">
            <Settings className="text-[#C8951E] w-7 h-7" />
            Centre de Paramétrage <span className="text-[#F3E5AB]">Multi-Portails</span>
          </h1>
          <p className="text-white/40 text-xs mt-1">Configurez les paramètres de l'Espace Pro, de la Vitrine Clientèle et de l'Infrastructure SaaS</p>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-2xl font-black text-[#0F0A05] flex items-center gap-2 cursor-pointer shadow-lg hover:opacity-95"
          style={{ background: 'linear-gradient(135deg, #F3E5AB, #C8951E)' }}
        >
          {saving ? <div className="w-4 h-4 border-2 border-[#0F0A05] border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4 text-[#0F0A05]" />}
          <span className="text-[#0F0A05] font-black text-xs">Enregistrer les Modifications</span>
        </motion.button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* SIDEBAR NAVIGATION */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full md:w-64 shrink-0 space-y-2">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 relative overflow-hidden text-left cursor-pointer border ${
                activeSection === section.id
                  ? 'bg-white/10 border-white/20 text-white font-black shadow-md'
                  : 'bg-[#1A1410] border-white/5 text-white/50 hover:text-white hover:border-white/10'
              }`}
            >
              {activeSection === section.id && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-0 bottom-0 w-1.5"
                  style={{ backgroundColor: section.color }}
                />
              )}
              <section.icon className="w-5 h-5 shrink-0" style={{ color: section.color }} />
              <span className={`text-xs font-bold ${activeSection === section.id ? 'text-white' : 'text-white/60'}`}>
                {section.label}
              </span>
            </button>
          ))}
        </motion.div>

        {/* MAIN CONTENT */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 bg-[#1A1410] border border-white/10 rounded-3xl overflow-hidden relative shadow-2xl"
        >
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-current to-transparent" style={{ color: SECTIONS.find(s => s.id === activeSection)?.color }} />
          
          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              
              {/* --- IDENTITÉ --- */}
              {activeSection === 'identity' && (
                <motion.div key="identity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  <h2 className="text-xl font-display font-bold text-white mb-6">Identité de l'Établissement</h2>
                  
                  <div className="flex items-center gap-6 mb-8 bg-black/40 p-4 rounded-2xl border border-white/5">
                    <div 
                      onClick={() => logoInputRef.current?.click()}
                      className="w-20 h-20 rounded-2xl bg-white/5 border-2 border-[#C8951E]/40 flex items-center justify-center relative overflow-hidden group cursor-pointer shadow-xl hover:border-[#C8951E] transition-all shrink-0"
                    >
                      {settings.identity.logoUrl ? (
                         <img src={settings.identity.logoUrl} alt="Logo Salon" className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-8 h-8 text-[#C8951E]" />
                      )}
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm">Logo Officiel du Salon</h3>
                      <p className="text-white/40 text-xs mt-1">Imprimé sur les tickets de caisse POS, étiquettes produits et vitrine client.</p>
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="mt-2 text-xs text-[#C8951E] hover:underline font-bold font-mono cursor-pointer flex items-center gap-1"
                      >
                        <Camera className="w-3.5 h-3.5" /> Télécharger mon logo (PNG/JPG)
                      </button>
                      <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs text-white/60">Nom Commercial</label>
                      <input 
                        type="text" 
                        value={settings.identity.commercialName}
                        onChange={e => handleChange('identity', 'commercialName', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-[#C8951E] transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-white/60">Nom Légal de la Société</label>
                      <input 
                        type="text" 
                        value={settings.identity.legalName}
                        onChange={e => handleChange('identity', 'legalName', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-[#C8951E] transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-white/60">Type d'Établissement</label>
                      <select 
                        value={settings.identity.type}
                        onChange={e => handleChange('identity', 'type', e.target.value)}
                        className="w-full bg-[#1A1410] border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-[#C8951E] transition-colors cursor-pointer"
                      >
                        <option value="Institut">Institut de Beauté</option>
                        <option value="Spa">Spa & Bien-être</option>
                        <option value="Dermo">Clinique Dermo-cosmétique</option>
                        <option value="Coiffure">Salon de Coiffure Afro</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* --- COORDONNÉES --- */}
              {activeSection === 'address' && (
                <motion.div key="address" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  <h2 className="text-xl font-display font-bold text-white mb-6">Coordonnées & Emplacement</h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs text-white/60">Adresse Physique Complète</label>
                      <textarea 
                        value={settings.address.street}
                        onChange={e => handleChange('address', 'street', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#4E9FD1] transition-colors h-24 resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs text-white/60">Téléphone Principal</label>
                        <input 
                          type="tel" 
                          value={settings.address.phone}
                          onChange={e => handleChange('address', 'phone', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-[#4E9FD1] transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-white/60">Email Professionnel</label>
                        <input 
                          type="email" 
                          value={settings.address.email}
                          onChange={e => handleChange('address', 'email', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-[#4E9FD1] transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* --- FISCAL --- */}
              {activeSection === 'fiscal' && (
                <motion.div key="fiscal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  <h2 className="text-xl font-display font-bold text-white mb-6">Conformité Fiscale SYSCOHADA</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs text-white/60">Numéro RCCM</label>
                      <input 
                        type="text" 
                        value={settings.fiscal.rccm}
                        onChange={e => handleChange('fiscal', 'rccm', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-[#4CAF6E] transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-white/60">NIF / Numéro de Contribuable</label>
                      <input 
                        type="text" 
                        value={settings.fiscal.nif}
                        onChange={e => handleChange('fiscal', 'nif', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-[#4CAF6E] transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-white/60">Pays Fiscal</label>
                      <select 
                        value={settings.fiscal.country}
                        onChange={e => handleChange('fiscal', 'country', e.target.value)}
                        className="w-full bg-[#1A1410] border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-[#4CAF6E] transition-colors cursor-pointer"
                      >
                        <option value="CI">Côte d'Ivoire (CI) 🇨🇮</option>
                        <option value="SN">Sénégal (SN) 🇸🇳</option>
                        <option value="ML">Mali (ML) 🇲🇱</option>
                        <option value="BF">Burkina Faso (BF) 🇧🇫</option>
                        <option value="TG">Togo (TG) 🇹🇬</option>
                        <option value="BJ">Bénin (BJ) 🇧🇯</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-white/60">Devise Principale</label>
                      <select 
                        value={settings.fiscal.currency}
                        onChange={e => handleChange('fiscal', 'currency', e.target.value)}
                        className="w-full bg-[#1A1410] border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-[#4CAF6E] transition-colors cursor-pointer"
                      >
                        <option value="XOF">Franc CFA UEMOA (XOF)</option>
                        <option value="XAF">Franc CFA CEMAC (XAF)</option>
                        <option value="EUR">Euro (€)</option>
                        <option value="USD">Dollar ($)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-white/60">Taux de TVA Officiel (%)</label>
                      <input 
                        type="number" 
                        value={settings.fiscal.vatRate}
                        onChange={e => handleChange('fiscal', 'vatRate', Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-[#4CAF6E] transition-colors"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* --- PORTAIL CLIENT --- */}
              {activeSection === 'portal_client' && (
                <motion.div key="portal_client" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-display font-bold text-[#F3E5AB]">Configuration de la Vitrine & Portail Client</h2>
                      <p className="text-xs text-white/50 mt-1">Paramétrez ce que vos clientes voient lorsqu'elles visitent votre boutique et réservent des soins.</p>
                    </div>
                    <ShoppingBag className="w-8 h-8 text-[#D4AF37]" />
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">Activer la Boutique Clientèle en Ligne</h4>
                        <p className="text-xs text-white/40">Permet aux clientes d'acheter vos soins botaniques en ligne.</p>
                      </div>
                      <button
                        onClick={() => handleChange('portal_client', 'isBoutiqueOnline', !settings.portal_client.isBoutiqueOnline)}
                        className={`w-12 h-6 rounded-full p-1 transition cursor-pointer ${settings.portal_client.isBoutiqueOnline ? 'bg-emerald-500' : 'bg-white/20'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition transform ${settings.portal_client.isBoutiqueOnline ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="p-4 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">Afficher les Prix en FCFA en Vitrine</h4>
                        <p className="text-xs text-white/40">Si désactivé, les prix s'affichent "Sur Devis".</p>
                      </div>
                      <button
                        onClick={() => handleChange('portal_client', 'showPricesInBoutique', !settings.portal_client.showPricesInBoutique)}
                        className={`w-12 h-6 rounded-full p-1 transition cursor-pointer ${settings.portal_client.showPricesInBoutique ? 'bg-emerald-500' : 'bg-white/20'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition transform ${settings.portal_client.showPricesInBoutique ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="p-4 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">Option Click & Collect 1h en Salon</h4>
                        <p className="text-xs text-white/40">Autorise le retrait rapide au comptoir d'accueil.</p>
                      </div>
                      <button
                        onClick={() => handleChange('portal_client', 'allowClickAndCollect', !settings.portal_client.allowClickAndCollect)}
                        className={`w-12 h-6 rounded-full p-1 transition cursor-pointer ${settings.portal_client.allowClickAndCollect ? 'bg-emerald-500' : 'bg-white/20'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition transform ${settings.portal_client.allowClickAndCollect ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="text-xs text-white/60">Message d'Accueil WhatsApp Automatique</label>
                      <input 
                        type="text" 
                        value={settings.portal_client.autoWelcomeWhatsapp}
                        onChange={e => handleChange('portal_client', 'autoWelcomeWhatsapp', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* --- PORTAIL ADMIN / INFRASTRUCTURE --- */}
              {activeSection === 'portal_admin' && (
                <motion.div key="portal_admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-display font-bold text-[#9B51E0]">Configuration Infrastructure & SaaS</h2>
                      <p className="text-xs text-white/50 mt-1">Paramètres de synchronisation hors-ligne, identifiant multi-tenants et statut PWA v3.</p>
                    </div>
                    <Globe className="w-8 h-8 text-[#9B51E0]" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-2">
                      <span className="text-[10px] text-white/40 uppercase block font-mono">Identifiant Salon (Tenant ID)</span>
                      <span className="text-lg font-mono font-bold text-[#9B51E0]">{settings.portal_admin.tenantId}</span>
                    </div>

                    <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-2">
                      <span className="text-[10px] text-white/40 uppercase block font-mono">Statut ServiceWorker PWA</span>
                      <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                        <Wifi className="w-4 h-4 text-emerald-400" /> Mode Hors-Ligne V3 Actif
                      </span>
                    </div>

                    <div className="space-y-2 col-span-2">
                      <label className="text-xs text-white/60">Intervalle de Synchronisation Auto (secondes)</label>
                      <input 
                        type="number" 
                        value={settings.portal_admin.offlineSyncInterval}
                        onChange={e => handleChange('portal_admin', 'offlineSyncInterval', Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-[#9B51E0] transition-colors"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* --- SUBSCRIPTION --- */}
              {activeSection === 'subscription' && (
                <motion.div key="subscription" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  <h2 className="text-xl font-display font-bold text-white mb-6">Abonnement Kènè</h2>
                  <div className="bg-[#8A1C14]/10 border border-[#8A1C14]/30 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#8A1C14]/20 rounded-full blur-3xl" />
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-[#8A1C14] font-bold text-sm mb-1">Plan Actuel</p>
                        <h3 className="text-3xl font-display font-black text-white">{settings.subscription.plan}</h3>
                      </div>
                      <span className="bg-[#8A1C14] text-white text-xs font-bold px-3 py-1 rounded-full">Actif</span>
                    </div>
                    <p className="text-white/60 text-sm mb-6">
                      Renouvellement automatique le <strong className="text-white">{new Date(settings.subscription.renewalDate).toLocaleDateString('fr-FR')}</strong>
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full md:w-auto bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl font-bold transition-colors text-xs"
                    >
                      Upgrader mon plan
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* --- SECURITY --- */}
              {activeSection === 'security' && (
                <motion.div key="security" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  <h2 className="text-xl font-display font-bold text-white mb-6">Sécurité & Accès</h2>
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                      <h3 className="text-lg font-bold text-white mb-2">Mot de Passe Administrateur</h3>
                      <p className="text-white/50 text-sm mb-4">Modifiez le mot de passe d'accès à la caisse et aux rapports.</p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl font-bold transition-colors text-xs"
                      >
                        Changer de mot de passe
                      </motion.button>
                    </div>

                    <div className="p-6 bg-[#C8951E]/10 border border-[#C8951E]/30 rounded-2xl">
                      <h3 className="text-lg font-bold text-[#F3E5AB] mb-2">Données de Démonstration</h3>
                      <p className="text-white/50 text-sm mb-4">Réinitialiser ou recharger les données de test (Clients, RDV, Stocks et Écritures SYSCOHADA).</p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          toast({ title: '✅ Données Démo Rechargées', description: 'Le salon a été réinitialisé avec des données de test fraîches.' });
                        }}
                        className="bg-[#C8951E] hover:bg-[#C8951E]/90 text-[#0F0A05] px-6 py-2.5 rounded-xl font-bold transition-colors text-xs"
                      >
                        ⚡ Recharger les Données Démo
                      </motion.button>
                    </div>

                    <div className="p-6 bg-[#E07A2B]/10 border border-[#E07A2B]/30 rounded-2xl">
                      <h3 className="text-lg font-bold text-[#E07A2B] mb-2">Déconnexion</h3>
                      <p className="text-white/50 text-sm mb-4">Se déconnecter de la plateforme Kènè de cet appareil.</p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="bg-[#E07A2B] hover:bg-[#E07A2B]/80 text-[#0F0A05] px-6 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 text-xs"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion globale
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
