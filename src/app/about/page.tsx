import type { Metadata } from "next";
import { RetryImage } from "@/components/ui/retry-image";
import { ProjectGallery } from "@/components/ProjectGallery";
import { QuoteCTA } from "@/components/QuoteCTA";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = { title: "About | Design Excellence" };

// Company copy is the client's own, from the About page of their old site; trimmed, not rewritten.
const SUPPLY = [
  {
    name: "Office furniture",
    text: "Office, clerical, executive and airport gang chairs. Office tables, executive desks and conference tables.",
  },
  {
    name: "Partitions and storage",
    text: "Modular partitions, workstations and storage systems, in designs imported from China, Taiwan and Malaysia.",
  },
  {
    name: "Made to your specifications",
    text: "Our manufacturing plant builds furniture to your standards and measurements.",
  },
  {
    name: "Kitchens and wardrobes",
    text: "Modular kitchen and wardrobe cabinets, with a selection of finishes to choose from.",
  },
  {
    name: "COLORQUARTZ Surfaces",
    text: "Exclusive distributor of the U.S. brand, known for durable kitchen and vanity countertops.",
  },
  {
    name: "Roller blinds",
    text: "Roller blinds from the U.S. and Korea.",
  },
  {
    name: "CADD and project management",
    text: "CADD technicians plan the layout, and a dedicated project team keeps deliveries on time.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:px-6 md:py-20 lg:grid-cols-12 lg:items-center lg:gap-12">
        <Reveal className="lg:col-span-6">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">About Design Excellence</h1>
          <p className="mt-5 max-w-[40ch] text-xl leading-relaxed text-ink">
            Office furniture and home cabinets, supplied and installed across the Philippines since 2009.
          </p>
          <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-ink">
            Design Excellence Home &amp; Office System Co. furnishes offices for multinational companies and government
            agencies nationwide, and builds kitchens, wardrobes and vanities for homes. Our own plant makes furniture to
            your specifications, and our CADD technicians lay out the room before anything is built.
          </p>
        </Reveal>
        <Reveal className="lg:col-span-6" delay={0.1}>
          <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-surface">
            <RetryImage
              src="/projects/office/open-plan-office.jpg"
              alt="Open-plan office floor fitted out by Design Excellence"
              fill
              loading="eager"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </section>

      <section aria-labelledby="supply-heading" className="bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:px-6 md:py-20 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-4">
            <h2 id="supply-heading" className="text-3xl font-bold tracking-tight md:text-4xl">
              What we supply
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink">
              Our vision is to provide high quality products and excellent service, creating spaces that make work
              productive and home a pleasure.
            </p>
          </Reveal>
          <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-8">
            {SUPPLY.map((item, i) => (
              <li key={item.name}>
                <Reveal delay={i * 0.05}>
                  <h3 className="text-xl font-bold tracking-tight">{item.name}</h3>
                  <p className="mt-2 text-base leading-relaxed text-ink">{item.text}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="projects" aria-labelledby="projects-heading" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 md:px-6 md:py-20">
        <Reveal>
          <h2 id="projects-heading" className="text-3xl font-bold tracking-tight md:text-4xl">
            Accomplished projects
          </h2>
          <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-ink">
            Offices and homes we have furnished. Pick a photo to see it larger.
          </p>
        </Reveal>
        <div className="mt-8">
          <ProjectGallery />
        </div>
      </section>

      <QuoteCTA />
    </>
  );
}
