"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const rise = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
} as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Parallax: the picture drifts slower than the page. Off for reduced motion.
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 90]);

  return (
    <section ref={ref} className="mx-auto max-w-6xl px-4 pb-12 pt-6 md:px-6 md:pb-20 md:pt-12">
      <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
        <motion.div
          className="lg:col-span-7"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.h1
            variants={rise}
            className="max-w-[13ch] md:max-w-none lg:max-w-[13ch] text-[2.375rem] leading-[1.05] font-bold tracking-[-0.02em] text-ink sm:text-5xl md:text-[4.25rem]"
          >
            Furniture built to your floor plan
          </motion.h1>
          <motion.p variants={rise} className="mt-6 max-w-[46ch] text-lg leading-relaxed text-ink md:mt-8 md:text-xl">
            Design Excellence makes custom cabinets and office furniture for corporate offices, banks, schools,
            hospitals and government, from first consultation and AutoCAD layout to delivery and install.
          </motion.p>
          <motion.div variants={rise} className="mt-8 flex flex-wrap gap-3 md:mt-10">
            <Link
              href="/products/cabinets"
              className="inline-flex h-12 items-center rounded-xl bg-primary px-6 text-base font-semibold text-white transition-colors hover:bg-ink"
            >
              Build a cabinet
            </Link>
            <Link
              href="/products/chairs"
              className="inline-flex h-12 items-center rounded-xl bg-border px-6 text-base font-semibold text-ink transition-colors hover:brightness-95"
            >
              Browse chairs
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-border md:aspect-video lg:aspect-4/5">
            <motion.div style={{ y }} className="absolute inset-x-0 top-[-12%] h-[124%]">
              <Image
                src="/products/partitions/3.jpg"
                alt="Open office divided by glass partitions, with desks and storage"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
