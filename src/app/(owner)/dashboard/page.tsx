import { DollarSign, ShoppingCart, Star, Utensils } from "lucide-react";
import { KpiCard } from "@/components/owner/dashboard/KpiCard";
import { RevenueChartCard } from "@/components/owner/dashboard/RevenueChartCard";
import { InsightPlaceholderCard } from "@/components/owner/dashboard/InsightPlaceholderCard";
import { OrderBoardPreview } from "@/components/owner/dashboard/OrderBoardPreview";
import { RecentCustomersPreview } from "@/components/owner/dashboard/RecentCustomersPreview";

export default function DashboardShellPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-1">Dashboard Overview</h2>
        <p className="text-sm text-[var(--text-muted)]">Welcome back to The Artisan Kitchen command center.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Revenue" value="$2,450.00" icon={DollarSign} trend="12% vs last week" trendUp={true} />
        <KpiCard title="Orders Today" value="48" icon={ShoppingCart} trend="5% vs last week" trendUp={true} />
        <KpiCard title="Average Rating" value="4.8/5" icon={Star} trend="0.2 vs last week" trendUp={true} />
        <KpiCard title="Top Dish" value="Truffle Risotto" icon={Utensils} />
      </div>

      {/* Charts & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChartCard />
        <InsightPlaceholderCard />
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <OrderBoardPreview />
        <RecentCustomersPreview />
      </div>
    </div>
  );
}
