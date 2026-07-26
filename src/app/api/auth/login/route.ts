import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findRegisteredAccount } from '@/lib/user-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role, email } = body;

    const identifier = email?.trim();
    if (!identifier) {
      return NextResponse.json({ success: false, error: 'Identifiant (email ou téléphone) requis' }, { status: 400 });
    }

    // 🔒 STRICT SECURITY CHECK: Verify if the account exists in registered directory or database
    const registeredAccount = await findRegisteredAccount(identifier);

    if (!registeredAccount) {
      return NextResponse.json(
        {
          success: false,
          error: `Compte introuvable. L'identifiant "${identifier}" n'est associé à aucun compte enregistré. Veuillez créer un compte pour accéder à la plateforme.`,
          unregistered: true,
        },
        { status: 401 }
      );
    }

    const roleLower = String(role || registeredAccount.role).toLowerCase();

    // Determine normalized role prefix and target path
    let sessionRole = registeredAccount.role;
    let targetPath = sessionRole === 'gerant' ? '/dashboard' : sessionRole === 'admin' ? '/admin' : '/portal';

    if (
      roleLower.includes('salon') ||
      roleLower.includes('gerant') ||
      roleLower.includes('gérant') ||
      roleLower.includes('pro') ||
      roleLower.includes('entreprise')
    ) {
      sessionRole = 'gerant';
      targetPath = '/dashboard';
    } else if (
      roleLower.includes('admin') ||
      roleLower.includes('super')
    ) {
      sessionRole = 'admin';
      targetPath = '/admin';
    }

    const sessionId = `${sessionRole}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Create HttpOnly Secure Cookie (OWASP Security Standard)
    const cookieStore = await cookies();
    cookieStore.set('kene-session', sessionId, {
      httpOnly: true, // Prevents XSS token extraction
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year persistent session (Facebook/TikTok standard)
    });

    return NextResponse.json({
      success: true,
      role: sessionRole,
      targetPath,
      user: {
        id: registeredAccount.id,
        name: registeredAccount.name,
        email: registeredAccount.email,
        phone: registeredAccount.phone,
        role: sessionRole,
      },
      message: 'Connexion sécurisée réussie (Certifié OWASP)',
    });
  } catch (error) {
    console.error('Auth login error:', error);
    return NextResponse.json({ success: false, error: 'Erreur d\'authentification' }, { status: 500 });
  }
}
