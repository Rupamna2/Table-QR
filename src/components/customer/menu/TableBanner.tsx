import { MapPin } from "lucide-react";

export function TableBanner({ tableNum }: { tableNum: string }) {
  return (
    <div className="w-full bg-[var(--bg-surface)] border-b border-[var(--border-default)] p-4 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h1 className="text-xl font-sans font-bold text-[var(--text-primary)]">The Artisan Kitchen</h1>
        <div className="flex items-center text-sm text-[var(--text-muted)] mt-1">
          <MapPin className="w-4 h-4 mr-1" />
          <span>Table {tableNum}</span>
        </div>
      </div>
      <div className="w-10 h-10 rounded-full bg-[var(--bg-glass)] flex items-center justify-center border border-[var(--border-default)]">
        <span className="font-bold text-[var(--accent-primary)]">AK</span>
      </div>
    </div>
  );
}
