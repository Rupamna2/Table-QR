import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

// The client-side instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  }
});

// A server-side factory for using the service role to bypass RLS in secure API routes.
// DO NOT expose process.env.SUPABASE_SERVICE_ROLE_KEY to the client!
export const getServiceSupabase = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY in environment variables.');
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    }
  });
};
