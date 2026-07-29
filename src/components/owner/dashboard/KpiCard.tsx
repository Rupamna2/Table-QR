import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export function KpiCard({ title, value, icon: Icon, trend, trendUp }: KpiCardProps) {
  return (
    <Card>
      <CardContent className="p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--text-muted)]">{title}</span>
          <div className="p-2 bg-[var(--bg-glass)] rounded-md">
            <Icon className="w-4 h-4 text-[var(--accent-primary)]" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">{value}</h3>
          {trend && (
            <p className={cn("text-xs mt-1 font-medium", trendUp ? "text-[var(--state-success)]" : "text-[var(--state-error)]")}>
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
