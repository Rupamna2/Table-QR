import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { cookies } from 'next/headers';

const paramsSchema = z.object({
  id: z.string().min(1, 'Invalid order ID.'),
});

const validTransitions: Record<string, string[]> = {
  'pending': ['confirmed', 'cancelled'],
  'confirmed': ['preparing', 'cancelled'],
  'preparing': ['ready', 'cancelled'],
  'ready': ['completed', 'cancelled'],
  'completed': [],
  'cancelled': []
};

const updateStatusSchema = z.object({
  status: z.enum(['confirmed', 'preparing', 'ready', 'completed', 'cancelled']),
});

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Authorization: Only Staff or Owner can mutate order status
    const cookieStore = await cookies();
    const staffSession = cookieStore.get('supabase-session');
    await requireRole(staffSession?.value, ['owner', 'staff']);

    // 2. Validate Params and Payload
    const params = await context.params;
    const paramsResult = paramsSchema.safeParse(params);

    if (!paramsResult.success) {
      return NextResponse.json({
        data: null,
        error: paramsResult.error.issues[0].message,
      }, { status: 400 });
    }

    const body = await request.json();
    const bodyResult = updateStatusSchema.safeParse(body);

    if (!bodyResult.success) {
      return NextResponse.json({
        data: null,
        error: bodyResult.error.issues[0].message,
      }, { status: 400 });
    }

    const { id: orderId } = paramsResult.data;
    const { status: targetStatus } = bodyResult.data;

    // 3. Retrieve Current Order
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json({
        data: null,
        error: 'Order not found.',
      }, { status: 404 });
    }

    // 4. Enforce State Machine Invariant 4
    const allowedNextStates = validTransitions[order.status] || [];
    if (!allowedNextStates.includes(targetStatus)) {
      return NextResponse.json({
        data: null,
        error: `Invalid status transition. Cannot move from '${order.status}' to '${targetStatus}'.`,
      }, { status: 400 });
    }

    // 5. Update Status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: targetStatus }
    });

    return NextResponse.json({
      data: updatedOrder,
      error: null,
    });
  } catch (error: any) {
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
