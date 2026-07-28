import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

const sendOtpSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format. Must include country code, e.g. +1234567890.'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = sendOtpSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({
        data: null,
        error: result.error.issues[0].message,
      }, { status: 400 });
    }

    const { phone } = result.data;

    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
    });

    if (error) {
      return NextResponse.json({
        data: null,
        error: error.message,
      }, { status: 500 });
    }

    return NextResponse.json({
      data: { message: 'OTP sent successfully' },
      error: null,
    });
  } catch (error: any) {
    return NextResponse.json({
      data: null,
      error: error.message || 'Internal server error',
    }, { status: 500 });
  }
}
