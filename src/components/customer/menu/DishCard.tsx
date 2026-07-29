import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCart } from "../cart/CartProvider";

interface Variant {
  id: string;
  name: string;
  extraPrice: string;
  isAvailable: boolean;
}

interface DishCardProps {
  id: string;
  name: string;
  price: string;
  description: string | null;
  tags?: string[];
  imageUrl?: string | null;
  isAvailable: boolean;
  variants?: Variant[];
}

export function DishCard({ id, name, price, description, tags, imageUrl, isAvailable, variants }: DishCardProps) {
  const { addItem } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState("");

  const handleAdd = () => {
    if (!isAvailable) return;

    if (variants && variants.length > 0) {
      setIsModalOpen(true);
    } else {
      addItem({
        menuItemId: id,
        name,
        basePrice: parseFloat(price),
        quantity: 1
      });
    }
  };

  const submitModal = () => {
    let variantName;
    let variantPrice = 0;

    if (selectedVariantId) {
      const v = variants?.find(v => v.id === selectedVariantId);
      if (v) {
        variantName = v.name;
        variantPrice = parseFloat(v.extraPrice);
      }
    }

    addItem({
      menuItemId: id,
      name,
      basePrice: parseFloat(price),
      variantId: selectedVariantId,
      variantName,
      variantPrice,
      quantity: 1,
      notes: notes.trim() !== "" ? notes.trim() : undefined
    });

    setIsModalOpen(false);
    setSelectedVariantId(undefined);
    setNotes("");
  };

  return (
    <>
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

          <Button className="w-full mt-auto" variant="outline" disabled={!isAvailable} onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>
        </CardContent>
      </Card>

      {/* Basic Customization Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl w-full max-w-sm p-6 flex flex-col">
            <h2 className="text-lg font-bold mb-2">Customize {name}</h2>

            {variants && variants.length > 0 && (
              <div className="mb-4">
                <label className="text-sm text-[var(--text-muted)] block mb-2">Options</label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-[var(--bg-glass)]">
                    <input type="radio" name="variant" checked={!selectedVariantId} onChange={() => setSelectedVariantId(undefined)} />
                    <span className="text-sm flex-1">Standard</span>
                  </label>
                  {variants.filter(v => v.isAvailable).map(v => (
                    <label key={v.id} className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-[var(--bg-glass)]">
                      <input
                        type="radio"
                        name="variant"
                        checked={selectedVariantId === v.id}
                        onChange={() => setSelectedVariantId(v.id)}
                      />
                      <span className="text-sm flex-1">{v.name}</span>
                      <span className="text-sm text-[var(--text-muted)]">+${v.extraPrice}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
               <label className="text-sm text-[var(--text-muted)] block mb-2">Special Notes</label>
               <textarea
                 className="w-full bg-[var(--bg-base)] border border-[var(--border-default)] rounded-md p-2 text-sm focus:outline-none focus:border-[var(--accent-primary)] resize-none"
                 rows={3}
                 placeholder="e.g., No onions, extra spicy..."
                 value={notes}
                 onChange={(e) => setNotes(e.target.value)}
               />
            </div>

            <div className="flex gap-3 mt-auto">
              <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={submitModal}>Add to Cart</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
