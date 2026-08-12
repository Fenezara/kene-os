'use client';

// Kènè OS — TAARU AI · Dr. Mama Kènè IA (Luxury Spa Telemedicine Design v3.5)
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MoreHorizontal, Send, Mic, Play, Pause, Video, MessageSquare, Phone,
  Camera, Volume2, Sun, ShieldCheck, ShoppingBag, MapPin, Stethoscope, AlertTriangle, CheckCircle2, HelpCircle, CheckCheck, Smartphone, Sparkles, User, RefreshCw, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export interface ConsultationStep {
  stepIndex: number;
  title: string;
  question?: string;
  diagnosis?: string;
  prescription?: {
    title: string;
    items: { name: string; desc: string; price: number }[];
    totalPrice: number;
  };
  advice?: string;
}

function generateClinicalDoctorFlow(query: string): ConsultationStep[] {
  const q = query.toLowerCase();

  if (q.includes('tache') || q.includes('taches') || q.includes('noire') || q.includes('foncée') || q.includes('joue') || q.includes('hyperpigmentation') || q.includes('masque') || q.includes('pih')) {
    return [
      {
        stepIndex: 1,
        title: "Étape 1 : Anamnèse & Diagnostic Médical",
        diagnosis: "Hyperpigmentation Post-Inflammatoire (PIH) & Oxydation Mélanique due aux UV tropicaux.",
        advice: "Sous le soleil tropical, les UV stimulent fortement la tyrosinase. La mélanine se concentre sur les zones sensibles des joues.",
      },
      {
        stepIndex: 2,
        title: "Étape 2 : Ordonnance Dermo-Botanique Sur-Mesure",
        prescription: {
          title: 'Ordonnance Anti-Taches PIH Certifiée',
          items: [
            { name: 'Sérum Hibiscus & Baobab 10% Bio', desc: 'Appliquer le soir sur les taches', price: 18500 },
            { name: 'Écran Solaire Minéral SPF 50', desc: 'Appliquer chaque matin', price: 15000 },
          ],
          totalPrice: 33500,
        },
        advice: "Appliquez le Sérum Hibiscus & Baobab exclusivement le soir pour éviter toute photosensibilisation.",
      },
      {
        stepIndex: 3,
        title: "Étape 3 : Conseils & Règles d'Or Médicales",
        advice: "Règle Médicale d'Or : Ne jamais utiliser de produits décapants acides sous le soleil. Rincez le visage à l'eau tiède.",
      }
    ];
  }

  if (q.includes('bouton') || q.includes('boutons') || q.includes('acné') || q.includes('brille') || q.includes('grasse') || q.includes('sébum') || q.includes('pore')) {
    return [
      {
        stepIndex: 1,
        title: "Étape 1 : Diagnostic Médical",
        diagnosis: "Hyperséborrhée Réactive & Obstruction Folliculaire Inflammatoire.",
        advice: "La sueur et l'excès de sébum s'oxydent à la chaleur, créant des comédons et imperfections.",
      },
      {
        stepIndex: 2,
        title: "Étape 2 : Ordonnance Matifiante",
        prescription: {
          title: 'Ordonnance Anti-Boutons Purifiante',
          items: [
            { name: 'Gel Nettoyant Moringa & Baobab 200ml', desc: 'Nettoyage purifiant matin & soir', price: 12000 },
            { name: 'Lotion Matifiante Eau de Rose Bio', desc: 'Resserre les pores & équilibre pH', price: 14500 },
          ],
          totalPrice: 26500,
        },
        advice: "Nettoyez votre visage avec le Gel Moringa matin et soir sans frotter excessivement.",
      }
    ];
  }

  if (q.includes('cheveu') || q.includes('cheveux') || q.includes('cuir') || q.includes('tresse') || q.includes('tresses') || q.includes('démange') || q.includes('picotement') || q.includes('chute')) {
    return [
      {
        stepIndex: 1,
        title: "Étape 1 : Diagnostic Cuir Chevelu",
        diagnosis: "Tension Folliculaire & Micro-Inflammation après Tressage.",
        advice: "Le cuir chevelu subit un stress mécanique important qui enflamme la racine des cheveux.",
      },
      {
        stepIndex: 2,
        title: "Étape 2 : Ordonnance Apaisante",
        prescription: {
          title: 'Ordonnance Apaisante Cuir Chevelu',
          items: [
            { name: 'Élixir Apaisant Nigelle & Karité 100ml', desc: 'Appliquer en gouttes sur le cuir chevelu', price: 16000 },
            { name: 'Shampoing Doux Sans Sulfate', desc: 'Lavage apaisant hebdomadaire', price: 11000 },
          ],
          totalPrice: 27000,
        },
        advice: "Appliquez l'Élixir Nigelle & Karité directement sur les raies du cuir chevelu pour calmer les picotements.",
      }
    ];
  }

  // General Fallback Flow
  return [
    {
      stepIndex: 1,
      title: "Étape 1 : Diagnostic & Recommandations",
      diagnosis: "Soin & Rééquilibrage Cutané Tropical.",
      advice: "Pour préserver la vitalité de votre peau sous notre climat, je vous conseille une application régulière du Beurre de Karité brut de Korhogo le soir.",
      prescription: {
        title: 'Soin Hydratation Karité Brut',
        items: [
          { name: 'Beurre de Karité Brut Korhogo 100g', desc: 'Soin régénérateur barrière lipidique', price: 9500 },
        ],
        totalPrice: 9500,
      }
    }
  ];
}

