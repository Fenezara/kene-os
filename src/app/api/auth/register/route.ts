import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { registerAccount } from '@/lib/user-store';
import { signJWT } from '@/lib/jwt-auth';

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

    // Sign cryptographic JWT token (HMAC SHA-256)
    const token = await signJWT({
      sub: newAccount.id,
      name: newAccount.name,
      email: newAccount.email,
      phone: newAccount.phone,
      role: normalizedRole,
      tenantId: 'tenant-default-abidjan',
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

    // Set 30-day persistent HTTP-Only Session Cookie
    const cookieStore = await cookies();
    cookieStore.set('kene-session', token, {
      httpOnly: true, // Prevents XSS script token theft
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days valid JWT session
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
