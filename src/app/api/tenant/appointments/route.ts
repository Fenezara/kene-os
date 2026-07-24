import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const firstTenant = await db.tenant.findFirst();
    if (!firstTenant) {
      return NextResponse.json({ success: false, error: 'No tenant found' }, { status: 404 });
    }

    const appointments = await db.appointment.findMany({
      where: { tenantId: firstTenant.id },
      include: {
        client: true,
        service: true,
        employee: true
      },
      orderBy: { startAt: 'asc' }
    });

    return NextResponse.json({ success: true, appointments });
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const firstTenant = await db.tenant.findFirst({
      include: { sites: true }
    });
    if (!firstTenant) {
      return NextResponse.json({ success: false, error: 'No tenant found' }, { status: 404 });
    }
    
    const defaultSite = firstTenant.sites[0];
    if (!defaultSite) {
      return NextResponse.json({ success: false, error: 'No site found' }, { status: 400 });
    }

    const body = await req.json();
    const { clientId, serviceId, employeeId, startAt, amount } = body;

    if (!clientId || !serviceId || !employeeId || !startAt) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    // Calculer la fin du RDV basé sur la durée du service (simplifié)
    const service = await db.service.findUnique({ where: { id: serviceId } });
    if (!service) return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    
    const startDate = new Date(startAt);
    const endDate = new Date(startDate.getTime() + service.durationMin * 60000);

    const appointment = await db.appointment.create({
      data: {
        tenantId: firstTenant.id,
        siteId: defaultSite.id,
        clientId,
        serviceId,
        employeeId,
        startAt: startDate,
        endAt: endDate,
        amount: amount ? parseFloat(amount) : service.price,
        status: 'pending'
      },
      include: {
        client: true,
        service: true,
        employee: true
      }
    });

    return NextResponse.json({ success: true, appointment });
  } catch (error) {
    console.error('Failed to create appointment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}
