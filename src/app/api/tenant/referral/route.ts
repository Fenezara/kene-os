import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    referralCode: 'KENE-ABIDJAN-7X4K',
    stats: { totalReferred: 12, totalEarned: 45000, activeClients: 8 },
    referrals: [
      { id: '1', clientName: 'Aminata Diallo', date: new Date().toISOString(), status: 'active', cashback: 5000 },
      { id: '2', clientName: 'Fatou Sarr', date: new Date(Date.now() - 86400000*3).toISOString(), status: 'active', cashback: 5000 },
      { id: '3', clientName: 'Mariam Koné', date: new Date(Date.now() - 86400000*7).toISOString(), status: 'pending', cashback: 0 },
    ]
  });
}
