'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

interface OTPAuthProps {
  onSuccess: (user: any) => void
}

export default function OTPAuth({ onSuccess }: OTPAuthProps) {
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+225') // Default Ivory Coast
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'phone' | 'verify'>('phone')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [otpRequestId, setOtpRequestId] = useState('')
  const [simulatedCode, setSimulatedCode] = useState('')
  const { toast } = useToast()

  const fullPhoneNumber = `${countryCode}${phone.replace(/\s+/g, '')}`

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || phone.length < 8) {
      setError('Veuillez saisir un numéro de téléphone valide.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhoneNumber }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error?.message || 'Une erreur est survenue.')
      }

      setOtpRequestId(data.otp_request_id)
      setSimulatedCode(data.simulated_code)
      setStep('verify')

      // Notify the tester with the simulated code
      toast({
        title: "🔑 Code OTP Envoyé (Simulé)",
        description: `Entrez le code : ${data.simulated_code} pour vous connecter.`,
        duration: 10000,
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (code: string) => {
    if (code.length !== 6) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otp_request_id: otpRequestId,
          code,
          phone: fullPhoneNumber,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error?.message || 'Code incorrect ou expiré.')
      }

      toast({
        title: "🎉 Connexion réussie",
        description: `Bienvenue sur Kènè, ${data.user.firstName || 'cliente'} !`,
      })

      onSuccess(data.user)
    } catch (err: any) {
      setError(err.message)
      setOtp('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <AnimatePresence mode="wait">
        {step === 'phone' ? (
          <motion.div
            key="phone-step"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold font-display text-gold-kene mb-2">Entrez dans le Cercle</h2>
              <p className="text-sm text-karite/60 font-sans">
                Saisissez votre numéro de téléphone pour recevoir votre code d'accès gratuit Kènè.
              </p>
            </div>

            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="flex gap-2">
                {/* Country Code Select */}
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-[#241C16] border border-white/10 rounded-xl text-karite text-sm px-3 py-2 outline-none focus:border-gold-kene transition font-sans"
                >
                  <option value="+225">🇨🇮 +225</option>
                  <option value="+221">🇸🇳 +221</option>
                </select>

                {/* Phone Input */}
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-white/40">
                    <Phone className="w-4 h-4" />
                  </span>
                  <Input
                    type="tel"
                    placeholder="07 08 09 10 11"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-9 bg-[#241C16] border-white/10 text-karite placeholder-white/20 rounded-xl outline-none focus:border-gold-kene transition font-sans"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 text-red-400 bg-red-950/20 border border-red-500/10 rounded-xl p-3 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gold-kene hover:bg-gold-kene/90 text-[#1A1410] font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition"
              >
                {loading ? 'Envoi en cours...' : 'Obtenir mon code'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="verify-step"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold font-display text-gold-kene mb-2">Vérification</h2>
              <p className="text-sm text-karite/60 font-sans">
                Un code à 6 chiffres a été envoyé au <span className="text-karite font-semibold">{fullPhoneNumber}</span>.
              </p>
            </div>

            <div className="space-y-6 flex flex-col items-center w-full">
              {/* input-otp component from shadcn */}
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(val) => {
                  setOtp(val)
                  if (val.length === 6) {
                    handleVerifyOTP(val)
                  }
                }}
                containerClassName="gap-2"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="border-white/10 text-lg bg-[#241C16] text-karite w-10 h-12" />
                  <InputOTPSlot index={1} className="border-white/10 text-lg bg-[#241C16] text-karite w-10 h-12" />
                  <InputOTPSlot index={2} className="border-white/10 text-lg bg-[#241C16] text-karite w-10 h-12" />
                  <InputOTPSlot index={3} className="border-white/10 text-lg bg-[#241C16] text-karite w-10 h-12" />
                  <InputOTPSlot index={4} className="border-white/10 text-lg bg-[#241C16] text-karite w-10 h-12" />
                  <InputOTPSlot index={5} className="border-white/10 text-lg bg-[#241C16] text-karite w-10 h-12" />
                </InputOTPGroup>
              </InputOTP>

              {simulatedCode && (
                <div className="text-center bg-[#C8951E]/10 border border-[#C8951E]/20 rounded-xl p-3 text-xs text-gold-kene w-full flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Code de test : <strong className="text-sm font-mono tracking-wider">{simulatedCode}</strong></span>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2 text-red-400 bg-red-950/20 border border-red-500/10 rounded-xl p-3 text-xs w-full">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-between items-center w-full text-xs font-sans text-karite/40">
                <button
                  onClick={() => setStep('phone')}
                  type="button"
                  className="hover:text-karite transition"
                >
                  Modifier le numéro
                </button>
                <button
                  onClick={handleSendOTP}
                  type="button"
                  className="hover:text-karite text-gold-kene transition"
                >
                  Renvoyer le code
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
