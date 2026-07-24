import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const firstTenant = await db.tenant.findFirst();
    if (!firstTenant) {
      return NextResponse.json({ success: false, error: 'No tenant found' }, { status: 404 });
    }

    const diagnoses = await db.diagnosis.findMany({
      where: { tenantId: firstTenant.id },
      include: {
        client: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, diagnoses });
  } catch (error) {
    console.error('Failed to fetch diagnoses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch diagnoses' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const firstTenant = await db.tenant.findFirst();
    if (!firstTenant) {
      return NextResponse.json({ success: false, error: 'No tenant found' }, { status: 404 });
    }

    const body = await req.json();
    const { clientId, scoreGlobal, subScores, indicators, recommendations, dermatoReferral, referralReason } = body;

    if (!clientId) {
      return NextResponse.json({ success: false, error: 'Client ID is required' }, { status: 400 });
    }

    const diagnosis = await db.diagnosis.create({
      data: {
        tenantId: firstTenant.id,
        clientId,
        photos: '["https://api.dicebear.com/7.x/shapes/svg?seed=mockPhoto1"]', // Mock
        scoreGlobal: scoreGlobal || 75,
        subScores: JSON.stringify(subScores || { hydration: 80, brightness: 70 }),
        indicators: JSON.stringify(indicators || { acne: 'low', pigmentation: 'medium' }),
        recommendations: JSON.stringify(recommendations || ['Soin hydratant', 'Gommage doux']),
        dermatoReferral: dermatoReferral || false,
        referralReason: referralReason || null,
        modelVersion: 'v1.0-mock'
      },
      include: {
        client: true
      }
    });

    return NextResponse.json({ success: true, diagnosis });
  } catch (error) {
    console.error('Failed to create diagnosis:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create diagnosis' },
      { status: 500 }
    );
  }
}
