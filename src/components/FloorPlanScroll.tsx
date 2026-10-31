"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import { ArrowRight, buttonClass } from "@/components/ui/button";
import { INQUIRE_HREF } from "@/lib/site";

// A sample open-plan office drawn top-down. As the section scrolls, the plan is fitted out in the
// order the work happens on site: glass partitions, then desks, chairs, storage and reception.
// The layout and counts are illustrative, not a client project.

type Cat = "glass" | "desks" | "chairs" | "files" | "reception";

const CAT_LABEL: Record<Cat, string> = {
  glass: "Glass partition panels",
  desks: "Desks and tables",
  chairs: "Chairs",
  files: "Filing cabinets",
  reception: "Reception counter",
};

const STAGES = [
  { title: "A bare floor", body: "Every job starts as an empty floor and a set of measurements.", from: 0 },
  { title: "Glass partitions", body: "Glass walls close off the meeting room, the manager’s office and reception.", from: 0.1 },
  { title: "Workstations", body: "Desk clusters for the team, a meeting table and the manager’s desk.", from: 0.3 },
  { title: "Chairs", body: "A chair for every desk, the meeting table and the guests.", from: 0.48 },
  { title: "Storage and reception", body: "Filing cabinets along the wall, a counter and seats at the door.", from: 0.64 },
  { title: "Ready to work", body: "Drawn in AutoCAD, made to these sizes and installed where the plan shows.", from: 0.82 },
] as const;

const furniture = { fill: "var(--surface)", stroke: "var(--primary)", strokeWidth: 1.5 } as const;
const chair = { fill: "var(--primary)" } as const;

type Piece = { cat: Cat; at: number; node: ReactNode };

/** Spreads n pieces evenly across a stretch of the scroll, so they arrive one after another. */
function spread(n: number, from: number, to: number) {
  return Array.from({ length: n }, (_, i) => from + ((to - from) * i) / Math.max(1, n - 1));
}

// Glass runs as [x1, y1, x2, y2]; each is split into panels about 45 units wide.
const GLASS: [number, number, number, number][] = [
  [280, 20, 280, 200], // meeting room, east wall
  [20, 200, 200, 200], // meeting room, south wall (door at 200–250)
  [580, 20, 580, 140], // manager, west wall (door at 140–200)
  [580, 200, 780, 200], // manager, south wall
  [280, 300, 280, 500], // reception screen
];
const PANEL = 45;
const glassPanels = GLASS.map(([x1, y1, x2, y2]) => Math.max(1, Math.round(Math.hypot(x2 - x1, y2 - y1) / PANEL)));

function buildPieces(): Piece[] {
  const pieces: Piece[] = [];

  // Glass: one piece per panel, so the count climbs as the lines draw.
  GLASS.forEach(([x1, y1, x2, y2], run) => {
    const n = glassPanels[run];
    spread(n, 0.12 + run * 0.03, 0.15 + run * 0.03).forEach((at, i) => {
      const t = (i + 1) / n;
      pieces.push({
        cat: "glass",
        at,
        node: <circle cx={x1 + (x2 - x1) * t} cy={y1 + (y2 - y1) * t} r={3} fill="var(--primary)" />,
      });
    });
  });

  // Desks: three clusters of four, the meeting table, the manager's desk.
  const deskSpots: [number, number][] = [];
  [320, 470, 620].forEach((cx) => {
    [0, 62].forEach((dx) => [0, 42].forEach((dy) => deskSpots.push([cx + dx, 300 + dy])));
  });
  const deskAt = spread(deskSpots.length + 2, 0.32, 0.45);
  deskSpots.forEach(([x, y], i) => {
    pieces.push({ cat: "desks", at: deskAt[i], node: <rect x={x} y={y} width={60} height={40} rx={2} {...furniture} /> });
  });
  pieces.push({ cat: "desks", at: deskAt[12], node: <rect x={70} y={80} width={150} height={56} rx={12} {...furniture} /> });
  pieces.push({ cat: "desks", at: deskAt[13], node: <rect x={630} y={70} width={110} height={40} rx={3} {...furniture} /> });

  // Chairs: one per desk (outside each cluster), six at the meeting table, the manager's three.
  const chairSpots: [number, number][] = [];
  [320, 470, 620].forEach((cx) => {
    [0, 62].forEach((dx) => {
      chairSpots.push([cx + dx + 30, 286]);
      chairSpots.push([cx + dx + 30, 398]);
    });
  });
  [100, 145, 190].forEach((x) => {
    chairSpots.push([x, 66]);
    chairSpots.push([x, 150]);
  });
  chairSpots.push([685, 54], [665, 128], [705, 128]);
  spread(chairSpots.length, 0.5, 0.62).forEach((at, i) => {
    const [cx, cy] = chairSpots[i];
    pieces.push({ cat: "chairs", at, node: <rect x={cx - 9} y={cy - 8} width={18} height={16} rx={5} {...chair} /> });
  });

  // Filing cabinets along the north wall between the two glass rooms.
  spread(8, 0.66, 0.74).forEach((at, i) => {
    pieces.push({
      cat: "files",
      at,
      node: <rect x={300 + i * 32} y={26} width={30} height={26} fill="var(--border)" stroke="var(--ink)" strokeWidth={1.25} />,
    });
  });

  // Reception: the counter, the receptionist's chair and three waiting chairs.
  pieces.push({ cat: "reception", at: 0.75, node: <path d="M150 340 H260 V420 H236 V362 H150 Z" {...furniture} /> });
  pieces.push({ cat: "chairs", at: 0.77, node: <rect x={187} y={312} width={18} height={16} rx={5} {...chair} /> });
  spread(3, 0.78, 0.8).forEach((at, i) => {
    pieces.push({ cat: "chairs", at, node: <rect x={30} y={340 + i * 34} width={20} height={20} rx={5} {...chair} /> });
  });

  return pieces;
}

