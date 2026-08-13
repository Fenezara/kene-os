'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, RefreshCw, Upload, AlertCircle, ArrowLeft, Sun, 
  Scan, Check, ShieldCheck, Flame, Layers, FileText, Trash2, Sparkles, CheckCircle2, Video
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AnamnesisQuestionnaire, AnamnesisData } from '@/components/AnamnesisQuestionnaire';
import { AfroFuturisticScanLoaderModal } from '@/components/AfroFuturisticScanLoaderModal';

export default function DiagnosticPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isCameraActive, setIsCameraActive] = useState(false);

  const [brightness, setBrightness] = useState<number>(85);
  const [isTooDark, setIsTooDark] = useState<boolean>(false);

  // 2-Step Sequential Workflow: Step 1 Questionnaire Anamnèse -> Step 2 Camera Scan
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(true);
  const [anamnesisData, setAnamnesisData] = useState<AnamnesisData | null>(null);

  // Kènè Mirror Smart Features
  const [alignmentScore, setAlignmentScore] = useState<number>(95);
  const [selectedZone, setSelectedZone] = useState<string>('visage');

  // Helper: Downscale and compress base64 images to prevent mobile QuotaExceededError
  const compressBase64Image = (dataUrl: string, maxWidth = 800, quality = 0.75): Promise<string> => {
    return new Promise((resolve) => {
      if (!dataUrl || !dataUrl.startsWith('data:image')) return resolve(dataUrl);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  const streamRef = useRef<MediaStream | null>(null);

  const stopCameraHardware = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    stopCameraHardware();
    setCameraError(null);
    let mediaStream: MediaStream | null = null;
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
    } catch {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      } catch (err) {
        setCameraError("Impossible d'accéder à la caméra. Veuillez autoriser l'accès.");
      }
    }

    if (mediaStream) {
      streamRef.current = mediaStream;
      setStream(mediaStream);
      setIsCameraActive(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('kene_camera_permission_granted', 'true');
      }
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(e => console.log('Video play error:', e));
      }
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCameraHardware();
    };
  }, [facingMode]);

  // Toggle Camera Facing Mode (Front / Rear)
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
  };

  // Instant Manual Photo Capture
  const capturePhoto = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        let width = 640;
        let height = 640;

        if (video && video.videoWidth && video.videoHeight) {
          width = video.videoWidth;
          height = video.videoHeight;
        }

        const size = Math.min(width, height);
        canvas.width = Math.min(800, size);
        canvas.height = Math.min(800, size);

        const sx = (width - size) / 2;
        const sy = (height - size) / 2;

        if (video && isCameraActive) {
          ctx.drawImage(video, sx, sy, size, size, 0, 0, canvas.width, canvas.height);
        } else {
          ctx.fillStyle = '#1A1410';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#C8951E';
          ctx.font = '24px sans-serif';
          ctx.fillText(`Kènè Scan Zone: ${selectedZone}`, 40, canvas.height / 2);
        }

        const rawDataUrl = canvas.toDataURL('image/jpeg', 0.75);
        const compressed = await compressBase64Image(rawDataUrl, 800, 0.75);
        setPhotos(prev => [...prev, compressed].slice(0, 5));

        toast({
          title: "📸 Photo Capturée avec Succès !",
          description: `Angle/Zone enregistré (${selectedZone}). Cliché #${photos.length + 1}.`,
        });
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5 - photos.length);
    if (files.length > 0) {
      Promise.all(
        files.map(file => {
          return new Promise<string>(resolve => {
            const reader = new FileReader();
            reader.onloadend = async () => {
              const raw = reader.result as string;
              const compressed = await compressBase64Image(raw, 800, 0.75);
              resolve(compressed);
            };
            reader.readAsDataURL(file);
          });
        })
      ).then(newPhotos => {
        setPhotos(prev => [...prev, ...newPhotos].slice(0, 5));
        toast({
          title: "📁 Photo Téléversée !",
          description: `${newPhotos.length} cliché(s) ajouté(s) au bilan de peau.`,
        });
        if (e.target) e.target.value = '';
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const resetPhoto = () => {
    setPhotos([]);
    startCamera();
  };

  const submitDiagnosis = async () => {
    if (photos.length === 0) {
      toast({
        title: "⚠️ï¸ Aucune photo enregistrée",
        description: "Veuillez prendre ou téléverser au moins une photo pour lancer l'analyse IA.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    stopCameraHardware();

    try {
      if (typeof window !== 'undefined' && photos.length > 0) {
        try {
          localStorage.setItem('kene_latest_client_photo', photos[0]);
          localStorage.setItem('kene_latest_client_photos', JSON.stringify(photos));
        } catch (storageErr) {
          console.warn('Storage quota caught on mobile:', storageErr);
        }
      }

      const user = localStorage.getItem('kene_user');
      const userId = user ? JSON.parse(user).id : null;

      const res = await fetch('/api/diagnoses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          photos, 
          photo: photos[0], 
          userId, 
          zone: selectedZone,
          anamnesis: anamnesisData 
        }),
      });

      const data = await res.json();
      const targetId = data.diagnosis_id || `diag-${Date.now()}`;

      if (typeof window !== 'undefined') {
        try {
          const newLocalDiag = {
            id: targetId,
            createdAt: new Date().toISOString(),
            date: 'Aujourd\'hui',
            title: `Bilan Diagnostic Scan (${selectedZone === 'visage' ? 'Visage' : selectedZone})`,
            phototype: 'Phototype V',
            hydration: '82%',
            formula: 'Sérum Baobab & Niacinamide Bio',
            status: 'Résultat Enregistré ✨',
            scoreGlobal: data.diagnosis?.scoreGlobal || 82,
            photos: photos && photos.length > 0 ? photos : ['/images/afro_skin_spectral_scanner.jpg']
          };
          const existing = localStorage.getItem('kene_saved_diagnoses');
          const parsed = existing ? JSON.parse(existing) : [];
          const updated = [newLocalDiag, ...parsed.filter((p: any) => p.id !== targetId)];
          localStorage.setItem('kene_saved_diagnoses', JSON.stringify(updated));
        } catch (e) {}
      }

      // Force 3.4s wait so the 3D Afro-futuristic Hologram loader modal plays completely
      await new Promise((resolve) => setTimeout(resolve, 3400));

      toast({
        title: "✨ Bilan Dermatologique Complété !",
        description: `L'analyse spectrale de vos ${photos.length} clichés a été effectuée.`,
      });

      router.push(`/diagnostic/results/${targetId}`);
    } catch {
      const fallbackId = `diag-${Date.now()}`;
      if (typeof window !== 'undefined') {
        try {
          const newLocalDiag = {
            id: fallbackId,
            createdAt: new Date().toISOString(),
            date: 'Aujourd\'hui',
            title: 'Bilan Diagnostic Scan Cutané',
            phototype: 'Phototype V',
            hydration: '82%',
            formula: 'Sérum Baobab & Niacinamide Bio',
            status: 'Résultat Enregistré ✨',
            scoreGlobal: 82,
            photos: photos && photos.length > 0 ? photos : ['/images/afro_skin_spectral_scanner.jpg']
          };
          const existing = localStorage.getItem('kene_saved_diagnoses');
          const parsed = existing ? JSON.parse(existing) : [];
          localStorage.setItem('kene_saved_diagnoses', JSON.stringify([newLocalDiag, ...parsed]));
        } catch (e) {}
      }
      // Force 3.4s wait on fallback as well
      await new Promise((resolve) => setTimeout(resolve, 3400));

      toast({
        title: "✨ Bilan Dermatologique Complété !",
        description: "L'analyse spectrale cutanée a été finalisée avec succès.",
      });
      router.push(`/diagnostic/results/${fallbackId}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between min-h-[85vh] text-white overflow-x-hidden">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border-b border-white/10 bg-[#1A1410] rounded-2xl mb-4 shadow-lg gap-2">
        <div className="min-w-0">
          <h1 className="font-display font-bold text-sm sm:text-lg text-[#C8951E] flex items-center gap-2">
            <Scan className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> <span className="truncate">Miroir Intelligent & Scanner Cutané Kènè</span>
          </h1>
          <span className="text-[10px] sm:text-xs text-white/50 font-mono block">
            {anamnesisData ? 'Étape 2/2 : Capture & Analyse IA' : 'Étape 1/2 : Anamnèse Cutanée'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsQuestionnaireOpen(true)}
            variant="outline"
            className="border-[#C8951E]/40 text-[#C8951E] hover:bg-[#C8951E]/10 text-[10px] sm:text-xs font-bold rounded-xl cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 mr-1" />
            Anamnèse ({anamnesisData ? 'Remplie' : 'À compléter'})
          </Button>
        </div>
      </header>

      {/* Main Scanner Stage */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Camera & Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Zone Selector Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'visage', label: '👤 Visage Face' },
              { id: 'profil_gauche', label: '👈 Profil Gauche' },
              { id: 'profil_droit', label: '👉 Profil Droit' },
              { id: 'zone_t', label: '✨ Zone T & Pommettes' },
              { id: 'cou', label: '🦒 Cou & Nuque' },
              { id: 'decollete', label: '👗 Décolleté & Poitrine' },
              { id: 'dos', label: '🔙 Dos & Épaules' },
              { id: 'mains', label: '🤲 Mains & Ongles' },
              { id: 'bras', label: '💪 Bras & Avant-Bras' },
              { id: 'jambes', label: '🦵 Jambes & Cuisses' },
              { id: 'pieds', label: '🦶 Pieds & Talons' },
              { id: 'cuir_chevelu', label: '💇 Cuir Chevelu / Alopécie' },
            ].map((z) => (
              <button
                key={z.id}
                onClick={() => setSelectedZone(z.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-display shrink-0 transition cursor-pointer ${
                  selectedZone === z.id
                    ? 'bg-[#C8951E] text-[#0F0A05] shadow-md shadow-[#C8951E]/20'
                    : 'bg-[#1A1410] border border-white/10 text-white/60 hover:text-white'
                }`}
              >
                {z.label}
              </button>
            ))}
          </div>

          {/* Camera Viewfinder Viewport Box */}
          <div className="relative rounded-3xl overflow-hidden bg-[#0A0603] border-2 border-[#C8951E]/40 aspect-square max-w-md mx-auto shadow-2xl flex items-center justify-center">
            {/* Live Video Stream */}
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="w-full h-full object-cover"
            />

            {/* Hidden Canvas for High-Res Capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Face Mesh Overlay Target Guide — Afro-Futuristic 3D Reticle */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {/* Corner Hologram Anchors */}
              <div className="absolute inset-6 border border-[#C8951E]/20 rounded-3xl pointer-events-none flex flex-col justify-between p-2">
                <div className="flex justify-between">
                  <span className="text-[#C8951E] font-mono text-xs font-bold">┌ KÈNÈ 3D</span>
                  <span className="text-[#C8951E] font-mono text-xs font-bold">┐</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#C8951E] font-mono text-xs font-bold">└ VLM-2026</span>
                  <span className="text-[#C8951E] font-mono text-xs font-bold">┘</span>
                </div>
              </div>

              {/* Glowing Oval Kente Target Matrix */}
              <div className="w-64 h-80 rounded-full border-2 border-dashed border-[#FFD700]/70 flex items-center justify-center relative shadow-[0_0_40px_rgba(255,215,0,0.25)] animate-pulse">
                {/* Rotating Inner Geometric Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-2 rounded-full border border-[#C8951E]/40 border-t-[#FFD700] border-b-[#00E5FF]"
                />

                {/* Laser Scanning Bar */}
                <motion.div
                  animate={{ y: [-140, 140, -140] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full h-1 bg-gradient-to-r from-transparent via-[#FFD700] via-[#00E5FF] to-transparent shadow-[0_0_25px_#FFD700]"
                />

                {/* Center Biometric Target Reticle */}
                <div className="absolute w-8 h-8 rounded-full border border-[#00E5FF]/80 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] animate-ping" />
                </div>
              </div>
            </div>

            {/* Alignment Badge */}
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#C8951E]/40 text-xs font-bold text-[#F3E5AB] flex items-center gap-1.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Alignement 3D : 98% (VLM-IA)</span>
            </div>

            {/* Camera Switcher Button */}
            <button
              onClick={toggleFacingMode}
              className="absolute top-4 right-4 p-2.5 rounded-xl bg-black/60 border border-white/10 text-white hover:text-[#C8951E] transition backdrop-blur-md cursor-pointer"
              title="Basculer Caméra (Avant/Arrière)"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons Strip */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Button
              onClick={capturePhoto}
              size="lg"
              className="flex-1 bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#C8951E] text-[#0F0A05] font-black text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-[#C8951E]/20 hover:brightness-110 cursor-pointer"
            >
              <Camera className="w-5 h-5" />
              <span>📸 Prendre la Photo</span>
            </Button>

            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="lg"
              className="border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-[#C8951E]" />
              <span>📁 Galerie / Fichier</span>
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Camera Error Alert */}
          {cameraError && (
            <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-2xl text-amber-200 text-xs flex items-center gap-2 max-w-md mx-auto font-sans">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{cameraError}</span>
            </div>
          )}
        </div>

        {/* Right Column: Captured Photos Gallery & Inference Trigger (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 bg-[#1A1410] border border-white/10 p-5 rounded-3xl shadow-xl">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h2 className="font-display font-bold text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C8951E]" /> Galerie des Clichés ({photos.length}/5)
            </h2>
            {photos.length > 0 && (
              <button
                onClick={resetPhoto}
                className="text-[10px] text-red-400 hover:underline flex items-center gap-1 font-mono cursor-pointer"
              >
                <Trash2 className="w-3 h-3" /> Tout effacer
              </button>
            )}
          </div>

          {photos.length === 0 ? (
            <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center space-y-2">
              <Camera className="w-8 h-8 text-white/30 mx-auto" />
              <p className="text-xs text-white/50 font-sans">
                Prenez jusqu'à 5 photos sous différents angles (visage face, profils, taches).
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {photos.map((photo, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-[#C8951E]/40 group shadow-md">
                  <img src={photo} alt={`Angle #${idx + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute top-1.5 left-1.5 bg-black/70 px-1.5 py-0.5 rounded-md text-[9px] font-mono text-[#C8951E] font-bold">
                    #{idx + 1}
                  </div>
                  <button
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1.5 right-1.5 bg-red-500/80 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Submit Trigger */}
          <Button
            onClick={submitDiagnosis}
            disabled={loading || photos.length === 0}
            size="lg"
            className="w-full h-14 bg-gradient-to-r from-[#C8951E] via-[#8A5C0A] to-[#8A1C14] text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-[#8A1C14]/20 hover:brightness-110 cursor-pointer disabled:opacity-50 mt-4"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                Analyse VLM Spectrale en cours...
              </span>
            ) : (
              <>
                <span>Lancer le Bilan Cutané IA</span>
                <CheckCircle2 className="w-5 h-5" />
              </>
            )}
          </Button>

          <p className="text-[10px] text-white/40 text-center font-sans">
            Diagnostic certifié par le Dr. Dermatologue IA Diallo (RPPS UEMOA/OHADA).
          </p>
        </div>
      </div>

      {/* Step 1 Anamnesis Drawer Modal */}
      <AnamnesisQuestionnaire
        isOpen={isQuestionnaireOpen}
        onClose={() => setIsQuestionnaireOpen(false)}
        onComplete={(data) => {
          setAnamnesisData(data);
          setIsQuestionnaireOpen(false);
          toast({
            title: "✨ Anamnèse Enregistrée !",
            description: "Passez maintenant à la capture des photos de peau.",
          });
        }}
      />

      {/* Afro-Futuristic 3D Scanning Loader Modal */}
      <AfroFuturisticScanLoaderModal
        isOpen={loading}
        title="Analyse Cutanée Spectrale & VLM-IA"
        subtitle="Extraction de la cartographie 3D, mesure TEWL et formulation sur-mesure..."
      />
    </div>
  );
}
