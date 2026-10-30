import Link from "next/link";
import { PlaceholderPage } from "@/components/PlaceholderPage";
import type { ProductCategory } from "@/lib/products";

// Placeholder body for one product category: its types (from the client's site) and a quote link.
export function CategoryDetail({ category, note }: { category: ProductCategory; note?: string }) {
  return (
    <PlaceholderPage
      title={category.name}
      intro={category.summary}
      breadcrumb={{ href: "/products", label: "Products" }}
      back={{ href: "/products", label: "All products" }}
    >
      {note && <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-ink">{note}</p>}
      {category.types && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold tracking-tight">Types</h2>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {category.types.map((type) => (
              <li key={type} className="rounded-xl bg-surface px-4 py-2.5 text-base font-medium text-ink">
                {type}
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="mt-10 text-base">
        <Link href="/quote" className="font-semibold text-primary underline underline-offset-4 hover:text-ink">
          Ask for a quote
        </Link>
      </p>
    </PlaceholderPage>
  );
}
