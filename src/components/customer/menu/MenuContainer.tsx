"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DishCard } from "./DishCard";

interface Category {
  id: string;
  name: string;
}

interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  photoUrl: string | null;
  price: string;
  isAvailable: boolean;
  allergens: string[];
}

interface MenuContainerProps {
  categories: Category[];
  items: MenuItem[];
}

export function MenuContainer({ categories, items }: MenuContainerProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredItems = activeCategory === "all"
    ? items
    : items.filter(item => item.categoryId === activeCategory);

  return (
    <>
      {/* Category Filter */}
      <div className="w-full overflow-x-auto px-4 pb-2 sticky top-[73px] bg-[var(--bg-base)]/90 backdrop-blur z-10 pt-2 border-b border-[var(--border-default)]">
        <div className="flex gap-2 w-max pb-2">
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            className={activeCategory === "all" ? "" : "border-none bg-[var(--bg-surface)]"}
            onClick={() => setActiveCategory("all")}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              className={activeCategory === cat.id ? "" : "border-none bg-[var(--bg-surface)]"}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Dish Grid */}
      <div className="px-4 py-6">
        <h2 className="text-xl font-bold mb-4">
          {activeCategory === "all" ? "All Items" : categories.find(c => c.id === activeCategory)?.name}
        </h2>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-[var(--text-muted)] border border-dashed border-[var(--border-default)] rounded-2xl">
            <p>No available items in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map(dish => (
              <DishCard
                key={dish.id}
                name={dish.name}
                price={dish.price}
                description={dish.description}
                tags={dish.allergens}
                imageUrl={dish.photoUrl}
                isAvailable={dish.isAvailable}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
