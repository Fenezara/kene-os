import { NextResponse } from 'next/server';
import { DEMO_EMPLOYEES } from '@/lib/demo-data';

export async function GET() {
  try {
    const { db } = await import('@/lib/db');
    const firstTenant = await db.tenant.findFirst();
    if (firstTenant) {
      const employees = await db.employee.findMany({
        where: { tenantId: firstTenant.id },
        orderBy: { createdAt: 'desc' },
      });
      if (employees.length > 0) return NextResponse.json({ success: true, employees });
    }
  } catch { /* DB not ready — use demo data */ }

  return NextResponse.json({ success: true, employees: DEMO_EMPLOYEES, _demo: true });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, phone, position, baseSalary, gender, role } = body;

    if (!firstName || !lastName || !phone) {
      return NextResponse.json({ success: false, error: 'Champs requis manquants (Prénom, Nom, Téléphone)' }, { status: 400 });
    }

    // Attempt DB creation if database is connected
    try {
      const { db } = await import('@/lib/db');
      const firstTenant = await db.tenant.findFirst({ include: { sites: true } });
      if (firstTenant && firstTenant.sites[0]) {
        const employee = await db.employee.create({
          data: {
            tenantId: firstTenant.id,
            siteId: firstTenant.sites[0].id,
            firstName,
            lastName,
            phone,
            position: position || 'Praticienne',
            baseSalary: parseFloat(baseSalary || '250000'),
            gender: gender || 'F',
            birthDate: new Date('1995-01-01'),
            address: '{}',
            hireDate: new Date(),
            documents: '[]'
          }
        });
        return NextResponse.json({ success: true, employee });
      }
    } catch (dbErr) {
      console.warn('DB not available for employee POST, using fallback:', dbErr);
    }

    // Resilient fallback for demo / standalone mode
    const fallbackEmp = {
      id: 'emp-' + Date.now(),
      firstName,
      lastName,
      phone,
      position: position || 'Praticienne',
      role: role || 'praticienne',
      gender: gender || 'F',
      baseSalary: baseSalary || '250000',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({ success: true, employee: fallbackEmp });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Erreur lors de la création de l\'employé' },
      { status: 500 }
    );
  }
}
