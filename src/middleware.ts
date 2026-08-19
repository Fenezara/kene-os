import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/jwt-auth';

const SECURITY_HEADERS = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(self), microphone=(self), geolocation=(self)',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' https:;",
};

const PRO_ROUTES = [
  '/dashboard', '/pos', '/agenda', '/clients', '/inventory', 
  '/reviews', '/employees', '/marketing', '/rh', '/lab',
  '/compta', '/services', '/settings', '/reports', '/referral', 
  '/caisse', '/marketplace', '/security'
];

const CLIENT_ROUTES = [
  '/portal', '/customizer', '/chat', '/diagnostic', '/client-wallet', '/ar-mirror'
];

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('kene-session');
  const { pathname } = request.nextUrl;

  // 0. Root Route Handler
  if (pathname === '/') {
    const response = NextResponse.next();
    applySecurityHeaders(response);
    return response;
  }

  // Allow public auth routes & static assets
  if (
    pathname === '/login' || 
    pathname === '/admin/login' || 
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    const response = NextResponse.next();
    applySecurityHeaders(response);
    return response;
  }

  // 🔒 Verify Cryptographic JWT Token Signature if cookie exists
  const token = sessionCookie?.value;
  const payload = token ? await verifyJWT(token) : null;

  // 1. Pro Route Protection: Requires VALID JWT with 'gerant' or 'admin' role
  const isProRoute = PRO_ROUTES.some(p => pathname.startsWith(p));
  if (isProRoute) {
    if (!payload || (payload.role !== 'gerant' && payload.role !== 'admin')) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      applySecurityHeaders(response);
      return response;
    }
  }

  // 2. Client Route Protection: Requires valid JWT session
  const isClientRoute = CLIENT_ROUTES.some(p => pathname.startsWith(p));
  if (isClientRoute) {
    if (!payload) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      applySecurityHeaders(response);
      return response;
    }
  }

  // 3. Super-Admin Route Protection: Requires valid JWT with 'admin' role
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!payload || payload.role !== 'admin') {
      const loginUrl = new URL('/admin/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      applySecurityHeaders(response);
      return response;
    }
  }

  // 4. CSRF & Security checks for API routes (mutating requests)
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth') && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    
    if (process.env.NODE_ENV === 'production') {
      // Block requests without Origin header on mutating API calls (except auth routes)
      if (!origin) {
        return new NextResponse(JSON.stringify({ error: 'Origin header required' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (host) {
        const originHost = new URL(origin).host;
        if (originHost !== host) {
          return new NextResponse(JSON.stringify({ error: 'CSRF verification failed' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }
    }
  }

  // 5. Pass request with Security Headers attached
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
