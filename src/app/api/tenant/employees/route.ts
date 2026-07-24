import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const firstTenant = await db.tenant.findFirst();
    if (!firstTenant) {
      return NextResponse.json({ success: false, error: 'No tenant found' }, { status: 404 });
    }

    const employees = await db.employee.findMany({
      where: { tenantId: firstTenant.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, employees });
  } catch (error) {
    console.error('Failed to fetch employees:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch employees' },
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

    // On suppose qu'un tenant a au moins un site par défaut
    const defaultSite = firstTenant.sites[0];
    if (!defaultSite) {
      return NextResponse.json({ success: false, error: 'No site found for this tenant' }, { status: 400 });
    }

    const body = await req.json();
    const { firstName, lastName, phone, position, baseSalary, gender } = body;

    if (!firstName || !lastName || !phone || !position) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const employee = await db.employee.create({
      data: {
        tenantId: firstTenant.id,
        siteId: defaultSite.id,
        firstName,
        lastName,
        phone,
        position,
        baseSalary: parseFloat(baseSalary || '0'),
        gender: gender || 'O',
        birthDate: new Date('1990-01-01'), // Valeurs par défaut simplifiées pour la démo
        address: '{}',
        hireDate: new Date(),
        documents: '[]'
      }
    });

    return NextResponse.json({ success: true, employee });
  } catch (error) {
    console.error('Failed to create employee:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create employee' },
      { status: 500 }
    );
  }
}
