"use client";

import { AnimatePresence, motion } from "motion/react";
import { RetryImage } from "@/components/ui/retry-image";
import { useState } from "react";
import type { ProductImage } from "@/lib/products";

function Photo({ image, sizes, eager }: { image: ProductImage; sizes: string; eager?: boolean }) {
  return (
    <RetryImage
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      loading={eager ? "eager" : undefined}
      className={image.fit === "contain" ? "object-contain p-6 md:p-10" : "object-cover"}
    />
  );
}

/** One large photo with thumbnails underneath; picking a thumbnail swaps the large photo. */
export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const lead = images[active];

  return (
    <div>
      <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-surface">
        <AnimatePresence initial={false}>
          <motion.div
            key={lead.src}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Photo image={lead} sizes="(min-width: 1024px) 55vw, 100vw" eager={active === 0} />
          </motion.div>
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div role="group" aria-label={`${name} photos`} className="mt-3 grid grid-cols-3 gap-3">
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              aria-pressed={i === active}
              aria-label={`Show photo: ${image.alt}`}
              onClick={() => setActive(i)}
              className={`relative aspect-4/3 overflow-hidden rounded-lg bg-surface outline-offset-2 transition-[opacity,outline-color] duration-300 ${
                i === active ? "outline-3 outline-accent" : "opacity-70 outline-3 outline-transparent hover:opacity-100"
              }`}
            >
              <RetryImage
                src={image.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 18vw, 33vw"
                className={image.fit === "contain" ? "object-contain p-2" : "object-cover"}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
