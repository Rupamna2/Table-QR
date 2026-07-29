import { CartProvider } from "@/components/customer/cart/CartProvider";
import { CartSheet } from "@/components/customer/cart/CartSheet";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartSheet />
    </CartProvider>
  );
}
