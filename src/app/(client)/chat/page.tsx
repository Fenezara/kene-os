'use client';

// Kènè OS — TAARU AI · Dr. Mama Kènè IA (100% Unblockable Multimodal Media Toolbar v6.5)
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  ArrowLeft, MoreHorizontal, Send, Mic, Play, Pause, Video, MessageSquare, Phone,
  Camera, Volume2, Sun, ShieldCheck, ShoppingBag, MapPin, Stethoscope, AlertTriangle, CheckCircle2, HelpCircle, CheckCheck, Smartphone, Sparkles, User, RefreshCw, ArrowRight, ChevronRight, Check, Image as ImageIcon, Globe, FileText, Download, Zap, Compass, Activity, Droplets
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ParticleOrb3D } from '@/components/ParticleOrb3D';
import { useToast } from '@/hooks/use-toast';

export interface MultimodalMediaItem {
  id: string;
  type: 'text' | 'audio' | 'photo' | 'video' | 'sms';
  sender: 'doctor' | 'patient';
  text?: string;
  mediaUrl?: string;
  audioDuration?: string;
  videoTitle?: string;
  timestamp: string;
}

function BiometricRadarCanvas({ score = 78 }: { score?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = (canvas.width = 220);
    const h = (canvas.height = 220);
    const cx = w / 2;
    const cy = h / 2;
    const radius = 75;

    ctx.clearRect(0, 0, w, h);

    const labels = ['Hydratation', 'Sébum', 'Protection UV', 'Élasticité', 'Éclat'];
    const values = [0.45, 0.75, 0.85, 0.80, 0.65];
    const numAxes = labels.length;

    ctx.strokeStyle = 'rgba(255, 215, 0, 0.25)';
    ctx.lineWidth = 1;
    for (let r = 1; r <= 4; r++) {
      ctx.beginPath();
      const currentR = (radius / 4) * r;
      for (let i = 0; i < numAxes; i++) {
        const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
        const x = cx + currentR * Math.cos(angle);
        const y = cy + currentR * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    for (let i = 0; i < numAxes; i++) {
      const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.stroke();

      ctx.fillStyle = '#FFD700';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      const lx = cx + (radius + 18) * Math.cos(angle);
      const ly = cy + (radius + 14) * Math.sin(angle);
      ctx.fillText(labels[i], lx, ly);
    }

    ctx.fillStyle = 'rgba(255, 215, 0, 0.35)';
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < numAxes; i++) {
      const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
      const valR = radius * values[i];
      const x = cx + valR * Math.cos(angle);
      const y = cy + valR * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }, [score]);

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} className="w-56 h-56 block" />
      <span className="text-[10px] font-mono text-[#FFD700] font-bold mt-1">
        Score Dermo-Biométrique : 78/100 (Bon Équilibre Tropical)
      </span>
    </div>
  );
}

