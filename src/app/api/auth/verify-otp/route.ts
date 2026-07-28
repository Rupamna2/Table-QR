import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import prisma from '@/lib/prisma';

const verifyOtpSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format.'),
  code: z.string().min(6, 'OTP must be at least 6 characters.'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = verifyOtpSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({
        data: null,
        error: result.error.issues[0].message,
      }, { status: 400 });
    }

    const { phone, code } = result.data;

    const { data: sessionData, error: verifyError } = await supabase.auth.verifyOtp({
      phone,
      token: code,
      type: 'sms',
    });

    if (verifyError || !sessionData.session) {
      return NextResponse.json({
        data: null,
        error: verifyError?.message || 'Failed to verify OTP.',
      }, { status: 401 });
    }

    // Upsert the User record in the Prisma DB to tie to our business logic
    const user = await prisma.user.upsert({
      where: { phone },
      update: {},
      create: {
        phone,
        role: 'customer',
      },
    });

    return NextResponse.json({
      data: {
        session: sessionData.session,
        user: {
          id: user.id,
          phone: user.phone,
          role: user.role,
        }
      },
      error: null,
    });
  } catch (error: any) {
    return NextResponse.json({
      data: null,
      error: error.message || 'Internal server error',
    }, { status: 500 });
  }
}
