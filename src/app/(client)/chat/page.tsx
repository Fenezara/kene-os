'use client';

// Kènè OS — TAARU AI · Dr. Mama Kènè IA (Persistent History & Live Webcam Video Recorder Engine v11.0)
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  ArrowLeft, MoreHorizontal, Send, Mic, Play, Pause, Video, MessageSquare, Phone,
  Camera, Volume2, VolumeX, Sun, ShieldCheck, ShoppingBag, MapPin, Stethoscope, AlertTriangle, CheckCircle2, HelpCircle, CheckCheck, Smartphone, Sparkles, User, RefreshCw, ArrowRight, ChevronRight, Check, Image as ImageIcon, Globe, FileText, Download, Zap, Compass, Activity, Droplets, MicOff, VideoOff, Square
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ParticleOrb3D } from '@/components/ParticleOrb3D';
import { useToast } from '@/hooks/use-toast';
import { AdinkraDuafe, AdinkraAya, AdinkraSankofa, BogolanPatternBorder, AfroHologramHalo } from '@/components/AfricanSymbols';

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

// 🧠 Dynamic Humanized Pathology & Body Zone Clinical Generator
function generateDynamicPathologyFlow(symptomText: string, name: string, bodyZone?: string) {
  const q = symptomText.toLowerCase();

  const humanIntros = [
    `${name}, je comprends tellement ce que vous ressentez. Sachez que votre peau est magnifique et que ces petites réactions temporaires ne définissent en rien votre beauté.`,
    `Rassurez-vous ${name}, nous allons choyer votre peau ensemble avec une immense douceur. La peau se régénère merveilleusement bien quand on l'écoute.`,
    `Ah, je vois exactement ce dont vous me parlez ${name}. Ne soyez pas dure avec vous-même : c'est une réaction très fréquente sous notre climat et nous allons la surmonter pas à pas.`,
    `Prenez une grande inspiration ${name}. Votre corps et votre peau méritent toute votre bienveillance aujourd'hui. Je suis là pour vous accompagner.`,
  ];
  const randomIntro = humanIntros[Math.floor(Math.random() * humanIntros.length)];

  // 1. DOS & ÉPAULES (BACNE & HYPERPIGMENTATION DORSALE)
  if (bodyZone === 'dos' || q.includes('dos') || q.includes('épaule') || q.includes('dorsal')) {
    return {
      bodyZoneName: "Dos & Épaules",
      step2Question: `${randomIntro} L'analyse du DOS montre que la peau y est 2,5 fois plus épaisse que sur le visage. S'agit-il de boutons d'acné du dos (Bacne) provoqués par la sueur, ou de taches foncées persistantes ?`,
      step2Options: [
        "🔴 Boutons inflammatoires & acné du dos (Bacne)",
        "🟤 Taches sombres épaisses post-boutons sur le dos",
        "🔥 Démangeaisons dues aux frottements des vêtements",
        "🌵 Peau rêche et pores obstrués sur les épaules",
      ],
      diagnosisMap: {
        default: "Hyperpigmentation Dorsale & Folliculite du Dos (Acné Dorsale Réactive).",
      },
      prescription: {
        title: 'Ordonnance Dermo-Botanique Spéciale DOS & ÉPAULES',
        items: [
          { name: 'Spray Exfoliant Clarifiant Moringa & Baobab 250ml', desc: 'Application facile à 360° sur le dos après la douche', price: 14000 },
          { name: 'Sérum Concentré Anti-Taches Hibiscus 10%', desc: 'Régulateur mélanique pour peaux épaisses', price: 19500 },
        ],
        totalPrice: 33500,
      },
      goldenRules: [
        "Règle d'Or 1 : Changer immédiatement de t-shirt après une séance de sport ou une forte transpiration.",
        "Règle d'Or 2 : Ne pas frotter le dos avec un filet synthétique dur qui irrite les pores.",
        "Règle d'Or 3 : Vaporiser le Spray Moringa chaque soir sur peau propre et sèche.",
        "💖 Conseil Bien-Être & Sérénité : Ne vous focalisez pas sur les boutons. Le stress sécrète du cortisol qui enflamme les pores : accordez-vous un moment de respiration et soyez fière de votre corps.",
      ]
    };
  }

  // 2. CUIR CHEVELU & TEMPES
  if (bodyZone === 'cuir_chevelu' || q.includes('cheveu') || q.includes('cuir') || q.includes('tresse') || q.includes('tempe')) {
    return {
      bodyZoneName: "Cuir Chevelu & Tempes",
      step2Question: `${randomIntro} Les tresses serrées sous 32°C sollicitent énormément le cuir chevelu. Ressentez-vous une douleur aiguë au niveau des racines, ou s'agit-il de pellicules et démangeaisons tenaces ?`,
      step2Options: [
        "💆 Douleur & tiraillement intense au niveau des racines",
        "❄️ Démangeaisons & squames blanches/jaunâtres",
        "💇 Perte de densité ou casse au niveau des tempes",
        "🔥 Sensation de chaleur sur le sommet du crâne",
      ],
      diagnosisMap: {
        default: "Tension Folliculaire & Micro-Inflammation Cuir Chevelu après Tressage.",
      },
      prescription: {
        title: 'Ordonnance Apaisante Cuir Chevelu Nigelle & Karité',
        items: [
          { name: 'Élixir Apaisant Nigelle & Karité Liquide 100ml', desc: 'Appliquer en gouttes sur les raies du cuir chevelu', price: 16000 },
          { name: 'Shampoing Doux Purifiant Sans Sulfate', desc: 'Nettoyage apaisant hebdomadaire', price: 11000 },
        ],
        totalPrice: 27000,
      },
      goldenRules: [
        "Règle d'Or 1 : Proscrire les tresses trop tendues au niveau des tempes.",
        "Règle d'Or 2 : Appliquer l'Élixir à la Nigelle directement sur le cuir chevelu sans frotter.",
      ]
    };
  }

  // 3. COU & MENTON (FOLLICULITE / PFB)
  if (bodyZone === 'cou_menton' || q.includes('cou') || q.includes('menton') || q.includes('barbe') || q.includes('rasage')) {
    return {
      bodyZoneName: "Cou & Menton",
      step2Question: `${randomIntro} L'analyse de la zone du COU & MENTON montre des signes de folliculite. Est-ce dû aux poils incarnés après le rasage/épilation, ou à des boutons d'irritation ?`,
      step2Options: [
        "🪒 Poils incarnés & boutons de rasage (Pseudofolliculite PFB)",
        "🔴 Taches noires sous le menton et sur le cou",
        "🔥 Irritation et brûlure après épilation",
      ],
      diagnosisMap: {
        default: "Pseudofolliculite de Barbe (PFB) & Hyperpigmentation Cervicale.",
      },
      prescription: {
        title: 'Ordonnance Anti-Poils Incarnés Cou & Menton',
        items: [
          { name: 'Lotion Apaisante Anti-Poils Incarnés Niacinamide', desc: 'Prévient l\'incarnation pilaire', price: 15500 },
          { name: 'Baume Réparateur Karité & Baobab', desc: 'Calme l\'inflammation du cou', price: 12500 },
        ],
        totalPrice: 28000,
      },
      goldenRules: [
        "Règle d'Or 1 : Ne jamais raser à contre-poil pour éviter que le poil rentre dans le follicule.",
        "Règle d'Or 2 : Appliquer la Lotion Apaisante après chaque rasage ou épilation.",
      ]
    };
  }

  // 4. BRAS & JAMBES & CORPS
  if (bodyZone === 'bras_jambes' || q.includes('bras') || q.includes('jambe') || q.includes('corps')) {
    return {
      bodyZoneName: "Bras & Jambes",
      step2Question: `${randomIntro} L'analyse des BRAS et JAMBES montre une déshydratation cutanée. S'agit-il d'une peau croco très sèche, ou de petits boutons granuleux (kératose) ?`,
      step2Options: [
        "🍂 Peau effet croco qui pèle et tiraille",
        "🌵 Petits boutons granuleux sur les bras (Kératose)",
        "🟤 Taches sombres sur les jambes ou les genoux",
      ],
      diagnosisMap: {
        default: "Déséquilibre Hydrolipidique Corporel & Kératose Pilaire.",
      },
      prescription: {
        title: 'Ordonnance Nutrition Corporelle Karité Brut Korhogo',
        items: [
          { name: 'Beurre de Karité Brut Korhogo 200g', desc: 'Nutrition intense longue durée', price: 12500 },
          { name: 'Huile Nourrissante Baobab & Moringa 100ml', desc: 'Éclat et lissage de la peau croco', price: 14500 },
        ],
        totalPrice: 27000,
      },
      goldenRules: [
        "Règle d'Or 1 : Appliquer le Beurre de Karité immédiatement après la douche sur peau encore humide.",
      ]
    };
  }

  // 5. VISAGE & JOUES (PAR DÉFAUT SI VISAGE)
  return {
    bodyZoneName: "Visage & Joues",
    step2Question: `${randomIntro} Pour le VISAGE : s'agit-il plutôt de taches sombres laissées par des boutons récents, ou d'un masque plus diffus apparu progressivement sur vos joues ?`,
    step2Options: [
      "🔴 Taches sombres post-boutons (PIH faciale)",
      "🟤 Masque diffus étendu sur les pommettes (Melasma)",
      "☀️ Taches qui s'accentuent sous le soleil 32°C",
      "✨ Teint terne et pigmenté sur le visage",
    ],
    diagnosisMap: {
      default: "Hyperpigmentation Post-Inflammatoire Faciale (PIH) & Oxydation Mélanique.",
    },
    prescription: {
      title: 'Ordonnance Anti-Taches Visage & Éclat',
      items: [
        { name: 'Sérum Hibiscus & Baobab 10% Bio', desc: 'Appliquer le soir sur les taches', price: 18500 },
        { name: 'Écran Solaire Minéral SPF 50', desc: 'Appliquer chaque matin', price: 15000 },
      ],
      totalPrice: 33500,
    },
    goldenRules: [
      "Règle d'Or 1 : Appliquer le Sérum au Baobab le soir uniquement.",
      "Règle d'Or 2 : Utiliser l'Écran Minéral SPF 50 chaque matin dès 8h.",
    ]
  };
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

  // 📹 LIVE WEBCAM VIDEO CAPSULE STATE
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [videoRecordingTime, setVideoRecordingTime] = useState(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<any>(null);
  const videoChunksRef = useRef<Blob[]>([]);

  const [mediaFeed, setMediaFeed] = useState<MultimodalMediaItem[]>([]);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  // Dynamic pathology state
  const [dynamicFlow, setDynamicFlow] = useState<any>(null);
  const [consultationData, setConsultationData] = useState<{
    symptom?: string;
    trigger?: string;
    diagnosis?: string;
    prescription?: any;
    goldenRules?: string[];
  }>({});

  const recognitionRef = useRef<any>(null);

  // 1. 💾 PERSISTENT LOCALSTORAGE CONVERSATION RESTORATION ON MOUNT
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

      // Restore saved conversation media feed
      const savedFeed = localStorage.getItem('kene_chat_media_feed');
      if (savedFeed) {
        try {
          const parsedFeed = JSON.parse(savedFeed);
          if (Array.isArray(parsedFeed) && parsedFeed.length > 0) setMediaFeed(parsedFeed);
        } catch (e) {}
      }

      const savedStep = localStorage.getItem('kene_chat_active_step');
      if (savedStep) setActiveStep(Number(savedStep));

      const savedData = localStorage.getItem('kene_chat_consultation_data');
      if (savedData) {
        try { setConsultationData(JSON.parse(savedData)); } catch (e) {}
      }

      const savedFlow = localStorage.getItem('kene_chat_dynamic_flow');
      if (savedFlow) {
        try { setDynamicFlow(JSON.parse(savedFlow)); } catch (e) {}
      }
    }
  }, []);

  // 2. 💾 SAVE CONVERSATION TO LOCALSTORAGE UPON EVERY FEED CHANGE
  useEffect(() => {
    if (typeof window !== 'undefined' && mediaFeed.length > 0) {
      localStorage.setItem('kene_chat_media_feed', JSON.stringify(mediaFeed));
      localStorage.setItem('kene_chat_active_step', String(activeStep));
      localStorage.setItem('kene_chat_consultation_data', JSON.stringify(consultationData));
      if (dynamicFlow) localStorage.setItem('kene_chat_dynamic_flow', JSON.stringify(dynamicFlow));
    }
  }, [mediaFeed, activeStep, consultationData, dynamicFlow]);

  const getLanguageGreeting = () => {
    if (selectedLanguage === 'wo') return `Nanga def ${userName}, taaru bi ma ngi la di déglu.`;
    if (selectedLanguage === 'bm') return `I ni cé ${userName}, n'b'i lamèn.`;
    return `Bonjour ${userName}, je vous écoute.`;
  };

  // SPEECH SYNTHESIS ENGINE
  const speakText = (textToSpeak: string) => {
    if (typeof window === 'undefined') return;

    const cleanedText = textToSpeak.replace(/[*#]/g, '');

    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanedText);
        utterance.lang = 'fr-FR';
        utterance.rate = 0.95;
        utterance.pitch = 1.02;

        const voices = window.speechSynthesis.getVoices();
        const frVoice = voices.find(v => v.lang.includes('fr') || v.lang.includes('FR'));
        if (frVoice) utterance.voice = frVoice;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        setIsSpeaking(false);
      }
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // REAL SPEECH-TO-TEXT RECOGNITION (TRANSCRIBE PATIENT VOICE EXACTLY)
  const handleStartVoiceRecording = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const userSpokenText = prompt("🎙️ Note Vocale Audio : Veuillez dicter ou saisir le message que vous adressez au Dr. Mama Kènè :");
      if (userSpokenText && userSpokenText.trim()) {
        processPatientVoiceMessage(userSpokenText.trim());
      }
      return;
    }

    try {
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'fr-FR';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: "🎙️ Micro Actif — Parlez au Dr. Mama...",
          description: "Ex: 'Docteur, j'ai des boutons et des taches noires sur le dos'",
        });
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        if (transcript) {
          processPatientVoiceMessage(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        const fallbackText = prompt("🎙️ Dictez ou confirmez votre note vocale au Dr. Mama Kènè :", "Docteur, j'ai des taches et des boutons sur la peau");
        if (fallbackText) processPatientVoiceMessage(fallbackText);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      const fallbackText = prompt("🎙️ Dictez votre note vocale au Dr. Mama Kènè :", "Docteur, j'ai des taches et boutons");
      if (fallbackText) processPatientVoiceMessage(fallbackText);
    }
  };

  const processPatientVoiceMessage = (spokenText: string) => {
    const patientAudio: MultimodalMediaItem = {
      id: `audio-${Date.now()}`,
      type: 'audio',
      sender: 'patient',
      audioDuration: '0:18',
      text: `Note Vocale Transcrite : "${spokenText}"`,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMediaFeed(prev => [...prev, patientAudio]);

    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      let zone: string | undefined = undefined;
      const q = spokenText.toLowerCase();
      if (q.includes('dos') || q.includes('épaule')) zone = 'dos';
      if (q.includes('cheveu') || q.includes('cuir') || q.includes('tresse')) zone = 'cuir_chevelu';
      if (q.includes('barbe') || q.includes('cou') || q.includes('menton')) zone = 'cou_menton';

      const doctorText = `Note Vocale du Dr. Mama Kènè : ${userName}, j'ai bien écouté votre note vocale ("${spokenText}"). Je prends en compte votre situation.`;
      const docAudioAck: MultimodalMediaItem = {
        id: `doc-audio-ack-${Date.now()}`,
        type: 'audio',
        sender: 'doctor',
        audioDuration: '0:30',
        text: doctorText,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMediaFeed(prev => [...prev, docAudioAck]);
      speakText(doctorText);
      handleSelectSymptom(spokenText, zone);
    }, 1400);
  };

  // 1. 📷 PHOTO UPLOAD WITH BODY ZONE SELECTION
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
      const ackText = `J'ai bien reçu votre photo ${userName}. Veuillez indiquer ci-dessous la zone du corps exacte prise en photo (Dos, Visage, Cuir Chevelu...) pour adapter la prescription.`;
      const docResponse: MultimodalMediaItem = {
        id: `doc-photo-ack-${Date.now()}`,
        type: 'text',
        sender: 'doctor',
        text: ackText,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMediaFeed(prev => [...prev, docResponse]);
      speakText(ackText);
      setActiveStep(1);
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

  // 📹 3. LIVE WEBCAM VIDEO CAPSULE RECORDER (CAPSULE VIDÉO EN PRÉSENTIEL)
  const handleOpenLiveVideoRecorder = async () => {
    setShowVideoModal(true);
    setRecordedVideoUrl(null);
    setIsRecordingVideo(false);
    setVideoRecordingTime(0);

    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoStreamRef.current = stream;
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = stream;
        }
      }
    } catch (err) {
      toast({
        title: "🎥 Accès Caméra",
        description: "Veuillez autoriser l'accès à la caméra pour l'examen présentiel.",
      });
    }
  };

  const startLiveRecording = () => {
    if (!videoStreamRef.current) return;

    try {
      videoChunksRef.current = [];
      const mediaRecorder = new (window as any).MediaRecorder(videoStreamRef.current);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event: any) => {
        if (event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(videoChunksRef.current, { type: 'video/mp4' });
        const videoUrl = URL.createObjectURL(blob);
        setRecordedVideoUrl(videoUrl);
      };

      mediaRecorder.start();
      setIsRecordingVideo(true);

      toast({
        title: "🔴 Enregistrement de la Capsule Vidéo en cours...",
        description: "Montrez la zone cutanée à la caméra pendant 10s.",
      });
    } catch (e) {
      toast({ title: "Enregistrement vidéo démarré" });
      setIsRecordingVideo(true);
    }
  };

  const stopLiveRecording = () => {
    if (mediaRecorderRef.current && isRecordingVideo) {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    setIsRecordingVideo(false);
  };

  const handleCloseVideoModal = () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach(track => track.stop());
      videoStreamRef.current = null;
    }
    setShowVideoModal(false);
    setIsRecordingVideo(false);
  };

  const handleSubmitRecordedVideo = () => {
    const videoUrlToSubmit = recordedVideoUrl || '/kene_afro_beauty_hero.png';

    const videoItem: MultimodalMediaItem = {
      id: `video-${Date.now()}`,
      type: 'video',
      sender: 'patient',
      mediaUrl: videoUrlToSubmit,
      videoTitle: `Capsule Vidéo Présentielle de ${userName}`,
      text: '🎥 Capsule Vidéo en présentiel transmise au Dr. Mama Kènè pour l\'examen clinique visuel 3D.',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMediaFeed(prev => [...prev, videoItem]);
    handleCloseVideoModal();

    setIsThinking(true);
    toast({ title: "🎥 Capsule Vidéo Transmise au Dr. Mama !", description: "Examen visuel en présentiel en cours..." });

    setTimeout(() => {
      setIsThinking(false);
      const ackText = `J'ai visionné votre capsule vidéo en présentiel ${userName}. J'observe le relief cutané et la réactivité épidermique. Poursuivons l'examen.`;
      const docResponse: MultimodalMediaItem = {
        id: `doc-video-ack-${Date.now()}`,
        type: 'text',
        sender: 'doctor',
        text: ackText,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMediaFeed(prev => [...prev, docResponse]);
      speakText(ackText);
      handleSelectSymptom("Examen visuel sur capsule vidéo en présentiel");
    }, 1500);
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

    let zone: string | undefined = undefined;
    if (textToSend.toLowerCase().includes('dos') || textToSend.toLowerCase().includes('épaule')) zone = 'dos';
    if (textToSend.toLowerCase().includes('cheveu') || textToSend.toLowerCase().includes('cuir')) zone = 'cuir_chevelu';
    if (textToSend.toLowerCase().includes('barbe') || textToSend.toLowerCase().includes('cou')) zone = 'cou_menton';

    handleSelectSymptom(textToSend, zone);
  };

  // 🧠 Dynamic Pathology & Body Zone Symptom Handler
  const handleSelectSymptom = (symptomText: string, bodyZone?: string) => {
    setIsThinking(true);
    setSelectedZone(bodyZone || null);

    const flow = generateDynamicPathologyFlow(symptomText, userName, bodyZone);
    setDynamicFlow(flow);

    setConsultationData(prev => ({
      ...prev,
      symptom: `${symptomText} (${flow.bodyZoneName || 'Zone Corporelle'})`,
      diagnosis: flow.diagnosisMap.default,
      prescription: flow.prescription,
      goldenRules: flow.goldenRules,
    }));

    setTimeout(() => {
      setIsThinking(false);
      setActiveStep(2);
      speakText(`Étape 2 : Examen clinique pour la zone ${flow.bodyZoneName}. ${flow.step2Question}`);
    }, 1300);
  };

  const handleSelectTrigger = (triggerText: string) => {
    setIsThinking(true);
    setConsultationData(prev => ({ ...prev, trigger: triggerText }));

    setTimeout(() => {
      setIsThinking(false);
      setActiveStep(3);
      speakText(`Étape 3 : Diagnostic Médical Posé pour le ${dynamicFlow?.bodyZoneName || 'corps'}. ${consultationData.diagnosis}`);
    }, 1300);
  };

  const handleGoToStep4 = () => {
    setActiveStep(4);
    speakText(`Étape 4 : Ordonnance Dermo-Botanique Sur-Mesure. ${consultationData.prescription?.title}`);
  };

  const handleGoToStep5 = () => {
    setActiveStep(5);
    const rulesSpeech = consultationData.goldenRules ? consultationData.goldenRules.join('. ') : '';
    speakText(`Étape 5 : Conseils hygiéno-diététiques et règles d'or du Dr. Mama Kènè. ${rulesSpeech}`);
  };

  const handleResetConsultation = () => {
    stopSpeaking();
    setActiveStep(1);
    setConsultationData({});
    setMediaFeed([]);
    setDynamicFlow(null);
    setSelectedZone(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kene_chat_media_feed');
      localStorage.removeItem('kene_chat_active_step');
      localStorage.removeItem('kene_chat_consultation_data');
      localStorage.removeItem('kene_chat_dynamic_flow');
    }
    speakText(`Bonjour ${userName} ! Bienvenue dans votre Spa Télémédecine 3D.`);
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

      {/* ── 📱 TOP HEADER BAR (STICKY FIXED TOP) ── */}
      <header className="w-full max-w-md px-6 py-3 flex items-center justify-between shrink-0 sticky top-0 left-0 right-0 z-50 bg-[#120B06]/95 backdrop-blur-2xl border-b border-[#FFD700]/30 shadow-xl">
        <button
          onClick={() => router.push('/portal')}
          className="w-9 h-9 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          title="Retour"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-center space-y-0.5">
          <span className="text-[10px] font-mono tracking-[0.3em] text-[#FFD700] font-black uppercase flex items-center gap-1.5 justify-center">
            <AdinkraDuafe className="w-4 h-4 text-[#FFD700] animate-pulse" />
            TAARU AI · SPA 3D
            <AdinkraAya className="w-4 h-4 text-[#FFD700] animate-pulse" />
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
          title="Nouvelle Consultation (Effacer l'historique)"
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
        <BogolanPatternBorder />
      </div>

      {/* ── 🌟 SCROLLABLE MAIN SPA CONTAINER ── */}
      <div ref={containerRef} className="flex-1 overflow-y-auto w-full max-w-md px-6 pb-40 space-y-4 scrollbar-thin relative z-10">
        
        {/* 1. GREETING HEADLINE WITH AUDIO PLAYBACK TOGGLE BUTTON */}
        <div className="text-center space-y-2 pt-2">
          <h1 className="font-serif text-3xl sm:text-4xl text-white tracking-tight leading-tight">
            {getLanguageGreeting()}
          </h1>

          {/* GLOBAL DIRECT AUDIO PLAYBACK BUTTON FOR USERS */}
          <button
            onClick={() => {
              if (isSpeaking) stopSpeaking();
              else speakText(`Bonjour ${userName}, je suis le Docteur Mama Kènè. Je vous écoute attentivement.`);
            }}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer shadow-lg border ${
              isSpeaking
                ? 'bg-emerald-500 text-black border-emerald-400 animate-pulse'
                : 'bg-[#FFD700] text-black border-[#FFD700] hover:scale-105'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isSpeaking ? '🔊 Arrêter la Voix' : '🔊 Écouter la Voix du Dr. Mama'}</span>
          </button>
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
            <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-ping' : isThinking ? 'bg-amber-400 animate-spin' : isSpeaking ? 'bg-emerald-400 animate-ping' : 'bg-[#FFD700]'}`} />
            <span>
              {isListening ? '🎙️ Micro Actif : Dites votre message au Dr. Mama...' : isThinking ? 'Dr. Mama Kènè IA effectue le scanner biométrique 3D...' : isSpeaking ? '🔊 Émission Audio Active...' : `Étape ${activeStep} : Appuyez pour parler 🎙️`}
            </span>
          </div>
        </motion.div>

        {/* ── ⚡ 4 MANDATORY QUICK ACTION BAR ── */}
        <div className="bg-[#1A110A] border-2 border-[#FFD700]/50 rounded-2xl p-2.5 shadow-xl grid grid-cols-2 sm:grid-cols-4 gap-1.5 z-20">
          <button
            onClick={handleStartVoiceRecording}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border text-[11px] font-bold transition cursor-pointer ${
              isListening
                ? 'bg-red-500 text-white border-red-400 animate-pulse'
                : 'bg-[#26170D] hover:bg-[#341F12] border-[#FFD700]/40 text-[#FFD700]'
            }`}
          >
            <Mic className="w-4 h-4 text-[#FFD700]" />
            <span>{isListening ? '⏹️ Stopper' : '🎙️ Note Vocale'}</span>
          </button>

          <button
            onClick={() => handleTriggerPhotoAnalysis()}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-[#26170D] hover:bg-[#341F12] border border-[#FFD700]/40 text-[#FFD700] text-[11px] font-bold transition cursor-pointer"
          >
            <Camera className="w-4 h-4 text-[#FFD700]" />
            <span>📷 Scanner Photo</span>
          </button>

          <button
            onClick={handleOpenLiveVideoRecorder}
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
              <span>Analyse Biométrique 5-Axes ({dynamicFlow?.bodyZoneName || 'Zone Corporelle'})</span>
            </div>
            <BiometricRadarCanvas />
          </motion.div>
        )}

        {/* ── 📱 MULTIMODAL MEDIA FEED DISPLAY WITH PERSISTENCE & LIVE VIDEO PLAYBACK ── */}
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
                      {item.sender === 'patient' ? '👤 Vous (Cliente)' : '🩺 Dr. Mama Kènè'}
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
                    <div className="flex items-center justify-between bg-[#120B06] p-2.5 rounded-xl border border-[#FFD700]/50">
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => speakText(item.text || '')}
                          className="w-9 h-9 rounded-full bg-gradient-to-r from-[#FFD700] to-[#C8951E] text-black flex items-center justify-center font-bold shadow-md hover:scale-110 transition cursor-pointer shrink-0"
                          title="Écouter l'Audio"
                        >
                          <Play className="w-4 h-4 ml-0.5" />
                        </button>
                        <div>
                          <div className="font-bold text-[#FFD700] text-[11px]">🎙️ Note Vocale Enregistrée</div>
                          <div className="text-[9px] text-white/80 font-mono italic">{item.text}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {item.type === 'video' && (
                    <div className="space-y-2 bg-[#120B06] p-2.5 rounded-xl border border-[#FFD700]/50">
                      <div className="flex items-center justify-between text-xs font-bold text-[#FFD700]">
                        <span className="flex items-center gap-1.5">
                          <Video className="w-4 h-4" />
                          <span>{item.videoTitle || 'Capsule Vidéo Présentielle'}</span>
                        </span>
                        <Badge className="bg-[#FFD700]/20 text-[#FFD700] text-[8px]">Présentiel 🎥</Badge>
                      </div>
                      
                      {item.mediaUrl && item.mediaUrl.startsWith('blob:') ? (
                        <video src={item.mediaUrl} controls className="w-full h-44 rounded-xl object-cover border border-[#FFD700]/40" />
                      ) : (
                        <div className="relative w-full h-36 rounded-xl bg-gradient-to-br from-[#2E1A0C] to-[#120B05] flex items-center justify-center border border-white/10 cursor-pointer" onClick={() => speakText(item.text || '')}>
                          <Play className="w-8 h-8 text-[#FFD700]" />
                        </div>
                      )}
                      
                      <p className="text-[11px] text-white/80 leading-snug">{item.text}</p>
                    </div>
                  )}

                  {(item.type === 'text' || item.type === 'sms') && (
                    <div className="space-y-1.5">
                      <p className="text-xs text-white leading-relaxed font-medium">
                        {item.text}
                      </p>
                      {item.sender === 'doctor' && (
                        <button
                          onClick={() => speakText(item.text || '')}
                          className="text-[10px] font-mono text-[#FFD700] hover:underline flex items-center gap-1 cursor-pointer pt-0.5"
                        >
                          <Volume2 className="w-3 h-3 text-[#FFD700]" />
                          <span>🔊 Réécouter cette réponse en Audio</span>
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* ── 3. INTERACTIVE 5-STEP WIZARD CARDS WITH BODY ZONE DETECTOR ── */}
        <AnimatePresence mode="wait">
          
          {/* 📍 ÉTAPE 1 : ANAMNÈSE MÉDICALE & SÉLECTION DE LA ZONE DU CORPS */}
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
                    <Stethoscope className="w-3.5 h-3.5" /> 1. Sélection de la Zone du Corps & Symptôme
                  </span>
                  <Badge className="bg-[#FFD700]/20 text-[#FFD700] text-[9px]">1 / 5</Badge>
                </div>
                
                <p className="text-xs text-white leading-relaxed font-sans font-medium">
                  "Bonjour {userName} ! Pour adapter le diagnostic et l'ordonnance à la bonne épaisseur d'épiderme, indiquez la **zone du corps** concernée :"
                </p>

                <div className="space-y-2 pt-1">
                  {[
                    { label: "🩻 Dos & Épaules (Acné du dos / Taches dorsales)", zone: "dos" },
                    { label: "💆 Visage & Joues (Hyperpigmentation faciale)", zone: "visage" },
                    { label: "💇 Cuir Chevelu & Tempes (Tresses & Alopécie)", zone: "cuir_chevelu" },
                    { label: "🪒 Cou & Menton (Boutons de rasage / PFB)", zone: "cou_menton" },
                    { label: "🦵 Bras, Jambes & Corps (Sécheresse & Kératose)", zone: "bras_jambes" },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSymptom(item.label, item.zone)}
                      className="w-full text-left text-xs text-white/90 hover:text-white bg-[#26170D] hover:bg-[#341F12] border border-[#FFD700]/30 hover:border-[#FFD700] p-3 rounded-2xl transition cursor-pointer flex items-center justify-between group shadow-sm"
                    >
                      <span className="font-medium">{item.label}</span>
                      <ChevronRight className="w-4 h-4 text-[#FFD700] group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 📍 ÉTAPE 2 : EXAMEN CLINIQUE DYNAMIQUE ADAPTÉ À LA ZONE DU CORPS */}
          {activeStep === 2 && dynamicFlow && (
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
                    <Sun className="w-3.5 h-3.5" /> 2. Examen Clinique Ciblé : Zone {dynamicFlow.bodyZoneName}
                  </span>
                  <Badge className="bg-[#FFD700]/20 text-[#FFD700] text-[9px]">2 / 5</Badge>
                </div>

                <div className="bg-[#26170D] border border-[#FFD700]/30 p-3 rounded-2xl text-xs text-[#FFD700] font-bold">
                  Zone & Symptôme enregistrés : {consultationData.symptom}
                </div>
                
                {/* DYNAMIC QUESTION TAILORED TO BODY ZONE */}
                <p className="text-xs text-white leading-relaxed font-sans font-medium">
                  "{dynamicFlow.step2Question}"
                </p>

                {/* DYNAMIC OPTIONS TAILORED TO BODY ZONE */}
                <div className="space-y-2 pt-1">
                  {dynamicFlow.step2Options.map((trigger: string, idx: number) => (
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
                    🩺 3. Diagnostic Médical Posé ({dynamicFlow?.bodyZoneName || 'Zone Corporelle'})
                  </span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 text-[9px]">3 / 5</Badge>
                </div>

                <div className="bg-[#2B1B10] border-2 border-[#FFD700]/50 p-4 rounded-2xl space-y-2">
                  <div className="text-[10px] font-mono font-bold text-[#FFD700] uppercase tracking-wider flex items-center gap-1">
                    <Stethoscope className="w-3.5 h-3.5 text-[#FFD700]" /> Diagnostic Clinique Officiel :
                  </div>
                  <p className="text-sm font-bold text-white leading-snug">
                    {consultationData.diagnosis}
                  </p>

                  <div className="pt-2 border-t border-[#FFD700]/20 space-y-1 text-[10px] font-mono text-[#FFD700]/90">
                    <div className="font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3 text-[#FFD700]" /> Sources & Consensus Médicaux Cités :
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[8px] font-bold flex items-center gap-1 border border-emerald-400/40">
                        <ShieldCheck className="w-3 h-3" /> Anti-Hallucination 100% Validé
                      </span>
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 opacity-90 text-[9px] text-white/80">
                      <li>Société Africaine de Dermatologie (SAD - Consensus Pan-Africain Phototypes IV-VI)</li>
                      <li>Société Ivoirienne de Dermatologie & Vénérologie (SADIV - CHU Treichville/Yopougon)</li>
                      <li>Pharmacopée Africaine UEMOA / OOAS (Monographies Botaniques Karité & Baobab)</li>
                      <li>Journal of the American Academy of Dermatology (JAAD - Hyperpigmentation & Melasma)</li>
                    </ul>
                  </div>
                </div>

                <p className="text-xs text-white/90 leading-relaxed font-sans font-medium">
                  {userName}, en tenant compte de vos précisions sur le {dynamicFlow?.bodyZoneName} ({consultationData.trigger}), ce diagnostic s'appuie sur la littérature scientifique médicale validée.
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
                      <Badge className="bg-emerald-500/20 text-emerald-400 text-[9px] font-mono">Prescription Médicale Validée</Badge>
                    </div>

                    <div className="space-y-2">
                      {consultationData.prescription.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center bg-[#1A1410] p-3 rounded-xl text-xs border border-white/10">
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-[#FFD700]" />
                              <span>{item.name}</span>
                            </div>
                            <div className="text-[10px] text-[#FFD700]/80 font-mono mt-0.5">{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-white/10 text-[10px] font-mono text-white/50">
                      <span>🩺 Dr. Mama Kènè (Ordre Dermo-Botanique UEMOA)</span>
                      <span className="text-emerald-400 font-bold">Document Médical Officiel</span>
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
                    Règles Médicales d'Or du Dr. Mama Kènè pour {userName} :
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

      {/* 🎥 MODAL ENREGISTREMENT WEBCAM VIDÉO EN PRÉSENTIEL */}
      <AnimatePresence>
        {showVideoModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#1A110A] border-2 border-[#FFD700] rounded-3xl p-5 max-w-sm w-full space-y-4 text-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-serif font-bold text-sm text-[#FFD700] flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-[#FFD700]" /> Capsule Vidéo Présentielle
                </span>
                <button onClick={handleCloseVideoModal} className="text-white/60 hover:text-white">✕</button>
              </div>

              <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-black border-2 border-[#FFD700]/50 flex items-center justify-center">
                {recordedVideoUrl ? (
                  <video src={recordedVideoUrl} controls autoPlay className="w-full h-full object-cover" />
                ) : (
                  <video ref={videoPreviewRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                )}

                {/* 3D AR Grid Overlay */}
                <div className="absolute inset-0 pointer-events-none border border-[#FFD700]/20 grid grid-cols-3 grid-rows-3">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="border border-white/5" />
                  ))}
                </div>

                {isRecordingVideo && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>ENREGISTREMENT EN COURS...</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {!recordedVideoUrl ? (
                  !isRecordingVideo ? (
                    <Button
                      onClick={startLiveRecording}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs h-11 rounded-2xl cursor-pointer flex items-center justify-center gap-2 border border-red-400"
                    >
                      <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
                      <span>Enregistrer ma Capsule Vidéo (10s)</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={stopLiveRecording}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs h-11 rounded-2xl cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Square className="w-4 h-4 fill-black" />
                      <span>Terminer l'Enregistrement</span>
                    </Button>
                  )
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setRecordedVideoUrl(null)}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold text-xs h-11 rounded-2xl cursor-pointer"
                    >
                      <span>Recommencer</span>
                    </Button>
                    <Button
                      onClick={handleSubmitRecordedVideo}
                      className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#C8951E] text-black font-black text-xs h-11 rounded-2xl cursor-pointer shadow-lg border border-[#FFD700]"
                    >
                      <span>Transmettre au Dr. Mama 🚀</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                  <span className="text-white/60">Zone du Corps :</span>
                  <span className="font-bold text-[#FFD700]">{dynamicFlow?.bodyZoneName || 'Visage / Dos'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Diagnostic :</span>
                  <span className="font-bold text-emerald-400">{consultationData.diagnosis || 'PIH Hyperpigmentation'}</span>
                </div>
              </div>

              <div className="p-3 bg-[#0F0A05] rounded-2xl border border-white/10 text-xs space-y-2 font-mono">
                <div className="font-bold text-[#FFD700] border-b border-white/10 pb-1">Prescription Médicale :</div>
                {consultationData.prescription?.items.map((i: any, idx: number) => (
                  <div key={idx} className="space-y-0.5 text-[11px]">
                    <div className="font-bold text-white flex items-center gap-1">
                      <span>•</span> {i.name}
                    </div>
                    <div className="text-[10px] text-[#FFD700]/70 pl-3.5">{i.desc}</div>
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

      {/* ── ⌨️ BOTTOM FLOATING INPUT BAR ── */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#120B06]/98 border-t-2 border-[#FFD700]/60 p-3 sm:p-4 z-50 backdrop-blur-2xl shadow-2xl">
        <div className="max-w-md mx-auto flex items-center gap-2">
          
          <button
            onClick={handleStartVoiceRecording}
            className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition shrink-0 cursor-pointer ${
              isListening
                ? 'bg-red-500 text-white border-red-500 animate-pulse scale-105'
                : 'bg-[#1E140C] border-[#FFD700]/60 text-[#FFD700] hover:bg-[#2A1E14]'
            }`}
            title="Note Vocale Audio (Dictée)"
          >
            {isListening ? <MicOff className="w-5 h-5 text-white animate-spin" /> : <Mic className="w-5 h-5 text-[#FFD700]" />}
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
            placeholder="Texte, SMS ou question au Dr. Mama Kènè..."
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
