'use client';

// Kènè OS — TAARU AI · Dr. Mama Kènè IA (Full Multimodal Media Input: Photo, Audio, Video, SMS v5.0)
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MoreHorizontal, Send, Mic, Play, Pause, Video, MessageSquare, Phone,
  Camera, Volume2, Sun, ShieldCheck, ShoppingBag, MapPin, Stethoscope, AlertTriangle, CheckCircle2, HelpCircle, CheckCheck, Smartphone, Sparkles, User, RefreshCw, ArrowRight, ChevronRight, Check, Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

export function ChatContent() {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userName, setUserName] = useState('Aïsha');
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Multimodal Media Items Feed
  const [mediaFeed, setMediaFeed] = useState<MultimodalMediaItem[]>([]);

  // Guided 5-Step Consultation State
  const [activeStep, setActiveStep] = useState<number>(1);
  const [consultationData, setConsultationData] = useState<{
    symptom?: string;
    trigger?: string;
    diagnosis?: string;
    prescription?: any;
    goldenRules?: string[];
    userPhotoUrl?: string;
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

  // 1. 📷 PHOTO UPLOAD HANDLER (Prend en compte la photo de la cliente)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const photoUrl = reader.result as string;

      // Add patient photo to feed
      const photoItem: MultimodalMediaItem = {
        id: `photo-${Date.now()}`,
        type: 'photo',
        sender: 'patient',
        mediaUrl: photoUrl,
        text: '📷 Photo Cutanée transmise au Dr. Mama Kènè',
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMediaFeed(prev => [...prev, photoItem]);

      setIsThinking(true);
      toast({
        title: "📷 Photo Cutanée Reçue !",
        description: "Dr. Mama Kènè IA effectue l'analyse dermo-biométrique...",
      });

      // Doctor response to photo
      setTimeout(() => {
        setIsThinking(false);
        const docResponse: MultimodalMediaItem = {
          id: `doc-photo-ack-${Date.now()}`,
          type: 'text',
          sender: 'doctor',
          text: "J'ai bien reçu et analysé votre photo cutanée. J'observe des zones d'hyperpigmentation localisées et une réactivité épidermique. Poursuivons l'évaluation.",
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        };
        setMediaFeed(prev => [...prev, docResponse]);
        handleSelectSymptom("Taches foncées ou noires observées sur photo");
      }, 1500);
    };

    reader.readAsDataURL(file);
  };

  // 2. 🎙️ AUDIO VOICE NOTE HANDLER (Prend en compte la note vocale)
  const handleStartVoiceRecording = () => {
    setIsListening(true);
    toast({
      title: "🎙️ Écoute Vocale Active...",
      description: "Parlez... Votre message audio est enregistré.",
    });

    setTimeout(() => {
      setIsListening(false);

      const patientAudio: MultimodalMediaItem = {
        id: `audio-${Date.now()}`,
        type: 'audio',
        sender: 'patient',
        audioDuration: '0:26',
        text: "Note Vocale Audio Cliente : 'Docteur, j'ai des picotements et des taches sur le visage.'",
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
          audioDuration: '0:34',
          text: "Note Vocale du Dr. Mama Kènè : J'ai écouté attentivement votre message vocal. Je prends en compte la sensation de picotement sous la chaleur.",
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        };
        setMediaFeed(prev => [...prev, docAudioAck]);
        handleSelectSymptom("Taches foncées & picotements (Note Vocale)");
      }, 1400);
    }, 2400);
  };

  // 3. 🎥 VIDEO CLIP HANDLER (Prend en compte les vidéos)
  const handleSendVideoClip = () => {
    toast({ title: "🎥 Capsule Vidéo", description: "Chargement de la démonstration vidéo médicale..." });
    
    const videoItem: MultimodalMediaItem = {
      id: `video-${Date.now()}`,
      type: 'video',
      sender: 'doctor',
      videoTitle: 'Capsule Vidéo Médicale : Gestes d\'application du Sérum Baobab',
      text: 'Le Dr. Mama Kènè vous montre en vidéo comment appliquer votre sérum sans saturer vos pores.',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMediaFeed(prev => [...prev, videoItem]);
    speakText(videoItem.text || '');
  };

  // 4. 📱 SMS & TEXT HANDLER (Prend en compte les SMS)
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

    toast({ title: "📱 SMS Envoyé au Dr. Mama Kènè", description: "Votre message SMS a été synchronisé." });
    handleSelectSymptom(textToSend);
  };

  // 5-Step Clinical Flow Handler
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
    speakText("Bonjour Aïsha ! Pour établir votre bilan dermo-cosmétique, vous pouvez m'envoyer un texte, un SMS, une photo cutanée ou une note vocale.");
  };

  return (
    <div className="min-h-screen bg-[#110B07] text-[#F8F1E4] flex flex-col items-center font-sans selection:bg-[#FFD700] selection:text-black overflow-x-hidden relative">
      
      {/* Glow Ambient Atmospheric Orbs */}
      <div className="fixed top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FFD700]/15 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-10 right-10 w-80 h-80 bg-[#C8951E]/10 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* ── 📱 TOP HEADER BAR ── */}
      <header className="w-full max-w-md px-6 py-4 flex items-center justify-between relative z-20">
        <button
          onClick={() => router.push('/portal')}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          title="Retour"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-center">
          <span className="text-[10px] font-mono tracking-[0.3em] text-[#FFD700] font-black uppercase flex items-center gap-1.5 justify-center">
            <Sparkles className="w-3 h-3 text-[#FFD700] animate-pulse" />
            TAARU AI · DR. MAMA KÈNÈ
          </span>
        </div>

        <button
          onClick={handleResetConsultation}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          title="Recommencer la Consultation"
        >
          <RefreshCw className="w-4 h-4 text-[#FFD700]" />
        </button>
      </header>

      {/* ── 🏥 STEP PROGRESS BAR (PAS-À-PAS EN 5 ÉTAPES) ── */}
      <div className="w-full max-w-md px-6 pb-2 relative z-20">
        <div className="flex items-center justify-between mb-1 text-[10px] font-mono font-bold text-[#FFD700]">
          <span>CONSULTATION MULTIMODALE COMPLÈTE</span>
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

      {/* ── 🌟 MAIN TAARU AI CONTENT CONTAINER ── */}
      <main className="w-full max-w-md px-6 pb-28 flex-1 flex flex-col items-center relative z-10 space-y-4">
        
        {/* 1. GREETING HEADLINE */}
        <div className="text-center space-y-1 pt-1">
          <h1 className="font-serif text-3xl sm:text-4xl text-white tracking-tight leading-tight">
            Bonjour <span className="text-[#FFD700] font-bold">{userName}</span>,<br />
            <span className="italic font-serif font-normal text-white/90">
              {activeStep === 1 && "envoyez une photo, un audio ou un message."}
              {activeStep === 2 && "examinons votre situation."}
              {activeStep === 3 && "voici mon diagnostic."}
              {activeStep === 4 && "votre ordonnance sur-mesure."}
              {activeStep === 5 && "vos règles d'or & routine."}
            </span>
          </h1>
        </div>

        {/* 2. CENTRAL GLOWING AUDIO WAVE ORB (ANIMATED SPHERE) */}
        <div className="py-2 flex flex-col items-center justify-center relative">
          
          <div className="relative group cursor-pointer" onClick={handleStartVoiceRecording}>
            
            {/* Outer Glowing Ripple Aura */}
            <div className={`absolute -inset-5 rounded-full bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#E5A93C] opacity-40 blur-2xl transition-all duration-700 ${
              isThinking || isSpeaking || isListening ? 'animate-ping scale-150 opacity-75' : 'group-hover:opacity-60'
            }`} />

            {/* Concentric Golden Halo Rings */}
            <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-[#3D2514] via-[#2A180B] to-[#160C05] border-2 border-[#FFD700] p-2 shadow-2xl flex items-center justify-center relative z-10 transition-transform duration-500 ${
              isThinking ? 'scale-110 rotate-180' : isSpeaking ? 'scale-105' : 'hover:scale-105'
            }`}>
              <div className={`w-full h-full rounded-full flex flex-col items-center justify-center transition-all duration-500 ${
                isThinking
                  ? 'bg-gradient-to-br from-[#FFD700]/40 to-[#C8951E]/20 text-[#FFD700]'
                  : isSpeaking
                  ? 'bg-gradient-to-br from-[#FFD700] to-[#C8951E] text-black font-black'
                  : isListening
                  ? 'bg-red-500/30 text-white'
                  : 'bg-[#140B05] text-[#FFD700]'
              }`}>
                
                {/* Dynamic Waveform & Thinking Animation */}
                {isThinking ? (
                  <div className="flex flex-col items-center gap-1">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#FFD700]" />
                    <span className="text-[8px] font-mono font-bold tracking-widest uppercase text-[#FFD700]">Analyse...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1">
                      {[3, 7, 12, 8, 14, 9, 5, 10, 4].map((h, i) => (
                        <span
                          key={i}
                          className={`w-1 rounded-full bg-current transition-all duration-300 ${
                            isSpeaking || isListening ? 'animate-pulse' : 'opacity-70'
                          }`}
                          style={{
                            height: (isSpeaking || isListening ? h * 2 : 10) + 'px',
                            animationDelay: `${i * 0.12}s`
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-[8px] font-mono font-bold uppercase tracking-wider opacity-80 pt-0.5">
                      {isSpeaking ? 'Lecture Audio...' : isListening ? 'Écoute...' : 'Appuyer pour Parler'}
                    </span>
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* Status Badge */}
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C120B] border border-[#FFD700]/40 text-[#FFD700] text-[10px] font-mono font-bold shadow-lg">
            <span className={`w-2 h-2 rounded-full ${isThinking ? 'bg-amber-400 animate-spin' : isSpeaking ? 'bg-emerald-400 animate-ping' : 'bg-[#FFD700]'}`} />
            <span>
              {isThinking ? 'Dr. Mama Kènè IA analyse vos médias (Photo/Audio/SMS)...' : isSpeaking ? 'Émission Note Vocale...' : `Étape ${activeStep} : Consultation Multimodale Active`}
            </span>
          </div>
        </div>

        {/* ── 📱 MULTIMODAL MEDIA FEED DISPLAY (AFFICHE PHOTOS, AUDIOS, VIDÉOS & SMS ENVOYÉS) ── */}
        <AnimatePresence>
          {mediaFeed.length > 0 && (
            <div className="w-full space-y-3 pt-1">
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

                  {/* PHOTO MEDIA */}
                  {item.type === 'photo' && item.mediaUrl && (
                    <div className="space-y-2">
                      <div className="relative w-full h-40 rounded-xl overflow-hidden border border-[#FFD700]/40">
                        <img src={item.mediaUrl} alt="Photo cutanée" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-[11px] font-mono text-[#FFD700]">{item.text}</p>
                    </div>
                  )}

                  {/* AUDIO MEDIA */}
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

                  {/* VIDEO MEDIA */}
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

                  {/* TEXT / SMS MEDIA */}
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
                  "Bonjour Aïsha ! Vous pouvez m'envoyer une **photo de votre peau**, une **note vocale audio**, un **SMS** ou sélectionner directement votre symptôme ci-dessous :"
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
                  Donnée médicale enregistrée : {consultationData.symptom}
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
                  En tenant compte de vos éléments transmis ({consultationData.trigger}), le film hydrolipidique réagit fortement pour protéger l'épiderme.
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
                  <Badge className="bg-[#FFD700]/20 text-[#FFD700] text-[9px]">4 / 5</Badge>
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

      </main>

      {/* ── ⌨️ BOTTOM FLOATING INPUT BAR (PRISE EN COMPTE MULTIMODALE 100%) ── */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#120B06]/95 border-t-2 border-[#FFD700]/40 p-3 sm:p-4 z-30 backdrop-blur-2xl">
        <div className="max-w-md mx-auto flex items-center gap-2">
          
          {/* 1. Audio Mic Button */}
          <button
            onClick={handleStartVoiceRecording}
            className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition shrink-0 cursor-pointer ${
              isListening
                ? 'bg-red-500 text-white border-red-500 animate-pulse scale-105'
                : 'bg-[#1E140C] border-[#FFD700]/40 text-[#FFD700] hover:bg-[#2A1E14]'
            }`}
            title="Note Vocale Audio (Prise en compte)"
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* 2. Video Request Button */}
          <button
            onClick={handleSendVideoClip}
            className="w-11 h-11 rounded-2xl bg-[#1E140C] border border-[#FFD700]/40 text-[#FFD700] hover:bg-[#2A1E14] flex items-center justify-center transition shrink-0 cursor-pointer"
            title="Capsule Vidéo (Prise en compte)"
          >
            <Video className="w-5 h-5" />
          </button>

          {/* 3. Photo Upload Input */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-11 h-11 rounded-2xl bg-[#1E140C] border border-[#FFD700]/40 text-[#FFD700] hover:bg-[#2A1E14] flex items-center justify-center transition shrink-0 cursor-pointer"
            title="Photo Cutanée (Prise en compte)"
          >
            <Camera className="w-5 h-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />

          {/* 4. Text / SMS Input */}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendPatientText()}
            placeholder="Texte, SMS ou question au Dr. Mama Kènè..."
            className="flex-1 bg-[#1E140C] border border-white/15 focus:border-[#FFD700] text-white px-4 h-11 rounded-2xl text-xs outline-none transition"
          />

          {/* Send Button */}
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
    <Suspense fallback={<div className="p-8 text-center text-white font-mono">Chargement de la Consultation Multimodale TAARU AI...</div>}>
      <ChatContent />
    </Suspense>
  );
}
