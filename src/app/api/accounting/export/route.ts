import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year') || '2026';
  const format = searchParams.get('format') || 'json';

  // SYSCOHADA Official Financial Statements Data
  const financialReport = {
    entity: 'KÈNÈ BEAUTÉ & DERMO-BOTANIQUE SAS',
    nif: 'CI-2025-A-94821',
    rccm: 'CI-ABJ-03-2025-B12-04921',
    regime: 'Régime du Réel Simplifié (SYSCOHADA Révisé)',
    fiscalYear: year,
    currency: 'XOF (Franc CFA UEMOA)',
    balanceSheet: {
      assets: [
        { code: '21', label: 'Immobilisations Incorporelles (Brevets Dermo-Botaniques)', gross: 12500000, dep: 2500000, net: 10000000 },
        { code: '24', label: 'Matériel de Caisse & Diagnostic IA', gross: 8500000, dep: 1700000, net: 6800000 },
        { code: '31', label: 'Stocks de Cosmétiques Bio (Karité, Baobab, Moringa)', gross: 4200000, dep: 0, net: 4200000 },
        { code: '41', label: 'Créances Clients & Opérateurs Mobile Money (Wave, OM)', gross: 3150000, dep: 0, net: 3150000 },
        { code: '52', label: 'Banque (NSIA / SGBCI)', gross: 18400000, dep: 0, net: 18400000 },
        { code: '57', label: 'Caisse POS Salon', gross: 2150000, dep: 0, net: 2150000 },
      ],
      totalAssetsNet: 44700000,
      liabilities: [
        { code: '10', label: 'Capital Social Souscrit', net: 20000000 },
        { code: '13', label: 'Résultat de l’Exercice (Bénéfice Net)', net: 14820000 },
        { code: '40', label: 'Dettes Fournisseurs (Producteurs Bio Karité/Bissap)', net: 4280000 },
        { code: '44', label: 'Dettes Fiscales & TVA 18% à Reverser', net: 3850000 },
        { code: '43', label: 'Dettes Sociales e-CNPS', net: 1750000 },
      ],
      totalLiabilitiesNet: 44700000
    },
    incomeStatement: {
      revenues: [
        { code: '701', label: 'Ventes de Produits Cosmétiques Bio', amount: 32400000 },
        { code: '706', label: 'Prestations de Soins Dermo-Botaniques & Salon', amount: 28600000 },
        { code: '708', label: 'Commissions Diagnostic IA & Marketplace', amount: 5200000 },
      ],
      totalRevenues: 66200000,
      expenses: [
        { code: '601', label: 'Achats d’Ingrédients Botaniques & Flaconnerie', amount: 14200000 },
        { code: '62', label: 'Loyers, Énergie & Maintenance Matériel', amount: 8400000 },
        { code: '64', label: 'Charges de Personnel & Salaires Net', amount: 18500000 },
        { code: '65', label: 'Cotisations Sociales e-CNPS Patronales', amount: 3524000 },
        { code: '68', label: 'Dotations aux Amortissements', amount: 4200000 },
        { code: '69', label: 'Impôt sur les Bénéfices (IBIC 25%)', amount: 2556000 },
      ],
      totalExpenses: 51380000,
      netProfit: 14820000
    }
  };

  return NextResponse.json({
    success: true,
    report: financialReport
  });
}
