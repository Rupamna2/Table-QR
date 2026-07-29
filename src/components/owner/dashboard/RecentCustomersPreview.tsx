import { Card, CardContent } from "@/components/ui/card";
import { UserCircle } from "lucide-react";

export function RecentCustomersPreview() {
  const dummyCustomers = [
    { session: "S-A1B2", table: "T-04", amount: "$45.00" },
    { session: "S-X9Y8", table: "T-12", amount: "$12.50" },
    { session: "S-P4Q3", table: "T-01", amount: "$89.99" },
  ];

  return (
    <Card className="col-span-1 row-span-2 flex flex-col">
      <div className="p-5 border-b border-[var(--border-default)] shrink-0">
        <h3 className="text-base font-bold">Recent Customers</h3>
      </div>
      <CardContent className="p-0 flex-1 overflow-y-auto">
        {dummyCustomers.map((cust, i) => (
          <div key={i} className="p-4 border-b border-[var(--border-default)] last:border-0 flex items-center gap-3 hover:bg-[var(--bg-glass)] transition-colors">
            <div className="w-10 h-10 rounded-full bg-[var(--bg-glass)] flex items-center justify-center border border-[var(--border-default)]">
               <UserCircle className="w-5 h-5 text-[var(--text-muted)]" />
            </div>
            <div className="flex-1">
               <p className="text-sm font-semibold">{cust.session}</p>
               <p className="text-xs text-[var(--text-muted)]">{cust.table}</p>
            </div>
            <span className="text-sm font-bold text-[var(--state-success)]">{cust.amount}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
