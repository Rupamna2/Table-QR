import { Button } from "@/components/ui/button";

const categories = ["All", "Starters", "Mains", "Pizzas", "Desserts", "Drinks"];

export function CategoryFilter() {
  return (
    <div className="w-full overflow-x-auto px-4 pb-2 sticky top-[73px] bg-[var(--bg-base)]/90 backdrop-blur z-10 pt-2 border-b border-[var(--border-default)]">
      <div className="flex gap-2 w-max pb-2">
        {categories.map((cat, idx) => (
          <Button
            key={cat}
            variant={idx === 0 ? "default" : "outline"}
            className={idx === 0 ? "" : "border-none bg-[var(--bg-surface)]"}
          >
            {cat}
          </Button>
        ))}
      </div>
    </div>
  );
}
