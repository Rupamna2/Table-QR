import { ShoppingBag, ChevronRight } from "lucide-react";

export function FloatingCartBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <button className="w-full bg-[var(--accent-primary)] text-white rounded-2xl shadow-lg shadow-[var(--accent-primary)]/20 p-4 flex items-center justify-between hover:opacity-95 transition-opacity">
          <div className="flex items-center">
            <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center mr-3 relative">
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 bg-white text-[var(--accent-primary)] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                2
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs text-white/80 font-medium uppercase tracking-wider">View Cart</span>
              <span className="font-bold">$37.49</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/80" />
        </button>
      </div>
    </div>
  );
}
