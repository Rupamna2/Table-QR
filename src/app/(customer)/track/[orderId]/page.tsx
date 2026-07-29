import { OrderTracker } from "@/components/customer/track/OrderTracker";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function OrderTrackingPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;

  // Pre-fetch the initial state so we can hydrate the tracker
  const order = await prisma.order.findUnique({
    where: { id: orderId }
  });

  if (!order) {
    notFound();
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--bg-base)]">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-[var(--text-primary)] mb-2">Track Order</h1>
        <p className="text-center text-[var(--text-muted)] mb-8">
          Order #{order.id.slice(0, 8).toUpperCase()}
        </p>

        <OrderTracker initialOrder={order} />
      </div>
    </main>
  );
}
