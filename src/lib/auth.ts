import { supabase } from './supabase';
import prisma from './prisma';

export async function requireRole(token: string | null | undefined, allowedRoles: string[]) {
  if (!token) {
    throw new Error('Unauthorized');
  }

  // Use the standard client (no service role bypass needed) to read the user identity from JWT
  const { data: { user }, error } = await supabase.auth.getUser(token);

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
