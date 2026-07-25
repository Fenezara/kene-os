import { NextResponse } from 'next/server';
import { DEMO_SERVICES } from '@/lib/demo-data';

export async function GET() {
  try {
    const { db } = await import('@/lib/db');
    const firstTenant = await db.tenant.findFirst();
    if (firstTenant) {
      const services = await db.service.findMany({
        where: { tenantId: firstTenant.id },
        orderBy: { createdAt: 'desc' },
      });
      if (services.length > 0) return NextResponse.json({ success: true, services });
    }
  } catch { /* DB not ready — use demo data */ }

  return NextResponse.json({ success: true, services: DEMO_SERVICES, _demo: true });
}

export async function POST(req: Request) {
  try {
    const { db } = await import('@/lib/db');
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
        resourcesRequired: '[]',
      },
    });

    return NextResponse.json({ success: true, service });
  } catch (error) {
    console.error('Failed to create service:', error);
    return NextResponse.json({ success: false, error: 'Failed to create service' }, { status: 500 });
  }
}
