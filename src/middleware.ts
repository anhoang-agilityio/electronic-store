import { NextResponse } from 'next/server';

import { auth } from '@/auth';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const protectedRoutes = ['/cart', '/checkout'];
  const guestRoutes = ['/auth/signin'];

  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route),
  );

  const isGuestRoute = guestRoutes.some((route) =>
    nextUrl.pathname.startsWith(route),
  );

  // Block access to protected routes if not logged in
  if (isProtectedRoute && !isLoggedIn) {
    // Redirect to sign-in page if trying to access protected route without authentication
    const signInUrl = new URL('/auth/signin', nextUrl.origin);
    signInUrl.searchParams.set('callbackUrl', nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Block access to authenticated blocked routes if already logged in
  if (isGuestRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/', nextUrl.origin));
  }

  return NextResponse.next();
});

// Configure which routes to run middleware on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
