import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryDetail } from "@/components/CategoryDetail";
import { PRODUCT_CATEGORIES, getCategory } from "@/lib/products";

// Cabinets is served by its own folder (products/cabinets), so it is left out here.
export function generateStaticParams() {
  return PRODUCT_CATEGORIES.filter((c) => c.slug !== "cabinets").map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[category]">): Promise<Metadata> {
  const { category } = await params;
  const found = getCategory(category);
  return { title: found ? `${found.name} | Design Excellence` : "Products | Design Excellence" };
}

export default async function CategoryPage({ params }: PageProps<"/products/[category]">) {
  const { category } = await params;
  const found = getCategory(category);
  if (!found) notFound();
  return <CategoryDetail category={found} />;
}
