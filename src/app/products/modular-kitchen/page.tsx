import type { Metadata } from "next";
import Link from "next/link";
import { CabinetBuilder } from "@/components/CabinetBuilder";
import { Reveal } from "@/components/Reveal";
import { ArrowLeft, ArrowRight, buttonClass } from "@/components/ui/button";
import { RetryImage } from "@/components/ui/retry-image";
import { categoryHref, getCategory } from "@/lib/products";

export const metadata: Metadata = { title: "Build a cabinet | Design Excellence" };

// Finished kitchens and closets from the client's own photos, under the builder.
const MADE = ["kitchen-cabinets", "walk-in-closets"].flatMap((slug) => {
  const cat = getCategory(slug);
  return cat ? cat.images.slice(0, 2).map((img) => ({ ...img, slug, name: cat.name })) : [];
});

export default function BuilderPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-8 md:px-6 md:pb-20 md:pt-12">
        <Link href="/products" className={buttonClass("soft", "sm", "mb-8")}>
          <ArrowLeft />
          All products
        </Link>
        <Reveal>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Build a cabinet</h1>
          <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-ink">
            Choose a kitchen cabinet, wardrobe or walk-in closet, pick the finish and the width, and add it to your
            inquiry. The drawing follows every choice.
          </p>
        </Reveal>
        <div className="mt-8 md:mt-12">
          <CabinetBuilder />
        </div>
      </section>

      <section aria-labelledby="made-heading" className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
          <Reveal>
            <h2 id="made-heading" className="text-3xl font-bold tracking-tight md:text-4xl">
              Kitchens and closets we have made
            </h2>
          </Reveal>
          <ul className="mt-8 grid grid-cols-2 gap-3 md:mt-10 md:grid-cols-4 md:gap-5">
            {MADE.map((img, i) => (
              <li key={img.src}>
                <Reveal delay={i * 0.07}>
                  <Link href={categoryHref(img.slug)} className="group block">
                    <span className="relative block aspect-4/5 overflow-hidden rounded-xl bg-bg">
                      <RetryImage
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(min-width: 768px) 25vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </span>
                    <span className="mt-2.5 flex items-center gap-1.5 text-base font-semibold text-ink group-hover:text-accent-ink">
                      {img.name}
                      <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
