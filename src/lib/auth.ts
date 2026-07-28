import { getServiceSupabase } from './supabase';
import prisma from './prisma';

export async function requireRole(token: string | null | undefined, allowedRoles: string[]) {
  if (!token) {
    throw new Error('Unauthorized');
  }

  // We use the service client to bypass RLS and quickly get the user by their JWT
  const supabaseService = getServiceSupabase();
  const { data: { user }, error } = await supabaseService.auth.getUser(token);

  if (error || !user) {
    throw new Error('Unauthorized');
  }

  // Look up staff account by email (auth identifier)
  if (!user.email) {
    throw new Error('Unauthorized');
  }

  const staffAccount = await prisma.staffAccount.findUnique({
    where: { email: user.email },
  });

  if (!staffAccount) {
    throw new Error('Unauthorized');
  }

  if (!allowedRoles.includes(staffAccount.role)) {
    throw new Error('Forbidden');
  }

  return staffAccount;
}
