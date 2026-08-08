export interface PricingPlan {
  id: 'essentiel' | 'pro' | 'elite';
  name: string;
  priceMonthly: number; // in FCFA
  priceAnnual: number;  // in FCFA
  dailyCost: string;
  badge?: string;
  color: string;
  description: string;
  allowedModules: string[];
}

export const KENE_PRICING_PLANS: Record<string, PricingPlan> = {
  essentiel: {
    id: 'essentiel',
    name: 'Plan 1 : Essentiel',
    priceMonthly: 7500,
    priceAnnual: 75000,
    dailyCost: '250 FCFA / jour',
    color: '#4CAF6E',
    description: 'Gestion de caisse Mobile Money (Wave, OM, MTN), Agenda cabine, Tarifs, Équipe & Base clientes CRM.',
    allowedModules: ['dashboard', 'agenda', 'pos', 'clients', 'services', 'employees', 'reviews', 'referral', 'wallet', 'settings', 'caisse']
  },
  pro: {
    id: 'pro',
    name: 'Plan 2 : Pro (Dermo-Cosmétique)',
    priceMonthly: 15000,
    priceAnnual: 150000,
    dailyCost: '500 FCFA / jour',
    badge: 'BEST-SELLER ⭐',
    color: '#C8951E',
    description: 'Scanner Biométrique 3D IA + Bilan Cutané A4 + Stocks Produits + Marketing WhatsApp.',
    allowedModules: ['dashboard', 'agenda', 'pos', 'clients', 'services', 'employees', 'inventory', 'diagnoses', 'marketing', 'reviews', 'referral', 'wallet', 'settings', 'caisse']
  },
  elite: {
    id: 'elite',
    name: 'Plan 3 : Élite (Expert & Chaîne)',
    priceMonthly: 30000,
    priceAnnual: 300000,
    dailyCost: '1 000 FCFA / jour',
    badge: 'EXPERT & MULTI-SITES 👑',
    color: '#8A1C14',
    description: 'Laboratoire Botanique Sur-Mesure + Comptabilité SYSCOHADA + Paie CNPS + Multi-Salons.',
    allowedModules: ['dashboard', 'agenda', 'pos', 'clients', 'services', 'employees', 'inventory', 'diagnoses', 'marketing', 'reviews', 'referral', 'lab', 'compta', 'rh', 'settings', 'reports', 'wallet', 'caisse']
  }
};
