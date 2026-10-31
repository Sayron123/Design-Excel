"use client";

import { AnimatePresence, motion } from "motion/react";
import { AddToInquiry } from "@/components/AddToInquiry";
import { ArrowLeft, buttonClass } from "@/components/ui/button";
import { RetryImage } from "@/components/ui/retry-image";
import { useEffect, useRef, useState } from "react";
import { typeSlug, type ProductModel } from "@/lib/models";

const ease = [0.22, 1, 0.36, 1] as const;

const modelHash = (code: string) => `#model-${typeSlug(code)}`;

/**
 * Type filter over a category's models. Picking a model swaps the grid for that model on its own,
 * with a Back button to the grid. The address follows along ("#type-<slug>", "#model-<code>"),
 * so a link can be shared and the browser's back button returns to the grid.
 */
export function ModelFilter({
  title,
  noun,
  types,
  models,
  href,
}: {
  title: string;
  /** What one model is called, e.g. "chair", for the Back button. */
  noun: string;
  types: string[];
  models: ProductModel[];
  /** The category page, so an added model links back to it. */
  href: string;
}) {
  const [type, setType] = useState<string | null>(null);
  const [picked, setPicked] = useState<ProductModel | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  // True when opening the model added a history entry, so Back can simply step back to the grid.
  const pushedRef = useRef(false);
  const shown = type ? models.filter((m) => m.type === type) : models;
  const options = types.filter((t) => models.some((m) => m.type === t));

  useEffect(() => {
    // On page load, jump straight here; a smooth scroll from the top would glide past the whole header.
    function fromHash(behavior: ScrollBehavior) {
      const hash = location.hash;
      // "#models" is the header's "See all" link: the browser scrolls, we clear any filter.
      if (hash === "#models") {
        setPicked(null);
        return setType(null);
      }
      const model = models.find((m) => modelHash(m.code) === hash);
      const match = types.find((t) => `#type-${typeSlug(t)}` === hash);
      setPicked(model ?? null);
      if (model) setType(model.type);
      else if (match) setType(match);
      else if (!hash) return;
      if (model) chipsRef.current?.scrollIntoView({ behavior, block: "start" });
      else if (match) sectionRef.current?.scrollIntoView({ behavior, block: "start" });
    }
    const onHistory = () => {
      pushedRef.current = false;
      fromHash("smooth");
    };
    fromHash("instant");
    window.addEventListener("popstate", onHistory);
    return () => window.removeEventListener("popstate", onHistory);
  }, [types, models]);

  // On phones the chips scroll sideways; bring the chosen one to the middle of the row.
  useEffect(() => {
    const row = chipsRef.current;
    const chosen = row?.querySelector<HTMLElement>("[aria-pressed=true]");
    if (!row || !chosen || row.scrollWidth <= row.clientWidth) return;
    row.scrollTo({ left: chosen.offsetLeft - (row.clientWidth - chosen.offsetWidth) / 2, behavior: "smooth" });
  }, [type, picked]);

  const typeAddress = (t: string | null) => (t ? `#type-${typeSlug(t)}` : location.pathname);

  function choose(next: string | null) {
    setType(next);
    setPicked(null);
    // Keep the address in step so the filtered view can be shared; no scroll jump.
    history.replaceState(null, "", typeAddress(next));
  }

  function open(m: ProductModel) {
    // From the grid, add a history entry; switching between models replaces it, so Back still means the grid.
    if (picked) history.replaceState(null, "", modelHash(m.code));
    else {
      history.pushState(null, "", modelHash(m.code));
      pushedRef.current = true;
    }
    setPicked(m);
    // Bring the chosen model up under the type chips, not just the section heading.
    chipsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function back() {
    if (pushedRef.current) {
      // The popstate handler restores the grid.
      history.back();
      return;
    }
    setPicked(null);
    history.replaceState(null, "", typeAddress(type));
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const chip = (active: boolean) =>
    `inline-flex h-11 shrink-0 items-center gap-2 rounded-xl px-4 text-base font-semibold transition-colors duration-200 ${
      active ? "bg-accent text-ink" : "bg-surface text-ink hover:bg-accent/20"
    }`;

  // Others of the same type, so the next one is a tap away without going back.
  const siblings = picked ? models.filter((m) => m.type === picked.type && m.code !== picked.code) : [];

  return (
    <section id="models" ref={sectionRef} aria-labelledby="models-heading" className="scroll-mt-24">
      {/* Little top padding: the header above already ends with its own bottom padding. */}
      <div className="mx-auto max-w-6xl px-4 pb-12 pt-4 md:px-6 md:pb-20 md:pt-8">
        <h2 id="models-heading" className="text-3xl font-bold tracking-tight md:text-4xl">
          {title}
        </h2>
        <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-ink">
          Pick a type, then a model to see it up close and add it to your inquiry.
        </p>

        <div ref={chipsRef} role="group" aria-label="Filter by type" className="relative -mx-4 mt-8 flex scroll-mt-24 gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
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
          {picked
            ? `Showing ${picked.code}, ${picked.type.toLowerCase()}`
            : `${shown.length} ${shown.length === 1 ? "model" : "models"}${type ? ` of ${type.toLowerCase()}` : ""}`}
        </p>

        <AnimatePresence mode="wait" initial={false}>
          {picked ? (
            <motion.div
              key={`model-${picked.code}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease }}
              className="mt-8"
            >
              <button type="button" onClick={back} className={buttonClass("soft", "sm")}>
                <ArrowLeft />
                Back to {type ? `${type.toLowerCase()}s` : `all ${noun}s`}
              </button>

              <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
                <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-white lg:col-span-7">
                  <RetryImage
                    src={picked.src}
                    alt={picked.alt}
                    fill
                    loading="eager"
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className={picked.fit === "contain" ? "object-contain p-6 md:p-10" : "object-cover"}
                  />
                </div>
                <div className="lg:col-span-5">
                  <h3 className="text-4xl font-extrabold tracking-tight md:text-5xl">{picked.code}</h3>
                  <p className="mt-2 text-lg font-semibold text-accent-ink">{picked.type}</p>
                  <p className="mt-4 max-w-[40ch] text-lg leading-relaxed text-ink">{picked.alt}.</p>
                  <p className="mt-3 max-w-[40ch] text-base leading-relaxed text-ink">
                    Add it to your inquiry and we will reply with sizes, finishes and a price.
                  </p>
                  <AddToInquiry name={picked.type} model={picked.code} href={href} className="mt-6" />
                </div>
              </div>

              {siblings.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-xl font-bold tracking-tight">More {picked.type.toLowerCase()}s</h3>
                  <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                    {siblings.map((m) => (
                      <li key={m.code}>
                        <button
                          type="button"
                          onClick={() => open(m)}
                          aria-label={`See ${m.code}`}
                          className="group block w-full text-left"
                        >
                          <span className="relative block aspect-square overflow-hidden rounded-lg bg-white">
                            <RetryImage
                              src={m.src}
                              alt=""
                              fill
                              sizes="(min-width: 1024px) 14vw, 30vw"
                              className={`transition-transform duration-300 group-hover:scale-[1.05] ${
                                m.fit === "contain" ? "object-contain p-1.5" : "object-cover"
                              }`}
                            />
                          </span>
                          <span className="mt-1.5 block truncate text-[14px] font-semibold text-ink group-hover:text-accent-ink">
                            {m.code}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.ul
              key={`grid-${type ?? "all"}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4"
            >
              {shown.map((m, i) => (
                <motion.li
                  key={m.code}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease, delay: Math.min(i, 8) * 0.03 } }}
                >
                  <button type="button" onClick={() => open(m)} className="group block w-full text-left">
                    <span className="relative block aspect-4/3 overflow-hidden rounded-xl bg-white ring-accent transition-shadow duration-200 group-hover:ring-2 group-focus-visible:ring-2">
                      <RetryImage
                        src={m.src}
                        alt={m.alt}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                        className={`transition-transform duration-500 group-hover:scale-[1.04] ${
                          m.fit === "contain" ? "object-contain p-1 md:p-3" : "object-cover"
                        }`}
                      />
                    </span>
                    <span className="mt-2.5 block text-base font-bold tracking-tight text-ink group-hover:text-accent-ink">{m.code}</span>
                    <span className="block text-[14px] text-muted">{m.type}</span>
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
