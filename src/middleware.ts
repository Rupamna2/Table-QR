import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // We only protect the dashboard side. Since we are using route groups like (owner),
  // the actual URL path is /dashboard and /login.
  // The prompt asked for /owner/login and /owner/dashboard in the code, but architectural specs
  // say app/(owner)/. So the URL path is actually /dashboard and /login.

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // In an MVP using `@supabase/supabase-js`, the token can be set as a cookie by the client.
    // We check for the presence of a "supabase-session" cookie which our UI will set.
    const sessionCookie = request.cookies.get('supabase-session');

    if (!sessionCookie) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
