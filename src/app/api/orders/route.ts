import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { validateCustomerSession } from '@/lib/qr-auth';
import { PaymentFactory } from '@/lib/payments/PaymentFactory';

const createOrderSchema = z.object({
  paymentMode: z.enum(['card', 'upi', 'cash', 'sepolia']),
  specialNotes: z.string().optional(),
  items: z.array(z.object({
    menuItemId: z.string().min(1, 'Invalid item ID.'),
    variantId: z.string().optional(),
    quantity: z.number().int().positive('Quantity must be positive.'),
    notes: z.string().optional()
  })).min(1, 'Order must contain at least one item.')
});

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate Customer
    const session = await validateCustomerSession();

    // 2. Validate Payload
    const body = await request.json();
    const result = createOrderSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({
        data: null,
        error: result.error.issues[0].message,
      }, { status: 400 });
    }

    const { paymentMode, specialNotes, items } = result.data;

    // 3. Conditional Security Check: Cash Geofencing
    if (paymentMode === 'cash') {
      const forwardedFor = request.headers.get('x-forwarded-for');
      const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : (request.headers.get('x-real-ip') || 'unknown');
      const restaurantIp = process.env.RESTAURANT_BROADBAND_IP;

      // If a known IP is set in ENV, strictly enforce it.
      // If not set, we bypass (assuming dev or opt-out).
      if (restaurantIp && clientIp !== restaurantIp && clientIp !== '::1' && clientIp !== '127.0.0.1') {
        return NextResponse.json({
          data: null,
          error: 'Physical presence required for cash orders. Please connect to the restaurant Wi-Fi.'
        }, { status: 403 });
      }
    }

    // 4. Calculate Server-Side Pricing via Transaction
    const orderData = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsToCreate = [];

      for (const item of items) {
        // Fetch base item
        const menuItem = await tx.menuItem.findUnique({
          where: { id: item.menuItemId }
        });

        if (!menuItem || !menuItem.isAvailable) {
          throw new Error(`Item ${item.menuItemId} is unavailable or does not exist.`);
        }

        let unitPrice = Number(menuItem.price);

        // Fetch variant if provided
        if (item.variantId) {
          const variant = await tx.itemVariant.findUnique({
            where: { id: item.variantId }
          });
          if (!variant || variant.menuItemId !== menuItem.id || !variant.isAvailable) {
             throw new Error(`Variant ${item.variantId} is unavailable or invalid.`);
          }
          unitPrice += Number(variant.extraPrice);
        }

        totalAmount += unitPrice * item.quantity;

        orderItemsToCreate.push({
          menuItemId: item.menuItemId,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: unitPrice,
          notes: item.notes
        });
      }

      // Initialize the core Order
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          tableId: session.tableId,
          status: 'pending',
          totalAmount: totalAmount,
          finalAmount: totalAmount, // Discounts come later in Phase 2/Survey logic
          paymentMode: paymentMode,
          specialNotes: specialNotes,
          items: {
            create: orderItemsToCreate
          }
        },
        include: {
          items: true
        }
      });

      return newOrder;
    });

    // 5. Interface with Payment Strategy
    const paymentGateway = PaymentFactory.getGateway();
    const paymentResponse = await paymentGateway.initializeTransaction({
      amount: Number(orderData.finalAmount),
      orderId: orderData.id,
      currency: 'INR'
    });

    return NextResponse.json({
      data: {
        order: orderData,
        payment: paymentResponse
      },
      error: null,
    });

  } catch (error: any) {
    // Determine if it's an auth error vs business logic error
    const isAuthError = error.message.includes('Unauthorized');
    const isBusinessLogicError = error.message.includes('unavailable') || error.message.includes('invalid');

    return NextResponse.json({
      data: null,
      error: error.message || 'Internal server error',
    }, { status: isAuthError ? 401 : isBusinessLogicError ? 400 : 500 });
  }
}
