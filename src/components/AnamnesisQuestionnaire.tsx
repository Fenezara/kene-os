'use client'

import React, { useState } from 'react'
import { motion as m, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, Check, ChevronRight, ChevronLeft, ShieldCheck, 
  Sun, Droplets, Heart, FileText, Sprout, AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface AnamnesisData {
  primaryGoal: string
  skinType: string
  sunExposure: string
  waterIntake: string
  currentProducts: string[]
  depigmentationHistory: boolean
  hairProtection: string
  climate: string
}

interface AnamnesisQuestionnaireProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (data: AnamnesisData) => void
}

export function AnamnesisQuestionnaire({ isOpen, onClose, onComplete }: AnamnesisQuestionnaireProps) {
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState<AnamnesisData>({
    primaryGoal: 'Atténuer les taches PIH & uniformiser le teint',
    skinType: 'Mixte à grasse (Zone T luisante)',
    sunExposure: '1h à 3h par jour',
    waterIntake: '1.5L à 2L par jour',
    currentProducts: ['Gel Nettoyant', 'Écran Solaire SPF50'],
    depigmentationHistory: false,
    hairProtection: 'Tresses & Braids protectrices',
    climate: 'Chaud & Humide (ex: Abidjan, Cotonou, Lomé)'
  })

  if (!isOpen) return null

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
    else onComplete(formData)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const toggleProduct = (product: string) => {
    setFormData(prev => ({
      ...prev,
      currentProducts: prev.currentProducts.includes(product)
        ? prev.currentProducts.filter(p => p !== product)
        : [...prev.currentProducts, product]
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
      <m.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#1A1410] border border-[var(--gold-kene)]/30 rounded-2xl sm:rounded-3xl p-3 sm:p-6 w-[96vw] max-w-lg shadow-2xl space-y-4 sm:space-y-6 text-white overflow-x-hidden overflow-y-auto max-h-[92vh] relative"
      >
        {/* Top Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[var(--gold-kene)] font-bold uppercase tracking-wider font-display flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Bilan d'Anamnèse Cutanée ({step}/4)
            </span>
            <span className="text-white/40 font-mono">{step * 25}% complété</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[var(--gold-kene)] to-[#E25C80] transition-all duration-300" 
              style={{ width: `${step * 25}%` }}
            />
          </div>
        </div>

        {/* STEP 1: OBJECTIFS ET TYPE DE PEAU */}
        {step === 1 && (
          <m.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
            <h3 className="font-display font-bold text-base text-white">
              Étape 1 : Quel est votre objectif prioritaire ?
            </h3>

            <div className="space-y-2">
              {[
                'Atténuer les taches PIH & uniformiser le teint',
                'Réduire les pores dilatés & comédons (Zone T)',
                'Hydrater en profondeur & booster l\'éclat botanic',
                'Lisser les ridules & maintenir la fermeté du derme',
                'Apaiser les rougeurs & la sensibilité cutanée'
              ].map((goal) => (
                <button
                  key={goal}
                  onClick={() => setFormData({ ...formData, primaryGoal: goal })}
                  className={`w-full p-3 rounded-2xl text-xs text-left transition font-semibold flex items-center justify-between border cursor-pointer ${
                    formData.primaryGoal === goal
                      ? 'bg-[var(--gold-kene)] text-[#1A1410] border-[var(--gold-kene)] font-bold shadow-md'
                      : 'bg-white/5 text-white/80 border-white/10 hover:border-white/20'
                  }`}
                >
                  <span>{goal}</span>
                  {formData.primaryGoal === goal && <Check className="w-4 h-4 shrink-0" />}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="text-xs text-white/60 font-semibold block mb-2">Type de PeauRessenti :</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['Normale', 'Sèche', 'Mixte à Grasse', 'Trés Grasse'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFormData({ ...formData, skinType: st })}
                    className={`p-2.5 rounded-xl border text-center font-semibold cursor-pointer ${
                      formData.skinType === st
                        ? 'bg-gold-kene/20 border-[var(--gold-kene)] text-[var(--gold-kene)]'
                        : 'bg-white/5 border-white/10 text-white/60'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </m.div>
        )}

        {/* STEP 2: ANTECEDENTS ET ROUTINE */}
        {step === 2 && (
          <m.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
            <h3 className="font-display font-bold text-base text-white">
              Étape 2 : Votre routine & antécédents cosmétiques
            </h3>

            <div>
              <label className="text-xs text-white/60 font-semibold block mb-2">Produits actuels dans votre salle de bain :</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['Gel Nettoyant', 'Savon Noir Pur', 'Écran Solaire SPF50', 'Beurre de Karité Brut', 'Sérum AHA/BHA', 'Huiles Végétales'].map((p) => (
                  <button
                    key={p}
                    onClick={() => toggleProduct(p)}
                    className={`p-2.5 rounded-xl border text-left font-semibold cursor-pointer flex justify-between items-center ${
                      formData.currentProducts.includes(p)
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-white/60'
                    }`}
                  >
                    <span>{p}</span>
                    {formData.currentProducts.includes(p) && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 bg-white/5 p-3.5 rounded-2xl border border-white/10 space-y-2">
              <span className="text-xs text-white/80 font-semibold block">Avez-vous des antécédents de dépigmentation ou blanchiment ?</span>
              <div className="flex gap-3 text-xs">
                <button
                  onClick={() => setFormData({ ...formData, depigmentationHistory: false })}
                  className={`flex-1 py-2 rounded-xl font-bold border cursor-pointer ${
                    !formData.depigmentationHistory ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/10 text-white/50'
                  }`}
                >
                  Non (Peau Naturelle)
                </button>
                <button
                  onClick={() => setFormData({ ...formData, depigmentationHistory: true })}
                  className={`flex-1 py-2 rounded-xl font-bold border cursor-pointer ${
                    formData.depigmentationHistory ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-white/5 border-white/10 text-white/50'
                  }`}
                >
                  Oui (Passé/Actuel)
                </button>
              </div>
            </div>
          </m.div>
        )}

        {/* STEP 3: MODE DE VIE ET ENVIRONNEMENT */}
        {step === 3 && (
          <m.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
            <h3 className="font-display font-bold text-base text-white">
              Étape 3 : Mode de vie & Climat Africain
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-white/60 font-semibold block mb-1 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" /> Exposition Solaire Quotidienne :
                </label>
                <select 
                  value={formData.sunExposure} 
                  onChange={(e) => setFormData({ ...formData, sunExposure: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#241C16] border border-white/10 text-white font-semibold outline-none focus:border-[var(--gold-kene)]"
                >
                  <option value="< 1h par jour">Faible (&lt; 1h par jour)</option>
                  <option value="1h à 3h par jour">Modérée (1h à 3h par jour)</option>
                  <option value="> 3h intense">Intense (&gt; 3h au soleil direct)</option>
                </select>
              </div>

              <div>
                <label className="text-white/60 font-semibold block mb-1 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Hydratation & Consommation d'Eau :
                </label>
                <select 
                  value={formData.waterIntake} 
                  onChange={(e) => setFormData({ ...formData, waterIntake: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#241C16] border border-white/10 text-white font-semibold outline-none focus:border-[var(--gold-kene)]"
                >
                  <option value="< 1L par jour">Insuffisante (&lt; 1L par jour)</option>
                  <option value="1.5L à 2L par jour">Optimale (1.5L à 2L par jour)</option>
                  <option value="> 2.5L par jour">Excellente (&gt; 2.5L par jour)</option>
                </select>
              </div>

              <div>
                <label className="text-white/60 font-semibold block mb-1">Zone Climatique de Résidence :</label>
                <select 
                  value={formData.climate} 
                  onChange={(e) => setFormData({ ...formData, climate: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#241C16] border border-white/10 text-white font-semibold outline-none focus:border-[var(--gold-kene)]"
                >
                  <option value="Chaud & Humide (ex: Abidjan, Cotonou, Lomé)">Chaud & Humide (ex: Abidjan, Cotonou, Lomé)</option>
                  <option value="Sec & Sahélien (ex: Bamako, Niamey, Ouaga)">Sec & Sahélien (ex: Bamako, Niamey, Ouaga)</option>
                  <option value="Saison d'Harmattan / Vent Sec">Saison d'Harmattan / Vent Sec</option>
                  <option value="Tempéré / Climatiser">Climatisé en Permanence</option>
                </select>
              </div>
            </div>
          </m.div>
        )}

        {/* STEP 4: COIFFURE ET CUIR CHEVELU */}
        {step === 4 && (
          <m.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
            <h3 className="font-display font-bold text-base text-white">
              Étape 4 : Bilan Capillaire & Coiffures Protectrices
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-white/60 font-semibold block mb-2">Style Capillaire Habitude :</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Tresses & Braids protectrices',
                    'Cheveux Naturels (Nappy)',
                    'Perruques & Lace Wigs',
                    'Défrisés / Traités'
                  ].map((hp) => (
                    <button
                      key={hp}
                      onClick={() => setFormData({ ...formData, hairProtection: hp })}
                      className={`p-2.5 rounded-xl border text-left font-semibold cursor-pointer ${
                        formData.hairProtection === hp
                          ? 'bg-[var(--gold-kene)]/20 border-[var(--gold-kene)] text-[var(--gold-kene)]'
                          : 'bg-white/5 border-white/10 text-white/60'
                      }`}
                    >
                      {hp}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-950/30 border border-emerald-500/20 p-3.5 rounded-2xl flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <p className="text-[10px] text-emerald-200/80 leading-relaxed font-sans">
                  Ces données d'anamnèse seront directement combinées avec l'analyse spectrale par l'IA pour générer vos prescriptions botaniques sur-mesure.
                </p>
              </div>
            </div>
          </m.div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          {step > 1 ? (
            <Button
              onClick={handleBack}
              variant="outline"
              size="sm"
              className="bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs rounded-xl flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Précédent
            </Button>
          ) : (
            <button onClick={onClose} className="text-xs text-white/40 hover:text-white transition">
              Passer pour le moment
            </button>
          )}

          <Button
            onClick={handleNext}
            size="sm"
            className="bg-gradient-to-r from-[var(--gold-kene)] to-[#8A3B14] text-[#1A1410] font-bold text-xs rounded-xl shadow-lg hover:opacity-90 flex items-center gap-1"
          >
            {step === 4 ? 'Valider Mon Anamnèse ✅' : 'Suivant'} <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </m.div>
    </div>
  )
}
