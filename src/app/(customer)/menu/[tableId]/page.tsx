import { TableBanner } from "@/components/customer/menu/TableBanner";
import { HighlightTiles } from "@/components/customer/menu/HighlightTiles";
import { MenuContainer } from "@/components/customer/menu/MenuContainer";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

interface PageProps {
  params: Promise<{ tableId: string }>;
}

export default async function CustomerMenuShell({ params }: PageProps) {
  const resolvedParams = await params;
  const { tableId } = resolvedParams;

  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const [categoriesRes, menuItemsRes] = await Promise.all([
    fetch(`${baseUrl}/api/menu/categories`),
    fetch(`${baseUrl}/api/menu/items?include_unavailable=true`)
  ]);

  if (!categoriesRes.ok || !menuItemsRes.ok) {
    notFound();
  }

  const { data: categories } = await categoriesRes.json();
  const { data: menuItems } = await menuItemsRes.json();

  return (
    <main className="min-h-screen pb-24 bg-[var(--bg-base)]">
      <TableBanner tableNum="Scanned" />
      <HighlightTiles />
      <MenuContainer categories={categories} items={menuItems} />
    </main>
  );
}
