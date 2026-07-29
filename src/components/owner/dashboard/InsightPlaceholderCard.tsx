import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export function InsightPlaceholderCard() {
  return (
    <Card className="col-span-1 border-dashed border-[var(--accent-gold)]/40 bg-gradient-to-br from-[var(--accent-gold)]/5 to-transparent">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4 text-[var(--accent-gold)]">
          <Lightbulb className="w-5 h-5" />
          <h3 className="text-sm font-semibold uppercase tracking-wider">AI Insights (Phase 2)</h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-center px-4">
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            Advanced analytics, demand forecasting, and weather-based menu adjustments will be injected here during Phase 2.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
