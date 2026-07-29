import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

export function OrderBoardPreview() {
  const dummyOrders = [
    { id: "ORD-001", table: "T-04", items: 3, time: "2 min ago", status: "pending" },
    { id: "ORD-002", table: "T-12", items: 1, time: "8 min ago", status: "preparing" },
    { id: "ORD-003", table: "T-01", items: 5, time: "15 min ago", status: "ready" },
  ];

  return (
    <Card className="col-span-1 lg:col-span-2 row-span-2 flex flex-col">
      <div className="p-5 border-b border-[var(--border-default)] flex justify-between items-center shrink-0">
        <h3 className="text-base font-bold">Live Order Board</h3>
        <Badge variant="outline" className="text-xs font-normal">View All</Badge>
      </div>
      <CardContent className="p-0 flex-1 overflow-y-auto">
        {dummyOrders.map(order => (
          <div key={order.id} className="p-4 border-b border-[var(--border-default)] last:border-0 hover:bg-[var(--bg-glass)] transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg">{order.table}</span>
                <span className="text-sm text-[var(--text-muted)] font-mono">{order.id}</span>
              </div>
              <Badge
                variant={order.status === 'pending' ? 'gold' : order.status === 'ready' ? 'success' : 'outline'}
                className="capitalize"
              >
                {order.status}
              </Badge>
            </div>
            <div className="flex justify-between items-center text-sm text-[var(--text-muted)]">
              <span>{order.items} Items</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {order.time}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
