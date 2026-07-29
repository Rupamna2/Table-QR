import { TableBanner } from "@/components/customer/menu/TableBanner";

export default function Loading() {
  return (
    <main className="min-h-screen pb-24 bg-[var(--bg-base)]">
      <TableBanner tableNum="..." />

      {/* Skeleton Highlight Tiles */}
      <div className="w-full overflow-x-hidden pb-4 pt-4 px-4 flex gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="w-64 h-32 shrink-0 rounded-2xl bg-[var(--bg-glass)] animate-pulse" />
        ))}
      </div>

      {/* Skeleton Category Filter */}
      <div className="w-full overflow-x-hidden px-4 pb-4 border-b border-[var(--border-default)] flex gap-2">
         {[1, 2, 3, 4].map(i => (
          <div key={i} className="w-20 h-9 rounded-md bg-[var(--bg-glass)] animate-pulse" />
        ))}
      </div>

      {/* Skeleton Grid */}
      <div className="px-4 py-6">
        <div className="w-32 h-6 bg-[var(--bg-glass)] rounded-md animate-pulse mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="w-full h-64 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] flex flex-col">
              <div className="w-full h-32 bg-[var(--bg-glass)] animate-pulse" />
              <div className="p-4 flex flex-col flex-1 gap-2">
                <div className="w-3/4 h-5 bg-[var(--bg-glass)] rounded animate-pulse" />
                <div className="w-1/4 h-4 bg-[var(--bg-glass)] rounded animate-pulse" />
                <div className="w-full h-8 bg-[var(--bg-glass)] rounded mt-auto animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
