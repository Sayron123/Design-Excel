"use client";

import { motion } from "motion/react";
import { AddModelButton } from "@/components/AddToInquiry";
import { RetryImage } from "@/components/ui/retry-image";
import { useEffect, useRef, useState } from "react";
import { typeSlug, type ProductModel } from "@/lib/models";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Type filter over a category's models. A "#type-<slug>" address (a shared link, or back/forward)
 * selects that type and brings this section into view.
 */
export function ModelFilter({
  title,
  types,
  models,
  href,
}: {
  title: string;
  types: string[];
  models: ProductModel[];
  /** The category page, so an added model links back to it. */
  href: string;
}) {
  const [type, setType] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const shown = type ? models.filter((m) => m.type === type) : models;
  const options = types.filter((t) => models.some((m) => m.type === t));

  useEffect(() => {
    // On page load, jump straight here; a smooth scroll from the top would glide past the whole header.
    function fromHash(behavior: ScrollBehavior) {
      // "#models" is the header's "See all" link: the browser scrolls, we clear any filter.
      if (location.hash === "#models") return setType(null);
      if (!location.hash.startsWith("#type-")) return;
      const match = types.find((t) => `#type-${typeSlug(t)}` === location.hash);
      if (!match) return;
      setType(match);
      sectionRef.current?.scrollIntoView({ behavior, block: "start" });
    }
    const onHashChange = () => fromHash("smooth");
    fromHash("instant");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [types]);

  // On phones the chips scroll sideways; bring the chosen one to the middle of the row.
  useEffect(() => {
    const row = chipsRef.current;
    const chosen = row?.querySelector<HTMLElement>("[aria-pressed=true]");
    if (!row || !chosen || row.scrollWidth <= row.clientWidth) return;
    row.scrollTo({ left: chosen.offsetLeft - (row.clientWidth - chosen.offsetWidth) / 2, behavior: "smooth" });
  }, [type]);

  function choose(next: string | null) {
    setType(next);
    // Keep the address in step so the filtered view can be shared; no scroll jump.
    history.replaceState(null, "", next ? `#type-${typeSlug(next)}` : location.pathname);
  }

  const chip = (active: boolean) =>
    `inline-flex h-11 shrink-0 items-center gap-2 rounded-xl px-4 text-base font-semibold transition-colors duration-200 ${
      active ? "bg-accent text-ink" : "bg-surface text-ink hover:bg-accent/20"
    }`;

  return (
    <section id="models" ref={sectionRef} aria-labelledby="models-heading" className="scroll-mt-24">
      {/* Little top padding: the header above already ends with its own bottom padding. */}
      <div className="mx-auto max-w-6xl px-4 pb-12 pt-4 md:px-6 md:pb-20 md:pt-8">
        <h2 id="models-heading" className="text-3xl font-bold tracking-tight md:text-4xl">
          {title}
        </h2>
        <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-ink">
          Pick a type to see its models, and add the ones you want priced to your inquiry.
        </p>

        <div ref={chipsRef} role="group" aria-label="Filter by type" className="relative -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
          <button type="button" aria-pressed={type === null} onClick={() => choose(null)} className={chip(type === null)}>
            All
            <span className="text-[14px] font-medium opacity-70">{models.length}</span>
          </button>
          {options.map((t) => (
            <button key={t} type="button" aria-pressed={type === t} onClick={() => choose(t)} className={chip(type === t)}>
              {t}
              <span className="text-[14px] font-medium opacity-70">{models.filter((m) => m.type === t).length}</span>
            </button>
          ))}
        </div>

        {/* The chips already show the counts; this line is for screen readers. */}
        <p aria-live="polite" className="sr-only">
          {shown.length} {shown.length === 1 ? "model" : "models"}
          {type ? ` of ${type.toLowerCase()}` : ""}
        </p>

        {/* Keyed by the filter, so a new pick swaps the grid and fades it in, rather than sliding cards around it. */}
        <ul key={type ?? "all"} className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {shown.map((m, i) => (
            <motion.li
              key={m.code}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease, delay: Math.min(i, 8) * 0.03 } }}
            >
              <figure>
                <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-white">
                  <RetryImage
                    src={m.src}
                    alt={m.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    className={m.fit === "contain" ? "object-contain p-1 md:p-3" : "object-cover"}
                  />
                </div>
                <figcaption className="mt-2.5">
                  <span className="block text-base font-bold tracking-tight text-ink">{m.code}</span>
                  <span className="block text-[14px] text-muted">{m.type}</span>
                  <AddModelButton code={m.code} type={m.type} href={href} />
                </figcaption>
              </figure>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
