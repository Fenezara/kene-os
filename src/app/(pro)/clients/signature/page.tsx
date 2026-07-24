'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { PenTool, CheckCircle2, RotateCcw, ShieldCheck, ArrowLeft, FileCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function ClientSignaturePage() {
  const router = useRouter();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [clientName, setClientName] = useState('Awa Diallo');
  const [careType, setCareType] = useState('Soin Peeling Doux AHA & Micro-Needling Botanique');
  const [savedConsent, setSavedConsent] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  // Drawing Canvas Handlers (Mouse & Touch)
  const startDrawing = (e: any) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = '#C8951E'; // Gold Kènè signature line
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSaveSignature = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const signatureBase64 = canvas.toDataURL('image/png');

    setSubmitting(true);
    try {
      const res = await fetch('/api/clients/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          careType,
          signatureBase64,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSavedConsent(data.consent);
        toast({
          title: "✍️ Signature enregistrée",
          description: "Le consentement éclairé est archivé dans la fiche client.",
        });
      }
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible d'enregistrer la signature.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 text-white min-h-full max-w-2xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/clients" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition">
            <ArrowLeft className="w-4 h-4" />
          </a>
          <div>
            <h1 className="text-2xl font-display font-bold text-white tracking-tight">
              Consentement Éclairé <span className="text-[var(--gold-kene)]">Tactile</span>
            </h1>
            <p className="text-xs text-karite/80 mt-1">Fiche de consentement numérique pour soins dermo-botaniques.</p>
          </div>
        </div>
      </motion.div>

      {savedConsent ? (
        <Card className="bg-[#241C16] border-emerald-500/30 text-white p-6 rounded-3xl space-y-6">
          <div className="flex items-center gap-3 text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
            <div>
              <h3 className="font-bold text-base font-display text-white">Consentement Certifié & Archivé</h3>
              <span className="text-xs text-karite/60 font-mono">N° {savedConsent.id} • {new Date(savedConsent.signedAt).toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-[#1A1410] p-4 rounded-2xl border border-[#362A21] space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-karite/60">Client :</span>
              <span className="font-bold text-white">{savedConsent.clientName}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-karite/60">Type de Soin :</span>
              <span className="font-bold text-[var(--gold-kene)]">{savedConsent.careType}</span>
            </div>
            <div className="border-t border-[#362A21] pt-3">
              <span className="text-[10px] text-karite/60 uppercase block mb-2">Signature Tactile Archivée :</span>
              <img src={savedConsent.signatureBase64} alt="Signature Client" className="h-20 bg-[#241C16] p-2 rounded-xl border border-[#362A21] mx-auto" />
            </div>
          </div>

          <Button onClick={() => setSavedConsent(null)} className="w-full bg-[var(--gold-kene)] text-[#1A1410] hover:bg-[#D4AF37]/90 font-bold">
            Faire signer un nouveau soin
          </Button>
        </Card>
      ) : (
        <Card className="bg-[#241C16] border-[#362A21] p-6 rounded-3xl space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-karite/80">Nom & Prénom du Client</Label>
              <Input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="bg-[#1A1410] border-[#362A21] text-white text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-karite/80">Soin / Protocole Concerné</Label>
              <Input
                value={careType}
                onChange={(e) => setCareType(e.target.value)}
                className="bg-[#1A1410] border-[#362A21] text-white text-xs"
              />
            </div>

            {/* Legal terms disclaimer box */}
            <div className="bg-[#1A1410] p-4 rounded-2xl border border-[#362A21] text-xs text-karite/80 leading-relaxed space-y-2">
              <span className="font-bold text-white block uppercase tracking-wider text-[10px] text-[var(--gold-kene)]">
                Engagement & Information Préalable
              </span>
              <p>
                Je soussigné(e) **{clientName}** certifie avoir été informé(e) de la nature du soin dermo-botanique, des produits utilisés (acides botaniques, huiles végétales bio) ainsi que des consignes post-séance. J'autorise l'application du soin Kènè.
              </p>
            </div>

            {/* Tactile Signature Pad Canvas */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs text-karite/80 flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-[var(--gold-kene)]" /> Zone de Signature Tactile
                </Label>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="text-xs text-karite/60 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Effacer
                </button>
              </div>

              <div className="bg-[#1A1410] rounded-2xl border border-[var(--gold-kene)]/40 p-1 relative overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={550}
                  height={160}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-40 bg-[#1A1410] rounded-xl cursor-crosshair touch-none"
                />
                <span className="absolute bottom-2 right-3 text-[9px] text-karite/30 font-mono pointer-events-none">
                  Signez avec le doigt ou le stylet
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSaveSignature}
              disabled={submitting}
              className="w-full bg-[var(--gold-kene)] text-[#1A1410] hover:bg-[#D4AF37]/90 font-bold py-3 rounded-2xl text-xs"
            >
              {submitting ? 'Validation...' : 'Valider & Archiver le Consentement'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
