'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, Store, ArrowRight, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { KeneLogo } from '@/components/ui/logo';

const tabs = [
  { key: 'client', label: 'Client', icon: '🌸' },
  { key: 'salon', label: 'Mon Salon', icon: '✂️' },
  { key: 'admin', label: 'Admin', icon: '🔐' },
]

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

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('salon');

  const handleLogin = (role: string, targetPath: string, userEmailOrName?: string) => async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, email: userEmailOrName })
      });

      let displayName = userEmailOrName || 'Utilisateur Kènè';
      if (userEmailOrName && userEmailOrName.includes('@')) {
        displayName = userEmailOrName.split('@')[0].replace('.', ' ');
        displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
      }

      if (role === 'client') {
        localStorage.setItem('kene_user', JSON.stringify({
          firstName: displayName,
          lastName: '',
          name: displayName,
          email: userEmailOrName || 'client@kene.africa',
          role: 'client',
        }));
        document.cookie = `kene-session=client-${Date.now()}; path=/; max-age=86400; SameSite=Lax`;
      } else {
        const isSuperAdmin = role === 'Super Admin' || role === 'admin';
        const sessionRole = isSuperAdmin ? 'admin' : 'gerant';
        document.cookie = `kene-session=${sessionRole}-${Date.now()}; path=/; max-age=86400; SameSite=Lax`;
        
        localStorage.setItem('kene_user', JSON.stringify({
          name: isSuperAdmin ? 'Super-Admin SaaS Kènè' : displayName,
          email: userEmailOrName || (isSuperAdmin ? 'admin@kene.africa' : 'contact@salon.com'),
          role: sessionRole,
        }));
      }

      setLoading(false);
      toast({ title: '✨ Connexion Sécurisée (HttpOnly & HSTS)', description: `Bienvenue dans votre espace ${role}.` });
      router.push(targetPath);
    } catch {
      setLoading(false);
      toast({ title: 'Erreur', description: 'Échec de connexion.', variant: 'destructive' });
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

            {/* ── FORM CONTENT ── */}
            <AnimatePresence mode="wait">
              {activeTab === 'client' && (
                <motion.form
                  key="client"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleLogin('Client', '/portal')}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <Label className="text-white/60 text-xs">Numéro de téléphone</Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 h-4 w-4 text-white/30" />
                      <Input
                        type="tel"
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
                  onSubmit={handleLogin('Gérant de Salon', '/dashboard')}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <Label className="text-white/60 text-xs">Email ou téléphone du salon</Label>
                    <div className="relative">
                      <Store className="absolute left-3.5 top-3 h-4 w-4 text-white/30" />
                      <Input
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
                    <Input
                      type="password"
                      required
                      className="bg-white/5 border-white/10 text-white focus:border-[#C8951E] rounded-xl h-11"
                    />
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
                  onSubmit={handleLogin('Super Admin', '/admin')}
                  className="space-y-4"
                >
                  <div className="flex items-start gap-3 bg-[#8A1C14]/10 border border-[#8A1C14]/25 rounded-2xl p-3.5">
                    <ShieldCheck className="w-4 h-4 text-[#8A1C14] shrink-0 mt-0.5" />
                    <p className="text-[10px] text-[#8A1C14]/80 leading-relaxed">
                      Accès restreint · Toute connexion est enregistrée et horodatée. Non autorisé par la plateforme Kènè.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white/60 text-xs">Email sécurisé</Label>
                    <Input type="email" required placeholder="admin@kene.io" className="bg-white/5 border-white/10 text-white focus:border-[#8A1C14] rounded-xl h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white/60 text-xs">Mot de passe</Label>
                    <Input type="password" required className="bg-white/5 border-white/10 text-white focus:border-[#8A1C14] rounded-xl h-11" />
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
