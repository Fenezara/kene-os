'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Send, Mic, Square, Sparkles, 
  Camera, Volume2, X, Globe, Calendar, CreditCard, Droplet
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  isAudio?: boolean
  audioDuration?: string
  image?: string
}

function ChatContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const diagnosisId = searchParams.get('diagnosisId')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasDiagnosis, setHasDiagnosis] = useState(false)

  const [isRecording, setIsRecording] = useState(false)
  const [recordSeconds, setRecordSeconds] = useState(0)
  const recordingTimer = useRef<NodeJS.Timeout | null>(null)

  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [playingIndex, setPlayingIndex] = useState<number | null>(null)
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)

  const [selectedLanguage, setSelectedLanguage] = useState<'Français 🇫🇷' | 'Wolof 🇸🇳' | 'Bambara 🇲🇱' | 'Baoulé 🇨🇮'>('Français 🇫🇷')
  const [showLangMenu, setShowLangMenu] = useState(false)
  const modeParam = searchParams.get('mode')
  const [assistantMode, setAssistantMode] = useState<'awa' | 'dr_diallo' | 'praticienne'>(
    modeParam === 'awa' ? 'awa' : modeParam === 'praticienne' ? 'praticienne' : 'dr_diallo'
  )

  const LANGUAGES = ['Français 🇫🇷', 'Wolof 🇸🇳', 'Bambara 🇲🇱', 'Baoulé 🇨🇮']

  useEffect(() => {
    if (modeParam === 'awa') setAssistantMode('awa')
    else if (modeParam === 'praticienne') setAssistantMode('praticienne')
    else setAssistantMode('dr_diallo')
  }, [modeParam])

  useEffect(() => {
    const welcomeText = assistantMode === 'dr_diallo'
      ? diagnosisId
        ? `Bonjour ! Je suis le Dr. Aïssatou Diallo, Dermatologue Spécialiste Dermo-Cosmétique (UEMOA). J'ai sous les yeux votre bilan Kènè Pro. Posez-moi toutes vos questions médicales sur votre peau, vos taches PIH ou votre ordonnance.`
        : `Bonjour ! Je suis le Dr. Aïssatou Diallo, Dermatologue Spécialiste Dermo-Cosmétique pour peaux mélanodermes (Phototypes IV à VI). Vous pouvez me poser toutes vos questions médicales directement (taches PIH, boutons, cuir chevelu, alopécie de traction, irritations, produits). Comment puis-je vous aider aujourd'hui ?`
      : assistantMode === 'praticienne'
      ? `Bonjour ! Je suis Fatou Koné, votre praticienne esthéticienne attitrée au Salon Kènè Cocody. N'hésitez pas à me poser vos questions sur votre soin en cabine, vos teintes de braids ou à m'envoyer des photos avant votre rendez-vous.`
      : diagnosisId
      ? `Bonjour ! J'ai bien reçu ton bilan de peau Kènè. Je vois que nous avons quelques marqueurs à aborder. Que souhaites-tu que je t'explique en premier ? (${selectedLanguage})`
      : `Bonjour ! Je suis Awa, ton assistante beauté Kènè. C'est un plaisir de t'accompagner. Comment puis-je t'aider aujourd'hui ? (${selectedLanguage})`

    setMessages([
      {
        role: 'assistant',
        content: welcomeText,
      },
    ])

    if (diagnosisId) {
      setHasDiagnosis(true)
    }
  }, [diagnosisId, assistantMode, selectedLanguage])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (isRecording) {
      recordingTimer.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1)
      }, 1000)
    } else {
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current)
      }
      setRecordSeconds(0)
    }
    return () => {
      if (recordingTimer.current) clearInterval(recordingTimer.current)
    }
  }, [isRecording])

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
      if (currentAudioRef.current) {
        currentAudioRef.current.pause()
      }
    }
  }, [])

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      files.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setSelectedImages(prev => [...prev, reader.result as string].slice(0, 4))
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const speak = async (text: string, index: number) => {
    if (playingIndex === index) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause()
        currentAudioRef.current = null
      }
      window.speechSynthesis.cancel()
      setPlayingIndex(null)
      return
    }

    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current = null
    }
    window.speechSynthesis.cancel()
    setPlayingIndex(index)

    try {
      const res = await fetch('/api/chat/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = await res.json()

      if (data.success) {
        if (data.audio) {
          const audio = new Audio(data.audio)
          currentAudioRef.current = audio
          audio.onended = () => {
            setPlayingIndex(null)
          }
          audio.onerror = () => {
            setPlayingIndex(null)
          }
          audio.play()
          return
        } else if (data.speakText) {
          const utterance = new SpeechSynthesisUtterance(data.speakText)
          const voices = window.speechSynthesis.getVoices()
          const frVoice = voices.find((v) => v.lang.startsWith('fr'))
          if (frVoice) utterance.voice = frVoice

          utterance.onend = () => {
            setPlayingIndex(null)
          }
          utterance.onerror = () => {
            setPlayingIndex(null)
          }
          window.speechSynthesis.speak(utterance)
          return
        }
      }
    } catch (err) {
      console.error('[TTS ERROR]', err)
    }

    setPlayingIndex(null)
  }

  const handleSendMessage = async (textToSend: string, isAudio = false, audioSecs = 0) => {
    if (!textToSend.trim() && selectedImages.length === 0) return

    const imgToSend = selectedImages[0] || undefined

    const newMsg: ChatMessage = isAudio
      ? { role: 'user', content: `🎤 Note vocale (${formatTime(audioSecs)})`, isAudio: true, audioDuration: formatTime(audioSecs) }
      : { role: 'user', content: textToSend || `📸 ${selectedImages.length} Cliché${selectedImages.length > 1 ? 's' : ''} d'imperfection attaché${selectedImages.length > 1 ? 's' : ''}.`, image: imgToSend }

    setMessages((prev) => [...prev, newMsg])
    setInput('')
    setSelectedImages([])
    setLoading(true)

    try {
      const history = messages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
        image: m.image
      }))
      history.push({ 
        role: 'user', 
        content: textToSend || "Photo d'imperfection attachée.",
        image: imgToSend || undefined
      } as any)

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          diagnosisId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error?.message || 'Erreur de connexion.')
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply,
        },
      ])
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Désolée, j'ai eu une petite hésitation. Peux-tu me répéter ta question ?",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(input)
  }

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true)
    } else {
      setIsRecording(false)
      const simulatedTranscriptions = [
        "J'aimerais savoir comment utiliser le beurre de karité pour atténuer mes taches d'acné sur les joues.",
        "Est-ce que l'huile de baobab est bonne pour une peau mixte avec excès de sébum sur la zone T ?",
        "Mama Kènè, explique-moi ma routine pour traiter la déshydratation que l'IA a vue.",
      ]
      const randomText = simulatedTranscriptions[Math.floor(Math.random() * simulatedTranscriptions.length)]
      handleSendMessage(randomText, true, recordSeconds)
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-between h-[85vh] md:h-[90vh] text-karite relative bg-[#1A1410]/95">
      <header className="flex items-center justify-between p-4 border-b border-white/5 bg-[#241C16]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/portal')}
            className="text-karite/60 hover:text-karite transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold font-display border ${
              assistantMode === 'dr_diallo'
                ? 'bg-gradient-to-br from-emerald-500/20 to-teal-800/30 border-emerald-500/50 text-emerald-400'
                : assistantMode === 'praticienne'
                ? 'bg-gradient-to-br from-amber-500/20 to-amber-800/30 border-amber-500/50 text-amber-300'
                : 'bg-gold-kene/20 border-gold-kene/30 text-gold-kene'
            }`}>
              {assistantMode === 'dr_diallo' ? '🩺' : assistantMode === 'praticienne' ? '👩🏾‍⚕️' : 'AW'}
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1A1410]" />
          </div>
          
          <div>
            <span className="font-display font-bold text-sm block text-white flex items-center gap-1">
              {assistantMode === 'dr_diallo' ? 'Dr. Aïssatou Diallo' : assistantMode === 'praticienne' ? 'Fatou Koné' : 'Awa'}
            </span>
            <span className="text-[10px] text-emerald-400 block font-sans font-semibold">
              {assistantMode === 'dr_diallo' ? 'Dermatologue IA (RPPS/UEMOA)' : assistantMode === 'praticienne' ? 'Esthéticienne Salon Cocody' : 'Assistante Beauté Kènè'}
            </span>
          </div>
        </div>

        {/* Mode Switcher Toggle Chips */}
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl">
          <button
            onClick={() => setAssistantMode('dr_diallo')}
            className={`text-[9px] font-bold px-2 py-1 rounded-lg transition cursor-pointer ${
              assistantMode === 'dr_diallo'
                ? 'bg-emerald-500 text-[#1A1410] shadow-md'
                : 'text-white/50 hover:text-white'
            }`}
          >
            🩺 Dr. Diallo
          </button>
          <button
            onClick={() => setAssistantMode('praticienne')}
            className={`text-[9px] font-bold px-2 py-1 rounded-lg transition cursor-pointer ${
              assistantMode === 'praticienne'
                ? 'bg-[#C8951E] text-[#1A1410] shadow-md'
                : 'text-white/50 hover:text-white'
            }`}
          >
            👩🏾‍⚕️ Praticienne
          </button>
          <button
            onClick={() => setAssistantMode('awa')}
            className={`text-[9px] font-bold px-2 py-1 rounded-lg transition cursor-pointer ${
              assistantMode === 'awa'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-white/50 hover:text-white'
            }`}
          >
            🌿 Awa
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 text-[10px] bg-white/5 border border-white/10 px-2 py-1.5 rounded-lg text-white/70 hover:bg-white/10 transition"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{selectedLanguage.split(' ')[0]}</span>
            </button>
            <AnimatePresence>
              {showLangMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                  className="absolute right-0 top-full mt-2 bg-[#1A1410] border border-white/10 rounded-xl shadow-xl overflow-hidden min-w-[120px]"
                >
                  {LANGUAGES.map(lang => (
                    <button 
                      key={lang}
                      onClick={() => { setSelectedLanguage(lang as any); setShowLangMenu(false); }}
                      className={`w-full text-left px-3 py-2 text-[10px] hover:bg-white/5 transition ${selectedLanguage === lang ? 'text-gold-kene font-bold bg-white/5' : 'text-white/70'}`}
                    >
                      {lang}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {hasDiagnosis && (
            <div className="bg-gold-kene/10 border border-gold-kene/20 rounded-xl px-2.5 py-1 flex items-center gap-1.5 text-gold-kene text-[10px] font-semibold animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bilan Actif</span>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 flex flex-col scrollbar-none">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const isUser = msg.role === 'user'
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div
                  className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-xs md:text-sm font-sans shadow-md ${
                    isUser
                      ? 'bg-bogolan text-[#F8F1E4] rounded-tr-none'
                      : 'bg-[#241C16] text-[#F8F1E4] border border-white/5 rounded-tl-none'
                  }`}
                >
                  {msg.image && (
                    <img 
                      src={msg.image} 
                      alt="Imperfection attachée" 
                      className="max-w-full max-h-[160px] rounded-xl object-cover mb-2 border border-white/10" 
                    />
                  )}
                  <p className="leading-relaxed whitespace-pre-line">{msg.content}</p>
                </div>
                
                <div className="flex items-center gap-1.5 mt-1 px-1">
                  <span className="text-[9px] text-karite/30">
                    {isUser ? 'Vous' : 'Awa'}
                  </span>
                  {!isUser && (
                    <button
                      onClick={() => speak(msg.content, i)}
                      className={`p-1 rounded-md transition cursor-pointer ${
                        playingIndex === i ? 'bg-gold-kene/20 text-gold-kene' : 'text-karite/30 hover:text-gold-kene'
                      }`}
                      title="Écouter les conseils audio"
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${playingIndex === i ? 'animate-pulse' : ''}`} />
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {loading && (
          <div className="flex items-start space-y-1">
            <div className="bg-[#241C16] border border-white/5 text-[#F8F1E4] px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-md">
              <span className="w-1.5 h-1.5 bg-gold-kene rounded-full animate-bounce delay-75" />
              <span className="w-1.5 h-1.5 bg-gold-kene rounded-full animate-bounce delay-150" />
              <span className="w-1.5 h-1.5 bg-gold-kene rounded-full animate-bounce delay-300" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <footer className="p-4 bg-[#241C16]/60 border-t border-white/5 sticky bottom-0 z-20 backdrop-blur-md space-y-3">
        {/* Quick Actions */}
        {!isRecording && messages.length < 3 && (
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
            <button onClick={() => handleSendMessage("Réserver un Soin Karité")} className="flex-shrink-0 bg-[#1A1410] border border-white/10 px-3 py-1.5 rounded-full text-[10px] text-white/80 hover:bg-white/5 transition flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-gold-kene" /> Réserver un Soin Karité
            </button>
            <button onClick={() => handleSendMessage("Vérifier mes points")} className="flex-shrink-0 bg-[#1A1410] border border-white/10 px-3 py-1.5 rounded-full text-[10px] text-white/80 hover:bg-white/5 transition flex items-center gap-1.5">
              <CreditCard className="w-3 h-3 text-gold-kene" /> Vérifier mes points
            </button>
            <button onClick={() => handleSendMessage("Conseil Peau")} className="flex-shrink-0 bg-[#1A1410] border border-white/10 px-3 py-1.5 rounded-full text-[10px] text-white/80 hover:bg-white/5 transition flex items-center gap-1.5">
              <Droplet className="w-3 h-3 text-gold-kene" /> Conseil Peau
            </button>
          </div>
        )}



        {isRecording ? (
          <div className="flex items-center justify-between bg-red-950/20 border border-red-500/10 rounded-2xl p-3.5">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
              <span className="text-xs text-red-400 font-semibold font-mono">{formatTime(recordSeconds)}</span>
              <span className="text-[10px] text-karite/40">Enregistrement audio...</span>
            </div>
            
            <div className="flex gap-0.5 items-center px-4">
              <span className="w-1 h-3 bg-red-500/50 rounded animate-pulse" />
              <span className="w-1 h-5 bg-red-500/80 rounded animate-pulse delay-75" />
              <span className="w-1 h-4 bg-red-500 rounded animate-pulse delay-150" />
              <span className="w-1 h-6 bg-red-500 rounded animate-pulse delay-100" />
              <span className="w-1 h-2 bg-red-500/50 rounded animate-pulse delay-300" />
            </div>

            <Button
              onClick={toggleRecording}
              className="bg-red-600 hover:bg-red-500 text-white rounded-full w-10 h-10 p-0 flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Square className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Multi-Photo Preview Strip in Chat Input */}
            {selectedImages.length > 0 && (
              <div className="flex gap-2 p-2 bg-[#1A1410] border border-gold-kene/30 rounded-2xl overflow-x-auto">
                {selectedImages.map((img, idx) => (
                  <div key={idx} className="relative w-12 h-12 rounded-xl overflow-hidden border border-gold-kene shrink-0">
                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-600 text-white rounded-full flex items-center justify-center text-[8px] font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <span className="text-[10px] text-gold-kene font-mono self-center px-1">
                  {selectedImages.length} photo{selectedImages.length > 1 ? 's' : ''} prête{selectedImages.length > 1 ? 's' : ''}
                </span>
              </div>
            )}

            <form onSubmit={handleSend} className="flex gap-2 items-center">
              <input 
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-transparent hover:bg-white/5 border border-white/10 w-11 h-11 rounded-2xl flex items-center justify-center text-karite/70 hover:text-karite transition shrink-0 cursor-pointer"
                title="Ajouter des photos (multiples)"
              >
                <Camera className="w-5 h-5 text-gold-kene" />
              </button>

            <button
              type="button"
              onClick={toggleRecording}
              className="bg-transparent hover:bg-white/5 border border-white/10 w-11 h-11 rounded-2xl flex items-center justify-center text-karite/70 hover:text-karite transition shrink-0 cursor-pointer"
              title="Enregistrer un message vocal (Wolof, Nouchi, Bambara)"
            >
              <Mic className="w-5 h-5 text-gold-kene" />
            </button>

            <input
              type="text"
              placeholder="Écrivez ou attachez une photo..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-[#1A1410] border border-white/10 text-sm rounded-2xl px-4 py-3 text-karite placeholder-white/20 focus:border-gold-kene outline-none transition font-sans"
              disabled={loading}
            />

            <Button
              type="submit"
              disabled={loading || (!input.trim() && selectedImages.length === 0)}
              className="bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410] rounded-2xl w-11 h-11 p-0 flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          </div>
        )}
      </footer>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20 text-gold-kene">Chargement de l'assistant...</div>}>
      <ChatContent />
    </Suspense>
  )
}