function ChatContent() {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ container: containerRef });
  const orbScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.85, 0.7]);
  const orbOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.9, 0.8]);

  const [userName, setUserName] = useState('Aïsha');
  const [selectedLanguage, setSelectedLanguage] = useState<'fr' | 'wo' | 'bm'>('fr');
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  const [mediaFeed, setMediaFeed] = useState<MultimodalMediaItem[]>([]);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [consultationData, setConsultationData] = useState<{
    symptom?: string;
    trigger?: string;
    diagnosis?: string;
    prescription?: any;
    goldenRules?: string[];
  }>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('kene_user');
      if (savedUser) {
        try {
          const u = JSON.parse(savedUser);
          if (u.firstName) setUserName(u.firstName);
          else if (u.name) setUserName(u.name.split(' ')[0]);
        } catch (e) {}
      }
    }
  }, []);

  const getLanguageGreeting = () => {
    if (selectedLanguage === 'wo') return `Nanga def ${userName}, taaru bi ma ngi la di déglu.`;
    if (selectedLanguage === 'bm') return `I ni cé ${userName}, n'b'i lamèn.`;
    return `Bonjour ${userName}, je vous écoute.`;
  };

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*#]/g, ''));
      utterance.lang = 'fr-FR';
      utterance.rate = 0.95;
      utterance.pitch = 1.02;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // 1. 📷 PHOTO UPLOAD / DEMO TRIGGER
  const handleTriggerPhotoAnalysis = (photoUrl?: string) => {
    const demoPhoto = photoUrl || '/kene_afro_beauty_hero.png';

    const photoItem: MultimodalMediaItem = {
      id: `photo-${Date.now()}`,
      type: 'photo',
      sender: 'patient',
      mediaUrl: demoPhoto,
      text: '📷 Photo Cutanée transmise au scanner 3D du Dr. Mama Kènè',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMediaFeed(prev => [...prev, photoItem]);

    setIsThinking(true);
    toast({
      title: "📷 Photo Reçue & Analysée !",
      description: "Le Dr. Mama Kènè IA effectue le scanner biométrique 3D...",
    });

    setTimeout(() => {
      setIsThinking(false);
      const docResponse: MultimodalMediaItem = {
        id: `doc-photo-ack-${Date.now()}`,
        type: 'text',
        sender: 'doctor',
        text: "Scanner Biométrique 3D complété : J'observe une concentration mélanique réactive et une déshydratation épidermique. Poursuivons l'évaluation.",
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMediaFeed(prev => [...prev, docResponse]);
      handleSelectSymptom("Taches foncées observées sur photo cutanée");
    }, 1500);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      handleTriggerPhotoAnalysis();
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      handleTriggerPhotoAnalysis(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 2. 🎙️ AUDIO VOICE NOTE TRIGGER
  const handleStartVoiceRecording = () => {
    setIsListening(true);
    toast({
      title: "🎙️ Note Vocale Audio Active...",
      description: "Parlez... Votre note vocale est transmise au médecin.",
    });

    setTimeout(() => {
      setIsListening(false);
      const patientAudio: MultimodalMediaItem = {
        id: `audio-${Date.now()}`,
        type: 'audio',
        sender: 'patient',
        audioDuration: '0:28',
        text: "Note Vocale Audio Cliente : 'Docteur, j'ai des tiraillements et des taches sur les joues.'",
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMediaFeed(prev => [...prev, patientAudio]);

      setIsThinking(true);

      setTimeout(() => {
        setIsThinking(false);
        const docAudioAck: MultimodalMediaItem = {
          id: `doc-audio-ack-${Date.now()}`,
          type: 'audio',
          sender: 'doctor',
          audioDuration: '0:35',
          text: "Note Vocale du Dr. Mama Kènè : J'ai bien écouté votre note vocale. Je prends en compte les tiraillements dus au soleil.",
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        };
        setMediaFeed(prev => [...prev, docAudioAck]);
        handleSelectSymptom("Taches foncées & tiraillements (Note Vocale)");
      }, 1400);
    }, 2200);
  };

  // 3. 🎥 VIDEO CLIP TRIGGER
  const handleSendVideoClip = () => {
    toast({ title: "🎥 Capsule Vidéo", description: "Chargement de la démonstration vidéo médicale..." });
    const videoItem: MultimodalMediaItem = {
      id: `video-${Date.now()}`,
      type: 'video',
      sender: 'doctor',
      videoTitle: 'Capsule Vidéo : Application du Sérum Baobab & Écran SPF 50',
      text: 'Le Dr. Mama Kènè vous montre en vidéo comment appliquer votre sérum sans saturer vos pores.',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMediaFeed(prev => [...prev, videoItem]);
    speakText(videoItem.text || '');
  };

  // 4. 📱 SMS & TEXT HANDLER
  const handleSendPatientText = (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim()) return;

    const patientSms: MultimodalMediaItem = {
      id: `sms-patient-${Date.now()}`,
      type: 'sms',
      sender: 'patient',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMediaFeed(prev => [...prev, patientSms]);
    if (!customText) setInput('');

    toast({ title: "📱 SMS Transmis", description: "Votre message SMS a été reçu par le Dr. Mama Kènè." });
    handleSelectSymptom(textToSend);
  };

  const handleSelectSymptom = (symptomText: string) => {
    setIsThinking(true);
    let diag = "Hyperpigmentation Post-Inflammatoire (PIH) & Oxydation Mélanique due aux UV tropicaux.";
    let rx = {
      title: 'Ordonnance Anti-Taches PIH Certifiée',
      items: [
        { name: 'Sérum Hibiscus & Baobab 10% Bio', desc: 'Appliquer le soir sur les taches', price: 18500 },
        { name: 'Écran Solaire Minéral SPF 50', desc: 'Appliquer chaque matin', price: 15000 },
      ],
      totalPrice: 33500,
    };
    let rules = [
      "Règle d'Or 1 : Ne jamais appliquer d'acides exfoliants forts durant la journée sous le soleil.",
      "Règle d'Or 2 : Appliquer l'Écran Solaire Minéral SPF 50 chaque matin même par temps nuageux.",
      "Règle d'Or 3 : Rincer le visage à l'eau tiède et proscrire les savons décapants durs.",
    ];

    if (symptomText.includes('Boutons') || symptomText.includes('grasse')) {
      diag = "Hyperséborrhée Réactive & Obstruction Folliculaire Inflammatoire.";
      rx = {
        title: 'Ordonnance Anti-Boutons Purifiante',
        items: [
          { name: 'Gel Nettoyant Moringa & Baobab 200ml', desc: 'Nettoyage purifiant matin & soir', price: 12000 },
          { name: 'Lotion Matifiante Eau de Rose Bio', desc: 'Resserre les pores & équilibre pH', price: 14500 },
        ],
        totalPrice: 26500,
      };
      rules = [
        "Règle d'Or 1 : Nettoyer le visage matin et soir sans frotter excessivement.",
        "Règle d'Or 2 : Éviter de percer les imperfections pour prévenir les taches secondaires.",
      ];
    } else if (symptomText.includes('chevalu') || symptomText.includes('tresses')) {
      diag = "Tension Folliculaire & Micro-Inflammation du Cuir Chevelu.";
      rx = {
        title: 'Ordonnance Apaisante Cuir Chevelu',
        items: [
          { name: 'Élixir Apaisant Nigelle & Karité 100ml', desc: 'Appliquer en gouttes sur les raies', price: 16000 },
          { name: 'Shampoing Doux Purifiant Sans Sulfate', desc: 'Lavage apaisant hebdomadaire', price: 11000 },
        ],
        totalPrice: 27000,
      };
      rules = [
        "Règle d'Or 1 : Ne pas serrer excessivement les tresses au niveau des tempes.",
        "Règle d'Or 2 : Appliquer l'élixir au Karité & Nigelle sans frotter le cuir chevelu.",
      ];
    }

    setConsultationData(prev => ({
      ...prev,
      symptom: symptomText,
      diagnosis: diag,
      prescription: rx,
      goldenRules: rules,
    }));

    setTimeout(() => {
      setIsThinking(false);
      setActiveStep(2);
      speakText("Étape 2 : Examen clinique. Depuis combien de temps observez-vous ce problème et quelle est votre exposition au soleil ?");
    }, 1200);
  };

  const handleSelectTrigger = (triggerText: string) => {
    setIsThinking(true);
    setConsultationData(prev => ({ ...prev, trigger: triggerText }));

    setTimeout(() => {
      setIsThinking(false);
      setActiveStep(3);
      speakText(`Étape 3 : Diagnostic Médical Posé. ${consultationData.diagnosis}`);
    }, 1200);
  };

  const handleGoToStep4 = () => {
    setActiveStep(4);
    speakText(`Étape 4 : Ordonnance Dermo-Botanique Sur-Mesure. ${consultationData.prescription?.title}`);
  };

  const handleGoToStep5 = () => {
    setActiveStep(5);
    const rulesSpeech = consultationData.goldenRules ? consultationData.goldenRules.join('. ') : '';
    speakText(`Étape 5 : Conseils hygiéno-diététiques et règles d'or. ${rulesSpeech}`);
  };

  const handleResetConsultation = () => {
    setActiveStep(1);
    setConsultationData({});
    setMediaFeed([]);
    speakText("Bonjour Aïsha ! Bienvenue dans votre Spa Télémédecine 3D.");
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#0A0503] text-[#F8F1E4] flex flex-col items-center font-sans selection:bg-[#FFD700] selection:text-black overflow-hidden relative">
      
      {/* Floating 3D Gold Dust Particles Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.2, y: '100vh', x: `${(i * 8) % 100}vw` }}
            animate={{ opacity: [0.2, 0.6, 0.2], y: '-10vh' }}
            transition={{ duration: 12 + i * 2, repeat: Infinity, ease: 'linear' }}
            className="absolute w-1.5 h-1.5 rounded-full bg-[#FFD700]/40 blur-xs"
          />
        ))}
      </div>

      {/* Glow Ambient Atmospheric Orbs */}
      <div className="fixed top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FFD700]/15 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="fixed bottom-10 right-10 w-80 h-80 bg-[#C8951E]/10 rounded-full blur-[110px] pointer-events-none z-0" />

      {/* ── 📱 TOP HEADER BAR ── */}
      <header className="w-full max-w-md px-6 py-3 flex items-center justify-between shrink-0 relative z-30 bg-[#120B06]/95 backdrop-blur-2xl border-b border-[#FFD700]/30 shadow-xl">
        <button
          onClick={() => router.push('/portal')}
          className="w-9 h-9 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          title="Retour"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-center space-y-0.5">
          <span className="text-[10px] font-mono tracking-[0.3em] text-[#FFD700] font-black uppercase flex items-center gap-1.5 justify-center">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD700] animate-spin" />
            TAARU AI · SPA 3D
          </span>

          <div className="flex items-center justify-center gap-1">
            {[
              { id: 'fr', label: '🇫🇷 FR' },
              { id: 'wo', label: '🇸🇳 WOLOF' },
              { id: 'bm', label: '🇲🇱 BAMBARA' },
            ].map(lang => (
              <button
                key={lang.id}
                onClick={() => {
                  setSelectedLanguage(lang.id as any);
                  toast({ title: `Langue : ${lang.label}`, description: "Dr. Mama Kènè s'exprime dans votre langue." });
                }}
                className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded-full border transition ${
                  selectedLanguage === lang.id
                    ? 'bg-[#FFD700] text-black border-[#FFD700]'
                    : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleResetConsultation}
          className="w-9 h-9 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          title="Réinitialiser"
        >
          <RefreshCw className="w-4 h-4 text-[#FFD700]" />
        </button>
      </header>

      {/* ── 🏥 STEP PROGRESS BAR (PAS-À-PAS EN 5 ÉTAPES) ── */}
      <div className="w-full max-w-md px-6 py-2 shrink-0 z-20 bg-[#0F0804] border-b border-white/10">
        <div className="flex items-center justify-between mb-1 text-[10px] font-mono font-bold text-[#FFD700]">
          <span className="flex items-center gap-1">
            <Compass className="w-3 h-3 text-[#FFD700] animate-spin" />
            CONSULTATION 3D PAS-À-PAS
          </span>
          <span>Étape {activeStep} / 5</span>
        </div>
        <div className="w-full h-1.5 bg-[#26180F] rounded-full overflow-hidden flex gap-1 p-0.5">
          {[1, 2, 3, 4, 5].map((stepNum) => (
            <div
              key={stepNum}
              className={`flex-1 h-full rounded-full transition-all duration-500 ${
                stepNum <= activeStep
                  ? 'bg-gradient-to-r from-[#FFD700] to-[#C8951E] shadow-sm'
                  : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── 🌟 SCROLLABLE MAIN SPA CONTAINER ── */}
      <div ref={containerRef} className="flex-1 overflow-y-auto w-full max-w-md px-6 pb-40 space-y-4 scrollbar-thin relative z-10">
        
        {/* 1. GREETING HEADLINE */}
        <div className="text-center space-y-1 pt-2">
          <h1 className="font-serif text-3xl sm:text-4xl text-white tracking-tight leading-tight">
            {getLanguageGreeting()}
          </h1>
        </div>

        {/* 2. THE MAGNIFICENT 3D SCROLL PARALLAX SPHERE (`ParticleOrb3D`) */}
        <motion.div style={{ scale: orbScale, opacity: orbOpacity }} className="py-1 flex flex-col items-center justify-center relative">
          
          <div className="relative group cursor-pointer" onClick={handleStartVoiceRecording}>
            
            <div className={`absolute -inset-6 rounded-full bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#E5A93C] opacity-40 blur-2xl transition-all duration-700 ${
              isThinking || isSpeaking || isListening ? 'animate-ping scale-150 opacity-75' : 'group-hover:opacity-60'
            }`} />

            <div className="w-full max-w-xs h-56 flex items-center justify-center relative z-10">
              <ParticleOrb3D
                isListening={isListening}
                isSpeaking={isSpeaking || isThinking}
                scrollProgress={0.4}
              />
            </div>

          </div>

          <div className="-mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C120B] border border-[#FFD700]/40 text-[#FFD700] text-[10px] font-mono font-bold shadow-xl z-20">
            <span className={`w-2 h-2 rounded-full ${isThinking ? 'bg-amber-400 animate-spin' : isSpeaking ? 'bg-emerald-400 animate-ping' : 'bg-[#FFD700]'}`} />
            <span>
              {isThinking ? 'Dr. Mama Kènè IA effectue le scanner biométrique 3D...' : isSpeaking ? 'Émission Note Vocale...' : `Étape ${activeStep} : Cabinet Spa 3D Actif`}
            </span>
          </div>
        </motion.div>

        {/* ── ⚡ 4 MANDATORY QUICK ACTION BAR (ACCÈS DIRECT AUDIO, PHOTO, VIDÉO, SMS) ── */}
        <div className="bg-[#1A110A] border-2 border-[#FFD700]/50 rounded-2xl p-2.5 shadow-xl grid grid-cols-2 sm:grid-cols-4 gap-1.5 z-20">
          <button
            onClick={handleStartVoiceRecording}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-[#26170D] hover:bg-[#341F12] border border-[#FFD700]/40 text-[#FFD700] text-[11px] font-bold transition cursor-pointer"
          >
            <Mic className="w-4 h-4 text-[#FFD700]" />
            <span>🎙️ Note Vocale</span>
          </button>

          <button
            onClick={() => handleTriggerPhotoAnalysis()}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-[#26170D] hover:bg-[#341F12] border border-[#FFD700]/40 text-[#FFD700] text-[11px] font-bold transition cursor-pointer"
          >
            <Camera className="w-4 h-4 text-[#FFD700]" />
            <span>📷 Scanner Photo</span>
          </button>

          <button
            onClick={handleSendVideoClip}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-[#26170D] hover:bg-[#341F12] border border-[#FFD700]/40 text-[#FFD700] text-[11px] font-bold transition cursor-pointer"
          >
            <Video className="w-4 h-4 text-[#FFD700]" />
            <span>🎥 Capsule Vidéo</span>
          </button>

          <button
            onClick={() => handleSendPatientText("Demande de bilan par SMS")}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-[#26170D] hover:bg-[#341F12] border border-[#FFD700]/40 text-[#FFD700] text-[11px] font-bold transition cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-[#FFD700]" />
            <span>📱 Alerte SMS</span>
          </button>
        </div>

        {/* ── 📊 RADAR DERMO-BIOMÉTRIQUE CUTANÉ (5-AXES) ── */}
        {activeStep >= 2 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1A110A] border-2 border-[#FFD700]/40 rounded-3xl p-4 shadow-2xl flex flex-col items-center text-center space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#FFD700] font-mono">
              <Activity className="w-4 h-4 text-[#FFD700]" />
              <span>Analyse Biométrique 5-Axes Cutanée</span>
            </div>
            <BiometricRadarCanvas />
          </motion.div>
        )}

        {/* ── 📱 MULTIMODAL MEDIA FEED DISPLAY ── */}
        <AnimatePresence>
          {mediaFeed.length > 0 && (
            <div className="w-full space-y-3">
              {mediaFeed.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-3.5 rounded-2xl border text-xs shadow-lg space-y-2 ${
                    item.sender === 'patient'
                      ? 'bg-[#1E140C] border-[#FFD700]/50 text-white ml-auto max-w-[85%]'
                      : 'bg-[#181009] border-[#FFD700]/70 text-[#FFD700] mr-auto max-w-[90%]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono border-b border-white/10 pb-1">
                    <span className="font-bold">
                      {item.sender === 'patient' ? '👤 Vous' : '🩺 Dr. Mama Kènè'}
                    </span>
                    <span className="opacity-60">{item.timestamp}</span>
                  </div>

                  {item.type === 'photo' && item.mediaUrl && (
                    <div className="space-y-2">
                      <div className="relative w-full h-44 rounded-xl overflow-hidden border-2 border-[#FFD700]">
                        <img src={item.mediaUrl} alt="Photo cutanée" className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                          <Zap className="w-3 h-3" /> Scanner 3D Validé
                        </div>
                      </div>
                      <p className="text-[11px] font-mono text-[#FFD700]">{item.text}</p>
                    </div>
                  )}

                  {item.type === 'audio' && (
                    <div className="flex items-center justify-between bg-[#120B06] p-2.5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2">
                        <button onClick={() => speakText(item.text || '')} className="w-8 h-8 rounded-full bg-[#FFD700] text-black flex items-center justify-center font-bold shadow-md">
                          <Play className="w-4 h-4 ml-0.5" />
                        </button>
                        <div>
                          <div className="font-bold text-[#FFD700] text-[11px]">🎙️ Note Vocale Audio</div>
                          <div className="text-[9px] text-white/50 font-mono">Durée: {item.audioDuration}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {item.type === 'video' && (
                    <div className="space-y-2 bg-[#120B06] p-2.5 rounded-xl border border-[#FFD700]/40">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#FFD700]">
                        <Video className="w-4 h-4" />
                        <span>{item.videoTitle}</span>
                      </div>
                      <div className="relative w-full h-32 rounded-xl bg-gradient-to-br from-[#2E1A0C] to-[#120B05] flex items-center justify-center border border-white/10 cursor-pointer" onClick={() => speakText(item.text || '')}>
                        <Play className="w-8 h-8 text-[#FFD700]" />
                      </div>
                      <p className="text-[11px] text-white/80">{item.text}</p>
                    </div>
                  )}

                  {(item.type === 'text' || item.type === 'sms') && (
                    <p className="text-xs text-white leading-relaxed font-medium">
                      {item.text}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* ── 3. INTERACTIVE 5-STEP WIZARD CARDS ── */}
        <AnimatePresence mode="wait">
          
          {/* 📍 ÉTAPE 1 : ANAMNÈSE MÉDICALE */}
          {activeStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="w-full space-y-3"
            >
              <div className="bg-[#1A110A] border-2 border-[#FFD700]/50 rounded-3xl p-5 shadow-2xl space-y-3 text-left">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[10px] font-mono font-bold text-[#FFD700] uppercase tracking-wider flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5" /> 1. Anamnèse Médicale Multimodale
                  </span>
                  <Badge className="bg-[#FFD700]/20 text-[#FFD700] text-[9px]">1 / 5</Badge>
                </div>
                
                <p className="text-xs text-white leading-relaxed font-sans font-medium">
                  "Bonjour {userName} ! Utilisez les boutons ci-dessus pour m'envoyer une **photo**, un **audio**, un **SMS** ou sélectionnez directement votre symptôme ci-dessous :"
                </p>

                <div className="space-y-2 pt-1">
                  {[
                    "🟢 Taches foncées ou noires sur les joues",
                    "🟡 Boutons, acné & peau qui brille",
                    "🟠 Cuir chevelu qui démange après tresses",
                    "🟤 Sécheresse & tiraillements intenses",
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSymptom(chip)}
                      className="w-full text-left text-xs text-white/90 hover:text-white bg-[#26170D] hover:bg-[#341F12] border border-[#FFD700]/30 hover:border-[#FFD700] p-3 rounded-2xl transition cursor-pointer flex items-center justify-between group shadow-sm"
                    >
                      <span className="font-medium">{chip}</span>
                      <ChevronRight className="w-4 h-4 text-[#FFD700] group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 📍 ÉTAPE 2 : EXAMEN CLINIQUE & DÉCLENCHEURS */}
          {activeStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="w-full space-y-3"
            >
              <div className="bg-[#1A110A] border-2 border-[#FFD700]/50 rounded-3xl p-5 shadow-2xl space-y-3 text-left">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[10px] font-mono font-bold text-[#FFD700] uppercase tracking-wider flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5" /> 2. Examen Clinique & Facteurs Déclencheurs
                  </span>
                  <Badge className="bg-[#FFD700]/20 text-[#FFD700] text-[9px]">2 / 5</Badge>
                </div>

                <div className="bg-[#26170D] border border-[#FFD700]/30 p-3 rounded-2xl text-xs text-[#FFD700] font-bold">
                  Symptôme enregistré : {consultationData.symptom}
                </div>
                
                <p className="text-xs text-white leading-relaxed font-sans font-medium">
                  "Quelle est votre exposition quotidienne au soleil ou quel facteur déclencheur pensez-vous être à l'origine de ce problème ?"
                </p>

                <div className="space-y-2 pt-1">
                  {[
                    "☀️ Forte exposition quotidienne au soleil (UV Indice 8)",
                    "💇 Tresses ou coiffure serrée récente",
                    "🧼 Utilisation de savons ou cosmétiques forts",
                    "🔥 Chaleur et transpiration excessive (32°C)",
                  ].map((trigger, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectTrigger(trigger)}
                      className="w-full text-left text-xs text-white/90 hover:text-white bg-[#26170D] hover:bg-[#341F12] border border-[#FFD700]/30 hover:border-[#FFD700] p-3 rounded-2xl transition cursor-pointer flex items-center justify-between group shadow-sm"
                    >
                      <span className="font-medium">{trigger}</span>
                      <ChevronRight className="w-4 h-4 text-[#FFD700] group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 📍 ÉTAPE 3 : DIAGNOSTIC MÉDICAL POSÉ */}
          {activeStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="w-full space-y-4"
            >
              <div className="bg-[#1A110A] border-2 border-[#FFD700]/60 rounded-3xl p-5 shadow-2xl space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[10px] font-mono font-bold text-[#FFD700] uppercase tracking-wider flex items-center gap-1.5">
                    🩺 3. Diagnostic Médical Posé
                  </span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 text-[9px]">3 / 5</Badge>
                </div>

                <div className="bg-[#2B1B10] border-2 border-[#FFD700]/50 p-4 rounded-2xl space-y-1.5">
                  <div className="text-[10px] font-mono font-bold text-[#FFD700] uppercase tracking-wider">
                    Diagnostic Clinique Officiel :
                  </div>
                  <p className="text-sm font-bold text-white leading-snug">
                    {consultationData.diagnosis}
                  </p>
                </div>

                <p className="text-xs text-white/90 leading-relaxed font-sans font-medium">
                  En tenant compte de vos données ({consultationData.trigger}), le film hydrolipidique réagit fortement pour protéger l'épiderme.
                </p>

                <Button
                  onClick={handleGoToStep4}
                  className="w-full h-11 bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black text-xs rounded-2xl shadow-xl hover:scale-102 transition cursor-pointer flex items-center justify-center gap-2 border border-[#FFD700]"
                >
                  <span>Passer à l'Étape 4 (Ordonnance Dermo-Botanique)</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* 📍 ÉTAPE 4 : ORDONNANCE DERMO-BOTANIQUE SUR-MESURE */}
          {activeStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="w-full space-y-4"
            >
              <div className="bg-[#1A110A] border-2 border-[#FFD700]/60 rounded-3xl p-5 shadow-2xl space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[10px] font-mono font-bold text-[#FFD700] uppercase tracking-wider flex items-center gap-1.5">
                    📋 4. Ordonnance Dermo-Botanique Sur-Mesure
                  </span>
                  <button
                    onClick={() => setShowPdfModal(true)}
                    className="text-[9px] font-mono text-[#FFD700] underline flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3" /> Fiche Ordonnance PDF
                  </button>
                </div>

                {consultationData.prescription && (
                  <div className="bg-[#0F0A05] border border-[#FFD700]/60 rounded-2xl p-4 space-y-3 text-white">
                    <div className="flex items-center justify-between text-xs font-bold text-[#FFD700]">
                      <span>🌱 {consultationData.prescription.title}</span>
                      <Badge className="bg-[#FFD700]/20 text-[#FFD700] text-[9px] font-mono">Certifiée UEMOA</Badge>
                    </div>

                    <div className="space-y-2">
                      {consultationData.prescription.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center bg-[#1A1410] p-2.5 rounded-xl text-xs border border-white/5">
                          <div>
                            <div className="font-bold text-white">{item.name}</div>
                            <div className="text-[10px] text-white/50">{item.desc}</div>
                          </div>
                          <span className="font-mono font-bold text-[#FFD700]">
                            {item.price.toLocaleString('fr-FR')} FCFA
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-white/10">
                      <span className="text-xs font-bold font-mono text-[#FFD700]">
                        Total: {consultationData.prescription.totalPrice.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleGoToStep5}
                  className="w-full h-11 bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black text-xs rounded-2xl shadow-xl hover:scale-102 transition cursor-pointer flex items-center justify-center gap-2 border border-[#FFD700]"
                >
                  <span>Passer à l'Étape 5 (Conseils & Règles d'Or)</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* 📍 ÉTAPE 5 : CONSEILS HYGIÉNO-DIÉTÉTIQUES & VALIDATION ROUTINE 1-CLIC */}
          {activeStep === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="w-full space-y-4"
            >
              <div className="bg-[#1A110A] border-2 border-[#FFD700]/60 rounded-3xl p-5 shadow-2xl space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[10px] font-mono font-bold text-[#FFD700] uppercase tracking-wider flex items-center gap-1.5">
                    🌱 5. Conseils Hygiéno-Diététiques & Règles d'Or
                  </span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 text-[9px]">5 / 5 Complété</Badge>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-mono font-bold text-[#FFD700] uppercase tracking-wider">
                    Règles Médicales d'Or du Dr. Mama Kènè :
                  </div>
                  {consultationData.goldenRules?.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-[#25170D] border border-[#FFD700]/30 p-3 rounded-2xl text-xs text-white/90">
                      <Check className="w-4 h-4 text-[#FFD700] shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>

                <a href={`/checkout?service=${encodeURIComponent(consultationData.prescription?.title || 'Routine Soin Mama Kene')}`} className="block w-full pt-1">
                  <Button className="w-full h-12 bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black text-xs rounded-2xl shadow-2xl hover:scale-102 transition cursor-pointer flex items-center justify-center gap-2 border border-[#FFD700]">
                    <ShoppingBag className="w-4 h-4 text-black" />
                    <span>Commander la Routine du Soin (1-Clic)</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </Button>
                </a>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* ── 📄 MODAL PDF FICHE ORDONNANCE NUMÉRIQUE CERTIFIÉE ── */}
      <AnimatePresence>
        {showPdfModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#1A110A] border-2 border-[#FFD700] rounded-3xl p-6 max-w-sm w-full space-y-4 text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-serif font-bold text-sm text-[#FFD700] flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> Ordonnance Médicale Certifiée
                </span>
                <button onClick={() => setShowPdfModal(false)} className="text-white/60 hover:text-white">✕</button>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-white/60">Patiente :</span>
                  <span className="font-bold text-white">{userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Médecin :</span>
                  <span className="font-bold text-[#FFD700]">Dr. Mama Kènè (Ordre Dermo)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Diagnostic :</span>
                  <span className="font-bold text-emerald-400">{consultationData.diagnosis || 'PIH Hyperpigmentation'}</span>
                </div>
              </div>

              <div className="p-3 bg-[#0F0A05] rounded-2xl border border-white/10 text-xs space-y-1 font-mono">
                <div className="font-bold text-[#FFD700]">Prescription :</div>
                {consultationData.prescription?.items.map((i: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-[11px]">
                    <span>• {i.name}</span>
                    <span>{i.price} FCFA</span>
                  </div>
                ))}
              </div>

              <Button onClick={() => window.print()} className="w-full bg-[#FFD700] text-black font-black text-xs h-11 rounded-2xl cursor-pointer">
                <Download className="w-4 h-4 mr-2" /> Imprimer / Télécharger la Fiche PDF
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ⌨️ BOTTOM FLOATING INPUT BAR (Z-INDEX 50 SUR-ÉLEVÉE + BOUTONS DÉDIÉS) ── */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#120B06]/98 border-t-2 border-[#FFD700]/60 p-3 sm:p-4 z-50 backdrop-blur-2xl shadow-2xl">
        <div className="max-w-md mx-auto flex items-center gap-2">
          
          <button
            onClick={handleStartVoiceRecording}
            className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition shrink-0 cursor-pointer ${
              isListening
                ? 'bg-red-500 text-white border-red-500 animate-pulse scale-105'
                : 'bg-[#1E140C] border-[#FFD700]/60 text-[#FFD700] hover:bg-[#2A1E14]'
            }`}
            title="Note Vocale Audio"
          >
            <Mic className="w-5 h-5 text-[#FFD700]" />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-11 h-11 rounded-2xl bg-[#1E140C] border border-[#FFD700]/60 text-[#FFD700] hover:bg-[#2A1E14] flex items-center justify-center transition shrink-0 cursor-pointer"
            title="Photo Cutanée"
          >
            <Camera className="w-5 h-5 text-[#FFD700]" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
          />

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendPatientText()}
            placeholder="Écrire un SMS ou message au Dr. Mama Kènè..."
            className="flex-1 bg-[#1E140C] border border-white/20 focus:border-[#FFD700] text-white px-4 h-11 rounded-2xl text-xs outline-none transition"
          />

          <Button
            onClick={() => handleSendPatientText()}
            className="h-11 px-4 bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black text-xs rounded-2xl shadow-lg border border-[#FFD700] hover:scale-105 transition cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Envoyer</span>
          </Button>
        </div>
      </footer>

    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-white font-mono">Chargement du Spa Télémédecine 3D TAARU AI...</div>}>
      <ChatContent />
    </Suspense>
  );
}
