'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LayoutGrid, CreditCard, MessageCircle, MonitorSmartphone, Receipt, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Extension {
  id: string;
  name: string;
  description: string;
  price: string;
  icon: any;
  enabled: boolean;
  tag?: string;
}

export default function MarketplacePage() {
  const { toast } = useToast();
  
  const [extensions, setExtensions] = useState<Extension[]>([
    {
      id: 'wave-api',
      name: 'Wave Business Direct API Integration',
      description: 'Paiement direct depuis les téléphones des clients via Wave sans passer par un terminal physique.',
      price: '15 000 F/mois',
      icon: CreditCard,
      enabled: false,
    },
    {
      id: 'borne-tactile',
      name: 'Module Borne Tactile Accueil Salon',
      description: 'Application pour tablette iPad/Android permettant aux clients de s\'enregistrer à l\'accueil.',
      price: '25 000 F/mois',
      icon: MonitorSmartphone,
      enabled: false,
    },
    {
      id: 'whatsapp-bulk',
      name: 'Pack WhatsApp Bulk Marketing Reminders',
      description: 'Envoyez des rappels de rdv et des offres promotionnelles via l\'API officielle WhatsApp.',
      price: '10 000 F/mois',
      icon: MessageCircle,
      enabled: true,
      tag: 'Populaire',
    },
    {
      id: 'paye-avance',
      name: 'Module Paye Avancé CNPS & IPRES',
      description: 'Générez les fiches de paie et les déclarations sociales automatiquement.',
      price: 'Inclus Plan Pro',
      icon: Receipt,
      enabled: true,
      tag: 'Inclus',
    }
  ]);

  const toggleExtension = (id: string) => {
    setExtensions(prev => prev.map(ext => {
      if (ext.id === id) {
        const newState = !ext.enabled;
        toast({
          title: newState ? "Extension Activée" : "Extension Désactivée",
          description: `Le module ${ext.name} a été ${newState ? 'activé' : 'désactivé'}.`,
        });
        return { ...ext, enabled: newState };
      }
      return ext;
    }));
  };

  return (
    <div className="space-y-8 p-8 text-white min-h-screen bg-[#1A1410] max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link href="/admin" className="inline-flex items-center text-sm text-white/60 hover:text-[#C8951E] mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Retour au tableau de bord
        </Link>
        <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
          <LayoutGrid className="text-[#C8951E]" />
          App Store & <span className="text-[var(--gold-kene)]">Marketplace</span>
        </h1>
        <p className="text-karite/80 mt-2">Découvrez les modules additionnels pour propulser les salons.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {extensions.map((ext, i) => (
          <motion.div
            key={ext.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={`h-full bg-[#241C16] border-[#362A21] overflow-hidden relative group transition-colors ${ext.enabled ? 'border-[#C8951E]/50' : ''}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#C8951E]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5 text-[#C8951E]">
                      <ext.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white font-bold">{ext.name}</CardTitle>
                      <CardDescription className="text-white/60 mt-1">{ext.description}</CardDescription>
                    </div>
                  </div>
                  {ext.tag && (
                    <span className="text-xs px-2 py-1 rounded-full bg-[#C8951E]/20 text-[#C8951E] font-medium whitespace-nowrap ml-2">
                      {ext.tag}
                    </span>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 flex items-end justify-between mt-auto">
                <div className="font-bold text-[#C8951E]">{ext.price}</div>
                
                <button
                  onClick={() => toggleExtension(ext.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#C8951E] focus:ring-offset-2 focus:ring-offset-[#1A1410] ${
                    ext.enabled ? 'bg-[#4CAF6E]' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      ext.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
