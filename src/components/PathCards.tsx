import { RetryImage } from "@/components/ui/retry-image";
import Link from "next/link";
import { HoverCard } from "@/components/HoverCard";
import { Reveal } from "@/components/Reveal";
import { ArrowRight, buttonClass } from "@/components/ui/button";

const PATHS = [
  {
    href: "/products/cabinets",
    title: "Cabinets",
    body: "Set the size, doors and finish of a cabinet, then add it to your inquiry. Built to the measurements of your room.",
    action: "Build a cabinet",
    image: "/products/kitchen-cabinets/1.jpg",
    alt: "White modular kitchen with a timber breakfast bar",
  },
  {
    href: "/products#office-furniture",
    title: "Office Furniture",
    body: "Chairs, tables, workstations, partitions and reception areas for teams, meeting rooms and front desks.",
    action: "See office furniture",
    image: "/products/workstations/3.jpg",
    alt: "White bench workstation with blue screens",
  },
] as const;

export function PathCards() {
  return (
    <section id="products" aria-labelledby="paths-heading" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 md:px-6 md:py-20">
      <Reveal>
        <h2 id="paths-heading" className="text-3xl font-bold tracking-tight md:text-4xl">
          Two ways to start
        </h2>
      </Reveal>
      <div className="mt-8 grid gap-5 md:mt-12 md:grid-cols-2 md:gap-6">
        {PATHS.map((path, i) => (
          <Reveal key={path.href} delay={i * 0.08}>
            <HoverCard className="h-full rounded-xl bg-surface">
              <Link href={path.href} className="group flex h-full flex-col rounded-xl">
                <div className="relative aspect-[3/2] overflow-hidden rounded-t-xl bg-border">
                  <RetryImage
                    src={path.image}
                    alt={path.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <h3 className="text-2xl font-bold tracking-tight md:text-3xl">{path.title}</h3>
                  <p className="mt-3 max-w-[44ch] text-base leading-relaxed text-ink md:text-lg">{path.body}</p>
                  <span className={buttonClass("soft", "sm", "mt-6 self-start group-hover:bg-accent group-hover:text-ink")}>
                    {path.action}
                    <ArrowRight />
                  </span>
                </div>
              </Link>
            </HoverCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
