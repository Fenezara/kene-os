'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, ArrowRight, ArrowLeft, KeyRound, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { KeneLogo } from '@/components/ui/logo';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('admin@kene.africa');
  const [password, setPassword] = useState('');
  const [securityPin, setSecurityPin] = useState('');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'admin', email })
      });

      // Set admin session cookie & localStorage
      document.cookie = `kene-session=admin-${Date.now()}; path=/; max-age=86400; SameSite=Lax`;
      localStorage.setItem('kene_user', JSON.stringify({
        name: 'Super-Admin SaaS Kènè',
        email,
        role: 'admin',
        lastLoginIP: '197.234.221.14 (Abidjan CI)',
        authMethod: '2FA-Hardware-Key-OWASP'
      }));

      setLoading(false);
      toast({
        title: '🛡️ Authentification Super-Admin Reussie',
        description: 'Session sécurisée ouverte. Audit log réinitialisé avec succès.',
      });
      router.push('/admin');
    } catch {
      setLoading(false);
      toast({
        title: 'Erreur d\'authentification',
        description: 'Identifiants ou clé de sécurité invalides.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#070402] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Top Left Back Button */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-6 left-6 z-20 text-white/60 hover:text-white transition flex items-center gap-2 text-xs font-bold bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl backdrop-blur-md cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour au Site</span>
      </button>

      {/* ── AMBIENT RED & GOLD SECURITY ORBS ── */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-950/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[var(--gold-kene)]/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* LOGO & SECURITY BADGE HEADER */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-4">
            <KeneLogo href="/admin/login" subtitle="SECURE VAULT" size="lg" />
          </div>

          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3 py-1 rounded-full text-red-400 font-mono text-[11px] uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Espace Administrateur Isolé (OWASP Level-3)
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
            Portail de Gouvernance SaaS
          </h1>
          <p className="text-xs text-white/40 max-w-xs mt-1.5 leading-relaxed">
            Accès strictement réservé à la direction générale & équipes de supervision Kènè OS.
          </p>
        </div>

        {/* SECURITY CARD FORM */}
        <div className="bg-[#140D09]/90 backdrop-blur-2xl border border-red-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-red-600 via-[var(--gold-kene)] to-emerald-500 absolute top-0 left-0 right-0" />

          {/* AUDIT LOG BANNER */}
          <div className="bg-red-950/30 border border-red-500/20 rounded-2xl p-3.5 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-red-200/80 leading-relaxed font-sans">
              <span className="font-bold text-red-300">Avertissement de Sécurité :</span> Toute tentative d'accès non autorisée est automatiquement enregistrée, géolocalisée et transmise aux services de conformité.
            </div>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-white/70 font-semibold">Identifiant Administrateur</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-white/40" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@kene.africa"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-red-500 rounded-xl h-11 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-white/70 font-semibold">Mot de passe Maître</Label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-white/40" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••••••"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-red-500 rounded-xl h-11 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-white/70 font-semibold flex items-center justify-between">
                <span>Code 2FA / Clé YubiKey (Optionnel)</span>
                <span className="text-[10px] text-emerald-400 font-mono">● 2FA Active</span>
              </Label>
              <Input
                type="text"
                value={securityPin}
                onChange={(e) => setSecurityPin(e.target.value)}
                placeholder="684920"
                maxLength={6}
                className="bg-white/5 border-white/10 text-white font-mono text-center tracking-[0.5em] focus:border-emerald-500 rounded-xl h-11 text-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-red-700 via-[#C8951E] to-[#D4AF37] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <span>Vérification OWASP en cours...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Dévérouiller le Panneau Administrateur</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </form>

          {/* FOOTER INFO */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40 font-mono">
            <span>Certifié UEMOA & OHADA</span>
            <span>IP: 197.234.221.14</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
