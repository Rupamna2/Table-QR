"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, ChevronRight, X, Minus, Plus } from "lucide-react";
import { useCart } from "./CartProvider";
import { Button } from "@/components/ui/button";

export function CartSheet() {
  const router = useRouter();
  const { items, totalItems, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'card' | 'upi' | 'cash' | 'sepolia'>('cash');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (totalItems === 0 && !isOpen) return null;

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    const payload = {
      paymentMode,
      items: items.map(i => ({
        menuItemId: i.menuItemId,
        variantId: i.variantId,
        quantity: i.quantity,
        notes: i.notes
      }))
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to place order.");
      }

      // Success: Clear cart and redirect
      clearCart();
      setIsOpen(false);
      router.push(`/track/${data.data.order.id}`);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Bar Trigger */}
      {!isOpen && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-40 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <button
              onClick={() => setIsOpen(true)}
              className="w-full bg-[var(--accent-primary)] text-white rounded-2xl shadow-lg shadow-[var(--accent-primary)]/20 p-4 flex items-center justify-between hover:opacity-95 transition-opacity"
            >
              <div className="flex items-center">
                <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center mr-3 relative">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 bg-white text-[var(--accent-primary)] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs text-white/80 font-medium uppercase tracking-wider">View Cart</span>
                  <span className="font-bold">${subtotal.toFixed(2)}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/80" />
            </button>
          </div>
        </div>
      )}

      {/* Slide-Up Sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Content */}
          <div className="relative bg-[var(--bg-surface)] w-full max-w-md mx-auto rounded-t-3xl border-t border-x border-[var(--border-default)] flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-default)] shrink-0">
              <h2 className="text-xl font-bold flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2 text-[var(--accent-primary)]" />
                Your Order
              </h2>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-[var(--bg-glass)] text-[var(--text-muted)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-8 text-[var(--text-muted)]">Your cart is empty.</div>
              ) : (
                items.map((item) => (
                  <div key={item.cartItemId} className="flex gap-4 pb-4 border-b border-[var(--border-default)] last:border-0">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <span className="font-bold text-sm text-[var(--accent-primary)]">
                           ${((item.basePrice + (item.variantPrice || 0)) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      {item.variantName && (
                        <p className="text-xs text-[var(--text-muted)] mb-1">+ {item.variantName}</p>
                      )}
                      {item.notes && (
                        <p className="text-xs text-[var(--text-muted)] italic mb-2">Note: {item.notes}</p>
                      )}
                      <div className="flex items-center mt-2 bg-[var(--bg-base)] rounded-md border border-[var(--border-default)] w-max">
                        <button onClick={() => updateQuantity(item.cartItemId, -1)} className="p-1 hover:text-[var(--accent-primary)]"><Minus className="w-4 h-4" /></button>
                        <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartItemId, 1)} className="p-1 hover:text-[var(--accent-primary)]"><Plus className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Checkout Step config */}
              {items.length > 0 && (
                <div className="mt-8 bg-[var(--bg-base)] p-4 rounded-xl border border-[var(--border-default)]">
                  <h3 className="font-semibold text-sm mb-3">Payment Method</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['cash', 'upi', 'card', 'sepolia'].map((mode) => (
                      <label
                        key={mode}
                        className={`flex items-center justify-center p-3 rounded-md border cursor-pointer text-sm font-medium transition-colors ${paymentMode === mode ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-[var(--border-default)] text-[var(--text-muted)] hover:bg-[var(--bg-glass)]'}`}
                      >
                        <input
                          type="radio"
                          name="paymentMode"
                          className="hidden"
                          checked={paymentMode === mode}
                          onChange={() => setPaymentMode(mode as any)}
                        />
                        <span className="capitalize">{mode}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-[var(--border-default)] bg-[var(--bg-surface)] shrink-0 pb-safe">
                {error && (
                   <p className="text-[var(--state-error)] text-xs mb-3 text-center bg-[var(--state-error)]/10 p-2 rounded">{error}</p>
                )}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[var(--text-muted)] font-medium">Subtotal</span>
                  <span className="font-bold text-xl">${subtotal.toFixed(2)}</span>
                </div>
                <Button
                  className="w-full h-12 text-lg"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Confirm Order'}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
