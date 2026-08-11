'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, X, Sparkles, ArrowRight, ArrowLeft, Sun, Thermometer, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface MamaKeneVoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userLocation?: string;
}

export function MamaKeneVoiceAssistant({
  isOpen,
  onClose,
  userName = 'Aïsha',
  userLocation = 'Dakar (32°C)',
}: MamaKeneVoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const samplePrompts = [
    "Mama Kènè, comment traiter mes taches sur les joues avec cette chaleur ?",
    "Quel soin au Karité utiliser après une journée au soleil à Abidjan ?",
    "Quels sont mes rendez-vous à venir et mes points privilèges ?",
  ];

  // Default initial response matching the exact luxury mockup
  const defaultResponse = `Avec les 32°C à ${userLocation.split(' ')[0]} aujourd'hui, je vous recommande d'appliquer votre sérum au Baobab frais. La vitamine C qu'il contient est idéale, mais privilégiez une application le soir pour éviter l'oxydation au soleil.`;

  const handleStartListening = () => {
    setIsListening(true);
    setTranscript("J'écoute votre question...");
    setAiResponse(null);

    // Simulate voice listening & AI synthesis
    setTimeout(() => {
      setIsListening(false);
      const chosenPrompt = samplePrompts[0];
      setTranscript(`"${chosenPrompt}"`);

      setTimeout(() => {
        setAiResponse(defaultResponse);
        speakText(defaultResponse);
      }, 800);
    }, 3000);
  };

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePromptClick = (promptText: string) => {
    setTranscript(`"${promptText}"`);
    setIsListening(false);
    setAiResponse(null);

    let response = defaultResponse;
    if (promptText.includes('Karité')) {
      response = "Pour sceller l'hydratation après le soleil, appliquez le Beurre de Karité brut de Korhogo en fine couche sur peau légèrement humide.";
    } else if (promptText.includes('rendez-vous')) {
      response = "Vous avez un Rendez-vous confirmé demain à 14h00 chez Kènè Institut pour le Soin Karité & Baobab. Votre solde est de 500 points Kènè.";
    }

    setTimeout(() => {
      setAiResponse(response);
      speakText(response);
    }, 500);
  };

  useEffect(() => {
    if (!isOpen) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      setIsListening(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gradient-to-b from-[#1E1108] via-[#140B05] to-[#0A0502] border-2 border-[#FFD700]/60 text-white rounded-3xl max-w-md p-6 shadow-2xl overflow-hidden relative">
        
        {/* Glow Ambient Effects */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FFD700]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#C8951E]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Header Bar */}
        <div className="flex items-center justify-between relative z-10 border-b border-white/10 pb-3">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-white/70 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="text-center">
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#FFD700] font-black uppercase flex items-center gap-1 justify-center">
              <Sparkles className="w-3 h-3 text-[#FFD700] animate-pulse" />
              TAARU AI · MAMA KÈNÈ
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-white/70 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Voice Assistant Card */}
        <div className="py-6 space-y-6 relative z-10 text-center">
          
          {/* Greeting Headline */}
          <div className="space-y-1">
            <h2 className="font-serif text-3xl font-normal text-white tracking-tight leading-tight">
              Bonjour <span className="text-[#FFD700] font-bold">{userName}</span>,<br />
              je vous écoute.
            </h2>
            <p className="text-xs text-white/60 font-sans flex items-center justify-center gap-1.5 pt-1">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              <span>Diagnostic Vocal en direct · {userLocation}</span>
            </p>
          </div>

          {/* Central Glowing Audio Wave Orb Button */}
          <div className="py-4 flex justify-center items-center">
            <div className="relative group cursor-pointer" onClick={handleStartListening}>
              
              {/* Outer Pulse Rings */}
              <div className={`absolute -inset-4 rounded-full bg-gradient-to-r from-[#FFD700] to-[#C8951E] opacity-30 blur-xl transition-all duration-700 ${
                isListening ? 'animate-ping scale-150 opacity-60' : 'group-hover:opacity-50'
              }`} />

              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#2E1A0C] via-[#4A2E16] to-[#1F1208] border-2 border-[#FFD700] p-1.5 shadow-2xl flex items-center justify-center relative z-10">
                <div className={`w-full h-full rounded-full flex flex-col items-center justify-center transition-all ${
                  isListening
                    ? 'bg-gradient-to-br from-[#FFD700] to-[#C8951E] text-black'
                    : isSpeaking
                    ? 'bg-[#FFD700]/20 text-[#FFD700]'
                    : 'bg-[#140B05] text-[#FFD700] hover:scale-105'
                }`}>
                  
                  {/* Wave Visualizer Animation */}
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 3, 2, 1].map((h, i) => (
                      <span
                        key={i}
                        className={`w-1 rounded-full bg-current transition-all duration-300 ${
                          isListening || isSpeaking ? 'animate-pulse' : 'opacity-60'
                        }`}
                        style={{
                          height: (isListening || isSpeaking ? h * 6 : 8) + 'px',
                          animationDelay: `${i * 0.15}s`
                        }}
                      />
                    ))}
                  </div>

                  <span className="text-[10px] font-mono font-black uppercase tracking-wider">
                    {isListening ? 'Écoute...' : isSpeaking ? 'Parle...' : 'Parler'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Transcript / Question Bubble */}
          {transcript && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-4">
              <p className="text-xs italic font-serif text-[#FFD700]/90 bg-[#2A1B10]/80 border border-[#FFD700]/30 p-3 rounded-2xl">
                {transcript}
              </p>
            </motion.div>
          )}

          {/* Sample Voice Prompts Chips */}
          {!transcript && !aiResponse && (
            <div className="space-y-2 text-left pt-2">
              <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest block text-center">
                💡 Exemples de questions vocales :
              </span>
              <div className="space-y-2">
                {samplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePromptClick(prompt)}
                    className="w-full text-left text-xs text-white/80 hover:text-white bg-[#1A110A] hover:bg-[#2A1C12] border border-white/10 hover:border-[#FFD700]/40 p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <span className="italic font-serif truncate font-medium">"{prompt}"</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#FFD700] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AI Response Card */}
          {aiResponse && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 pt-2">
              <div className="bg-gradient-to-br from-[#24170E] to-[#180E08] border border-[#FFD700]/50 rounded-3xl p-5 shadow-2xl text-left relative overflow-hidden">
                <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#FFD700]/20 border border-[#FFD700]/40 flex items-center justify-center text-xs">
                      🌱
                    </div>
                    <span className="font-display font-bold text-xs text-[#FFD700]">Mama Kènè · Conseil Dermo</span>
                  </div>
                  {isSpeaking && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                      <Volume2 className="w-3.5 h-3.5 animate-pulse" /> Émission Vocale
                    </span>
                  )}
                </div>

                <p className="text-xs text-white/90 leading-relaxed font-sans font-medium">
                  {aiResponse}
                </p>
              </div>

              {/* Action Button */}
              <a href="/checkout?service=Soin%20Hydratation%20Karité" className="block w-full">
                <Button className="w-full h-11 bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black text-xs rounded-2xl shadow-xl hover:scale-105 transition cursor-pointer flex items-center justify-center gap-2 border border-[#FFD700]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Routine du Soin Recommandée</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </motion.div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}
