import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryDetail } from "@/components/CategoryDetail";
import { getCategory } from "@/lib/products";

export const metadata: Metadata = { title: "Metal Cabinets | Design Excellence" };

// Cabinets has its own folder because the cabinet builder will live here.
export default function CabinetsPage() {
  const category = getCategory("cabinets");
  if (!category) notFound();
  return (
    <CategoryDetail
      category={category}
      note="The cabinet builder will live on this page: set the width, height, doors, drawers and finish, then add the cabinet to your quote."
    />
  );
}
