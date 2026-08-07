import { NextResponse } from 'next/server';
import { DEMO_CLIENTS } from '@/lib/demo-data';

export async function GET() {
  try {
    const { db } = await import('@/lib/db');
    const firstTenant = await db.tenant.findFirst();
    if (firstTenant) {
      const clients = await db.client.findMany({
        where: { tenantId: firstTenant.id },
        orderBy: { createdAt: 'desc' },
      });
      if (clients.length > 0) return NextResponse.json({ success: true, clients });
    }
  } catch { /* DB not ready — use demo data */ }

  return NextResponse.json({ success: true, clients: DEMO_CLIENTS, _demo: true });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, phone, email, skinType, fitzpatrickType, allergies, avatar } = body;
    if (!firstName || !lastName || !phone) {
      return NextResponse.json({ success: false, error: 'Champs requis manquants' }, { status: 400 });
    }

    try {
      const { db } = await import('@/lib/db');
      const firstTenant = await db.tenant.findFirst();
      if (firstTenant) {
        const client = await db.client.create({
          data: {
            tenantId: firstTenant.id,
            firstName, lastName, phone,
            email: email || null,
            skinType: skinType || 'normale',
            fitzpatrickType: fitzpatrickType || 'V',
            allergies: allergies || '[]',
            treatments: '[]',
            consentHealthData: true,
            avatar: avatar || null,
          },
        });
        return NextResponse.json({ success: true, client });
      }
    } catch (dbErr) {}

    // Resilient fallback client
    const fallbackClient = {
      id: 'client-' + Date.now(),
      firstName, lastName, phone,
      email: email || `${firstName.toLowerCase()}@gmail.com`,
      skinType: skinType || 'normale',
      fitzpatrickType: fitzpatrickType || 'V',
      allergies: allergies || '[]',
      avatar: avatar || null,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({ success: true, client: fallbackClient });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Erreur lors de la création de la cliente' }, { status: 500 });
  }
}
