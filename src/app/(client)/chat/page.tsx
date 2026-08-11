'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Send, Mic, Sparkles,
  Camera, Volume2, Globe, Sun, ShieldCheck, ShoppingBag, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ParticleOrb3D } from '@/components/ParticleOrb3D';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isAudio?: boolean;
  image?: string;
  prescription?: {
    title: string;
    items: { name: string; desc: string; price: number }[];
    totalPrice: number;
  };
  timestamp?: string;
}

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  
  // Interactive Voice & Speech State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mobileTab, setMobileTab] = useState<'vocal' | 'chat'>('vocal');
  const [selectedLanguage, setSelectedLanguage] = useState<'Français 🇫🇷' | 'Wolof 🇸🇳' | 'Bambara 🇲🇱' | 'Baoulé 🇨🇮'>('Français 🇫🇷');
  const [showLangMenu, setShowLangMenu] = useState(false);

  const LANGUAGES = ['Français 🇫🇷', 'Wolof 🇸🇳', 'Bambara 🇲🇱', 'Baoulé 🇨🇮'];

  // Initial Welcome Message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome-1',
      role: 'assistant',
      content: `Bonjour ! Je suis le Dr. Mama Kènè IA, la synergie unique entre la Dermatologie Clinique UEMOA & la Phytothérapie Sacrée Africaine.\n\nPosez-moi votre question de vive voix ou par écrit. Je vous conseille selon votre phototype cutané et la météo locale (32°C à Dakar / 85% d'humidité à Abidjan).`,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      prescription: {
        title: 'Routine Éclat Dermo-Botanique Conseillée',
        items: [
          { name: 'Beurre de Karité Brut Korhogo', desc: 'Hydratation profonde & barrière lipidique', price: 12500 },
          { name: 'Sérum Baobab 10% Niacinamide', desc: 'Régénération PIH & anti-taches', price: 18000 },
        ],
        totalPrice: 30500,
      },
    };

    setMessages([welcomeMessage]);
  }, [selectedLanguage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

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

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() && selectedImages.length === 0) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      image: selectedImages[0],
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');
    setSelectedImages([]);
    setLoading(true);
    setMobileTab('chat');

    setTimeout(() => {
      let aiText = `En analysant votre peau et les 32°C actuels à Dakar/Abidjan, je vous recommande d'appliquer le sérum au Baobab frais le soir pour éviter l'oxydation solaire. Scellez ensuite avec une fine touche de Beurre de Karité pur de Korhogo.`;
      
      let prescription: { title: string; items: { name: string; desc: string; price: number }[]; totalPrice: number } | undefined = undefined;

      if (textToSend.toLowerCase().includes('tache') || textToSend.toLowerCase().includes('bouton') || textToSend.toLowerCase().includes('pih')) {
        aiText = `Pour vos taches d'hyperpigmentation (PIH), la synergie de la Niacinamide 10% et de l'Extrait d'Hibiscus Bio régule la mélanine sans agresser le manteau acide épidermique. Appliquez le matin et scellez avec l'écran solaire minéral.`;
        prescription = {
          title: 'Ordonnance Dermo-Botanique Anti-Taches PIH',
          items: [
            { name: 'Sérum Hibiscus & Baobab Bio', desc: 'Régulateur de mélanine & AHA doux', price: 18500 },
            { name: 'Écran Minéral Protecteur SPF 50', desc: 'Filtre non blanchissant pour peaux mates', price: 15000 },
          ],
          totalPrice: 33500,
        };
      } else if (textToSend.toLowerCase().includes('karité') || textToSend.toLowerCase().includes('hydrat')) {
        aiText = `Le Beurre de Karité brut non raffiné de Korhogo est riche en insaponifiables et stérols végétaux. Il renforce la barrière cutanée face à l'humidité tropicale et prévient la déshydratation.`;
        prescription = {
          title: 'Prescription Hydratation Barrière Lipidique',
          items: [
            { name: 'Beurre de Karité Brut de Korhogo 100g', desc: 'Extraction à froid certifiée bio', price: 9500 },
          ],
          totalPrice: 9500,
        };
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: aiText,
        prescription: prescription,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
      speakText(aiText);
    }, 1100);
  };

  const handleStartVoice = () => {
    setIsListening(true);
    toast({
      title: "🎙️ Écoute Vocale Dr. Mama Kènè en cours...",
      description: "Posez votre question de vive voix...",
    });

    setTimeout(() => {
      setIsListening(false);
      handleSendMessage("Dr. Mama Kènè, comment traiter mes taches sur les joues avec cette chaleur ?");
    }, 2800);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setSelectedImages([reader.result as string]);
        toast({
          title: "📸 Cliché Cutané Chargé",
          description: "La photo de votre peau est prête pour l'analyse dermo-IA.",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full bg-[#0A0502] text-white flex flex-col font-sans selection:bg-[#FFD700] selection:text-black overflow-hidden">
      
      {/* ── 🌟 SINGLE-PAGE FIXED HEADER (NO PAGE SCROLL) ── */}
      <header className="h-14 sm:h-16 bg-[#140C06] border-b border-[#FFD700]/30 px-4 flex items-center justify-between shrink-0 shadow-lg z-30">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
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
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFD700] via-[#C8951E] to-[#8A1C14] p-[2px] shadow-md shrink-0">
                <div className="w-full h-full rounded-xl bg-[#0F0A05] flex items-center justify-center text-sm">
                  🩺
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="font-serif font-bold text-sm sm:text-base text-white leading-tight">
                    Dr. Mama Kènè <span className="text-[#FFD700]">IA</span>
                  </h1>
                  <Badge className="bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/40 text-[9px] font-mono font-bold hidden sm:inline-flex">
                    Dermo-Botanique 24/7
                  </Badge>
                </div>
                <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Dermatologie UEMOA
                </p>
              </div>
            </div>
          </div>

          {/* Right Language Menu & Mobile Switcher */}
          <div className="flex items-center gap-2">
            {/* Mobile View Tab Switcher (Orb vs Chat) */}
            <div className="md:hidden flex bg-[#1E140C] p-1 rounded-xl border border-[#FFD700]/30 text-xs">
              <button
                onClick={() => setMobileTab('vocal')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  mobileTab === 'vocal' ? 'bg-[#FFD700] text-black font-black' : 'text-white/70'
                }`}
              >
                🔮 Orb
              </button>
              <button
                onClick={() => setMobileTab('chat')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  mobileTab === 'chat' ? 'bg-[#FFD700] text-black font-black' : 'text-white/70'
                }`}
              >
                💬 Chat ({messages.length})
              </button>
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="px-2.5 py-1 rounded-xl bg-[#1E140C] border border-[#FFD700]/40 text-[11px] font-bold text-[#FFD700] flex items-center gap-1 hover:bg-[#2A1E14] transition cursor-pointer shadow-md"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{selectedLanguage}</span>
              </button>

              <AnimatePresence>
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 mt-2 w-40 bg-[#140C06] border border-[#FFD700]/40 rounded-2xl p-1.5 shadow-2xl z-50 text-xs"
                  >
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setSelectedLanguage(lang as any);
                          setShowLangMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition ${
                          selectedLanguage === lang
                            ? 'bg-[#FFD700] text-black font-black'
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* ── 🎛️ FULLSCREEN COCKPIT BODY (100% HEIGHT, 0 PAGE SCROLL) ── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-2 sm:p-4 gap-3 max-w-7xl mx-auto w-full">
        
        {/* ── LEFT PANEL: 3D VOICE ORB & WEATHER COCKPIT (Desktop 50%, Mobile Tab 'vocal') ── */}
        <div className={`md:flex flex-col justify-between md:w-5/12 lg:w-1/2 bg-gradient-to-b from-[#1C1108] via-[#140A04] to-[#0A0502] border-2 border-[#FFD700]/60 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden shrink-0 ${
          mobileTab === 'vocal' ? 'flex flex-1' : 'hidden'
        }`}>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FFD700]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Weather Status */}
          <div className="text-center space-y-1 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD700]/15 border border-[#FFD700]/40 text-[#FFD700] text-[11px] font-mono font-bold">
              <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
              <span>Dakar (32°C · UV 8) — Période Idéale Soin Sérum Baobab</span>
            </div>
          </div>

          {/* 3D WebGL Particle Sphere */}
          <div className="flex-1 flex items-center justify-center my-2 relative z-10">
            <ParticleOrb3D isListening={isListening} isSpeaking={isSpeaking} scrollProgress={0.5} />
          </div>

          {/* Interactive Voice Controls & Sample Questions */}
          <div className="space-y-3 relative z-10 text-center">
            <div className="space-y-0.5">
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-white">
                "Bonjour Aïsha, je vous écoute."
              </h2>
              <p className="text-[11px] text-white/70 italic">
                Appuyez sur le micro pour poser votre question de vive voix.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Button
                onClick={handleStartVoice}
                className="h-11 bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black text-xs rounded-2xl shadow-xl hover:scale-105 transition cursor-pointer px-6 border border-[#FFD700]"
              >
                <Mic className="w-4 h-4 mr-1.5 animate-pulse text-black" />
                <span>Consultation Vocale 🎙️</span>
              </Button>

              <Button
                onClick={() => fileInputRef.current?.click()}
                className="h-11 bg-[#2A1E14] border border-[#FFD700]/40 text-[#FFD700] font-bold text-xs rounded-2xl shadow-lg hover:bg-[#3E2B1D] transition cursor-pointer px-4"
              >
                <Camera className="w-4 h-4 mr-1 text-[#FFD700]" />
                <span>Photo 📸</span>
              </Button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="hidden sm:grid grid-cols-2 gap-1.5 pt-2 text-left">
              {[
                "Éliminer mes taches PIH",
                "Sérum au Baobab à Dakar",
                "Apaiser irritations braids",
                "Routine peau noire mixte",
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="text-left text-[10px] text-white/80 hover:text-white bg-[#1E140C] border border-white/10 hover:border-[#FFD700]/50 p-2 rounded-xl transition cursor-pointer truncate font-serif italic"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: INTERACTIVE CHAT STREAM & INPUT BAR (Desktop 50%, Mobile Tab 'chat') ── */}
        <div className={`flex-1 flex flex-col bg-[#140C06] border-2 border-[#FFD700]/50 rounded-3xl overflow-hidden shadow-2xl shrink-0 ${
          mobileTab === 'chat' ? 'flex flex-1' : 'hidden md:flex'
        }`}>
          
          {/* Internal Scrollable Message Stream */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 scrollbar-thin">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-xl rounded-2xl p-3.5 sm:p-4 shadow-lg space-y-2.5 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-medium border border-[#FFD700] rounded-br-none'
                    : 'bg-[#1D130B] border border-[#FFD700]/40 text-white rounded-bl-none'
                }`}>
                  
                  <div className="flex items-center justify-between border-b border-current/10 pb-1.5 text-[9px] font-mono">
                    <span className="font-bold">
                      {msg.role === 'user' ? '👤 Vous' : '🩺 Dr. Mama Kènè IA'}
                    </span>
                    <span className="opacity-70">{msg.timestamp}</span>
                  </div>

                  {msg.image && (
                    <div className="w-36 h-36 rounded-xl overflow-hidden border border-black/20 shadow-sm my-1">
                      <img src={msg.image} alt="Photo cutanée" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <p className="text-xs leading-relaxed font-sans font-medium whitespace-pre-line">
                    {msg.content}
                  </p>

                  {msg.role === 'assistant' && (
                    <div className="pt-1.5 border-t border-white/10 flex items-center justify-between">
                      <button
                        onClick={() => speakText(msg.content)}
                        className="text-[10px] font-bold text-[#FFD700] bg-[#FFD700]/15 border border-[#FFD700]/40 px-2.5 py-0.5 rounded-lg flex items-center gap-1 hover:bg-[#FFD700]/30 transition cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3 text-[#FFD700]" />
                        <span>Réponse Vocale</span>
                      </button>
                      <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Certifié UEMOA
                      </span>
                    </div>
                  )}

                  {/* Prescription Box */}
                  {msg.prescription && (
                    <div className="mt-2 bg-[#0F0A05] border border-[#FFD700]/50 rounded-xl p-3 space-y-2 text-white">
                      <div className="flex items-center justify-between border-b border-white/10 pb-1 text-[11px] font-bold text-[#FFD700]">
                        <span>🌱 {msg.prescription.title}</span>
                      </div>

                      <div className="space-y-1.5">
                        {msg.prescription.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-[#1A1410] p-2 rounded-lg text-[11px]">
                            <div>
                              <div className="font-bold text-white">{item.name}</div>
                              <div className="text-[9px] text-white/50">{item.desc}</div>
                            </div>
                            <span className="font-mono font-bold text-[#FFD700]">
                              {item.price.toLocaleString('fr-FR')} FCFA
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-1.5 flex items-center justify-between border-t border-white/10">
                        <span className="text-xs font-bold font-mono text-[#FFD700]">
                          {msg.prescription.totalPrice.toLocaleString('fr-FR')} FCFA
                        </span>
                        <a href={`/checkout?service=${encodeURIComponent(msg.prescription.title)}`}>
                          <Button className="h-8 bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black text-[11px] rounded-lg shadow-md border border-[#FFD700] hover:scale-105 transition cursor-pointer px-3">
                            <ShoppingBag className="w-3 h-3 mr-1" />
                            <span>Commander</span>
                          </Button>
                        </a>
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-[11px] text-[#FFD700] font-mono p-2.5 bg-[#181009] rounded-xl border border-[#FFD700]/30 w-fit">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-[#FFD700]" />
                <span>Dr. Mama Kènè IA consulte vos données dermo-botaniques...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Fixed Panel Bottom Input Bar */}
          <div className="p-2.5 sm:p-3 bg-[#1A1008] border-t border-[#FFD700]/30 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-xl bg-[#2A1E14] border border-white/15 text-[#FFD700] flex items-center justify-center transition shrink-0 cursor-pointer"
                title="Photo cutanée"
              >
                <Camera className="w-4 h-4" />
              </button>

              <button
                onClick={handleStartVoice}
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition shrink-0 cursor-pointer ${
                  isListening
                    ? 'bg-[#FFD700] text-black border-[#FFD700] animate-pulse scale-105'
                    : 'bg-[#2A1E14] border-[#FFD700]/40 text-[#FFD700]'
                }`}
                title="Parler à Mama Kènè"
              >
                <Mic className="w-4 h-4" />
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Posez votre question à Dr. Mama Kènè IA..."
                className="flex-1 bg-[#2A1E14] border border-white/15 focus:border-[#FFD700] text-white px-3 h-10 rounded-xl text-xs outline-none transition"
              />

              <Button
                onClick={() => handleSendMessage()}
                className="h-10 px-4 bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black text-xs rounded-xl shadow-md border border-[#FFD700] hover:scale-105 transition cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-white font-mono">Chargement du Cockpit Dr. Mama Kènè IA...</div>}>
      <ChatContent />
    </Suspense>
  );
}
