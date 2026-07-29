import { supabase } from './supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export function subscribeToOrder(
  orderId: string,
  onUpdate: (payload: any) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`order_tracking_${orderId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'Order',
        filter: `id=eq.${orderId}`,
      },
      (payload) => {
        onUpdate(payload.new);
      }
    )
    .subscribe();

  return channel;
}
