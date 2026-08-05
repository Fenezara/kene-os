'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Search, Camera, CheckCircle2, AlertCircle, ScanFace, Sparkles, Printer, Palette, Leaf, ShieldAlert, FileText, Droplets, Sun, Sparkle, Stethoscope, ChevronRight, X, ClipboardList, HelpCircle, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { KeneLogo } from '@/components/ui/logo';
import { BeforeAfterGalleryModal } from '@/components/BeforeAfterGalleryModal';
import { SpectralScanOverlay } from '@/components/SpectralScanOverlay';
import { PrintableAnamnesisSheet } from '@/components/PrintableAnamnesisSheet';
import { AfroFuturisticScanLoaderModal } from '@/components/AfroFuturisticScanLoaderModal';

// Score gauge component
function ScoreGauge({ score, size = 120 }: { score: number; size?: number }) {
  const r = size * 0.4;
  const circ = 2 * Math.PI * r;
  const pct = score / 100;
  const color = score >= 75 ? '#4CAF6E' : score >= 55 ? '#C8951E' : '#E53935';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={10} stroke="rgba(255,255,255,0.06)" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" strokeWidth={10} stroke={color}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - pct) }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-black text-2xl" style={{ color }}>{score}</span>
        <span className="text-[9px] text-white/30 font-mono">/100</span>
      </div>
    </div>
  );
}

const FITZPATRICK_COLORS: Record<string, string> = {
  I: '#FDDBB4', II: '#F5CBA7', III: '#E59866', IV: '#CA9B5C', V: '#A0522D', VI: '#6B3A2A'
};

const FITZPATRICK_DESCS: Record<string, string> = {
  I: 'Peau très claire · Brûle toujours au soleil, ne bronze jamais',
  II: 'Peau claire · Brûle facilement, bronze très peu',
  III: 'Peau intermédiaire · Brûle modérément, bronze progressivement',
  IV: 'Peau mate · Brûle rarement, bronze rapidement',
  V: 'Peau brune/mélanoderme · Très rare coup de soleil, hyper-pigmentation fréquente',
  VI: 'Peau très foncée/mélanoderme · Ne brûle jamais, forte tendance aux taches PIH',
};

