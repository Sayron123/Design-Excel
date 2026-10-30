"use client";

import { AnimatePresence, motion } from "motion/react";
import { RetryImage } from "@/components/ui/retry-image";
import { useEffect, useRef, useState } from "react";
import { PROJECT_GROUPS, type ProjectGroupId } from "@/lib/projects";

const ease = [0.22, 1, 0.36, 1] as const;

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true">
      <path
        d={dir === "prev" ? "M10 3L5 8l5 5" : "M6 3l5 5-5 5"}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Office / home switch over a photo grid; a photo opens full size in a dialog with previous and next. */
export function ProjectGallery() {
  const [groupId, setGroupId] = useState<ProjectGroupId>("office");
  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const group = PROJECT_GROUPS.find((g) => g.id === groupId)!;
  const images = group.images;

  // The native dialog handles focus, Escape and the backdrop; state only says which photo.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open !== null && !dialog.open) dialog.showModal();
    if (open === null && dialog.open) dialog.close();
  }, [open]);

  function step(by: number) {
    setOpen((i) => (i === null ? i : (i + by + images.length) % images.length));
  }

  return (
    <div>
      <div role="group" aria-label="Project type" className="inline-flex gap-1 rounded-xl bg-primary/10 p-1">
        {PROJECT_GROUPS.map((g) => {
          const active = g.id === groupId;
          return (
            <button
              key={g.id}
              type="button"
              aria-pressed={active}
              onClick={() => setGroupId(g.id)}
              className={`h-11 rounded-lg px-4 text-base font-semibold transition-colors duration-200 sm:px-5 ${
                active ? "bg-accent text-ink" : "text-primary hover:bg-accent/20 hover:text-ink"
              }`}
            >
              {g.name}
              <span className="hidden sm:inline"> ({g.images.length})</span>
            </button>
          );
        })}
      </div>
      <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-ink">{group.summary}</p>

      <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {images.map((image, i) => (
          <motion.li
            key={image.src}
            className={i === 0 ? "col-span-2 row-span-2" : ""}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease, delay: Math.min(i, 8) * 0.04 }}
          >
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`View larger: ${image.alt}`}
              className="group relative block aspect-4/3 w-full overflow-hidden rounded-xl bg-surface"
            >
              <RetryImage
                src={image.src}
                alt=""
                fill
                sizes={i === 0 ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 50vw"}
                loading={i === 0 ? "eager" : undefined}
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </button>
          </motion.li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Project photo"
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === e.currentTarget && setOpen(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") step(-1);
          if (e.key === "ArrowRight") step(1);
        }}
        className="m-auto max-h-none max-w-none bg-transparent p-4 backdrop:bg-[rgb(28_31_38/0.92)]"
      >
        {/* Only the photo swaps; the controls stay mounted so keyboard focus survives previous / next. */}
        {open !== null && (
          <figure className="w-[min(92vw,1100px)]">
            <div className="relative h-[min(72svh,800px)] w-full">
              <AnimatePresence initial={false}>
                <motion.div
                  key={images[open].src}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease }}
                >
                  <RetryImage src={images[open].src} alt={images[open].alt} fill sizes="92vw" className="object-contain" />
                </motion.div>
              </AnimatePresence>
            </div>
            <figcaption className="mt-4 flex items-center justify-between gap-4 text-white">
              <span className="text-base">
                {images[open].alt}
                <span className="ml-2 text-white/70">
                  {open + 1} of {images.length}
                </span>
              </span>
              <span className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                  className="grid size-11 place-items-center rounded-xl bg-white/10 transition-colors hover:bg-white/20"
                >
                  <Arrow dir="prev" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next photo"
                  className="grid size-11 place-items-center rounded-xl bg-white/10 transition-colors hover:bg-white/20"
                >
                  <Arrow dir="next" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(null)}
                  className="h-11 rounded-xl bg-white px-4 font-semibold text-primary transition-colors hover:bg-bg"
                >
                  Close
                </button>
              </span>
            </figcaption>
          </figure>
        )}
      </dialog>
    </div>
  );
}
