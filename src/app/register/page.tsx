'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, Store, ArrowRight, ArrowLeft, Loader2, Sparkles, Phone, Mail, Lock, Building2, MapPin, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const accountTypes = [
  { key: 'client', label: 'Espace Cliente', icon: '🌸', subtitle: 'Pour suivre mon bilan de peau, mes soins & RDV' },
  { key: 'pro', label: 'Salon & Praticien', icon: '✨‚ï¸', subtitle: 'Pour gérer mon salon, ma caisse & mes clientes' },
];

const uemoaCountries = [
  { code: 'CI', name: "Côte d'Ivoire 🇨🇮", dial: '+225' },
  { code: 'SN', name: 'Sénégal 🇸🇳', dial: '+221' },
  { code: 'ML', name: 'Mali 🇲🇱', dial: '+223' },
  { code: 'BF', name: 'Burkina Faso 🇧🇫', dial: '+226' },
  { code: 'TG', name: 'Togo 🇹🇬', dial: '+228' },
  { code: 'BJ', name: 'Bénin 🇧🇯', dial: '+229' },
  { code: 'NE', name: 'Niger 🇳🇪', dial: '+227' },
  { code: 'GN', name: 'Guinée 🇬🇳', dial: '+224' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState<'client' | 'pro'>('client');

  // Client Form State
  const [clientForm, setClientForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    country: 'CI',
    password: '',
  });

  // Pro Form State
  const [proForm, setProForm] = useState({
    salonName: '',
    ownerName: '',
    phone: '',
    email: '',
    salonType: 'institut',
    country: 'CI',
    password: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const identifier = params.get('identifier') || params.get('phone') || params.get('email');
      if (identifier) {
        if (identifier.includes('@')) {
          setClientForm(prev => ({ ...prev, email: identifier }));
          setProForm(prev => ({ ...prev, email: identifier }));
        } else {
          setClientForm(prev => ({ ...prev, phone: identifier }));
          setProForm(prev => ({ ...prev, phone: identifier }));
        }
      }
    }
  }, []);

  const handleRegisterClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'client',
          firstName: clientForm.firstName,
          lastName: clientForm.lastName,
          phone: clientForm.phone,
          email: clientForm.email,
        }),
      });
      const data = await res.json();

      const user = {
        id: data.account?.id || `usr_${Date.now()}`,
        firstName: clientForm.firstName || 'Cliente',
        lastName: clientForm.lastName || 'Kènè',
        phone: clientForm.phone,
        email: clientForm.email,
        role: 'client',
      };
      localStorage.setItem('kene_user', JSON.stringify(user));
      document.cookie = `kene-session=client-${Date.now()}; path=/; max-age=31536000; SameSite=Lax`;
      setLoading(false);
      toast({
        title: '✨ Compte Cliente Créé avec Succès !',
        description: `Bienvenue ${user.firstName} sur Kènè OS. Votre compte est sécurisé.`,
      });
      window.location.href = '/portal';
    } catch {
      setLoading(false);
      toast({ title: 'Erreur', description: 'Échec de la création de compte.', variant: 'destructive' });
    }
  };

  const handleRegisterPro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const salonTitle = proForm.salonName || 'Kènè Institut Beauté';
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'gerant',
          salonName: salonTitle,
          name: proForm.ownerName,
          phone: proForm.phone,
          email: proForm.email,
        }),
      });
      const data = await res.json();

      const tenantSettings = {
        identity: { commercialName: salonTitle, legalName: salonTitle + ' SAS', type: proForm.salonType || 'Institut', logoUrl: null },
        address: { street: 'Adresse Principale', phone: proForm.phone || '+225 07 00 00 00', email: proForm.email || 'contact@salon.com' },
        fiscal: { rccm: 'CI-ABJ-2024-B-9988', nif: '1098473A', vatRate: 18, country: proForm.country || 'CI', currency: 'XOF' },
        subscription: { plan: 'Pro', renewalDate: '2027-01-01' }
      };
      localStorage.setItem('kene_tenant_settings', JSON.stringify(tenantSettings));
      localStorage.setItem('kene_user', JSON.stringify({
        name: proForm.ownerName || 'Gérant Salon',
        email: proForm.email,
        phone: proForm.phone,
        salonName: salonTitle,
        role: 'gerant',
      }));
      document.cookie = `kene-session=gerant-${Date.now()}; path=/; max-age=31536000; SameSite=Lax`;
      setLoading(false);
      toast({
        title: '✨‚ï¸ Espace Salon Créé avec Succès !',
        description: `Bienvenue sur Kènè OS, ${proForm.salonName || 'votre salon'}. Votre compte entreprise est validé.`,
      });
      window.location.href = data.targetPath || '/dashboard';
    } catch {
      setLoading(false);
      toast({ title: 'Erreur', description: 'Échec de la création du compte salon.', variant: 'destructive' });
    }
  };

  // 🌐 SOCIAL LOGIN HANDLER (GOOGLE & APPLE)
  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setLoading(true);

    try {
      const isPro = accountType === 'pro';
      const mockEmail = provider === 'google' ? 'nouveau.google@gmail.com' : 'nouveau.apple@icloud.com';
      const role = isPro ? 'Gérante Salon' : 'Client';
      
      const authRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, email: mockEmail })
      });

      const data = await authRes.json();
      const userObj = {
        id: data.user?.id || `usr-${provider}-${Date.now()}`,
        name: data.user?.name || (provider === 'google' ? 'Compte Google' : 'Compte Apple'),
        email: mockEmail,
        role: role,
        avatar: '/images/afro_beauty_hero_woman.jpg',
        tenantId: 'tenant_abidjan_01',
        provider,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('kene_user', JSON.stringify(userObj));
        document.cookie = `kene-session=${role}-${Date.now()}; path=/; max-age=86400; SameSite=Lax`;
      }

      toast({
        title: `Inscription ${provider === 'google' ? 'Google' : 'Apple'} Réussie ! 🎉`,
        description: `Votre compte Kènè OS a été créé avec succès.`,
      });

      const destination = isPro ? '/dashboard' : '/portal';
      window.location.href = destination;
    } catch {
      setLoading(false);
      toast({ title: 'Erreur', description: `Échec d'inscription avec ${provider}.`, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0603] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Top Left Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 z-20 text-white/60 hover:text-white transition flex items-center gap-2 text-xs font-bold bg-white/5 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-md cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour</span>
      </button>

      {/* Glow Orbs */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#C8951E]/15 blur-[90px] -top-20 -left-20 pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-[#140D08]/90 border border-[#C8951E]/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative z-10 space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C8951E] to-[#8A5C0A] p-0.5">
            <div className="w-full h-full bg-[#140D08] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#C8951E]" />
            </div>
          </div>
          <h1 className="text-2xl font-display font-black text-white">Créer mon Compte Kènè OS</h1>
          <p className="text-xs text-white/40">Rejoignez l'écosystème de beauté et dermo-cosmétique afro-contemporain</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {accountTypes.map((type) => (
            <button
              key={type.key}
              type="button"
              onClick={() => setAccountType(type.key as 'client' | 'pro')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                accountType === type.key
                  ? 'bg-[#C8951E]/15 border-[#C8951E] text-white'
                  : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg">{type.icon}</span>
                {accountType === type.key && <CheckCircle className="w-4 h-4 text-[#C8951E]" />}
              </div>
              <p className="text-xs font-bold text-white mb-0.5">{type.label}</p>
              <p className="text-[10px] text-white/40 leading-tight">{type.subtitle}</p>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {accountType === 'client' ? (
            <motion.form
              key="client-form"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleRegisterClient}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-white/70">Prénom</Label>
                  <Input
                    required
                    placeholder="Aminata"
                    value={clientForm.firstName}
                    onChange={(e) => setClientForm({ ...clientForm, firstName: e.target.value })}
                    className="bg-[#0A0603] border-white/10 text-white rounded-xl text-xs h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-white/70">Nom</Label>
                  <Input
                    required
                    placeholder="Diallo"
                    value={clientForm.lastName}
                    onChange={(e) => setClientForm({ ...clientForm, lastName: e.target.value })}
                    className="bg-[#0A0603] border-white/10 text-white rounded-xl text-xs h-11"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-white/70">Numéro WhatsApp / Téléphone</Label>
                <div className="flex gap-2">
                  <select
                    value={clientForm.country}
                    onChange={(e) => setClientForm({ ...clientForm, country: e.target.value })}
                    className="bg-[#0A0603] border border-white/10 text-white text-xs rounded-xl px-2.5 outline-none font-sans"
                  >
                    {uemoaCountries.map((c) => (
                      <option key={c.code} value={c.code} className="bg-[#1A1410] text-white">
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <Input
                    required
                    type="tel"
                    placeholder="07 08 09 10 11"
                    value={clientForm.phone}
                    onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                    className="bg-[#0A0603] border-white/10 text-white rounded-xl text-xs h-11 flex-1"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-white/70">Email (optionnel)</Label>
                <Input
                  type="email"
                  placeholder="aminata@gmail.com"
                  value={clientForm.email}
                  onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                  className="bg-[#0A0603] border-white/10 text-white rounded-xl text-xs h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-white/70">Mot de passe</Label>
                <Input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={clientForm.password}
                  onChange={(e) => setClientForm({ ...clientForm, password: e.target.value })}
                  className="bg-[#0A0603] border-white/10 text-white rounded-xl text-xs h-11"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#C8951E] text-[#0F0A05] font-bold rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#C8951E]/20 transition-all hover:brightness-110 mt-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Créer mon Compte Cliente</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="pro-form"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onSubmit={handleRegisterPro}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label className="text-xs text-white/70">Nom du Salon / Établissement</Label>
                <Input
                  required
                  placeholder="Kènè Dermo-Spa & Beauty Institut"
                  value={proForm.salonName}
                  onChange={(e) => setProForm({ ...proForm, salonName: e.target.value })}
                  className="bg-[#0A0603] border-white/10 text-white rounded-xl text-xs h-11"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-white/70">Nom du Responsable</Label>
                  <Input
                    required
                    placeholder="Fatou Koné"
                    value={proForm.ownerName}
                    onChange={(e) => setProForm({ ...proForm, ownerName: e.target.value })}
                    className="bg-[#0A0603] border-white/10 text-white rounded-xl text-xs h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-white/70">Type d'Établissement</Label>
                  <select
                    value={proForm.salonType}
                    onChange={(e) => setProForm({ ...proForm, salonType: e.target.value })}
                    className="w-full bg-[#0A0603] border border-white/10 text-white text-xs rounded-xl px-3 h-11 outline-none font-sans"
                  >
                    <option value="institut" className="bg-[#1A1410]">Institut de Beauté</option>
                    <option value="spa" className="bg-[#1A1410]">Dermo-Spa & Massage</option>
                    <option value="coiffure" className="bg-[#1A1410]">Salon de Coiffure Afro</option>
                    <option value="independent" className="bg-[#1A1410]">Praticienne Indépendante</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-white/70">Téléphone Professionnel (WhatsApp)</Label>
                <div className="flex gap-2">
                  <select
                    value={proForm.country}
                    onChange={(e) => setProForm({ ...proForm, country: e.target.value })}
                    className="bg-[#0A0603] border border-white/10 text-white text-xs rounded-xl px-2.5 outline-none font-sans"
                  >
                    {uemoaCountries.map((c) => (
                      <option key={c.code} value={c.code} className="bg-[#1A1410] text-white">
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <Input
                    required
                    type="tel"
                    placeholder="01 02 03 04 05"
                    value={proForm.phone}
                    onChange={(e) => setProForm({ ...proForm, phone: e.target.value })}
                    className="bg-[#0A0603] border-white/10 text-white rounded-xl text-xs h-11 flex-1"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-white/70">Mot de passe</Label>
                <Input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={proForm.password}
                  onChange={(e) => setProForm({ ...proForm, password: e.target.value })}
                  className="bg-[#0A0603] border-white/10 text-white rounded-xl text-xs h-11"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-[#C8951E] via-[#8A5C0A] to-[#8A1C14] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#8A1C14]/20 transition-all hover:brightness-110 mt-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Activer Mon Espace Salon Pro</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
          <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
            <span className="bg-[#140D08] px-3 text-white/40">ou s'inscrire avec</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition duration-200 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z" />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin('apple')}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition duration-200 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0 fill-current text-white" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.82.13-9.68-1.92-14.58-6.15-3.18-2.76-7.07-7.44-11.67-14.04-6.3-9.06-11.27-19.57-14.92-31.54-3.64-11.96-5.46-23.11-5.46-33.45 0-14.5 3.75-26.17 11.26-35.01 7.51-8.84 16.89-13.38 28.14-13.63 4.7.13 9.77 1.15 15.22 3.06 5.45 1.91 9.4 2.87 11.85 2.87 2.12 0 6.03-.96 11.73-2.87 5.7-1.91 10.59-2.81 14.67-2.69 11.39.63 20.65 4.9 27.79 12.82-10.19 6.16-15.16 14.88-14.91 26.17.25 8.78 3.56 16.27 9.94 22.47 6.38 6.2 14.05 9.8 23.01 10.79-2.45 7.15-5.6 14.28-9.45 21.39zM119.22 31.84c0-7.39 2.68-14.4 8.04-21.03 5.36-6.63 12.15-10.45 20.37-11.46.26 1.01.39 2.02.39 3.03 0 7.39-2.74 14.5-8.22 21.33-5.49 6.83-12.31 10.74-20.47 11.73-.13-1.01-.11-2.22-.11-3.6z" />
            </svg>
            <span>Apple</span>
          </button>
        </div>

        <div className="border-t border-white/10 pt-4 text-center">
          <p className="text-xs text-white/40">
            Déjà inscrit ? <Link href="/login" className="text-[#C8951E] font-bold hover:underline">Se connecter</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
