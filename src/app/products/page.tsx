import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCT_GROUPS, categoriesInGroup, categoryHref } from "@/lib/products";

export const metadata: Metadata = { title: "Products | Design Excellence" };

export default function ProductsPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
      <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Products</h1>
      <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-ink">
        Office furniture, cabinets and closets, made and installed to your layout.
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-12">
        {PRODUCT_GROUPS.map((group) => (
          <div key={group.id} id={group.id}>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{group.name}</h2>
            <ul className="mt-5 grid gap-3">
              {categoriesInGroup(group.id).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={categoryHref(cat.slug)}
                    className="group block rounded-xl bg-surface p-5 transition-colors hover:bg-primary md:p-6"
                  >
                    <span className="block text-xl font-bold tracking-tight text-ink group-hover:text-white">
                      {cat.name}
                    </span>
                    <span className="mt-1 block text-base text-ink group-hover:text-white/90">{cat.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
