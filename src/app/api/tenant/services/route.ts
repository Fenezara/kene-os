import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Dans une vraie application, récupérer le tenantId depuis la session
    const firstTenant = await db.tenant.findFirst();
    if (!firstTenant) {
      return NextResponse.json({ success: false, error: 'No tenant found' }, { status: 404 });
    }

    const services = await db.service.findMany({
      where: { tenantId: firstTenant.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, services });
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const firstTenant = await db.tenant.findFirst();
    if (!firstTenant) {
      return NextResponse.json({ success: false, error: 'No tenant found' }, { status: 404 });
    }

    const body = await req.json();
    const { name, description, category, durationMin, price, vatRate, commissionRate } = body;

    if (!name || !category || !durationMin || price === undefined) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const service = await db.service.create({
      data: {
        tenantId: firstTenant.id,
        name,
        description,
        category,
        durationMin: parseInt(durationMin),
        price: parseFloat(price),
        vatRate: vatRate ? parseFloat(vatRate) : 0.18,
        commissionRate: commissionRate ? parseFloat(commissionRate) : 0,
        resourcesRequired: '[]' // Valeur par défaut requise par le schéma
      }
    });

    return NextResponse.json({ success: true, service });
  } catch (error) {
    console.error('Failed to create service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
