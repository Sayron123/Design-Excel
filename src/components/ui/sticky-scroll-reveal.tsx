"use client";

// Adapted from Aceternity UI "Sticky Scroll Reveal".
// Changes: follows page scroll instead of an inner scroll box (the step crossing the middle of the
// viewport is active), flat token colours instead of gradients, inactive steps stay readable
// (muted ink), and on phones each visual sits inline under its step.

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type StickyScrollItem = {
  title: string;
  description: string;
  content: ReactNode;
};

function Step({
  item,
  active,
  onActive,
}: {
  item: StickyScrollItem;
  active: boolean;
  onActive: () => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  // A thin band across the middle of the viewport decides which step is current.
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (inView) onActive();
  }, [inView, onActive]);

  return (
    <li ref={ref} data-active={active} className="group py-8 first:pt-0 lg:flex lg:min-h-[44vh] lg:flex-col lg:justify-center lg:py-10">
      <h3 className="text-2xl font-bold tracking-tight text-ink transition-colors duration-300 md:text-3xl lg:text-muted lg:group-data-[active=true]:text-ink">
        {item.title}
      </h3>
      <p className="mt-4 max-w-[44ch] text-lg leading-relaxed text-ink transition-colors duration-300 lg:text-muted lg:group-data-[active=true]:text-ink">
        {item.description}
      </p>
      <div className="mt-6 overflow-hidden rounded-xl lg:hidden">{item.content}</div>
    </li>
  );
}

export function StickyScroll({ content }: { content: StickyScrollItem[] }) {
  const [activeCard, setActiveCard] = useState(0);

  return (
    <div className="relative grid lg:grid-cols-12 lg:gap-12">
      <ol className="lg:col-span-6">
        {content.map((item, index) => (
          <Step key={item.title} item={item} active={activeCard === index} onActive={() => setActiveCard(index)} />
        ))}
      </ol>

      <div className="hidden lg:col-span-6 lg:block">
        <div className="sticky top-[calc(50vh-12.5rem)] aspect-4/3 overflow-hidden rounded-xl bg-surface">
          <AnimatePresence initial={false}>
            <motion.div
              key={activeCard}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {content[activeCard].content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
