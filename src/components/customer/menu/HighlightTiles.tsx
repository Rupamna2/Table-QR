import { Card, CardContent } from "@/components/ui/card";
import { Star, Flame, Sparkles } from "lucide-react";

export function HighlightTiles() {
  return (
    <div className="w-full overflow-x-auto pb-4 pt-4 px-4 snap-x">
      <div className="flex gap-4 w-max">
        <Card className="w-64 shrink-0 snap-center bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-base)]">
          <CardContent className="p-4 flex flex-col items-start justify-center h-full">
            <Flame className="w-6 h-6 text-[var(--accent-primary)] mb-2" />
            <h3 className="font-bold text-lg">Today's Special</h3>
            <p className="text-sm text-[var(--text-muted)]">Truffle Risotto - 15% Off</p>
          </CardContent>
        </Card>

        <Card className="w-64 shrink-0 snap-center bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-base)]">
          <CardContent className="p-4 flex flex-col items-start justify-center h-full">
            <Star className="w-6 h-6 text-[var(--accent-gold)] mb-2" />
            <h3 className="font-bold text-lg">Must Try</h3>
            <p className="text-sm text-[var(--text-muted)]">Burrata Bruschetta</p>
          </CardContent>
        </Card>

        <Card className="w-64 shrink-0 snap-center bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-base)]">
          <CardContent className="p-4 flex flex-col items-start justify-center h-full">
            <Sparkles className="w-6 h-6 text-[var(--state-success)] mb-2" />
            <h3 className="font-bold text-lg">Active Offer</h3>
            <p className="text-sm text-[var(--text-muted)]">Free dessert on orders over $50</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
