import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DishCardProps {
  name: string;
  price: string;
  description: string;
  tags?: string[];
  imageUrl?: string;
}

export function DishCard({ name, price, description, tags, imageUrl }: DishCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full hover:border-[var(--accent-primary)]/50 transition-colors">
      <div className="w-full h-32 bg-[var(--bg-glass)] relative">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] text-sm">
            No Image
          </div>
        )}
      </div>
      <CardContent className="flex flex-col flex-1 p-4">
        <div className="flex justify-between items-start mb-1 gap-2">
          <h3 className="font-bold text-base leading-tight">{name}</h3>
          <span className="font-semibold text-[var(--accent-primary)] whitespace-nowrap">{price}</span>
        </div>
        <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-3 flex-1">{description}</p>

        <div className="flex flex-wrap gap-1 mb-4">
          {tags?.map(tag => (
            <Badge key={tag} variant="outline" className="text-[10px] py-0">{tag}</Badge>
          ))}
        </div>

        <Button className="w-full mt-auto" variant="outline">
          <Plus className="w-4 h-4 mr-2" /> Add
        </Button>
      </CardContent>
    </Card>
  );
}
