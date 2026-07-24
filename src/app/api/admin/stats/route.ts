import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const tenants = await db.tenant.count();
    const users = await db.user.count();
    const appointments = await db.appointment.count();
    
    const sales = await db.sale.aggregate({
      _sum: {
        total: true,
      },
    });
    const revenue = sales._sum.total || 0;
    
    const diagnoses = await db.diagnosis.count();
    const employees = await db.employee.count({
      where: { status: 'active' },
    });

    return NextResponse.json({
      success: true,
      stats: {
        tenants,
        users,
        appointments,
        revenue,
        diagnoses,
        employees,
      },
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch global stats' },
      { status: 500 }
    );
  }
}
