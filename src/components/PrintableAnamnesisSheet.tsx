'use client';

import React from 'react';
import { SankofaIcon, GyeNyameIcon } from '@/components/ui/adinkra-icons';
import { Printer, Sparkles, ShieldCheck, CheckSquare, QrCode, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PrintableAnamnesisSheetProps {
  salonName?: string;
  salonPhone?: string;
  salonAddress?: string;
  clientData?: {
    name?: string;
    phone?: string;
    email?: string;
    skinType?: string;
    phototype?: string;
  };
  onClose?: () => void;
}

export function PrintableAnamnesisSheet({
  salonName = 'Institut Beauté Kènè OS',
  salonPhone = '+225 07 00 11 22 33',
  salonAddress = 'Cocody II Plateaux, Abidjan 🇨🇮',
  clientData,
  onClose,
}: PrintableAnamnesisSheetProps) {

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-4 font-sans select-none">
      {/* ── ACTION BAR (Non-printable controls) ── */}
      <div className="print:hidden bg-[#1A1410] border border-[#C8951E]/40 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#C8951E]/20 border border-[#C8951E]/50 flex items-center justify-center">
            <Printer className="w-5 h-5 text-[#F3E5AB]" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-display font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#C8951E]" /> Fiche Anamnèse Clinique Physico-Numérique A4 (Grand Format)
            </h3>
            <p className="text-xs text-white/60">
              Document Officiel de Collecte Clinique & Bilan Dermo-Cosmétique A4 pour Accueil & Cabinet
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {onClose && (
            <Button variant="outline" onClick={onClose} className="border-white/10 text-white/70 hover:text-white text-xs">
              <X className="w-4 h-4 mr-1" /> Fermer
            </Button>
          )}
          <Button
            onClick={handlePrint}
            className="bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black text-xs h-10 px-5 shadow-lg hover:brightness-110 flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4.5 h-4.5" /> Imprimer Fiche A4 (1-Clic PDF)
          </Button>
        </div>
      </div>

      {/* ── PRINTABLE A4 GRAND FORMAT CONTAINER (Targeted by @media print) ── */}
      <div className="kene-printable-anamnesis kene-printable-sheet kene-printable-document bg-white text-slate-950 p-4 sm:p-8 lg:p-12 rounded-2xl shadow-2xl w-full max-w-full lg:max-w-6xl mx-auto font-sans relative overflow-hidden text-sm leading-relaxed border-2 border-slate-900">
        
        {/* Watermark Logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
          <SankofaIcon className="w-[600px] h-[600px] text-[#C8951E]" />
        </div>

        {/* ── 1. EN-TÊTE ET BRANDING SALON ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b-4 border-slate-900 pb-6 mb-6 gap-4">
          <div className="space-y-1.5">
            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-950 tracking-tight uppercase">
              {salonName}
            </h1>
            <p className="text-xs text-slate-700 font-bold">{salonAddress} • Tel: {salonPhone}</p>
            <span className="inline-block text-[10px] font-mono font-bold bg-slate-100 text-slate-900 border border-slate-400 px-3 py-1 rounded-full uppercase tracking-wider">
              Établissement Agréé Kènè OS • NORMES CLINIQUES OHADA & UEMOA
            </span>
          </div>

          <div className="text-right flex flex-col items-end">
            <div className="w-20 h-20 border-2 border-slate-900 p-1.5 rounded-xl bg-white flex items-center justify-center mb-1 shadow-sm">
              <QrCode className="w-16 h-16 text-slate-950" />
            </div>
            <span className="text-[9px] font-mono text-slate-600 font-bold uppercase tracking-wider">
              NUMÉRISATION SCAN IA
            </span>
          </div>
        </div>

        {/* ── 2. TITRE OFFICIEL DU DOCUMENT ── */}
        <div className="bg-slate-950 text-white p-4 rounded-xl flex items-center justify-between mb-8 shadow-md">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#FFD700]" />
            <h2 className="font-display font-black text-base sm:text-lg tracking-wide uppercase">
              FICHE D'ANAMNÈSE CLINIQUE & BILAN DERMO-COSMÉTIQUE (A4)
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-[#FFD700]">DOC-2026-A4</span>
        </div>

        {/* ── 3. SECTION IDENTITÉ CLIENTE & CONSULTATION ── */}
        <div className="border-2 border-slate-800 rounded-xl p-5 mb-6 space-y-4 bg-slate-50">
          <h3 className="font-display font-bold text-xs text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-2 flex items-center gap-2">
            <span>👤</span> 1. IDENTITÉ CLIENTE & COORDONNÉES DE CONSULTATION
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-semibold">
            <div>
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Nom & Prénom :</span>
              <span className="border-b-2 border-slate-400 block pb-1 pt-0.5 text-slate-900 font-black text-sm">
                {clientData?.name || '________________________________________'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Téléphone / WhatsApp :</span>
              <span className="border-b-2 border-slate-400 block pb-1 pt-0.5 text-slate-900 font-bold">
                {clientData?.phone || '+225 __ __ __ __ __'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Date du Jour :</span>
              <span className="border-b-2 border-slate-400 block pb-1 pt-0.5 text-slate-900 font-bold font-mono">
                {new Date().toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        </div>

        {/* ── 4. SECTION ÉTALONNAGE PHOTOTYPE FITZPATRICK ── */}
        <div className="border-2 border-slate-800 rounded-xl p-5 mb-6 space-y-3">
          <h3 className="font-display font-bold text-xs text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-2 flex items-center gap-2">
            <span>🔬</span> 2. ÉTALONNAGE PHOTOTYPE FITZPATRICK & CARACTÉRISTIQUES CUTANÉES
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-xs">
            {[
              { type: 'I', label: 'Très Clair', desc: 'Coup de soleil 100%' },
              { type: 'II', label: 'Clair', desc: 'Brûle facilement' },
              { type: 'III', label: 'Intermédiaire', desc: 'Bronze modéré' },
              { type: 'IV', label: 'Mat', desc: 'Bronze foncé' },
              { type: 'V', label: 'Brun / Mélano', desc: 'PIH fréquente' },
              { type: 'VI', label: 'Noir Profond', desc: 'Très résistant' },
            ].map((item) => (
              <div key={item.type} className={`border-2 p-2 rounded-xl text-center space-y-1 ${clientData?.phototype === item.type ? 'border-slate-950 bg-slate-100 font-black' : 'border-slate-300'}`}>
                <div className="w-5 h-5 mx-auto border border-slate-700 rounded-md flex items-center justify-center font-bold text-[10px]">
                  {clientData?.phototype === item.type ? '✓' : '☐'}
                </div>
                <span className="font-bold block text-slate-900">Type {item.type}</span>
                <span className="text-[9px] text-slate-600 block leading-tight">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. SECTION QUESTIONNAIRE SANTE & ANAMNÈSE ── */}
        <div className="border-2 border-slate-800 rounded-xl p-5 mb-6 space-y-4">
          <h3 className="font-display font-bold text-xs text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-2 flex items-center gap-2">
            <span>📋</span> 3. QUESTIONNAIRE ANAMNÈSE DE SANTÉ & HISTORIQUE DERMO-COSMÉTIQUE
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2 border-b md:border-b-0 md:border-r border-slate-200 pb-3 md:pb-0 md:pr-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-slate-700 rounded flex items-center justify-center font-bold">☐</div>
                <span>Grossesse ou Allaitement en cours ?</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-slate-700 rounded flex items-center justify-center font-bold">☐</div>
                <span>Allergies cosmétiques ou alimentaires connues ?</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-slate-700 rounded flex items-center justify-center font-bold">☐</div>
                <span>Utilisation de rétinoïdes ou corticoïdes récents ?</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-slate-700 rounded flex items-center justify-center font-bold">☐</div>
                <span>Hyper-pigmentation / Taches sombres (PIH) ?</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-slate-700 rounded flex items-center justify-center font-bold">☐</div>
                <span>Sensation de tiraillement / Peau déshydratée ?</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-slate-700 rounded flex items-center justify-center font-bold">☐</div>
                <span>Exposition solaire fréquente sans protection SPF ?</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 6. SECTION PRESCRIPTION DERMO-COSMÉTIQUE KÈNÈ ── */}
        <div className="border-2 border-slate-800 rounded-xl p-5 mb-6 space-y-3 bg-slate-50">
          <h3 className="font-display font-bold text-xs text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-2 flex items-center gap-2">
            <span>✨</span> 4. PROTOCOLE & PRESCRIPTION DERMO-COSMÉTIQUE RECOMMANDÉE
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-900 font-bold">
            <div className="border border-slate-300 p-2.5 rounded-lg bg-white">
              <span>🥣 Karité Brut Korhogo</span>
              <span className="block text-[9px] text-slate-500 font-normal">Régénération lipidique</span>
            </div>
            <div className="border border-slate-300 p-2.5 rounded-lg bg-white">
              <span>🌳 Huile de Baobab</span>
              <span className="block text-[9px] text-slate-500 font-normal">Scellage hydrique TEWL</span>
            </div>
            <div className="border border-slate-300 p-2.5 rounded-lg bg-white">
              <span>🌺 Sérum Hibiscus</span>
              <span className="block text-[9px] text-slate-500 font-normal">AHA & Éclat anti-taches</span>
            </div>
            <div className="border border-slate-300 p-2.5 rounded-lg bg-white">
              <span>🍃 Extrait de Neem</span>
              <span className="block text-[9px] text-slate-500 font-normal">Purification séborrhique</span>
            </div>
          </div>
        </div>

        {/* ── 7. SIGNATURE ET VALIDATION MANUELLE/NUMÉRIQUE ── */}
        <div className="border-t-2 border-slate-900 pt-6 mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-semibold">
          <div>
            <span className="text-slate-600 block text-[10px] uppercase font-bold">Signature de la Cliente :</span>
            <div className="border-b-2 border-slate-400 h-14 mt-1 flex items-end pb-1">
              <span className="text-[10px] text-slate-400 font-mono italic">« Lu et approuvé pour examen cutané »</span>
            </div>
          </div>

          <div>
            <span className="text-slate-600 block text-[10px] uppercase font-bold">Cachet & Visa de la Praticienne / Dermato :</span>
            <div className="border-b-2 border-slate-400 h-14 mt-1 flex items-end justify-between pb-1">
              <span className="text-[10px] text-slate-400 font-mono italic">Dr. / Praticienne Certifiée Kènè</span>
              <ShieldCheck className="w-5 h-5 text-slate-950" />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-8 text-center text-[9px] font-mono text-slate-500 border-t border-slate-200 pt-3">
          KÈNÈ OS v3.2 • Fiche Anamnèse Clinique Physico-Numérique A4 • Document Protégé & Conforme UEMOA / OHADA
        </div>
      </div>
    </div>
  );
}
