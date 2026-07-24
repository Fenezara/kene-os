import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const firstTenant = await db.tenant.findFirst();
    if (!firstTenant) {
      return NextResponse.json({ success: false, error: 'No tenant found' }, { status: 404 });
    }

    const { clients } = await req.json();

    if (!Array.isArray(clients) || clients.length === 0) {
      return NextResponse.json({ success: false, error: 'Tableau de clients valide requis' }, { status: 400 });
    }

    const createdClients = [];
    for (const c of clients) {
      const created = await db.client.create({
        data: {
          tenantId: firstTenant.id,
          firstName: c.firstName || 'Client',
          lastName: c.lastName || 'Importé',
          phone: c.phone || '+225 07 00 00 00',
          email: c.email || null,
          skinType: c.skinType || 'normale',
          fitzpatrickType: c.fitzpatrickType || 'V',
          allergies: c.allergies || '[]',
          treatments: '[]',
          consentHealthData: true,
          avatar: c.avatar || null
        }
      });
      createdClients.push(created);
    }

    return NextResponse.json({
      success: true,
      importedCount: createdClients.length,
      clients: createdClients,
      message: `${createdClients.length} clients importés et organisés par l'IA dans la base Kènè.`,
    });
  } catch (error) {
    console.error('Failed to import clients:', error);
    return NextResponse.json({ success: false, error: 'Erreur lors de l\'importation en masse' }, { status: 500 });
  }
}
