import { DollarSign, ShoppingCart, Star, Utensils } from "lucide-react";
import { KpiCard } from "@/components/owner/dashboard/KpiCard";
import { RevenueChartCard } from "@/components/owner/dashboard/RevenueChartCard";
import { InsightPlaceholderCard } from "@/components/owner/dashboard/InsightPlaceholderCard";
import { OrderBoardPreview } from "@/components/owner/dashboard/OrderBoardPreview";
import { RecentCustomersPreview } from "@/components/owner/dashboard/RecentCustomersPreview";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardShellPage() {
  // Fetch real KPI stats and Chart Data securely.
  // We use the absolute URL to hit our API because our API route contains the 'requireRole' check
  // ensuring the current user's cookie is fully validated server-side.
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  // Forward the cookies from the incoming request so the API routes can authenticate
  const cookieHeader = headersList.get("cookie") || "";

  const [statsRes, hourlyRes] = await Promise.all([
    fetch(`${baseUrl}/api/dashboard/stats`, {
      headers: { cookie: cookieHeader }
    }),
    fetch(`${baseUrl}/api/dashboard/hourly`, {
      headers: { cookie: cookieHeader }
    })
  ]);

  // If the API says unauthorized, boot them to login.
  if (statsRes.status === 401 || statsRes.status === 403) {
    redirect('/login');
  }

  const { data: stats } = await statsRes.json();
  const { data: hourlyData } = await hourlyRes.json();

  const fallbackStats = {
    revenue: 0,
    orderCount: 0,
    averageRating: 0,
    topDish: "None"
  };

  const finalStats = stats || fallbackStats;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-1">Dashboard Overview</h2>
        <p className="text-sm text-[var(--text-muted)]">Welcome back to The Artisan Kitchen command center.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Revenue"
          value={`$${finalStats.revenue.toFixed(2)}`}
          icon={DollarSign}
        />
        <KpiCard
          title="Orders Today"
          value={finalStats.orderCount.toString()}
          icon={ShoppingCart}
        />
        <KpiCard
          title="Average Rating"
          value={finalStats.averageRating > 0 ? `${finalStats.averageRating.toFixed(1)}/5` : "N/A"}
          icon={Star}
        />
        <KpiCard
          title="Top Dish"
          value={finalStats.topDish}
          icon={Utensils}
        />
      </div>

      {/* Charts & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChartCard data={hourlyData || []} />
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
