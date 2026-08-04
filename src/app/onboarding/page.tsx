'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Building2, Globe, FileText, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { registerNewTenant } from '@/lib/sync-engine';

export default function OnboardingPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    plan: 'pro',
    salonName: '',
    rccm: '',
    country: 'SN',
    tva: '',
    currency: 'XOF',
    importMethod: 'template',
  });

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const salonTitle = formData.salonName || 'KÃ¨nÃ¨ Institut BeautÃ©';
    const tenantSettings = {
      identity: { commercialName: salonTitle, legalName: salonTitle + ' SAS', type: 'Institut', logoUrl: null },
      address: { street: 'Adresse Principale', phone: '+225 07 00 00 00', email: 'contact@salon.com' },
      fiscal: { rccm: formData.rccm || 'CI-ABJ-2024-B-100', nif: '1098473A', vatRate: formData.tva || 18, country: formData.country || 'CI', currency: formData.currency || 'XOF' },
      subscription: { plan: formData.plan || 'Pro', renewalDate: '2027-01-01' }
    };
    
    // Synchronize into global tenant directory for Super Admin
    registerNewTenant({
      name: salonTitle,
      type: 'Institut & Spa Botanique',
      subscriptionTier: formData.plan === 'chaine' ? 'ChaÃ®ne' : formData.plan === 'pro' ? 'Pro' : 'Essentiel',
      country: { code: formData.country || 'CI', name: formData.country === 'SN' ? 'SÃ©nÃ©gal' : 'CÃ´te d\'Ivoire' },
      ownerName: 'GÃ©rant Fondateur'
    });

    localStorage.setItem('kene_tenant_settings', JSON.stringify(tenantSettings));
    toast({
      title: "âœ… SuccÃ¨s",
      description: `Le salon "${salonTitle}" a Ã©tÃ© configurÃ© avec succÃ¨s !`,
    });
    router.push('/dashboard');
  };

  const plans = [
    { id: 'essentiel', name: 'Essentiel', desc: 'Pour les indÃ©pendants et petits salons', price: '15 000 FCFA/mois' },
    { id: 'pro', name: 'Pro', desc: 'Gestion complÃ¨te pour salons en croissance', price: '30 000 FCFA/mois' },
    { id: 'chaine', name: 'ChaÃ®ne', desc: 'Multi-salons avec gestion consolidÃ©e', price: 'Sur devis' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0603] text-white flex flex-col items-center justify-center p-4 relative">
      {/* Top Left Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 z-20 text-white/60 hover:text-white transition flex items-center gap-2 text-xs font-bold bg-white/5 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-md cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour</span>
      </button>

      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Bienvenue sur <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] to-[#C8951E]">KÃ¨nÃ¨ Pro</span>
          </h1>
          <p className="text-white/60 mt-2">Configurez votre salon en 3 Ã©tapes simples</p>
        </div>

        <div className="flex justify-between items-center mb-8 px-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= s ? 'bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05]' : 'bg-white/10 text-white/40'
              }`}>
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              <span className={`text-xs mt-2 ${step >= s ? 'text-[#C8951E]' : 'text-white/40'}`}>
                {s === 1 ? 'Plan' : s === 2 ? 'Configuration' : 'Importation'}
              </span>
            </div>
          ))}
          <div className="absolute left-[50%] top-[140px] -translate-x-1/2 w-full max-w-xl h-0.5 bg-white/10 -z-10 hidden md:block">
            <div 
              className="h-full bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] transition-all duration-500 ease-in-out"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
        </div>

        <Card className="bg-[#1A1410] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                      <Building2 className="text-[#C8951E]" />
                      Choisissez votre Plan
                    </h2>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    {plans.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => updateForm('plan', p.id)}
                        className={`cursor-pointer rounded-xl p-6 border-2 transition-all ${
                          formData.plan === p.id 
                            ? 'border-[#C8951E] bg-[#C8951E]/10' 
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <h3 className="font-bold text-lg mb-2">{p.name}</h3>
                        <p className="text-sm text-white/60 mb-4 h-10">{p.desc}</p>
                        <p className="font-bold text-[#C8951E]">{p.price}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                      <Globe className="text-[#C8951E]" />
                      Configuration Salon & Pays UEMOA
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <label className="text-sm text-white/80">Nom du Salon</label>
                      <input 
                        type="text" 
                        value={formData.salonName}
                        onChange={(e) => updateForm('salonName', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:border-[#C8951E] outline-none"
                        placeholder="Ex: Belle Dame Dakar"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-white/80">Pays UEMOA</label>
                      <select 
                        value={formData.country}
                        onChange={(e) => updateForm('country', e.target.value)}
                        className="w-full bg-[#1A1410] border border-white/10 text-white rounded-xl px-4 py-2 focus:border-[#C8951E] outline-none"
                      >
                        <option value="SN">SÃ©nÃ©gal (SN)</option>
                        <option value="CI">CÃ´te d'Ivoire (CI)</option>
                        <option value="ML">Mali (ML)</option>
                        <option value="BF">Burkina Faso (BF)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-white/80">Devise</label>
                      <select 
                        value={formData.currency}
                        onChange={(e) => updateForm('currency', e.target.value)}
                        className="w-full bg-[#1A1410] border border-white/10 text-white rounded-xl px-4 py-2 focus:border-[#C8951E] outline-none"
                      >
                        <option value="XOF">Franc CFA (XOF)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-white/80">NumÃ©ro RCCM</label>
                      <input 
                        type="text" 
                        value={formData.rccm}
                        onChange={(e) => updateForm('rccm', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:border-[#C8951E] outline-none"
                        placeholder="SN-DKR-2023-B-1234"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-white/80">NINEA / NumÃ©ro TVA</label>
                      <input 
                        type="text" 
                        value={formData.tva}
                        onChange={(e) => updateForm('tva', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:border-[#C8951E] outline-none"
                        placeholder="12345678"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                      <FileText className="text-[#C8951E]" />
                      Importation Carte des Soins
                    </h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div
                      onClick={() => updateForm('importMethod', 'template')}
                      className={`cursor-pointer rounded-xl p-6 border-2 transition-all ${
                        formData.importMethod === 'template' 
                          ? 'border-[#C8951E] bg-[#C8951E]/10' 
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <h3 className="font-bold text-lg mb-2">Template PrÃ©-rempli</h3>
                      <p className="text-sm text-white/60">Utiliser notre catalogue standard (Coiffure, Soins Visage, Manucure) adaptÃ© Ã  l'Afrique de l'Ouest.</p>
                    </div>
                    <div
                      onClick={() => updateForm('importMethod', 'csv')}
                      className={`cursor-pointer rounded-xl p-6 border-2 transition-all ${
                        formData.importMethod === 'csv' 
                          ? 'border-[#C8951E] bg-[#C8951E]/10' 
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <h3 className="font-bold text-lg mb-2">Import CSV personnalisÃ©</h3>
                      <p className="text-sm text-white/60">Importer votre propre fichier Excel/CSV contenant tous vos services et tarifs.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
              {step > 1 ? (
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={prevStep}
                  className="px-6 py-2 rounded-xl border border-white/20 text-white hover:bg-white/10 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> PrÃ©cÃ©dent
                </motion.button>
              ) : <div></div>}

              {step < 3 ? (
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={nextStep}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] font-bold flex items-center gap-2"
                >
                  Suivant <ArrowRight className="w-4 h-4" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(200,149,30,0.5)]"
                >
                  Lancer Mon Salon <Check className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
