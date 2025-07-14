import { NextResponse } from 'next/server';

import { auth } from '@/auth';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Protected routes
  const protectedRoutes = ['/cart', '/checkout'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route),
  );

  if (isProtectedRoute && !isLoggedIn) {
    // Redirect to sign-in page if trying to access protected route without authentication
    const signInUrl = new URL('/auth/signin', nextUrl.origin);
    signInUrl.searchParams.set('callbackUrl', nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

// Configure which routes to run middleware on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
