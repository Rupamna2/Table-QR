import { Bell, Menu as MenuIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TopBar() {
  return (
    <header className="h-16 bg-[var(--bg-surface)] border-b border-[var(--border-default)] flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)]">
          <MenuIcon className="w-6 h-6" />
        </button>
        <h2 className="font-bold text-lg hidden sm:block">The Artisan Kitchen</h2>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" className="relative p-2 h-auto w-auto rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)]">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-[var(--state-error)] rounded-full animate-pulse" />
        </Button>
        <div className="flex items-center gap-3 border-l border-[var(--border-default)] pl-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-semibold leading-none">Admin User</span>
            <span className="text-xs text-[var(--accent-gold)] font-medium uppercase tracking-wider">Owner</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-[var(--bg-glass)] flex items-center justify-center border border-[var(--border-default)]">
            <User className="w-5 h-5 text-[var(--text-muted)]" />
          </div>
        </div>
      </div>
    </header>
  );
}
