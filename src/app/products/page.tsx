import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HoverCard } from "@/components/HoverCard";
import { Reveal } from "@/components/Reveal";
import { PRODUCT_GROUPS, categoriesInGroup, categoryHref } from "@/lib/products";

export const metadata: Metadata = { title: "Products | Design Excellence" };

export default function ProductsPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
      <Reveal>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Products</h1>
        <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-ink">
          Office furniture, cabinets and closets, made and installed to your layout.
        </p>
      </Reveal>

      {PRODUCT_GROUPS.map((group) => (
        <div key={group.id} id={group.id} className="mt-14 scroll-mt-28 md:mt-20">
          <Reveal>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{group.name}</h2>
          </Reveal>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categoriesInGroup(group.id).map((cat, i) => {
              const cover = cat.images[0];
              return (
                <li key={cat.slug}>
                  <Reveal delay={i * 0.06} className="h-full">
                    <HoverCard className="h-full rounded-xl bg-surface">
                      <Link href={categoryHref(cat.slug)} className="group flex h-full flex-col rounded-xl">
                        <span className="relative block aspect-4/3 overflow-hidden rounded-t-xl bg-surface">
                          <Image
                            src={cover.src}
                            alt={cover.alt}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className={`transition-transform duration-500 group-hover:scale-[1.04] ${
                              cover.fit === "contain" ? "object-contain p-3" : "object-cover"
                            }`}
                          />
                        </span>
                        <span className="flex flex-1 flex-col p-5 md:p-6">
                          <span className="text-xl font-bold tracking-tight text-ink">{cat.name}</span>
                          <span className="mt-1.5 text-base leading-relaxed text-ink">{cat.summary}</span>
                          <span className="mt-4 text-base font-semibold text-primary underline decoration-2 underline-offset-[0.25em] group-hover:decoration-accent">
                            See the range
                          </span>
                        </span>
                      </Link>
                    </HoverCard>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
}
