'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Calendar, Phone, Mail, MessageCircle, ShieldAlert, Award, Camera, Plus,
  Printer, Sparkles, FileText, ChevronRight, Droplets, Sun, Activity, CheckCircle2, Clock, MapPin, User
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
  const [activeTab, setActiveTab] = useState<'overview' | 'photos' | 'consultations' | 'prescriptions'>('overview');
  const [photosList, setPhotosList] = useState<EvolutionPhoto[]>(DEFAULT_EVOLUTION_PHOTOS);
  const [selectedPhoto, setSelectedPhoto] = useState<EvolutionPhoto>(DEFAULT_EVOLUTION_PHOTOS[2]);
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);

  if (!isOpen || !client) return null;

  const fitzColor = client.fitzpatrickType === 'VI' ? '#6B3A2A' : client.fitzpatrickType === 'IV' ? '#CA9B5C' : '#A0522D';
  const allergies = JSON.parse(client.allergies || '[]');

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
      setIsAddingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-xl flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-6xl bg-[#0F0A05] border-2 border-[#C8951E]/40 text-white rounded-3xl shadow-[0_0_80px_rgba(200,149,30,0.25)] overflow-hidden flex flex-col max-h-[94vh]"
        >
          {/* Top Decorative Kente Bar */}
          <div className="h-2 bg-gradient-to-r from-[#C8951E] via-[#8A3B14] via-[#2E5A36] via-[#1E3A5F] to-[#C8951E]" />

          {/* ── HEADER GRAND FORMAT ── */}
          <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[#1A1410] via-[#241C16] to-[#1A1410] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center font-display font-black text-2xl text-[#0F0A05] shadow-xl overflow-hidden border-2 border-[#C8951E]"
                  style={{ background: `linear-gradient(135deg, ${fitzColor}, #F3E5AB)` }}
                >
                  {client.avatar ? (
                    <img src={client.avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <>{client.firstName?.charAt(0)}{client.lastName?.charAt(0)}</>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#0F0A05] flex items-center justify-center text-[10px]" title="Cliente Active">
                  ✓
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                    {client.firstName} {client.lastName}
                  </h2>
                  <Badge className="bg-[#C8951E] text-black font-black text-xs px-2.5 py-0.5">
                    💎 Membre Platine
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/60 mt-1 flex-wrap font-mono">
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#C8951E]" /> {client.phone}</span>
                  {client.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-[#C8951E]" /> {client.email}</span>}
                  <span className="text-[#F3E5AB]">🗓️ Inscrite le {format(new Date(client.createdAt), 'dd/MM/yyyy')}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/50 rounded-xl font-bold text-xs hover:bg-[#25D366]/30 transition"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Direct
              </a>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* ── NAVIGATION TABS ── */}
          <div className="flex border-b border-white/10 bg-[#0A0603] px-6 gap-2 overflow-x-auto">
            {[
              { id: 'overview' as const, label: '📋 Vue Globale & Constantes', icon: User },
              { id: 'photos' as const, label: '📸 Évolution Photos (Avant / Après)', icon: Camera, badge: photosList.length },
              { id: 'consultations' as const, label: '🔬 Historique Consultations', icon: Activity },
              { id: 'prescriptions' as const, label: '🌱 Ordonnance Botanique', icon: Sparkles },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 px-4 font-display font-bold text-xs border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#C8951E] text-[#F3E5AB] bg-[#C8951E]/10'
                    : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="bg-[#C8951E] text-[#0F0A05] text-[10px] font-black px-1.5 py-0.2 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── CONTENT BODY ── */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">

            {/* TAB 1: VUE GLOBALE & CONSTANTES */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* 3 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#1A1410] border border-[#C8951E]/30 p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] font-mono text-white/50 uppercase block">Type de Peau Perçu</span>
                    <div className="text-lg font-display font-black text-[#F3E5AB] capitalize flex items-center gap-2">
                      <span>🌗 Peau {client.skinType}</span>
                    </div>
                    <span className="text-[10px] text-white/40 block">Tendance déshydratée zone T</span>
                  </div>

                  <div className="bg-[#1A1410] border border-[#C8951E]/30 p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] font-mono text-white/50 uppercase block">Phototype Fitzpatrick</span>
                    <div className="text-lg font-display font-black text-amber-300 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ background: fitzColor }} />
                      <span>Type {client.fitzpatrickType} (Afro/Mélanoderme)</span>
                    </div>
                    <span className="text-[10px] text-white/40 block">Haute sensibilité aux taches PIH</span>
                  </div>

                  <div className="bg-[#1A1410] border border-[#C8951E]/30 p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] font-mono text-white/50 uppercase block">Contre-indications & Allergies</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {allergies.length > 0 ? (
                        allergies.map((a: string, i: number) => (
                          <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40">
                            ⚠️ {a}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-emerald-400 font-bold">✓ Aucune allergie connue</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Main Clinical Summary Card */}
                <div className="bg-[#150D07] border border-white/10 p-6 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#C8951E]" />
                      <h3 className="font-display font-bold text-base text-white">Dernier Bilan Cutané Octo-Spectral</h3>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold">Score Santé Cutanée : 78/100</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-[#0F0A05] p-3 rounded-xl border border-white/5">
                      <span className="text-[9px] text-white/40 font-mono uppercase block">Hydratation</span>
                      <span className="text-base font-bold text-sky-400">84% (+22%)</span>
                    </div>
                    <div className="bg-[#0F0A05] p-3 rounded-xl border border-white/5">
                      <span className="text-[9px] text-white/40 font-mono uppercase block">Profondeur PIH</span>
                      <span className="text-base font-bold text-amber-400">0.2mm (Epiderme)</span>
                    </div>
                    <div className="bg-[#0F0A05] p-3 rounded-xl border border-white/5">
                      <span className="text-[9px] text-white/40 font-mono uppercase block">Perte TEWL</span>
                      <span className="text-base font-bold text-emerald-400">14.2 g/m²/h</span>
                    </div>
                    <div className="bg-[#0F0A05] p-3 rounded-xl border border-white/5">
                      <span className="text-[9px] text-white/40 font-mono uppercase block">Risque Rebond</span>
                      <span className="text-base font-bold text-emerald-300">Faible (94%)</span>
                    </div>
                  </div>

                  <div className="bg-[#0A0603] p-4 rounded-2xl border border-[#C8951E]/20 space-y-2">
                    <span className="text-xs font-bold text-[#C8951E] uppercase tracking-wider block">
                      Prescription & Recommandation Praticienne Référente :
                    </span>
                    <p className="text-xs text-white/80 leading-relaxed font-sans">
                      Phototype V à tendance hyperpigmentation post-inflammatoire. Appliquer 3 gouttes de sérum Niacinamide 5% & Baobab le soir. Écran solaire minéral SPF 50 obligatoire le matin. Soin cabine au Karité de Korhogo recommandé tous les 28 jours.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ÉVOLUTION PHOTOS AU FIL DU TEMPS */}
            {activeTab === 'photos' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-[#1A1410] p-4 rounded-2xl border border-white/10">
                  <div>
                    <h3 className="font-display font-bold text-sm text-white">Galerie Chronologique du Traitement</h3>
                    <p className="text-xs text-white/50">Suivi visuel des résultats et de l'amélioration du teint au fil des séances</p>
                  </div>

                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C8951E] to-[#F3E5AB] text-[#0F0A05] font-black text-xs shadow-lg hover:brightness-110">
                      <Camera className="w-4 h-4" /> 📸 Ajouter Photo d'Évolution
                    </span>
                  </label>
                </div>

                {/* Main Photo Showcase */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Selected Photo Viewer */}
                  <div className="md:col-span-8 bg-[#150D07] border border-[#C8951E]/40 rounded-3xl p-4 space-y-4">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-white/10">
                      <img src={selectedPhoto.src} alt={selectedPhoto.stage} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 bg-black/80 border border-[#C8951E] px-3 py-1 rounded-xl text-xs font-mono font-bold text-[#F3E5AB]">
                        {selectedPhoto.stage}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/80 border border-white/10 px-3 py-1 rounded-xl text-xs font-mono text-white/70">
                        🗓️ {selectedPhoto.date}
                      </div>
                    </div>

                    <div className="bg-[#0A0603] p-4 rounded-2xl border border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#C8951E]">Observations Cliniques :</span>
                        <span className="font-mono text-emerald-400 font-bold">{selectedPhoto.metrics.glow}</span>
                      </div>
                      <p className="text-xs text-white/80 font-sans">{selectedPhoto.notes}</p>
                    </div>
                  </div>

                  {/* Photo Timeline Sidebar */}
                  <div className="md:col-span-4 space-y-3">
                    <span className="text-xs font-mono font-bold text-white/50 uppercase block">Timeline des Prises de Vue ({photosList.length})</span>
                    <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
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
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-black border border-white/10 shrink-0">
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

            {/* TAB 3: HISTORIQUE CONSULTATIONS */}
            {activeTab === 'consultations' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm text-white">Consultations Dermatologiques & Examens Passeport</h3>
                  {onNewConsultation && (
                    <Button onClick={() => onNewConsultation(client)} className="bg-[#C8951E] text-black font-bold text-xs h-9">
                      + Nouvelle Consultation
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  {[
                    { date: '01/08/2026', type: 'Contrôle Suivi PIH', note: 'Diminution des zones de taches de 65%. Barrière cutanée hydratée.', doc: 'Dr. Aminata Diallo' },
                    { date: '15/06/2026', type: 'Consultation Initiale 3D', note: 'Bilan dermo-spectral complet. Phototype V identifié. Début cure Karité-Baobab.', doc: 'Fatou Koné' },
                  ].map((cons, idx) => (
                    <div key={idx} className="bg-[#1A1410] border border-white/10 p-4 rounded-2xl flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#F3E5AB]">🗓️ {cons.date}</span>
                          <Badge variant="outline" className="border-[#C8951E]/40 text-[#C8951E] text-[10px]">{cons.type}</Badge>
                        </div>
                        <p className="text-xs text-white/80 leading-relaxed">{cons.note}</p>
                        <span className="text-[10px] text-white/40 block font-mono">Praticienne : {cons.doc}</span>
                      </div>
                      <Button variant="outline" onClick={() => onPrintPassport?.(client)} className="border-white/10 text-xs text-white/70 hover:text-white shrink-0">
                        <Printer className="w-3.5 h-3.5 mr-1" /> Imprimer Rapport
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: ORDONNANCE BOTANIQUE */}
            {activeTab === 'prescriptions' && (
              <div className="space-y-4">
                <div className="bg-[#1A1410] border border-[#C8951E]/40 p-5 rounded-2xl space-y-3">
                  <h3 className="font-display font-bold text-sm text-[#F3E5AB] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C8951E]" /> Routine Dermo-Cosmétique Botanique Prescrite
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-[#0F0A05] p-4 rounded-xl border border-white/10 space-y-2">
                      <span className="font-bold text-amber-300 block">🌅 Matin :</span>
                      <p className="text-white/70">1. Nettoyage doux à l'eau florale d'Hibiscus.</p>
                      <p className="text-white/70">2. Gel Aloe Vera 99% + Hydratant Karité-Baobab.</p>
                      <p className="text-white/70">3. Écran Solaire Minéral SPF 50 (Incontournable).</p>
                    </div>
                    <div className="bg-[#0F0A05] p-4 rounded-xl border border-white/10 space-y-2">
                      <span className="font-bold text-indigo-300 block">🌙 Soir :</span>
                      <p className="text-white/70">1. Savon Noir Africain Surgras.</p>
                      <p className="text-white/70">2. 3 gouttes de Sérum Niacinamide 5% & Baobab.</p>
                      <p className="text-white/70">3. Application locale Beurre Karité pur sur zones PIH.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* ── FOOTER ACTIONS ── */}
          <div className="p-4 border-t border-white/10 bg-[#0A0603] flex items-center justify-between">
            <span className="text-xs font-mono text-white/40">ID Dossier : {client.id} • Mis à jour le {new Date().toLocaleDateString('fr-FR')}</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose} className="border-white/10 text-white/70 text-xs">
                Fermer
              </Button>
              <Button onClick={() => onPrintPassport?.(client)} className="bg-gradient-to-r from-[#C8951E] to-[#F3E5AB] text-[#0F0A05] font-black text-xs">
                <Printer className="w-4 h-4 mr-1.5" /> Imprimer Passeport Beauté PDF
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
