'use client';

// Kènè OS — Clean Chat v3.0 (Cockpit Telemedicine Layout 2 Columns & Compact Mobile Header)
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Send, Mic, Play, Pause, Video, MessageSquare, Phone,
  Camera, Volume2, Sun, ShieldCheck, ShoppingBag, MapPin, Stethoscope, AlertTriangle, CheckCircle2, HelpCircle, CheckCheck, Smartphone, Sparkles, User, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ParticleOrb3D } from '@/components/ParticleOrb3D';
import { useToast } from '@/hooks/use-toast';

export interface MultimodalChatMessage {
  id: string;
  sender: 'doctor' | 'patient';
  type: 'text' | 'audio' | 'video' | 'sms' | 'prescription';
  text?: string;
  audioDuration?: string;
  videoUrl?: string;
  videoTitle?: string;
  smsNumber?: string;
  prescription?: {
    title: string;
    items: { name: string; desc: string; price: number }[];
    totalPrice: number;
  };
  timestamp: string;
}

function ChatContent() {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Initial Multimodal Conversation Stream
  const [messages, setMessages] = useState<MultimodalChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'doctor',
      type: 'text',
      text: "Bonjour ! Je suis le Dr. Mama Kènè, votre médecin dermatologue dermo-cosmétique. Comment se porte votre peau aujourd'hui ?",
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const speakText = (msgId: string, text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (playingAudioId === msgId) {
        window.speechSynthesis.cancel();
        setPlayingAudioId(null);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*#]/g, ''));
      utterance.lang = 'fr-FR';
      utterance.rate = 0.95;
      utterance.pitch = 1.02;
      utterance.onstart = () => setPlayingAudioId(msgId);
      utterance.onend = () => setPlayingAudioId(null);
      utterance.onerror = () => setPlayingAudioId(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendPatientText = (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim()) return;

    const patientMsg: MultimodalChatMessage = {
      id: `msg-patient-${Date.now()}`,
      sender: 'patient',
      type: 'text',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, patientMsg]);
    if (!customText) setInput('');
    setLoading(true);

    // AI Multimodal Doctor Response Simulation
    setTimeout(() => {
      let doctorText = "Je comprends tout à fait vos symptômes. En période de forte chaleur, les UV stimulent la mélanogénèse et provoquent une réactivité cutanée (PIH).";
      let rx: { title: string; items: { name: string; desc: string; price: number }[]; totalPrice: number } | undefined = undefined;

      if (textToSend.toLowerCase().includes('tache') || textToSend.toLowerCase().includes('bouton')) {
        doctorText = "Diagnostic Médical : Hyperpigmentation Post-Inflammatoire (PIH). Je vous prescris le Sérum Hibiscus & Baobab Bio (Niacinamide 10%) à appliquer le soir, associé à l'Écran Minéral SPF 50 le matin.";
        rx = {
          title: 'Ordonnance Anti-Taches PIH Certifiée',
          items: [
            { name: 'Sérum Hibiscus & Baobab Bio', desc: 'Régulateur mélanine', price: 18500 },
            { name: 'Écran Minéral SPF 50', desc: 'Filtre UV peaux mates', price: 15000 },
          ],
          totalPrice: 33500,
        };
      }

      const doctorMsg: MultimodalChatMessage = {
        id: `msg-doc-${Date.now()}`,
        sender: 'doctor',
        type: 'text',
        text: doctorText,
        prescription: rx,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, doctorMsg]);
      setLoading(false);
      speakText(doctorMsg.id, doctorMsg.text || '');
    }, 1200);
  };

  const handleRecordAudioNote = () => {
    setIsRecordingAudio(true);
    toast({
      title: "🎙️ Enregistrement Note Vocale...",
      description: "Parlez... Votre message audio est envoyé au médecin.",
    });

    setTimeout(() => {
      setIsRecordingAudio(false);
      const audioMsg: MultimodalChatMessage = {
        id: `msg-patient-audio-${Date.now()}`,
        sender: 'patient',
        type: 'audio',
        text: "Note Vocale Audio Cliente : 'Docteur, j'ai des picotements sur les pommettes l'après-midi.'",
        audioDuration: '0:22',
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, audioMsg]);
      handleSendPatientText("Note vocale transmise au médecin.");
    }, 2600);
  };

  const handleSendVideoClip = () => {
    toast({ title: "🎥 Consultation Vidéo", description: "Lancement de la capsule vidéo explicative du médecin..." });
    const videoMsg: MultimodalChatMessage = {
      id: `msg-video-${Date.now()}`,
      sender: 'doctor',
      type: 'video',
      videoTitle: 'Capsule Vidéo Médicale : Gestes d\'application du Sérum Baobab',
      text: 'Le Dr. Mama Kènè vous montre en vidéo comment appliquer votre sérum sans saturer vos pores.',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, videoMsg]);
  };

  const samplePrompts = [
    "Mama Kènè, comment traiter mes taches sur les joues ?",
    "Quel soin au Karité utiliser après une journée au soleil ?",
    "J'ai des tiraillements et des picotements l'après-midi.",
  ];

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full bg-[#070402] text-white flex flex-col font-sans selection:bg-[#FFD700] selection:text-black overflow-hidden">
      
      {/* ── 📱 HEADER TELEMEDECINE HARMONIEUX ── */}
      <header className="h-16 bg-[#120B06]/95 border-b-2 border-[#FFD700]/40 px-4 md:px-8 flex items-center justify-between shrink-0 shadow-2xl z-30 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/portal')}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/15 text-white hover:bg-white/10 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] via-[#C8951E] to-[#8A1C14] p-0.5 shadow-lg shrink-0">
                <div className="w-full h-full rounded-full bg-[#0F0A05] flex items-center justify-center text-base font-serif font-bold text-[#FFD700]">
                  🩺
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#120B06] animate-pulse" />
            </div>

            <div>
              <h1 className="font-serif font-bold text-sm text-white leading-tight flex items-center gap-1.5">
                Dr. Mama Kènè <span className="text-[#FFD700]">IA</span>
                <Badge className="bg-[#FFD700]/20 text-[#FFD700] text-[9px] font-mono">Dermatologie Dermo-Botanique</Badge>
              </h1>
              <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                En ligne 24/7 · Télémédecine Audio & SMS
              </p>
            </div>
          </div>
        </div>

        {/* Quick Header Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSendVideoClip}
            className="p-2 rounded-xl bg-[#1E140C] border border-[#FFD700]/40 text-[#FFD700] hover:bg-[#2A1E14] transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Capsule Vidéo"
          >
            <Video className="w-4 h-4 text-[#FFD700]" />
            <span className="hidden sm:inline">Vidéo</span>
          </button>
          <button
            onClick={handleRecordAudioNote}
            className="p-2 rounded-xl bg-[#1E140C] border border-[#FFD700]/40 text-[#FFD700] hover:bg-[#2A1E14] transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Note Vocale"
          >
            <Mic className="w-4 h-4 text-[#FFD700]" />
            <span className="hidden sm:inline">Audio</span>
          </button>
        </div>
      </header>

      {/* ── 🏛️ LAYOUT 2 COLONNES COCKPIT (PC/DESKTOP) & FLUX CONTINU (MOBILE) ── */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto overflow-hidden min-h-0">
        
        {/* 🌟 GAUCHE (DESKTOP) : PANNEAU FIXE GLOBE 3D & STATUT MÉDECIN 🌟 */}
        <aside className="hidden lg:flex flex-col w-80 shrink-0 border-r border-white/10 bg-[#0E0804] p-5 space-y-4 overflow-y-auto">
          
          {/* Glowing 3D Orb Card */}
          <div className="bg-gradient-to-b from-[#1C1008] to-[#100904] border-2 border-[#FFD700]/40 rounded-3xl p-4 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="w-full h-44 flex items-center justify-center relative">
              <ParticleOrb3D
                isListening={isRecordingAudio}
                isSpeaking={playingAudioId !== null || loading}
              />
            </div>

            <div className="mt-1 space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD700]/15 border border-[#FFD700]/40 text-[#FFD700] text-[10px] font-mono font-bold">
                <Sparkles className="w-3 h-3 text-[#FFD700] animate-spin" />
                <span>Globe IA Biométrique</span>
              </span>
              <p className="text-[11px] text-white/60 font-sans pt-1">
                Consultation Interactive Dermo-Botanique
              </p>
            </div>
          </div>

          {/* Quick Voice Consultation Trigger */}
          <button
            onClick={handleRecordAudioNote}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black text-xs shadow-lg border border-[#FFD700] hover:scale-102 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Mic className="w-4 h-4 text-black" />
            <span>Consultation Vocale Directe</span>
          </button>

          {/* Sample Prompts Suggestion Chips */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-mono text-[#FFD700] uppercase tracking-widest block font-bold">
              💡 Questions fréquentes :
            </span>
            <div className="space-y-2">
              {samplePrompts.map((promptText, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPatientText(promptText)}
                  className="w-full text-left text-xs text-white/80 hover:text-white bg-[#1A110A] hover:bg-[#25170E] border border-white/10 hover:border-[#FFD700]/50 p-3 rounded-2xl transition cursor-pointer flex items-center justify-between group"
                >
                  <span className="font-serif italic truncate font-medium">"{promptText}"</span>
                  <Send className="w-3 h-3 text-[#FFD700] opacity-70 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* 💬 DROITE (PC & MOBILE) : FIL DE DISCUSSION INTERACTIF 💬 */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#070402] relative">
          
          {/* Mobile Only Compact Orb Bar */}
          <div className="lg:hidden bg-[#100804] border-b border-white/10 px-4 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-serif font-bold text-[#FFD700]">Globe IA Biométrique Actif</span>
            </div>
            <button onClick={handleRecordAudioNote} className="flex items-center gap-1 text-[10px] text-[#FFD700] font-mono bg-[#FFD700]/10 px-2.5 py-1 rounded-full border border-[#FFD700]/30">
              <Mic className="w-3 h-3" /> Note Vocale
            </button>
          </div>

          {/* Scrollable Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${msg.sender === 'patient' ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-xl rounded-3xl p-4 shadow-xl space-y-3 ${
                  msg.sender === 'patient'
                    ? 'bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-medium border border-[#FFD700] rounded-br-none'
                    : 'bg-[#181009] border-2 border-[#FFD700]/50 text-white rounded-bl-none'
                }`}>
                  
                  {/* Message Header Badge */}
                  <div className="flex items-center justify-between border-b border-current/10 pb-1.5 text-[10px] font-mono">
                    <span className="font-bold flex items-center gap-1">
                      {msg.sender === 'patient' ? '👤 Vous (Patient)' : '🩺 Dr. Mama Kènè (Médecin)'}
                    </span>
                    <span className="opacity-70 flex items-center gap-1">
                      {msg.timestamp}
                      {msg.sender === 'patient' && <CheckCheck className="w-3.5 h-3.5 text-black" />}
                    </span>
                  </div>

                  {/* 💬 TYPE: TEXT */}
                  {msg.type === 'text' && msg.text && (
                    <div className="space-y-2">
                      <p className="text-xs sm:text-sm leading-relaxed font-sans font-medium whitespace-pre-line">
                        {msg.text}
                      </p>

                      {/* Doctor Text-to-Speech Audio Button */}
                      {msg.sender === 'doctor' && (
                        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                          <button
                            onClick={() => speakText(msg.id, msg.text || '')}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFD700]/15 border border-[#FFD700]/40 text-[#FFD700] text-[10px] font-mono font-bold hover:bg-[#FFD700]/25 transition cursor-pointer"
                          >
                            {playingAudioId === msg.id ? <Pause className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                            <span>{playingAudioId === msg.id ? 'Pause Audio' : '🔊 Écouter en Audio'}</span>
                          </button>

                          <button
                            onClick={() => toast({ title: "📱 SMS Envoyé", description: "Ce message médical a été transmis sur votre téléphone mobile." })}
                            className="flex items-center gap-1 text-[10px] text-white/50 hover:text-white transition cursor-pointer"
                          >
                            <Smartphone className="w-3 h-3 text-emerald-400" />
                            <span>Recevoir par SMS</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 🎙️ TYPE: AUDIO VOICE NOTE */}
                  {msg.type === 'audio' && (
                    <div className="bg-[#0F0A05] border border-[#FFD700]/50 rounded-2xl p-3 space-y-2 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => speakText(msg.id, msg.text || '')}
                            className="w-9 h-9 rounded-full bg-[#FFD700] text-black flex items-center justify-center shadow-lg hover:scale-110 transition cursor-pointer"
                          >
                            {playingAudioId === msg.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                          </button>
                          <div>
                            <div className="text-xs font-bold text-[#FFD700]">🎙️ Note Vocale Médicale</div>
                            <div className="text-[10px] text-white/60 font-mono">Durée: {msg.audioDuration || '0:35'}</div>
                          </div>
                        </div>

                        {/* Waveform Animation */}
                        <div className="flex items-center gap-1">
                          {[3, 6, 9, 5, 8, 4, 7, 3, 6, 8, 4].map((h, i) => (
                            <span
                              key={i}
                              className={`w-1 rounded-full ${playingAudioId === msg.id ? 'bg-[#FFD700] animate-pulse' : 'bg-white/30'}`}
                              style={{ height: `${h * 2}px` }}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-[11px] text-white/80 italic font-serif pt-1 border-t border-white/10">
                        "{msg.text}"
                      </p>
                    </div>
                  )}

                  {/* 🎥 TYPE: VIDEO CONSULTATION CLIP */}
                  {msg.type === 'video' && (
                    <div className="bg-[#0F0A05] border-2 border-[#FFD700]/60 rounded-2xl p-3 space-y-2 text-white">
                      <div className="flex items-center justify-between text-xs font-bold text-[#FFD700]">
                        <span className="flex items-center gap-1.5"><Video className="w-4 h-4" /> {msg.videoTitle || 'Capsule Vidéo'}</span>
                        <Badge className="bg-[#FFD700]/20 text-[#FFD700] text-[9px]">HD 4K</Badge>
                      </div>

                      {/* Video Player Thumbnail Overlay */}
                      <div className="relative w-full h-40 rounded-xl overflow-hidden bg-gradient-to-br from-[#2E1A0C] to-[#120B05] border border-white/15 flex items-center justify-center group cursor-pointer" onClick={() => speakText(msg.id, msg.text || '')}>
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition" />
                        <div className="w-12 h-12 rounded-full bg-[#FFD700] text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition z-10">
                          <Play className="w-5 h-5 ml-1" />
                        </div>
                        <span className="absolute bottom-2 left-2 text-[10px] bg-black/70 px-2 py-0.5 rounded font-mono text-white">
                          Dr. Mama Kènè · Dermo-Botanique
                        </span>
                      </div>

                      <p className="text-xs text-white/90 font-medium">{msg.text}</p>
                    </div>
                  )}

                  {/* 📋 TYPE: PRESCRIPTION CARD */}
                  {msg.prescription && (
                    <div className="bg-[#0F0A05] border-2 border-[#FFD700]/60 rounded-2xl p-3.5 space-y-2.5 text-white">
                      <div className="flex items-center justify-between text-xs font-bold text-[#FFD700]">
                        <span>🌱 {msg.prescription.title}</span>
                        <Badge className="bg-[#FFD700]/20 text-[#FFD700] text-[9px] font-mono">Certifiée</Badge>
                      </div>

                      <div className="space-y-1.5">
                        {msg.prescription.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-[#1A1410] p-2 rounded-xl text-xs">
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
                          Total: {msg.prescription.totalPrice.toLocaleString('fr-FR')} FCFA
                        </span>
                        <a href={`/checkout?service=${encodeURIComponent(msg.prescription.title)}`}>
                          <Button className="h-9 bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black text-xs rounded-xl shadow-lg border border-[#FFD700] hover:scale-105 transition cursor-pointer px-4">
                            <ShoppingBag className="w-3.5 h-3.5 mr-1" />
                            <span>Commander 1-Clic</span>
                          </Button>
                        </a>
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-[#FFD700] font-mono p-3 bg-[#181009] rounded-2xl border border-[#FFD700]/30 w-fit">
                <Stethoscope className="w-4 h-4 animate-spin text-[#FFD700]" />
                <span>Dr. Mama Kènè prépare votre réponse médicale...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── ⌨️ BARRE DE SAISIE MULTIMODALE INTERACTIVE ── */}
          <div className="bg-[#140C06] border-t-2 border-[#FFD700]/40 p-3 sm:p-4 shrink-0 shadow-2xl">
            <div className="max-w-4xl mx-auto flex items-center gap-2">
              
              {/* Note Vocale Button */}
              <button
                onClick={handleRecordAudioNote}
                className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition shrink-0 cursor-pointer ${
                  isRecordingAudio
                    ? 'bg-red-500 text-white border-red-500 animate-pulse scale-105'
                    : 'bg-[#1E140C] border-[#FFD700]/40 text-[#FFD700] hover:bg-[#2A1E14]'
                }`}
                title="Enregistrer Note Vocale Audio"
              >
                <Mic className="w-5 h-5" />
              </button>

              {/* Video Clip Request */}
              <button
                onClick={handleSendVideoClip}
                className="w-11 h-11 rounded-2xl bg-[#1E140C] border border-[#FFD700]/40 text-[#FFD700] hover:bg-[#2A1E14] flex items-center justify-center transition shrink-0 cursor-pointer"
                title="Demander Capsule Vidéo"
              >
                <Video className="w-5 h-5" />
              </button>

              {/* Photo Upload Input */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-11 h-11 rounded-2xl bg-[#1E140C] border border-white/15 text-white/70 hover:text-white flex items-center justify-center transition shrink-0 cursor-pointer"
                title="Envoyer une Photo Cutanée"
              >
                <Camera className="w-5 h-5 text-[#FFD700]" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />

              {/* Text Input */}
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendPatientText()}
                placeholder="Écrire un message ou SMS au Dr. Mama Kènè..."
                className="flex-1 bg-[#1E140C] border border-white/15 focus:border-[#FFD700] text-white px-4 h-11 rounded-2xl text-xs outline-none transition"
              />

              {/* Send Button */}
              <Button
                onClick={() => handleSendPatientText()}
                className="h-11 px-5 bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black text-xs rounded-2xl shadow-lg border border-[#FFD700] hover:scale-105 transition cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Envoyer</span>
              </Button>
            </div>
          </div>

        </main>
      </div>

    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-white font-mono">Chargement du Cockpit Télémédecine 3D...</div>}>
      <ChatContent />
    </Suspense>
  );
}
