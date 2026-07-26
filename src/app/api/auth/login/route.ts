import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role, email } = body;

    if (!role) {
      return NextResponse.json({ success: false, error: 'Rôle manquant' }, { status: 400 });
    }

    const roleLower = String(role).toLowerCase();

    // Determine normalized role prefix and target path
    let sessionRole = 'client';
    let targetPath = '/portal';

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
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      success: true,
      role: sessionRole,
      targetPath,
      message: 'Connexion sécurisée réussie (Cookie HttpOnly)',
    });
  } catch (error) {
    console.error('Auth login error:', error);
    return NextResponse.json({ success: false, error: 'Erreur d\'authentification' }, { status: 500 });
  }
}
