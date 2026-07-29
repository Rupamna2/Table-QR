"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface HourlyData {
  time: string;
  revenue: number;
}

export function RevenueChartCard({ data }: { data: HourlyData[] }) {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardContent className="p-6">
        <h3 className="text-sm font-medium text-[var(--text-muted)] mb-6">Today's Revenue Flow</h3>
        <div className="h-[250px] w-full">
          {data.length === 0 ? (
            <div className="flex items-center justify-center h-full text-[var(--text-muted)] text-sm border border-dashed border-[var(--border-default)] rounded-xl">
              No revenue data recorded today.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-default)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                  formatter={(value: any) => {
                    const numValue = Number(value);
                    return isNaN(numValue) ? [`$0.00`, 'Revenue'] : [`$${numValue.toFixed(2)}`, 'Revenue'];
                  }}
                />
                <Line type="monotone" dataKey="revenue" stroke="var(--accent-primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--accent-primary)', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
