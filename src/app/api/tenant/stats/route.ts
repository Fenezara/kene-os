import { NextResponse } from 'next/server';
import { DEMO_STATS } from '@/lib/demo-data';

export async function GET() {
  try {
    const { db } = await import('@/lib/db');
    const firstTenant = await db.tenant.findFirst();
    if (firstTenant) {
      const tenantId = firstTenant.id;
      const appointmentsToday = await db.appointment.count({
        where: {
          tenantId,
          startAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      });
      const totalClients = await db.client.count({ where: { tenantId } });
      const salesStats = await db.sale.aggregate({ where: { tenantId }, _sum: { total: true } });
      const activeEmployees = await db.employee.count({ where: { tenantId, status: 'active' } });
      return NextResponse.json({
        success: true,
        tenantName: firstTenant.name,
        stats: { appointmentsToday, totalClients, revenue: salesStats._sum.total || 0, activeEmployees },
      });
    }
  } catch { /* DB not ready — use demo data */ }

  return NextResponse.json({ success: true, tenantName: 'Institut Beauté Kènè', stats: DEMO_STATS, _demo: true });
}
