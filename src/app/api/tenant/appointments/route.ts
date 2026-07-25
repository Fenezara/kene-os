import { NextResponse } from 'next/server';
import { DEMO_APPOINTMENTS } from '@/lib/demo-data';

export async function GET() {
  try {
    const { db } = await import('@/lib/db');
    const firstTenant = await db.tenant.findFirst();
    if (firstTenant) {
      const appointments = await db.appointment.findMany({
        where: { tenantId: firstTenant.id },
        include: { client: true, service: true, employee: true },
        orderBy: { startAt: 'asc' },
      });
      if (appointments.length > 0) return NextResponse.json({ success: true, appointments });
    }
  } catch { /* DB not ready — use demo data */ }

  return NextResponse.json({ success: true, appointments: DEMO_APPOINTMENTS, _demo: true });
}

export async function POST(req: Request) {
  try {
    const { db } = await import('@/lib/db');
    const body = await req.json();
    const { clientId, serviceId, employeeId, startAt, amount } = body;
    if (!clientId || !serviceId || !employeeId || !startAt) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }
    const firstTenant = await db.tenant.findFirst({ include: { sites: true } });
    if (!firstTenant || !firstTenant.sites[0]) {
      return NextResponse.json({ success: false, error: 'No tenant/site found' }, { status: 404 });
    }
    const service = await db.service.findUnique({ where: { id: serviceId } });
    if (!service) return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    const startDate = new Date(startAt);
    const endDate = new Date(startDate.getTime() + service.durationMin * 60000);
    const appointment = await db.appointment.create({
      data: {
        tenantId: firstTenant.id,
        siteId: firstTenant.sites[0].id,
        clientId, serviceId, employeeId,
        startAt: startDate, endAt: endDate,
        amount: amount ? parseFloat(amount) : service.price,
        status: 'pending',
      },
      include: { client: true, service: true, employee: true },
    });
    return NextResponse.json({ success: true, appointment });
  } catch (error) {
    console.error('Failed to create appointment:', error);
    return NextResponse.json({ success: false, error: 'Failed to create appointment' }, { status: 500 });
  }
}
