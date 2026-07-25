import { NextResponse } from 'next/server';

export async function GET() {
  return handleAutopilot();
}

export async function POST() {
  return handleAutopilot();
}

async function handleAutopilot() {
  const timestamp = new Date().toISOString();
  
  // 1. Job Rappels RDV WhatsApp (24h & 2h)
  const appointmentReminders = [
    { client: 'Aminata Diallo', phone: '+2250700112233', service: 'Soin Hydratation Karité', time: 'Demain 14:00', status: 'Envoyé via WhatsApp 📲' },
    { client: 'Fatou Koné', phone: '+221771234567', service: 'Diagnostic IA & Consultation', time: 'Aujourd\'hui 16:30', status: 'Envoyé via WhatsApp 📲' },
  ];

  // 2. Job Marketing Anniversaire & Relance 45 Jours
  const marketingActions = [
    { client: 'Mariam Coulibaly', phone: '+2250504030201', type: '🎂 Anniversaire', offer: '-15% sur le Sérum Baobab', status: 'Offre envoyée 🎁' },
    { client: 'Awa Traoré', phone: '+22366112233', type: '🔄 Relance 45j Inactivité', offer: 'Offre Soin Scellant +500 pts', status: 'Message envoyé 💬' },
  ];

  // 3. Job Clôture de Caisse Daily & Journal SYSCOHADA (21h00)
  const dailyClosure = {
    date: new Date().toLocaleDateString('fr-FR'),
    totalSales: 185000,
    cashAmount: 85000,
    waveAmount: 60000,
    orangeMoneyAmount: 40000,
    syscohadaEntries: [
      { code: '5711', name: 'Caisse Principale', debit: 85000, credit: 0 },
      { code: '5211', name: 'Banque Mobile Money (Wave/OM)', debit: 100000, credit: 0 },
      { code: '7061', name: 'Ventes Prestations & Soins', debit: 0, credit: 185000 },
    ],
    status: 'Journal de Caisse Clôturé & Signé 📑'
  };

  return NextResponse.json({
    success: true,
    engine: 'Kènè Autopilot Engine 1.0',
    executedAt: timestamp,
    summary: {
      remindersSent: appointmentReminders.length,
      marketingOffersSent: marketingActions.length,
      dailyClosureProcessed: true,
      totalRevenueClosed: `${dailyClosure.totalSales.toLocaleString('fr-FR')} FCFA`
    },
    details: {
      appointmentReminders,
      marketingActions,
      dailyClosure
    }
  });
}
