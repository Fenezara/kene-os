import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const firstTenant = await db.tenant.findFirst();
    if (!firstTenant) {
      return NextResponse.json({ success: false, error: 'No tenant found' }, { status: 404 });
    }

    const clients = await db.client.findMany({
      where: { tenantId: firstTenant.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, clients });
  } catch (error) {
    console.error('Failed to fetch clients:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clients' },
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
    const { firstName, lastName, phone, email, skinType, fitzpatrickType, allergies, avatar } = body;

    if (!firstName || !lastName || !phone) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const client = await db.client.create({
      data: {
        tenantId: firstTenant.id,
        firstName,
        lastName,
        phone,
        email: email || null,
        skinType: skinType || 'normale',
        fitzpatrickType: fitzpatrickType || 'V',
        allergies: allergies || '[]',
        treatments: '[]',
        consentHealthData: true,
        avatar: avatar || null
      }
    });

    return NextResponse.json({ success: true, client });
  } catch (error) {
    console.error('Failed to create client:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create client' },
      { status: 500 }
    );
  }
}
