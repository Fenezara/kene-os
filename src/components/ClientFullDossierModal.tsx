'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Calendar, Phone, Mail, MessageCircle, ShieldAlert, Award, Camera, Plus,
  Printer, Sparkles, FileText, ChevronRight, Droplets, Sun, Activity, CheckCircle2, Clock, MapPin, User,
  Smartphone, ShoppingBag, CreditCard, Scissors, Heart, Check, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface EvolutionPhoto {
  id: string;
  date: string;
  stage: string; // ex: 'J-0 (Diagnostic Initial)', 'J+15 (Mi-Traitement)', 'J+30 (Résultat)'
  src: string;
  notes: string;
  metrics: { hydration: number; pihScore: number; glow: string };
}

interface ClientFullDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: any;
  onNewConsultation?: (client: any) => void;
  onPrintPassport?: (client: any) => void;
}

const DEFAULT_EVOLUTION_PHOTOS: EvolutionPhoto[] = [
  {
    id: 'photo-1',
    date: '15/06/2026',
    stage: 'J-0 (Diagnostic Initial)',
    src: '/images/afro_skin_spectral_scanner.jpg',
    notes: 'Hyperpigmentation (PIH) prononcée sur les pommettes. Sécheresse de surface.',
    metrics: { hydration: 62, pihScore: 68, glow: 'Modéré' }
  },
  {
    id: 'photo-2',
    date: '30/06/2026',
    stage: 'J+15 (Mi-Parcours - 2ème Séance)',
    src: '/images/afro_beauty_hero_woman.jpg',
    notes: 'Atténuation visible des bordures pigmentées. Barrière lipidique restaurée.',
    metrics: { hydration: 76, pihScore: 45, glow: 'Nourri' }
  },
  {
    id: 'photo-3',
    date: '15/07/2026',
    stage: 'J+30 (Résultat Post-Soin)',
    src: '/images/afro_skin_spectral_scanner.jpg',
    notes: 'Teint parfaitement unifié et lumineux. Prescription sérum Baobab à maintenir.',
    metrics: { hydration: 84, pihScore: 22, glow: '+42% Éclat' }
  }
];

