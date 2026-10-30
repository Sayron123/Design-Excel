"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

// Lifts 4px under the pointer and casts a lift shadow only while hovered; rests flat. taste-skill-ignore (brief asks for hover lift + shadow)
export function HoverCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ y: 0, boxShadow: "0 0 0 0 rgba(28,31,38,0)" }}
      whileHover={{ y: -4, boxShadow: "0 18px 40px -18px rgba(28,31,38,0.35)" }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
