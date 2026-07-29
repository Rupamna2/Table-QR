import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DishCardProps {
  name: string;
  price: string;
  description: string | null;
  tags?: string[];
  imageUrl?: string | null;
  isAvailable: boolean;
}

export function DishCard({ name, price, description, tags, imageUrl, isAvailable }: DishCardProps) {
  return (
    <Card className={`overflow-hidden flex flex-col h-full transition-colors ${isAvailable ? 'hover:border-[var(--accent-primary)]/50' : 'opacity-70'}`}>
      <div className="w-full h-32 bg-[var(--bg-glass)] relative">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] text-sm">
            No Image
          </div>
        )}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
            <Badge variant="outline" className="bg-[var(--bg-base)] text-white border-white/20">Sold Out</Badge>
          </div>
        )}
      </div>
      <CardContent className="flex flex-col flex-1 p-4">
        <div className="flex justify-between items-start mb-1 gap-2">
          <h3 className="font-bold text-base leading-tight">{name}</h3>
          <span className="font-semibold text-[var(--accent-primary)] whitespace-nowrap">${price}</span>
        </div>
        {description && (
          <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-3 flex-1">{description}</p>
        )}

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-[10px] py-0">{tag}</Badge>
            ))}
          </div>
        )}

        <Button className="w-full mt-auto" variant="outline" disabled={!isAvailable}>
          <Plus className="w-4 h-4 mr-2" /> Add
        </Button>
      </CardContent>
    </Card>
  );
}
