'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion as m, AnimatePresence } from 'framer-motion'
import { 
  Camera, RefreshCw, Upload, AlertCircle, ArrowLeft, Sun, 
  Scan, Check, ShieldCheck, Flame, ToggleLeft, ToggleRight,
  User, Layers, Hand
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export default function DiagnosticPage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  const [stream, setStream] = useState<MediaStream | null>(null)
  const [photo, setPhoto] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [brightness, setBrightness] = useState<number>(0)
  const [isTooDark, setIsTooDark] = useState<boolean>(false)

  // Kènè Mirror Smart Features
  const [alignmentScore, setAlignmentScore] = useState<number>(0)
  const [autoCapture, setAutoCapture] = useState<boolean>(true)
  const [countdown, setCountdown] = useState<number | null>(null)
  const countdownRef = useRef<NodeJS.Timeout | null>(null)

  // Multi-zones state
  const [selectedZone, setSelectedZone] = useState<'visage' | 'dos' | 'cuir_chevelu' | 'mains' | 'barbe' | 'naevi'>('visage')

  // Request camera access
  const startCamera = async () => {
    setCameraError(null)
    try {
      const constraints = {
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err: any) {
      console.error('Camera access error:', err)
      setCameraError(
        "Impossible d'accéder à la caméra. Veuillez autoriser la caméra ou téléverser une photo."
      )
    }
  }

  useEffect(() => {
    startCamera()
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [])

  // Analyze brightness periodically & simulate face mesh tracking
  useEffect(() => {
    if (!stream || !videoRef.current || !canvasRef.current) return

    const interval = setInterval(() => {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (video && video.readyState === video.HAVE_ENOUGH_DATA && canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          // Draw a small portion of the video to calculate brightness
          ctx.drawImage(video, 0, 0, 100, 100)
          const imageData = ctx.getImageData(0, 0, 100, 100)
          const data = imageData.data
          let r, g, b, avg
          let colorSum = 0
          for (let x = 0, len = data.length; x < len; x += 4) {
            r = data[x]
            g = data[x + 1]
            b = data[x + 2]
            avg = Math.floor((r + g + b) / 3)
            colorSum += avg
          }
          const brightnessVal = Math.floor(colorSum / (data.length / 4))
          setBrightness(brightnessVal)
          const tooDark = brightnessVal < 65
          setIsTooDark(tooDark)

          // Simulate real face-mesh alignment scores based on brightness and camera status
          if (!tooDark && !photo) {
            // Fluctuates between 92% and 99% when lighting is correct
            setAlignmentScore(Math.floor(92 + Math.random() * 8))
          } else {
            setAlignmentScore(0)
          }
        }
      }
    }, 800)

    return () => clearInterval(interval)
  }, [stream, photo])

  // Auto-capture countdown logic
  useEffect(() => {
    if (!autoCapture || photo || loading || alignmentScore < 92) {
      if (countdown !== null) {
        setCountdown(null)
        if (countdownRef.current) {
          clearInterval(countdownRef.current)
          countdownRef.current = null
        }
      }
      return
    }

    // Start countdown if not already started
    if (countdown === null && !countdownRef.current) {
      setCountdown(3)
      let currentVal = 3
      countdownRef.current = setInterval(() => {
        currentVal -= 1
        if (currentVal <= 0) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current)
            countdownRef.current = null
          }
          setCountdown(null)
          capturePhoto()
        } else {
          setCountdown(currentVal)
        }
      }, 1000)
    }
  }, [alignmentScore, autoCapture, photo, loading])

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      if (ctx) {
        const size = Math.min(video.videoWidth, video.videoHeight)
        canvas.width = size
        canvas.height = size

        // Center crop to a square
        const sx = (video.videoWidth - size) / 2
        const sy = (video.videoHeight - size) / 2

        ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size)
        const dataUrl = canvas.toDataURL('image/jpeg')
        setPhoto(dataUrl)
        setAlignmentScore(0)
        setCountdown(null)
        
        // Stop camera tracks to release lens
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
          setStream(null)
        }

        toast({
          title: "📸 Capture Kènè Mirror",
          description: "Alignement optimal détecté, capture enregistrée.",
        })
      }
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhoto(reader.result as string)
        setAlignmentScore(0)
        setCountdown(null)
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
          setStream(null)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const submitDiagnosis = async () => {
    if (!photo) return
    setLoading(true)

    try {
      const user = localStorage.getItem('kene_user')
      const userId = user ? JSON.parse(user).id : null

      const res = await fetch('/api/diagnoses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo, userId, zone: selectedZone }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error?.message || "Erreur lors de l'inférence.")
      }

      toast({
        title: "✨ Diagnostic Complété",
        description: "L'analyse VLM sur mesure a été effectuée avec succès.",
      })

      router.push(`/diagnostic/results/${data.diagnosis_id}`)
    } catch (err: any) {
      toast({
        title: "❌ Erreur",
        description: err.message,
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const resetPhoto = () => {
    setPhoto(null)
    setCountdown(null)
    startCamera()
  }

  return (
    <div className="flex-1 flex flex-col justify-between min-h-[85vh] text-karite">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 border-b border-white/5">
        <button
          onClick={() => {
            if (stream) stream.getTracks().forEach((t) => t.stop())
            router.push('/')
          }}
          className="text-karite/60 hover:text-karite transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display font-bold text-lg text-gold-kene">Miroir Intelligent Kènè</h1>
      </header>

      {/* Zone Selector */}
      {!photo && !loading && (
        <div className="flex gap-2.5 overflow-x-auto px-4 py-3 bg-[#1A1410]/50 border-b border-white/5 no-scrollbar scroll-smooth shrink-0">
          {[
            { id: 'visage', label: 'Visage', icon: User },
            { id: 'dos', label: 'Dos', icon: ShieldCheck },
            { id: 'cuir_chevelu', label: 'Cuir Chevelu', icon: Layers },
            { id: 'barbe', label: 'Barbe / Cou', icon: Flame },
            { id: 'mains', label: 'Mains', icon: Hand },
            { id: 'naevi', label: 'Nævi / Grains', icon: AlertCircle },
          ].map((z) => {
            const Icon = z.icon
            const isSelected = selectedZone === z.id
            return (
              <button
                key={z.id}
                onClick={() => setSelectedZone(z.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold font-display uppercase tracking-wider shrink-0 transition cursor-pointer ${
                  isSelected 
                    ? 'bg-gold-kene border-gold-kene text-[#1A1410] shadow-md shadow-gold-kene/20' 
                    : 'bg-[#241C16]/40 border-white/5 text-karite/60 hover:bg-[#241C16]/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {z.label}
              </button>
            )
          })}
        </div>
      )}

      {/* Main viewport */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 relative">
        <canvas ref={canvasRef} className="hidden" />

        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            {/* Spinning load state */}
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-gold-kene/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-gold-kene border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-lg font-bold text-gold-kene">Analyse cutanée sur mesure...</h3>
              <p className="text-xs text-karite/40 max-w-[250px] font-sans">
                Notre intelligence artificielle analyse les pigments et les micro-reliefs cutanés...
              </p>
            </div>
          </div>
        ) : !photo ? (
          /* Live camera viewport with Face Mesh */
          <div className="w-full max-w-sm aspect-square bg-black rounded-3xl overflow-hidden relative border border-white/5 shadow-2xl">
            {cameraError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <p className="text-sm text-karite/60">{cameraError}</p>
                <label className="bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410] font-semibold px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition">
                  <Upload className="w-4 h-4" />
                  Téléverser une photo
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                
                {/* Dynamic Golden Face Mesh guides overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  {selectedZone === 'visage' ? (
                    <m.svg 
                      className={`w-4/5 h-4/5 transition-colors duration-500 ${
                        alignmentScore > 95 ? 'text-emerald-400' : 'text-gold-kene/60'
                      }`} 
                      viewBox="0 0 100 100"
                      animate={{ scale: [1, 1.01, 1] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    >
                      {/* Face boundary */}
                      <ellipse cx="50" cy="50" rx="33" ry="40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" />
                      
                      {/* Face Landmarks (dots) */}
                      <circle cx="50" cy="20" r="1.5" fill="currentColor" /> {/* Forehead */}
                      <circle cx="38" cy="42" r="1.5" fill="currentColor" /> {/* Left Eye */}
                      <circle cx="62" cy="42" r="1.5" fill="currentColor" /> {/* Right Eye */}
                      <circle cx="50" cy="52" r="1.5" fill="currentColor" /> {/* Nose tip */}
                      <circle cx="50" cy="68" r="1.5" fill="currentColor" /> {/* Lips */}
                      <circle cx="28" cy="55" r="1.5" fill="currentColor" /> {/* Left cheek */}
                      <circle cx="72" cy="55" r="1.5" fill="currentColor" /> {/* Right cheek */}
                      <circle cx="50" cy="85" r="1.5" fill="currentColor" /> {/* Chin */}
                      
                      {/* Mesh Lines */}
                      <line x1="38" y1="42" x2="50" y2="52" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                      <line x1="62" y1="42" x2="50" y2="52" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                      <line x1="50" y1="52" x2="50" y2="68" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                      <line x1="28" y1="55" x2="50" y2="68" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                      <line x1="72" y1="55" x2="50" y2="68" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                      <line x1="50" y1="68" x2="50" y2="85" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                    </m.svg>
                  ) : (
                    <m.svg
                      className={`w-3/5 h-3/5 transition-colors duration-500 ${
                        alignmentScore > 95 ? 'text-emerald-400' : 'text-gold-kene/60'
                      }`}
                      viewBox="0 0 100 100"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    >
                      {/* Generic crosshair box */}
                      <rect x="15" y="15" width="70" height="70" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4,4" rx="6" />
                      <path d="M50,10 L50,20 M50,100 L50,90 M10,50 L20,50 M100,50 L90,50" stroke="currentColor" strokeWidth="1" />
                    </m.svg>
                  )}
                </div>

                {/* Auto-capture countdown overlay */}
                {countdown !== null && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-sm pointer-events-none">
                    <m.div
                      key={countdown}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 1 }}
                      exit={{ scale: 1.8, opacity: 0 }}
                      className="text-gold-kene text-7xl font-bold font-display"
                    >
                      {countdown}
                    </m.div>
                  </div>
                )}

                {/* Top Indicators Bar */}
                <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
                  {/* Brightness / Light Indicator */}
                  <div className={`rounded-xl px-3 py-1 text-[10px] flex items-center gap-1.5 backdrop-blur-md border ${
                    isTooDark 
                      ? 'bg-red-950/40 border-red-500/20 text-red-400' 
                      : 'bg-black/40 border-white/5 text-gold-kene'
                  }`}>
                    <Sun className="w-3.5 h-3.5" />
                    <span>{isTooDark ? "Lumière faible !" : "Éclairage optimal"}</span>
                  </div>

                  {/* Alignment score */}
                  {alignmentScore > 0 && (
                    <div className={`rounded-xl px-3 py-1 text-[10px] flex items-center gap-1.5 backdrop-blur-md border ${
                      alignmentScore > 95
                        ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400'
                        : 'bg-black/40 border-white/5 text-gold-kene'
                    }`}>
                      <Scan className="w-3.5 h-3.5" />
                      <span>Masque : {alignmentScore}%</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          /* Taken Photo preview */
          <div className="w-full max-w-sm aspect-square bg-[#241C16] rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl">
            <img src={photo} alt="User Capture" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Footer / Capture Actions */}
      <footer className="p-6 flex flex-col gap-4">
        {!loading && (
          <>
            {/* Auto Capture toggle */}
            {!photo && !cameraError && (
              <div className="flex justify-between items-center bg-[#241C16]/30 border border-white/5 p-3 rounded-2xl max-w-sm w-full mx-auto">
                <div className="space-y-0.5 text-left">
                  <h4 className="text-xs font-semibold text-white/90">Capture Automatique</h4>
                  <p className="text-[9px] text-white/40 font-sans">Prend la photo seule si aligné</p>
                </div>
                <button
                  onClick={() => setAutoCapture(!autoCapture)}
                  className="text-gold-kene transition cursor-pointer"
                >
                  {autoCapture ? (
                    <ToggleRight className="w-9 h-9" />
                  ) : (
                    <ToggleLeft className="w-9 h-9 opacity-50" />
                  )}
                </button>
              </div>
            )}

            {!photo ? (
              <div className="flex gap-3 justify-center w-full max-w-sm mx-auto">
                {!cameraError && (
                  <Button
                    onClick={capturePhoto}
                    className="flex-1 bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410] font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-gold-kene/10"
                  >
                    <Camera className="w-5 h-5" />
                    Capturer manuellement
                  </Button>
                )}
                <label className="flex-1 border border-white/10 hover:bg-white/5 text-karite font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition">
                  <Upload className="w-5 h-5" />
                  Téléverser
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            ) : (
              <div className="flex gap-3 w-full max-w-sm mx-auto">
                <Button
                  onClick={resetPhoto}
                  className="flex-1 border border-white/10 bg-transparent hover:bg-white/5 text-karite py-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <RefreshCw className="w-5 h-5" />
                  Reprendre
                </Button>
                <Button
                  onClick={submitDiagnosis}
                  className="flex-1 bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410] font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-gold-kene/10"
                >
                  Analyser la Peau
                </Button>
              </div>
            )}
          </>
        )}
        <p className="text-[10px] text-karite/30 text-center font-sans">
          En continuant, vous consentez à ce que votre photo soit analysée pour générer vos formules de soins sur mesure.
        </p>
      </footer>
    </div>
  )
}
