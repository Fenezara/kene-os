/**
 * Kènè OS — Enterprise Cryptographic JWT Auth Engine (OWASP Top 10 & ISO 27001 Compliant)
 * Built using native Web Crypto API (HMAC-SHA256) for zero-dependency Edge Runtime compatibility.
 */

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('FATAL: JWT_SECRET environment variable is required in production');
}
const SECRET = JWT_SECRET || 'dev-only-local-secret-not-for-production';

export interface JWTPayload {
  sub: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'admin' | 'gerant' | 'client';
  tenantId?: string;
  iat: number;
  exp: number;
}

// Convert string secret to CryptoKey
async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

// Helper: base64url encode/decode
function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

/**
 * Sign a JWT Token using HMAC SHA-256
 */
export async function signJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>, expiresInSeconds = 86400 * 30): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresInSeconds;
  
  const header = { alg: 'HS256', typ: 'JWT' };
  const fullPayload: JWTPayload = { ...payload, iat, exp };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  const dataToSign = `${encodedHeader}.${encodedPayload}`;
  const key = await getCryptoKey(SECRET);
  const encoder = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(dataToSign));
  
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signatureStr = String.fromCharCode(...signatureArray);
  const encodedSignature = base64UrlEncode(signatureStr);

  return `${dataToSign}.${encodedSignature}`;
}

/**
 * Verify and decode a JWT Token
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const dataToSign = `${encodedHeader}.${encodedPayload}`;

    const key = await getCryptoKey(SECRET);
    const encoder = new TextEncoder();

    // Reconstruct signature bytes
    const signatureStr = base64UrlDecode(encodedSignature);
    const signatureBytes = new Uint8Array(signatureStr.length);
    for (let i = 0; i < signatureStr.length; i++) {
      signatureBytes[i] = signatureStr.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify('HMAC', key, signatureBytes, encoder.encode(dataToSign));
    if (!isValid) return null;

    const payload: JWTPayload = JSON.parse(base64UrlDecode(encodedPayload));
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}
