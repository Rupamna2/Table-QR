import { NextResponse, NextRequest } from 'next/server';
import crypto from 'crypto';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { generateQRCodeDataURI } from '@/lib/qrcode';
import { cookies } from 'next/headers';

const paramsSchema = z.object({
  id: z.string().min(1, 'Invalid table ID format.'),
});

// Using Node crypto for backend routes (Edge uses crypto.subtle in middleware)
const QR_SECRET = process.env.QR_SECRET || 'dev-fallback-secret-tableqr-pro-2024';

function generateHMAC(tableId: string, ts: string): string {
  const hmac = crypto.createHmac('sha256', QR_SECRET);
  hmac.update(`${tableId}:${ts}`);
  return hmac.digest('hex');
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Authorize Owner via session cookie (Strictly 'owner', not 'staff')
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('supabase-session');

    await requireRole(sessionCookie?.value, ['owner']);

    // 2. Validate params
    const params = await context.params;
    const result = paramsSchema.safeParse(params);

    if (!result.success) {
      return NextResponse.json({
        data: null,
        error: result.error.issues[0].message,
      }, { status: 400 });
    }

    const { id: tableId } = result.data;

    // 3. Ensure table exists
    const table = await prisma.restaurantTable.findUnique({
      where: { id: tableId }
    });

    if (!table) {
      return NextResponse.json({
        data: null,
        error: 'Table not found',
      }, { status: 404 });
    }

    // 4. Generate timestamp and signature
    const ts = Date.now().toString();
    const sig = generateHMAC(tableId, ts);

    // Provide the absolute base URL based on environment
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.tableqr.pro';
    const tableUrl = `${baseUrl}/menu/${tableId}?ts=${ts}&sig=${sig}`;

    // 5. Generate actual QR code data URI
    const qrCodeDataUri = await generateQRCodeDataURI(tableUrl);

    // 6. Persist token configuration to the DB
    const fullToken = `${ts}:${sig}`;

    await prisma.restaurantTable.update({
      where: { id: tableId },
      data: {
        qrToken: fullToken
      }
    });

    return NextResponse.json({
      data: {
        tableUrl,
        qrCodeDataUri,
        tableNum: table.tableNum
      },
      error: null,
    });
  } catch (error: any) {
    // If authorization failed from requireRole
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({
        data: null,
        error: error.message,
      }, { status: error.message === 'Unauthorized' ? 401 : 403 });
    }

    return NextResponse.json({
      data: null,
      error: error.message || 'Internal server error',
    }, { status: 500 });
  }
}
