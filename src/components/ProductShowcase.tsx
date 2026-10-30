"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { ArrowRight, buttonClass } from "@/components/ui/button";
import { PRODUCT_CATEGORIES, PRODUCT_GROUPS, categoriesInGroup, categoryHref } from "@/lib/products";

/**
 * "What we make": every product line in one place. Pointing at (or tapping) a line shows its
 * photo, what it covers and a way into that range.
 */
export function ProductShowcase() {
  const [activeSlug, setActiveSlug] = useState(PRODUCT_CATEGORIES[0].slug);
  const active = PRODUCT_CATEGORIES.find((c) => c.slug === activeSlug) ?? PRODUCT_CATEGORIES[0];
  const cover = active.images[0];

  return (
    <section id="products" aria-labelledby="showcase-heading" className="scroll-mt-20 bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
        <Reveal>
          <h2 id="showcase-heading" className="text-3xl font-bold tracking-tight md:text-4xl">
            What we make
          </h2>
          <p className="mt-4 max-w-[48ch] text-lg leading-relaxed text-ink">
            Eight product lines for offices and homes. Pick one to see it.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-8 md:mt-12 lg:grid-cols-12 lg:gap-12">
          {/* The list of lines */}
          <Reveal className="lg:col-span-5" delay={0.06}>
            <div className="space-y-6">
              {PRODUCT_GROUPS.map((group) => (
                <div key={group.id}>
                  <p className="pb-2 text-[14px] font-semibold text-muted">{group.name}</p>
                  <ul role="list" className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                    {categoriesInGroup(group.id).map((cat) => {
                      const selected = cat.slug === activeSlug;
                      return (
                        <li key={cat.slug}>
                          <button
                            type="button"
                            aria-pressed={selected}
                            onClick={() => setActiveSlug(cat.slug)}
                            onPointerEnter={(e) => e.pointerType === "mouse" && setActiveSlug(cat.slug)}
                            onFocus={() => setActiveSlug(cat.slug)}
                            className={`flex h-10 items-center justify-between gap-3 rounded-xl px-3.5 text-base font-semibold transition-colors duration-200 lg:h-14 lg:w-full lg:text-lg ${
                              selected ? "bg-primary text-white" : "bg-bg text-ink hover:bg-border lg:bg-transparent"
                            }`}
                          >
                            {cat.name}
                            <ArrowRight
                              className={`hidden transition-transform duration-200 lg:block ${
                                selected ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"
                              }`}
                            />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>

          {/* The selected line */}
          <Reveal className="lg:col-span-7" delay={0.12}>
            <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-bg" aria-live="polite">
              <AnimatePresence initial={false}>
                <motion.div
                  key={active.slug}
                  className="absolute inset-0 bg-bg"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={cover.src}
                    alt={cover.alt}
                    fill
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    // multiply drops the white backdrop of product cut-outs onto the panel colour
                    className={cover.fit === "contain" ? "object-contain p-8 mix-blend-multiply md:p-12" : "object-cover"}
                  />
                </motion.div>
              </AnimatePresence>
              <span className="absolute bottom-3 right-3 rounded-lg bg-ink/80 px-2.5 py-1 text-[14px] font-semibold text-white">
                {active.images.length} photos
              </span>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.slug}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
              >
                <div className="min-w-0">
                  <h3 className="text-2xl font-bold tracking-tight">{active.name}</h3>
                  <p className="mt-2 max-w-[44ch] text-base leading-relaxed text-ink">{active.summary}</p>
                  {active.types && (
                    <p className="mt-2 text-[14px] text-muted">
                      {active.types.length} types, including {active.types.slice(0, 3).join(", ").toLowerCase()}
                    </p>
                  )}
                </div>
                <Link href={categoryHref(active.slug)} className={buttonClass("primary", "md")}>
                  See the range
                  <ArrowRight />
                </Link>
              </motion.div>
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