const PIECES = buildPieces();
const TOTALS = PIECES.reduce<Record<Cat, number>>(
  (acc, p) => ({ ...acc, [p.cat]: acc[p.cat] + 1 }),
  { glass: 0, desks: 0, chairs: 0, files: 0, reception: 0 },
);
const TOTAL = PIECES.length;

function countAt(p: number) {
  const counts: Record<Cat, number> = { glass: 0, desks: 0, chairs: 0, files: 0, reception: 0 };
  for (const piece of PIECES) if (p >= piece.at) counts[piece.cat]++;
  return counts;
}

function stageAt(p: number) {
  let s = 0;
  STAGES.forEach((stage, i) => {
    if (p >= stage.from) s = i;
  });
  return s;
}

/** One piece of furniture, scaling up from its centre as the scroll passes its moment. */
function Appear({ progress, at, children }: { progress: MotionValue<number>; at: number; children: ReactNode }) {
  const opacity = useTransform(progress, [at, at + 0.025], [0, 1]);
  const scale = useTransform(progress, [at, at + 0.025], [0.4, 1]);
  return (
    <motion.g style={{ opacity, scale, transformBox: "fill-box", transformOrigin: "center" }}>{children}</motion.g>
  );
}

function GlassRun({ progress, run }: { progress: MotionValue<number>; run: number }) {
  const [x1, y1, x2, y2] = GLASS[run];
  const from = 0.12 + run * 0.03;
  const pathLength = useTransform(progress, [from, from + 0.04], [0, 1]);
  const d = `M${x1} ${y1} L${x2} ${y2}`;
  return (
    <g>
      <motion.path d={d} stroke="var(--primary)" strokeOpacity={0.3} strokeWidth={7} fill="none" style={{ pathLength }} />
      <motion.path d={d} stroke="var(--primary)" strokeWidth={1.5} fill="none" style={{ pathLength }} />
    </g>
  );
}

function Shell() {
  const wall = { stroke: "var(--ink)", strokeWidth: 10, fill: "none", strokeLinecap: "square" as const };
  return (
    <g>
      <rect x={15} y={15} width={770} height={490} fill="var(--bg)" />
      {/* outer walls, open at the entrance */}
      <path d="M120 505 H15 V15 H785 V505 H200" {...wall} />
      {/* windows along the north and east walls */}
      {[60, 180, 360, 480, 640].map((x) => (
        <rect key={x} x={x} y={11} width={80} height={8} fill="var(--surface)" stroke="var(--ink)" strokeWidth={1} />
      ))}
      {[260, 380].map((y) => (
        <rect key={y} x={781} y={y} width={8} height={80} fill="var(--surface)" stroke="var(--ink)" strokeWidth={1} />
      ))}
      {/* entrance door swing */}
      <path d="M120 505 A80 80 0 0 1 200 425" fill="none" stroke="var(--muted)" strokeWidth={1.25} />
    </g>
  );
}

/** The full plan, every piece in place. Shared by the static version for reduced motion. */
function StaticPlan() {
  return (
    <svg viewBox="0 0 800 520" className="h-auto w-full" role="img" aria-label="Sample office floor plan with glass partitions, desks, chairs, filing cabinets and a reception counter">
      <Shell />
      {GLASS.map(([x1, y1, x2, y2], i) => (
        <g key={i}>
          <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke="var(--primary)" strokeOpacity={0.3} strokeWidth={7} />
          <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke="var(--primary)" strokeWidth={1.5} />
        </g>
      ))}
      {PIECES.map((p, i) => (
        <g key={i}>{p.node}</g>
      ))}
    </svg>
  );
}

