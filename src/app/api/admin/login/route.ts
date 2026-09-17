import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, createAdminToken, COOKIE_NAME, SESSION_MAX_AGE } from '@/lib/security/admin-auth';
import { checkAdminLoginRateLimit } from '@/lib/security/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting Protection via Upstash Redis (Max 5 login attempts per 15 minutes per IP)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    const rateLimit = await checkAdminLoginRateLimit(clientIp);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many failed attempts. Please wait 15 minutes before retrying.' },
        { status: rateLimit.redisUnavailable ? 503 : 429 }
      );
    }

    // 2. Parse payload
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // 3. Timing-Safe Password Verification
    const isValid = verifyAdminPassword(password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    // 4. Generate Signed Token
    const token = createAdminToken('admin');

    // 5. Construct Secure Response with HttpOnly Cookie
    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
    });

    const isLocalhost = clientIp === '127.0.0.1' || (request.headers.get('host') || '').includes('localhost');
    const isSecure = process.env.NODE_ENV === 'production' && !isLocalhost;

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Admin login error:', err);
    return NextResponse.json(
      { error: 'Internal authentication service error' },
      { status: 500 }
    );
  }
}