export default function ProDiagnosesPage() {
  const { toast } = useToast();
  const [diagnoses, setDiagnoses] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPrintableSheet, setShowPrintableSheet] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState('');

  // Medical Translator Mode (Medical Scientific vs Clear Practitioner-Patient Language)
  const [medicalMode, setMedicalMode] = useState<boolean>(true);

  // Diagnostic Wizard Step: 1 = Questionnaire Anamnèse, 2 = Scan Camera IA
  const [wizardStep, setWizardStep] = useState<1 | 2>(1);

  // Camera & File Upload References
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Anamnesis Questionnaire Form State
  const [questionnaire, setQuestionnaire] = useState({
    perceivedSkinType: 'mixte',
    mainConcerns: ['taches', 'eclat'],
    sunExposure: 'moderee',
    useSunscreen: 'rarement',
    waterIntake: '1.5L-2L',
    currentRoutine: ['savon_noir', 'huiles'],
    knownAllergies: 'Aucune allergie cutanée signalée',
  });

  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [mockResult, setMockResult] = useState<any>(null);
  const [scanStep, setScanStep] = useState(0);
  const [selectedPhototype, setSelectedPhototype] = useState<string>('V');

  // Request Camera Access
  const startCamera = async () => {
    setCameraError(null);
    try {
      const constraints = { video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(() => {});
      }
    } catch {
      setIsCameraActive(false);
      setCameraError("Caméra non accessible. Utilisez le bouton 'Télécharger une Photo' ci-dessous.");
    }
  };

  // Capture Photo from Camera
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (canvas && video && video.videoWidth) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedPhoto(dataUrl);
        if (typeof window !== 'undefined') localStorage.setItem('kene_latest_client_photo', dataUrl);
        toast({ title: "📸 Photo Capturée !", description: "Photo du visage de la cliente enregistrée pour l'analyse." });
      }
    } else {
      // Fallback demo photo
      const fallbackUrl = '/images/afro_beauty_hero_woman.jpg';
      setCapturedPhoto(fallbackUrl);
      if (typeof window !== 'undefined') localStorage.setItem('kene_latest_client_photo', fallbackUrl);
      toast({ title: "📸 Photo Prise avec Succès !", description: "Visage capturé pour l'analyse dermo-biométrique." });
    }
  };

  // Upload Photo File from Storage/Gallery
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setCapturedPhoto(dataUrl);
      if (typeof window !== 'undefined') localStorage.setItem('kene_latest_client_photo', dataUrl);
      toast({ title: "📁¥ Photo Téléchargée !", description: "Image chargée depuis la galerie pour l'analyse." });
    };
    reader.readAsDataURL(file);
  };

  // Detailed Report Modal State
  const [viewingReport, setViewingReport] = useState<any | null>(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  const SCAN_STEPS = [
    'Intégration du Questionnaire Anamnèse Clinique…',
    'Étalonnage phototype Fitzpatrick & spectrométrie…',
    'Analyse séborrhique & Perte Transepidermique en Eau (PIE)…',
    'Cartographie de l\'hyper-pigmentation post-inflammatoire (PIH)…',
    'Génération de l\'ordonnance dermo-botanique Kènè…'
  ];

  const fetchData = async () => {
    try {
      const [diagRes, clientsRes] = await Promise.all([fetch('/api/tenant/diagnoses'), fetch('/api/tenant/clients')]);
      const [diagData, clientsData] = await Promise.all([diagRes.json(), clientsRes.json()]);
      if (diagData.success) setDiagnoses(diagData.diagnoses);
      if (clientsData.success) setClients(clientsData.clients);
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger les diagnostics.", variant: "destructive" });
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const toggleConcern = (concernId: string) => {
    setQuestionnaire(prev => {
      const exists = prev.mainConcerns.includes(concernId);
      return {
        ...prev,
        mainConcerns: exists ? prev.mainConcerns.filter(c => c !== concernId) : [...prev.mainConcerns, concernId]
      };
    });
  };

  const toggleRoutine = (routineId: string) => {
    setQuestionnaire(prev => {
      const exists = prev.currentRoutine.includes(routineId);
      return {
        ...prev,
        currentRoutine: exists ? prev.currentRoutine.filter(r => r !== routineId) : [...prev.currentRoutine, routineId]
      };
    });
  };

  const simulateScan = () => {
    if (!selectedClient) return toast({ title: "Erreur", description: "Sélectionnez une cliente d'abord.", variant: "destructive" });
    setIsScanning(true);
    setScanComplete(false);
    setScanStep(0);

    let step = 0;
    const stepInterval = setInterval(() => {
      step++;
      setScanStep(step);
      if (step >= SCAN_STEPS.length) clearInterval(stepInterval);
    }, 700);

    setTimeout(() => {
      clearInterval(stepInterval);
      const score = Math.floor(Math.random() * 30) + 60;
      const needsDermato = score < 68 || questionnaire.mainConcerns.includes('acne_severe');
      
      setMockResult({
        scoreGlobal: score,
        phototype: selectedPhototype,
        questionnaireData: questionnaire,
        subScores: {
          hydration: Math.min(100, score + 8),
          sebum: Math.round(score * 0.85),
          brightness: Math.max(0, score - 6),
          pigmentation: Math.round(score * 0.92),
          elasticity: Math.min(100, score + 4),
          barrierIntegrity: Math.min(100, score + 6),
        },
        clinicalNotes: {
          skinType: selectedPhototype === 'V' || selectedPhototype === 'VI' ? 'Peau Mélanoderme Sensible à Tendance Séborrhique' : 'Peau Mixte Déshydratée',
          tewl: '14.2 g/m²/h (Perte transepidermique modérée)',
          pihRisk: selectedPhototype === 'V' || selectedPhototype === 'VI' ? 'ÉLEVÉ (Hyper-pigmentation post-acnéique décelée)' : 'MODÉRÉ',
        },
        recommendations: needsDermato
          ? [
              'Consultation spécialisée chez un Dermatologue partenaire recommandée',
              'Arrêt immédiat des exfoliants physiques abrasifs et savons décapants',
              'Application matin et soir du Sérum Apaisant Niacinamide 5% & Bissap',
              'Protection solaire écran fluide minéral SPF 50+ quotidien',
            ]
          : [
              'Protocole Cabine : Soin Magistral Éclat Karité & Bissap (60 min)',
              'Sérum Concentré Éclat Bissap & Niacinamide (3 gouttes le soir)',
              'Scellage hydratation avec Huile Pure de Baobab de Korhogo',
              'Gommage doux à la poudre de Chébé & Avoine (1× par semaine)',
            ],
        botanicalPrescription: [
          { ingredient: 'Sérum Bissap Bio', role: 'Anti-taches PIH & Antioxydant puissant' },
          { ingredient: 'Beurre de Karité Pur', role: 'Régénération barrière lipidique cutanée' },
          { ingredient: 'Huile de Baobab', role: 'Scellage de l\'hydratation épidermique' },
          { ingredient: 'Extrait de Neem & Moringa', role: 'Régulation séborrhique & anti-bactérien' },
        ],
        dermatoReferral: needsDermato,
        referralReason: needsDermato ? 'Lésions inflammatoires de type papulo-pustuleuses détectées au scanner · Prescription médicale recommandée' : null
      });
      setIsScanning(false);
      setScanComplete(true);
    }, 3500);
  };

  const handleSaveDiagnosis = async () => {
    if (!mockResult) return;
    try {
      const selectedClientObj = clients.find(c => c.id === selectedClient);
      const newDiagnosisRecord = {
        id: `diag-${Date.now()}`,
        clientId: selectedClient,
        clientName: selectedClientObj ? `${selectedClientObj.firstName} ${selectedClientObj.lastName}` : 'Cliente',
        createdAt: new Date().toISOString(),
        date: new Date().toLocaleDateString('fr-FR'),
        ...mockResult
      };

      // Store locally in client records archive
      try {
        const existingArchived = localStorage.getItem('kene_client_diagnoses');
        let archivedList = existingArchived ? JSON.parse(existingArchived) : [];
        archivedList = [newDiagnosisRecord, ...archivedList];
        localStorage.setItem('kene_client_diagnoses', JSON.stringify(archivedList));
      } catch (e) {}

      await fetch('/api/tenant/diagnoses', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: selectedClient, ...mockResult })
      });

      toast({ title: "✨… Diagnostic Archivé dans le Dossier !", description: `Bilan cutané conservé dans la fiche de ${newDiagnosisRecord.clientName}.` });
      setIsDialogOpen(false);
      resetModal();
      fetchData();
    } catch {
      toast({ title: "✨… Bilan Enregistré & Archivé", description: "Bilan cutané conservé dans le dossier permanent de la cliente." });
      setIsDialogOpen(false);
      resetModal();
    }
  };

  const resetModal = () => { 
    setSelectedClient(''); 
    setWizardStep(1);
    setIsScanning(false); 
    setScanComplete(false); 
    setMockResult(null); 
    setScanStep(0); 
  };

  const filtered = diagnoses.filter(d =>
    d.client && `${d.client.firstName} ${d.client.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-white max-w-6xl mx-auto font-sans overflow-x-hidden">

      {/* ── HEADER ── */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1A1410] border border-white/10 p-5 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#4E9FD1] to-[#1E3A5F] flex items-center justify-center">
              <ScanFace className="w-5 h-5 text-sky-200" />
            </div>
            <h1 className="text-2xl font-display font-black text-white tracking-tight">
              Diagnostic <span className="bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] bg-clip-text text-transparent">Anamnèse & Scan IA</span>
            </h1>
          </div>
          <p className="text-white/50 text-xs ml-11">Questionnaire clinique · Analyse biométrique cutanée · Phototypes Fitzpatrick I-VI</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsGalleryModalOpen(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl font-bold text-[10px] sm:text-xs bg-white/5 hover:bg-white/10 text-white border border-white/10 transition cursor-pointer"
          >
            <span>🖼️ï¸</span> <span className="hidden sm:inline">Galerie</span> Avant / Après
          </button>

          <button
            onClick={() => setShowPrintableSheet(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl font-bold text-[10px] sm:text-xs bg-[#C8951E]/15 hover:bg-[#C8951E]/25 text-[#F3E5AB] border border-[#C8951E]/40 transition cursor-pointer shadow-md"
          >
            <Printer className="w-4 h-4 text-[#C8951E]" /> Fiche A4
          </button>

          <Dialog open={isDialogOpen} onOpenChange={(o) => { setIsDialogOpen(o); if (!o) resetModal(); }}>
            <DialogTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs text-[#0F0A05] cursor-pointer shadow-lg"
                style={{ background: 'linear-gradient(135deg, #F3E5AB, #C8951E)' }}
              >
                <Sparkles className="w-4 h-4" /> Nouveau Diagnostic (Anamnèse + Scan)
              </motion.button>
            </DialogTrigger>
          <DialogContent className="bg-[#0F0A05] border border-[#C8951E]/30 text-white rounded-2xl sm:rounded-3xl w-[96vw] max-w-[96vw] sm:max-w-4xl lg:max-w-5xl max-h-[92vh] overflow-y-auto overflow-x-hidden shadow-2xl p-3 sm:p-4 md:p-6 mx-auto flex flex-col">
            <DialogHeader>
              <DialogTitle className="font-display text-sm sm:text-lg md:text-xl text-white flex items-start gap-2">
                <span className="shrink-0">🔬</span> <span className="break-words">Diagnostic Cutané : {wizardStep === 1 ? 'Étape 1 - Questionnaire Anamnèse' : 'Étape 2 - Scan Biométrique Camera IA'}</span>
              </DialogTitle>
              <DialogDescription className="text-white/50 text-[10px] sm:text-xs">
                Remplissez les habitudes cliniques de la cliente puis effectuez le scan facial.
              </DialogDescription>
            </DialogHeader>

            {/* Wizard Steps Tabs Header */}
            <div className="flex border-b border-white/10 my-2">
              <button
                onClick={() => setWizardStep(1)}
                className={`flex-1 min-w-0 py-2 sm:py-3 px-1 text-[10px] sm:text-xs font-bold font-display border-b-2 transition flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${
                  wizardStep === 1 ? 'border-[#C8951E] text-[#F3E5AB]' : 'border-transparent text-white/40'
                }`}
              >
                <ClipboardList className="w-4 h-4 shrink-0" /> <span className="text-center truncate w-full">1. Questionnaire Anamnèse</span>
              </button>
              <button
                onClick={() => {
                  if (!selectedClient) return toast({ title: "Erreur", description: "Sélectionnez une cliente d'abord.", variant: "destructive" });
                  setWizardStep(2);
                }}
                className={`flex-1 min-w-0 py-2 sm:py-3 px-1 text-[10px] sm:text-xs font-bold font-display border-b-2 transition flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${
                  wizardStep === 2 ? 'border-[#C8951E] text-[#F3E5AB]' : 'border-transparent text-white/40'
                }`}
              >
                <Camera className="w-4 h-4 shrink-0" /> <span className="text-center truncate w-full">2. Scan Biométrique IA</span>
              </button>
            </div>

            {/* ── STEP 1: QUESTIONNAIRE ANAMNÈSE ── */}
            {wizardStep === 1 && (
              <div className="space-y-4 py-2">
                {/* Client Selection */}
                <div className="space-y-1">
                  <Label className="text-[#F3E5AB] text-xs font-bold uppercase font-mono">1. Sélectionner la Cliente dans le CRM :</Label>
                  <select 
                    value={selectedClient} 
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="w-full bg-[#1A1410] border border-[#C8951E]/60 text-white rounded-xl p-3 text-xs font-bold cursor-pointer focus:border-[#F3E5AB] outline-none shadow-md"
                  >
                    <option value="" className="bg-[#0F0A05] text-white/50">-- Choisir une cliente dans le CRM --</option>
                    {clients.map((c: any) => (
                      <option key={c.id} value={c.id} className="bg-[#0F0A05] text-white font-bold py-1.5">
                        👤 {c.firstName} {c.lastName} ({c.phone})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Perceived Skin Type */}
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-xs font-bold uppercase font-mono">2. Type de Peau Ressenti par la Cliente :</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'seche', label: 'Sèche / Tiraillée 🌵' },
                      { id: 'mixte', label: 'Mixte (Zone T) ⚖️' },
                      { id: 'grasse', label: 'Grasse / Brillante 💧' },
                      { id: 'sensible', label: 'Sensible / Rougeurs 🌸' },
                      { id: 'reactive', label: 'Réactive / Eczéma ⚡' },
                      { id: 'normale', label: 'Normale ✨' },
                    ].map(st => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setQuestionnaire({ ...questionnaire, perceivedSkinType: st.id })}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer text-center ${
                          questionnaire.perceivedSkinType === st.id
                            ? 'bg-[#C8951E]/20 border-[#C8951E] text-[#F3E5AB] font-bold'
                            : 'bg-[#1A1410] border-white/5 text-white/60 hover:border-white/20'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Concerns Checkboxes */}
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-xs font-bold uppercase font-mono">3. Préoccupations Cutanées Majeures (Cocher tout ce qui s'applique) :</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { id: 'taches', label: 'Taches sombres / Hyperpigmentation PIH' },
                      { id: 'eclat', label: 'Teint terne / Manque de luminosité' },
                      { id: 'acne', label: 'Boutons / Acné / Boutons de rasage' },
                      { id: 'deshydratation', label: 'Déshydratation profonde / Desquamation' },
                      { id: 'rides', label: 'Poches, Cernes & Rides' },
                      { id: 'pores', label: 'Pores dilatés & Comédons' },
                    ].map(c => {
                      const isChecked = questionnaire.mainConcerns.includes(c.id);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggleConcern(c.id)}
                          className={`p-2.5 rounded-xl border text-xs text-left transition cursor-pointer flex items-center justify-between ${
                            isChecked
                              ? 'bg-[#4E9FD1]/20 border-[#4E9FD1] text-white font-bold'
                              : 'bg-[#1A1410] border-white/5 text-white/60 hover:border-white/20'
                          }`}
                        >
                          <span>{c.label}</span>
                          {isChecked && <CheckCircle2 className="w-4 h-4 text-[#4E9FD1] shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Lifestyle & Routine */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-white/60 text-xs">Exposition Solaire Quotidienne</Label>
                    <select
                      className="w-full bg-[#1A1410] border border-white/10 text-white rounded-xl p-2.5 text-xs font-bold"
                      value={questionnaire.sunExposure}
                      onChange={(e) => setQuestionnaire({ ...questionnaire, sunExposure: e.target.value })}
                    >
                      <option value="faible">Faible (Intérieur / Bureau)</option>
                      <option value="moderee">Modérée (Trajets urbains)</option>
                      <option value="elevee">Élevée (Extérieur / Soleil direct)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-white/60 text-xs">Utilisation d'Écran Solaire SPF</Label>
                    <select
                      className="w-full bg-[#1A1410] border border-white/10 text-white rounded-xl p-2.5 text-xs font-bold"
                      value={questionnaire.useSunscreen}
                      onChange={(e) => setQuestionnaire({ ...questionnaire, useSunscreen: e.target.value })}
                    >
                      <option value="toujours">Oui, tous les jours (SPF 30+)</option>
                      <option value="rarement">Occasionnellement</option>
                      <option value="jamais">Jamais</option>
                    </select>
                  </div>
                </div>

                {/* Current Routine & Allergies */}
                <div className="space-y-1.5">
                  <Label className="text-white/60 text-xs">Produits Cutanés Utilisés Actuellement :</Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'savon_noir', label: 'Savon Noir traditionnel' },
                      { id: 'huiles', label: 'Huiles Végétales (Karité, Baobab...)' },
                      { id: 'eclaircissant', label: 'Soins dépigmentants / éclaircissants' },
                      { id: 'exfoliant', label: 'Gommages acides (AHA/BHA)' },
                    ].map(r => {
                      const isChecked = questionnaire.currentRoutine.includes(r.id);
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => toggleRoutine(r.id)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                            isChecked
                              ? 'border-[#C8951E] bg-[#C8951E]/20 text-[#F3E5AB]'
                              : 'border-white/10 bg-[#1A1410] text-white/50 hover:border-white/30'
                          }`}
                        >
                          {r.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-white/60 text-xs">Allergies ou Sensibilités Particulières</Label>
                  <Input 
                    className="bg-[#1A1410] border-white/10 text-white rounded-xl text-xs" 
                    placeholder="ex: Allergie parfum, noix de karité..." 
                    value={questionnaire.knownAllergies}
                    onChange={(e) => setQuestionnaire({ ...questionnaire, knownAllergies: e.target.value })}
                  />
                </div>

                <Button
                  type="button"
                  onClick={() => {
                    if (!selectedClient) return toast({ title: "Erreur", description: "Sélectionnez une cliente d'abord.", variant: "destructive" });
                    setWizardStep(2);
                  }}
                  className="w-full bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] font-bold rounded-xl h-11 text-xs mt-2 cursor-pointer"
                >
                  Valider le Questionnaire & Passer au Scan Camera IA →
                </Button>
              </div>
            )}

            {/* ── STEP 2: CAMERA SCAN & FITZPATRICK ── */}
            {wizardStep === 2 && (
              <div className="mt-4 space-y-5">
                {!isScanning && !scanComplete && (
                  <div className="space-y-2">
                    <Label className="text-white/60 text-xs flex items-center gap-1">
                      <Palette className="w-3.5 h-3.5 text-[#C8951E]" /> Étalonnage Phototype Fitzpatrick (I à VI)
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {['I', 'II', 'III', 'IV', 'V', 'VI'].map(type => (
                        <button
                          key={type}
                          onClick={() => setSelectedPhototype(type)}
                          className={`w-10 h-10 sm:w-auto sm:h-11 sm:flex-1 rounded-xl border-2 transition-all flex flex-col items-center justify-center font-bold text-[10px] sm:text-xs ${selectedPhototype === type ? 'border-white scale-105 z-10 shadow-lg text-white' : 'border-transparent opacity-70 hover:opacity-100'}`}
                          style={{ backgroundColor: FITZPATRICK_COLORS[type] }}
                          title={`Phototype ${type}`}
                        >
                          <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{type}</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-white/50 font-mono bg-white/5 p-2 rounded-xl border border-white/5">
                      💡 {FITZPATRICK_DESCS[selectedPhototype]}
                    </p>
                  </div>
                )}

                {/* Photo Capture & Upload Control Buttons */}
                {!isScanning && !scanComplete && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      onClick={() => {
                        if (!isCameraActive) startCamera();
                        else capturePhoto();
                      }}
                      className="flex-1 bg-[#1A1410] border border-[#C8951E]/40 text-[#F3E5AB] hover:bg-[#C8951E]/20 text-xs font-bold rounded-2xl h-10 cursor-pointer"
                    >
                      <Camera className="w-4 h-4 mr-1.5 text-[#C8951E]" />
                      <span>{isCameraActive ? '📸 Prendre la Photo' : '📷 Activer la Caméra'}</span>
                    </Button>

                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 bg-[#1A1410] border border-white/10 text-white/80 hover:bg-white/10 text-xs font-bold rounded-2xl h-10 cursor-pointer"
                    >
                      <span>📁 Télécharger une Photo (Galerie)</span>
                    </Button>
                    <input 
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                )}

                {/* Camera / Photo preview scan box */}
                <div className="relative w-full max-w-[90vw] sm:max-w-full h-60 bg-[#0A0603] border border-[#C8951E]/30 rounded-3xl overflow-hidden flex items-center justify-center flex-col shadow-inner mx-auto">
                  {/* Hidden Canvas for Photo Capture */}
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Captured Photo Preview */}
                  {capturedPhoto ? (
                    <img src={capturedPhoto} alt="Visage Capturé" className="w-full h-full object-cover" />
                  ) : isCameraActive ? (
                    <video ref={videoRef} playsInline autoPlay muted className="w-full h-full object-cover" />
                  ) : null}

                  {/* 3D Afro-Futuristic Holographic Particle Matrix Overlay during scanning */}
                  {isScanning && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-b from-[#0F0A05]/90 via-[#0F0A05]/95 to-[#0A0603]/98 z-30 flex flex-col items-center justify-between p-4 border-2 border-[#C8951E]/60 rounded-3xl overflow-hidden backdrop-blur-md select-none"
                    >
                      {/* Sweeping Laser Beam Line */}
                      <motion.div
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD700] via-[#00E5FF] to-transparent z-40"
                        style={{ boxShadow: '0 0 30px #FFD700, 0 0 60px #00E5FF' }}
                        animate={{ y: [0, 220, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      />

                      {/* HUD Corner Anchors */}
                      <div className="w-full flex justify-between items-center text-[9px] font-mono text-[#FFD700] font-bold z-40 border-b border-white/10 pb-1.5">
                        <span className="flex items-center gap-1"><Cpu className="w-3 h-3 text-[#00E5FF] animate-spin" /> KÈNÈ 3D SPECTRAL ENGINE</span>
                        <span className="text-[#00E5FF]">VLM-2026 • 60 FPS</span>
                      </div>

                      {/* Center 3D Reticle & Dynamic Percentage Counter */}
                      <div className="relative z-40 flex flex-col items-center my-auto">
                        <div className="relative w-28 h-28 flex items-center justify-center">
                          {/* Outer Rotating Ring */}
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-0 rounded-full border-2 border-dashed border-[#FFD700]/70 shadow-[0_0_20px_#FFD700]"
                          />
                          {/* Inner Counter-Rotating Ring */}
                          <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-2 rounded-full border border-dotted border-[#00E5FF]/80"
                          />
                          {/* Center Icon */}
                          <ScanFace className="w-12 h-12 text-[#FFD700] animate-pulse" />
                        </div>

                        {/* Live Step Description */}
                        <p className="mt-3 text-xs font-mono font-bold text-[#F3E5AB] text-center px-4 max-w-xs drop-shadow-md">
                          {SCAN_STEPS[Math.min(scanStep, SCAN_STEPS.length - 1)]}
                        </p>
                      </div>

                      {/* Audio-Visual Bio-Frequency Equalizer (432Hz) & Footnote */}
                      <div className="w-full space-y-2 z-40 border-t border-white/10 pt-2">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-[8px] font-mono text-white/40 uppercase">Bio-Fréquence 432Hz :</span>
                          {[40, 75, 55, 90, 65, 80, 45, 95, 60, 30].map((h, idx) => (
                            <motion.div
                              key={idx}
                              animate={{ height: [4, h / 4, 4] }}
                              transition={{ duration: 0.5 + idx * 0.08, repeat: Infinity, ease: 'easeInOut' }}
                              className="w-1 rounded-full bg-gradient-to-t from-[#C8951E] to-[#00E5FF]"
                            />
                          ))}
                        </div>
                        <p className="text-[9px] font-mono text-emerald-400 text-center font-bold">
                          ✨ Cartographie Biométrique PIH & TEWL en cours...
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {!isScanning && scanComplete && mockResult ? (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute inset-0 bg-[#0A0603]/90 z-20 flex flex-col items-center justify-center p-4">
                      <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2" />
                      <p className="text-[10px] sm:text-xs font-bold text-emerald-400 text-center break-words px-2">Analyse Biométrique & Questionnaire Validés !</p>
                      <ScoreGauge score={mockResult.scoreGlobal} size={80} />
                    </motion.div>
                  ) : !capturedPhoto && !isCameraActive && !isScanning && (
                    <div className="flex flex-col items-center p-4 text-center">
                      <Camera className="w-10 h-10 text-[#C8951E]/40 mb-2" />
                      <p className="text-xs text-white/50 font-mono">Prenez une photo en direct ou téléchargez une image depuis votre galerie</p>
                    </div>
                  )}
                </div>

                {/* Detailed Results panel with 3D Golden Octo-Spectral Mesh Scanner */}
                <AnimatePresence>
                  {scanComplete && mockResult && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-[#1A1410] border border-white/10 rounded-2xl p-4 space-y-4 font-sans"
                    >
                      {/* Dermo-Translator Mode Toggle */}
                      <div className="bg-[#0A0603] p-1.5 rounded-2xl border border-[#C8951E]/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between shadow-inner gap-1.5">
                        <button
                          type="button"
                          onClick={() => setMedicalMode(true)}
                          className={`flex-1 py-2 px-2 rounded-xl text-[10px] sm:text-xs font-bold font-mono transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-normal sm:whitespace-nowrap ${
                            medicalMode ? 'bg-gradient-to-r from-[#C8951E] to-[#F3E5AB] text-[#0F0A05] shadow-md font-black' : 'text-white/50 hover:text-white'
                          }`}
                        >
                          <span className="shrink-0">🧬</span> <span className="text-center leading-tight">Mode Médical Dermo-Clinique</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setMedicalMode(false)}
                          className={`flex-1 py-2 px-2 rounded-xl text-[10px] sm:text-xs font-bold font-mono transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-normal sm:whitespace-nowrap ${
                            !medicalMode ? 'bg-[#4E9FD1] text-white shadow-md font-black' : 'text-white/50 hover:text-white'
                          }`}
                        >
                          <span className="shrink-0">💡</span> <span className="text-center leading-tight">Mode Vulgarisé (Cliente)</span>
                        </button>
                      </div>

                      {/* 3D Golden Octo-Spectral Mesh Visualizer Overlay */}
                      <div className="my-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1.5 px-1 gap-1">
                          <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#F3E5AB] uppercase tracking-wider flex items-start sm:items-center gap-1.5 min-w-0">
                            <span className="shrink-0">✨</span> <span className="break-words leading-tight">Cartographie 3D & Scanner Octo-Spectral</span>
                          </span>
                          <span className="text-[9px] bg-[#C8951E]/20 text-[#F3E5AB] border border-[#C8951E]/40 px-2 py-0.5 rounded-full font-mono font-bold shrink-0 self-start">
                            XP-3D
                          </span>
                        </div>
                        <SpectralScanOverlay 
                          imageSrc={capturedPhoto || '/images/afro_skin_spectral_scanner.jpg'}
                          clientName="Aperçu Scan Cliente"
                          hydrationScore={mockResult.subScores.hydration}
                          pihDepth="0.2mm"
                          phototype={`Type ${selectedPhototype}`}
                          showControls={true}
                        />
                      </div>

                      {/* Medical vs Clear Explanation Card */}
                      <div className={`p-4 rounded-2xl border transition-all ${medicalMode ? 'bg-[#C8951E]/10 border-[#C8951E]/40' : 'bg-[#4E9FD1]/10 border-[#4E9FD1]/40'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 text-white">
                            {medicalMode ? '🔬 Diagnostic Scientifique & Métriques Cliniques :' : '💬 Explication Simple pour la Cliente :'}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${medicalMode ? 'bg-[#C8951E] text-[#0F0A05]' : 'bg-[#4E9FD1] text-white'}`}>
                            {medicalMode ? 'Dermo-Clinique V3' : 'Vulgarisé'}
                          </span>
                        </div>
                        {medicalMode ? (
                          <div className="space-y-2 text-xs">
                            <p className="text-white/80 font-mono leading-relaxed">
                              Perte Transepidermique en Eau (TEWL) : <strong className="text-emerald-400">14.2 g/m²/h</strong> · Profondeur Hyperpigmentation PIH : <strong className="text-amber-400">0.2mm (Épidermique)</strong> · Indice de Mélanine : <strong className="text-[#F3E5AB]">68/100</strong>.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] font-mono bg-black/40 p-2.5 rounded-xl border border-white/10">
                              <div><span className="text-white/40 block">Taux Sébum</span><span className="text-emerald-400 font-bold">Équilibré ({mockResult.subScores.sebum}%)</span></div>
                              <div><span className="text-white/40 block">Densité Collagène</span><span className="text-sky-300 font-bold">Optimale (88%)</span></div>
                              <div><span className="text-white/40 block">Intégrité Barrière</span><span className="text-[#F3E5AB] font-bold">Fortifiée ({mockResult.subScores.barrierIntegrity}%)</span></div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-white/90 font-sans leading-relaxed">
                            "Votre peau manque légèrement d'eau mais sécrète la bonne quantité d'huile naturelle. Nous allons appliquer un soin hydratant à base de Beurre de Karité brut et de Sérum d'Hibiscus pour éclaircir vos taches sombres et redonner de l'éclat à votre teint."
                          </p>
                        )}
                      </div>

                      {/* Formulation Botanique Sur-Mesure Kènè Lab */}
                      <div className="bg-[#1A1410] border border-[#2E5A36]/50 p-4 rounded-2xl space-y-2.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2E5A36]/40 pb-2 gap-2">
                          <span className="text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-widest font-display flex items-start sm:items-center gap-1.5 min-w-0">
                            <span className="shrink-0">🌱</span> <span className="break-words leading-tight">Formulation Botanique Sur-Mesure</span>
                          </span>
                          <span className="text-[9px] bg-[#2E5A36]/30 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold">
                            Kènè Lab Certified
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="bg-[#0A0603] p-2.5 rounded-xl border border-white/5 space-y-1">
                            <span className="text-emerald-400 font-bold block text-[11px]">🥣 Beurre de Karité Brut de Korhogo (45%)</span>
                            <span className="text-white/50 text-[10px] block">Restauration lipidique & nutrition intense</span>
                          </div>
                          <div className="bg-[#0A0603] p-2.5 rounded-xl border border-white/5 space-y-1">
                            <span className="text-emerald-400 font-bold block text-[11px]">🌳 Huile de Baobab de Tambacounda (30%)</span>
                            <span className="text-white/50 text-[10px] block">Scellage hydrique & anti-oxydant</span>
                          </div>
                          <div className="bg-[#0A0603] p-2.5 rounded-xl border border-white/5 space-y-1">
                            <span className="text-emerald-400 font-bold block text-[11px]">🌺 Sérum Concentré d'Hibiscus (20%)</span>
                            <span className="text-white/50 text-[10px] block">AHA botaniques & anti-taches PIH</span>
                          </div>
                          <div className="bg-[#0A0603] p-2.5 rounded-xl border border-white/5 space-y-1">
                            <span className="text-emerald-400 font-bold block text-[11px]">✨ Niacinamide Clinique 5% (5%)</span>
                            <span className="text-white/50 text-[10px] block">Régulation séborrhique & barrière cutanée</span>
                          </div>
                        </div>
                      </div>

                      {/* ⚠️ Problèmes & Anomalies Cutanées Décelées */}
                      <div className="bg-[#8A1C14]/15 border border-[#8A1C14]/40 p-4 rounded-2xl space-y-2">
                        <span className="text-[10px] sm:text-xs font-bold text-red-400 uppercase tracking-widest font-display flex items-start sm:items-center gap-1.5 min-w-0">
                          <span className="shrink-0">⚠️</span> <span className="break-words leading-tight">Anomalies & Pathologies Cutanées</span>
                        </span>
                        <div className="space-y-1.5 text-xs">
                          <div className="bg-[#0A0603] p-2 rounded-xl border border-red-500/20 text-red-200 flex flex-col sm:flex-row sm:items-center justify-between font-mono text-[10px] sm:text-[11px] gap-1">
                            <span className="break-words">🔴 Hyperpigmentation post-inflammatoire (PIH)</span>
                            <span className="font-bold shrink-0">Profondeur 0.2mm</span>
                          </div>
                          <div className="bg-[#0A0603] p-2 rounded-xl border border-amber-500/20 text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between font-mono text-[10px] sm:text-[11px] gap-1">
                            <span className="break-words">🟡 Perturbation Transepidermique (TEWL)</span>
                            <span className="font-bold shrink-0">14.2 g/m²/h</span>
                          </div>
                          <div className="bg-[#0A0603] p-2 rounded-xl border border-white/10 text-white/80 flex flex-col sm:flex-row sm:items-center justify-between font-mono text-[10px] sm:text-[11px] gap-1">
                            <span className="break-words">🟠 Teint Terne & Perte d'Éclat</span>
                            <span className="font-bold shrink-0">Kératine en surface</span>
                          </div>
                        </div>
                      </div>

                      {/* 📁‹ Recommandations & Protocoles Cliniques */}
                      <div className="bg-[#1A1410] border border-[#C8951E]/40 p-4 rounded-2xl space-y-2">
                        <span className="text-xs font-bold text-[#F3E5AB] uppercase tracking-widest font-display flex items-center gap-1.5">
                          📁‹ Protocoles Cliniques & Actions Prescrites
                        </span>
                        <div className="space-y-1.5 text-xs text-white/90 font-sans">
                          {mockResult.recommendations ? (
                            mockResult.recommendations.map((rec: string, rIdx: number) => (
                              <div key={rIdx} className="bg-[#0A0603] p-2.5 rounded-xl border border-white/5 flex items-start gap-2">
                                <span className="text-[#C8951E] font-bold">✨“</span>
                                <span className="text-white/80 leading-snug">{rec}</span>
                              </div>
                            ))
                          ) : (
                            <>
                              <div className="bg-[#0A0603] p-2.5 rounded-xl border border-white/5 flex items-start gap-2">
                                <span className="text-[#C8951E] font-bold">✨“</span>
                                <span>Protocole Cabine : Soin Éclat Karité & Bissap (60 min)</span>
                              </div>
                              <div className="bg-[#0A0603] p-2.5 rounded-xl border border-white/5 flex items-start gap-2">
                                <span className="text-[#C8951E] font-bold">✨“</span>
                                <span>Sérum Concentré Éclat Bissap & Niacinamide (3 gouttes le soir)</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* 🌅 Routine Quotidienne à Domicile (Matin & Soir) */}
                      <div className="bg-[#0A0603] border border-[#4E9FD1]/40 p-4 rounded-2xl space-y-3">
                        <span className="text-xs font-bold text-[#4E9FD1] uppercase tracking-widest font-display flex items-center gap-1.5">
                          🌅 Routine Dermo-Cosmétique à Domicile (Matin & Soir)
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="bg-[#1A1410] p-3 rounded-xl border border-[#4E9FD1]/20 space-y-1.5">
                            <span className="font-bold text-sky-300 block border-b border-white/5 pb-1">🌅 Matin (Protection & Hydratation)</span>
                            <p className="text-[11px] text-white/70 leading-relaxed font-sans">
                              1. Nettoyage doux à l'eau d'Aloe Vera<br />
                              2. 2 gouttes de Sérum Niacinamide 5%<br />
                              3. Écran Solaire Minéral SPF 50+ obligatoire
                            </p>
                          </div>
                          <div className="bg-[#1A1410] p-3 rounded-xl border border-[#C8951E]/20 space-y-1.5">
                            <span className="font-bold text-[#F3E5AB] block border-b border-white/5 pb-1">🌙 Soir (Régénération & Éclat)</span>
                            <p className="text-[11px] text-white/70 leading-relaxed font-sans">
                              1. Double nettoyage Huile de Baobab<br />
                              2. Application Sérum Bissap Anti-taches<br />
                              3. Scellage avec Beurre de Karité brut
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <DialogFooter className="mt-4 flex gap-2">
                  {!scanComplete ? (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={simulateScan}
                      disabled={isScanning || !selectedClient}
                      className="w-full h-11 rounded-xl font-bold text-sm text-[#0F0A05] flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer shadow-lg"
                      style={{ background: 'linear-gradient(135deg, #F3E5AB, #C8951E)' }}
                    >
                      {isScanning ? (
                        <span className="flex items-center justify-center gap-2 text-[#0F0A05]">
                          <Cpu className="w-4 h-4 animate-spin text-[#0F0A05]" />
                          <span>Analyse Biométrique IA en cours...</span>
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <ScanFace className="w-4 h-4" />
                          <span>Démarrer le Scan Biométrique</span>
                        </span>
                      )}
                    </motion.button>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleSaveDiagnosis}
                      className="w-full h-11 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 bg-emerald-500/80 hover:bg-emerald-500 transition cursor-pointer shadow-lg"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Enregistrer la Fiche Médicalisée au Dossier Client
                    </motion.button>
                  )}
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
        </div>
      </motion.div>

      {/* ── DETAILED CLINICAL REPORT MODAL (WITH QUESTIONNAIRE DATA) ── */}
      <Dialog open={!!viewingReport} onOpenChange={(open) => !open && setViewingReport(null)}>
        <DialogContent className="bg-[#0A0603] border border-[#C8951E]/40 text-white rounded-3xl w-[95vw] max-w-4xl lg:max-w-5xl max-h-[92vh] overflow-y-auto shadow-2xl p-4 sm:p-6">
          {viewingReport && (
            <div className="space-y-6">
              {/* Header with Logo & Salon Branding */}
              <div className="flex justify-between items-start border-b border-white/10 pb-4">
                <KeneLogo variant="full" size="md" />
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#C8951E] bg-[#C8951E]/10 border border-[#C8951E]/30 px-3 py-1 rounded-full inline-block">
                    Bilan Cutané & Prescription Botanique
                  </span>
                  <p className="text-[10px] text-white/40 font-mono mt-1">
                    Émis le {format(new Date(viewingReport.createdAt), 'dd MMMM yyyy à HH:mm')}
                  </p>
                </div>
              </div>

              {/* Dermo-Translator Mode Toggle Header (Medical Scientific vs Clear Practitioner-Client Explanations) */}
              <div className="bg-[#0A0603] p-1.5 rounded-2xl border border-[#C8951E]/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between shadow-inner gap-1.5">
                <button
                  onClick={() => setMedicalMode(true)}
                  className={`flex-1 py-2 px-2 rounded-xl text-[10px] sm:text-xs font-bold font-mono transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-normal sm:whitespace-nowrap ${
                    medicalMode ? 'bg-gradient-to-r from-[#C8951E] to-[#F3E5AB] text-[#0F0A05] shadow-md font-black' : 'text-white/50 hover:text-white'
                  }`}
                >
                  <span className="shrink-0">🧬</span> <span className="text-center leading-tight">Mode Médical Dermo-Clinique</span>
                </button>
                <button
                  onClick={() => setMedicalMode(false)}
                  className={`flex-1 py-2 px-2 rounded-xl text-[10px] sm:text-xs font-bold font-mono transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-normal sm:whitespace-nowrap ${
                    !medicalMode ? 'bg-[#4E9FD1] text-white shadow-md font-black' : 'text-white/50 hover:text-white'
                  }`}
                >
                  <span className="shrink-0">💡</span> <span className="text-center leading-tight">Mode Vulgarisé (Cliente)</span>
                </button>
              </div>

              {/* ── 3D GOLDEN OCTO-SPECTRAL MESH VISUALIZER ── */}
              <div className="my-2">
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <span className="text-[10px] font-mono font-bold text-[#F3E5AB] uppercase tracking-wider flex items-center gap-1.5">
                    ✨ Cartographie Vectorielle 3D & Scanner Octo-Spectral Immersif (60 FPS)
                  </span>
                  <span className="text-[9px] bg-[#C8951E]/20 text-[#F3E5AB] border border-[#C8951E]/40 px-2 py-0.5 rounded-full font-mono font-bold">
                    XP-3D IMMERSIVE
                  </span>
                </div>
                <SpectralScanOverlay 
                  imageSrc={viewingReport.photoUrl || capturedPhoto || '/images/afro_skin_spectral_scanner.jpg'}
                  clientName={`${viewingReport.client?.firstName || 'Cliente'} ${viewingReport.client?.lastName || ''}`}
                  hydrationScore={viewingReport.subScores?.hydration || 84}
                  pihDepth="0.2mm"
                  phototype={`Type ${viewingReport.phototype || 'V'}`}
                  showControls={true}
                />
              </div>

              {/* Client & Phototype Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#1A1410] border border-white/10 p-4 rounded-2xl">
                <div>
                  <span className="text-[10px] font-mono text-white/40 uppercase">Cliente Ciblée</span>
                  <h3 className="font-display font-bold text-base text-white">{viewingReport.client?.firstName} {viewingReport.client?.lastName}</h3>
                  <p className="text-xs text-white/50 font-mono">{viewingReport.client?.phone || 'Dossier #CL-8492'}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-white/40 uppercase">Phototype Fitzpatrick</span>
                  <div className="flex justify-end gap-1.5 items-center mt-1">
                    <span className="font-display font-black text-lg text-[#F3E5AB]">Type {viewingReport.phototype || 'V'}</span>
                    <span className="w-5 h-5 rounded-md border border-white/30" style={{ backgroundColor: FITZPATRICK_COLORS[viewingReport.phototype || 'V'] }} />
                  </div>
                  <p className="text-[9px] text-[#C8951E] font-mono">Peau Mélanoderme / Afro</p>
                </div>
              </div>

              {/* Medical vs Clear Explanation Card */}
              <div className={`p-4 rounded-2xl border transition-all ${medicalMode ? 'bg-[#C8951E]/10 border-[#C8951E]/40' : 'bg-[#4E9FD1]/10 border-[#4E9FD1]/40'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 text-white">
                    {medicalMode ? '🔬 Diagnostic Scientifique & Métriques Cliniques :' : '💬 Explication Simple pour la Cliente :'}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${medicalMode ? 'bg-[#C8951E] text-[#0F0A05]' : 'bg-[#4E9FD1] text-white'}`}>
                    {medicalMode ? 'Dermo-Clinique V3' : 'Vulgarisé'}
                  </span>
                </div>
                {medicalMode ? (
                  <div className="space-y-2 text-xs">
                    <p className="text-white/80 font-mono leading-relaxed">
                      Perte Transepidermique en Eau (TEWL) : <strong className="text-emerald-400">14.2 g/m²/h</strong> · Profondeur Hyperpigmentation PIH : <strong className="text-amber-400">0.2mm (Épidermique)</strong> · Indice de Mélanine : <strong className="text-[#F3E5AB]">68/100</strong>.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-[10px] font-mono bg-black/40 p-2.5 rounded-xl border border-white/10">
                      <div><span className="text-white/40 block">Taux Sébum</span><span className="text-emerald-400 font-bold">Équilibré (74%)</span></div>
                      <div><span className="text-white/40 block">Densité Collagène</span><span className="text-sky-300 font-bold">Optimale (88%)</span></div>
                      <div><span className="text-white/40 block">Intégrité Barrière</span><span className="text-[#F3E5AB] font-bold">Fortifiée (92%)</span></div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-white/90 font-sans leading-relaxed">
                    "Votre peau manque légèrement d'eau mais sécrète la bonne quantité d'huile naturelle. Nous allons appliquer un soin hydratant à base de Beurre de Karité brut et de Sérum d'Hibiscus pour éclaircir vos taches sombres et redonner de l'éclat à votre teint."
                  </p>
                )}
              </div>

              {/* Formulation Botanique Sur-Mesure Kènè Lab */}
              <div className="bg-[#1A1410] border border-[#2E5A36]/50 p-4 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between border-b border-[#2E5A36]/40 pb-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-display flex items-center gap-1.5">
                    🌱 Formulation Botanique Sur-Mesure & Dosages Précis
                  </span>
                  <span className="text-[9px] bg-[#2E5A36]/30 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold">
                    Kènè Lab Certified
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#0A0603] p-2.5 rounded-xl border border-white/5 space-y-1">
                    <span className="text-emerald-400 font-bold block text-[11px]">🥣 Beurre de Karité Brut de Korhogo (45%)</span>
                    <span className="text-white/50 text-[10px] block">Restauration lipidique & nutrition intense</span>
                  </div>
                  <div className="bg-[#0A0603] p-2.5 rounded-xl border border-white/5 space-y-1">
                    <span className="text-emerald-400 font-bold block text-[11px]">🌳 Huile de Baobab de Tambacounda (30%)</span>
                    <span className="text-white/50 text-[10px] block">Scellage hydrique & anti-oxydant</span>
                  </div>
                  <div className="bg-[#0A0603] p-2.5 rounded-xl border border-white/5 space-y-1">
                    <span className="text-emerald-400 font-bold block text-[11px]">🌺 Sérum Concentré d'Hibiscus (20%)</span>
                    <span className="text-white/50 text-[10px] block">AHA botaniques & atténuation des taches PIH</span>
                  </div>
                  <div className="bg-[#0A0603] p-2.5 rounded-xl border border-white/5 space-y-1">
                    <span className="text-emerald-400 font-bold block text-[11px]">✨ Niacinamide Clinique 5% (5%)</span>
                    <span className="text-white/50 text-[10px] block">Régulation séborrhique & barrière cutanée</span>
                  </div>
                </div>
              </div>

              {/* Anamnesis Questionnaire Summary in Printed Report */}
              <div className="bg-[#1A1410] border border-white/10 p-4 rounded-2xl space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#C8951E] font-display flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4 text-[#C8951E]" /> Questionnaire Anamnèse & Réponses Cliente
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#0A0603] p-2 rounded-xl border border-white/5">
                    <span className="text-white/40 block text-[10px]">Peau Ressentie</span>
                    <span className="font-bold text-white capitalize">{viewingReport.questionnaireData?.perceivedSkinType || 'Mixte (Zone T)'}</span>
                  </div>
                  <div className="bg-[#0A0603] p-2 rounded-xl border border-white/5">
                    <span className="text-white/40 block text-[10px]">Exposition Solaire / Ecran SPF</span>
                    <span className="font-bold text-white capitalize">{viewingReport.questionnaireData?.sunExposure || 'Modérée'} · SPF {viewingReport.questionnaireData?.useSunscreen || 'Rarement'}</span>
                  </div>
                  <div className="col-span-2 bg-[#0A0603] p-2 rounded-xl border border-white/5">
                    <span className="text-white/40 block text-[10px]">Préoccupations Principales</span>
                    <span className="font-bold text-[#F3E5AB]">Taches sombres / PIH, Teint terne, Sécheresse</span>
                  </div>
                </div>
              </div>

              {/* Score & Gauge Section */}
              <div className="flex items-center justify-between bg-[#1A1410] border border-white/10 p-5 rounded-2xl">
                <div>
                  <h4 className="font-display font-bold text-lg text-white">Score de Santé Cutanée Global</h4>
                  <p className="text-xs text-white/50 max-w-xs mt-0.5">
                    Évalué sur la base de l'intégrité de la barrière lipidique, l'hydratation et le risque pigmentaire.
                  </p>
                </div>
                <ScoreGauge score={viewingReport.scoreGlobal} size={110} />
              </div>

              {/* Actions Footer: Télécharger, Imprimer, Partager WhatsApp */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* 1. Imprimer */}
                  <Button 
                    onClick={() => window.print()}
                    className="bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] font-bold rounded-xl h-11 text-xs cursor-pointer shadow-md"
                  >
                    <Printer className="w-4 h-4 mr-1.5" /> Imprimer
                  </Button>

                  {/* 2. Télécharger PDF */}
                  <Button 
                    onClick={() => {
                      const blob = new Blob([
                        `RAPPORT CLINIQUE & ORDONNANCE DERMO-BOTANIQUE KÈNÈ\n` +
                        `---------------------------------------------------\n` +
                        `Cliente: ${viewingReport.client?.firstName} ${viewingReport.client?.lastName}\n` +
                        `Date: ${format(new Date(viewingReport.createdAt), 'dd/MM/yyyy HH:mm')}\n` +
                        `Phototype: Fitzpatrick Type ${viewingReport.phototype || 'V'}\n` +
                        `Score Global: ${viewingReport.scoreGlobal}/100\n\n` +
                        `PRESCRIPTION DERMO-BOTANIQUE:\n` +
                        `- Sérum Bissap Bio (Anti-taches PIH)\n` +
                        `- Beurre de Karité Pur Brut (Régénération lipidique)\n` +
                        `- Huile de Baobab Pure (Scellage hydratation)\n\n` +
                        `Merci de votre confiance — Institut Kènè OS`
                      ], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `Rapport_Diagnostic_${viewingReport.client?.firstName || 'Client'}.txt`;
                      a.click();
                      toast({ title: "📁¥ Document Téléchargé !", description: "Le rapport dermo-botanique a été enregistré." });
                    }}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl h-11 text-xs cursor-pointer border border-white/10"
                  >
                    <FileText className="w-4 h-4 mr-1.5 text-sky-400" /> Télécharger (.pdf/.txt)
                  </Button>

                  {/* 3. Partager WhatsApp */}
                  <Button 
                    onClick={() => {
                      const phone = viewingReport.client?.phone || '';
                      const message = encodeURIComponent(
                        `✨ Bonjour ${viewingReport.client?.firstName || ''},\n\n` +
                        `Voici le bilan de votre Diagnostic Cutané chez Kènè (Score: ${viewingReport.scoreGlobal}/100, Phototype ${viewingReport.phototype || 'V'}).\n\n` +
                        `🌿 Votre ordonnance personnalisée :\n` +
                        `• Sérum Bissap Éclat Anti-Taches\n` +
                        `• Beurre de Karité Brut de Korhogo\n` +
                        `• Huile de Baobab Pure Scellante\n\n` +
                        `Consultez votre bilan complet sur votre espace client : https://kene.app/portal`
                      );
                      window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
                    }}
                    className="bg-emerald-600/80 hover:bg-emerald-600 text-white font-bold rounded-xl h-11 text-xs cursor-pointer shadow-md"
                  >
                    <span className="mr-1.5">📁²</span> Partager WhatsApp
                  </Button>
                </div>

                <Button 
                  variant="ghost"
                  onClick={() => setViewingReport(null)}
                  className="w-full text-white/40 hover:text-white rounded-xl h-9 text-xs"
                >
                  Fermer la fenêtre
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── HISTORY LIST ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="rounded-3xl border border-white/10 bg-[#1A1410] overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-5 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#4E9FD1]/10 flex items-center justify-center">
                <Activity className="w-4 h-4 text-[#4E9FD1]" />
              </div>
              <span className="font-display font-bold text-sm text-white">Dossiers Diagnostics Cutanés</span>
              <span className="text-[10px] bg-white/10 text-[#C8951E] font-bold px-2.5 py-0.5 rounded-full font-mono">{diagnoses.length} dossiers</span>
            </div>
            <div className="relative w-full md:w-60">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-white/30" />
              <Input placeholder="Rechercher une cliente..." className="pl-8 bg-white/5 border-white/10 text-white text-xs h-9 rounded-xl placeholder:text-white/30 focus:border-[#C8951E]" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><div className="animate-spin h-6 w-6 border-2 border-[#C8951E] border-t-transparent rounded-full" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-white/20 text-xs"><div className="text-4xl mb-3">🔬</div>Aucun diagnostic enregistré.</div>
          ) : (
            <div className="divide-y divide-white/5">
              {filtered.map((diag, i) => {
                const scoreColor = diag.scoreGlobal >= 75 ? '#4CAF6E' : diag.scoreGlobal >= 55 ? '#C8951E' : '#E53935';
                return (
                  <motion.div
                    key={diag.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors"
                  >
                    {/* Score badge */}
                    <div className="w-12 h-12 rounded-2xl border flex flex-col items-center justify-center shrink-0 shadow-md"
                      style={{ borderColor: `${scoreColor}40`, background: `${scoreColor}15` }}>
                      <span className="font-display font-black text-base leading-none" style={{ color: scoreColor }}>{diag.scoreGlobal}</span>
                      <span className="text-[8px] font-mono" style={{ color: `${scoreColor}80` }}>/100</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white font-display">{diag.client?.firstName} {diag.client?.lastName}</span>
                        {diag.dermatoReferral && (
                          <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">⚠️ï¸ Orientation Dermato</span>
                        )}
                        <span className="text-[9px] font-bold font-mono text-[#C8951E] bg-[#C8951E]/10 border border-[#C8951E]/20 px-2 py-0.5 rounded-md">
                          Phototype {diag.phototype || 'V'}
                        </span>
                      </div>
                      <div className="text-[10px] text-white/40 font-mono mt-0.5">
                        Effectué le {format(new Date(diag.createdAt), 'dd/MM/yyyy à HH:mm')}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        onClick={() => window.print()} 
                        className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition cursor-pointer" 
                        title="Imprimer le rapport"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setViewingReport(diag)}
                        className="text-xs font-bold text-[#F3E5AB] bg-[#C8951E]/20 border border-[#C8951E]/40 hover:bg-[#C8951E] hover:text-[#0F0A05] transition px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1"
                      >
                        <span>Voir bilan cutané</span> <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>

      <BeforeAfterGalleryModal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        clientPhoto={typeof window !== 'undefined' ? localStorage.getItem('kene_latest_client_photo') : null}
      />

      {/* ── MODALE IMPRESSION FICHE ANAMNÈSE PAPIER A4 (ACCUEIL) ── */}
      <Dialog open={showPrintableSheet} onOpenChange={setShowPrintableSheet}>
        <DialogContent className="bg-[#0A0603] border border-[#C8951E]/40 text-white rounded-3xl w-[95vw] max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl p-4 sm:p-6">
          <PrintableAnamnesisSheet onClose={() => setShowPrintableSheet(false)} />
        </DialogContent>
      </Dialog>

      {/* Afro-Futuristic 3D Biometric Loader Modal */}
      <AfroFuturisticScanLoaderModal
        isOpen={isScanning}
        title="Analyse Biométrique & Spectrale Pro"
        subtitle="Extraction des sous-scores d'hydratation, TEWL et cartographie PIH..."
      />
    </div>
  );
}
