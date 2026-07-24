import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SECURITY_HEADERS = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(self), microphone=(), geolocation=(self)',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' https:;",
};

const PROTECTED_ROUTES = [
  '/dashboard', '/pos', '/agenda', '/clients', '/inventory', 
  '/reviews', '/employees', '/marketing', '/rh', '/lab',
  '/compta', '/services', '/settings', '/reports', '/referral', 
  '/caisse', '/admin'
];

export function middleware(request: NextRequest) {
  const session = request.cookies.get('kene-session');
  const { pathname } = request.nextUrl;

  // Allow /admin/login to pass through without session check
  if (pathname === '/admin/login') {
    const response = NextResponse.next();
    applySecurityHeaders(response);
    return response;
  }

  // 1. Check if route requires authentication
  const isProtected = PROTECTED_ROUTES.some(p => pathname.startsWith(p));

  if (isProtected && !session) {
    const targetRedirect = pathname.startsWith('/admin') ? '/admin/login' : '/login';
    const loginUrl = new URL(targetRedirect, request.url);
    const safeRedirect = pathname.startsWith('/') ? pathname : '/dashboard';
    loginUrl.searchParams.set('redirect', safeRedirect);
    
    const response = NextResponse.redirect(loginUrl);
    applySecurityHeaders(response);
    return response;
  }

  // 2. Strict Super-Admin Route Protection: Only 'admin' role can access /admin routes
  if (pathname.startsWith('/admin') && session) {
    const isSuperAdmin = session.value.startsWith('admin-');
    if (!isSuperAdmin) {
      const loginUrl = new URL('/admin/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      applySecurityHeaders(response);
      return response;
    }
  }

  // 3. CSRF & Security checks for API routes
  if (pathname.startsWith('/api/') && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    
    if (process.env.NODE_ENV === 'production' && origin && host) {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return new NextResponse(JSON.stringify({ error: 'CSRF verification failed' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
  }

  // 4. Pass request with Security Headers attached
  const response = NextResponse.next();
  applySecurityHeaders(response);
  return response;
}

function applySecurityHeaders(response: NextResponse) {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
