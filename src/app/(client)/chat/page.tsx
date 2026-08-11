'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Send, Mic, Sparkles,
  Camera, Volume2, Sun, ShieldCheck, ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ParticleOrb3D } from '@/components/ParticleOrb3D';
import { useToast } from '@/hooks/use-toast';

interface Prescription {
  title: string;
  items: { name: string; desc: string; price: number }[];
  totalPrice: number;
}

function ChatContent() {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [aiAnswer, setAiAnswer] = useState<string>(
    "Bonjour Aïsha ! Je suis le Dr. Mama Kènè IA. Avec les 32°C à Dakar aujourd'hui, je suis à votre écoute. Appuyez sur le micro ci-dessous pour me poser votre question de vive voix."
  );
  const [activePrescription, setActivePrescription] = useState<Prescription | null>({
    title: 'Routine Éclat Dermo-Botanique Recommandée',
    items: [
      { name: 'Beurre de Karité Brut Korhogo', desc: 'Hydratation barrière lipidique', price: 9500 },
      { name: 'Sérum Baobab 10% Niacinamide', desc: 'Anti-taches & régénération PIH', price: 18000 },
    ],
    totalPrice: 27500,
  });

  const sampleQuestions = [
    "Comment éliminer mes taches d'hyperpigmentation ?",
    "Quel soin Karité utiliser avec cette chaleur ?",
    "Quelle routine pour apaiser les irritations des tresses ?",
  ];

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

  const handleAsk = (questionText: string) => {
    setCurrentQuestion(`"${questionText}"`);
    setLoading(true);
    setInput('');

    setTimeout(() => {
      let response = "En analysant votre peau et les 32°C actuels à Dakar/Abidjan, je vous recommande d'appliquer le sérum au Baobab frais le soir pour éviter l'oxydation solaire, puis d'apaiser avec une touche de Karité pur.";
      let rx: Prescription = {
        title: 'Routine Éclat Botanique Bio',
        items: [
          { name: 'Sérum Baobab Niacinamide', desc: 'Anti-taches & éclat', price: 18000 },
        ],
        totalPrice: 18000,
      };

      if (questionText.toLowerCase().includes('tache')) {
        response = "Pour vos taches d'hyperpigmentation (PIH), l'Extrait d'Hibiscus Bio et la Niacinamide régulent la mélanine sans agresser la peau. Appliquez le matin sous l'écran solaire minéral.";
        rx = {
          title: 'Ordonnance Anti-Taches PIH',
          items: [
            { name: 'Sérum Hibiscus & Baobab Bio', desc: 'Régulateur mélanine', price: 18500 },
            { name: 'Écran Minéral SPF 50', desc: 'Protection anti-taches', price: 15000 },
          ],
          totalPrice: 33500,
        };
      }

      setAiAnswer(response);
      setActivePrescription(rx);
      setLoading(false);
      speakText(response);
    }, 1000);
  };

  const handleStartVoice = () => {
    setIsListening(true);
    toast({
      title: "🎙️ Écoute Vocale en cours...",
      description: "Parlez directement à Dr. Mama Kènè...",
    });

    setTimeout(() => {
      setIsListening(false);
      handleAsk("Comment éliminer mes taches d'hyperpigmentation ?");
    }, 2500);
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full bg-[#0A0502] text-white flex flex-col font-sans selection:bg-[#FFD700] selection:text-black overflow-hidden">
      
      {/* ── 1. EN-TÊTE ÉPURÉ (0 SCROLL) ── */}
      <header className="h-14 bg-[#140C06] border-b border-[#FFD700]/30 px-4 flex items-center justify-between shrink-0">
        <div className="max-w-4xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/portal')}
              className="w-9 h-9 rounded-full bg-white/5 border border-white/15 text-white hover:bg-white/10 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-xl">🩺</span>
              <div>
                <h1 className="font-serif font-bold text-sm text-white leading-tight">
                  Dr. Mama Kènè <span className="text-[#FFD700]">IA</span>
                </h1>
                <p className="text-[10px] text-emerald-400 font-mono">Dermatologie & Botanique UEMOA</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD700]/15 border border-[#FFD700]/40 text-[#FFD700] text-[10px] font-mono font-bold">
            <Sun className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
            <span>Dakar (32°C)</span>
          </div>
        </div>
      </header>

      {/* ── 2. PANNEAU UNIQUE CENTRAL (0 SCROLL GLOBAL) ── */}
      <div className="flex-1 max-w-2xl w-full mx-auto p-3 sm:p-4 flex flex-col justify-between overflow-hidden gap-3">
        
        {/* 🔮 ORBE 3D CENTRAL & MICROPHONE (ÉTAPES 1) */}
        <Card className="bg-gradient-to-b from-[#1C1108] via-[#140A04] to-[#0A0502] border-2 border-[#FFD700]/60 rounded-3xl p-4 shadow-2xl relative overflow-hidden text-center shrink-0">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#FFD700]/20 rounded-full blur-3xl pointer-events-none" />

          {/* 3D WebGL Particle Sphere */}
          <div className="h-44 sm:h-52 flex items-center justify-center relative z-10">
            <ParticleOrb3D isListening={isListening} isSpeaking={isSpeaking} />
          </div>

          {/* Bouton Principal "Appuyer & Parler" */}
          <div className="space-y-2 relative z-10">
            <Button
              onClick={handleStartVoice}
              className={`w-full h-12 bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black text-xs sm:text-sm rounded-2xl shadow-xl hover:scale-105 transition cursor-pointer border border-[#FFD700] ${
                isListening ? 'animate-pulse scale-105' : ''
              }`}
            >
              <Mic className="w-5 h-5 mr-2 animate-pulse text-black" />
              <span>{isListening ? 'Écoute en cours...' : 'Appuyer & Parler à Dr. Mama Kènè 🎙️'}</span>
            </Button>

            {/* Questions Rapides en 1-Clic */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pt-1">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(q)}
                  className="text-center text-[10px] text-white/80 hover:text-white bg-[#1E140C] border border-white/10 hover:border-[#FFD700]/50 p-2 rounded-xl transition cursor-pointer truncate font-serif italic"
                >
                  "{q.substring(0, 28)}..."
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* 💬 RÉPONSE DE L'IA & ORDONNANCE (ÉTAPES 2 & 3) */}
        <div className="flex-1 bg-[#140C06] border-2 border-[#FFD700]/50 rounded-3xl p-3.5 sm:p-4 shadow-xl overflow-y-auto space-y-3 flex flex-col justify-between">
          
          <div className="space-y-2">
            {currentQuestion && (
              <p className="text-[11px] italic font-serif text-[#FFD700] bg-[#2A1B10] p-2 rounded-xl border border-[#FFD700]/30 w-fit">
                {currentQuestion}
              </p>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#FFD700] flex items-center gap-1.5">
                  🩺 Dr. Mama Kènè · Conseil Dermo-Botanique
                </span>
                <button
                  onClick={() => speakText(aiAnswer)}
                  className="text-[10px] font-bold text-[#FFD700] bg-[#FFD700]/15 border border-[#FFD700]/40 px-2 py-0.5 rounded-lg flex items-center gap-1 hover:bg-[#FFD700]/30 transition cursor-pointer"
                >
                  <Volume2 className="w-3 h-3 text-[#FFD700]" />
                  <span>Réécouter</span>
                </button>
              </div>

              <p className="text-xs text-white leading-relaxed font-sans font-medium">
                {loading ? 'Dr. Mama Kènè prépare votre conseil personnalisé...' : aiAnswer}
              </p>
            </div>
          </div>

          {/* 🛒 ÉTAPE 3 : BOUTON DE COMMANDE 1-CLIC */}
          {activePrescription && !loading && (
            <div className="bg-[#0F0A05] border border-[#FFD700]/50 rounded-2xl p-3 space-y-2.5 shrink-0">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#FFD700]">🌱 {activePrescription.title}</span>
                <span className="font-mono font-bold text-[#FFD700]">
                  {activePrescription.totalPrice.toLocaleString('fr-FR')} FCFA
                </span>
              </div>

              <a href={`/checkout?service=${encodeURIComponent(activePrescription.title)}`} className="block w-full">
                <Button className="w-full h-10 bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black text-xs rounded-xl shadow-lg border border-[#FFD700] hover:scale-105 transition cursor-pointer flex items-center justify-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-black" />
                  <span>Commander ma Routine 1-Clic ({activePrescription.totalPrice.toLocaleString('fr-FR')} FCFA)</span>
                </Button>
              </a>
            </div>
          )}

        </div>

        {/* ⌨️ SAISIE TEXTE DE SECOURS (BAS D'ÉCRAN) */}
        <div className="flex items-center gap-2 shrink-0">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk(input)}
            placeholder="Ou tapez votre question ici..."
            className="flex-1 bg-[#1E140C] border border-white/15 focus:border-[#FFD700] text-white px-3 h-10 rounded-xl text-xs outline-none transition"
          />
          <Button
            onClick={() => handleAsk(input)}
            className="h-10 px-4 bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black text-xs rounded-xl shadow-md border border-[#FFD700] hover:scale-105 transition cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

      </div>

    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-white font-mono">Chargement...</div>}>
      <ChatContent />
    </Suspense>
  );
}
