'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Printer, Share2, X, ShieldCheck, CheckCircle2, Sprout, ScanFace, Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KeneLogo } from '@/components/ui/logo';
import { GyeNyameIcon, SankofaIcon } from '@/components/ui/adinkra-icons';

interface BeautyPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: {
    name?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    skinType?: string;
    fitzpatrickType?: string;
  };
  diagnoses?: any[];
}

export function BeautyPassportModal({
  isOpen,
  onClose,
  userProfile = {
    firstName: 'Cliente',
    lastName: 'Kènè',
    phone: '',
    email: '',
    skinType: 'Peau Mélanoderme',
    fitzpatrickType: 'Phototype V'
  },
  diagnoses = []
}: BeautyPassportModalProps) {
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    setDateStr(new Date().toLocaleDateString('fr-FR'));
  }, []);

  if (!isOpen) return null;

  const profile = userProfile || { firstName: 'Cliente', lastName: 'Kènè' };
  const clientName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || profile.name || 'Cliente Privilège';
  const latestDiag = Array.isArray(diagnoses) && diagnoses.length > 0 ? diagnoses[0] : null;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleShareStory = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Passeport Beauté Kènè OS — ${clientName}`,
          text: `Mon Passeport Beauté & Diagnostique Dermo-IA certifié par Kènè OS.`,
          url: window.location.href,
        });
      } catch (e) {}
    } else {
      alert('Passeport prêt à être partagé !');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          className="kene-beauty-passport kene-printable-document relative max-w-2xl w-full bg-[#0F0A05] border-2 border-[#C8951E]/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-6 overflow-hidden print:p-0 print:border-none print:shadow-none print:bg-white print:text-black"
        >
          {/* Background Adinkra Watermark */}
          <div className="absolute top-4 right-4 opacity-5 pointer-events-none print:hidden">
            <GyeNyameIcon className="w-64 h-64 text-[#C8951E]" />
          </div>

          {/* Close & Action Buttons (Hidden on Print) */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 print:hidden">
            <div className="flex items-center gap-2">
              <Badge className="bg-[#C8951E]/20 text-[#F3E5AB] border border-[#C8951E]/40 font-mono text-[10px]">
                PASSEPORT BEAUTÉ OFFICIEL KÈNÈ OS
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handlePrint}
                className="bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-black font-black text-xs rounded-xl h-8 px-3 flex items-center gap-1.5 shadow-md hover:scale-105 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer PDF</span>
              </Button>
              <Button
                onClick={handleShareStory}
                variant="outline"
                className="border-white/15 text-white/80 hover:bg-white/10 rounded-xl h-8 px-3 text-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
              </Button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 🌟 PASSEPORT BEAUTÉ CONTENT CARD (OFFICIAL CERTIFICATE DESIGN) */}
          <div className="kene-beauty-passport space-y-6 bg-gradient-to-b from-[#1A1410] to-[#0A0603] border border-[#C8951E]/30 rounded-2xl p-6 relative overflow-hidden">
            
            {/* Header Brand */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 print:border-black">
              <KeneLogo href="/" subtitle="PASSEPORT BEAUTÉ" size="md" />
              <div className="text-right">
                <span className="text-[10px] font-mono text-[#F3E5AB] block print:text-black font-bold">N° REGISTRAR-AFRICA-2024</span>
                <span className="text-[9px] font-mono text-white/50 block print:text-black">Certifié UEMOA & Dermo-IA</span>
              </div>
            </div>

            {/* Profile Info Block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/10 print:bg-gray-50 print:border-gray-300">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-white/50 uppercase block print:text-gray-600">Titulaire du Passeport :</span>
                <h3 className="font-display font-black text-xl text-[#F3E5AB] print:text-black">{clientName}</h3>
                {profile.phone && <p className="text-xs text-white/70 print:text-black">📱 {profile.phone}</p>}
                {profile.email && <p className="text-xs text-white/70 print:text-black">✉️ {profile.email}</p>}
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-white/50 uppercase block print:text-gray-600">Classification Cutanée :</span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 print:text-black">
                  <ScanFace className="w-4 h-4 text-[#C8951E]" />
                  <span>{profile.fitzpatrickType || 'Phototype V (Fitzpatrick)'}</span>
                </div>
                <p className="text-xs text-white/80 print:text-black font-semibold">Diagnostique : {profile.skinType || 'Peau Mélanoderme'}</p>
              </div>
            </div>

            {/* Personalized Botanical Formulation */}
            <div className="space-y-2">
              <h4 className="font-display font-bold text-sm text-[#F3E5AB] flex items-center gap-1.5 print:text-black">
                <Sprout className="w-4 h-4 text-[#C8951E]" /> Ordonnance & Ingrédients Actifs Certifiés
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="bg-black/50 border border-white/10 p-3 rounded-xl print:bg-gray-100 print:border-gray-300">
                  <span className="text-[10px] font-mono text-[#C8951E] block font-bold">1. Hydratation Nuit</span>
                  <p className="text-xs font-semibold text-white print:text-black mt-0.5">Beurre de Karité Pur de Korhogo</p>
                </div>
                <div className="bg-black/50 border border-white/10 p-3 rounded-xl print:bg-gray-100 print:border-gray-300">
                  <span className="text-[10px] font-mono text-[#4E9FD1] block font-bold">2. Anti-Hyperpigmentation</span>
                  <p className="text-xs font-semibold text-white print:text-black mt-0.5">Sérum Baobab de Tambacounda</p>
                </div>
                <div className="bg-black/50 border border-white/10 p-3 rounded-xl print:bg-gray-100 print:border-gray-300">
                  <span className="text-[10px] font-mono text-[#4CAF6E] block font-bold">3. Fortification Cuir Chevelu</span>
                  <p className="text-xs font-semibold text-white print:text-black mt-0.5">Nectar Botanique à la Poudre de Chebe</p>
                </div>
              </div>
            </div>

            {/* Verified Diagnostic Log */}
            {latestDiag && (
              <div className="p-3 bg-[#C8951E]/10 border border-[#C8951E]/30 rounded-xl space-y-1 print:bg-yellow-50 print:border-yellow-300">
                <span className="text-[10px] font-mono text-[#F3E5AB] font-bold block print:text-black">Dernier Scanner VLM :</span>
                <p className="text-xs text-white/90 print:text-black font-medium">{latestDiag.summary || 'Score d\'alignement spectral 98%. Cartographie cutanée validée.'}</p>
              </div>
            )}

            {/* Official Seal / Signature Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/50 print:border-black print:text-black">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C8951E]" /> Sceau d'Authenticité Kènè OS
              </span>
              <span>Délivré le {dateStr || '2026'}</span>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
