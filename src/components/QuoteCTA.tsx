import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ShowroomMap } from "@/components/ShowroomMap";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

export function QuoteCTA() {
  return (
    <section aria-labelledby="cta-heading" className="bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:px-6 md:py-20 lg:grid-cols-12 lg:items-center lg:gap-12">
        <Reveal className="lg:col-span-5">
          <h2 id="cta-heading" className="text-3xl font-bold tracking-tight md:text-5xl">
            Send us your floor plan
          </h2>
          <p className="mt-5 max-w-[40ch] text-lg leading-relaxed text-white/90">
            Tell us the room, the number of people and your deadline. We will come back with a layout and a quotation.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href="/quote"
              className="inline-flex h-14 items-center justify-center rounded-xl bg-accent px-8 text-lg font-semibold text-ink transition-colors hover:bg-white"
            >
              Start a quote
            </Link>
            <a href={PHONE_TEL} className="text-base text-white/90 underline underline-offset-4 hover:text-accent">
              Or call {PHONE_DISPLAY}
            </a>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={0.1}>
          <ShowroomMap />
        </Reveal>
      </div>
    </section>
  );
}