function ChatContent() {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [userName, setUserName] = useState('Aïsha');
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);
  const [currentSteps, setCurrentSteps] = useState<ConsultationStep[] | null>(null);

  const samplePrompts = [
    "Mama Kènè, comment traiter mes taches sur les joues avec cette chaleur ?",
    "Quel soin au Karité utiliser après une journée au soleil ?",
    "Mon cuir chevelu démange et tiraille après mes tresses.",
  ];

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

  const handleAsk = (queryText: string) => {
    if (!queryText.trim()) return;

    setCurrentPrompt(`"${queryText}"`);
    setCurrentSteps(null);
    setInput('');
    setIsThinking(true);

    // Dynamic Thinking Animation (Dr. Mama Kènè IA is reflecting)
    setTimeout(() => {
      setIsThinking(false);
      const steps = generateClinicalDoctorFlow(queryText);
      setCurrentSteps(steps);

      // Read audio aloud automatically
      const fullTextToSpeak = steps.map(s => (s.diagnosis || '') + ' ' + (s.advice || '')).join('. ');
      speakText(fullTextToSpeak);
    }, 1800);
  };

  const handleStartVoiceRecording = () => {
    setIsListening(true);
    toast({
      title: "🎙️ Écoute Vocale Active...",
      description: "Parlez... Le Dr. Mama Kènè analyse votre voix.",
    });

    setTimeout(() => {
      setIsListening(false);
      const chosen = samplePrompts[0];
      handleAsk(chosen);
    }, 2800);
  };

  return (
    <div className="min-h-screen bg-[#110B07] text-[#F8F1E4] flex flex-col items-center font-sans selection:bg-[#FFD700] selection:text-black overflow-x-hidden relative">
      
      {/* Glow Ambient Atmospheric Orbs */}
      <div className="fixed top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FFD700]/15 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-10 right-10 w-80 h-80 bg-[#C8951E]/10 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* ── 📱 TOP HEADER BAR ── */}
      <header className="w-full max-w-md px-6 py-5 flex items-center justify-between relative z-20">
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
            TAARU AI
          </span>
        </div>

        <button
          onClick={() => toast({ title: "Options Télémédecine", description: "Cabinet Médical Virtuel Dr. Mama Kènè IA" })}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          title="Options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </header>

      {/* ── 🌟 MAIN TAARU AI CONTENT CONTAINER ── */}
      <main className="w-full max-w-md px-6 pb-24 flex-1 flex flex-col items-center relative z-10 space-y-6">
        
        {/* 1. GREETING HEADLINE */}
        <div className="text-center space-y-1 pt-2">
          <h1 className="font-serif text-3xl sm:text-4xl text-white tracking-tight leading-tight">
            Bonjour <span className="text-[#FFD700] font-bold">{userName}</span>,<br />
            <span className="italic font-serif font-normal text-white/90">je vous écoute.</span>
          </h1>
        </div>

        {/* 2. THE MAGNIFICENT GLOWING AUDIO WAVE ORB (CENTRAL ANIMATED SPHERE) */}
        <div className="py-4 flex flex-col items-center justify-center relative">
          
          <div className="relative group cursor-pointer" onClick={handleStartVoiceRecording}>
            
            {/* Outer Glowing Ripple Aura */}
            <div className={`absolute -inset-6 rounded-full bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#E5A93C] opacity-40 blur-2xl transition-all duration-700 ${
              isThinking || isSpeaking || isListening ? 'animate-ping scale-150 opacity-75' : 'group-hover:opacity-60'
            }`} />

            {/* Concentric Golden Halo Rings */}
            <div className={`w-36 h-36 rounded-full bg-gradient-to-br from-[#3D2514] via-[#2A180B] to-[#160C05] border-2 border-[#FFD700] p-2 shadow-2xl flex items-center justify-center relative z-10 transition-transform duration-500 ${
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
                  <div className="flex flex-col items-center gap-1.5">
                    <RefreshCw className="w-7 h-7 animate-spin text-[#FFD700]" />
                    <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-[#FFD700]">Réflexion...</span>
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
                            height: (isSpeaking || isListening ? h * 2.2 : 12) + 'px',
                            animationDelay: `${i * 0.12}s`
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider opacity-80 pt-1">
                      {isSpeaking ? 'Lecture Audio...' : isListening ? 'Écoute...' : 'Appuyer pour Parler'}
                    </span>
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* Status Badge */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C120B] border border-[#FFD700]/40 text-[#FFD700] text-[10px] font-mono font-bold shadow-lg">
            <span className={`w-2 h-2 rounded-full ${isThinking ? 'bg-amber-400 animate-spin' : isSpeaking ? 'bg-emerald-400 animate-ping' : 'bg-[#FFD700]'}`} />
            <span>
              {isThinking ? 'Dr. Mama Kènè IA analyse votre cas...' : isSpeaking ? 'Émission de la Note Vocale...' : 'Dr. Mama Kènè IA · Consultation Active'}
            </span>
          </div>
        </div>

        {/* 3. CURRENT QUESTION QUOTE CARD */}
        {currentPrompt ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full text-center px-4"
          >
            <p className="text-sm font-serif italic text-[#FFD700] bg-[#1E140C]/90 border border-[#FFD700]/40 p-4 rounded-3xl shadow-xl leading-relaxed">
              {currentPrompt}
            </p>
          </motion.div>
        ) : (
          /* Sample Prompt Suggestion Chips */
          <div className="w-full space-y-2 pt-1">
            <span className="text-[10px] font-mono text-[#FFD700] uppercase tracking-widest block text-center font-bold">
              💡 Questions Fréquentes :
            </span>
            <div className="space-y-2">
              {samplePrompts.map((promptText, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(promptText)}
                  className="w-full text-left text-xs text-white/90 hover:text-white bg-[#1A110A] hover:bg-[#27180D] border border-white/15 hover:border-[#FFD700]/60 p-3.5 rounded-2xl transition cursor-pointer flex items-center justify-between group shadow-sm"
                >
                  <span className="font-serif italic font-medium truncate font-medium">"{promptText}"</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#FFD700] shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. DOCTOR MEDICAL RESPONSE & 5-STEP CONSULTATION FLOW */}
        <AnimatePresence>
          {currentSteps && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full space-y-4 pt-2"
            >
              {currentSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-[#1F130B] via-[#160D07] to-[#0D0703] border-2 border-[#FFD700]/60 rounded-3xl p-5 shadow-2xl space-y-3 relative overflow-hidden text-left"
                >
                  {/* Step Title Badge */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#FFD700] text-black flex items-center justify-center text-xs font-bold shrink-0">
                        🌱
                      </div>
                      <span className="font-mono font-bold text-xs text-[#FFD700]">
                        {step.title}
                      </span>
                    </div>

                    <button
                      onClick={() => speakText((step.diagnosis || '') + ' ' + (step.advice || ''))}
                      className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#FFD700] transition cursor-pointer"
                      title="Ré-écouter la Note Vocale"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Diagnosis */}
                  {step.diagnosis && (
                    <div className="bg-[#26170D] border border-[#FFD700]/30 rounded-2xl p-3">
                      <div className="text-[10px] font-mono font-bold text-[#FFD700] uppercase tracking-wider">
                        🩺 Diagnostic Médical Posé :
                      </div>
                      <p className="text-xs font-bold text-white pt-1">
                        {step.diagnosis}
                      </p>
                    </div>
                  )}

                  {/* Advice Explanation */}
                  {step.advice && (
                    <p className="text-xs text-white/90 leading-relaxed font-sans font-medium">
                      {step.advice}
                    </p>
                  )}

                  {/* Prescription Card */}
                  {step.prescription && (
                    <div className="bg-[#0F0A05] border border-[#FFD700]/60 rounded-2xl p-3.5 space-y-2 text-white">
                      <div className="flex items-center justify-between text-xs font-bold text-[#FFD700]">
                        <span>📋 {step.prescription.title}</span>
                        <Badge className="bg-[#FFD700]/20 text-[#FFD700] text-[9px] font-mono">Ordonnance Certifiée</Badge>
                      </div>

                      <div className="space-y-1.5">
                        {step.prescription.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center bg-[#1A1410] p-2 rounded-xl text-xs">
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
                          Total: {step.prescription.totalPrice.toLocaleString('fr-FR')} FCFA
                        </span>
                        <a href={`/checkout?service=${encodeURIComponent(step.prescription.title)}`}>
                          <Button className="h-8 bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black text-[11px] rounded-xl shadow-lg border border-[#FFD700] hover:scale-105 transition cursor-pointer px-3">
                            <ShoppingBag className="w-3.5 h-3.5 mr-1" />
                            <span>Commander 1-Clic</span>
                          </Button>
                        </a>
                      </div>
                    </div>
                  )}

                </div>
              ))}

              {/* Bottom Routine Call to Action Button */}
              <a href="/checkout?service=Routine%20Du%20Soin%20Mama%20K%C3%A8n%C3%A8" className="block w-full pt-2">
                <Button className="w-full h-12 bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black text-xs rounded-2xl shadow-2xl hover:scale-102 transition cursor-pointer flex items-center justify-center gap-2 border border-[#FFD700]">
                  <ShieldCheck className="w-4 h-4 text-black" />
                  <span>Activer la Routine du Soin Recommandée</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </Button>
              </a>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* ── ⌨️ BOTTOM FLOATING INPUT BAR ── */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#120B06]/95 border-t-2 border-[#FFD700]/40 p-3 sm:p-4 z-30 backdrop-blur-2xl">
        <div className="max-w-md mx-auto flex items-center gap-2">
          
          {/* Audio Mic Button */}
          <button
            onClick={handleStartVoiceRecording}
            className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition shrink-0 cursor-pointer ${
              isListening
                ? 'bg-red-500 text-white border-red-500 animate-pulse scale-105'
                : 'bg-[#1E140C] border-[#FFD700]/40 text-[#FFD700] hover:bg-[#2A1E14]'
            }`}
            title="Note Vocale Audio"
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Video Request */}
          <button
            onClick={() => {
              toast({ title: "🎥 Capsule Vidéo", description: "Lancement de la démonstration vidéo..." });
              handleAsk("Mama Kènè, montre-moi en vidéo comment appliquer le sérum.");
            }}
            className="w-11 h-11 rounded-2xl bg-[#1E140C] border border-[#FFD700]/40 text-[#FFD700] hover:bg-[#2A1E14] flex items-center justify-center transition shrink-0 cursor-pointer"
            title="Capsule Vidéo"
          >
            <Video className="w-5 h-5" />
          </button>

          {/* Photo Upload */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-11 h-11 rounded-2xl bg-[#1E140C] border border-white/15 text-white/70 hover:text-white flex items-center justify-center transition shrink-0 cursor-pointer"
            title="Photo Cutanée"
          >
            <Camera className="w-5 h-5 text-[#FFD700]" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />

          {/* Text Input */}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk(input)}
            placeholder="Écrire un message ou SMS au Dr. Mama Kènè..."
            className="flex-1 bg-[#1E140C] border border-white/15 focus:border-[#FFD700] text-white px-4 h-11 rounded-2xl text-xs outline-none transition"
          />

          {/* Send Button */}
          <Button
            onClick={() => handleAsk(input)}
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
    <Suspense fallback={<div className="p-8 text-center text-white font-mono">Chargement du Spa Télémédecine TAARU AI...</div>}>
      <ChatContent />
    </Suspense>
  );
}
