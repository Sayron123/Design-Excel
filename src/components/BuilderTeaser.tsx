"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";

// Placeholder finishes. Real finish names and colours come from the client.
const FINISHES = [
  { id: "walnut", name: "Walnut", body: "#6b4a32", handle: "#e9e2d6" },
  { id: "oak", name: "Natural oak", body: "#c9a46b", handle: "#1c1f26" },
  { id: "white", name: "Matte white", body: "#ece9e3", handle: "#1c1f26" },
  { id: "graphite", name: "Graphite", body: "#3a3f47", handle: "#e9e2d6" },
] as const;

type Finish = (typeof FINISHES)[number];

const fillTransition = { transition: "fill 300ms ease, stroke 300ms ease" };

function CabinetPreview({ finish }: { finish: Finish }) {
  const seam = "rgba(28,31,38,0.28)";
  return (
    <svg viewBox="0 0 320 300" className="h-auto w-full max-w-[22rem]" role="img" aria-label={`Cabinet preview in ${finish.name}`}>
      {/* floor contact */}
      <ellipse cx="160" cy="282" rx="138" ry="8" fill="rgba(28,31,38,0.12)" />
      {/* carcass */}
      <rect x="28" y="20" width="264" height="246" rx="6" style={{ fill: finish.body, ...fillTransition }} />
      {/* plinth */}
      <rect x="40" y="262" width="240" height="14" rx="2" style={{ fill: finish.body, filter: "brightness(0.7)", ...fillTransition }} />
      {/* top drawers */}
      <rect x="38" y="30" width="118" height="54" rx="3" fill="none" stroke={seam} strokeWidth="2" />
      <rect x="164" y="30" width="118" height="54" rx="3" fill="none" stroke={seam} strokeWidth="2" />
      {/* doors */}
      <rect x="38" y="92" width="118" height="164" rx="3" fill="none" stroke={seam} strokeWidth="2" />
      <rect x="164" y="92" width="118" height="164" rx="3" fill="none" stroke={seam} strokeWidth="2" />
      {/* handles */}
      <rect x="77" y="52" width="40" height="7" rx="3.5" style={{ fill: finish.handle, ...fillTransition }} />
      <rect x="203" y="52" width="40" height="7" rx="3.5" style={{ fill: finish.handle, ...fillTransition }} />
      <rect x="140" y="150" width="7" height="44" rx="3.5" style={{ fill: finish.handle, ...fillTransition }} />
      <rect x="173" y="150" width="7" height="44" rx="3.5" style={{ fill: finish.handle, ...fillTransition }} />
    </svg>
  );
}

export function BuilderTeaser() {
  const [active, setActive] = useState<Finish>(FINISHES[0]);

  return (
    <section aria-labelledby="builder-heading" className="bg-primary text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:gap-12 md:px-6 md:py-20">
        <Reveal className="order-2 md:order-1">
          <div className="flex aspect-square items-center justify-center rounded-xl bg-bg p-8 md:p-12">
            <CabinetPreview finish={active} />
          </div>
        </Reveal>

        <Reveal className="order-1 md:order-2" delay={0.08}>
          <h2 id="builder-heading" className="text-3xl font-bold tracking-tight md:text-5xl">
            Pick a finish, see it now
          </h2>
          <p className="mt-4 max-w-[42ch] text-lg leading-relaxed text-white/90">
            This is a small taste of the cabinet builder. The full builder sets width, height, doors and drawers.
          </p>

          <fieldset className="mt-8">
            <legend className="text-base font-semibold">
              Finish: {active.name} <span className="font-normal text-white/80">(placeholder)</span>
            </legend>
            <div className="mt-4 flex flex-wrap gap-3">
              {FINISHES.map((finish) => {
                const selected = finish.id === active.id;
                return (
                  <motion.button
                    key={finish.id}
                    type="button"
                    whileTap={{ scale: 0.88 }}
                    onClick={() => setActive(finish)}
                    aria-pressed={selected}
                    aria-label={`${finish.name} (placeholder finish)`}
                    className={`h-14 w-14 rounded-xl transition-[outline-color] duration-300 outline-offset-[3px] ${
                      selected ? "outline-3 outline-accent" : "outline-3 outline-transparent hover:outline-white/40"
                    }`}
                    style={{ backgroundColor: finish.body }}
                  />
                );
              })}
            </div>
          </fieldset>

          <Link
            href="/products/cabinets"
            className="mt-10 inline-flex h-12 items-center rounded-xl bg-accent px-6 text-base font-semibold text-ink transition-colors hover:bg-white"
          >
            Open the cabinet builder
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
