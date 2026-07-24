import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Dans une vraie application, on récupérerait le tenantId depuis la session utilisateur.
    // Pour l'instant, on prend le premier tenant disponible comme exemple.
    const firstTenant = await db.tenant.findFirst();
    
    if (!firstTenant) {
      return NextResponse.json({ success: false, error: 'No tenant found' }, { status: 404 });
    }

    const tenantId = firstTenant.id;

    // Statistiques du mois en cours (simplifié pour l'exemple)
    const appointmentsToday = await db.appointment.count({
      where: { 
        tenantId,
        startAt: {
          gte: new Date(new Date().setHours(0,0,0,0)),
          lt: new Date(new Date().setHours(23,59,59,999))
        }
      }
    });

    const totalClients = await db.client.count({
      where: { tenantId }
    });

    const salesStats = await db.sale.aggregate({
      where: { tenantId },
      _sum: { total: true }
    });
    
    const activeEmployees = await db.employee.count({
      where: { tenantId, status: 'active' }
    });

    return NextResponse.json({
      success: true,
      tenantName: firstTenant.name,
      stats: {
        appointmentsToday,
        totalClients,
        revenue: salesStats._sum.total || 0,
        activeEmployees
      }
    });
  } catch (error) {
    console.error('Failed to fetch tenant stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tenant stats' },
      { status: 500 }
    );
  }
}
