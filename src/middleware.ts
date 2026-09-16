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

  // Check if accessing via admin subdomain (e.g. admin.theindianwings.com or admin.localhost:3000)
  const isAdminSubdomain = hostname.startsWith('admin.');

  // Block access to /admin or /api/admin if not on the admin subdomain
  if ((pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) && !isAdminSubdomain) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // If on admin subdomain and accessing root '/', rewrite to '/admin'
  if (isAdminSubdomain) {
    if (!pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
      url.pathname = `/admin${pathname === '/' ? '' : pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // Protect /admin routes (except login page & auth API)
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const isSessionValid = await isValidAdminSession(token);

    // If accessing admin pages without valid session, redirect to login
    if (!isSessionValid && !isLoginPage) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      const response = NextResponse.redirect(loginUrl);
      if (token) {
        // Clear invalid/forged/expired cookie
        response.cookies.delete(COOKIE_NAME);
      }
      return response;
    }

    // If already logged in with valid token and visiting login page, redirect to dashboard
    if (isSessionValid && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, icons, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
