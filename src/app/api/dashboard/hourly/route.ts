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

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

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
      select: {
        createdAt: true,
        finalAmount: true
      }
    });

    // Initialize map for hours 0-23
    const hourlyData: Record<number, Decimal> = {};
    for (let i = 0; i < 24; i++) {
      hourlyData[i] = new Decimal(0);
    }

    todaysOrders.forEach(order => {
      const hour = order.createdAt.getHours();
      hourlyData[hour] = hourlyData[hour].add(new Decimal(order.finalAmount.toString()));
    });

    // Format for Recharts: { time: "14:00", revenue: 150.50 }
    // We only return hours from 0 up to current hour to make the chart look natural for "today's flow"
    const currentHour = new Date().getHours();

    const formattedData = [];
    for (let i = 0; i <= currentHour; i++) {
      const hourString = i.toString().padStart(2, '0') + ":00";
      formattedData.push({
        time: hourString,
        revenue: hourlyData[i].toNumber()
      });
    }

    return NextResponse.json({
      data: formattedData,
      error: null,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ data: null, error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 });
    }
    return NextResponse.json({ data: null, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
