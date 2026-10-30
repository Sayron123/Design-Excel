"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { categoryHref, getCategory } from "@/lib/products";

type Room = {
  id: string;
  name: string;
  size: string;
  blurb: string;
  rect: { x: number; y: number; w: number; h: number };
  items: { name: string; category: string }[];
};

// Sample office layout. Room sizes and furniture lists are illustrative, not a client project.
const ROOMS: Room[] = [
  {
    id: "reception",
    name: "Reception",
    size: "About 6 × 5 m (sample)",
    blurb: "The first thing visitors see. A counter sized for the staff behind it, and seating for the people waiting.",
    rect: { x: 0, y: 0, w: 200, h: 170 },
    items: [
      { name: "Reception counter", category: "reception-area" },
      { name: "Waiting chairs", category: "chairs" },
      { name: "Low table", category: "tables" },
    ],
  },
  {
    id: "meeting",
    name: "Meeting room",
    size: "About 7 × 5 m (sample)",
    blurb: "A table for ten with clearance to pull chairs out, and a credenza along the wall for supplies.",
    rect: { x: 200, y: 0, w: 220, h: 170 },
    items: [
      { name: "Conference table", category: "tables" },
      { name: "Meeting chairs", category: "chairs" },
      { name: "Credenza", category: "cabinets" },
    ],
  },
  {
    id: "manager",
    name: "Manager’s office",
    size: "About 6 × 5 m (sample)",
    blurb: "A desk facing the door, two guest chairs and tall storage for files that stay close.",
    rect: { x: 420, y: 0, w: 220, h: 170 },
    items: [
      { name: "Executive desk", category: "tables" },
      { name: "Executive chair", category: "chairs" },
      { name: "Guest chairs", category: "chairs" },
      { name: "Tall storage cabinet", category: "cabinets" },
    ],
  },
  {
    id: "workstations",
    name: "Open workstations",
    size: "About 13 × 8 m (sample)",
    blurb: "Two clusters of four desks with walkways between them, and low cabinets along the wall.",
    rect: { x: 0, y: 170, w: 420, h: 250 },
    items: [
      { name: "Workstation desks", category: "workstations" },
      { name: "Task chairs", category: "chairs" },
      { name: "Mobile pedestals", category: "cabinets" },
      { name: "Low storage cabinets", category: "cabinets" },
    ],
  },
  {
    id: "pantry",
    name: "Pantry",
    size: "About 6 × 4 m (sample)",
    blurb: "An L of base cabinets with a counter, and a small table for breaks.",
    rect: { x: 420, y: 170, w: 220, h: 130 },
    items: [
      { name: "Pantry base cabinets", category: "kitchen-cabinets" },
      { name: "Round table", category: "tables" },
      { name: "Pantry chairs", category: "chairs" },
    ],
  },
  {
    id: "files",
    name: "File room",
    size: "About 6 × 4 m (sample)",
    blurb: "Two rows of filing cabinets with a walkway between them.",
    rect: { x: 420, y: 300, w: 220, h: 120 },
    items: [
      { name: "Filing cabinets", category: "cabinets" },
      { name: "Open shelving", category: "cabinets" },
    ],
  },
];

// Label positions for rooms where the default (bottom centre) would sit on furniture.
const LABEL_AT: Record<string, [number, number]> = {
  workstations: [210, 368],
  pantry: [563, 254],
  files: [530, 364],
};

