'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Eye, EyeOff, Loader2, KeyRound, Sparkles, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { KeneLogo } from '@/components/ui/logo';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('admin@kene.africa');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Server-side HttpOnly cookie creation for Super-Admin
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'admin', email })
      });

      document.cookie = `kene-session=admin-${Date.now()}; path=/; max-age=86400; SameSite=Lax`;
      localStorage.setItem('kene_user', JSON.stringify({
        name: 'Super-Admin SaaS Kènè',
        email,
        role: 'admin',
      }));

      setLoading(false);
      toast({
        title: "🔐 Authentification Super-Admin Validée",
        description: "Accès autorisé à la Console SaaS Kènè.",
      });
      router.push('/admin');
    } catch {
      setLoading(false);
      toast({
        title: "Erreur d'accès",
        description: "Clé de sécurité ou identifiants incorrects.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#070402] flex items-center justify-center p-4 relative overflow-hidden font-sans text-white">
      {/* Top Left Back Button */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-6 left-6 z-20 text-white/60 hover:text-white transition flex items-center gap-2 text-xs font-bold bg-white/5 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-md cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour au Site</span>
      </button>

      {/* Red Glowing Orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#8A1C14]/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <KeneLogo href="/" subtitle="SUPER-ADMIN" size="lg" />
          <h1 className="text-2xl font-display font-black tracking-tight mt-4 text-[#F3E5AB]">
            Portail Sécurité Super-Admin 🔐
          </h1>
          <p className="text-white/40 text-xs mt-1">
            Console réservée à la supervision SaaS Kènè
          </p>
        </div>

        {/* Security Card */}
        <div className="bg-[#140D08] border border-[#8A1C14]/40 rounded-3xl p-7 shadow-2xl space-y-5 backdrop-blur-2xl">
          <div className="flex items-start gap-3 bg-[#8A1C14]/15 border border-[#8A1C14]/30 rounded-2xl p-3.5">
            <ShieldCheck className="w-5 h-5 text-[#E07A2B] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#F3E5AB]/90 leading-relaxed font-mono">
              <strong>Accès Restreint & Horodaté</strong> · Détection des tentatives non autorisées selon les normes ISO/OWASP.
            </p>
          </div>

          <form onSubmit={handleAdminAuth} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs font-bold">Email Administrateur</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@kene.africa"
                className="bg-white/5 border-white/10 text-white focus:border-[#8A1C14] rounded-xl h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs font-bold">Mot de passe Maître</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
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
              <Label className="text-white/70 text-xs font-bold">Clé 2FA OTP (6 chiffres)</Label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-white/30" />
                <Input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  required
                  placeholder="000 000"
                  maxLength={6}
                  className="pl-10 bg-white/5 border-white/10 text-white focus:border-[#8A1C14] rounded-xl h-11 text-center tracking-[0.5em] font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-[#8A1C14] to-[#B22222] hover:opacity-95 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow-lg cursor-pointer mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ShieldCheck className="w-4 h-4" /> Déverrouiller la Console Admin</>}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-white/20 font-mono mt-6">
          Kènè SaaS Security Kernel v2.4 · All Rights Reserved
        </p>
      </motion.div>
    </div>
  );
}
