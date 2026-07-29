export default async function OrderTrackingStub({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--bg-base)] text-center">
      <div className="w-16 h-16 rounded-full bg-[var(--state-success)]/20 flex items-center justify-center mb-6">
        <div className="w-8 h-8 rounded-full bg-[var(--state-success)] animate-pulse" />
      </div>

      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Order Confirmed!</h1>
      <p className="text-[var(--text-muted)] mb-8">
        Order #{orderId.slice(0, 8).toUpperCase()} has been sent to the kitchen.
      </p>

      <div className="w-full max-w-sm bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Live Status</h2>
        <div className="flex items-center justify-center text-xl font-bold text-[var(--accent-gold)]">
          Preparing...
        </div>
        <p className="text-sm text-[var(--text-muted)] mt-4">
          (Realtime tracking will be implemented in Unit 10)
        </p>
      </div>
    </main>
  );
}
