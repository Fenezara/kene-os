import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const tenants = await db.tenant.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        country: true,
      },
    });

    return NextResponse.json({ success: true, tenants });
  } catch (error) {
    console.error('Failed to fetch tenants:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tenants' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { tenantId, active, subscriptionTier, subscriptionStatus } = body;

    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'Missing tenantId' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (active !== undefined) updateData.active = active;
    if (subscriptionTier !== undefined) updateData.subscriptionTier = subscriptionTier;
    if (subscriptionStatus !== undefined) updateData.subscriptionStatus = subscriptionStatus;

    const updated = await db.tenant.update({
      where: { id: tenantId },
      data: updateData,
    });

    return NextResponse.json({ success: true, tenant: updated });
  } catch (error) {
    console.error('Failed to update tenant:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update tenant' },
      { status: 500 }
    );
  }
}
