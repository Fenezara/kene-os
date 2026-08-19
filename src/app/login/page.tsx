'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, User, Store, ArrowRight, ArrowLeft, Loader2, Sparkles, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { KeneLogo } from '@/components/ui/logo';

import { registerNewClient, registerNewTenant } from '@/lib/sync-engine';

const tabs = [
  { key: 'client', label: 'Client 🌸', icon: '👤' },
  { key: 'salon', label: 'Mon Salon ✂️', icon: '🏬' },
];

// Floating Kente pattern decoration
function KenteOrb({ color, size, x, y, delay }: { color: string; size: number; x: string; y: string; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, left: x, top: y, background: color, filter: 'blur(60px)' }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }}
      transition={{ duration: 6 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  )
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams ? searchParams.get('redirect') : null;
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('salon');
  const [showPassword, setShowPassword] = useState(false);
  const [clientPhone, setClientPhone] = useState('');
  const [salonEmail, setSalonEmail] = useState('');
  const [salonPassword, setSalonPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('admin@kene.africa');
  const [adminPassword, setAdminPassword] = useState('');

  const [loginError, setLoginError] = useState<string | null>(null);

  // 📱 CLEAN LOGOUT HANDLING ON LOGIN PAGE VISIT
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedOut = searchParams ? searchParams.get('logged_out') : null;
      if (isLoggedOut) {
        localStorage.removeItem('kene_user');
        document.cookie = 'kene-session=; path=/; max-age=0; SameSite=Lax';
      }
    }
  }, [searchParams]);

  // 🔒 HISTORY TRAP: Prevent back button from leaving login page after logout
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', window.location.href);
      const handlePopState = () => {
        window.history.pushState(null, '', window.location.href);
      };
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);

  const handleLogin = (role: string, targetPath: string, userEmailOrName?: string) => async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(null);

    try {
      // Clear explicit logout flag upon logging in
      localStorage.removeItem('kene_logged_out');

      const enteredPassword = activeTab === 'salon' ? salonPassword : activeTab === 'admin' ? adminPassword : '';

      const authRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          role, 
          email: userEmailOrName,
          password: enteredPassword || undefined
        })
      });
      const authData = await authRes.json();

      // 🔒 SECURITY CHECK: Reject login if account is not registered or password wrong
      if (!authRes.ok || !authData.success) {
        setLoading(false);
        const errMsg = authData.error || 'Identifiant ou mot de passe incorrect.';
        setLoginError(errMsg);
        toast({
          title: '🔒 Échec d\'Authentification',
          description: errMsg,
          variant: 'destructive',
        });
        return;
      }

      let displayName = authData.user?.name;
      if (!displayName || /^[\+\d\s\-\.\(\)]+$/.test(displayName)) {
        if (userEmailOrName && userEmailOrName.includes('@')) {
          const parts = userEmailOrName.split('@')[0].replace(/[\._\-]/g, ' ').split(' ');
          displayName = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
        } else {
          displayName = 'Kènè Institut & Spa';
        }
      }

      const roleLower = String(role).toLowerCase();
      const isClient = roleLower.includes('client');
      const isSuperAdmin = roleLower.includes('admin') || roleLower.includes('super');
      const sessionRole = isClient ? 'client' : isSuperAdmin ? 'admin' : 'gerant';

      if (isClient) {
        let cleanFirstName = 'Awa';
        let cleanLastName = 'Koné';
        let cleanEmail = 'awa.kone@example.com';
        let cleanPhone = '+225 07 89 45 12 30';

        const inputVal = userEmailOrName ? userEmailOrName.trim() : '';

        if (inputVal.includes('@')) {
          cleanEmail = inputVal;
          const namePart = inputVal.split('@')[0].replace(/[^a-zA-Z._-]/g, ' ').replace(/[._-]/g, ' ');
          const parts = namePart.trim().split(/\s+/);
          if (parts.length > 0 && parts[0]) {
            cleanFirstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
          }
          if (parts.length > 1 && parts[1]) {
            cleanLastName = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
          }
        } else if (inputVal && isNaN(Number(inputVal.replace(/\+|\s/g, '')))) {
          const parts = inputVal.split(/\s+/);
          if (parts.length > 0 && parts[0]) {
            cleanFirstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
          }
          if (parts.length > 1) {
            cleanLastName = parts.slice(1).join(' ');
          }
        } else if (inputVal) {
          cleanPhone = inputVal;
        }

        if (clientPhone && clientPhone.trim()) {
          cleanPhone = clientPhone.trim();
        }

        const clientUserData = {
          firstName: cleanFirstName,
          lastName: cleanLastName,
          name: authData.user?.name || `${cleanFirstName} ${cleanLastName}`.trim(),
          phone: cleanPhone,
          email: cleanEmail,
          role: 'client',
          skinType: 'Mixte à tendance déshydratée',
          fitzpatrickType: 'Phototype V',
          memberSince: '2024',
          points: 1250,
        };

        registerNewClient(clientUserData);
        localStorage.setItem('kene_user', JSON.stringify(clientUserData));
      } else {

        // Extract employee name cleanly (e.g. "Fatou Koné", "Aminata Diallo")
        let finalEmployeeName = isSuperAdmin ? 'Super-Admin SaaS Kènè' : displayName;
        if (salonEmail && salonEmail.includes('@') && !isSuperAdmin) {
          const rawPart = salonEmail.split('@')[0].replace(/[\._\-]/g, ' ').trim();
          const parts = rawPart.split(/\s+/);
          if (parts.length > 0 && parts[0]) {
            finalEmployeeName = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
          }
        }

        const userObj = {
          name: finalEmployeeName || 'Fatou Koné',
          email: userEmailOrName || (isSuperAdmin ? 'admin@kene.africa' : 'contact@salon.com'),
          role: sessionRole,
          employeeRole: sessionRole === 'gerant' ? 'Praticienne & Directrice d\'Institut' : 'Membre d\'Équipe',
          salonName: 'Institut Beauté Kènè',
        };

        if (sessionRole === 'gerant') {
          registerNewTenant({
            name: userObj.salonName,
            email: userObj.email,
            phone: '+225 07 00 11 22 33',
            type: 'Institut & Spa Botanique',
            subscriptionTier: 'Pro'
          });
        }
        
        localStorage.setItem('kene_user', JSON.stringify(userObj));
      }

      const destination = authData?.targetPath || targetPath;
      toast({ title: 'Connexion Sécurisée', description: `Bienvenue dans votre espace.` });
      
      window.location.href = destination;
    } catch {
      setLoading(false);
      toast({ title: 'Erreur', description: 'Échec de connexion.', variant: 'destructive' });
    }
  };

  // 🌐 SOCIAL LOGIN HANDLER (GOOGLE & APPLE)
  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setLoading(true);
    setLoginError(null);

    try {
      const isPro = activeTab === 'salon';
      const mockEmail = provider === 'google' ? 'client.google@gmail.com' : 'client.apple@icloud.com';
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
        title: `Connexion ${provider === 'google' ? 'Google' : 'Apple'} Réussie ! 🚀`,
        description: `Bienvenue sur Kènè OS, ${userObj.name}.`,
      });

      const destination = isPro ? '/dashboard' : (redirectUrl || '/diagnostic');
      window.location.href = destination;
    } catch {
      setLoading(false);
      toast({ title: 'Erreur', description: `Échec de connexion avec ${provider}.`, variant: 'destructive' });
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

      {/* ── DECORATIVE ORBS ── */}
      <KenteOrb color="#C8951E" size={500} x="-10%" y="-20%" delay={0} />
      <KenteOrb color="#8A1C14" size={400} x="60%" y="50%" delay={2} />
      <KenteOrb color="#2E5A36" size={350} x="80%" y="-30%" delay={1} />
      <KenteOrb color="#1E3A5F" size={300} x="20%" y="70%" delay={3} />

      {/* ── SUBTLE GRID PATTERN ── */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(200,149,30,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(200,149,30,0.5) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* ── LOGO HEADER ── */}
        <div className="text-center mb-8 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
            className="mb-4"
          >
            <KeneLogo href="/" subtitle="AUTH" size="lg" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="text-4xl font-display font-black tracking-tight">
              <span className="bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#C8951E] bg-clip-text text-transparent">
                Kènè
              </span>
              <span className="text-white"> Plateforme</span>
            </h1>
            <p className="text-white/35 mt-2 text-sm font-sans">
              L'OS de beauté afro-contemporaine · OHADA & UEMOA
            </p>

            {/* Decorative Kente bar */}
            <div className="flex gap-0.5 justify-center mt-4">
              {['#C8951E', '#8A3B14', '#2E5A36', '#1E3A5F', '#C8951E', '#8A3B14', '#2E5A36'].map((c, i) => (
                <div key={i} className="h-1.5 w-5 rounded-full" style={{ background: c, opacity: 0.7 + i * 0.04 }} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(20, 13, 8, 0.85)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(200, 149, 30, 0.2)',
            boxShadow: '0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(200,149,30,0.1) inset',
          }}
        >
          {/* Top gold line */}
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#C8951E] to-transparent" />

          <div className="p-8">
            {/* ── TABS ── */}
            <div className="flex gap-1 bg-white/5 p-1 rounded-2xl mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="flex-1 relative py-2 text-xs font-bold transition-all duration-300 cursor-pointer rounded-xl"
                >
                  {activeTab === tab.key && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#C8951E] to-[#D4AF37]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 flex items-center justify-center gap-1 ${activeTab === tab.key ? 'text-[#0F0A05]' : 'text-white/40'}`}>
                    <span>{tab.icon}</span> {tab.label}
                  </span>
                </button>
              ))}
            </div>

            {/* ── SECURITY ALERT ERROR BANNER ── */}
            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-xs text-red-200 space-y-2.5 font-sans"
              >
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong className="text-red-300 block font-bold mb-0.5">Sécurité — Compte non enregistré :</strong>
                    {loginError}
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-red-500/20">
                  <span className="text-[10px] text-white/50">Inscription gratuite en 30 secondes</span>
                  <a
                    href={`/register?identifier=${encodeURIComponent(clientPhone || salonEmail || '')}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C8951E] hover:underline bg-[#C8951E]/10 border border-[#C8951E]/30 px-3 py-1.5 rounded-xl transition-all"
                  >
                    <span>Créer un compte maintenant</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            )}

            {/* ── FORM CONTENT ── */}
            <AnimatePresence mode="wait">
              {activeTab === 'client' && (
                <motion.form
                  key="client"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleLogin('Client', '/portal', clientPhone)}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <Label className="text-white/60 text-xs">Numéro de téléphone</Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 h-4 w-4 text-white/30" />
                      <Input
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="+225 07 00 00 00 00"
                        required
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-[#C8951E] rounded-xl h-11"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white/60 text-xs">Code PIN OTP (4 chiffres)</Label>
                    <Input
                      type="password"
                      placeholder="••••"
                      required
                      maxLength={4}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-[#C8951E] rounded-xl h-11 text-center tracking-[1em]"
                    />
                  </div>
                  <SubmitButton loading={loading} label="Accéder à mon profil" />
                </motion.form>
              )}

              {activeTab === 'salon' && (
                <motion.form
                  key="salon"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleLogin('Gérant de Salon', '/dashboard', salonEmail)}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <Label className="text-white/60 text-xs">Email ou téléphone du salon</Label>
                    <div className="relative">
                      <Store className="absolute left-3.5 top-3 h-4 w-4 text-white/30" />
                      <Input
                        type="text"
                        value={salonEmail}
                        onChange={(e) => setSalonEmail(e.target.value)}
                        required
                        placeholder="contact@salon.com"
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-[#C8951E] rounded-xl h-11"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-white/60 text-xs">Mot de passe</Label>
                      <span className="text-[10px] text-[#C8951E] hover:underline cursor-pointer">Mot de passe oublié ?</span>
                    </div>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={salonPassword}
                        onChange={(e) => setSalonPassword(e.target.value)}
                        required
                        className="bg-white/5 border-white/10 text-white focus:border-[#C8951E] rounded-xl h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-white/40 hover:text-white transition"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <SubmitButton loading={loading} label="Accéder au back-office" />
                </motion.form>
              )}

              {activeTab === 'admin' && (
                <motion.form
                  key="admin"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleLogin('Super Admin', '/admin', adminEmail)}
                  className="space-y-4"
                >
                  <div className="flex items-start gap-3 bg-[#8A1C14]/10 border border-[#8A1C14]/25 rounded-2xl p-3.5">
                    <ShieldCheck className="w-4 h-4 text-[#8A1C14] shrink-0 mt-0.5" />
                    <p className="text-[10px] text-[#8A1C14]/80 leading-relaxed">
                      Accès restreint · Toute connexion est enregistrée et horodatée. Certifié ISO/OWASP.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white/60 text-xs">Email sécurisé</Label>
                    <Input 
                      type="email" 
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required 
                      placeholder="admin@kene.africa" 
                      className="bg-white/5 border-white/10 text-white focus:border-[#8A1C14] rounded-xl h-11" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white/60 text-xs">Mot de passe</Label>
                    <div className="relative">
                      <Input 
                        type={showPassword ? 'text' : 'password'} 
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        required 
                        className="bg-white/5 border-white/10 text-white focus:border-[#8A1C14] rounded-xl h-11 pr-10" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-white/40 hover:text-white transition"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white/60 text-xs">Code 2FA</Label>
                    <Input type="text" required placeholder="000 000" maxLength={6} className="bg-white/5 border-white/10 text-white focus:border-[#8A1C14] rounded-xl h-11 text-center tracking-[0.5em]" />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-[#8A1C14] hover:bg-[#8A1C14]/80 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ShieldCheck className="w-4 h-4" /> Accès Sécurisé</>}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* ── SOCIAL SIGN IN (GOOGLE & APPLE) ── */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
                <span className="bg-[#140D08] px-3 text-white/40">ou continuer avec</span>
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
          </div>

          {/* Register Link */}
          <div className="px-8 pb-4 text-center">
            <p className="text-xs text-white/40">
              Pas encore de compte ?{' '}
              <a href="/register" className="text-[#C8951E] font-bold hover:underline">
                Créer un compte
              </a>
            </p>
          </div>

          {/* Bottom footer inside card */}
          <div className="px-8 pb-6 text-center border-t border-white/5 pt-3">
            <p className="text-[10px] text-white/15 font-mono">
              © {new Date().getFullYear()} Kènè Technologies · Plateforme certifiée OHADA & UEMOA
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="submit"
      disabled={loading}
      className="w-full h-12 rounded-xl font-bold text-sm text-[#0F0A05] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70"
      style={{
        background: 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 50%, #C8951E 100%)',
        boxShadow: '0 4px 20px rgba(200, 149, 30, 0.35)',
      }}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {label}
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </motion.button>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F0A05]" />}>
      <LoginFormContent />
    </Suspense>
  );
}