export function ClientFullDossierModal({
  isOpen,
  onClose,
  client,
  onNewConsultation,
  onPrintPassport,
}: ClientFullDossierModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'self_diagnostic' | 'photos' | 'consultations' | 'appointments' | 'purchases' | 'hair_prescriptions'>('overview');
  const [photosList, setPhotosList] = useState<EvolutionPhoto[]>(DEFAULT_EVOLUTION_PHOTOS);
  const [selectedPhoto, setSelectedPhoto] = useState<EvolutionPhoto>(DEFAULT_EVOLUTION_PHOTOS[2]);
  const [clientAvatar, setClientAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (client?.avatar) {
      setClientAvatar(client.avatar);
    } else {
      setClientAvatar(null);
    }
  }, [client]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setClientAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const newPhoto: EvolutionPhoto = {
        id: `photo-${Date.now()}`,
        date: new Date().toLocaleDateString('fr-FR'),
        stage: `J+${photosList.length * 15} (Nouvelle Prise)`,
        src: reader.result as string,
        notes: 'Photo enregistrée lors du contrôle en cabine.',
        metrics: { hydration: 86, pihScore: 18, glow: '+50% Éclat' }
      };
      setPhotosList([newPhoto, ...photosList]);
      setSelectedPhoto(newPhoto);
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen || !client) return null;

  const fitzColor = client.fitzpatrickType === 'VI' ? '#6B3A2A' : client.fitzpatrickType === 'IV' ? '#CA9B5C' : '#A0522D';
  let allergies: string[] = [];
  try {
    allergies = typeof client.allergies === 'string' && client.allergies.startsWith('[')
      ? JSON.parse(client.allergies)
      : client.allergies ? [client.allergies] : [];
  } catch (e) {
    allergies = typeof client.allergies === 'string' ? [client.allergies] : [];
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-xl flex items-center justify-center p-1 sm:p-4 md:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="kene-printable-document relative w-full max-w-6xl bg-[#0F0A05] border-2 border-[#C8951E]/40 text-white rounded-2xl sm:rounded-3xl shadow-[0_0_80px_rgba(200,149,30,0.25)] overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[94vh] my-auto"
        >
          {/* Top Decorative Kente Bar */}
          <div className="h-1.5 sm:h-2 bg-gradient-to-r from-[#C8951E] via-[#8A3B14] via-[#2E5A36] via-[#1E3A5F] to-[#C8951E]" />

          {/* ── HEADER GRAND FORMAT RESPONSIVE (MOBILE / TABLET / PC) ── */}
          <div className="p-4 sm:p-6 border-b border-white/10 bg-gradient-to-r from-[#1A1410] via-[#241C16] to-[#1A1410] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <label className="relative cursor-pointer group shrink-0" title="Cliquez pour changer la photo de profil">
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                <div
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center font-display font-black text-lg sm:text-2xl text-[#0F0A05] shadow-xl overflow-hidden border-2 border-[#C8951E] group-hover:border-[#F3E5AB] transition"
                  style={{ background: `linear-gradient(135deg, ${fitzColor}, #F3E5AB)` }}
                >
                  {clientAvatar ? (
                    <img src={clientAvatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <>{client.firstName?.charAt(0)}{client.lastName?.charAt(0)}</>
                  )}
                </div>
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-400 border-2 border-[#0F0A05] flex items-center justify-center text-[9px] sm:text-[10px]" title="Cliente Active">
                  ✓
                </div>
              </label>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-white tracking-tight truncate">
                    {client.firstName} {client.lastName}
                  </h2>
                  <Badge className="bg-[#C8951E] text-black font-black text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5">
                    💎 Membre Platine
                  </Badge>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-white/60 mt-1 flex-wrap font-mono">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#C8951E]" /> {client.phone}</span>
                  {client.email && <span className="hidden md:flex items-center gap-1"><Mail className="w-3 h-3 text-[#C8951E]" /> {client.email}</span>}
                  <span className="text-[#F3E5AB]">🗓️ {client.createdAt ? format(new Date(client.createdAt), 'dd/MM/yyyy') : 'Date inconnue'}</span>
                  <span className="text-emerald-400 font-bold">💰 285 000 FCFA</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10">
              <a
                href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/50 rounded-xl font-bold text-xs hover:bg-[#25D366]/30 transition"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* ── NAVIGATION TABS (SELECT DROPDOWN ON MOBILE, HIGH-CONTRAST PILLS ON TABLET & PC) ── */}
          <div className="border-b border-white/10 bg-[#0A0603] px-3 sm:px-6 py-2.5">
            {/* Mobile Dropdown Menu (< 640px) */}
            <div className="sm:hidden w-full">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as any)}
                className="w-full bg-[#1A1410] border-2 border-[#C8951E] text-[#F3E5AB] font-bold text-xs rounded-xl p-2.5 outline-none font-display shadow-lg"
              >
                <option value="overview">📋 Vue Globale Client</option>
                <option value="self_diagnostic">📱 Bilan Auto-Réalisé Cliente</option>
                <option value="photos">📸 Galerie Évolution Photos ({photosList.length})</option>
                <option value="consultations">🔬 Scan Cabine & Consultations</option>
                <option value="appointments">📅 Visites & Rendez-Vous</option>
                <option value="purchases">🧾 Caisse POS & Factures</option>
                <option value="hair_prescriptions">🌱 Diagnostic Capillaire & Soins</option>
              </select>
            </div>

            {/* Tablet & Desktop Tab Pills (>= 640px) */}
            <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {[
                { id: 'overview' as const, label: '📋 Vue Globale', icon: User },
                { id: 'self_diagnostic' as const, label: '📱 Bilan Auto-Réalisé', icon: Smartphone, highlight: true },
                { id: 'photos' as const, label: '📸 Photos Évolution', icon: Camera, badge: photosList.length },
                { id: 'consultations' as const, label: '🔬 Scan Cabine', icon: Activity },
                { id: 'appointments' as const, label: '📅 Visites & RDV', icon: Calendar },
                { id: 'purchases' as const, label: '🧾 Caisse POS', icon: ShoppingBag },
                { id: 'hair_prescriptions' as const, label: '🌱 Capillaire', icon: Sparkles },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-3.5 rounded-xl font-display font-bold text-xs transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 border ${
                    activeTab === tab.id
                      ? tab.highlight 
                        ? 'border-sky-400 text-black bg-sky-300 font-black shadow-md' 
                        : 'border-[#C8951E] text-[#0F0A05] bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] font-black shadow-md'
                      : 'border-white/10 text-white/80 hover:text-white hover:bg-white/5 bg-white/5'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${activeTab === tab.id ? 'bg-[#0F0A05] text-[#F3E5AB]' : 'bg-[#C8951E] text-[#0F0A05]'}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── CONTENT BODY (RESPONSIVE GRID) ── */}
          <div className="p-3 sm:p-6 overflow-y-auto flex-1 space-y-4 sm:space-y-6">

            {/* TAB 1: VUE GLOBALE & PREFÉRÉES */}
            {activeTab === 'overview' && (
              <div className="space-y-4 sm:space-y-6">
                {/* 4 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-[#1A1410] border border-[#C8951E]/30 p-3.5 sm:p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] font-mono text-white/50 uppercase block">Type de Peau</span>
                    <div className="text-sm sm:text-base font-display font-black text-[#F3E5AB] capitalize">
                      🌗 Peau {client.skinType}
                    </div>
                    <span className="text-[10px] text-white/40 block">Tendance déshydratée zone T</span>
                  </div>

                  <div className="bg-[#1A1410] border border-[#C8951E]/30 p-3.5 sm:p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] font-mono text-white/50 uppercase block">Phototype Fitzpatrick</span>
                    <div className="text-sm sm:text-base font-display font-black text-amber-300 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: fitzColor }} />
                      <span>Type {client.fitzpatrickType} (Afro)</span>
                    </div>
                    <span className="text-[10px] text-white/40 block">Haute sensibilité taches PIH</span>
                  </div>

                  <div className="bg-[#1A1410] border border-[#C8951E]/30 p-3.5 sm:p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] font-mono text-white/50 uppercase block">Allergies / Évités</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {allergies.length > 0 ? (
                        allergies.map((a: string, i: number) => (
                          <span key={i} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40">
                            ⚠️ {a}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-emerald-400 font-bold">✓ Aucune allergie</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#1A1410] border border-[#C8951E]/30 p-3.5 sm:p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] font-mono text-white/50 uppercase block">Fidélité & Points Kènè</span>
                    <div className="text-sm sm:text-base font-display font-black text-emerald-400">
                      💎 1 850 Points
                    </div>
                    <span className="text-[10px] text-amber-300 font-bold block">Remise 15% active en caisse</span>
                  </div>
                </div>

                {/* Preferences & Salon Habits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-[#150D07] border border-white/10 p-4 sm:p-5 rounded-2xl sm:rounded-3xl space-y-3">
                    <h3 className="font-display font-bold text-xs sm:text-sm text-[#F3E5AB] flex items-center gap-2">
                      <Heart className="w-4 h-4 text-[#C8951E]" /> Préférences Personnelles & Confort
                    </h3>
                    <div className="space-y-2 text-xs text-white/80 font-sans">
                      <p className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-white/40">Boisson d'accueil :</span>
                        <strong className="text-white text-right">Bissap glacé gingembre 🌺</strong>
                      </p>
                      <p className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-white/40">Pression massage :</span>
                        <strong className="text-white">Moyenne à appuyée</strong>
                      </p>
                      <p className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-white/40">Praticienne préférée :</span>
                        <strong className="text-amber-300">Fatou Koné</strong>
                      </p>
                      <p className="flex justify-between py-1">
                        <span className="text-white/40">Créneau habituel :</span>
                        <strong className="text-white">Vendredi après-midi</strong>
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#150D07] border border-white/10 p-4 sm:p-5 rounded-2xl sm:rounded-3xl space-y-3">
                    <h3 className="font-display font-bold text-xs sm:text-sm text-[#F3E5AB] flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#C8951E]" /> Synthèse Clinique Cabine
                    </h3>
                    <div className="space-y-2 text-xs text-white/80 font-sans">
                      <p className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-white/40">Score Cutané Cabine :</span>
                        <strong className="text-emerald-400 font-bold">78/100 (Bon)</strong>
                      </p>
                      <p className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-white/40">Hydratation Epidermique :</span>
                        <strong className="text-sky-300">84% (+22% vs J-0)</strong>
                      </p>
                      <p className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-white/40">Profondeur PIH :</span>
                        <strong className="text-amber-300">0.2mm (Réversible)</strong>
                      </p>
                      <p className="flex justify-between py-1">
                        <span className="text-white/40">Prochain Soin :</span>
                        <strong className="text-emerald-400">Karité-Baobab (dans 12j)</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: BILAN CUTANÉ AUTO-RÉALISÉ PAR LA CLIENTE */}
            {activeTab === 'self_diagnostic' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-gradient-to-r from-[#1A2634] via-[#151F2B] to-[#1A2634] border border-sky-400/40 p-4 sm:p-5 rounded-2xl sm:rounded-3xl space-y-4 shadow-xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-sky-400/20 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-sky-400/20 border border-sky-400/50 flex items-center justify-center text-sky-300 shrink-0">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-sm sm:text-base text-white">
                          Bilan Cutané Auto-Réalisé par {client.firstName} depuis son Appareil
                        </h3>
                        <p className="text-[11px] text-sky-200/70 font-mono">
                          Soumis directement par la cliente via l'application Web/Mobile PWA
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="bg-sky-400 text-black font-black text-[9px] sm:text-[10px] uppercase">
                        📱 iPhone 15 Pro (iOS)
                      </Badge>
                      <span className="text-[11px] font-mono text-sky-300 font-bold">🗓️ 04/08/2026 à 14:32</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Selfie Client Capture */}
                    <div className="space-y-2">
                      <span className="text-xs font-mono font-bold text-sky-200 block">📸 Selfie Capturé par la Cliente :</span>
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-black border border-sky-400/30">
                        <img src="/images/afro_skin_spectral_scanner.jpg" alt="Selfie client" className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 left-2 bg-black/80 text-sky-300 text-[10px] font-mono px-2 py-0.5 rounded-lg border border-sky-400/30">
                          Vue Face Auto-Scan
                        </div>
                      </div>
                    </div>

                    {/* Auto-Evaluation Answers */}
                    <div className="md:col-span-2 space-y-3 bg-[#0A1017] p-4 rounded-2xl border border-sky-400/20 text-xs">
                      <h4 className="font-bold text-sky-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <span>📝</span> Réponses au Questionnaire Auto-Diagnostique Client :
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-white/80">
                        <div className="bg-[#101824] p-3 rounded-xl border border-white/5 space-y-1">
                          <span className="text-white/40 text-[10px] block">Ressenti Cutané Déclaré :</span>
                          <strong className="text-amber-300 block">Tiraillements le soir + Zone T brillante</strong>
                        </div>
                        <div className="bg-[#101824] p-3 rounded-xl border border-white/5 space-y-1">
                          <span className="text-white/40 text-[10px] block">Préoccupation Majeure :</span>
                          <strong className="text-amber-300 block">Taches sombres de boutons sur les joues</strong>
                        </div>
                        <div className="bg-[#101824] p-3 rounded-xl border border-white/5 space-y-1">
                          <span className="text-white/40 text-[10px] block">Exposition Solaire Déclarée :</span>
                          <strong className="text-white block">Élevée (Trajets voiture & marche 2h/jour)</strong>
                        </div>
                        <div className="bg-[#101824] p-3 rounded-xl border border-white/5 space-y-1">
                          <span className="text-white/40 text-[10px] block">Écran Solaire Utilisé :</span>
                          <strong className="text-red-400 block">Non (Sensation collante évitée)</strong>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-sky-400/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <span className="text-sky-200/70 text-[11px]">Score Auto-Scan Client : <strong className="text-emerald-400">72/100</strong></span>
                        <Button className="bg-sky-400 text-black font-bold text-xs h-8 w-full sm:w-auto">
                          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Comparer avec Diagnostic Pro
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ÉVOLUTION PHOTOS */}
            {activeTab === 'photos' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#1A1410] p-4 rounded-2xl border border-white/10 gap-3">
                  <div>
                    <h3 className="font-display font-bold text-sm text-white">Galerie Chronologique du Traitement</h3>
                    <p className="text-xs text-white/50">Suivi visuel des résultats au fil des séances</p>
                  </div>

                  <label className="cursor-pointer w-full sm:w-auto">
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    <span className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C8951E] to-[#F3E5AB] text-[#0F0A05] font-black text-xs shadow-lg hover:brightness-110">
                      <Camera className="w-4 h-4" /> 📸 Ajouter Photo d'Évolution
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
                  <div className="md:col-span-8 bg-[#150D07] border border-[#C8951E]/40 rounded-2xl sm:rounded-3xl p-3 sm:p-4 space-y-4">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-white/10">
                      <img src={selectedPhoto.src} alt={selectedPhoto.stage} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 bg-black/80 border border-[#C8951E] px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold text-[#F3E5AB]">
                        {selectedPhoto.stage}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/80 border border-white/10 px-2.5 py-1 rounded-xl text-[11px] font-mono text-white/70">
                        🗓️ {selectedPhoto.date}
                      </div>
                    </div>

                    <div className="bg-[#0A0603] p-3 sm:p-4 rounded-2xl border border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#C8951E]">Observations Cliniques :</span>
                        <span className="font-mono text-emerald-400 font-bold">{selectedPhoto.metrics.glow}</span>
                      </div>
                      <p className="text-xs text-white/80 font-sans">{selectedPhoto.notes}</p>
                    </div>
                  </div>

                  <div className="md:col-span-4 space-y-3">
                    <span className="text-xs font-mono font-bold text-white/50 uppercase block">Timeline Prises de Vue ({photosList.length})</span>
                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                      {photosList.map(photo => (
                        <div
                          key={photo.id}
                          onClick={() => setSelectedPhoto(photo)}
                          className={`p-3 rounded-2xl border transition cursor-pointer flex items-center gap-3 ${
                            selectedPhoto.id === photo.id
                              ? 'bg-[#C8951E]/20 border-[#C8951E] shadow-lg'
                              : 'bg-[#1A1410] border-white/10 hover:border-white/30'
                          }`}
                        >
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-black border border-white/10 shrink-0">
                            <img src={photo.src} alt={photo.stage} className="w-full h-full object-cover" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-white block line-clamp-1">{photo.stage}</span>
                            <span className="text-[10px] font-mono text-white/50 block">🗓️ {photo.date}</span>
                            <span className="text-[10px] text-emerald-400 font-bold block">{photo.metrics.glow}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: CONSULTATIONS */}
            {activeTab === 'consultations' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <h3 className="font-display font-bold text-sm text-white">Consultations Dermatologiques & Examens</h3>
                  {onNewConsultation && (
                    <Button onClick={() => onNewConsultation(client)} className="bg-[#C8951E] text-black font-bold text-xs h-9 w-full sm:w-auto">
                      + Nouvelle Consultation
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  {[
                    { date: '01/08/2026', type: 'Contrôle Suivi PIH', note: 'Diminution des zones de taches de 65%. Barrière cutanée hydratée.', doc: 'Dr. Aminata Diallo' },
                    { date: '15/06/2026', type: 'Consultation Initiale 3D', note: 'Bilan dermo-spectral complet. Phototype V identifié. Début cure Karité-Baobab.', doc: 'Fatou Koné' },
                  ].map((cons, idx) => (
                    <div key={idx} className="bg-[#1A1410] border border-white/10 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#F3E5AB]">🗓️ {cons.date}</span>
                          <Badge variant="outline" className="border-[#C8951E]/40 text-[#C8951E] text-[10px]">{cons.type}</Badge>
                        </div>
                        <p className="text-xs text-white/80 leading-relaxed">{cons.note}</p>
                        <span className="text-[10px] text-white/40 block font-mono">Praticienne : {cons.doc}</span>
                      </div>
                      <Button variant="outline" onClick={() => onPrintPassport?.(client)} className="border-white/10 text-xs text-white/70 hover:text-white shrink-0 w-full sm:w-auto">
                        <Printer className="w-3.5 h-3.5 mr-1" /> Imprimer Rapport
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: RENDEZ-VOUS */}
            {activeTab === 'appointments' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <h3 className="font-display font-bold text-sm text-white">Historique des Rendez-Vous</h3>
                  <Button className="bg-[#C8951E] text-black font-bold text-xs h-9 w-full sm:w-auto">
                    + Prendre un Rendez-Vous
                  </Button>
                </div>

                <div className="space-y-3 text-xs">
                  {[
                    { date: 'Demain 14:00', service: 'Soin Scellant Karité-Baobab (60 min)', status: 'Confirmé', price: '35 000 FCFA', doc: 'Fatou Koné' },
                    { date: '15/07/2026 15:30', service: 'Massage Réparateur Huile de Neem (45 min)', status: 'Terminé', price: '25 000 FCFA', doc: 'Aminata Diallo' },
                  ].map((rdv, idx) => (
                    <div key={idx} className="bg-[#1A1410] border border-white/10 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <span className="font-bold text-white text-sm block">{rdv.service}</span>
                        <div className="flex items-center gap-3 text-white/50 text-[11px] font-mono">
                          <span>🗓️ {rdv.date}</span>
                          <span>👤 {rdv.doc}</span>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                        <span className="font-display font-black text-amber-300 block">{rdv.price}</span>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px]">{rdv.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: ACHATS POS */}
            {activeTab === 'purchases' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm text-white">Factures & Achats Caisse POS</h3>
                  <span className="text-xs font-mono text-[#F3E5AB] font-bold">Total : 285 000 FCFA</span>
                </div>

                <div className="space-y-3 text-xs">
                  {[
                    { ref: 'FAC-2026-089', date: '15/07/2026', items: 'Sérum Niacinamide & Baobab (50ml) + Beurre de Karité (200g)', total: '45 000 FCFA', mode: 'Wave Digital' },
                    { ref: 'FAC-2026-042', date: '15/06/2026', items: 'Soin Visage Cabine + Gel Aloe Vera 99% + Écran Solaire SPF 50', total: '75 000 FCFA', mode: 'Orange Money' },
                  ].map((fact, idx) => (
                    <div key={idx} className="bg-[#1A1410] border border-white/10 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#C8951E] text-xs">{fact.ref}</span>
                          <span className="text-white/40 text-[10px]">🗓️ {fact.date}</span>
                        </div>
                        <p className="text-xs text-white/80 font-sans">{fact.items}</p>
                        <span className="text-[10px] text-sky-400 font-mono block">Règlement : {fact.mode}</span>
                      </div>
                      <span className="font-display font-black text-emerald-400 text-sm self-end sm:self-auto">{fact.total}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: CAPILLAIRE */}
            {activeTab === 'hair_prescriptions' && (
              <div className="space-y-4">
                <div className="bg-[#150D07] border border-[#C8951E]/40 p-4 sm:p-5 rounded-2xl sm:rounded-3xl space-y-4">
                  <h3 className="font-display font-bold text-xs sm:text-sm text-[#F3E5AB] flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-[#C8951E]" /> Diagnostic Capillaire & Rituels Tresses/Chebe
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-center">
                    <div className="bg-[#0F0A05] p-3 rounded-xl border border-white/10">
                      <span className="text-[9px] text-white/40 font-mono uppercase block">Type de Boucle</span>
                      <strong className="text-[#F3E5AB] text-sm block mt-0.5">4C (Crépu Très Serré)</strong>
                    </div>
                    <div className="bg-[#0F0A05] p-3 rounded-xl border border-white/10">
                      <span className="text-[9px] text-white/40 font-mono uppercase block">Porosité</span>
                      <strong className="text-amber-300 text-sm block mt-0.5">Moyenne à Forte</strong>
                    </div>
                    <div className="bg-[#0F0A05] p-3 rounded-xl border border-white/10">
                      <span className="text-[9px] text-white/40 font-mono uppercase block">Densité & Longueur</span>
                      <strong className="text-emerald-400 text-sm block mt-0.5">Épaisse · Mid-Back</strong>
                    </div>
                  </div>

                  <div className="bg-[#0A0603] p-3 sm:p-4 rounded-2xl border border-white/10 space-y-2 text-xs">
                    <span className="font-bold text-[#C8951E] block">Rituel Capillaire Conseillé :</span>
                    <p className="text-white/80 leading-relaxed">
                      Bain d'huile chaude de Baobab & Ricin 1 fois par semaine. Masque fortifiant à la Poudre de Chebe du Tchad après shampoing doux surgras. Coiffures protectrices recommandées (Knotless Braids au Beurre de Karité).
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* ── FOOTER ACTIONS (RESPONSIVE BUTTONS) ── */}
          <div className="p-3 sm:p-4 border-t border-white/10 bg-[#0A0603] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[10px] sm:text-xs font-mono text-white/40 text-center sm:text-left">ID Dossier : {client.id}</span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" onClick={onClose} className="border-white/10 text-white/70 text-xs flex-1 sm:flex-none">
                Fermer
              </Button>
              <Button onClick={() => onPrintPassport?.(client)} className="bg-gradient-to-r from-[#C8951E] to-[#F3E5AB] text-[#0F0A05] font-black text-xs flex-1 sm:flex-none">
                <Printer className="w-4 h-4 mr-1.5" /> Passeport PDF
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
