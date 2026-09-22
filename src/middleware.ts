import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'tiwc_admin_session';

async function isValidAdminSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.ADMIN_SECRET_KEY;
  if (!secret) return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [encodedPayload, signature] = parts;

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const base64 = signature.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
    const binaryStr = atob(padded);
    const sigBytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      sigBytes[i] = binaryStr.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      encoder.encode(encodedPayload)
    );

    if (!isValid) return false;

    const payloadBase64 = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
    const payloadPad = payloadBase64.length % 4;
    const payloadPadded = payloadPad ? payloadBase64 + '='.repeat(4 - payloadPad) : payloadBase64;
    const payloadJson = atob(payloadPadded);
    const parsed = JSON.parse(payloadJson);

    if (parsed.exp && Date.now() > parsed.exp) {
      return false; // Expired
    }

    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  const pathname = url.pathname;

  // Generate cryptographically secure per-request nonce
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const isDev = process.env.NODE_ENV === 'development';

  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://www.clarity.ms',
    'https://*.clarity.ms',
    'https://cdn.botpress.cloud',
    'https://files.bpcontent.cloud',
    'https://*.botpress.cloud',
    ...(isDev ? ["'unsafe-eval'"] : []),
  ].join(' ');

  const connectSrc = [
    "'self'",
    'https://*.onrender.com',
    ...(isDev ? ['http://localhost:3001', 'http://127.0.0.1:3001'] : []),
    'https://www.google-analytics.com',
    'https://*.google-analytics.com',
    'https://analytics.google.com',
    'https://www.clarity.ms',
    'https://*.clarity.ms',
    'https://res.cloudinary.com',
    'https://*.botpress.cloud',
    'https://files.bpcontent.cloud',
    'wss://*.botpress.cloud',
  ].join(' ');

  const cspHeader = [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.botpress.cloud",
    "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://www.clarity.ms https://*.clarity.ms https://*.google-analytics.com https://*.botpress.cloud https://files.bpcontent.cloud",
    "font-src 'self' https://fonts.gstatic.com data:",
    "media-src 'self' blob: https://res.cloudinary.com",
    `connect-src ${connectSrc}`,
    "frame-src 'self' https://*.botpress.cloud",
    "frame-ancestors 'self'",
    "form-action 'self'",
    "base-uri 'self'",
  ].join('; ');

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');

  const effectivePath = url.pathname;

  if (effectivePath.startsWith('/admin')) {
    const isLoginPage = effectivePath === '/admin/login';
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const isSessionValid = await isValidAdminSession(token);

    if (!isSessionValid && !isLoginPage) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      const redirectResponse = NextResponse.redirect(loginUrl);
      if (token) {
        redirectResponse.cookies.delete(COOKIE_NAME);
      }
      return redirectResponse;
    }

    if (isSessionValid && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  if (effectivePath.startsWith('/api/admin')) {
    const isPublicAuthApi = effectivePath === '/api/admin/login' || effectivePath === '/api/admin/logout';
    if (!isPublicAuthApi) {
      const token = request.cookies.get(COOKIE_NAME)?.value;
      const isSessionValid = await isValidAdminSession(token);

      if (!isSessionValid) {
        const jsonResponse = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (token) {
          jsonResponse.cookies.delete(COOKIE_NAME);
        }
        return jsonResponse;
      }
    }
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set('Content-Security-Policy', cspHeader);
  return response;
}

export const config = {
  matcher: [

    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
