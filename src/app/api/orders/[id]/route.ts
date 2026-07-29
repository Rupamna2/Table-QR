import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { validateCustomerSession } from '@/lib/qr-auth';
import { requireRole } from '@/lib/auth';
import { cookies } from 'next/headers';

const paramsSchema = z.object({
  id: z.string().min(1, 'Invalid order ID.'),
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Validate URL Params
    const params = await context.params;
    const result = paramsSchema.safeParse(params);

    if (!result.success) {
      return NextResponse.json({
        data: null,
        error: result.error.issues[0].message,
      }, { status: 400 });
    }

    const { id: orderId } = result.data;

    // 2. Fetch Order Data
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            menuItem: true,
            variant: true
          }
        },
        table: true
      }
    });

    if (!order) {
      return NextResponse.json({
        data: null,
        error: 'Order not found.',
      }, { status: 404 });
    }

    // 3. Authorization (Either the owning customer OR a staff/owner)
    let isAuthorized = false;

    // Try Staff first
    try {
      const cookieStore = await cookies();
      const staffSession = cookieStore.get('supabase-session');
      await requireRole(staffSession?.value, ['owner', 'staff']);
      isAuthorized = true;
    } catch (e) {
      // Not a staff member. Move to customer check.
    }

    // If not staff, try Customer
    if (!isAuthorized) {
      try {
        const session = await validateCustomerSession();
        if (session.user.id === order.userId) {
          isAuthorized = true;
        }
      } catch (e) {
        // Not a valid customer session either
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({
        data: null,
        error: 'Unauthorized to view this order.',
      }, { status: 403 });
    }

    return NextResponse.json({
      data: order,
      error: null,
    });
  } catch (error: any) {
    return NextResponse.json({
      data: null,
      error: error.message || 'Internal server error',
    }, { status: 500 });
  }
}
