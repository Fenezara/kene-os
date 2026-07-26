import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { registerAccount } from '@/lib/user-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role, name, firstName, lastName, email, phone, salonName } = body;

    const identifier = email || phone || salonName;
    if (!identifier) {
      return NextResponse.json({ success: false, error: 'Email, téléphone ou nom du salon requis' }, { status: 400 });
    }

    const roleLower = String(role || '').toLowerCase();
    const normalizedRole = roleLower.includes('salon') || roleLower.includes('gerant') || roleLower.includes('pro')
      ? 'gerant'
      : roleLower.includes('admin')
      ? 'admin'
      : 'client';

    const accountName = name || (firstName && lastName ? `${firstName} ${lastName}` : salonName || 'Utilisateur Kènè');

    // Register user account into verified registry
    const newAccount = registerAccount({
      name: accountName,
      email: email || undefined,
      phone: phone || undefined,
      role: normalizedRole,
    });

    // Optionally create record in DB if available
    try {
      const { db } = await import('@/lib/db');
      const firstTenant = await db.tenant.findFirst();
      if (normalizedRole === 'client' && firstTenant) {
        await db.client.create({
          data: {
            tenantId: firstTenant.id,
            firstName: firstName || 'Cliente',
            lastName: lastName || 'Kènè',
            phone: phone || '+225 07 00 00 00 00',
            email: email || null,
            skinType: 'normale',
            fitzpatrickType: 'V',
            allergies: '[]',
            treatments: '[]',
            consentHealthData: true,
          }
        });
      }
    } catch {
      // Ignore DB error
    }

    // Set 1-year persistent HTTP session cookie
    const sessionId = `${normalizedRole}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const cookieStore = await cookies();
    cookieStore.set('kene-session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });

    const targetPath = normalizedRole === 'gerant' ? '/dashboard' : normalizedRole === 'admin' ? '/admin' : '/portal';

    return NextResponse.json({
      success: true,
      account: newAccount,
      role: normalizedRole,
      targetPath,
      message: 'Compte créé et sécurisé avec succès !',
    });
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json({ success: false, error: 'Échec de la création de compte.' }, { status: 500 });
  }
}
