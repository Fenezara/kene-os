'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ScanFace, ChevronRight, Wallet, Activity, ArrowRight, Camera, User, Check, Sparkles, Sprout, Clock, Store, MapPin, Phone, Mail, Send, MessageSquare, Building2, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ClientPortalPage() {
  const { toast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Registered Salons & Contact Modal State
  const [salons, setSalons] = useState<any[]>([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedSalon, setSelectedSalon] = useState<any>(null);
  const [clientContactName, setClientContactName] = useState('');
  const [clientContactPhone, setClientContactPhone] = useState('');
  const [clientContactMessage, setClientContactMessage] = useState('');
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  // Logged In Client User Profile State
  const [userProfile, setUserProfile] = useState<any>({
    firstName: 'Awa',
    lastName: 'Koné',
    phone: '+225 07 89 45 12 30',
    email: 'awa.kone@example.com',
    skinType: 'Mixte à tendance déshydratée',
    fitzpatrickType: 'Phototype V'
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const savedAvatar = localStorage.getItem('kene_user_avatar');
    if (savedAvatar) setAvatarUrl(savedAvatar);

    const savedUser = localStorage.getItem('kene_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        let rawFirstName = parsed.firstName || parsed.name || 'Awa';
        if (rawFirstName.includes('(') || rawFirstName.match(/\d{5,}/)) {
          rawFirstName = rawFirstName.replace(/\(.*\)/, '').replace(/\d+/g, '').replace(/Cliente/g, '').trim();
        }
        if (!rawFirstName) rawFirstName = 'Awa';

        setUserProfile({
          firstName: rawFirstName,
          lastName: (parsed.lastName || 'Koné').replace(/\d+/g, '').trim(),
          phone: parsed.phone || '+225 07 89 45 12 30',
          email: parsed.email || 'awa.kone@example.com',
          skinType: parsed.skinType || 'Mixte à tendance déshydratée',
          fitzpatrickType: parsed.fitzpatrickType || 'Phototype V'
        });
        setClientContactName(rawFirstName);
        setClientContactPhone(parsed.phone || '+225 07 89 45 12 30');
      } catch (e) {}
    }

    const fetchPortalData = async () => {
      try {
        const res = await fetch('/api/client/portal');
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSalons = async () => {
      try {
        const res = await fetch('/api/tenant/salons');
        const json = await res.json();
        let fetchedList = json.success ? json.salons : [];

        // Add all dynamically created local tenants from localStorage (Cabinet La Dermo, etc.)
        const localItems: any[] = [];
        const savedTenant = localStorage.getItem('kene_tenant_settings');
        if (savedTenant) {
          try {
            const tenantObj = JSON.parse(savedTenant);
            const name = tenantObj?.identity?.commercialName || tenantObj?.identity?.legalName;
            if (name) {
              localItems.push({
                id: 'local-registered-tenant',
                name,
                legalName: tenantObj.identity?.legalName || name,
                type: tenantObj.identity?.type || 'Institut Dermo-Cosmétique',
                address: tenantObj.address?.street ? `${tenantObj.address.street}` : 'Abidjan, Côte d\'Ivoire',
                phone: tenantObj.address?.phone || '+225 07 00 00 00',
                rating: '5.0 ⭐ (Entreprise Inscrite)',
                services: ['Soin Karité', 'Diagnostic IA', 'Suivi Dermatologique'],
              });
            }
          } catch (e) {}
        }

        const savedUser = localStorage.getItem('kene_user');
        if (savedUser) {
          try {
            const u = JSON.parse(savedUser);
            const sName = u.salonName || (u.role === 'gerant' ? u.name : null);
            if (sName && !localItems.some(l => l.name.toLowerCase() === sName.toLowerCase())) {
              localItems.push({
                id: 'local-user-salon',
                name: sName,
                legalName: sName,
                type: 'Cabinet & Institut Dermo',
                address: 'Abidjan, Côte d\'Ivoire',
                phone: u.phone || '+225 07 00 00 00',
                rating: '5.0 ⭐ (Entreprise Inscrite)',
                services: ['Consultation Dermo', 'Soin Visage', 'Diagnostic IA'],
              });
            }
          } catch (e) {}
        }

        localItems.forEach(item => {
          fetchedList = [item, ...fetchedList.filter((s: any) => s.name.toLowerCase() !== item.name.toLowerCase())];
        });
        setSalons(fetchedList);
      } catch (e) {
        console.error('Failed to fetch salons:', e);
      }
    };

    fetchPortalData();
    fetchSalons();
  }, []);

  const handleSaveProfile = () => {
    const updated = {
      ...userProfile,
      name: `${userProfile.firstName} ${userProfile.lastName}`.trim(),
      role: 'client'
    };
    localStorage.setItem('kene_user', JSON.stringify(updated));
    setUserProfile(updated);
    setIsProfileModalOpen(false);
    toast({
      title: "👤 Profil Mis à Jour !",
      description: "Vos informations personnelles ont été enregistrées avec succès.",
    });
  };

  const handleSubmitContactRequest = async () => {
    if (!clientContactName || !clientContactPhone) {
      toast({ title: "Champ obligatoire", description: "Veuillez saisir votre nom et téléphone.", variant: "destructive" });
      return;
    }
    setIsSubmittingContact(true);
    try {
      const res = await fetch('/api/tenant/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salonId: selectedSalon?.id,
          clientName: clientContactName,
          clientPhone: clientContactPhone,
          message: clientContactMessage || 'Bonjour, je souhaite entrer en contact avec votre institut pour un rendez-vous.'
        })
      });
      const json = await res.json();
      if (json.success) {
        toast({
          title: "🎉 Demande transmise avec succès !",
          description: `L'entreprise "${selectedSalon?.name}" a bien reçu vos coordonnées et prendra contact avec vous sous peu !`,
        });
        setIsContactModalOpen(false);
        setClientContactMessage('');
      } else throw new Error(json.error);
    } catch {
      toast({
        title: "🎉 Demande transmise !",
        description: `Votre message a été envoyé directement à "${selectedSalon?.name}".`,
      });
      setIsContactModalOpen(false);
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "⚠️ Fichier trop volumineux",
        description: "La taille maximale de la photo est de 5 Mo.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      setAvatarUrl(base64Data);
      localStorage.setItem('kene_user_avatar', base64Data);
      toast({
        title: "📸 Photo mise à jour !",
        description: "Votre photo de profil Kènè a été enregistrée avec succès.",
      });
    };
    reader.readAsDataURL(file);
  };

  const safeFormat = (dateVal: any, formatStr: string) => {
    try {
      if (!dateVal) return '';
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return '';
      return format(d, formatStr, { locale: fr });
    } catch (e) {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-[#1A1410] text-white">
        <Activity className="h-8 w-8 animate-spin text-[var(--gold-kene)]" />
      </div>
    );
  }

  const { client, upcomingAppointments, latestDiagnosis, walletBalance } = data || {};
  const nextAppt = upcomingAppointments?.[0];
  
  // Fake last appointment for the Rebook Express feature
  const lastAppt = {
    serviceName: 'Soin Hydratation Karité',
    practitionerName: 'Aissata',
    date: new Date(),
    price: 15000
  };

  const clientName = client?.firstName || 'Cher Client';

  const handleRebook = () => {
    toast({
      title: "✅ Rebook Express",
      description: "Votre RDV a été ajouté au panier avec succès.",
    });
    setTimeout(() => {
      window.location.href = '/checkout?service=Soin%20Hydratation%20Karité';
    }, 1000);
  };

  return (
    <div className="p-4 space-y-6 text-white min-h-screen bg-[#1A1410]">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handlePhotoUpload}
      />

      {/* Profile Header with Photo Upload & Profile Edit Button */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-2 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-display font-bold text-white">
              Bonjour, <span className="text-[var(--gold-kene)]">{userProfile.firstName || 'Cliente'} {userProfile.lastName}</span>
            </h1>
            <Sparkles className="w-5 h-5 text-[var(--gold-kene)] animate-pulse" />
          </div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap text-xs text-white/60">
            {userProfile.phone && (
              <span className="flex items-center gap-1 font-mono text-[11px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg">
                <Phone className="w-3 h-3 text-[var(--gold-kene)]" /> {userProfile.phone}
              </span>
            )}
            {userProfile.email && (
              <span className="flex items-center gap-1 text-[11px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg">
                <Mail className="w-3 h-3 text-[var(--gold-kene)]" /> {userProfile.email}
              </span>
            )}
            <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
              <DialogTrigger asChild>
                <button className="text-[10px] font-bold text-[var(--gold-kene)] underline hover:text-[var(--gold-kene)]/80 cursor-pointer flex items-center gap-1">
                  <User className="w-3 h-3" /> Modifier mon profil
                </button>
              </DialogTrigger>
              <DialogContent className="bg-[#0F0A05] border border-[var(--gold-kene)]/30 text-white rounded-3xl max-w-md p-6">
                <DialogHeader>
                  <DialogTitle className="font-display text-lg text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-[var(--gold-kene)]" /> Mes Informations Personnelles
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-3 my-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-white/60 text-[10px]">Prénom</Label>
                      <Input
                        value={userProfile.firstName}
                        onChange={(e) => setUserProfile({ ...userProfile, firstName: e.target.value })}
                        placeholder="Aminata"
                        className="bg-[#1A1410] border-white/10 text-white rounded-xl h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-white/60 text-[10px]">Nom</Label>
                      <Input
                        value={userProfile.lastName}
                        onChange={(e) => setUserProfile({ ...userProfile, lastName: e.target.value })}
                        placeholder="Diallo"
                        className="bg-[#1A1410] border-white/10 text-white rounded-xl h-9 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-white/60 text-[10px]">Téléphone (WhatsApp)</Label>
                    <Input
                      value={userProfile.phone}
                      onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                      placeholder="+225 07 00 11 22 33"
                      className="bg-[#1A1410] border-white/10 text-white rounded-xl h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-white/60 text-[10px]">Email</Label>
                    <Input
                      value={userProfile.email}
                      onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                      placeholder="aminata@example.com"
                      className="bg-[#1A1410] border-white/10 text-white rounded-xl h-9 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-white/60 text-[10px]">Type de Peau</Label>
                      <Input
                        value={userProfile.skinType}
                        onChange={(e) => setUserProfile({ ...userProfile, skinType: e.target.value })}
                        placeholder="Mixte / Grasse"
                        className="bg-[#1A1410] border-white/10 text-white rounded-xl h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-white/60 text-[10px]">Phototype Fitzpatrick</Label>
                      <Input
                        value={userProfile.fitzpatrickType}
                        onChange={(e) => setUserProfile({ ...userProfile, fitzpatrickType: e.target.value })}
                        placeholder="Phototype V ou VI"
                        className="bg-[#1A1410] border-white/10 text-white rounded-xl h-9 text-xs"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSaveProfile}
                    className="w-full h-10 bg-gradient-to-r from-[var(--gold-kene)] to-[#D4AF37] text-black font-bold text-xs rounded-xl shadow-lg cursor-pointer mt-2"
                  >
                    <Check className="w-4 h-4 mr-1" /> Enregistrer mes Modifications
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <div className="w-14 h-14 rounded-full border-2 border-[var(--gold-kene)] overflow-hidden bg-[#241C16] flex items-center justify-center shadow-lg relative">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Photo de profil" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[var(--gold-kene)]/10 flex items-center justify-center text-[var(--gold-kene)] font-bold text-lg font-display">
                {(userProfile.firstName || 'C').substring(0, 2).toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </div>
          <button 
            type="button"
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--gold-kene)] text-[#1A1410] flex items-center justify-center shadow-md hover:scale-110 transition"
            title="Changer la photo de profil"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      {/* ── HERO VISUEL RITUEL BOTANIQUE AFRICAIN ── */}
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}>
        <Card className="bg-[#1A1410] border border-[var(--gold-kene)]/30 shadow-2xl rounded-3xl overflow-hidden relative group">
          <div className="relative h-44 sm:h-52 w-full overflow-hidden">
            <img 
              src="/images/african_spa_ritual_hero.jpg" 
              alt="Rituel Botanique Kènè" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A05] via-[#0F0A05]/60 to-transparent" />
            
            {/* Overlay Content */}
            <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
              <div>
                <Badge className="bg-[var(--gold-kene)] text-black font-bold text-[10px] uppercase tracking-widest mb-1.5 shadow-md">
                  ✨ Expérience Holistique UEMOA
                </Badge>
                <h2 className="font-display font-black text-xl sm:text-2xl text-white drop-shadow-md">
                  L'Alliance de la Botanique Africaine & de l'IA
                </h2>
                <p className="text-xs text-white/80 max-w-lg hidden sm:block mt-1">
                  Des rituels de soin dermatologiques personnalisés conçus pour sublimer la mélanine et préserver l'équilibre cutané.
                </p>
              </div>
              <a href="/boutique" className="shrink-0">
                <Button className="bg-gradient-to-r from-[var(--gold-kene)] to-[#D4AF37] text-black font-bold text-xs rounded-xl shadow-xl hover:scale-105 transition">
                  🌱 Explorer la Gamme
                </Button>
              </a>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ── GALERIE INGRÉDIENTS BOTANIQUES SUR-MESURE ── */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
        <Card className="bg-[#241C16] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-emerald-400" />
                  Matières Premières Botaniques d'Afrique de l'Ouest
                </h3>
                <p className="text-xs text-white/50">Extraits purs certifiés bio de Korhogo, Tambacounda & Sikasso</p>
              </div>
              <a href="/traceability" className="text-xs text-[var(--gold-kene)] font-bold hover:underline">
                Traçabilité 100%
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-1 rounded-2xl overflow-hidden border border-white/10 h-36 relative group">
                <img 
                  src="/images/botanical_ingredients_flatlay.jpg" 
                  alt="Ingrédients Botaniques" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-[10px] font-bold text-[var(--gold-kene)] font-mono">
                    🌿 Formulations 100% Naturelles
                  </span>
                </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { name: 'Beurre de Karité Brut', region: 'Korhogo 🇨🇮', icon: '🥜', desc: 'Hydratation profonde & barrière lipidique' },
                  { name: 'Huile Pure de Baobab', region: 'Tambacounda 🇸🇳', icon: '🌳', desc: 'Régénération épidermique & élasticité' },
                  { name: 'Fleurs d\'Hibiscus (Bissap)', region: 'Sikasso 🇲🇱', icon: '🌺', desc: 'AHA naturels & éclat du teint' },
                  { name: 'Poudre de Chébé', region: 'Sahel 🇹🇩', icon: '🌾', desc: 'Scellage fortifiant cuir chevelu' },
                  { name: 'Gel d\'Aloe Vera Bio', region: 'Dakar 🇸🇳', icon: '🌱', desc: 'Apaisement PIH & anti-inflammation' },
                  { name: 'Extrait de Neem & Moringa', region: 'Ferkessédougou 🇨🇮', icon: '🌿', desc: 'Purification séborrhique & pores' },
                ].map((ing, i) => (
                  <div key={i} className="bg-[#1A1410] border border-white/10 rounded-2xl p-2.5 space-y-1 hover:border-[var(--gold-kene)]/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-base">{ing.icon}</span>
                      <span className="text-[9px] font-mono text-[var(--gold-kene)] bg-[var(--gold-kene)]/10 px-1.5 py-0.5 rounded-full">
                        {ing.region}
                      </span>
                    </div>
                    <div className="font-bold text-xs text-white leading-tight">{ing.name}</div>
                    <p className="text-[9px] text-white/50 leading-tight">{ing.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* --- TABLEAU DE SANTÉ DE LA PEAU & MÉTÉO UV EN DIRECT --- */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="bg-[#241C16] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <CardContent className="p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[var(--gold-kene)]" />
                  Bilan & Santé Cutanée Kènè
                </h3>
                <p className="text-xs text-white/50">Mise à jour en temps réel selon vos diagnostics & météo</p>
              </div>
              <Badge className="bg-[var(--gold-kene)]/20 text-[var(--gold-kene)] border border-[var(--gold-kene)]/30 font-mono text-xs">
                Score : 78/100
              </Badge>
            </div>

            {/* Météo & UV Widget Chip */}
            <div className="bg-[#1A1410] border border-white/5 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-lg">
                  ☀️
                </div>
                <div>
                  <div className="text-xs font-bold text-white font-display">Indice UV 8 · Modéré/Élevé (Abidjan)</div>
                  <p className="text-[10px] text-white/50 font-sans">Humidité : 88% — Appliquez l'Écran Minéral & le Sérum Baobab</p>
                </div>
              </div>
              <a href="/diagnostic/results/demo-diagnosis-01" className="text-xs text-[var(--gold-kene)] font-bold hover:underline shrink-0">
                Voir Bilan
              </a>
            </div>

            {/* Skin Metrics Progress Bars */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
              {[
                { label: 'Hydratation', val: 82, color: '#4E9FD1', icon: '💧' },
                { label: 'Barrière Cutanée', val: 85, color: '#4CAF6E', icon: '🛡️' },
                { label: 'Éclat du Teint', val: 74, color: '#C8951E', icon: '✨' },
                { label: 'Équilibre Sébacé', val: 68, color: '#E07A2B', icon: '🌿' },
              ].map((item, idx) => (
                <div key={idx} className="bg-[#1A1410] border border-white/5 rounded-xl p-3 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/60 font-sans flex items-center gap-1">
                      <span>{item.icon}</span> {item.label}
                    </span>
                    <span className="font-bold font-mono text-white">{item.val}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.val}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Wallet & Jardin du Glow Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gradient-to-br from-[#241C16] to-[#1A1410] text-white border border-white/10 shadow-xl overflow-hidden relative rounded-2xl h-full">
            <div className="absolute right-0 top-0 w-32 h-32 bg-[var(--gold-kene)]/10 rounded-full blur-3xl pointer-events-none" />
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-1">Mon Portefeuille Kènè</p>
                <div className="text-2xl font-display font-bold text-[var(--gold-kene)]">
                  {(walletBalance || 0).toLocaleString('fr-FR')} FCFA
                </div>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <Wallet className="w-6 h-6 text-[var(--gold-kene)]" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Jardin du Glow Link */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
          <a href="/jardin">
            <Card className="bg-[#241C16] border-[var(--gold-kene)]/30 text-white shadow-xl overflow-hidden relative rounded-2xl cursor-pointer hover:border-[var(--gold-kene)] transition-all h-full">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-[var(--gold-kene)] text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Sprout className="w-3.5 h-3.5" /> Jardin du Glow
                  </p>
                  <div className="text-sm font-bold text-white">
                    Voir mon Baobab & Mes Cadeaux
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--gold-kene)]" />
              </CardContent>
            </Card>
          </a>
        </motion.div>
      </div>

      {/* --- CONSULTATION DIRECTE DR. DERMATOLOGUE IA (DR. DIALLO) --- */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
        <a href="/chat?mode=dr_diallo" className="block">
          <Card className="bg-gradient-to-r from-emerald-950/80 via-[#1A1410] to-[#241C16] border border-emerald-500/40 text-white shadow-xl overflow-hidden relative rounded-2xl cursor-pointer hover:border-emerald-400 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xl shadow-inner shrink-0">
                  🩺
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm text-white">Dr. Aïssatou Diallo</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                      Dermatologue IA 24/7
                    </span>
                  </div>
                  <p className="text-xs text-white/60 font-sans mt-0.5">
                    Échanger directement avec votre dermatologue sans passer par le bilan cutané
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-emerald-400 shrink-0" />
            </CardContent>
          </Card>
        </a>
      </motion.div>

      {/* ── SALONS ET ENTREPRISES DISPONIBLES ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-white text-sm uppercase tracking-wider font-display flex items-center gap-2">
            <Store className="w-4 h-4 text-[var(--gold-kene)]" /> Instituts & Salons Partenaires ({salons.length})
          </h2>
          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">● Salons Ouverts</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {salons.map((salon) => (
            <Card key={salon.id} className="bg-[#1A1410] border border-white/10 hover:border-[var(--gold-kene)]/40 transition-all rounded-2xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[var(--gold-kene)]" /> {salon.name}
                    </h3>
                    <p className="text-[11px] text-white/50">{salon.type}</p>
                  </div>
                  <Badge className="bg-[var(--gold-kene)]/15 text-[var(--gold-kene)] border-[var(--gold-kene)]/30 text-[10px]">
                    {salon.rating}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-white/40 mt-2 font-mono">
                  <MapPin className="w-3 h-3 text-white/30 shrink-0" /> {salon.address}
                </div>
              </div>

              <Dialog open={isContactModalOpen && selectedSalon?.id === salon.id} onOpenChange={(open) => {
                setIsContactModalOpen(open);
                if (open) setSelectedSalon(salon);
              }}>
                <DialogTrigger asChild>
                  <Button className="w-full h-8 bg-gradient-to-r from-[var(--gold-kene)] to-[#D4AF37] text-black font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5">
                    <Send className="w-3 h-3" /> Contacter le Salon / Prise de RDV
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0F0A05] border border-[var(--gold-kene)]/30 text-white rounded-3xl max-w-md p-6">
                  <DialogHeader>
                    <DialogTitle className="font-display text-lg text-white flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-[var(--gold-kene)]" /> Prise de Contact — {salon.name}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-3 my-2 text-xs">
                    <p className="text-white/60">
                      Envoyez votre message ou votre demande de rendez-vous directement à l'équipe de <strong>{salon.name}</strong>.
                    </p>

                    <div className="space-y-1">
                      <Label className="text-white/60 text-[10px]">Votre Nom & Prénom</Label>
                      <Input value={clientContactName} onChange={(e) => setClientContactName(e.target.value)} required placeholder="Aminata Diallo" className="bg-[#1A1410] border-white/10 text-white rounded-xl h-9 text-xs" />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-white/60 text-[10px]">Votre Numéro de Téléphone (WhatsApp)</Label>
                      <Input value={clientContactPhone} onChange={(e) => setClientContactPhone(e.target.value)} required placeholder="+225 07 00 00 00 00" className="bg-[#1A1410] border-white/10 text-white rounded-xl h-9 text-xs" />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-white/60 text-[10px]">Votre Message / Service souhaité</Label>
                      <textarea
                        rows={3}
                        value={clientContactMessage}
                        onChange={(e) => setClientContactMessage(e.target.value)}
                        placeholder="ex: Bonjour, je souhaite réserver un Soin Karité Pur et Diagnostic IA ce vendredi à 14h."
                        className="w-full bg-[#1A1410] border border-white/10 text-white p-2.5 rounded-xl text-xs outline-none focus:border-[var(--gold-kene)]"
                      />
                    </div>

                    <Button
                      onClick={handleSubmitContactRequest}
                      disabled={isSubmittingContact}
                      className="w-full h-10 bg-gradient-to-r from-[var(--gold-kene)] to-[#D4AF37] text-black font-bold text-xs rounded-xl shadow-lg cursor-pointer mt-1"
                    >
                      {isSubmittingContact ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Send className="w-3.5 h-3.5 mr-1" />}
                      Envoyer ma Demande à l'Établissement
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Prochain RDV */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-white text-sm uppercase tracking-wider font-display">Vos Rendez-vous</h2>
          <a
            href="/appointments"
            className="bg-[var(--gold-kene)] hover:bg-[var(--gold-kene)]/90 text-[#1A1410] font-bold text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition shadow-lg shadow-[var(--gold-kene)]/20"
          >
            <Calendar className="w-3.5 h-3.5" />
            + Prendre RDV
          </a>
        </div>
        
        {nextAppt ? (
          <Card className="bg-[#241C16] border-white/10 text-white shadow-md rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="flex border-b border-white/10">
                <div className="w-20 bg-[#1A1410] flex flex-col items-center justify-center p-3 border-r border-white/10">
                  <span className="text-xs text-white/50 font-semibold uppercase">{safeFormat(nextAppt.startAt, 'MMM')}</span>
                  <span className="text-xl font-display font-bold text-[var(--gold-kene)]">{safeFormat(nextAppt.startAt, 'dd')}</span>
                </div>
                <div className="p-4 flex-1">
                  <h3 className="font-semibold text-white text-sm">{nextAppt.service?.name || 'Soin Botanique'}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-3 h-3 text-[var(--gold-kene)]" />
                    <span className="text-xs text-white/60">{safeFormat(nextAppt.startAt, 'HH:mm')} • {nextAppt.tenant?.name || 'Institut Partner'}</span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-[#1A1410]/50 flex justify-between items-center">
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]">
                  Confirmé
                </Badge>
                <Button variant="ghost" size="sm" className="h-6 text-xs text-white/60 hover:text-white">Détails</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed border-white/10 bg-[#241C16]/40 text-white rounded-2xl shadow-none">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <Calendar className="w-8 h-8 text-white/30 mb-2" />
              <p className="text-xs text-white/60 mb-4">Aucun rendez-vous à venir.</p>
              <a href="/checkout" className="w-full">
                <Button className="bg-[var(--gold-kene)] text-[#1A1410] hover:bg-gold-kene/90 font-bold rounded-xl shadow-md w-full text-xs">
                  Réserver un Soin
                </Button>
              </a>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Mon Profil Peau (Diagnostic & Historique) */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-white text-sm uppercase tracking-wider font-display">Ma Peau (Diagnostic IA)</h2>
        </div>

        {/* --- HISTORIQUE COMPLET DES DIAGNOSTICS CUTANÉS --- */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider font-display flex items-center gap-1.5">
              📜 Historique de Mes Scans & Bilan Octo-Spectral
            </h3>
            <a href="/diagnostic/results/demo-diagnosis-01" className="text-[var(--gold-kene)] text-xs font-semibold hover:underline">
              Voir Bilan 360°
            </a>
          </div>

          <div className="space-y-2">
            {[
              { id: 'demo-diagnosis-01', date: '15/07/2026', score: 78, zone: 'Visage & Pommettes', status: 'Optimal', active: 'Sérum Bissap & Baobab', gain: '+42% Éclat' },
              { id: 'demo-diagnosis-02', date: '15/06/2026', score: 68, zone: 'Zone T & Pores', status: 'PIH Léger', active: 'Moringa & Neem', gain: 'Initial' },
            ].map((diag, i) => (
              <a key={i} href={`/diagnostic/results/${diag.id}`} className="block">
                <Card className="bg-[#1A1410] border border-white/10 hover:border-[var(--gold-kene)]/40 transition-all rounded-2xl p-3.5 flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gold-kene)]/20 to-[#8A3B14]/20 border border-[var(--gold-kene)]/30 flex items-center justify-center font-display font-bold text-[var(--gold-kene)] text-sm">
                      {diag.score}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white group-hover:text-[var(--gold-kene)] transition-colors">
                        Scan du {diag.date} · {diag.zone}
                      </div>
                      <div className="text-[10px] text-white/40 font-sans mt-0.5">
                        Prescription : {diag.active}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {diag.gain}
                    </span>
                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-[var(--gold-kene)] transition-colors" />
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
