import { NextRequest, NextResponse } from 'next/server';

import { isQaAuthBypassEnabled, QA_AUTH_BYPASS_COOKIE } from '@/lib/env';

function getSafeRedirectTarget(request: NextRequest) {
  const target = request.nextUrl.searchParams.get('next') ?? '/ko/home';
  if (!target.startsWith('/') || target.startsWith('//')) {
    return new URL('/ko/home', request.url);
  }

  return new URL(target, request.url);
}

function isSecureRequest(request: NextRequest) {
  return request.nextUrl.protocol === 'https:';
}

export function GET(request: NextRequest) {
  if (!isQaAuthBypassEnabled()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const response = NextResponse.redirect(getSafeRedirectTarget(request));
  response.cookies.set(QA_AUTH_BYPASS_COOKIE, '1', {
    httpOnly: true,
    maxAge: 60 * 60 * 8,
    path: '/',
    sameSite: 'lax',
    secure: isSecureRequest(request)
  });

  return response;
}

export function DELETE(request: NextRequest) {
  if (!isQaAuthBypassEnabled()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(QA_AUTH_BYPASS_COOKIE, '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
    sameSite: 'lax',
    secure: isSecureRequest(request)
  });

  return response;
}
