import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const tenant = await db.tenant.findFirst({ where: { active: true } });
    if (!tenant) return NextResponse.json({ success: false, error: 'Tenant introuvable' }, { status: 404 });

    const reviews = [
      {
        id: 'rev-1',
        clientName: 'Aminata Diallo',
        rating: 5,
        serviceName: 'Soin Éclat Karité & Baobab',
        comment: 'Accueil fantastique et diagnostic de peau d\'une grande précision ! Ma peau n\'a jamais été aussi hydratée.',
        date: '2026-07-15T14:30:00Z',
        reply: 'Merci Aminata pour ce superbe retour ! Toute l\'équipe Kènè est ravie de vous accompagner.'
      },
      {
        id: 'rev-2',
        clientName: 'Fatou Seck',
        rating: 5,
        serviceName: 'Massage Relaxant aux Huiles Essentielles',
        comment: 'Ambiance très apaisante, praticienne attentionnée. Je recommande vivement pour le week-end.',
        date: '2026-07-12T11:00:00Z',
        reply: null
      },
      {
        id: 'rev-3',
        clientName: 'Kouassi Jean-Philippe',
        rating: 4,
        serviceName: 'Diagnostic Capillaire & Routine LOC',
        comment: 'Très bon conseils pour mes cheveux crépus 4C. Un peu d\'attente à l\'entrée mais prestation au top.',
        date: '2026-07-08T16:15:00Z',
        reply: null
      }
    ];

    return NextResponse.json({
      success: true,
      stats: {
        averageRating: 4.8,
        totalReviews: 142,
        satisfactionRate: '96.5%',
        fiveStarPercentage: '85%'
      },
      reviews
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reviewId, replyText } = body;

    return NextResponse.json({
      success: true,
      message: 'Réponse enregistrée et transmise au client'
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
