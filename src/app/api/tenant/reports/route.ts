import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    revenueByEmployee: [
      { id: '1', name: 'Awa', revenue: 450000 },
      { id: '2', name: 'Fatou', revenue: 380000 },
      { id: '3', name: 'Marie', revenue: 520000 },
      { id: '4', name: 'Bintou', revenue: 290000 },
    ],
    popularServices: [
      { id: '1', name: 'Tresses Afro', count: 145, max: 200 },
      { id: '2', name: 'Soin Visage Karité', count: 98, max: 200 },
      { id: '3', name: 'Massage Relaxant', count: 76, max: 200 },
      { id: '4', name: 'Manucure Gel', count: 65, max: 200 },
      { id: '5', name: 'Épilation Complète', count: 42, max: 200 },
    ],
    retention: {
      returning: 68, // %
      new: 32 // %
    },
    marketing: [
      { id: '1', campaign: 'Promo Tabaski', openRate: 45, conversion: 12 },
      { id: '2', campaign: 'Newsletter Mai', openRate: 32, conversion: 5 },
      { id: '3', campaign: 'Offre Anniversaire', openRate: 68, conversion: 25 },
    ]
  });
}
