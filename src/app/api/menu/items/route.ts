import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';

const querySchema = z.object({
  category_id: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = querySchema.safeParse(Object.fromEntries(searchParams));

    if (!result.success) {
      return NextResponse.json({
        data: null,
        error: result.error.issues[0].message,
      }, { status: 400 });
    }

    const { category_id } = result.data;

    // Prisma filter object
    const whereClause: any = {
      isAvailable: true,
    };

    if (category_id) {
      whereClause.categoryId = category_id;
    }

    const items = await prisma.menuItem.findMany({
      where: whereClause,
      include: {
        variants: {
          where: { isAvailable: true }
        }
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });

    return NextResponse.json({
      data: items,
      error: null,
    });
  } catch (error: any) {
    return NextResponse.json({
      data: null,
      error: error.message || 'Internal server error',
    }, { status: 500 });
  }
}
