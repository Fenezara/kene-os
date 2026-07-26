'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, Store, ArrowRight, ArrowLeft, Loader2, Sparkles, Phone, Mail, Lock, Building2, MapPin, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const accountTypes = [
  { key: 'client', label: 'Espace Cliente', icon: '🌸', subtitle: 'Pour suivre mon bilan de peau, mes soins & RDV' },
  { key: 'pro', label: 'Salon & Praticien', icon: '✂️', subtitle: 'Pour gérer mon salon, ma caisse & mes clientes' },
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
        title: '✂️ Espace Salon Créé avec Succès !',
        description: `Bienvenue sur Kènè OS, ${proForm.salonName || 'votre salon'}. Votre compte entreprise est validé.`,
      });
      window.location.href = data.targetPath || '/dashboard';
    } catch {
      setLoading(false);
      toast({ title: 'Erreur', description: 'Échec de la création du compte salon.', variant: 'destructive' });
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
      <div className="absolute w-[400px] h-[400px] rounded-full bg-[#8A1C14]/15 blur-[90px] bottom-0 right-0 pointer-events-none" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(200,149,30,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(200,149,30,0.5) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Logo & Header */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F3E5AB] via-[#C8951E] to-[#8A3B14] flex items-center justify-center shadow-xl">
              <span className="font-display font-black text-3xl text-[#0F0A05]">K</span>
            </div>
          </div>
          <h1 className="text-3xl font-display font-black text-white">
            Créer mon Compte <span className="text-[#C8951E]">Kènè</span>
          </h1>
          <p className="text-white/40 text-xs font-sans mt-1">
            Rejoignez la première plateforme de beauté & dermo-cosmétique afro-contemporaine
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#140E0A]/90 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-6">
          {/* Account Type Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-[#0A0603] p-1.5 rounded-2xl border border-white/5">
            {accountTypes.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setAccountType(tab.key as any)}
                className={`py-2.5 px-3 rounded-xl font-display font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  accountType === tab.key
                    ? 'bg-gradient-to-r from-[#C8951E] to-[#8A5C0A] text-[#0F0A05] shadow-lg'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {accountType === 'client' ? (
              /* CLIENT REGISTRATION FORM */
              <motion.form
                key="client"
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
                  <Label className="text-xs text-white/70">Numéro Téléphone / WhatsApp</Label>
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
              /* PRO SALON REGISTRATION FORM */
              <motion.form
                key="pro"
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

                <div className="grid grid-cols-2 gap-3">
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

          <div className="border-t border-white/10 pt-4 text-center">
            <p className="text-xs text-white/40">
              Déjà inscrit ?{' '}
              <Link href="/login" className="text-[#C8951E] font-bold hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
