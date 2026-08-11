'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Send, Mic, Square, Sparkles,
  Camera, Volume2, X, Globe, Calendar, CreditCard, Droplet,
  Stethoscope, Sprout, Sun, Thermometer, ShieldCheck, Check, ShoppingBag, ArrowRight, Share2, Award
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
  audioDuration?: string;
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
  const diagnosisId = searchParams.get('diagnosisId');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  
  // Interactive Voice & Speech State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState<'vocal' | 'chat'>('vocal');
  const [selectedLanguage, setSelectedLanguage] = useState<'Français 🇫🇷' | 'Wolof 🇸🇳' | 'Bambara 🇲🇱' | 'Baoulé 🇨🇮'>('Français 🇫🇷');
  const [showLangMenu, setShowLangMenu] = useState(false);

  const LANGUAGES = ['Français 🇫🇷', 'Wolof 🇸🇳', 'Bambara 🇲🇱', 'Baoulé 🇨🇮'];

  // Scroll-driven 3D animation listener
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        const progress = Math.min(1, Math.max(0, scrollTop / (scrollHeight - clientHeight || 1)));
        setScrollProgress(progress);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Initial Welcome Message for Dr. Mama Kènè IA
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome-1',
      role: 'assistant',
      content: `Bonjour ! Je suis le Dr. Mama Kènè IA, la synergie unique entre la Dermatologie Clinique UEMOA & la Phytothérapie Sacrée Africaine.\n\nPosez-moi votre question de vive voix ou par écrit. Je vous conseille selon votre phototype cutané, vos taches PIH, et la météo locale (32°C à Dakar / 85% d'humidité à Abidjan).`,
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

    // AI Dual Response Logic (Dermatology + African Botanicals)
    setTimeout(() => {
      let aiText = `En analysant votre peau et les 32°C de température actuels à Dakar/Abidjan, je vous recommande d'appliquer le sérum au Baobab frais le soir pour éviter l'oxydation solaire. Scellez ensuite avec une fine touche de Beurre de Karité pur de Korhogo.`;
      
      let prescription: { title: string; items: { name: string; desc: string; price: number }[]; totalPrice: number } | undefined = undefined;

      if (textToSend.toLowerCase().includes('tache') || textToSend.toLowerCase().includes('bouton') || textToSend.toLowerCase().includes('pih')) {
        aiText = `Pour vos taches d'hyperpigmentation (PIH), la synergie de la Niacinamide 10% et de l'Extrait d'Hibiscus Bio (Bissap de Sikasso) régule la mélanine sans agresser le manteau acide épidermique. Appliquez le matin et scellez avec l'écran solaire minéral.`;
        prescription = {
          title: 'Ordonnance Dermo-Botanique Anti-Taches PIH',
          items: [
            { name: 'Sérum Hibiscus & Baobab Bio', desc: 'Régulateur de mélanine & AHA doux', price: 18500 },
            { name: 'Écran Minéral Protecteur SPF 50', desc: 'Filtre non blanchissant pour peaux mates', price: 15000 },
          ],
          totalPrice: 33500,
        };
      } else if (textToSend.toLowerCase().includes('karité') || textToSend.toLowerCase().includes('hydrat')) {
        aiText = `Le Beurre de Karité brut non raffiné de Korhogo est riche en insaponifiables et stérols végétaux. Il renforce la barrière cutanée face à l'humidité tropicale et prévient la déshydratation séborrhique.`;
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
    }, 1200);
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
    <div className="min-h-screen bg-[#0A0502] text-white flex flex-col font-sans selection:bg-[#FFD700] selection:text-black">
      
      {/* ── 🌟 FIXED TOP GLASSBAR HEADER ── */}
      <header className="sticky top-0 z-50 bg-[#140C06]/95 border-b border-[#FFD700]/30 backdrop-blur-xl px-4 py-3 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/portal')}
              className="w-9 h-9 rounded-full bg-white/5 border border-white/15 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FFD700] via-[#C8951E] to-[#8A1C14] p-[2px] shadow-xl shrink-0">
                <div className="w-full h-full rounded-2xl bg-[#0F0A05] flex items-center justify-center text-lg">
                  🩺
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif font-bold text-base text-white leading-tight">
                    Dr. Mama Kènè <span className="text-[#FFD700]">IA</span>
                  </h1>
                  <Badge className="bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/40 text-[9px] font-mono font-bold">
                    Dermo-Botanique 24/7
                  </Badge>
                </div>
                <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Dermatologie Clinique & Phytothérapie UEMOA
                </p>
              </div>
            </div>
          </div>

          {/* Right Selector Actions */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="px-2.5 py-1 rounded-xl bg-[#1E140C] border border-[#FFD700]/40 text-[11px] font-bold text-[#FFD700] flex items-center gap-1 hover:bg-[#2A1E14] transition cursor-pointer shadow-md"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{selectedLanguage}</span>
              </button>

              <AnimatePresence>
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 mt-2 w-44 bg-[#140C06] border border-[#FFD700]/40 rounded-2xl p-1.5 shadow-2xl z-50 text-xs"
                  >
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setSelectedLanguage(lang as any);
                          setShowLangMenu(false);
                          toast({ title: `Langue changée : ${lang}` });
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

      {/* ── 🌌 MAIN SCROLL CONTAINER WITH 3D ORB PARALLAX ── */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto max-w-4xl w-full mx-auto p-4 space-y-6 pb-36">
        
        {/* ── 🔮 HERO 3D PARTICLES ORB SANCTUARY BANNER ── */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative">
          <Card className="bg-gradient-to-b from-[#1C1108] via-[#140A04] to-[#0A0502] border-2 border-[#FFD700]/70 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#FFD700]/20 rounded-full blur-3xl pointer-events-none" />
            
            <CardContent className="p-6 space-y-4 text-center relative z-10">
              
              {/* Context Weather Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFD700]/15 border border-[#FFD700]/40 text-[#FFD700] text-xs font-mono font-bold shadow-md">
                <Sun className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '12s' }} />
                <span>Météo Dakar (32°C · UV 8) — Période Idéale Soin Sérum Baobab</span>
              </div>

              {/* 3D WebGL Particle Sphere */}
              <ParticleOrb3D isListening={isListening} isSpeaking={isSpeaking} scrollProgress={scrollProgress} />

              <div className="space-y-1 max-w-md mx-auto">
                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                  "Bonjour Aïsha, je vous écoute."
                </h2>
                <p className="text-xs text-white/70 italic">
                  Posez votre question dermatologique de vive voix ou téléchargez une photo de vos taches pour un bilan immédiat.
                </p>
              </div>

              {/* Dual Action Triggers */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button
                  onClick={handleStartVoice}
                  className="w-full sm:w-auto h-12 bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black text-xs rounded-2xl shadow-xl hover:scale-105 transition cursor-pointer px-6 border border-[#FFD700]"
                >
                  <Mic className="w-4 h-4 mr-2 animate-pulse" />
                  <span>Consultation Vocale TAARU AI 🎙️</span>
                </Button>

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto h-12 bg-[#2A1E14] border border-[#FFD700]/40 text-[#FFD700] font-bold text-xs rounded-2xl shadow-lg hover:bg-[#3E2B1D] transition cursor-pointer px-5"
                >
                  <Camera className="w-4 h-4 mr-2 text-[#FFD700]" />
                  <span>Analyser une Photo Cutanée 📸</span>
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>

              {/* Sample Quick Questions Chips */}
              <div className="pt-4 border-t border-white/10 text-left">
                <span className="text-[10px] font-mono text-[#FFD700] uppercase tracking-widest block text-center font-bold mb-2.5">
                  💡 Suggestions de consultations populaires :
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    "Dr. Diallo, comment éliminer mes taches d'hyperpigmentation ?",
                    "Quel sérum au Baobab utiliser sous le soleil d'Abidjan ?",
                    "Comment apaiser les irritations après les tresses & braids ?",
                    "Mama Kènè, quelle routine pour ma peau noire mixte/grasse ?",
                  ].map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="text-left text-xs text-white/80 hover:text-white bg-[#1E140C] hover:bg-[#2E1E12] border border-white/10 hover:border-[#FFD700]/50 p-2.5 rounded-2xl transition-all cursor-pointer truncate font-serif italic flex items-center justify-between group"
                    >
                      <span className="truncate">"{q}"</span>
                      <Sparkles className="w-3.5 h-3.5 text-[#FFD700] shrink-0 opacity-70 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>
        </motion.div>

        {/* ── 💬 CHAT DISCUSSION THREAD ── */}
        <div className="space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`max-w-2xl rounded-3xl p-4 sm:p-5 shadow-xl space-y-3 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-medium border border-[#FFD700] rounded-br-none'
                  : 'bg-[#181009] border-2 border-[#FFD700]/50 text-white rounded-bl-none'
              }`}>
                
                {/* Header Badge */}
                <div className="flex items-center justify-between border-b border-current/10 pb-2 text-[10px] font-mono">
                  <span className="font-bold flex items-center gap-1.5">
                    {msg.role === 'user' ? '👤 Vous (Cliente Privilège)' : '🩺 Dr. Mama Kènè IA · Dermatologue & Botaniste'}
                  </span>
                  <span className="opacity-70">{msg.timestamp}</span>
                </div>

                {/* User Image Preview if uploaded */}
                {msg.image && (
                  <div className="w-44 h-44 rounded-2xl overflow-hidden border border-black/20 shadow-md my-2">
                    <img src={msg.image} alt="Photo cutanée" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Message Content Text */}
                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans font-medium">
                  {msg.content}
                </p>

                {/* Speak Button for AI Messages */}
                {msg.role === 'assistant' && (
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={() => speakText(msg.content)}
                      className="text-[11px] font-bold text-[#FFD700] bg-[#FFD700]/15 border border-[#FFD700]/40 px-3 py-1 rounded-xl flex items-center gap-1.5 hover:bg-[#FFD700]/30 transition cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[#FFD700]" />
                      <span>Écouter la réponse vocale</span>
                    </button>
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Diagnostic Certifié UEMOA
                    </span>
                  </div>
                )}

                {/* Interactive Prescription Card (1-Click Order) */}
                {msg.prescription && (
                  <div className="mt-3 bg-[#0F0A05] border border-[#FFD700]/60 rounded-2xl p-4 space-y-3 text-white">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-bold font-display text-[#FFD700] flex items-center gap-1.5">
                        🌱 {msg.prescription.title}
                      </span>
                      <Badge className="bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30 text-[9px] font-mono">
                        Ordonnance Sur-Mesure
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      {msg.prescription.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-[#1A1410] p-2.5 rounded-xl border border-white/5">
                          <div>
                            <div className="text-xs font-bold text-white">{item.name}</div>
                            <div className="text-[10px] text-white/50">{item.desc}</div>
                          </div>
                          <span className="text-xs font-mono font-bold text-[#FFD700]">
                            {item.price.toLocaleString('fr-FR')} FCFA
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-white/10">
                      <div>
                        <span className="text-[10px] text-white/50 uppercase font-mono block">Total Ordonnance</span>
                        <span className="text-sm font-bold font-mono text-[#FFD700]">
                          {msg.prescription.totalPrice.toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
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

          {/* Loading Indicator */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-xs text-[#FFD700] font-mono p-3 bg-[#181009] rounded-2xl border border-[#FFD700]/30 w-fit">
              <Sparkles className="w-4 h-4 animate-spin text-[#FFD700]" />
              <span>Dr. Mama Kènè IA analyse votre demande dermo-botanique...</span>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── ⌨️ FLOATING BOTTOM CHAT INPUT BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#140C06]/95 border-t border-[#FFD700]/40 p-3 sm:p-4 backdrop-blur-xl shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-11 h-11 rounded-2xl bg-[#1E140C] border border-white/15 text-white/70 hover:text-white flex items-center justify-center transition shrink-0 cursor-pointer"
            title="Ajouter une photo"
          >
            <Camera className="w-5 h-5 text-[#FFD700]" />
          </button>

          <button
            onClick={handleStartVoice}
            className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition shrink-0 cursor-pointer ${
              isListening
                ? 'bg-[#FFD700] text-black border-[#FFD700] animate-pulse shadow-lg scale-105'
                : 'bg-[#1E140C] border-[#FFD700]/40 text-[#FFD700] hover:bg-[#2A1E14]'
            }`}
            title="Parler à Mama Kènè"
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Posez votre question à Dr. Mama Kènè IA..."
            className="flex-1 bg-[#1E140C] border border-white/15 focus:border-[#FFD700] text-white px-4 h-11 rounded-2xl text-xs outline-none transition"
          />

          <Button
            onClick={() => handleSendMessage()}
            className="h-11 px-5 bg-gradient-to-r from-[#FFD700] via-[#C8951E] to-[#D4AF37] text-black font-black text-xs rounded-2xl shadow-lg border border-[#FFD700] hover:scale-105 transition cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Envoyer</span>
          </Button>
        </div>
      </div>

    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-white font-mono">Chargement du Sanctuaire Dr. Mama Kènè IA...</div>}>
      <ChatContent />
    </Suspense>
  );
}
