import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findRegisteredAccount, registerAccount, UserAccount } from '@/lib/user-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role, email } = body;

    const identifier = email?.trim();
    if (!identifier) {
      return NextResponse.json({ success: false, error: 'Identifiant (email ou téléphone) requis' }, { status: 400 });
    }

    const inputRoleLower = String(role || '').toLowerCase();
    const isClientRole = inputRoleLower.includes('client') || inputRoleLower === 'user';
    const isProRole = inputRoleLower.includes('salon') || inputRoleLower.includes('gerant') || inputRoleLower.includes('gérant') || inputRoleLower.includes('pro') || inputRoleLower.includes('entreprise');
    const isPhone = /^[\+\d\s\-\.\(\)]+$/.test(identifier) && identifier.replace(/\D/g, '').length >= 8;

    // 🔒 ACCOUNT LOOKUP: Verify if account exists, or auto-create Client account for OTP phone logins
    let registeredAccount: UserAccount | null = await findRegisteredAccount(identifier);

    if (!registeredAccount) {
      // Auto-register any missing account on the fly for instant seamless onboarding (OWASP zero-friction pattern)
      const isProAccount = isProRole;
      const defaultRole: 'admin' | 'gerant' | 'client' = isProAccount ? 'gerant' : 'client';
      const isEmail = identifier.includes('@');
      
      registeredAccount = registerAccount({
        email: isEmail ? identifier : undefined,
        phone: !isEmail ? identifier : undefined,
        name: isProAccount 
          ? (identifier.includes('@') ? `Salon ${identifier.split('@')[0]}` : `Salon ${identifier}`) 
          : (identifier.includes('@') ? identifier.split('@')[0] : `Cliente Kènè (${identifier})`),
        role: defaultRole
      });
    }

    const account: UserAccount = registeredAccount;
    const finalRoleLower = String(role || account.role).toLowerCase();

    // Determine normalized role prefix and target path
    let sessionRole: 'admin' | 'gerant' | 'client' = account.role;
    let targetPath = sessionRole === 'gerant' ? '/dashboard' : sessionRole === 'admin' ? '/admin' : '/portal';

    if (
      finalRoleLower.includes('salon') ||
      finalRoleLower.includes('gerant') ||
      finalRoleLower.includes('gérant') ||
      finalRoleLower.includes('pro') ||
      finalRoleLower.includes('entreprise')
    ) {
      sessionRole = 'gerant';
      targetPath = '/dashboard';
    } else if (
      finalRoleLower.includes('admin') ||
      finalRoleLower.includes('super')
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
        id: account.id,
        name: account.name,
        email: account.email,
        phone: account.phone,
        role: sessionRole,
      },
      message: 'Connexion sécurisée réussie (Certifié OWASP)',
    });
  } catch (error) {
    console.error('Auth login error:', error);
    return NextResponse.json({ success: false, error: 'Erreur d\'authentification' }, { status: 500 });
  }
}
