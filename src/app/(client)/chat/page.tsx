'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Send, Mic, Square, Sparkles, MessageCircle, 
  AlertCircle, Camera, Volume2, X 
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  isAudio?: boolean
  audioDuration?: string
  image?: string // Base64 data url
}

export default function ChatPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const diagnosisId = searchParams.get('diagnosisId')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasDiagnosis, setHasDiagnosis] = useState(false)

  // Audio Recording States
  const [isRecording, setIsRecording] = useState(false)
  const [recordSeconds, setRecordSeconds] = useState(0)
  const recordingTimer = useRef<NodeJS.Timeout | null>(null)

  // Image attachment state
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // TTS Voice player state
  const [playingIndex, setPlayingIndex] = useState<number | null>(null)
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Initial welcome message from Mama Kènè
    const welcomeText = diagnosisId
      ? "Bonjour ma fille ! J'ai bien reçu ton bilan de peau Kènè. Je vois que nous avons quelques marqueurs à aborder ensemble, notamment pour l'hyperpigmentation ou l'hydratation de ton teint mélanoderme. Que souhaites-tu que je t'explique en premier ?"
      : "Bonjour ma fille ! Je suis Mama Kènè. C'est un plaisir de t'accompagner. Parle-moi des habitudes de ta peau, de tes tiraillements, ou pose-moi tes questions sur nos plantes d'Afrique (karité, moringa, baobab). Comment puis-je t'aider aujourd'hui ?"

    setMessages([
      {
        role: 'assistant',
        content: welcomeText,
      },
    ])

    if (diagnosisId) {
      setHasDiagnosis(true)
    }
  }, [diagnosisId])

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Timer for audio recording
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

  // Cleanup audio when leaving page
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
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setSelectedImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const speak = async (text: string, index: number) => {
    if (playingIndex === index) {
      // Stop currently playing
      if (currentAudioRef.current) {
        currentAudioRef.current.pause()
        currentAudioRef.current = null
      }
      window.speechSynthesis.cancel()
      setPlayingIndex(null)
      return
    }

    // Reset previous playbacks
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
          // Native browser synthesis fallback
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
    if (!textToSend.trim() && !selectedImage) return

    const imgToSend = selectedImage

    const newMsg: ChatMessage = isAudio
      ? { role: 'user', content: `🎤 Note vocale (${formatTime(audioSecs)})`, isAudio: true, audioDuration: formatTime(audioSecs) }
      : { role: 'user', content: textToSend || "Photo d'imperfection attachée.", image: imgToSend || undefined }

    setMessages((prev) => [...prev, newMsg])
    setInput('')
    setSelectedImage(null)
    setLoading(true)

    // Call API
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
          content: "Désolée mon enfant, j'ai eu une petite hésitation. Peux-tu me répéter ta question ?",
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
      // Simulate sending a Wolof/Bambara transcribed voice note!
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
      {/* Top Navigation Header */}
      <header className="flex items-center justify-between p-4 border-b border-white/5 bg-[#241C16]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="text-karite/60 hover:text-karite transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          {/* Avatar and status */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gold-kene/20 border border-gold-kene/30 flex items-center justify-center text-gold-kene text-lg font-bold font-display">
              MK
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1A1410]" />
          </div>
          
          <div>
            <span className="font-display font-bold text-sm block text-karite">Mama Kènè</span>
            <span className="text-[10px] text-green-400 block font-sans">Conseillère Dermo-Botanique</span>
          </div>
        </div>

        {hasDiagnosis && (
          <div className="bg-gold-kene/10 border border-gold-kene/20 rounded-xl px-2.5 py-1 flex items-center gap-1.5 text-gold-kene text-[10px] font-semibold animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bilan Actif</span>
          </div>
        )}
      </header>

      {/* Messages Scroll Area */}
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
                
                {/* Text and speech synthesis triggers */}
                <div className="flex items-center gap-1.5 mt-1 px-1">
                  <span className="text-[9px] text-karite/30">
                    {isUser ? 'Vous' : 'Mama Kènè'}
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

      {/* Input / Control Bar */}
      <footer className="p-4 bg-[#241C16]/60 border-t border-white/5 sticky bottom-0 z-20 backdrop-blur-md space-y-3">
        {/* Selected Image Preview Panel */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex items-center justify-between bg-[#1A1410] border border-white/10 rounded-2xl p-2"
            >
              <div className="flex items-center gap-2">
                <img 
                  src={selectedImage} 
                  alt="Aperçu miniature" 
                  className="w-10 h-10 rounded-lg object-cover border border-white/5" 
                />
                <span className="text-[10px] text-karite/50 font-sans">Photo imperfection prête à l'analyse</span>
              </div>
              <button 
                onClick={() => setSelectedImage(null)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition cursor-pointer text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {isRecording ? (
          /* Waveform Recording Mode */
          <div className="flex items-center justify-between bg-red-950/20 border border-red-500/10 rounded-2xl p-3.5">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
              <span className="text-xs text-red-400 font-semibold font-mono">{formatTime(recordSeconds)}</span>
              <span className="text-[10px] text-karite/40">Enregistrement audio...</span>
            </div>
            
            {/* Visual pulsing waveform */}
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
          /* Standard text entry */
          <form onSubmit={handleSend} className="flex gap-2 items-center">
            {/* Camera / Photo Attachment trigger */}
            <input 
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-transparent hover:bg-white/5 border border-white/10 w-11 h-11 rounded-2xl flex items-center justify-center text-karite/70 hover:text-karite transition shrink-0 cursor-pointer"
              title="Ajouter une photo de tache ou bouton"
            >
              <Camera className="w-5 h-5 text-gold-kene" />
            </button>

            {/* Audio note trigger */}
            <button
              type="button"
              onClick={toggleRecording}
              className="bg-transparent hover:bg-white/5 border border-white/10 w-11 h-11 rounded-2xl flex items-center justify-center text-karite/70 hover:text-karite transition shrink-0 cursor-pointer"
              title="Enregistrer un message vocal (Wolof, Nouchi, Bambara)"
            >
              <Mic className="w-5 h-5 text-gold-kene" />
            </button>

            {/* Input field */}
            <input
              type="text"
              placeholder="Écrivez ou attachez une photo..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-[#1A1410] border border-white/10 text-sm rounded-2xl px-4 py-3 text-karite placeholder-white/20 focus:border-gold-kene outline-none transition font-sans"
              disabled={loading}
            />

            {/* Send button */}
            <Button
              type="submit"
              disabled={loading || (!input.trim() && !selectedImage)}
              className="bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410] rounded-2xl w-11 h-11 p-0 flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        )}
      </footer>
    </div>
  )
}
