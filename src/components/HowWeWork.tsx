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
import { useRef, useState } from "react";
import { LineStory } from "@/components/ProcessLine";
import { Reveal } from "@/components/Reveal";

const STEPS = [
  { title: "Design consultation", description: "For offices and homes." },
  { title: "Floor plan & rendered layout", description: "Drawn by our designers and AutoCAD artists." },
  { title: "Furniture quotation", description: "Based on your layout." },
  {
    title: "Manufacturing & delivery",
    description: "Cabinets made in our own plant, delivered by our project team.",
  },
];

/** One bar per stage along the top of the panel, filling as that stage is scrolled through. */
function Segment({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const scaleX = useTransform(progress, [index / STEPS.length, (index + 1) / STEPS.length], [0, 1]);
  return (
    <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
      <motion.span className="block h-full origin-left rounded-full bg-accent" style={{ scaleX }} />
    </span>
  );
}

/**
 * The four stages as one pinned panel: the page scrolls through a tall track while the panel
 * stays put, the line drawing moves from stage to stage and the words change with it.
 */
export function HowWeWork() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  // The drawing follows the scroll through a spring, so a flick of the wheel glides instead of jumping.
  const sprung = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6, restDelta: 0.0005 });
  const progress = reduce ? scrollYProgress : sprung;

  useMotionValueEvent(progress, "change", (p) => {
    // The spring can overshoot a little past either end, so keep the index in range.
    setActive(Math.min(STEPS.length - 1, Math.max(0, Math.floor(p * STEPS.length))));
  });

  const step = STEPS[active];

  return (
    <section id="how-we-work" aria-labelledby="how-heading" className="scroll-mt-20">
      <Reveal className="mx-auto max-w-6xl px-4 pt-12 md:px-6 md:pt-20">
        <h2 id="how-heading" className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          Our services
        </h2>
      </Reveal>

      {/* The stages in reading order for screen readers; the panel below shows them one at a time. */}
      <ol className="sr-only">
        {STEPS.map((s) => (
          <li key={s.title}>
            {s.title}: {s.description}
          </li>
        ))}
      </ol>

      <div ref={trackRef} className="relative h-[260vh]">
        <div className="sticky top-16 flex h-[calc(100svh-4rem)] items-center md:top-20 md:h-[calc(100svh-5rem)]">
          <div className="mx-auto w-full max-w-6xl px-4 py-4 md:px-6">
            <div
              aria-hidden="true"
              className="flex h-[min(calc(100svh-7rem),760px)] flex-col overflow-hidden rounded-2xl bg-primary px-5 pb-6 pt-5 text-center text-white md:px-12 md:pb-10"
            >
              <div className="flex gap-1.5">
                {STEPS.map((s, i) => (
                  <Segment key={s.title} index={i} progress={progress} />
                ))}
              </div>

              <div className="relative mt-6 min-h-36 md:mt-10 md:min-h-32">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={step.title}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="font-heading text-3xl font-bold tracking-tight md:text-5xl">{step.title}</p>
                    <p className="mx-auto mt-3 max-w-[52ch] text-base leading-relaxed text-white/85 md:text-lg">
                      {step.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex min-h-0 flex-1 items-center justify-center pt-4">
                <LineStory
                  progress={progress}
                  className="h-full max-h-full w-full max-w-3xl"
                  label="One line drawing that turns from a consultation into a floor plan, a workshop and a delivery truck"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
