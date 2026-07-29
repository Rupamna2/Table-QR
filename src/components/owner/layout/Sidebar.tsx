"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/orders", label: "Live Orders", icon: ShoppingBag },
    { href: "/dashboard/menu", label: "Menu Manager", icon: UtensilsCrossed },
    { href: "/dashboard/tables", label: "QR Codes", icon: QrCode },
  ];

  return (
    <aside className="w-64 h-full bg-[var(--bg-surface)] border-r border-[var(--border-default)] hidden md:flex flex-col">
      <div className="p-6 h-16 flex items-center border-b border-[var(--border-default)]">
        <h1 className="text-xl font-bold text-[var(--accent-primary)] tracking-tight">TableQR Pro</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {links.map(link => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/dashboard");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium",
                isActive
                  ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-glass)] hover:text-[var(--text-primary)]"
              )}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[var(--border-default)] text-xs text-[var(--text-muted)]">
        &copy; 2026 TableQR Pro
      </div>
    </aside>
  );
}
