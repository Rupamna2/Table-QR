import { cookies } from 'next/headers';
import prisma from './prisma';

export async function validateCustomerSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('active_table_session');

  if (!sessionCookie) {
    throw new Error('Unauthorized: No active table session.');
  }

  const [tableId, sessionId] = sessionCookie.value.split('::');

  if (!tableId || !sessionId) {
    throw new Error('Unauthorized: Invalid session format.');
  }

  // Ensure the User row exists for this footprint
  const user = await prisma.user.upsert({
    where: { sessionId },
    update: { tableId },
    create: {
      sessionId,
      tableId,
      role: 'customer'
    }
  });

  return { tableId, sessionId, user };
}
