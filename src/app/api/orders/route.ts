import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { validateCustomerSession } from '@/lib/qr-auth';
import { PaymentFactory } from '@/lib/payments/PaymentFactory';
import Decimal from 'decimal.js';

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
    const session = await validateCustomerSession();
    const body = await request.json();
    const result = createOrderSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({
        data: null,
        error: result.error.issues[0].message,
      }, { status: 400 });
    }

    const { paymentMode, specialNotes, items } = result.data;

    if (paymentMode === 'cash') {
      const forwardedFor = request.headers.get('x-forwarded-for');
      const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : (request.headers.get('x-real-ip') || 'unknown');
      const restaurantIp = process.env.RESTAURANT_BROADBAND_IP;

      if (restaurantIp && clientIp !== restaurantIp && clientIp !== '::1' && clientIp !== '127.0.0.1') {
        return NextResponse.json({
          data: null,
          error: 'Physical presence required for cash orders. Please connect to the restaurant Wi-Fi.'
        }, { status: 403 });
      }
    }

    const orderData = await prisma.$transaction(async (tx) => {
      let totalAmount = new Decimal(0);
      const orderItemsToCreate = [];

      for (const item of items) {
        const menuItem = await tx.menuItem.findUnique({
          where: { id: item.menuItemId }
        });

        if (!menuItem || !menuItem.isAvailable) {
          throw new Error(`Item ${item.menuItemId} is unavailable or does not exist.`);
        }

        let unitPrice = new Decimal(menuItem.price.toString());

        if (item.variantId) {
          const variant = await tx.itemVariant.findUnique({
            where: { id: item.variantId }
          });
          if (!variant || variant.menuItemId !== menuItem.id || !variant.isAvailable) {
             throw new Error(`Variant ${item.variantId} is unavailable or invalid.`);
          }
          unitPrice = unitPrice.add(new Decimal(variant.extraPrice.toString()));
        }

        const itemTotal = unitPrice.mul(new Decimal(item.quantity));
        totalAmount = totalAmount.add(itemTotal);

        orderItemsToCreate.push({
          menuItemId: item.menuItemId,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: unitPrice.toString(),
          notes: item.notes
        });
      }

      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          tableId: session.tableId,
          status: 'pending',
          totalAmount: totalAmount.toString(),
          finalAmount: totalAmount.toString(),
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

    const paymentGateway = PaymentFactory.getGateway();
    const paymentResponse = await paymentGateway.initializeTransaction({
      amount: Number(orderData.finalAmount), // Third-party payment APIs usually expect numbers
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
    const isAuthError = error.message.includes('Unauthorized');
    const isBusinessLogicError = error.message.includes('unavailable') || error.message.includes('invalid');

    return NextResponse.json({
      data: null,
      error: error.message || 'Internal server error',
    }, { status: isAuthError ? 401 : isBusinessLogicError ? 400 : 500 });
  }
}
