'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Send, Mic, Sparkles,
  Camera, Volume2, Sun, ShieldCheck, ShoppingBag, MapPin, Stethoscope, AlertTriangle, CheckCircle2, HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ParticleOrb3D } from '@/components/ParticleOrb3D';
import { useToast } from '@/hooks/use-toast';

interface MedicalConsultation {
  geoContext: string;
  anamnesis: string;
  diagnosis: string;
  probableCauses: string;
  treatment: string;
  precautions: string;
  followUpQuestion: string;
}

interface Prescription {
  title: string;
  items: { name: string; desc: string; price: number }[];
  totalPrice: number;
}

function ChatContent() {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  
  // Doctor's Structured Clinical Consultation State
  const [consultation, setConsultation] = useState<MedicalConsultation>({
    geoContext: "Dakar / Abidjan (32°C · 85% Humidité · Indice UV 8)",
    anamnesis: "Bonjour Aïsha ! Je suis le Dr. Mama Kènè. En tant que médecin dermatologue spécialiste des peaux mélanodermes en Afrique de l'Ouest, je suis à votre entière écoute.",
    diagnosis: "Bilan Cutané Préliminaire : Peau soumise aux stress thermo-hygrométriques tropicaux.",
    probableCauses: "L'exposition aux UV élevés (Indice 8) et la transpiration excessive modifient le pH du film hydrolipidique et stimulent la mélanogénèse.",
    treatment: "Application quotidienne du Sérum Baobab bio à la Niacinamide 10% le soir + Protection barrière au Karité brut de Korhogo.",
    precautions: "Évitez toute application d'acides exfoliants forts durant la journée sous 32°C pour prévenir l'oxydation séborrhique et les taches secondaires.",
    followUpQuestion: "Depuis combien de semaines observez-vous ce changement cutané ? Ressentez-vous des tiraillements ou des démangeaisons ?",
  });

  const [activePrescription, setActivePrescription] = useState<Prescription | null>({
    title: 'Ordonnance Dermo-Botanique Sur-Mesure',
    items: [
      { name: 'Sérum Baobab 10% Niacinamide Bio', desc: 'Régulateur mélanine & anti-oxydation', price: 18000 },
      { name: 'Beurre de Karité Brut Korhogo 100g', desc: 'Soin réparateur barrière lipidique', price: 9500 },
    ],
    totalPrice: 27500,
  });

  const sampleQuestions = [
    "J'ai des taches foncées sur les joues avec la chaleur à Dakar.",
    "Mon cuir chevelu démange et tiraille après mes tresses.",
    "Ma peau brille et devient grasse à Abidjan l'après-midi.",
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
      let newConsultation: MedicalConsultation = {
        geoContext: "Dakar / Abidjan (32°C · 85% Humidité · UV Indice 8)",
        anamnesis: "Je comprends parfaitement votre préoccupation. En Afrique de l'Ouest, les variations hygrométriques et la forte chaleur influencent directement le comportement de l'épiderme mélanoderme.",
        diagnosis: "Diagnostic Médical Probable : Hyperpigmentation Post-Inflammatoire (PIH) réactive.",
        probableCauses: "Les rayons UV tropicaux stimulent excessivement les mélanocytes sur les zones fragilisées (anciens boutons, frottements). La chaleur accélère l'oxydation des sébums.",
        treatment: "1. Le Soir : Sérum Hibiscus & Baobab Bio (Niacinamide 10%) pour réguler la mélanine.\n2. Le Matin : Écran Solaire Minéral SPF 50 non blanchissant.",
        precautions: "Règle Médicale d'Or : Ne jamais gratter les lésions et proscrire absolument les produits décapants chimiques acides durant la journée sous le soleil.",
        followUpQuestion: "Avez-vous appliqué un produit cosmétique particulier récemment avant l'apparition de ces taches ?",
      };

      let rx: Prescription = {
        title: 'Ordonnance Dermo-Botanique Anti-Taches PIH',
        items: [
          { name: 'Sérum Hibiscus & Baobab Bio', desc: 'Régulateur mélanine & AHA doux', price: 18500 },
          { name: 'Écran Minéral Protecteur SPF 50', desc: 'Protection UV spéciale peaux mates', price: 15000 },
        ],
        totalPrice: 33500,
      };

      if (questionText.toLowerCase().includes('chevelu') || questionText.toLowerCase().includes('tresse')) {
        newConsultation = {
          geoContext: "Climat Tropical Humide (Sueur & Traction du Cuir Chevelu)",
          anamnesis: "Les tiraillements post-tressage sont un motif de consultation très fréquent. Il est capital de préserver les follicules pileux pour éviter toute alopécie de traction.",
          diagnosis: "Diagnostic Médical Probable : Inflammation folliculaire post-traction (Érythème mécanique).",
          probableCauses: "Tension mécanique excessive exercée sur la racine combinée à l'accumulation de sueur sous les nattes, favorisant la prolifération microbienne.",
          treatment: "Massage doux quotidien du cuir chevelu avec l'Huile Pure de Baobab & d'Aloe Vera pour apaiser le cuir chevelu en 48h.",
          precautions: "Demandez à votre coiffeuse de desserrer immédiatement les tresses situées sur les tempes et la ligne frontale.",
          followUpQuestion: "Depuis combien de jours portez-vous ces tresses ? Sentez-vous de petites papules (boutons) à la racine ?",
        };
        rx = {
          title: 'Prescription Apaisante Cuir Chevelu & Anti-Traction',
          items: [
            { name: 'Huile Botanique Baobab & Aloe Vera 100ml', desc: 'Soin apaisant & anti-inflammation', price: 11000 },
          ],
          totalPrice: 11000,
        };
      }

      setConsultation(newConsultation);
      setActivePrescription(rx);
      setLoading(false);

      const fullSpeakText = `${newConsultation.anamnesis} ${newConsultation.diagnosis}. ${newConsultation.treatment}. ${newConsultation.precautions}`;
      speakText(fullSpeakText);
    }, 1200);
  };

  const handleStartVoice = () => {
    setIsListening(true);
    toast({
      title: "🎙️ Écoute Vocale du Médecin en cours...",
      description: "Expliquez vos symptômes au Dr. Mama Kènè...",
    });

    setTimeout(() => {
      setIsListening(false);
      handleAsk("J'ai des taches foncées sur les joues avec la chaleur à Dakar.");
    }, 2800);
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full bg-[#0A0502] text-white flex flex-col font-sans selection:bg-[#FFD700] selection:text-black overflow-hidden">
      
      {/* ── 1. EN-TÊTE ÉPURÉ DE LA CONSULTATION (0 SCROLL) ── */}
      <header className="h-14 bg-[#140C06] border-b border-[#FFD700]/30 px-4 flex items-center justify-between shrink-0 shadow-lg">
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
                <p className="text-[10px] text-emerald-400 font-mono">Cabinet Dermatologique UEMOA</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD700]/15 border border-[#FFD700]/40 text-[#FFD700] text-[10px] font-mono font-bold">
            <MapPin className="w-3 h-3 text-[#FFD700]" />
            <span>{consultation.geoContext.split(' ')[0]}</span>
          </div>
        </div>
      </header>

      {/* ── 2. PANNEAU CENTRAL CONSULTATION MÉDICALE (0 SCROLL GLOBAL) ── */}
      <div className="flex-1 max-w-3xl w-full mx-auto p-3 sm:p-4 flex flex-col justify-between overflow-hidden gap-3">
        
        {/* 🔮 SPHÈRE 3D & MICROPHONE DE CONSULTATION */}
        <Card className="bg-gradient-to-b from-[#1C1108] via-[#140A04] to-[#0A0502] border-2 border-[#FFD700]/60 rounded-3xl p-3.5 shadow-2xl relative overflow-hidden text-center shrink-0">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#FFD700]/20 rounded-full blur-3xl pointer-events-none" />

          {/* 3D WebGL Particle Sphere */}
          <div className="h-36 sm:h-44 flex items-center justify-center relative z-10">
            <ParticleOrb3D isListening={isListening} isSpeaking={isSpeaking} />
          </div>

          {/* Action Vocal "Consulter le Médecin" */}
          <div className="space-y-2 relative z-10">
            <Button
              onClick={handleStartVoice}
              className={`w-full h-11 bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black text-xs sm:text-sm rounded-2xl shadow-xl hover:scale-105 transition cursor-pointer border border-[#FFD700] ${
                isListening ? 'animate-pulse scale-105' : ''
              }`}
            >
              <Mic className="w-4 h-4 mr-2 animate-pulse text-black" />
              <span>{isListening ? 'Le Dr. Mama Kènè vous écoute...' : 'Parler de mes symptômes au Dr. Mama Kènè 🎙️'}</span>
            </Button>

            {/* Motifs de Consultation Fréquents */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pt-0.5">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(q)}
                  className="text-center text-[10px] text-white/80 hover:text-white bg-[#1E140C] border border-white/10 hover:border-[#FFD700]/50 p-1.5 rounded-xl transition cursor-pointer truncate font-serif italic"
                >
                  "{q.substring(0, 32)}..."
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* 🩺 DIAGNOSTIC MÉDICAL STRUCTURÉ (ÉTAPES DU MÉDECIN) */}
        <div className="flex-1 bg-[#140C06] border-2 border-[#FFD700]/50 rounded-3xl p-3.5 sm:p-4 shadow-xl overflow-y-auto space-y-3 flex flex-col justify-between scrollbar-thin">
          
          <div className="space-y-3">
            {currentQuestion && (
              <div className="text-[11px] italic font-serif text-[#FFD700] bg-[#2A1B10] p-2 rounded-xl border border-[#FFD700]/30 w-fit">
                Symptôme énoncé : {currentQuestion}
              </div>
            )}

            {loading ? (
              <div className="flex items-center gap-2 text-xs text-[#FFD700] font-mono p-3 bg-[#1E140C] rounded-2xl border border-[#FFD700]/30">
                <Sparkles className="w-4 h-4 animate-spin text-[#FFD700]" />
                <span>Le Dr. Mama Kènè analyse vos symptômes cutanés...</span>
              </div>
            ) : (
              <div className="space-y-3 text-xs leading-relaxed font-sans">
                
                {/* 1. Anamnèse & Accueil Médical */}
                <div className="bg-[#1E140C] border border-white/10 rounded-2xl p-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#FFD700]">
                    <span className="flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-[#FFD700]" /> 1. Écoute & Anamnèse Médicale
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400">📍 {consultation.geoContext}</span>
                  </div>
                  <p className="text-white/90 font-medium">{consultation.anamnesis}</p>
                </div>

                {/* 2. Diagnostic & Causes Probables */}
                <div className="bg-[#1E140C] border border border-white/10 rounded-2xl p-3 space-y-1.5">
                  <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 2. Diagnostic & Causes Probables
                  </div>
                  <p className="font-bold text-white text-xs">{consultation.diagnosis}</p>
                  <p className="text-white/80 text-[11px]">{consultation.probableCauses}</p>
                </div>

                {/* 3. Traitement & Précautions (Conduite à tenir) */}
                <div className="bg-[#1E140C] border border border-white/10 rounded-2xl p-3 space-y-1.5">
                  <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> 3. Traitement Dermo-Botanique & Conduite à Tenir
                  </div>
                  <p className="text-white/90 whitespace-pre-line text-[11px]">{consultation.treatment}</p>
                  <div className="pt-1 text-[11px] text-amber-300 font-medium italic border-t border-white/10 mt-1">
                    ⚠️ Précautions : {consultation.precautions}
                  </div>
                </div>

                {/* 4. Question de Suivi Médical */}
                <div className="bg-[#2A1B10] border border-[#FFD700]/40 rounded-2xl p-3 space-y-1">
                  <div className="text-[11px] font-bold text-[#FFD700] flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-[#FFD700]" /> Question de Suivi de votre Médecin :
                  </div>
                  <p className="text-white italic font-serif text-[11px]">{consultation.followUpQuestion}</p>
                </div>

              </div>
            )}
          </div>

          {/* 🛒 ORDONNANCE & PRESCRIPTION 1-CLIC */}
          {activePrescription && !loading && (
            <div className="bg-[#0F0A05] border-2 border-[#FFD700]/60 rounded-2xl p-3 space-y-2 shrink-0">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#FFD700]">📋 {activePrescription.title}</span>
                <span className="font-mono font-bold text-[#FFD700]">
                  {activePrescription.totalPrice.toLocaleString('fr-FR')} FCFA
                </span>
              </div>

              <a href={`/checkout?service=${encodeURIComponent(activePrescription.title)}`} className="block w-full">
                <Button className="w-full h-10 bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black text-xs rounded-xl shadow-lg border border-[#FFD700] hover:scale-105 transition cursor-pointer flex items-center justify-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-black" />
                  <span>Commander l'Ordonnance Médicale ({activePrescription.totalPrice.toLocaleString('fr-FR')} FCFA)</span>
                </Button>
              </a>
            </div>
          )}

        </div>

        {/* ⌨️ RÉPONSE / MESSAGE AU MÉDECIN */}
        <div className="flex items-center gap-2 shrink-0">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk(input)}
            placeholder="Répondre à la question du Dr. Mama Kènè..."
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
    <Suspense fallback={<div className="p-8 text-center text-white font-mono">Chargement du Cabinet Médical...</div>}>
      <ChatContent />
    </Suspense>
  );
}
