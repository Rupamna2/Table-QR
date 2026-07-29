import { DishCard } from "./DishCard";

const DUMMY_DISHES = [
  { id: 1, name: "Truffle Risotto", price: "$24.99", description: "Creamy arborio rice with wild mushrooms and truffle oil.", tags: ["Vegetarian", "Gluten-Free"] },
  { id: 2, name: "Burrata Bruschetta", price: "$12.50", description: "Fresh burrata, heirloom tomatoes, basil, and balsamic reduction.", tags: ["Vegetarian"] },
  { id: 3, name: "Wagyu Beef Burger", price: "$28.00", description: "8oz wagyu patty, caramelized onions, gruyere, brioche bun.", tags: ["Signature"] },
  { id: 4, name: "Margherita Pizza", price: "$16.00", description: "San marzano tomato sauce, fresh mozzarella, and basil.", tags: ["Vegetarian"] },
  { id: 5, name: "Tiramisu", price: "$9.00", description: "Classic Italian dessert with espresso and mascarpone.", tags: [] },
  { id: 6, name: "Craft Lemonade", price: "$4.50", description: "House-made sparkling lemonade with mint.", tags: ["Drink"] },
];

export function DishGrid() {
  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-bold mb-4">All Items</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {DUMMY_DISHES.map(dish => (
          <DishCard
            key={dish.id}
            name={dish.name}
            price={dish.price}
            description={dish.description}
            tags={dish.tags}
          />
        ))}
      </div>
    </div>
  );
}
