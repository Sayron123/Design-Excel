import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryDetail } from "@/components/CategoryDetail";
import { getCategory } from "@/lib/products";

export const metadata: Metadata = { title: "Metal Cabinets | Design Excellence" };

// Metal cabinets keep their own folder (the old /cabinets address redirects here).
export default function CabinetsPage() {
  const category = getCategory("cabinets");
  if (!category) notFound();
  return <CategoryDetail category={category} />;
}
