import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';

// Loosen validation from strict UUID to general string, as our seed data uses "item-1", etc.
const paramsSchema = z.object({
  id: z.string().min(1, 'Invalid item ID format.'),
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const result = paramsSchema.safeParse(params);

    if (!result.success) {
      return NextResponse.json({
        data: null,
        error: result.error.issues[0].message,
      }, { status: 400 });
    }

    const { id } = result.data;

    const item = await prisma.menuItem.findUnique({
      where: { id },
      include: {
        variants: {
          where: { isAvailable: true }
        }
      },
    });

    if (!item) {
      return NextResponse.json({
        data: null,
        error: 'Menu item not found.',
      }, { status: 404 });
    }

    if (!item.isAvailable) {
      return NextResponse.json({
        data: null,
        error: 'Menu item is currently unavailable.',
      }, { status: 404 });
    }

    return NextResponse.json({
      data: item,
      error: null,
    });
  } catch (error: any) {
    return NextResponse.json({
      data: null,
      error: error.message || 'Internal server error',
    }, { status: 500 });
  }
}
