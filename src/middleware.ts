import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Fallback secret for dev/testing, production should strictly provide QR_SECRET
const QR_SECRET = process.env.QR_SECRET || 'dev-fallback-secret-tableqr-pro-2024';

async function verifyHMAC(tableId: string, ts: string, signature: string): Promise<boolean> {
  const encoder = new TextEncoder();

  // Create key
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(QR_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  // Payload is strictly 'tableId:ts'
  const payload = encoder.encode(`${tableId}:${ts}`);

  // Convert hex signature back to Uint8Array
  const sigBuffer = new Uint8Array(signature.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);

  try {
    return await crypto.subtle.verify(
      'HMAC',
      keyMaterial,
      sigBuffer,
      payload
    );
  } catch (e) {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Dashboard Protection (Staff/Owner)
  if (pathname.startsWith('/dashboard')) {
    const sessionCookie = request.cookies.get('supabase-session');
    if (!sessionCookie) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2. Customer QR Session Anchoring
  if (pathname.startsWith('/menu/')) {
    const tableId = pathname.split('/menu/')[1];

    // Check if user already has an active session for THIS table
    const existingSession = request.cookies.get('active_table_session');

    // If they have query params, they just scanned a fresh QR code
    const ts = searchParams.get('ts');
    const sig = searchParams.get('sig');

    if (ts && sig) {
      // Validate Timestamp (must be within 3 hours)
      const timestamp = parseInt(ts, 10);
      const now = Date.now();
      const threeHours = 3 * 60 * 60 * 1000;

      if (isNaN(timestamp) || now - timestamp > threeHours || timestamp > now + 60000) {
        // Expired or invalid QR code
        return new NextResponse('QR code expired. Please ask for a new QR code.', { status: 403 });
      }

      // Validate HMAC Signature
      const isValid = await verifyHMAC(tableId, ts, sig);

      if (!isValid) {
        return new NextResponse('Invalid QR code signature.', { status: 403 });
      }

      // Create a unique session ID binding them to this table scan
      const newSessionId = crypto.randomUUID();

      // Strip query parameters from the visible URL
      const redirectUrl = new URL(pathname, request.url);
      const response = NextResponse.redirect(redirectUrl);

      // Set the 3-hour HttpOnly cookie
      response.cookies.set({
        name: 'active_table_session',
        value: `${tableId}::${newSessionId}`,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3 * 60 * 60 // 3 hours
      });

      return response;
    }

    // If they have no signature but they DO have a valid cookie, let them pass
    if (existingSession && existingSession.value.startsWith(`${tableId}::`)) {
      return NextResponse.next();
    }

    // No valid signature and no valid session cookie
    return new NextResponse('Unauthorized table access. Please scan the QR code on your table.', { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/menu/:path*'
  ],
};
