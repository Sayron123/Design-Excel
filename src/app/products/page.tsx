import type { Metadata } from "next";
import { RetryImage } from "@/components/ui/retry-image";
import Link from "next/link";
import { HoverCard } from "@/components/HoverCard";
import { Reveal } from "@/components/Reveal";
import { PRODUCT_GROUPS, categoriesInGroup, categoryHref } from "@/lib/products";
import { ArrowRight, buttonClass } from "@/components/ui/button";
import { INQUIRE_HREF, INQUIRE_LABEL } from "@/lib/site";

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
                          <RetryImage
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
                          {/* The whole card is the link, so this is a quiet cue rather than a second button. */}
                          <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-base font-semibold text-primary">
                            See the range
                            <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                          </span>
                        </span>
                      </Link>
                    </HoverCard>
                  </Reveal>
                </li>
              );
            })}
            {/* A group that doesn't fill its last row of three gets the inquiry card in the gap. */}
            {categoriesInGroup(group.id).length % 3 !== 0 && (
              <li>
                <Reveal delay={categoriesInGroup(group.id).length * 0.06} className="h-full">
                  <div className="flex h-full flex-col justify-center rounded-xl border-2 border-dashed border-border p-6 md:p-8">
                    <span className="text-xl font-bold tracking-tight text-ink">Need something else?</span>
                    <span className="mt-1.5 max-w-[32ch] text-base leading-relaxed text-ink">
                      Send us your floor plan or measurements and we will suggest the right pieces.
                    </span>
                    <Link href={INQUIRE_HREF} className={buttonClass("accent", "md", "mt-6 self-start")}>
                      {INQUIRE_LABEL}
                    </Link>
                  </div>
                </Reveal>
              </li>
            )}
          </ul>
        </div>
      ))}
    </section>
  );
}
