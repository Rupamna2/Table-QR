import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import prisma from '@/lib/prisma';

const staffLoginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = staffLoginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({
        data: null,
        error: result.error.issues[0].message,
      }, { status: 400 });
    }

    const { email, password } = result.data;

    // Authenticate with Supabase Auth
    const { data: sessionData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError || !sessionData.session) {
      return NextResponse.json({
        data: null,
        error: loginError?.message || 'Invalid credentials.',
      }, { status: 401 });
    }

    // Verify StaffAccount exists in our database and retrieve their role
    const staffAccount = await prisma.staffAccount.findUnique({
      where: { email },
    });

    if (!staffAccount) {
      // Security measure: if they authenticate via Supabase Auth but aren't in our DB, deny access
      return NextResponse.json({
        data: null,
        error: 'Unauthorized access. Staff account not found in system.',
      }, { status: 403 });
    }

    return NextResponse.json({
      data: {
        session: sessionData.session,
        user: {
          id: staffAccount.id,
          email: staffAccount.email,
          role: staffAccount.role, // 'owner' or 'staff'
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
