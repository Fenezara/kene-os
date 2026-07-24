import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const firstTenant = await db.tenant.findFirst();
    if (!firstTenant) {
      return NextResponse.json({ success: false, error: 'No tenant found' }, { status: 404 });
    }

    const sales = await db.sale.findMany({
      where: { tenantId: firstTenant.id },
      include: {
        client: true,
        cashier: true,
        payments: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, sales });
  } catch (error) {
    console.error('Failed to fetch sales:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sales' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const firstTenant = await db.tenant.findFirst({
      include: { sites: true, employees: true }
    });
    
    if (!firstTenant) {
      return NextResponse.json({ success: false, error: 'No tenant found' }, { status: 404 });
    }
    
    const defaultSite = firstTenant.sites[0];
    // Prendre un employé par défaut pour agir comme caissier
    const defaultCashier = firstTenant.employees[0];

    if (!defaultSite || !defaultCashier) {
      return NextResponse.json({ success: false, error: 'Missing site or cashier configuration' }, { status: 400 });
    }

    const body = await req.json();
    const { clientId, subtotal, method, appointmentId } = body;

    if (!subtotal || !method) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const total = parseFloat(subtotal);
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

    // Création de la vente et du paiement dans une transaction
    const sale = await db.$transaction(async (prisma) => {
      const newSale = await prisma.sale.create({
        data: {
          tenantId: firstTenant.id,
          siteId: defaultSite.id,
          invoiceNumber,
          clientId: clientId || null,
          cashierId: defaultCashier.id,
          appointmentId: appointmentId || null,
          items: '[]', // Simplifié pour la démo
          subtotal: total,
          vatAmount: 0,
          total: total,
          status: 'paid'
        }
      });

      await prisma.payment.create({
        data: {
          tenantId: firstTenant.id,
          saleId: newSale.id,
          amount: total,
          method: method,
          status: 'confirmed',
          paidAt: new Date()
        }
      });

      // Mettre à jour le statut du RDV si lié
      if (appointmentId) {
        await prisma.appointment.update({
          where: { id: appointmentId },
          data: { status: 'completed' }
        });
      }

      return newSale;
    });

    return NextResponse.json({ success: true, sale });
  } catch (error) {
    console.error('Failed to create sale:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create sale' },
      { status: 500 }
    );
  }
}
