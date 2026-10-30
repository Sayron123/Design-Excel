"use client";

// Adapted from Aceternity UI "Sticky Scroll Reveal".
// Changes: driven by page scroll instead of an inner scroll box, and every scroll position moves
// something: a progress rail fills beside the steps, the sticky picture crossfades and settles
// (scale 1.08 → 1) through each step, segment bars track the current step, and each visual can
// take the step's own progress (0 → 1) to animate itself. Flat token colours, no gradients.
// On phones the visuals sit inline under their step and use their own scroll progress.

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef, useState, type ReactNode } from "react";

export type StickyScrollItem = {
  title: string;
  description: string;
  /** A visual, or a function that receives this step's progress (0 → 1) as the page scrolls. */
  content: ReactNode | ((progress: MotionValue<number>) => ReactNode);
};

function renderContent(item: StickyScrollItem, progress: MotionValue<number>) {
  return typeof item.content === "function" ? item.content(progress) : item.content;
}

/** One stacked picture in the sticky panel: fades in for its step and settles while it is current. */
function Layer({
  item,
  index,
  count,
  progress,
}: {
  item: StickyScrollItem;
  index: number;
  count: number;
  progress: MotionValue<number>;
}) {
  const reduce = useReducedMotion();
  const start = index / count;
  const end = (index + 1) / count;
  const fade = 0.04;
  const opacity = useTransform(
    progress,
    index === 0 ? [0, end - fade, end + fade] : [start - fade, start + fade, end - fade, end + fade],
    index === 0 ? [1, 1, 0] : index === count - 1 ? [0, 1, 1, 1] : [0, 1, 1, 0],
  );
  const scale = useTransform(progress, [start, end], reduce ? [1, 1] : [1.08, 1]);
  const local = useTransform(progress, [start, end], [0, 1]);

  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      <motion.div className="h-full w-full" style={{ scale }}>
        {renderContent(item, local)}
      </motion.div>
    </motion.div>
  );
}

/** Short bar per step at the top of the sticky panel, filling as that step is scrolled through. */
function Segment({ index, count, progress }: { index: number; count: number; progress: MotionValue<number> }) {
  const scaleX = useTransform(progress, [index / count, (index + 1) / count], [0, 1]);
  return (
    <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/35">
      <motion.span className="block h-full origin-left rounded-full bg-white" style={{ scaleX }} />
    </span>
  );
}

/** Phone version of a step's visual: inline, with its own scroll progress. */
function InlineVisual({ item }: { item: StickyScrollItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end 40%"] });
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.1, 1]);
  return (
    <div ref={ref} className="mt-6 aspect-4/3 overflow-hidden rounded-xl bg-surface lg:hidden">
      <motion.div className="h-full w-full" style={{ scale }}>
        {renderContent(item, scrollYProgress)}
      </motion.div>
    </div>
  );
}

type StickyScrollProps = {
  content: StickyScrollItem[];
  /** One visual for the whole sticky panel, given the overall progress (0 → 1) across every step.
   *  Replaces the per-step pictures on desktop; phones still show each step's own content. */
  stage?: (progress: MotionValue<number>) => ReactNode;
};

export function StickyScroll({ content, stage }: StickyScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = content.length;

  // 0 when the first step reaches 60% down the viewport, 1 when the last one leaves it.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 60%"] });
  const railFill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(Math.min(count - 1, Math.max(0, Math.floor(p * count))));
  });

  return (
    <div ref={ref} className="relative grid lg:grid-cols-12 lg:gap-12">
      <div className="relative lg:col-span-6">
        {/* Progress rail */}
        <div aria-hidden="true" className="absolute bottom-2 left-[9px] top-2 w-1 rounded-full bg-border">
          <motion.div className="h-full w-full origin-top rounded-full bg-accent" style={{ scaleY: railFill }} />
        </div>

        <ol className="relative">
          {content.map((item, index) => {
            const reached = index <= active;
            const current = index === active;
            return (
              <li
                key={item.title}
                aria-current={current ? "step" : undefined}
                className="relative pb-12 pl-12 last:pb-0 lg:flex lg:min-h-[48vh] lg:flex-col lg:justify-center lg:pb-0"
              >
                <div className="relative">
                  <span
                    aria-hidden="true"
                    className={`absolute -left-12 top-1.5 h-[22px] w-[22px] rounded-full border-4 transition-colors duration-300 ${
                      reached ? "border-accent bg-accent" : "border-border bg-bg"
                    }`}
                  />
                  <h3
                    className={`text-2xl font-bold tracking-tight transition-colors duration-300 md:text-3xl ${
                      current ? "text-ink" : "text-ink lg:text-muted"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`mt-3 max-w-[42ch] text-lg leading-relaxed transition-colors duration-300 ${
                      current ? "text-ink" : "text-ink lg:text-muted"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
                <InlineVisual item={item} />
              </li>
            );
          })}
        </ol>
      </div>

      <div className="hidden lg:col-span-6 lg:block">
        <div className="sticky top-[calc(50vh-13rem)] aspect-4/3 overflow-hidden rounded-xl bg-surface">
          {stage
            ? stage(scrollYProgress)
            : content.map((item, index) => (
                <Layer key={item.title} item={item} index={index} count={count} progress={scrollYProgress} />
              ))}

          {/* Step tracker over the picture */}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex gap-1.5 p-4">
            {content.map((item, index) => (
              <Segment key={item.title} index={index} count={count} progress={scrollYProgress} />
            ))}
          </div>
          <div className="pointer-events-none absolute bottom-4 left-4 rounded-lg bg-ink/80 px-3 py-1.5 text-base font-semibold text-white">
            {content[active].title}
          </div>
        </div>
      </div>
    </div>
  );
}
