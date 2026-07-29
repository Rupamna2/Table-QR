"use client";

import { useEffect, useState } from "react";
import { subscribeToOrder } from "@/lib/realtime";
import { CheckCircle2, Clock, ChefHat, Check } from "lucide-react";

interface OrderTrackerProps {
  initialOrder: any; // Using any for simplicity in typing Prisma model shape
}

const STATUS_STAGES = [
  { id: 'pending', label: 'Received', icon: Clock },
  { id: 'confirmed', label: 'Confirmed', icon: Check },
  { id: 'preparing', label: 'Preparing', icon: ChefHat },
  { id: 'ready', label: 'Ready', icon: CheckCircle2 }
];

export function OrderTracker({ initialOrder }: OrderTrackerProps) {
  const [order, setOrder] = useState(initialOrder);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Setup Realtime Subscription
    const channel = subscribeToOrder(order.id, (newPayload) => {
      setOrder(newPayload);
    });

    // 2. Fallback Polling (every 10s) in case socket disconnects
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${order.id}`);
        const { data } = await res.json();
        if (data) {
          setOrder(data);
        }
      } catch (err) {
        console.error("Failed to poll order status.");
      }
    }, 10000);

    // 3. Cleanup on unmount
    return () => {
      channel.unsubscribe();
      clearInterval(pollInterval);
    };
  }, [order.id]);

  const currentStageIndex = STATUS_STAGES.findIndex(s => s.id === order.status);
  const isCompleted = order.status === 'completed';
  const isCancelled = order.status === 'cancelled';

  if (isCancelled) {
    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--state-error)] rounded-2xl p-6 text-center">
        <h2 className="text-lg font-bold text-[var(--state-error)] mb-2">Order Cancelled</h2>
        <p className="text-sm text-[var(--text-muted)]">This order has been cancelled by the restaurant.</p>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--state-success)] rounded-2xl p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--state-success)]/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-[var(--state-success)]" />
        </div>
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">Enjoy your meal!</h2>
        <p className="text-sm text-[var(--text-muted)]">Your order is complete.</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl p-6 relative overflow-hidden">

      {/* Decorative pulse for the active state */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-50 animate-pulse" />

      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-6 text-center">Live Status</h2>

      <div className="flex flex-col gap-6 relative">
        {/* Connecting line */}
        <div className="absolute left-6 top-8 bottom-8 w-px bg-[var(--border-default)] -z-10" />

        {STATUS_STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isPast = idx < currentStageIndex || currentStageIndex === -1; // if completed, all are past
          const isActive = idx === currentStageIndex;
          const isFuture = idx > currentStageIndex && currentStageIndex !== -1;

          let colorClass = "text-[var(--text-muted)] border-[var(--border-default)] bg-[var(--bg-base)]";
          if (isActive) colorClass = "text-[var(--accent-primary)] border-[var(--accent-primary)] bg-[var(--bg-surface)] shadow-[0_0_15px_rgba(255,79,0,0.2)]";
          if (isPast) colorClass = "text-[var(--state-success)] border-[var(--state-success)] bg-[var(--state-success)]/10";

          return (
            <div key={stage.id} className={`flex items-center gap-4 transition-all duration-500 ${isFuture ? 'opacity-40' : 'opacity-100'}`}>
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors duration-500 ${colorClass}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'animate-bounce' : ''}`} />
              </div>
              <div className="flex-1">
                <h3 className={`font-bold ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                  {stage.label}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
