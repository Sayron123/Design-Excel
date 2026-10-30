"use client";

import { motion, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { StickyScroll, type StickyScrollItem } from "@/components/ui/sticky-scroll-reveal";

function StepPhoto({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-full w-full bg-border">
      <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
    </div>
  );
}

/**
 * A layout sheet that draws itself as the step is scrolled: walls first, then furniture,
 * then the dimension lines and figures. `progress` runs 0 → 1 across the step.
 */
function LayoutSheet({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const walls = useTransform(progress, [0, 0.35], reduce ? [1, 1] : [0, 1]);
  const furniture = useTransform(progress, [0.25, 0.65], reduce ? [1, 1] : [0, 1]);
  const dims = useTransform(progress, [0.55, 0.85], reduce ? [1, 1] : [0, 1]);
  const figures = useTransform(progress, [0.75, 0.9], reduce ? [1, 1] : [0, 1]);
  const line = { stroke: "white", fill: "none" } as const;

  return (
    <div className="flex h-full w-full items-center justify-center bg-primary p-8">
      <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label="AutoCAD-style drawing of a room layout with dimensions">
        <motion.rect x="60" y="40" width="280" height="200" {...line} strokeWidth="6" style={{ pathLength: walls }} />
        <motion.rect x="90" y="70" width="120" height="50" rx="4" {...line} strokeWidth="1.5" style={{ pathLength: furniture }} />
        <motion.rect x="230" y="70" width="80" height="50" rx="4" {...line} strokeWidth="1.5" style={{ pathLength: furniture }} />
        <motion.rect x="90" y="170" width="220" height="40" rx="4" {...line} strokeWidth="1.5" style={{ pathLength: furniture }} />
        {[110, 150, 190, 250, 290].map((x) => (
          <motion.circle key={x} cx={x} cy="140" r="8" {...line} strokeWidth="1.5" style={{ pathLength: furniture }} />
        ))}
        <motion.path d="M60 266 H340 M60 258 V274 M340 258 V274" {...line} strokeWidth="1.25" style={{ pathLength: dims }} />
        <motion.path d="M30 40 V240 M22 40 H38 M22 240 H38" {...line} strokeWidth="1.25" style={{ pathLength: dims }} />
        <motion.g style={{ opacity: figures }}>
          <text x="200" y="290" textAnchor="middle" fill="white" fontSize="15">
            7,000
          </text>
          <text x="18" y="145" textAnchor="middle" fill="white" fontSize="15" transform="rotate(-90 18 145)">
            5,000
          </text>
        </motion.g>
      </svg>
    </div>
  );
}

const STEPS: StickyScrollItem[] = [
  {
    title: "Consultation",
    description:
      "We talk through how the space is used, how many people it holds and what has to fit. Bring a floor plan or measurements if you have them.",
    content: <StepPhoto src="/process/consultation.jpg" alt="Office with glass partitions and mesh chairs" />,
  },
  {
    title: "AutoCAD layout",
    description:
      "We draw your space and the furniture in AutoCAD, so sizes, walkways and positions are agreed on paper before anything is made.",
    content: (progress) => <LayoutSheet progress={progress} />,
  },
  {
    title: "Manufacturing",
    description: "Cabinets and furniture are made to the approved layout, sizes and finishes.",
    content: <StepPhoto src="/process/desk-screens.jpg" alt="Desk screen panels in green, orange, blue and grey" />,
  },
  {
    title: "Delivery & install",
    description: "We deliver, assemble and install everything on site, in the positions shown on the layout.",
    content: <StepPhoto src="/products/workstations/1.jpg" alt="Installed workstation cluster with green desk screens" />,
  },
];

export function HowWeWork() {
  return (
    <section id="how-we-work" aria-labelledby="how-heading" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
        <Reveal>
          <h2 id="how-heading" className="text-3xl font-bold tracking-tight md:text-4xl">
            How we work
          </h2>
          <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-ink">
            Four stages, from the first conversation to furniture standing in your room.
          </p>
        </Reveal>
        <div className="mt-10 md:mt-14">
          <StickyScroll content={STEPS} />
        </div>
      </div>
    </section>
  );
}
