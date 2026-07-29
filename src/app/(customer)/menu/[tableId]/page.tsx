import { TableBanner } from "@/components/customer/menu/TableBanner";
import { HighlightTiles } from "@/components/customer/menu/HighlightTiles";
import { CategoryFilter } from "@/components/customer/menu/CategoryFilter";
import { DishGrid } from "@/components/customer/menu/DishGrid";
import { FloatingCartBar } from "@/components/customer/menu/FloatingCartBar";

export default function CustomerMenuShell() {
  return (
    <main className="min-h-screen pb-24 bg-[var(--bg-base)]">
      <TableBanner />
      <HighlightTiles />
      <CategoryFilter />
      <DishGrid />
      <FloatingCartBar />
    </main>
  );
}