function Counts({ counts, total, compact = false }: { counts: Record<Cat, number>; total: number; compact?: boolean }) {
  return (
    <div>
      <p className="flex items-baseline gap-2 text-ink">
        <span className="font-heading text-4xl font-bold tabular-nums tracking-tight md:text-6xl">{total}</span>
        <span className="text-base md:text-lg">items on the plan</span>
      </p>
      <ul className={`mt-3 grid gap-x-4 gap-y-1 md:mt-5 md:gap-y-2 ${compact ? "grid-cols-2 lg:grid-cols-1" : "grid-cols-1"}`}>
        {(Object.keys(CAT_LABEL) as Cat[]).map((cat) => (
          <li
            key={cat}
            className={`flex items-baseline justify-between gap-3 text-[14px] transition-opacity duration-300 md:text-base ${
              counts[cat] > 0 ? "opacity-100" : "opacity-35"
            }`}
          >
            <span className="text-ink">{CAT_LABEL[cat]}</span>
            <span className="font-semibold tabular-nums text-ink">{counts[cat]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const CTA_LABEL = "Want this layout? Request a quote";

function Heading() {
  return (
    <Reveal className="mx-auto grid max-w-6xl gap-4 px-4 pt-12 md:px-6 md:pt-20 lg:grid-cols-12 lg:items-end lg:gap-10">
      <h2 id="plan-scroll-heading" className="text-3xl font-bold tracking-tight md:text-4xl lg:col-span-7 lg:text-5xl">
        From bare floor to a working office
      </h2>
      <p className="max-w-[46ch] text-lg leading-relaxed text-ink lg:col-span-5">
        Scroll to fit out a sample floor the way we do on site, one trade at a time.
      </p>
    </Reveal>
  );
}

/** The plan without the scroll: everything in place, for visitors who ask for less motion. */
function StillVersion() {
  return (
    <section id="floor-plan" aria-labelledby="plan-scroll-heading" className="scroll-mt-20">
      <Heading />
      <div className="mx-auto mt-8 grid max-w-6xl gap-6 px-4 pb-12 md:px-6 md:pb-20 lg:grid-cols-12 lg:gap-10">
        <figure data-ui className="rounded-xl bg-surface p-3 md:p-5 lg:col-span-8">
          <StaticPlan />
        </figure>
        <div className="min-w-0 lg:col-span-4">
          <Counts counts={TOTALS} total={TOTAL} />
          <Link href={INQUIRE_HREF} className={buttonClass("accent", "lg", "mt-8 h-auto min-h-14 w-full py-3 text-center text-base leading-tight whitespace-normal! md:text-lg")}>
            {CTA_LABEL}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function FloorPlanScroll() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const sprung = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.5, restDelta: 0.0005 });
  const [stage, setStage] = useState(0);
  const [counts, setCounts] = useState(() => countAt(0));

  useMotionValueEvent(sprung, "change", (p) => {
    const s = stageAt(p);
    setStage((prev) => (prev === s ? prev : s));
    const next = countAt(p);
    setCounts((prev) => ((Object.keys(next) as Cat[]).every((k) => prev[k] === next[k]) ? prev : next));
  });

  if (reduce) return <StillVersion />;

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const current = STAGES[stage];

  return (
    <section id="floor-plan" aria-labelledby="plan-scroll-heading" className="scroll-mt-20">
      <Heading />

      {/* The stages in order for screen readers; the pinned plan below shows them one at a time. */}
      <ol className="sr-only">
        {STAGES.map((s) => (
          <li key={s.title}>
            {s.title}: {s.body}
          </li>
        ))}
      </ol>

      <div ref={trackRef} className="relative h-[400vh]">
        <div className="sticky top-16 flex h-[calc(100svh-4rem)] items-center md:top-20 md:h-[calc(100svh-5rem)]">
          <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 md:px-6 lg:grid-cols-12 lg:items-center lg:gap-10">
            <figure data-ui aria-hidden="true" className="rounded-xl bg-surface p-2.5 md:p-5 lg:col-span-8">
              <svg viewBox="0 0 800 520" className="mx-auto h-auto max-h-[calc(100svh-24rem)] w-full md:max-h-[calc(100svh-12rem)]">
                <Shell />
                {GLASS.map((_, i) => (
                  <GlassRun key={i} progress={sprung} run={i} />
                ))}
                {PIECES.map((p, i) => (
                  <Appear key={i} progress={sprung} at={p.at}>
                    {p.node}
                  </Appear>
                ))}
              </svg>
            </figure>

            <div className="min-w-0 lg:col-span-4">
              <div className="flex gap-1.5" aria-hidden="true">
                {STAGES.map((s, i) => (
                  <span key={s.title} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= stage ? "bg-accent" : "bg-border"}`} />
                ))}
              </div>
              <div className="relative mt-3 min-h-[4.75rem] md:mt-6 md:min-h-[7.5rem]" aria-live="polite">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={current.title}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="font-heading text-2xl font-bold tracking-tight text-ink md:text-4xl">{current.title}</p>
                    <p className="mt-1 text-base leading-snug text-ink md:mt-3 md:text-lg md:leading-relaxed">{current.body}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-3 md:mt-6">
                <Counts counts={counts} total={total} compact />
              </div>

              <div className="mt-4 min-h-14 md:mt-8">
                <AnimatePresence>
                  {stage === STAGES.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link href={INQUIRE_HREF} className={buttonClass("accent", "lg", "h-auto min-h-14 w-full px-5 py-3 text-center text-base leading-tight whitespace-normal! md:text-lg")}>
                        {CTA_LABEL}
                        <ArrowRight />
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