// Furniture drawn as plan symbols, in the style of an AutoCAD layout.
function Furniture() {
  const f = { fill: "var(--surface)", stroke: "var(--primary)", strokeWidth: 1.5 } as const;
  return (
    <g pointerEvents="none">
      {/* Reception */}
      <path d="M110 34 H184 V100 H166 V52 H110 Z" {...f} />
      <circle cx="140" cy="76" r="10" {...f} />
      {[56, 86, 116].map((y) => (
        <rect key={y} x="16" y={y} width="22" height="22" rx="4" {...f} />
      ))}
      <rect x="48" y="78" width="28" height="44" rx="3" {...f} />

      {/* Meeting room */}
      <rect x="226" y="14" width="168" height="16" rx="2" {...f} />
      <rect x="244" y="66" width="132" height="50" rx="10" {...f} />
      {[256, 286, 316, 346].map((x) => (
        <g key={x}>
          <rect x={x} y="48" width="20" height="14" rx="4" {...f} />
          <rect x={x} y="120" width="20" height="14" rx="4" {...f} />
        </g>
      ))}
      <rect x="224" y="81" width="14" height="20" rx="4" {...f} />
      <rect x="382" y="81" width="14" height="20" rx="4" {...f} />

      {/* Manager's office */}
      <rect x="470" y="62" width="110" height="38" rx="3" {...f} />
      <circle cx="525" cy="44" r="12" {...f} />
      <rect x="494" y="112" width="22" height="20" rx="4" {...f} />
      <rect x="536" y="112" width="22" height="20" rx="4" {...f} />
      <rect x="606" y="16" width="20" height="80" rx="2" {...f} />

      {/* Open workstations: two clusters of four */}
      {[40, 230].map((cx) => (
        <g key={cx}>
          {[0, 64].map((dx) =>
            [0, 42].map((dy) => (
              <rect key={`${dx}-${dy}`} x={cx + dx} y={226 + dy} width="62" height="40" rx="2" {...f} />
            )),
          )}
          {[0, 64].map((dx) => (
            <g key={dx}>
              <circle cx={cx + dx + 31} cy="212" r="9" {...f} />
              <circle cx={cx + dx + 31} cy="324" r="9" {...f} />
            </g>
          ))}
        </g>
      ))}
      <rect x="24" y="388" width="150" height="18" rx="2" {...f} />
      <rect x="230" y="388" width="160" height="18" rx="2" {...f} />

      {/* Pantry */}
      <path d="M470 182 H628 V288 H604 V206 H470 Z" {...f} />
      <circle cx="490" cy="248" r="22" {...f} />
      {[
        [490, 216],
        [490, 280],
        [458, 248],
        [522, 248],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="8" {...f} />
      ))}

      {/* File room */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <rect x={448 + i * 30} y="314" width="30" height="24" {...f} />
          <rect x={448 + i * 30} y="380" width="30" height="24" {...f} />
        </g>
      ))}
    </g>
  );
}

// Walls with door openings and swing arcs.
function Walls() {
  const wall = { stroke: "var(--ink)", strokeWidth: 6, strokeLinecap: "square" as const };
  const door = { fill: "none", stroke: "var(--muted)", strokeWidth: 1.25 };
  return (
    <g pointerEvents="none">
      {/* outer shell with the entrance gap at the top of reception */}
      <path d="M70 3 H3 V417 H637 V3 H112" fill="none" {...wall} strokeWidth={8} />
      {/* inner walls, drawn in pieces around each door */}
      <path d="M200 3 V170" {...wall} />
      <path d="M420 3 V170" {...wall} />
      <path d="M3 170 H148 M190 170 H356 M398 170 H420" {...wall} />
      <path d="M420 170 H426 M466 170 H637" {...wall} />
      <path d="M420 170 V188 M420 230 V360 M420 400 V417" {...wall} />
      <path d="M420 300 H637" {...wall} />
      {/* door swings */}
      <path d="M70 3 A42 42 0 0 0 112 45" {...door} />
      <path d="M148 170 A42 42 0 0 1 190 128" {...door} />
      <path d="M356 170 A42 42 0 0 1 398 128" {...door} />
      <path d="M426 170 A40 40 0 0 0 466 130" {...door} />
      <path d="M420 188 A42 42 0 0 1 378 230" {...door} />
      <path d="M420 360 A40 40 0 0 0 380 400" {...door} />
    </g>
  );
}

