import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const tenant = await db.tenant.findFirst({ where: { active: true } });
    if (!tenant) return NextResponse.json({ success: false, error: 'Tenant introuvable' }, { status: 404 });

    // Mock campaigns list + audience stats
    const totalClients = await db.client.count({ where: { tenantId: tenant.id } });
    const inactiveClientsCount = Math.round(totalClients * 0.3); // 30% inactive
    const vipClientsCount = Math.round(totalClients * 0.2); // 20% VIP

    const campaigns = [
      {
        id: 'camp-1',
        title: 'Relance Clients Inactifs -20%',
        channel: 'WhatsApp',
        targetSegment: 'Inactifs (+30j)',
        audienceSize: inactiveClientsCount || 45,
        status: 'Envoyé',
        conversionRate: '18.4%',
        sentAt: '2026-07-10T10:00:00Z'
      },
      {
        id: 'camp-2',
        title: 'Offre Anniversaire Soin Karité',
        channel: 'SMS',
        targetSegment: 'Clients VIP',
        audienceSize: vipClientsCount || 28,
        status: 'Programmé',
        conversionRate: '-',
        sentAt: '2026-07-20T09:00:00Z'
      }
    ];

    return NextResponse.json({
      success: true,
      stats: {
        totalClients,
        inactiveClientsCount,
        vipClientsCount,
        averageOpenRate: '94.2%'
      },
      campaigns
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, channel, targetSegment, message } = body;

    if (!title || !message) {
      return NextResponse.json({ success: false, error: 'Titre et message requis' }, { status: 400 });
    }

    const newCampaign = {
      id: `camp-${Date.now()}`,
      title,
      channel: channel || 'WhatsApp',
      targetSegment: targetSegment || 'Tous les clients',
      audienceSize: Math.floor(Math.random() * 50) + 15,
      status: 'Envoyé',
      conversionRate: '0.0%',
      sentAt: new Date().toISOString()
    };

    return NextResponse.json({ success: true, campaign: newCampaign });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
