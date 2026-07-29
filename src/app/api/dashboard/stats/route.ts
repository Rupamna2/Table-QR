import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { cookies } from 'next/headers';
import Decimal from 'decimal.js';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('supabase-session');
    await requireRole(sessionCookie?.value, ['owner', 'staff']);

    // Define "today" boundaries
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Fetch all non-cancelled orders for today
    const todaysOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startOfToday,
          lte: endOfToday
        },
        status: {
          not: 'cancelled'
        }
      },
      include: {
        items: {
          include: {
            menuItem: true
          }
        }
      }
    });

    const orderCount = todaysOrders.length;

    let revenue = new Decimal(0);
    const itemCounts: Record<string, { count: number, name: string }> = {};

    todaysOrders.forEach(order => {
      revenue = revenue.add(new Decimal(order.finalAmount.toString()));

      order.items.forEach(item => {
        if (!itemCounts[item.menuItemId]) {
          itemCounts[item.menuItemId] = { count: 0, name: item.menuItem.name };
        }
        itemCounts[item.menuItemId].count += item.quantity;
      });
    });

    // Find top item
    let topDish = "None";
    let maxCount = 0;
    Object.values(itemCounts).forEach(item => {
      if (item.count > maxCount) {
        maxCount = item.count;
        topDish = item.name;
      }
    });

    // Calculate rating (Stubbed as 0 for now per Unit 16 prep)
    const averageRating = 0;

    return NextResponse.json({
      data: {
        revenue: revenue.toNumber(),
        orderCount,
        averageRating,
        topDish
      },
      error: null,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ data: null, error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 });
    }
    return NextResponse.json({ data: null, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
