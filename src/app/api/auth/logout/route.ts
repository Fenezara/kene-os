import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.set('kene-session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    });

    return NextResponse.json({ success: true, message: 'Déconnexion réussie' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erreur lors de la déconnexion' }, { status: 500 });
  }
}
