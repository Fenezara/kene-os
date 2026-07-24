import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const firstTenant = await db.tenant.findFirst();
    if (!firstTenant) {
      return NextResponse.json({ success: false, error: 'No tenant found' }, { status: 404 });
    }

    const tenantId = firstTenant.id;

    // Récupérer les employés
    const employees = await db.employee.findMany({
      where: { tenantId, status: 'active' },
      select: { id: true, firstName: true, lastName: true }
    });

    // Récupérer les services
    const services = await db.service.findMany({
      where: { tenantId, active: true },
      select: { id: true, name: true, price: true, durationMin: true }
    });

    // Récupérer les clients
    let clients = await db.client.findMany({
      where: { tenantId },
      select: { id: true, firstName: true, lastName: true, phone: true }
    });

    // Créer un client de test si aucun n'existe
    if (clients.length === 0) {
      const testClient = await db.client.create({
        data: {
          tenantId,
          firstName: 'Client',
          lastName: 'Test',
          phone: '+2250102030405',
          allergies: '[]',
          treatments: '[]'
        }
      });
      clients = [testClient];
    }

    return NextResponse.json({
      success: true,
      data: {
        employees,
        services,
        clients
      }
    });
  } catch (error) {
    console.error('Failed to fetch agenda metadata:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch agenda metadata' },
      { status: 500 }
    );
  }
}