export function FloorPlan() {
  const [activeId, setActiveId] = useState(ROOMS[3].id);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const active = ROOMS.find((r) => r.id === activeId) ?? ROOMS[0];

  return (
    <section aria-labelledby="plan-heading" className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
      <Reveal className="grid gap-4 md:grid-cols-12 md:items-end md:gap-10">
        <h2 id="plan-heading" className="text-3xl font-bold tracking-tight md:col-span-6 md:text-5xl">
          Plan the floor first
        </h2>
        <p className="max-w-[46ch] text-lg leading-relaxed text-ink md:col-span-6">
          Every job is drawn in AutoCAD before anything is made. Tap a room on this sample office to see what we would
          build for it.
        </p>
      </Reveal>

      <Reveal delay={0.08} className="mt-8 md:mt-12">
        <div role="group" aria-label="Rooms" className="flex flex-wrap gap-2">
          {ROOMS.map((room) => {
            const selected = room.id === activeId;
            return (
              <button
                key={room.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setActiveId(room.id)}
                onMouseEnter={() => setHoverId(room.id)}
                onMouseLeave={() => setHoverId(null)}
                className={`h-11 rounded-xl px-4 text-base font-semibold transition-colors duration-300 ${
                  selected ? "bg-ink text-white" : "bg-border text-ink hover:bg-primary hover:text-white"
                }`}
              >
                {room.name}
              </button>
            );
          })}
        </div>
      </Reveal>

      <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:gap-8">
        <Reveal delay={0.12} className="lg:col-span-8">
          <div data-ui className="rounded-xl bg-surface p-3 md:p-6">
            <svg
              viewBox="-6 -6 652 432"
              className="h-auto w-full"
              role="img"
              aria-label={`Sample office floor plan. Selected room: ${active.name}.`}
            >
              {ROOMS.map((room) => {
                const selected = room.id === activeId;
                const hovered = room.id === hoverId;
                return (
                  <rect
                    key={room.id}
                    x={room.rect.x}
                    y={room.rect.y}
                    width={room.rect.w}
                    height={room.rect.h}
                    onClick={() => setActiveId(room.id)}
                    onMouseEnter={() => setHoverId(room.id)}
                    onMouseLeave={() => setHoverId(null)}
                    className="cursor-pointer"
                    style={{
                      fill: selected ? "var(--accent)" : hovered ? "var(--primary)" : "var(--bg)",
                      fillOpacity: selected ? 0.28 : hovered ? 0.1 : 1,
                      transition: "fill 300ms ease, fill-opacity 300ms ease",
                    }}
                  />
                );
              })}
              <Furniture />
              <Walls />
              {ROOMS.map((room) => (
                <text
                  key={room.id}
                  x={LABEL_AT[room.id]?.[0] ?? room.rect.x + room.rect.w / 2}
                  y={LABEL_AT[room.id]?.[1] ?? room.rect.y + room.rect.h - 12}
                  textAnchor="middle"
                  pointerEvents="none"
                  className="hidden fill-ink text-[14px] font-semibold md:block"
                >
                  {room.name}
                </text>
              ))}
            </svg>
          </div>
        </Reveal>

        <Reveal delay={0.16} className="lg:col-span-4">
          <div className="h-full rounded-xl bg-primary p-6 text-white md:p-8" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="text-2xl font-bold tracking-tight md:text-3xl">{active.name}</h3>
                <p className="mt-1 text-base text-white/80">{active.size}</p>
                <p className="mt-4 text-base leading-relaxed">{active.blurb}</p>
                <ul className="mt-6 space-y-2">
                  {active.items.map((item) => (
                    <li key={item.name} className="flex items-baseline justify-between gap-4 rounded-lg bg-white/10 px-4 py-3">
                      <span className="font-semibold">{item.name}</span>
                      <Link
                        href={categoryHref(item.category)}
                        className="shrink-0 text-[14px] text-white/85 underline underline-offset-4 hover:text-accent"
                      >
                        {getCategory(item.category)?.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
