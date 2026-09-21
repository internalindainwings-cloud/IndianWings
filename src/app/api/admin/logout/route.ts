import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/security/admin-auth';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  
  const isSecure = process.env.NODE_ENV === 'production';

  response.cookies.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return response;
}
