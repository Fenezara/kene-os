'use client';

import React from 'react';
import { KeneLogo } from '@/components/ui/logo';
import { SankofaIcon, GyeNyameIcon } from '@/components/ui/adinkra-icons';
import { Printer, Download, Sparkles, ShieldCheck, CheckSquare, QrCode } from 'lucide-react';
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
  salonName = 'Institut Beauté Kènè',
  salonPhone = '+225 07 00 11 22 33',
  salonAddress = 'Cocody II Plateaux, Abidjan 🇨🇮',
  clientData,
  onClose,
}: PrintableAnamnesisSheetProps) {

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* ── ACTION BAR (Non-printable controls) ── */}
      <div className="print:hidden bg-[#1A1410] border border-[#C8951E]/40 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#C8951E]/20 border border-[#C8951E]/50 flex items-center justify-center">
            <Printer className="w-5 h-5 text-[#F3E5AB]" />
          </div>
          <div>
            <h3 className="text-sm font-display font-bold text-white">Fiche Anamnèse Clinique Physico-Numérique A4</h3>
            <p className="text-xs text-white/60">Imprimez ce document de luxe pour la collecte manuelle à l'accueil du salon</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onClose && (
            <Button variant="outline" onClick={onClose} className="border-white/10 text-white/70 hover:text-white text-xs">
              Fermer
            </Button>
          )}
          <Button
            onClick={handlePrint}
            className="bg-gradient-to-r from-[#C8951E] to-[#F3E5AB] text-[#0F0A05] font-black text-xs shadow-lg hover:brightness-110 flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> Imprimer Fiche A4 (1-Clic)
          </Button>
        </div>
      </div>

      {/* ── PRINTABLE A4 CONTAINER (Targeted by @media print) ── */}
      <div className="kene-printable-anamnesis bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-2xl max-w-4xl mx-auto font-sans relative overflow-hidden text-sm leading-relaxed">
        
        {/* Subtle Watermark Logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
          <SankofaIcon className="w-[500px] h-[500px] text-[#C8951E]" />
        </div>

        {/* ── EN-TÊTE ET BRANDING SALON ── */}
        <div className="flex justify-between items-start border-b-2 border-[#C8951E] pb-6 mb-6">
          <div className="space-y-1">
            <h1 className="font-display font-black text-2xl text-[#0F0A05] tracking-tight uppercase">
              {salonName}
            </h1>
            <p className="text-xs text-slate-600 font-medium">{salonAddress} • Tel: {salonPhone}</p>
            <span className="inline-block text-[10px] font-mono font-bold bg-[#C8951E]/15 text-[#8A5A00] border border-[#C8951E]/40 px-2.5 py-0.5 rounded-full mt-1 uppercase">
              Établissement Agréé Kènè OS • Conformité UEMOA
            </span>
          </div>

          <div className="text-right flex flex-col items-end">
            <div className="w-16 h-16 border-2 border-[#C8951E] p-1 rounded-xl bg-slate-50 flex items-center justify-center mb-1">
              <QrCode className="w-12 h-12 text-[#0F0A05]" />
            </div>
            <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider">
              Scan Import Kènè OS
            </span>
          </div>
        </div>

        {/* ── TITRE DU DOCUMENT ── */}
        <div className="bg-[#0F0A05] text-[#F3E5AB] p-3.5 rounded-xl flex items-center justify-between mb-6 shadow-md">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C8951E]" />
            <h2 className="font-display font-bold text-sm tracking-wide uppercase">
              FICHE D'ANAMNÈSE CLINIQUE & BILAN DERMO-COSMÉTIQUE
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-white/60">RÉF: KENE-ANM-{Date.now().toString().slice(-6)}</span>
        </div>

        {/* ── SECTION 1 : IDENTITÉ CLIENTE ── */}
        <div className="space-y-3 mb-6">
          <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#8A5A00] border-b border-slate-200 pb-1 flex items-center gap-1.5">
            <span>👤</span> 1. IDENTITÉ & COORDONNÉES DE LA CLIENTE
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="border-b border-slate-300 pb-1">
              <span className="text-slate-500 block text-[10px] font-bold">NOM & PRÉNOM(S) :</span>
              <span className="font-semibold text-slate-900">{clientData?.name || '_____________________________________________'}</span>
            </div>
            <div className="border-b border-slate-300 pb-1">
              <span className="text-slate-500 block text-[10px] font-bold">TÉLÉPHONE / WHATSAPP :</span>
              <span className="font-semibold text-slate-900">{clientData?.phone || '_____________________________________________'}</span>
            </div>
            <div className="border-b border-slate-300 pb-1">
              <span className="text-slate-500 block text-[10px] font-bold">EMAIL :</span>
              <span className="font-semibold text-slate-900">{clientData?.email || '_____________________________________________'}</span>
            </div>
            <div className="border-b border-slate-300 pb-1">
              <span className="text-slate-500 block text-[10px] font-bold">DATE DE NAISSANCE / AGE :</span>
              <span className="font-semibold text-slate-900">____ / ____ / ________  ( _____ Ans )</span>
            </div>
          </div>
        </div>

        {/* ── SECTION 2 : PROFIL CUTANÉ & PHOTOTYPE ── */}
        <div className="space-y-3 mb-6">
          <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#8A5A00] border-b border-slate-200 pb-1 flex items-center gap-1.5">
            <span>🧬</span> 2. AUTO-ÉVALUATION CUTANÉE & PHOTOTYPE FITZPATRICK
          </h3>
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-700 font-bold block mb-1.5">A. Type de Peau Perçu :</span>
              <div className="space-y-1 text-slate-600">
                <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-slate-400" /> Normal / Équilibré</label>
                <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-slate-400" /> Mixte (Zone T grasse)</label>
                <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-slate-400" /> Gras / Séborrhéique</label>
                <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-slate-400" defaultChecked={!clientData?.skinType} /> Sec / Déshydraté / Tiraillements</label>
              </div>
            </div>

            <div>
              <span className="text-slate-700 font-bold block mb-1.5">B. Phototype Fitzpatrick (Teint) :</span>
              <div className="space-y-1 text-slate-600">
                <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-slate-400" /> Phototype IV (Marron Clair / Méditerranéen)</label>
                <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-slate-400" defaultChecked /> Phototype V (Marron Foncé / Métissé / Afro)</label>
                <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-slate-400" /> Phototype VI (Noir Très Foncé / Ébène)</label>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 3 : ANTÉCÉDENTS MÉDICAUX & ALLERGIES ── */}
        <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#8A5A00] flex items-center gap-1.5">
            <span>⚠️</span> 3. ANTÉCÉDENTS CLINIQUE & ALLERGIES (OBLIGATOIRE)
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-700">
            <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-slate-400" /> Allergies Huiles / Huiles Essentielles</label>
            <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-slate-400" /> Enceinte ou Allaitante</label>
            <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-slate-400" /> Traitement Roaccutane / Rétinoïdes (&lt; 6 mois)</label>
            <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-slate-400" /> Peelings ou Laser Récents (&lt; 1 mois)</label>
          </div>
          <div className="border-t border-slate-200 pt-2 text-xs">
            <span className="text-slate-500 font-bold block text-[10px]">Précisez vos allergies connues :</span>
            <p className="text-slate-800 italic">___________________________________________________________________________________</p>
          </div>
        </div>

        {/* ── SECTION 4 : OBJECTIFS DE SOIN PRINCIPAUX ── */}
        <div className="space-y-3 mb-6">
          <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#8A5A00] border-b border-slate-200 pb-1 flex items-center gap-1.5">
            <span>🎯</span> 4. VOS OBJECTIFS & ATTENTES DE SOIN PRIORITAIRES
          </h3>
          <div className="grid grid-cols-3 gap-2 text-xs text-slate-700">
            <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-slate-400" defaultChecked /> Éliminer Taches Sombre (PIH)</label>
            <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-slate-400" defaultChecked /> Hydratation & Nutrition Karité</label>
            <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-slate-400" /> Traitement Acné / Boutons</label>
            <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-slate-400" /> Éclat & Uniformité du Teint</label>
            <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-slate-400" /> Resserrer les Pores Dilatés</label>
            <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-slate-400" /> Anti-Âge & Fermeté Baobab</label>
          </div>
        </div>

        {/* ── SECTION 5 : CONSENTEMENT ÉCLAIRÉ & SIGNATURE ── */}
        <div className="border-t-2 border-slate-300 pt-4 mt-6 grid grid-cols-2 gap-6 text-xs">
          <div className="space-y-2">
            <span className="font-bold text-slate-800 block text-[11px]">CONSENTEMENT ÉCLAIRÉ CLIENTE :</span>
            <p className="text-[10px] text-slate-500 leading-tight">
              Je certifie l'exactitude des informations fournies ci-dessus. J'autorise le salon à effectuer le scan dermo-IA 3D et à conserver mon bilan dans mon espace sécurisé Kènè OS.
            </p>
            <div className="border-b border-slate-300 pt-6">
              <span className="text-[9px] text-slate-400 block">Signature de la Cliente :</span>
            </div>
          </div>

          <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="font-bold text-[#8A5A00] block text-[11px]">CADRE RÉSERVÉ À LA PRATICIENNE :</span>
            <p className="text-[10px] text-slate-600">Date du Soin : _____ / _____ / _________</p>
            <p className="text-[10px] text-slate-600">Praticienne Référente : ____________________</p>
            <p className="text-[10px] text-slate-600">Score Hydratation Scan 3D : _____ %</p>
          </div>
        </div>

        {/* ── FOOTER DE DOCUMENT ── */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center text-[9px] text-slate-400 font-mono">
          <span>KÈNÈ OS v2.4 • Plateforme Homologuée Beauté Africaine & UEMOA</span>
          <span>Page 1 / 1</span>
        </div>
      </div>

      {/* ── CSS FOR CLEAN A4 PRINTING ── */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .kene-printable-anamnesis, .kene-printable-anamnesis * {
            visibility: visible;
          }
          .kene-printable-anamnesis {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
}
