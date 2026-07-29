import { TableBanner } from "@/components/customer/menu/TableBanner";
import { HighlightTiles } from "@/components/customer/menu/HighlightTiles";
import { MenuContainer } from "@/components/customer/menu/MenuContainer";
import { FloatingCartBar } from "@/components/customer/menu/FloatingCartBar";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

// Define strict prop types for Next.js 15
interface PageProps {
  params: Promise<{ tableId: string }>;
}

export default async function CustomerMenuShell({ params }: PageProps) {
  // Await params per Next.js 15 requirement
  const resolvedParams = await params;
  const { tableId } = resolvedParams;

  // Determine the base URL for absolute fetching
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  // Fetch data concurrently through the API Layer as mandated by Architecture Invariant 2
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
      {/* Assuming a fixed table number for now since we bypass direct Prisma querying */}
      <TableBanner tableNum="Scanned" />
      <HighlightTiles />
      <MenuContainer categories={categories} items={menuItems} />
      <FloatingCartBar />
    </main>
  );
}
